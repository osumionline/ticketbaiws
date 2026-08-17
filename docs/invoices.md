# Facturación

[← Volver al índice de documentación](README.md)

Este documento describe el recurso de facturación de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.invoices
```

y permite crear, consultar, listar, completar, anular y reenviar facturas, además de obtener los documentos XML, PDF y FacturaE asociados.

## Índice

- [Resumen de métodos](#resumen-de-métodos)
- [Crear una factura](#crear-una-factura)
  - [Ejemplo básico](#ejemplo-básico)
  - [Datos generales](#datos-generales)
  - [Cliente](#cliente)
  - [Identificación de la factura](#identificación-de-la-factura)
  - [Líneas](#líneas)
  - [Facturas simplificadas](#facturas-simplificadas)
  - [Facturas rectificativas](#facturas-rectificativas)
  - [Intracomunitarias y exportaciones](#intracomunitarias-y-exportaciones)
  - [Otros parámetros](#otros-parámetros)
  - [Subsanación con `zuzendu`](#subsanación-con-zuzendu)
  - [Respuesta TicketBAI y Verifactu](#respuesta-ticketbai-y-verifactu)
- [Completar facturas simplificadas](#completar-facturas-simplificadas)
- [Consultar una factura](#consultar-una-factura)
- [Listar facturas](#listar-facturas)
- [Anular una factura](#anular-una-factura)
- [Forzar un reenvío](#forzar-un-reenvío)
- [Descargar XML](#descargar-xml)
- [Descargar PDF](#descargar-pdf)
- [Descargar FacturaE](#descargar-facturae)
- [Tipos públicos](#tipos-públicos)
- [Errores](#errores)
- [Notas sobre la documentación oficial](#notas-sobre-la-documentación-oficial)
- [Documentación oficial](#documentación-oficial)

## Resumen de métodos

El recurso `client.invoices` expone:

```ts
client.invoices.create(...)
client.invoices.completeSimplified(...)
client.invoices.get(...)
client.invoices.list(...)
client.invoices.cancel(...)
client.invoices.resend(...)
client.invoices.getXml(...)
client.invoices.getPdf(...)
client.invoices.getFacturaE(...)
```

Correspondencia con TicketBaiWS:

| Método del SDK | Método HTTP | Recurso TicketBaiWS |
| --- | --- | --- |
| `create()` | `POST` | `tbai/` |
| `completeSimplified()` | `POST` | `tbai-completar/` |
| `get()` | `GET` | `tbai/` |
| `list()` | `GET` | `tbai-list/` |
| `cancel()` | `DELETE` | `tbai/` |
| `resend()` | `PUT` | `reset-tbai/` |
| `getXml()` | `GET` | `tbai-xml/` |
| `getPdf()` | `GET` | `tbai-pdf/` |
| `getFacturaE()` | `GET` | `facturae/` |

Los métodos GET reciben objetos tipados y el SDK construye los parámetros de la URL. No es necesario construir manualmente query strings.

---

# Crear una factura

```ts
const response = await client.invoices.create(invoice);
```

El argumento es un:

```ts
TicketBaiWsCreateInvoiceRequest
```

La operación sirve tanto para TicketBAI como para Verifactu. La administración a la que se dirige el envío depende de la configuración de la empresa y del servicio TicketBaiWS.

## Ejemplo básico

```ts
import {
    TicketBaiWsClient,
    type TicketBaiWsCreateInvoiceRequest
} from '@osumi/ticketbaiws';

const client = new TicketBaiWsClient({
    token: '...',
    issuerNif: 'B00000011',
    environment: 'test'
});

const invoice: TicketBaiWsCreateInvoiceRequest = {
    fecha: '17/08/2026',
    hora: '18:30:00',

    nif: 'B01000012',
    simplificada: false,
    nombre: 'Cliente de ejemplo S.L.',
    direccion: 'Calle de ejemplo 1',
    cp: '48001',

    serie: 'A',
    numero: '2026000123',

    rectificativa: false,

    retencion: 0,

    lineas: [
        {
            descripcion: 'Producto de ejemplo',
            cantidad: 1,
            importe_unitario: 100,
            tipo_iva: 21,
            tipo_req: 0
        }
    ],

    total_factura: 121
};

const response = await client.invoices.create(invoice);

