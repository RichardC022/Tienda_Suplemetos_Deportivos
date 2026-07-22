# Documentación de Arquitectura y Flujos - GymsSuplementos

## 1. Diagrama de Clases (Dominio)
classDiagram
class EstadoEntrega {
<<enumeration>>
ENTREGADO
EN_PROCESO
ENVIADO
}

    class MetodoPago {
        <<enumeration>>
        EFECTIVO
        TARJETA
        TRANFERENCIA
        PAYPAL
    }

    class DireccionEntrega {
        -callePrincipal: String
        -calleSecundaria: String
        -nroCasa: String
        -referencia: String
    }

    class Carrito {
        -fechaCreacion: date
        -subtotal: float
    }

    class Compra {
        -fecha: date
        -total: float
    }

    class Persona {
        -nombre: String
        -apellido: String
        -telefono: String
    }

    class Usuario {
        -correo: String
        -clave: String
        -intentoFallido: int
    }

    class Rol {
        -nombre: String
    }

    class Categoria {
        -nombre: String
        -descripcion: String
    }

    class Producto {
        -nombre: String
        -cod: int
        -detalle: String
        -estado: boolean
    }

    class DetalleCompra {
        -cantidad: int
        -precioU: float
        -subtotal: float
    }

    class Factura {
        -fecha: date
        -total: float
        -numero: String
    }

    class Inventario {
        -stock: int
        -stockMin: int
    }

    %% Relaciones y multiplicidades exactas de la imagen
    EstadoEntrega "1" -- "1" DireccionEntrega
    DireccionEntrega "1" -- "*" Compra
    Carrito "1" -- "1" Compra
    Compra "*" -- "1" MetodoPago
    Compra "*" -- "1" Persona
    Persona "1" -- "1" Usuario
    Usuario "*" -- "1" Rol
    Compra "1" -- "1" Factura
    Compra "1" -- "*" DetalleCompra
    DetalleCompra "*" -- "1" Producto
    Producto "*" -- "1" Categoria
    Producto "1" -- "1" Inventario

flowchart TD
subgraph GymsSuplements ["GymsSuplements (Paquete Principal)"]

        subgraph Seguridad ["Seguridad"]
            Rol[Rol]
            Usuario[Usuario]
            Persona[Persona]
        end

        subgraph Catalogo ["Catalogo"]
            Categoria[Categoria]
            Producto[Producto]
        end

        subgraph InventarioPkg ["Inventario"]
            InventarioClass[Inventario]
        end

        subgraph Ventas ["Ventas"]
            Compra[Compra]
            MetodoPago[MetodoPago]
            Factura[Factura]
            Carrito[Carrito]
            DetalleCompra[DetalleCompra]
        end

        subgraph Entrega ["Entrega"]
            DireccionEntrega[DireccionEntrega]
            EstadoEntrega[EstadoEntrega]
        end

    end

    %% Dependencias entre paquetes (Flechas punteadas)
    Catalogo -.-> Seguridad
    Catalogo -.-> InventarioPkg
    Ventas -.-> Catalogo
    Ventas -.-> InventarioPkg
    Entrega -.-> Ventas

    %% Estilos visuales para asimilar a un diagrama UML
    classDef default fill:#ffffff,stroke:#000000,stroke-width:1px;
    style GymsSuplements fill:#ffffff,stroke:#000,stroke-width:2px;
    style Seguridad fill:#f9f9f9,stroke:#666,stroke-width:1.5px;
    style Catalogo fill:#f9f9f9,stroke:#666,stroke-width:1.5px;
    style InventarioPkg fill:#f9f9f9,stroke:#666,stroke-width:1.5px;
    style Ventas fill:#f9f9f9,stroke:#666,stroke-width:1.5px;
    style Entrega fill:#f9f9f9,stroke:#666,stroke-width:1.5px;

flowchart LR
subgraph Cliente_Web ["«device»<br>Cliente Web"]
Navegador_Web["«executionEnvironment»<br>Navegador Web"]
end

    subgraph Servidor_Web_Frontend ["«node»<br>Servidor Web Frontend"]
        subgraph Nginx ["«executionEnvironment»<br>Nginx"]
            Angular["«artifact»<br>Angular"]
        end
    end

    subgraph Servidor_Aplicaciones_Backend ["«node»<br>Servidor de Aplicaciones Backend"]
        subgraph JVM ["JVM"]
            subgraph Spring_Boot ["Spring Boot"]
                Tomcat_Embebido["Tomcat Embebido"]
            end
        end
    end

    Servidor_MySQL["«database»<br>Servidor MySQL"]

    %% Conexiones y protocolos
    Cliente_Web -- "+HTTPS 443" --- Servidor_Web_Frontend
    Servidor_Web_Frontend -- "+REST - JSON 8080" --- Servidor_Aplicaciones_Backend
    Servidor_Aplicaciones_Backend -- "+JDBC - JPA" --- Servidor_MySQL

    %% Estilos básicos para simular cajas UML
    classDef default fill:#ffffff,stroke:#000000,stroke-width:1px,color:#000;
    style Cliente_Web fill:#ffffff,stroke:#000,stroke-width:2px;
    style Servidor_Web_Frontend fill:#ffffff,stroke:#000,stroke-width:2px;
    style Servidor_Aplicaciones_Backend fill:#ffffff,stroke:#000,stroke-width:2px;
    style Servidor_MySQL fill:#ffffff,stroke:#000,stroke-width:2px;

