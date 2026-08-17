# Documentación de @osumi/ticketbaiws

Esta carpeta contiene la documentación completa de `@osumi/ticketbaiws`.

El `README.md` de la raíz del proyecto está pensado como una introducción breve para GitHub y npm. La documentación de esta carpeta profundiza en la configuración del cliente, los modelos públicos, las respuestas, los errores y cada uno de los dominios soportados por la API de TicketBaiWS.

## Índice

### Primeros pasos

- [Primeros pasos](getting-started.md)

### Facturación

- [Facturación](invoices.md)

### Validaciones

- [Validaciones AEAT y VIES](validation.md)

### Administración

- [Empresas](companies.md)
- [Licencias](licenses.md)
- [Webhooks](webhooks.md)

### Verifactu

- [Documento de representación Verifactu](verifactu.md)

### BATUZ / LROE Bizkaia

- [Índice Bizkaia](bizkaia/README.md)
- [Epígrafes IAE](bizkaia/epigraphs.md)
- [Facturas recibidas](bizkaia/received-invoices.md)
- [Cobros por criterio de caja](bizkaia/cash-collections.md)
- [Pagos por criterio de caja](bizkaia/cash-payments.md)

Los documentos enlazados que todavía no existan se irán incorporando conforme se complete la documentación de cada dominio.

## Filosofía de la documentación

Esta documentación describe el uso de `@osumi/ticketbaiws` y el contrato que expone el SDK.

No pretende sustituir la documentación fiscal ni funcional de TicketBAI, Verifactu, BATUZ, LROE o FacturaE. Cuando una regla depende de normativa fiscal o del comportamiento del servicio TicketBaiWS, la librería evita reproducirla salvo que sea necesaria para describir correctamente un tipo o una operación.

La documentación oficial del servicio está disponible en:

https://ticketbaiws.eus/es/documentacion-api/

## Convenciones del SDK

### Nomenclatura

Las clases, métodos y recursos propios del SDK utilizan nombres idiomáticos de TypeScript:

```ts
client.invoices.create(...)
client.validation.aeat(...)
client.bizkaia.lroe.receivedInvoices.list(...)
```

Los DTO enviados a TicketBaiWS conservan, en cambio, la nomenclatura original del API en `snake_case`:

```ts
{
    nombre_social: 'Empresa S.L.',
    num_factura: 'F-001',
    importe_total: 121
}
```

Esta decisión permite comparar fácilmente el código del consumidor con la documentación oficial de TicketBaiWS.

### Respuestas

La mayoría de métodos devuelven el sobre estándar de TicketBaiWS:

```ts
{
    result: 'OK',
    return: ...,
    msg: null
}
```

El SDK conserva ese sobre y tipa específicamente el contenido de `return` para cada operación.

No se desempaqueta automáticamente `return`. Por ejemplo:

```ts
const response = await client.validation.aeat({
    nif: '12345678Z',
    nombre: 'Nombre Apellidos'
});

console.log(response.result);
console.log(response.return);
```

### Errores

Cuando TicketBaiWS devuelve `result: 'ERROR'`, el SDK lanza `TicketBaiWsApiError` en lugar de devolver esa respuesta como si fuese correcta.

También existen errores específicos para configuración, HTTP, red y respuestas inválidas. Consulta [Primeros pasos](getting-started.md) para ver la jerarquía completa y ejemplos de tratamiento de errores.

### GET y parámetros de consulta

Cuando una operación GET necesita parámetros, el SDK los envía mediante query string.

Esta política es deliberada y uniforme aunque algunos ejemplos de la documentación de TicketBaiWS muestren cuerpos JSON en peticiones GET.

Ejemplo conceptual:

```text
GET /lroe-recibidas/?ejercicio=2026&pagina=1
```

### Tipos del API

El SDK intenta representar el contrato real de TicketBaiWS sin transformar silenciosamente los datos.

Por ello, algunos conceptos pueden tener tipos diferentes entre escritura y lectura cuando así ocurre en el API. Por ejemplo, determinados importes o tipos impositivos se envían como `number` en POST/PUT pero aparecen como `string` en respuestas GET.

Los documentos de cada dominio señalan estas diferencias cuando son relevantes.

### Validación fiscal

El SDK realiza únicamente las validaciones básicas necesarias para construir correctamente el cliente y enviar las peticiones.

No duplica las reglas fiscales de TicketBAI, Verifactu, BATUZ o LROE. Si una combinación de datos depende de normativa fiscal, la validación final corresponde a TicketBaiWS y a la administración competente.

## API pública

El cliente se organiza actualmente mediante esta jerarquía:

```text
client
├── system
├── invoices
├── validation
├── companies
├── licenses
├── webhooks
├── verifactu
│   └── representation
└── bizkaia
    ├── epigraphs
    └── lroe
        ├── receivedInvoices
        ├── cashCollections
        └── cashPayments
```

Todos los tipos públicos necesarios para utilizar estos recursos se exportan desde el entry point principal:

```ts
import {
    TicketBaiWsClient,
    type TicketBaiWsClientOptions
} from '@osumi/ticketbaiws';
```

No es necesario importar archivos internos del paquete.

## Código fuente y problemas

Repositorio:

https://github.com/osumionline/ticketbaiws

Incidencias:

https://github.com/osumionline/ticketbaiws/issues
