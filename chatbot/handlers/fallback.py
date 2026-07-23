# ============================================================
# fallback.py
# ------------------------------------------------------------
# Sistema de busqueda por palabras clave como fallback cuando
# no hay LLM disponible. Carga el manual una vez al iniciar
# y busca secciones relevantes usando similitud basada en
# frecuencia de palabras (TF simple) y coincidencia de terminos.
#
# Este modulo NO reemplaza el RAG con LLM; es un respaldo
# que permite al chatbot responder incluso sin conexion a
# un modelo de lenguaje.
# ============================================================

from __future__ import annotations

import logging
import re
from pathlib import Path

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Cache del manual cargado (se carga una sola vez)
# ---------------------------------------------------------------------------
_manual_sections: list[dict] = []
_manual_loaded = False


def _load_manual(manual_path: str) -> list[dict]:
    """
    Carga el manual de usuario y lo divide en secciones para busqueda.

    Cada seccion tiene:
        - title: titulo de la seccion (ej: "2. COMO CREAR UNA CUENTA")
        - content: contenido completo de la seccion
        - keywords: conjunto de palabras clave normalizadas

    Retorna:
        Lista de diccionarios con las secciones del manual.
    """
    global _manual_sections, _manual_loaded

    if _manual_loaded:
        return _manual_sections

    path = Path(manual_path)
    if not path.exists():
        logger.error("Manual no encontrado: %s", manual_path)
        return []

    try:
        text = path.read_text(encoding="utf-8")
    except Exception as exc:  # noqa: BLE001
        logger.error("Error al leer el manual: %s", exc)
        return []

    # Dividir por separadores de seccion (lineas con guiones o numeradas)
    sections = []
    current_title = "Introduccion"
    current_content = []

    # Patron para detectar titulos principales del manual:
    # Lineas que empiezan con numero + punto + ESPACIO + TEXTO EN MAYUSCULAS
    # Ejemplos: "1. INTRODUCCION", "2. COMO CREAR UNA CUENTA"
    # NO detecta pasos internos como "1. Ingresa a..." (tienen minusculas)
    section_header_pattern = re.compile(r"^\d+\.\s+[A-ZÁÉÍÓÚÑÜ\s]+$")

    for line in text.splitlines():
        stripped = line.strip()

        # Detectar titulos de seccion principal (TODO EN MAYUSCULAS)
        if section_header_pattern.match(stripped):
            # Guardar seccion anterior
            if current_content:
                content_text = "\n".join(current_content).strip()
                if content_text:
                    sections.append({
                        "title": current_title,
                        "content": content_text,
                        "keywords": _extract_keywords(
                            current_title + " " + content_text
                        ),
                    })
            current_title = stripped
            current_content = []
        elif stripped.startswith("#"):
            # Ignorar lineas de comentario
            continue
        elif re.match(r"^-{3,}$", stripped):
            # Separador de seccion
            continue
        else:
            current_content.append(line)

    # Guardar ultima seccion
    if current_content:
        content_text = "\n".join(current_content).strip()
        if content_text:
            sections.append({
                "title": current_title,
                "content": content_text,
                "keywords": _extract_keywords(current_title + " " + content_text),
            })

    _manual_sections = sections
    _manual_loaded = True
    logger.info("Manual cargado: %d secciones.", len(sections))
    return sections