stateDiagram-v2
[*] --> SeleccionarMetodoPago
SeleccionarMetodoPago --> ProcesandoPago : IngresarDatos
SeleccionarMetodoPago --> Cancelado
Cancelado --> [*]
ProcesandoPago --> Rechazado
ProcesandoPago --> Aprobado
Rechazado --> SeleccionarMetodoPago
Aprobado --> Facturado
Facturado --> [*]

sequenceDiagram
participant Cliente
participant Compra
participant Comprobante
participant Producto

    Cliente->>Compra: 1: agregarProducto
    Compra->>Compra: 2: calcularSubtotal
    Cliente->>Compra: 3: realizarCompra
    Cliente->>Compra: 4: ingresarDatosPersonales
    Compra->>Compra: 5: validarDatosPersonales
    Compra->>Comprobante: 6: [cliente.datos = true] procesarCompra
    Cliente->>Compra: 7: confirmarCompra
    Compra->>Producto: 8: [compraRealizada] actualizarStock
    Compra->>Comprobante: 9: generarComprobante

flowchart TB
%% Definición de interfaces
HTTPS((HTTPS))
JDBC((JDBC))

    %% Componente Frontend (escrito como 'Fronted' en el diagrama original)
    subgraph Fronted
        WebUI[Web UI]
    end

    %% Componente Backend y su jerarquía interna
    subgraph Backend
        subgraph Controllers
            AuthController[AuthController]
            ProductController[ProductController]
            InventoryController[InventoryController]
            PurchaseController[PurchaseController]
            CartController[CartController]
            DeliveryController[DeliveryController]
        end
        
        subgraph Service
            AuthService[AuthService]
            ProductService[ProductService]
            InventoryService[InventoryService]
            PurchaseService[PurchaseService]
            CartService[CartService]
            DeliveryService[DeliveryService]
        end
        
        subgraph Repository
            UserRepository[UserRepository]
            ProductRepository[ProductRepository]
            InventoryRepository[InventoryRepository]
            PurchaseRepository[PurchaseRepository]
            DeliveryRepository[DeliveryRepository]
        end
        
        %% Dependencias internas
        Controllers -.-> Service
        Service -.-> Repository
    end

    %% Componente Base de Datos
    DB[Data base]

    %% Relaciones de Puertos e Interfaces (Lollipop / Socket)
    Fronted ---|Port 1| HTTPS
    HTTPS ---|Port 2| Backend
    
    Backend ---|Port 3| JDBC
    JDBC ---|Port 4| DB

flowchart LR
%% Definición de Actores (se usan nodos circulares dobles para diferenciarlos visualmente)
Admin(("Administrador"))
Cliente(("Cliente"))

    %% Límite del Sistema
    subgraph Sistema ["Caso de Uso General - Tienda de Suplementos Deportivos"]
        direction TB
        
        UC1([Registrar Venta Manual])
        UC2([Gestionar Productos])
        UC3([Gestionar Categorías])
        UC4([Iniciar Sesión])
        
        UC5([Registrar Cuenta])
        UC6([Visualizar Catálogo])
        UC7([Filtrar por Categorías])
        
        UC8([Agregar al Carrito])
        UC9([Eliminar del Carrito])
        UC10([Realizar Compra])
        
        UC11([Visualizar Total])
        UC12([Ingresar Datos de Envío])
        UC13([Seleccionar Método de Pago])
        UC14([Generar Factura])
    end

    %% Asociaciones del Administrador (Líneas sólidas sin flecha)
    Admin --- UC1
    Admin --- UC2
    Admin --- UC3
    Admin --- UC4

    %% Asociaciones del Cliente (Líneas sólidas sin flecha)
    Cliente --- UC4
    Cliente --- UC5
    Cliente --- UC6
    Cliente --- UC8
    Cliente --- UC9
    Cliente --- UC10

    %% Relaciones <<extend>> (Flecha punteada desde el caso extendido hacia el caso base)
    UC7 -. "«extend»" .-> UC6

    %% Relaciones <<include>> (Flecha punteada desde el caso base hacia el caso incluido)
    UC10 -. "«include»" .-> UC11
    UC10 -. "«include»" .-> UC12
    UC10 -. "«include»" .-> UC13
    UC10 -. "«include»" .-> UC14

    %% Estilos para dar formato a los Actores
    classDef actor fill:#f4f4f4,stroke:#333,stroke-width:2px,font-weight:bold;
    class Admin,Cliente actor;
    
    %% Estilo general para los casos de uso
    classDef usecase fill:#ffffff,stroke:#333,stroke-width:1px;
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10,UC11,UC12,UC13,UC14 usecase;

