# SysSupplementsGym

## Descripcion

SysSupplementsGym es una tienda en linea de suplementos deportivos con arquitectura de microservicios. El sistema permite a los clientes explorar el catalogo, agregar productos al carrito y realizar compras online, mientras que los administradores gestionan productos, categorias, inventario, ventas y envios desde un panel de administracion. Incluye un chatbot con RAG (Retrieval-Augmented Generation) para responder preguntas frecuentes basado en un manual de usuario.

## Arquitectura del Sistema

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   Frontend   │───>│     Backend      │───>│    MySQL     │
│   Angular    │    │  Spring Boot     │    │   (3306)     │
│   (4200)     │<───│  (8081)          │<───│              │
└──────────────┘    └──────────────────┘    └──────────────┘
       │
       │           ┌──────────────────┐
       └──────────>│    Chatbot       │
                   │    FastAPI       │
                   │    (8000)        │
                   └──────────────────┘
```

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|------------|---------|
| Frontend | Angular | 22 |
| UI Framework | Bootstrap | 5.3 |
| Generacion de PDF | jsPDF | 4.2 |
| Backend | Spring Boot | 4.1 |
| Lenguaje Backend | Java | 21 |
| ORM | Spring Data JPA / Hibernate | - |
| Seguridad | Spring Security | - |
| Base de datos | MySQL | - |
| Chatbot API | FastAPI | 0.111 |
| LLM Orchestration | LangChain | >= 1.3 |
| Vector Store | ChromaDB | >= 1.5 |
| Embeddings | sentence-transformers | >= 3.0 |

## Estructura del Proyecto

```
├── frontend/                  # Angular 22 SPA
│   └── src/app/
│       ├── components/        # Componentes UI
│       │   ├── catalogo/      # Catalogo de productos
│       │   ├── carrito/       # Carrito de compras
│       │   ├── checkout/      # Pago y checkout
│       │   ├── mis-compras/   # Historial de compras del cliente
│       │   ├── login/         # Inicio de sesion
│       │   ├── registro/      # Registro de usuarios
│       │   ├── chatbot/       # Widget de chatbot
│       │   ├── layout/        # Navbar y footer
│       │   └── admin/         # Panel de administracion
│       ├── services/          # Servicios HTTP
│       ├── models/            # Interfaces y enums TypeScript
│       ├── core/              # Guards e interceptores JWT
│       └── app.routes.ts      # Definicion de rutas
│
├── SysSupplementsGym/         # Spring Boot Backend
│   └── src/main/java/com/syssupplements/gym/
│       ├── config/            # Seguridad, CORS, DataInitializer
│       ├── controller/        # REST Controllers
│       ├── dto/               # Request/Response DTOs
│       ├── model/             # Entidades JPA
│       │   ├── catalogo/      # Categoria, Producto
│       │   ├── inventario/    # Inventario
│       │   ├── seguridad/     # Persona, Usuario, Rol
│       │   ├── ventas/        # Compra, Carrito, Factura, DetalleCompra
│       │   └── entrega/       # DireccionEntrega, EstadoEntrega
│       ├── repository/        # Spring Data Repositories
│       └── service/           # Logica de negocio
│
├── chatbot/                   # FastAPI RAG Chatbot
│   ├── main.py                # API endpoints (/chat, /index, /health)
│   ├── services/              # RAG pipeline, LLM, embeddings, vectorstore
│   ├── handlers/              # Manejadores de intents
│   └── config/                # Configuracion
│
└── data/                      # Persistencia de ChromaDB
    └── chroma_db/
```

## Funcionalidades

### Cliente
- Explorar catalogo de suplementos con busqueda por categoria
- Agregar productos al carrito y gestionar cantidades
- Compras online con multiples metodos de pago (Efectivo, Tarjeta, Transferencia, PayPal)
- Historial de compras y estados de entrega
- Chatbot de asistencia (RAG)

### Administrador
- Gestionar productos (CRUD con imagenes)
- Gestionar categorias
- Control de inventario con alertas de stock
- Registrar ventas manuales (presenciales)
- Visualizar ventas online y manuales
- Gestionar metodos de pago
- Administrar usuarios y roles
- Gestionar envios y estados de entrega

## Endpoints del Backend

| Controlador | Ruta Base | Descripcion |
|------------|-----------|-------------|
| AuthController | `/api/auth` | Login, registro, recuperacion de PIN |
| ProductController | `/api/productos` | CRUD de productos |
| CategoriaController | `/api/categorias` | CRUD de categorias |
| InventoryController | `/api/inventario` | Gestion de stock |
| CartController | `/api/carrito` | Carrito de compras |
| PurchaseController | `/api/compras` | Compras online |
| VentaManualController | `/api/ventas-manuales` | Ventas presenciales |
| DeliveryController | `/api/envios` | Gestion de envios |
| UsuarioController | `/api/usuarios` | Gestion de usuarios |

## Endpoints del Chatbot

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/` | Healthcheck |
| GET | `/health` | Estado de configuracion (API keys, ChromaDB) |
| POST | `/chat` | Pregunta RAG - Body: `{"question": "..."}` |
| POST | `/index` | Re-indexar manuales |

## Configuracion

### Backend (application.properties)

```properties
server.port=8081
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/syssuplements?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.jpa.hibernate.ddl-auto=update
spring.servlet.multipart.max-file-size=5MB
```

### Chatbot (.env)

```env
LLM_PROVIDER=local              # openai | gemini | local
OLLAMA_MODEL_NAME=llama3
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2
CHROMA_PERSIST_DIR=./data/chroma_db
CHUNK_SIZE=800
CHUNK_OVERLAP=100
```

### Puertos del Sistema

| Servicio | Puerto |
|----------|--------|
| Frontend (Angular) | 4200 |
| Backend (Spring Boot) | 8081 |
| Chatbot (FastAPI) | 8000 |
| MySQL | 3306 |
| Ollama (LLM local) | 11434 |

## Requisitos Previos

- **Java 21**
- **Node.js 18+** y npm 11
- **Python 3.10+**
- **MySQL 8+**
- **Maven** (incluido via wrapper `mvnw`)
- **Ollama** (opcional, para LLM local)

## Instalacion y Ejecucion

### 1. Base de datos

```sql
CREATE DATABASE syssuplements;
```

El backend crea las tablas automaticamente con `spring.jpa.hibernate.ddl-auto=update`.

### 2. Backend

```bash
cd SysSupplementsGym
./mvnw spring-boot:run
```

El `DataInitializer` crea un usuario admin por defecto al iniciar.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Disponible en `http://localhost:4200`.

### 4. Chatbot

```bash
cd chatbot
pip install -r requirements.txt
cp .env.example .env    # Configurar provider de LLM
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Diagramas

El archivo `diagramas.md` contiene diagramas Mermaid:
- Diagrama de clases del dominio
- Diagrama de paquetes
- Diagrama de despliegue
- Diagrama de estados de pago
- Diagrama de casos de uso
- Diagramas de secuencia (flujo de compra y pago)

## Licencia

Proyecto academico - Todos los derechos reservados.

