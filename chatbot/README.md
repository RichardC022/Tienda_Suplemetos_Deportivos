# Chatbot RAG - SysSuplementsGym

Chatbot de atencion al cliente y soporte tecnico que actua como **manual de usuario
interactivo**. Usa **RAG (Retrieval-Augmented Generation)** para responder a los
clientes basandose estrictamente en los manuales indexados (no inventa informacion).

## Arquitectura

```
                +-----------------------+
   question --> | FastAPI  POST /chat   |
                +-----------+-----------+
                            |
                            v
                +-----------------------+
                | rag.answer_question() |
                +-----------+-----------+
                            |
            +---------------+---------------+
            |                               |
            v                               v
   +----------------+               +--------------+
   | ChromaDB       |  k vecinos    | LLM (OpenAI  |
   | (embeddings)   |  semanticos   |  / Gemini    |
   +----------------+               |  / Ollama)   |
                                     +--------------+
```

- **Framework de IA:** LangChain (orquesta retriever + prompt + LLM).
- **Base de datos vectorial:** ChromaDB (local, open source, persisted en disco).
- **Embeddings:** `sentence-transformers/all-MiniLM-L6-v2` (local, sin API key).
- **LLM:** parametrizado en `.env` (OpenAI, Gemini o modelo local via Ollama).
- **Backend:** FastAPI con endpoint `POST /chat`.

## Estructura

```
chatbot/
|- __init__.py          # Paquete
|- config.py           # Lee .env y expone settings
|- embeddings.py        # Constructor del modelo de embeddings
|- vectorstore.py       # Abstraccion de ChromaDB + retriever
|- llm.py               # Fabrica del LLM (openai|gemini|local)
|- indexing.py          # Carga de PDF/TXT -> chunks -> ChromaDB  (Tarea 1)
|- rag.py               # Cadena RAG (retriever + prompt + LLM)   (Tarea 2)
|- main.py              # API FastAPI con /chat                   (Tarea 3)
|- requirements.txt                                     (Tarea 4)
|- .env.example          # Plantilla de configuracion
|- manuals/
   |- manual_usuario.txt # Manual de ejemplo
```

## Instalacion

1. **Python 3.10+** y **Entorno virtual** (recomendado):

   ```powershell
   cd C:\Users\gynay\IdeaProjects\Tienda_Suplemetos_Deportivos\chatbot
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1   # Windows PowerShell
   # source .venv/bin/activate    # Linux / macOS
   ```

2. **Instalar dependencias:**

   ```powershell
   pip install -r requirements.txt
   ```

   > Si vas a usar **Gemini**, instala ademas:
   > `pip install langchain-google-genai`

3. **Configurar el entorno** - copiar la plantilla y editar:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

   Define `LLM_PROVIDER` (`openai`, `gemini` o `local`) y las credenciales
   correspondientes. Para el modelo local revisa [Ollama](https://ollama.com).

## Indexar el manual (crear los embeddings)

Antes de usar el chatbot, hay que indexar el manual por primera vez:

```powershell
python -m chatbot.indexing --source ./manuals/manual_usuario.txt
```

Para reindexar desde cero (borra los embeddings previos):

```powershell
python -m chatbot.indexing --source ./manuals --reset
```

Esto genera la carpeta `./data/chroma_db/` con los embeddings persistentes.

## Ejecutar la API

```powershell
uvicorn chatbot.main:app --reload --port 8000
```

Documentacion interactiva disponible en:
- http://127.0.0.1:8000/docs (Swagger)
- http://127.0.0.1:8000/redoc (ReDoc)

## Probar el endpoint /chat

Con `curl` (PowerShell):

```powershell
curl.exe -X POST http://127.0.0.1:8000/chat `
  -H "Content-Type: application/json" `
  -d '{\"question\":\"Como hago una compra?\"}'
```

Respuesta de ejemplo:

```json
{
  "answer": "Para realizar una compra: 1) Inicia sesion... ...",
  "sources": [
    {
      "source": "manuals/manual_usuario.txt",
      "page": null,
      "snippet": "3. COMO REALIZAR UNA COMPROMA..."
    }
  ]
}
```

## Cambiar de proveedor de LLM sin tocar codigo

Edita `.env`:

```
# OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-....
OPENAI_MODEL_NAME=gpt-4o-mini

# Gemini
LLM_PROVIDER=gemini
GOOGLE_API_KEY=...
GEMINI_MODEL_NAME=gemini-1.5-flash

# Local (Ollama)  -- sin costos, sin API
LLM_PROVIDER=local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL_NAME=llama3
```

Reinicia el servidor. No hay que cambiar codigo.

## Integracion con el backend Spring Boot existente

El microservicio Python es independiente. El backend Java puede invocarlo
como servicio interno; por ejemplo, una ruta proxy en Spring:

```
POST /api/chatbot/chat  -->  reenvia a http://localhost:8000/chat
```

## Notas de seguridad

- El endpoint `POST /index` es administrativo; en produccion protegelo con
  autenticacion/roles.
- Nunca subas el archivo `.env` a git (esta en `.gitignore` del repo).
- Las respuestas estan acotadas al manual indexado: si falta topico, el bot
  remitira a soporte humano en lugar de inventar.
