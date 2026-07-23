# ============================================================
# main.py
# ------------------------------------------------------------
# Tarea 3: API REST con FastAPI.
#
# Endpoints:
#   GET  /            -> healthcheck
#   GET  /health      -> estado del servicio
#   POST /chat        -> recibe {"question": "..."} y responde con RAG
#   POST /index       -> (administracion) reindexa un manual enviado
#
# Ejecutar:
#   uvicorn chatbot.main:app --reload
# ============================================================

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import settings
from .services.rag import answer_question, reset_rag_cache
from .services.indexing import index_documents

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan: auto-indexa el manual al iniciar el servidor
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Contexto de vida de la aplicacion.
    Al INICIAR: carga y indexa el manual de usuario si aun no existe
    el vectorstore en disco. El manual se recarga SOLO al reiniciar el servidor.
    Al CERRAR: nada especial (cleanup futuro si se necesita).
    """
    manual_path = settings.MANUAL_PATH

    if not os.path.isfile(manual_path):
        logger.warning(
            "Manual no encontrado en %s. "
            "El chatbot no tendra conocimiento indexado.",
            manual_path,
        )
    else:
        # Verificar si ChromaDB ya tiene documentos indexados
        chroma_dir = Path(settings.CHROMA_PERSIST_DIR)
        needs_indexing = not chroma_dir.exists() or not any(chroma_dir.iterdir())

        if needs_indexing:
            logger.info("Indexando manual por primera vez: %s", manual_path)
            try:
                n = index_documents(manual_path, reset=False)
                logger.info("Indexacion completada: %d fragmentos.", n)
            except Exception as exc:  # noqa: BLE001
                logger.exception("Error al indexar el manual al iniciar: %s", exc)
        else:
            logger.info(
                "Vectorstore existente detectado en %s. "
                "Omitiendo indexacion. Para reindexar, reinicia con "
                "chroma_db vacio o usa POST /index.",
                chroma_dir,
            )

    yield  # <-- La app esta corriendo


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SysSupplementsGym - Chatbot RAG",
    description=(
        "Asistente de atencion al cliente y soporte tecnico basado en RAG. "
        "Responde unicamente a partir del manual de usuario indexado."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS: permitir llamadas desde el frontend Angular (dev y prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Esquemas de entrada/salida (Pydantic)
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    """Pregunta del usuario."""
    question: str = Field(..., min_length=3, description="Pregunta del cliente")


class SourceItem(BaseModel):
    source: str | None = None
    page: int | None = None
    snippet: str


class ChatResponse(BaseModel):
    """Respuesta del chatbot con las fuentes usadas."""
    answer: str
    sources: list[SourceItem]


class IndexRequest(BaseModel):
    """Ruta a un archivo .pdf/.txt o a un directorio para (re)indexar."""
    source: str
    reset: bool = False


class IndexResponse(BaseModel):
    indexed_chunks: int


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def root() -> dict:
    """Healthcheck rapido."""
    return {"service": "chatbot-rag", "status": "running"}


@app.get("/health")
def health() -> dict:
    """Verifica que la configuracion minima este presente."""
    provider = settings.LLM_PROVIDER
    issues = []

    if provider == "openai" and not settings.OPENAI_API_KEY:
        issues.append("OPENAI_API_KEY vacia")
    if provider == "gemini" and not settings.GOOGLE_API_KEY:
        issues.append("GOOGLE_API_KEY vacia")
    if provider == "local":
        if not os.path.isdir(settings.CHROMA_PERSIST_DIR):
            issues.append(
                f"ChromaDB no inicializada en {settings.CHROMA_PERSIST_DIR}"
            )

    if issues:
        raise HTTPException(status_code=500, detail={"ok": False, "issues": issues})

    return {"ok": True, "llm_provider": provider}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    """
    Endpoint principal del chatbot.
    Recibe la pregunta del cliente y devuelve la respuesta generada
    por el flujo RAG junto con las fuentes (fragmentos) usadas.
    """
    try:
        result = answer_question(req.question)
    except ConnectionError as exc:
        logger.error("Error de conexion con el LLM: %s", exc)
        raise HTTPException(
            status_code=503,
            detail=(
                "El servicio de IA no esta disponible en este momento. "
                "Verifica que el proveedor configurado este activo "
                "(ej: Ollama ejecutandose en localhost:11434)."
            ),
        ) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error inesperado en /chat")
        raise HTTPException(
            status_code=500,
            detail="Error interno al procesar la pregunta. Intenta de nuevo.",
        ) from exc

    return ChatResponse(
        answer=result["answer"],
        sources=[SourceItem(**s) for s in result["sources"]],
    )


@app.post("/index", response_model=IndexResponse)
def index_endpoint(req: IndexRequest) -> IndexResponse:
    """
    Endpoint administrativo para indexar o reindexar manuales.
    En produccion conviene protegerlo con autenticacion/roles.
    """
    path = Path(req.source)
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Ruta no encontrada: {req.source}"
        )
    try:
        n = index_documents(req.source, reset=req.reset)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    # Invalidar cache RAG para que se recargue el vectorstore
    reset_rag_cache()

    return IndexResponse(indexed_chunks=n)
