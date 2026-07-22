# ============================================================
# vectorstore.py
# ------------------------------------------------------------
# Abstrae el acceso a ChromaDB. Proporciona:
#   - get_vectorstore(): abre (o crea) el vectorstore persistente.
#   - get_retriever()  : devuelve un retriever para usar en RAG.
# ============================================================

from langchain_chroma import Chroma

from .config import settings


def get_vectorstore(embeddings, reset: bool = False) -> Chroma:
    """
    Abre la coleccion persistente de ChromaDB en disco.
    Si reset=True, borra la coleccion antes de devolverla (reindexado limpio).
    """
    if reset:
        Chroma(
            collection_name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR,
        ).delete_collection()

    return Chroma(
        collection_name=settings.CHROMA_COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=settings.CHROMA_PERSIST_DIR,
    )


def get_retriever(embeddings, k: int | None = None):
    """
    Devuelve un retriever configurado para buscar los k fragmentos
    mas semanticamente similares a la pregunta del usuario.
    Busca por similitud coseno (por defecto en ChromaDB).
    """
    vs = get_vectorstore(embeddings)
    return vs.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k or settings.RETRIEVER_K},
    )