def _extract_keywords(text: str) -> set[str]:
    """
    Extrae palabras clave de un texto para busqueda por palabras clave.
    Normaliza a minusculas y elimina palabras vacias (stopwords basicas).
    """
    # Stopwords en espanol e ingles (lista basica)
    stopwords = {
        "de", "la", "el", "en", "y", "a", "los", "del", "las", "un", "por",
        "con", "no", "una", "su", "para", "es", "al", "que", "lo", "como",
        "mas", "pero", "sus", "le", "ya", "o", "este", "si", "porque",
        "esta", "son", "entre", "cuando", "muy", "sin", "sobre", "tambien",
        "me", "hasta", "hay", "donde", "quien", "desde", "todo", "nos",
        "durante", "todos", "uno", "les", "ni", "contra", "otros", "ese",
        "eso", "ante", "ellos", "e", "esto", "mi", "antes", "algunos",
        "que", "unos", "yo", "otro", "otras", "otra", "el", "mismo",
        "the", "is", "at", "which", "on", "a", "an", "and", "or", "but",
        "in", "with", "to", "for", "of", "not", "no", "can", "had", "has",
        "have", "will", "do", "does", "it", "its", "this", "that", "these",
        "those", "be", "are", "was", "were", "been", "being", "from", "by",
        "as", "if", "than", "so", "but", "too", "very", "just", "about",
    }

    # Tokenizar: minusculas, solo alphanumeric, eliminar stopwords
    words = re.findall(r"[a-záéíóúñü0-9]+", text.lower())
    return {w for w in words if w not in stopwords and len(w) > 2}


def _compute_relevance(question_keywords: set[str], section: dict) -> float:
    """
    Calcula un puntaje de relevancia simple basado en coincidencia
    de palabras clave entre la pregunta y la seccion.

    Retorna:
        Puntaje float (mayor = mas relevante).
    """
    section_keywords = section["keywords"]
    if not question_keywords or not section_keywords:
        return 0.0

    # Interseccion de keywords
    intersection = question_keywords & section_keywords
    # Jaccard simple: |interseccion| / |union|
    union = question_keywords | section_keywords
    if not union:
        return 0.0

    return len(intersection) / len(union)


def search_manual(question: str, manual_path: str, top_k: int = 3) -> list[dict]:
    """
    Busca secciones relevantes del manual usando palabras clave.

    Parametros:
        question    : pregunta del usuario
        manual_path : ruta al archivo del manual
        top_k       : numero maximo de secciones a devolver

    Retorna:
        Lista de dicts con:
            - source: titulo de la seccion
            - snippet: contenido de la seccion (recortado si es largo)
            - score: puntaje de relevancia (0-1)
    """
    sections = _load_manual(manual_path)
    if not sections:
        return []

    question_keywords = _extract_keywords(question)

    # Calcular relevancia para cada seccion
    scored = []
    for section in sections:
        score = _compute_relevance(question_keywords, section)
        if score > 0:
            scored.append({
                "source": section["title"],
                "snippet": section["content"][:500] + (
                    "..." if len(section["content"]) > 500 else ""
                ),
                "score": round(score, 4),
            })

    # Ordenar por relevancia (mayor primero)
    scored.sort(key=lambda x: x["score"], reverse=True)

    return scored[:top_k]


def generate_fallback_answer(
    question: str,
    manual_path: str,
    not_found_message: str = (
        "Lo siento, esa informacion no se encuentra en el manual del sistema."
    ),
) -> dict:
    """
    Genera una respuesta basada en busqueda por palabras clave.
    Se usa cuando no hay LLM disponible.

    Parametros:
        question          : pregunta del usuario
        manual_path       : ruta al archivo del manual
        not_found_message : mensaje cuando no se encuentra informacion

    Retorna:
        dict con:
            - answer: respuesta generada
            - sources: fragmentos usados como contexto
    """
    results = search_manual(question, manual_path)

    if not results:
        return {
            "answer": not_found_message,
            "sources": [],
        }

    # Construir respuesta a partir de las secciones encontradas
    answer_parts = []
    sources = []

    for r in results:
        answer_parts.append(f"**{r['source']}**\n{r['snippet']}")
        sources.append({
            "source": r["source"],
            "page": None,
            "snippet": r["snippet"],
        })

    answer = (
        "Encontre la siguiente informacion en el manual:\n\n"
        + "\n\n---\n\n".join(answer_parts)
    )

    return {
        "answer": answer,
        "sources": sources,
    }


def reload_manual(manual_path: str) -> int:
    """
    Fuerza la recarga del manual (util despues de actualizar el archivo).
    Retorna el numero de secciones cargadas.
    """
    global _manual_loaded, _manual_sections
    _manual_loaded = False
    _manual_sections = []
    sections = _load_manual(manual_path)
    return len(sections)