console.log(response.return);
```

El SDK envía este objeto como JSON a TicketBaiWS.

No recalcula `total_factura`, impuestos, descuentos ni retenciones. La aplicación consumidora es responsable de construir los importes que quiera enviar.

## Datos generales

Campos principales:

| Campo | Tipo SDK | Obligatorio en el tipo | Descripción |
| --- | --- | --- | --- |
| `fecha` | `string` | Sí | Fecha de emisión. TicketBaiWS documenta formato `dd/mm/yyyy`. |
| `hora` | `string` | Sí | Hora de emisión. TicketBaiWS documenta formato `HH:MM:SS`. |
| `fecha_operacion` | `string` | No | Fecha de la operación cuando proceda. |
| `simplificada` | `boolean` | Sí | Indica si se trata de una factura simplificada. |
| `retencion` | `number` | Sí | Importe de retención aplicado. |
| `total_factura` | `number` | Sí | Importe total de la factura. |

Ejemplo:

```ts
{
    fecha: '17/08/2026',
    hora: '18:30:00',
    fecha_operacion: '16/08/2026',
    simplificada: false,
    retencion: 0,
    total_factura: 121
}
```

El SDK no valida el formato real de fecha/hora ni las reglas fiscales relacionadas. TicketBaiWS realiza la validación final.

---

## Cliente

Campos:

| Campo | Tipo SDK | Descripción |
| --- | --- | --- |
| `nif` | `string` | Identificación fiscal del cliente. |
| `tipo_documento` | `TicketBaiWsDocumentType` | Tipo de documento para clientes extranjeros. |
| `pais_cliente` | `string` | Código ISO-3166 Alpha-2 del país. |
| `nombre` | `string` | Nombre o razón social. |
| `direccion` | `string` | Dirección de facturación. |
| `cp` | `string` | Código postal. |

El SDK mantiene estos campos opcionales porque existen casos —especialmente facturas simplificadas— en los que TicketBaiWS no requiere los datos del cliente.

Ejemplo para una factura completa:

```ts
{
    nif: 'B01000012',
    nombre: 'Cliente de ejemplo S.L.',
    direccion: 'Gran Vía 1',
    cp: '48001'
}
```

### Cliente extranjero

El tipo público:

```ts
type TicketBaiWsDocumentType =
    | '02'
    | '03'
    | '04'
    | '05'
    | '06';
