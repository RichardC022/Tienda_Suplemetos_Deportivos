# ============================================================
# Configuracion central del chatbot.
# Carga las variables desde .env y expone un unico objeto settings.
# ============================================================

import os
from pathlib import Path
from dotenv import load_dotenv

# Carga las variables del archivo .env (si existe)
load_dotenv()


class Settings:
    """Contenedor simple de configuracion leida del entorno."""

    # --- Proveedor del LLM ---
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "local")

    # --- OpenAI ---
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL_NAME: str = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")

    # --- Gemini ---
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash")

    # --- Ollama (local) ---
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL_NAME: str = os.getenv("OLLAMA_MODEL_NAME", "llama3")

    # --- Embeddings ---
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")

    # --- ChromaDB ---
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./data/chroma_db")
    CHROMA_COLLECTION_NAME: str = os.getenv(
        "CHROMA_COLLECTION_NAME", "manual_usuario"
    )

    # --- RAG ---
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "800"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "100"))
    RETRIEVER_K: int = int(os.getenv("RETRIEVER_K", "4"))

    # --- Manual de usuario (ruta relativa al paquete chatbot) ---
    # Se resuelve automaticamente相对于 a la ubicacion de config.py
    BASE_DIR: Path = Path(__file__).resolve().parent
    MANUAL_PATH: str = str(BASE_DIR / "manuals" / "manual_usuario.txt")


# Instancia singleton importada por el resto del modulo
settings = Settings()
