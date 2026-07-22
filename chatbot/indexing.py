# ============================================================
# indexing.py
# ------------------------------------------------------------
# Tarea 1: Cargar un manual de usuario (TXT o PDF) y convertirlo
# en embeddings almacenados en ChromaDB (base vectorial local).
#
# Uso:
#   python -m chatbot.indexing --source ./manuals/manual.pdf
#   python -m chatbot.indexing --source ./manuals/manual.txt
# ============================================================

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    DirectoryLoader,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Importa la configuracion y el constructor de embeddings definidos en el paquete
from .config import settings
from .embeddings import build_embeddings
from .vectorstore import get_vectorstore


# ---------------------------------------------------------------------------
# 1. Carga de documentos
# ---------------------------------------------------------------------------
def load_documents(source: str) -> list:
    """
    Carga uno o varios documentos desde una ruta.

    - Si `source` es un archivo .pdf  -> usa PyPDFLoader
    - Si `source` es un archivo .txt  -> usa TextLoader
    - Si `source` es un directorio     -> carga todos los .pdf y .txt dentro
    """
    path = Path(source)

    if not path.exists():
        raise FileNotFoundError(f"La ruta indicada no existe: {source}")

    # Caso directorio: cargar todos los documentos soportados dentro
    if path.is_dir():
        docs = []
        for pattern, loader_cls in (("*.pdf", PyPDFLoader), ("*.txt", TextLoader)):
            dir_loader = DirectoryLoader(
                str(path),
                glob=pattern,
                loader_cls=loader_cls,
                show_progress=True,
            )
            docs.extend(dir_loader.load())
        if not docs:
            raise ValueError(f"No se encontraron .pdf ni .txt en: {source}")
        return docs

    # Caso archivo unico
    if path.suffix.lower() == ".pdf":
        loader = PyPDFLoader(str(path))
    elif path.suffix.lower() == ".txt":
        loader = TextLoader(str(path), encoding="utf-8")
    else:
        raise ValueError(
            f"Formato no soportado: {path.suffix}. Solo .pdf y .txt"
        )

    return loader.load()


# ---------------------------------------------------------------------------
# 2. Division en chunks (fragmentos) manejables para el retriever
# ---------------------------------------------------------------------------
def split_documents(docs: list) -> list:
    """
    Divide cada documento en fragmentos (chunks) solapados.
    Esto mejora la recuperacion porque el contexto relevante suele
    caber en un fragmento de tamanho fijo en lugar de un documento entero.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        # Separadores jerarquicos: intenta cortar por parrafo, frase, palabra...
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_documents(docs)


# ---------------------------------------------------------------------------
# 3. Embebido (indexado) en ChromaDB
# ---------------------------------------------------------------------------
def index_documents(source: str, reset: bool = False) -> int:
    """
    Punto de entrada principal: carga -> divide -> embebe -> guarda en ChromaDB.

    Parametros:
        source : ruta a un archivo .pdf/.txt o a un directorio con manuales.
        reset  : si True, borra la coleccion antes de indexar (reindexado limpio).

    Retorna:
        Numero de fragmentos indexados.
    """
    print(f"[indexing] Cargando documentos desde: {source}")
    docs = load_documents(source)
    print(f"[indexing] Documentos cargados: {len(docs)}")

    print("[indexing] Dividiendo en chunks...")
    chunks = split_documents(docs)
    print(f"[indexing] Chunks generados: {len(chunks)}")

    # Embeddings (modelo local por defecto) y vectorstore (ChromaDB)
    embeddings = build_embeddings()
    vectorstore = get_vectorstore(embeddings, reset=reset)

    print("[indexing] Generando embeddings y persistiendo en ChromaDB...")
    # from_documents calcula los embeddings y los guarda en disco
    vectorstore.add_documents(chunks)
    # Chroma persiste automaticamente en persist_directory; no requiere .persist()

    print(f"[indexing] OK - {len(chunks)} fragmentos indexados correctamente.")
    return len(chunks)


# ---------------------------------------------------------------------------
# CLI entry point:  python -m chatbot.indexing --source ...
# ---------------------------------------------------------------------------
def _cli() -> None:
    parser = argparse.ArgumentParser(
        description="Indexa manuales de usuario en ChromaDB para el chatbot RAG."
    )
    parser.add_argument(
        "--source",
        required=True,
        help="Ruta a un archivo .pdf/.txt o a un directorio con manuales.",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Borra la coleccion antes de indexar (reindexado limpio).",
    )
    args = parser.parse_args()

    try:
        index_documents(args.source, reset=args.reset)
    except Exception as exc:  # noqa: BLE001
        print(f"[indexing] ERROR: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    _cli()