```

representa los códigos publicados por TicketBaiWS.

Ejemplo:

```ts
{
    nif: 'DE123456789',
    tipo_documento: '02',
    pais_cliente: 'DE',
    nombre: 'Example GmbH'
}
```

El SDK no valida que el documento, el país y el tipo seleccionado sean fiscalmente compatibles.

---

## Identificación de la factura

```ts
{
    serie: 'A',
    numero: '2026000123'
}
```

Ambos campos son obligatorios en `TicketBaiWsCreateInvoiceRequest`.

La referencia formada por `serie` y `numero` se reutiliza después en operaciones como:

```ts
client.invoices.get(...)
client.invoices.getXml(...)
client.invoices.getPdf(...)
client.invoices.getFacturaE(...)
client.invoices.cancel(...)
client.invoices.resend(...)
```

El tipo común para estas operaciones es:

```ts
interface TicketBaiWsInvoiceReference {
    readonly serie: string;
    readonly numero: string;
}
```

---

# Líneas

La propiedad:

```ts
lineas
```

es un array de:

```ts
TicketBaiWsInvoiceLine
```

El modelo público es:

```ts
interface TicketBaiWsInvoiceLine {
    readonly descripcion?: string;
    readonly cantidad: number;
    readonly importe_unitario: number;
    readonly tipo_iva: number;
    readonly tipo_req: number;
    readonly descuento?: number;
    readonly regimen_general?: boolean;
    readonly epigrafe?: number;
}
```

## Campos de una línea

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `descripcion` | `string` | Descripción del concepto. |
| `cantidad` | `number` | Número de unidades. |
| `importe_unitario` | `number` | Importe unitario sin IVA. |
| `tipo_iva` | `number` | Porcentaje de IVA. |
| `tipo_req` | `number` | Porcentaje de recargo de equivalencia. |
| `descuento` | `number` | Porcentaje de descuento. |
| `regimen_general` | `boolean` | Concepto en régimen general cuando se usan determinados modos especiales. |
| `epigrafe` | `number` | Epígrafe específico de la línea cuando el API lo requiera. |

Ejemplo:

```ts
lineas: [
    {
        descripcion: 'Artículo estándar',
        cantidad: 2,
        importe_unitario: 50,
        tipo_iva: 21,
        tipo_req: 0
    },
    {
        descripcion: 'Artículo con descuento',
        cantidad: 1,
        importe_unitario: 40,
        tipo_iva: 10,
        tipo_req: 0,
        descuento: 5
    }
]
```

TicketBaiWS documenta un máximo de 1000 líneas.

La necesidad y significado fiscal de los campos puede variar por territorio y régimen. El SDK representa el contrato de datos pero no intenta calcular automáticamente bases imponibles ni decidir qué campos corresponden a cada supuesto.

---

# Facturas simplificadas

Una factura simplificada se indica mediante:

```ts
simplificada: true
```

En este caso pueden omitirse los datos del cliente en el modelo del SDK:

```ts
const response = await client.invoices.create({
    fecha: '17/08/2026',
    hora: '18:30:00',

    simplificada: true,

    serie: 'S',
    numero: '2026000456',

    rectificativa: false,

    retencion: 0,

    lineas: [
        {
            descripcion: 'Venta mostrador',
            cantidad: 1,
            importe_unitario: 10,
            tipo_iva: 21,
            tipo_req: 0
        }
    ],

    total_factura: 12.1
});
```

No debe interpretarse la opcionalidad del tipo TypeScript como una definición completa de las reglas fiscales de una factura simplificada. Para determinar qué información es legalmente necesaria debe consultarse TicketBaiWS y la normativa correspondiente.

---

# Facturas rectificativas

Para crear una rectificativa se utiliza:

```ts
rectificativa: true
```

y pueden utilizarse:

```ts
clave_rectificativa
tipo_rectificativa
rectificadas
```

## Clave rectificativa

```ts
type TicketBaiWsRectificationKey =
    | 'R1'
    | 'R2'
    | 'R3'
    | 'R4'
    | 'R5';
```

## Tipo rectificativo

```ts
type TicketBaiWsRectificationType =
    | 'S'
    | 'I'
    | 'SN';
```

El SDK conserva los códigos utilizados por TicketBaiWS.

No intenta decidir qué clave o tipo corresponde fiscalmente a cada situación.

## Facturas rectificadas

Cada factura que se rectifica puede representarse mediante:

```ts
interface TicketBaiWsRectifiedInvoice {
    readonly serie: string;
    readonly numero: string;
    readonly fecha: string;
    readonly base?: number;
    readonly cuota?: number;
    readonly recargo?: number;
}
```

Ejemplo:

```ts
const response = await client.invoices.create({
    fecha: '17/08/2026',
    hora: '19:00:00',

    nif: 'B01000012',
    simplificada: false,
    nombre: 'Cliente S.L.',

    serie: 'R',
    numero: '2026000010',

    rectificativa: true,
    clave_rectificativa: 'R1',
    tipo_rectificativa: 'I',

    rectificadas: [
        {
            serie: 'A',
            numero: '2026000005',
            fecha: '10/08/2026'
        }
    ],

    retencion: 0,

    lineas: [
        {
            descripcion: 'Regularización',
            cantidad: 1,
            importe_unitario: -10,
            tipo_iva: 21,
            tipo_req: 0
        }
    ],

    total_factura: -12.1
});
```

Los campos `base`, `cuota` y `recargo` permiten aportar datos adicionales de la factura rectificada cuando TicketBaiWS los requiera, por ejemplo cuando la factura original no fue enviada previamente a través del servicio.

---

# Intracomunitarias y exportaciones

El modelo de creación dispone de:

```ts
intracomunitaria?: boolean;
exportacion?: boolean;
tipo_operacion?: 'servicios' | 'bienes';
```

Ejemplo conceptual:

```ts
{
    intracomunitaria: true,
    tipo_operacion: 'bienes',
    pais_cliente: 'FR'
}
```

`tipo_operacion` utiliza:

```ts
type TicketBaiWsOperationType =
    | 'servicios'
    | 'bienes';