sequenceDiagram
participant Cliente
participant InterfazCompra as «boundary»<br/>InterfazCompra
participant ControlCompra as «control»<br/>ControlCompra
participant EntidadCompra as «entity»<br/>EntidadCompra
participant EntidadProducto as «entity»<br/>EntidadProducto
participant EntidadComprobante as «entity»<br/>EntidadComprobante

    Cliente->>+InterfazCompra: 1 : seleccionarProducto
    Cliente->>InterfazCompra: 2 : agregarAlCarrito
    InterfazCompra->>+ControlCompra: 3 : agreagrProducto
    ControlCompra->>+EntidadCompra: 4 : calcularSubtotal
    EntidadCompra-->>-ControlCompra: 5 : subtotalCalculado
    ControlCompra-->>-InterfazCompra: 6 : productoAgregado
    InterfazCompra-->>-Cliente: 7 : mostrarCarrito
    Cliente->>+InterfazCompra: 8 : Message1
    deactivate InterfazCompra

sequenceDiagram
autonumber

    %% --- PROCESO DE COMPRA ---
    Note over Cliente,EntidadComprobante: Diagrama de secuencia proceso de Compra
    
    actor Cliente
    participant InterfazCompra as InterfazCompra
    participant ControlCompra as ControlCompra
    participant EntidadCompra as EntidadCompra
    participant EntidadProducto as EntidadProducto
    participant EntidadComprobante as EntidadComprobante

    Cliente->>InterfazCompra: seleccionarProducto
    Cliente->>InterfazCompra: agregarAlCarrito
    InterfazCompra->>ControlCompra: agregarProducto
    ControlCompra->>EntidadCompra: calcularSubtotal
    EntidadCompra-->>ControlCompra: subtotalCalculado
    ControlCompra-->>InterfazCompra: productoAgregado
    InterfazCompra-->>Cliente: mostrarCarrito

    Cliente->>InterfazCompra: realizarCompra
    InterfazCompra->>ControlCompra: solicitarDatosCompra
    InterfazCompra-->>Cliente: ingresarDatosPersonales
    Cliente->>ControlCompra: ingresarDatosPersonales

    alt Datos válidos
        ControlCompra-->>InterfazCompra: datosCorrectos
        InterfazCompra-->>Cliente: mostrarConfirmacion
    else Datos inválidos
        ControlCompra-->>InterfazCompra: datosIncorrectos
        InterfazCompra-->>Cliente: notificarError
    end

    Cliente->>InterfazCompra: confirmarCompra
    InterfazCompra->>ControlCompra: procesarCompra
    
    rect rgb(240, 240, 240)
        Note right of ControlCompra: ref: ProcesoPago
    end

    ControlCompra->>EntidadCompra: registrarVenta
    ControlCompra->>EntidadProducto: actualizarStock
    EntidadProducto-->>ControlCompra: stockActualizado
    ControlCompra->>EntidadComprobante: generarComprobante
    EntidadComprobante-->>ControlCompra: comprobanteGenerado
    ControlCompra-->>InterfazCompra: compraExitosa
    InterfazCompra-->>Cliente: mensajeCompraRealizada


    %% --- PROCESO DE PAGO ---
    Note over Cliente,EntidadPago: Diagrama de secuencia proceso de Pago
    
    actor Cliente as ClientePago
    participant InterfazCompra as InterfazPagoInterfaz
    participant ControlCompra as ControlPagoCtrl
    participant EntidadPago as EntidadPago

    ClientePago->>InterfazPagoInterfaz: seleccionarMetodoPago
    ClientePago->>InterfazPagoInterfaz: ingresaDatosPago
    InterfazPagoInterfaz->>ControlPagoCtrl: validaDatosPago
    ControlPagoCtrl->>EntidadPago: verificarDatosPago
    EntidadPago-->>ControlPagoCtrl: metodoValido

    alt Método válido
        ControlPagoCtrl->>EntidadPago: procesarTransaccion
        EntidadPago-->>ControlPagoCtrl: transaccionExitosa
        ControlPagoCtrl-->>InterfazPagoInterfaz: mostrarConfirmacion
        InterfazPagoInterfaz-->>ClientePago: pagoConfirmado
    else Método inválido
        ControlPagoCtrl-->>InterfazPagoInterfaz: pagoRechazado
        InterfazPagoInterfaz-->>ClientePago: notificacionErrorPago
    end

