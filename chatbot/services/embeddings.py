# ============================================================
# embeddings.py
# ------------------------------------------------------------
# Construye el modelo de embeddings configurado.
# Por defecto usa sentence-transformers (local, sin API key),
# pero se deja preparado para usar embeddings de OpenAI si se
# quisiera en el futuro.
# ============================================================

from langchain_huggingface import HuggingFaceEmbeddings

from ..config import settings


def build_embeddings():
    """
    Devuelve una instancia del modelo de embeddings.

    Estrategia por defecto:
        HuggingFaceEmbeddings con 'all-MiniLM-L6-v2' (384 dim).
        - Se descarga la primera vez desde HuggingFace Hub.
        - Corre 100% en local (CPU), sin enviar datos a terceros.
        - Ideal para un manual de usuario pequeno/mediano.
    """
    return HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},   # Forzamos CPU para portabilidad
        encode_kwargs={"normalize_embeddings": True},
    )