```

TicketBaiWS documenta `servicios` como comportamiento por defecto si no se especifica.

El SDK no intenta inferir estos flags a partir del país, NIF, líneas u otros datos.

---

# Otros parámetros

`TicketBaiWsCreateInvoiceRequest` expone también:

```ts
readonly regimen_iva?: number;
readonly causa_exencion?: TicketBaiWsExemptionCause;
readonly inversion_sujeto_pasivo?: boolean;
readonly emitida_terceros?: TicketBaiWsThirdPartyIssue;
readonly modo_recargo_equivalencia?: boolean;
readonly modo_regimen_simplificado?: boolean;
readonly epigrafe?: string;
```

## Causa de exención

```ts
type TicketBaiWsExemptionCause =
    | 'E1'
    | 'E2'
    | 'E3'
    | 'E4'
    | 'E5'
    | 'E6'
    | 'RL'
    | 'OT'
    | 'IE'
    | 'VT';
```

El SDK conserva únicamente los códigos.

La elección de una causa concreta depende de las circunstancias fiscales de la operación y no debe deducirse de este documento.

## Emisión por terceros

```ts
type TicketBaiWsThirdPartyIssue =
    | 'N'
    | 'T'
    | 'D';
```

Los códigos siguen directamente el contrato de TicketBaiWS.

## Epígrafe

El campo global:

```ts
epigrafe?: string;
```

puede utilizarse en los supuestos de Bizkaia/LROE en los que TicketBaiWS permite informar un epígrafe específico para la factura.

No debe confundirse con el campo `epigrafe` de cada línea, cuyo modelo actual es `number`.

---

# Subsanación con `zuzendu`

Para volver a enviar una factura previamente notificada con avisos o errores, TicketBaiWS dispone del parámetro:

```ts
zuzendu?: boolean;
```

Ejemplo:

```ts
await client.invoices.create({
    fecha: '17/08/2026',
    hora: '18:30:00',

    nif: 'B01000012',
    simplificada: false,
    nombre: 'Cliente corregido S.L.',

    serie: 'A',
    numero: '2026000123',

    rectificativa: false,

    retencion: 0,

    lineas: [
        {
            descripcion: 'Producto',
            cantidad: 1,
            importe_unitario: 100,
            tipo_iva: 21,
            tipo_req: 0
        }
    ],

    total_factura: 121,

    zuzendu: true
});
```

TicketBaiWS indica que esta operación no está disponible en Bizkaia y que determinados datos identificativos/económicos de la factura original no pueden modificarse durante la subsanación.

El SDK no intenta comparar el nuevo objeto con la factura original; el servicio remoto valida la operación.

---

# Respuesta TicketBAI y Verifactu

`create()` devuelve:

```ts
TicketBaiWsCreateInvoiceResponse
```

cuyo `return` es una unión:

```ts
type TicketBaiWsCreateInvoiceResult =
    | TicketBaiWsTicketBaiInvoiceResult
    | TicketBaiWsVerifactuInvoiceResult;
```

## TicketBAI

```ts
interface TicketBaiWsTicketBaiInvoiceResult {
    readonly huella_tbai: string;
    readonly qr: string;
    readonly url: string;
}
```

Ejemplo conceptual:

```ts
{
    result: 'OK',
    return: {
        huella_tbai: 'TBAI-...',
        qr: 'iVBORw0KGgo...',
        url: 'https://...'
    },
    msg: null
}
```

`qr` contiene la imagen QR codificada en Base64.

## Verifactu

```ts
interface TicketBaiWsVerifactuInvoiceResult {
    readonly huella: string;
    readonly qr: string;
    readonly url: string;
}
```

Ejemplo conceptual:

```ts
{
    result: 'OK',
    return: {
        huella: '8FA696A6...',
        qr: 'iVBORw0KGgo...',
        url: 'https://...'
    },
    msg: null
}
```

La diferencia relevante en el modelo es:

```text
TicketBAI  → huella_tbai
Verifactu  → huella
```

El SDK no normaliza ambos nombres para conservar el contrato original del servicio.

Si el consumidor necesita distinguirlos puede hacerlo comprobando la propiedad:

```ts
const response = await client.invoices.create(invoice);

