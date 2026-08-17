# @osumi/ticketbaiws

SDK TypeScript universal para la API REST de TicketBaiWS de Berein.

Permite integrar TicketBAI, Verifactu, FacturaE y las operaciones específicas de BATUZ / LROE Bizkaia mediante una API tipada y orientada a TypeScript.

## Características

- TypeScript con tipado estricto.
- ESM only.
- Sin dependencias en tiempo de ejecución.
- Basado en APIs Web estándar como `fetch`, `Headers`, `FormData` y `Blob`.
- Compatible con entornos de prueba y producción de TicketBaiWS.
- Errores tipados.
- Soporte para inyección de `fetch`.
- Compatible con Node.js moderno y aplicaciones web.
- Conserva la nomenclatura original de TicketBaiWS en los DTO para facilitar la comparación con su documentación.

## Instalación

```bash
npm install @osumi/ticketbaiws
```

## Uso básico

```ts
import {
	TicketBaiWsClient
} from '@osumi/ticketbaiws';

const client = new TicketBaiWsClient({
	token: '...',
	issuerNif: '...',
	environment: 'test'
});

const status = await client.system.status();

console.log(status);
```

Los entornos disponibles son:

```ts
'test'
'production'
```

El consumidor de la librería es responsable de gestionar y proteger las credenciales utilizadas para acceder a TicketBaiWS.

## Recursos disponibles

La API pública se organiza por dominios:

```text
client.system

client.invoices

client.validation

client.companies

client.licenses

client.webhooks

client.verifactu
└── representation

client.bizkaia
├── epigraphs
└── lroe
    ├── receivedInvoices
    ├── cashCollections
    └── cashPayments
```

### Facturación

Incluye operaciones para:

- Crear facturas TicketBAI / Verifactu.
- Completar facturas simplificadas.
- Consultar facturas.
- Listar facturas.
- Anular facturas.
- Forzar reenvíos.
- Descargar XML.
- Descargar PDF.
- Obtener FacturaE.

### Validaciones

- Validación de NIF mediante AEAT.
- Validación de NIF mediante VIES.

### Administración

- Empresas.
- Licencias.
- Webhooks.

### Verifactu

Gestión del documento de representación:

- Descargar modelo.
- Subir documento firmado.
- Recuperar documento almacenado.
- Revocar documento.

### BATUZ / LROE Bizkaia

- Consulta de epígrafes IAE.
- Facturas recibidas.
- Cobros por criterio de caja.
- Pagos por criterio de caja.

## Errores

La librería expone una jerarquía de errores tipados:

```text
TicketBaiWsError
├── TicketBaiWsConfigurationError
├── TicketBaiWsApiError
├── TicketBaiWsHttpError
├── TicketBaiWsNetworkError
└── TicketBaiWsResponseError
```

Esto permite distinguir errores de configuración, respuestas del API, errores HTTP, problemas de red y respuestas no válidas.

## Documentación

El README ofrece únicamente una introducción general al paquete.

La documentación completa, con explicación de parámetros, respuestas y ejemplos TypeScript, se encuentra en la carpeta `docs/`.

El índice principal será:

```text
docs/README.md
```

La documentación está organizada por dominios:

```text
docs/
├── README.md
├── getting-started.md
├── invoices.md
├── validation.md
├── companies.md
├── licenses.md
├── webhooks.md
├── verifactu.md
└── bizkaia/
    ├── README.md
    ├── epigraphs.md
    ├── received-invoices.md
    ├── cash-collections.md
    └── cash-payments.md
```

## Compatibilidad

`@osumi/ticketbaiws` utiliza APIs Web estándar y no depende de APIs específicas de Node.js en su interfaz pública.

Para utilizar todas las funcionalidades, el entorno debe proporcionar las APIs Web necesarias, especialmente `fetch` y, para la subida del documento de representación Verifactu, `FormData` y `Blob`.

Es posible proporcionar una implementación personalizada de `fetch` mediante la configuración del cliente.

## Alcance

Esta librería es un cliente para la API de TicketBaiWS.

No implementa por sí misma TicketBAI, Verifactu, BATUZ ni las reglas fiscales asociadas a estos sistemas. Las validaciones fiscales y las condiciones de aceptación de los datos corresponden al servicio TicketBaiWS y a las administraciones competentes.

Los modelos del SDK están diseñados para representar el contrato del API sin duplicar innecesariamente sus reglas de negocio o fiscales.

## TicketBaiWS

TicketBaiWS es un servicio de Berein que permite conectar aplicaciones con las haciendas vascas, Verifactu y otros servicios relacionados mediante una API REST.

`@osumi/ticketbaiws` es un SDK independiente para consumir dicha API y no forma parte del servicio TicketBaiWS.

Para conocer las reglas fiscales, requisitos y comportamiento específico del servicio debe consultarse la documentación oficial de TicketBaiWS.

## Licencia

MIT
