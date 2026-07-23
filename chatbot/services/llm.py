# ============================================================
# llm.py
# ------------------------------------------------------------
# Fabrica del LLM. Devuelve el modelo configurado segun
# settings.LLM_PROVIDER:  openai | gemini | local (Ollama).
# Esta parametrizado para cambiar de proveedor sin tocar el
# resto del codigo.
# ============================================================

from langchain_openai import ChatOpenAI

from ..config import settings


def build_llm():
    """
    Construye y devuelve el LLM correspondiente al proveedor
    configurado en .env (settings.LLM_PROVIDER).
    """
    provider = settings.LLM_PROVIDER.lower()

    if provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise RuntimeError(
                "LLM_PROVIDER=openai pero OPENAI_API_KEY esta vacio en .env"
            )
        return ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model=settings.OPENAI_MODEL_NAME,
            temperature=0.2,   # Baja temperatura = respuestas mas factuales
        )

    if provider == "gemini":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
        except ImportError as exc:
            raise RuntimeError(
                "Para Gemini instala: pip install langchain-google-genai"
            ) from exc
        if not settings.GOOGLE_API_KEY:
            raise RuntimeError(
                "LLM_PROVIDER=gemini pero GOOGLE_API_KEY esta vacio en .env"
            )
        return ChatGoogleGenerativeAI(
            google_api_key=settings.GOOGLE_API_KEY,
            model=settings.GEMINI_MODEL_NAME,
            temperature=0.2,
        )

    if provider == "local":
        # Ollama ofrece un endpoint OpenAI-compatible en http://localhost:11434/v1
        return ChatOpenAI(
            base_url=f"{settings.OLLAMA_BASE_URL}/v1",
            api_key="ollama",           # Dummy, Ollama no valida la key
            model=settings.OLLAMA_MODEL_NAME,
            temperature=0.2,
        )

    raise ValueError(
        f"LLM_PROVIDER no reconocido: {provider}. "
        "Valores validos: openai | gemini | local"
    )