if ('huella_tbai' in response.return) {
    console.log('TicketBAI:', response.return.huella_tbai);
}
else {
    console.log('Verifactu:', response.return.huella);
}
```

---

# Completar facturas simplificadas

```ts
client.invoices.completeSimplified(...)
```

utiliza:

```ts
TicketBaiWsCompleteInvoiceRequest
```

y permite agrupar una o varias facturas simplificadas en una factura completa.

## Modelo

```ts
interface TicketBaiWsSimplifiedInvoiceReference {
    readonly serie: string;
    readonly numero: string;
    readonly fecha: string;
}

interface TicketBaiWsCompleteInvoiceRequest {
    readonly fecha: string;
    readonly hora: string;

    readonly nif: string;
    readonly pais_cliente?: string;
    readonly nombre: string;
    readonly direccion: string;
    readonly cp: string;

    readonly serie: string;
    readonly numero: string;

    readonly simplificadas:
        readonly TicketBaiWsSimplifiedInvoiceReference[];

    readonly intracomunitaria?: boolean;
    readonly exportacion?: boolean;
}
```

## Ejemplo

```ts
const response =
    await client.invoices.completeSimplified({
        fecha: '17/08/2026',
        hora: '19:30:00',

        nif: 'B01000012',
        nombre: 'Cliente de ejemplo S.L.',
        direccion: 'Calle de ejemplo 1',
        cp: '48001',

        serie: 'A',
        numero: '2026001000',

        simplificadas: [
            {
                serie: 'S',
                numero: '2026000010',
                fecha: '15/08/2026'
            },
            {
                serie: 'S',
                numero: '2026000011',
                fecha: '15/08/2026'
            }
        ]
    });
```

La nueva factura completa tiene su propia serie y número.

TicketBaiWS documenta esta operación como conversión/sustitución de facturas simplificadas, no como factura rectificativa.

## Respuesta

La respuesta utiliza actualmente el formato TicketBAI:

```ts
TicketBaiWsSuccessResponse<
    TicketBaiWsTicketBaiInvoiceResult
>
```

por tanto:

```ts
response.return.huella_tbai
response.return.qr
response.return.url
```

---

# Consultar una factura

```ts
const response = await client.invoices.get({
    serie: 'A',
    numero: '2026000123'
});
```

El argumento utiliza:

```ts
TicketBaiWsInvoiceReference
```

El SDK genera una petición GET con query string:

```text
GET /tbai/?serie=A&numero=2026000123
```

No envía un body JSON en la petición GET.

## Estado

La consulta añade:

```ts
status
```

con uno de estos valores:

```ts
type TicketBaiWsInvoiceStatus =
    | 'OK'
    | 'PENDING'
    | 'ERROR';
```

La respuesta puede ser TicketBAI:

```ts
{
    status: 'OK',
    huella_tbai: '...',
    qr: '...',
    url: '...'
}
```

o Verifactu:

```ts
{
    status: 'OK',
    huella: '...',
    qr: '...',
    url: '...'
}
```

Tipos públicos:

```ts
TicketBaiWsGetInvoiceResponse
TicketBaiWsGetInvoiceResult
TicketBaiWsTicketBaiInvoiceStatusResult
TicketBaiWsVerifactuInvoiceStatusResult
TicketBaiWsInvoiceStatus
```

---

# Listar facturas

```ts
const response = await client.invoices.list({
    fecha_inicio: '01/08/2026',
    fecha_fin: '31/08/2026'
});
```

El request es:

```ts
interface TicketBaiWsListInvoicesRequest {
    readonly fecha_inicio: string;
    readonly fecha_fin: string;
    readonly serie?: string;
    readonly pagina?: number;
    readonly json_orig?: boolean;
    readonly xml_request?: boolean;
    readonly pedido?: boolean;
}
```

## Filtros

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `fecha_inicio` | `string` | Fecha inicial del rango. |
| `fecha_fin` | `string` | Fecha final del rango. |
| `serie` | `string` | Limita el resultado a una serie. |
| `pagina` | `number` | Página del listado. |
| `json_orig` | `boolean` | Solicita incluir el JSON original cuando TicketBaiWS lo proporcione. |
| `xml_request` | `boolean` | Solicita incluir el XML de envío cuando TicketBaiWS lo proporcione. |
| `pedido` | `boolean` | Solicita incluir información de pedido cuando proceda. |

Ejemplo:

```ts
const response = await client.invoices.list({
    fecha_inicio: '01/08/2026',
    fecha_fin: '31/08/2026',
    serie: 'A',
    pagina: 1,
    json_orig: true,
    xml_request: false,
    pedido: false
});
```

El SDK lo convierte en una petición GET con parámetros de consulta.

## Paginación y `count`

TicketBaiWS limita el listado a 250 resultados por página.

Además del sobre normal:

```ts
result
return
msg
```

la respuesta contiene:

```ts
count: string;
```

El SDK conserva `count` como `string` porque así aparece en el contrato/respuesta documentado por el servicio.

Ejemplo:

```ts
const response = await client.invoices.list({
    fecha_inicio: '01/01/2026',
    fecha_fin: '31/12/2026',
    pagina: 1
});

console.log(response.count);

for (const invoice of response.return) {
    console.log(
        invoice.serie,
        invoice.numero,
        invoice.status
    );
}
```

## Elemento de listado

Los campos conocidos son:

```ts
interface TicketBaiWsInvoiceListItem {
    readonly status: 'OK' | 'PENDING' | 'ERROR';
    readonly serie: string;
    readonly numero: string;
    readonly fecha: string;
    readonly fecha_factura: string;
    readonly nif: string;
    readonly importe: number;
    readonly zuzendu: boolean;

    readonly [key: string]: unknown;
}
```

El índice:

```ts
readonly [key: string]: unknown;
```

es intencionado.

Si se activan opciones como `json_orig`, `xml_request` o `pedido`, TicketBaiWS puede incorporar datos adicionales al elemento. El SDK conserva esos datos sin imponer un modelo cerrado que pudiera descartar campos añadidos por el API.

---

# Anular una factura

```ts
const response = await client.invoices.cancel({
    serie: 'A',
    numero: '2026000123'
});
```

También puede indicarse:

```ts
fecha
```

cuando sea necesario identificar la emisión concreta:

```ts
await client.invoices.cancel({
    serie: 'A',
    numero: '2026000123',
    fecha: '17/08/2026'
});
```

Modelo:

```ts
interface TicketBaiWsCancelInvoiceRequest {
    readonly serie: string;
    readonly numero: string;
    readonly fecha?: string;
}
```

TicketBaiWS documenta que, si se omite `fecha`, utilizará la última factura emitida que coincida con serie y número.

La anulación se envía mediante:

```text
DELETE /tbai/
```

con el objeto como JSON.

## Respuesta

El contenido concreto de `return` no está modelado con campos fiscales específicos:

```ts
type TicketBaiWsInvoiceActionResult =
    Readonly<Record<string, unknown>>;
```

Esto permite conservar la respuesta del servicio sin asumir campos que TicketBaiWS no mantiene como contrato estable para esta acción.

---

# Forzar un reenvío

```ts
const response = await client.invoices.resend({
    serie: 'A',
    numero: '2026000123'
});
```

Esta operación utiliza:

```text
PUT /reset-tbai/
```

y está pensada para volver a poner en proceso un envío que previamente haya quedado en error.

El request utiliza de nuevo:

```ts
TicketBaiWsInvoiceReference
```

Ejemplo:

```ts
await client.invoices.resend({
    serie: 'A',
    numero: '2026000123'
});
```

TicketBaiWS muestra como mensaje de éxito un cambio del estado a `PENDING`.

El SDK conserva el resultado como:

```ts
TicketBaiWsResendInvoiceResponse
```

cuyo `return` es un:

```ts
Readonly<Record<string, unknown>>
```

No se debe asumir que `resend()` recrea o modifica los datos de la factura. Su función es solicitar el reenvío del registro ya existente.

---

# Descargar XML

```ts
const response = await client.invoices.getXml({
    serie: 'A',
    numero: '2026000123'
});
```

La operación utiliza:

```text
GET /tbai-xml/
```

mediante query string.

## Respuesta

```ts
interface TicketBaiWsInvoiceXmlResult {
    readonly xml_request: string;
    readonly xml_response: string;
}
```

Por tanto:

```ts
const response = await client.invoices.getXml({
    serie: 'A',
    numero: '2026000123'
});

console.log(response.return.xml_request);
console.log(response.return.xml_response);
```

`xml_request` representa el XML generado/enviado y `xml_response` la respuesta XML recibida, de acuerdo con los datos proporcionados por TicketBaiWS.

El SDK no analiza los XML ni los convierte a objetos JavaScript.

---

# Descargar PDF

```ts
const response = await client.invoices.getPdf({
    serie: 'A',
    numero: '2026000123'
});
```

La operación utiliza:

```text
GET /tbai-pdf/
```

La respuesta es:

```ts
TicketBaiWsSuccessResponse<string>
```

donde:

```ts
response.return
```

contiene el PDF codificado en Base64.

Ejemplo:

```ts
const response = await client.invoices.getPdf({
    serie: 'A',
    numero: '2026000123'
});

const pdfBase64 = response.return;
```

El SDK no convierte el Base64 a `Buffer`, `Blob`, archivo o URL.

Esta decisión mantiene la librería universal. Cada consumidor puede realizar la conversión adecuada para su entorno.

## Ejemplo en navegador

```ts
const binary = atob(pdfBase64);

const bytes = Uint8Array.from(
    binary,
    char => char.charCodeAt(0)
);

const blob = new Blob(
    [bytes],
    {
        type: 'application/pdf'
    }
);
```

Este código es solo un ejemplo de consumo. No forma parte del SDK.

---

# Descargar FacturaE

```ts
const response = await client.invoices.getFacturaE({
    serie: 'A',
    numero: '2026000123'
});
```

La operación utiliza:

```text
GET /facturae/
```

y devuelve el documento como Base64:

```ts
TicketBaiWsFacturaEResponse
```

equivalente a:

```ts
TicketBaiWsSuccessResponse<string>
```

## Parámetros opcionales DIR3

El request es:

```ts
interface TicketBaiWsFacturaERequest {
    readonly serie: string;
    readonly numero: string;
    readonly cod_organo_gestor?: string;
    readonly cod_unidad_tramitadora?: string;
    readonly cod_oficina_contable?: string;
}
```

Ejemplo:

```ts
const response = await client.invoices.getFacturaE({
    serie: 'A',
    numero: '2026000123',

    cod_organo_gestor: 'A01021700',
    cod_unidad_tramitadora: 'A01021700',
    cod_oficina_contable: 'A01021700'
});

const facturaEBase64 = response.return;
```

Los códigos DIR3 solo deben proporcionarse cuando correspondan al destinatario de la factura.

El SDK no valida su existencia ni consulta directorios externos.

La generación y firma efectiva del documento dependen de TicketBaiWS y de la configuración/certificados que requiera el servicio.

---

# Tipos públicos

Los principales tipos de facturación se importan desde el entry point del paquete:

```ts
import type {
    TicketBaiWsCancelInvoiceRequest,
    TicketBaiWsCancelInvoiceResponse,
    TicketBaiWsCompleteInvoiceRequest,
    TicketBaiWsCompleteInvoiceResponse,
    TicketBaiWsCreateInvoiceRequest,
    TicketBaiWsCreateInvoiceResponse,
    TicketBaiWsCreateInvoiceResult,
    TicketBaiWsDocumentType,
    TicketBaiWsExemptionCause,
    TicketBaiWsFacturaERequest,
    TicketBaiWsFacturaEResponse,
    TicketBaiWsGetInvoiceResponse,
    TicketBaiWsGetInvoiceResult,
    TicketBaiWsInvoiceLine,
    TicketBaiWsInvoiceListItem,
    TicketBaiWsInvoicePdfResponse,
    TicketBaiWsInvoiceReference,
    TicketBaiWsInvoiceStatus,
    TicketBaiWsInvoiceXmlResponse,
    TicketBaiWsInvoiceXmlResult,
    TicketBaiWsListInvoicesRequest,
    TicketBaiWsListInvoicesResponse,
    TicketBaiWsOperationType,
    TicketBaiWsRectificationKey,
    TicketBaiWsRectificationType,
    TicketBaiWsRectifiedInvoice,
    TicketBaiWsResendInvoiceResponse,
    TicketBaiWsSimplifiedInvoiceReference,
    TicketBaiWsThirdPartyIssue,
    TicketBaiWsTicketBaiInvoiceResult,
    TicketBaiWsTicketBaiInvoiceStatusResult,
    TicketBaiWsVerifactuInvoiceResult,
    TicketBaiWsVerifactuInvoiceStatusResult
} from '@osumi/ticketbaiws';
```

No es necesario importar desde rutas internas como:

```text
@osumi/ticketbaiws/lib/model/...
```

Las rutas internas no forman parte de la API pública del paquete.

---

# Errores

Todos los métodos de `client.invoices` utilizan el transporte HTTP común de `@osumi/ticketbaiws`.

Por ello pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Ejemplo:

```ts
import {
    TicketBaiWsApiError,
    TicketBaiWsHttpError
} from '@osumi/ticketbaiws';

try {
    const response = await client.invoices.get({
        serie: 'A',
        numero: '2026000123'
    });

    console.log(response.return);
}
catch (error: unknown) {
    if (error instanceof TicketBaiWsApiError) {
        console.error(
            'TicketBaiWS rechazó la operación:',
            error.apiResponse
        );
    }
    else if (error instanceof TicketBaiWsHttpError) {
        console.error(
            'Error HTTP:',
            error.status,
            error.responseBody
        );
    }
    else {
        throw error;
    }
}
```

Consulta [Primeros pasos](getting-started.md) para la jerarquía completa de errores.

---

# Notas sobre la documentación oficial

## GET mediante query string

La documentación oficial de TicketBaiWS contiene ejemplos distintos según el lenguaje.

En algunos casos, los ejemplos cURL/PHP envían JSON en el cuerpo de una petición GET, mientras Python, C++ o Java utilizan parámetros en la URL.

`@osumi/ticketbaiws` adopta una política única:

> Los parámetros de las operaciones GET se envían mediante query string.

Esto se aplica a:

```ts
client.invoices.get(...)
client.invoices.list(...)
client.invoices.getXml(...)
client.invoices.getPdf(...)
client.invoices.getFacturaE(...)
```

El consumidor solo proporciona el objeto tipado; el SDK construye la URL.

## Reglas fiscales condicionales

La documentación de TicketBaiWS contiene numerosas reglas dependientes de:

- territorio;
- tipo de factura;
- condición del cliente;
- régimen IVA;
- operación intracomunitaria;
- exportación;
- factura rectificativa;
- Bizkaia/BATUZ;
- Verifactu.

Los tipos del SDK intentan hacer imposible lo claramente inválido cuando el contrato ofrece un catálogo cerrado, pero no pretenden codificar toda la normativa fiscal.

Por ejemplo:

```ts
nif?: string;
nombre?: string;
```

son opcionales en el modelo porque una factura simplificada puede no requerirlos.

Eso no significa que puedan omitirse libremente en cualquier factura completa.

## Valores Base64

`qr`, PDF y FacturaE se conservan como strings Base64.

No se convierten automáticamente para evitar acoplar el SDK a Node.js o al navegador.

## TicketBAI y Verifactu

La misma operación:

```ts
client.invoices.create(...)
```

puede devolver formatos distintos para la huella:

```text
TicketBAI → huella_tbai
Verifactu → huella
```

El SDK conserva ambos contratos en una unión TypeScript.

---

# Documentación oficial

Documentación general:

https://ticketbaiws.eus/es/documentacion-api/

Nueva factura TicketBAI / Verifactu:

https://ticketbaiws.eus/es/documentacion-api/ticketbai-post/

Completar factura simplificada:

https://ticketbaiws.eus/es/documentacion-api/tbai-completar-post/

Consulta de factura:

https://ticketbaiws.eus/es/documentacion-api/ticketbai-get/

Listado de facturas:

https://ticketbaiws.eus/es/documentacion-api/ticketbai-list-get/

Anulación:

https://ticketbaiws.eus/es/documentacion-api/ticketbai-del/

Reenvío / reset:

https://ticketbaiws.eus/es/documentacion-api/reset-tbai-put/

Descarga XML:

https://ticketbaiws.eus/es/documentacion-api/ticketbai-xml-get/

Descarga PDF:

https://ticketbaiws.eus/es/documentacion-api/tbai-pdf-get/

FacturaE:

https://ticketbaiws.eus/es/documentacion-api/facturae-get/

---

[← Volver al índice de documentación](README.md)
