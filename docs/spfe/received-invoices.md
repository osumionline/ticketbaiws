# SPFE — Facturas electrónicas recibidas

[← Volver al índice de documentación](../README.md)

Esta guía documenta el recurso:

```ts
client.spfe.receivedInvoices;
```

Permite consultar las facturas electrónicas recibidas
de proveedores a través de la Solución Pública de
Facturación Electrónica (SPFE) de la AEAT.

## Alcance y requisitos

TicketBaiWS consulta y descarga periódicamente de la
AEAT las facturas electrónicas recibidas por una empresa.

Berein documenta una sincronización automática
aproximadamente cada hora.

Para utilizar esta funcionalidad, la empresa debe
tener SPFE activado y disponer de la autorización
necesaria para consultar las facturas recibidas.

La consulta se realiza con el certificado electrónico
configurado en la ficha de empresa.

El SDK no gestiona certificados ni autorizaciones
en la AEAT.

## Método disponible

```ts
client.spfe.receivedInvoices.list(...)
```

Correspondencia:

| SDK      | HTTP  | Endpoint          |
| -------- | ----- | ----------------- |
| `list()` | `GET` | `spfe-recibidas/` |

No se implementan métodos de alta, modificación
o anulación de facturas recibidas en este recurso.

Para comunicar su pago o rechazo debe utilizarse
`client.spfe.statuses.create()`.

## Consultar las facturas

Una consulta sin filtros:

```ts
const response = await client.spfe.receivedInvoices.list();

for (const invoice of response.return) {
  console.log(
    invoice.id,
    invoice.factura,
    invoice.nombre_emisor,
    invoice.total,
  );
}
```

La respuesta conserva el sobre original de TicketBaiWS:

```ts
{
    result: 'OK',
    return: [...],
    msg: null
}
```

`return` contiene un array de facturas.

El SDK no transforma los datos ni convierte
automáticamente las facturas en registros de la
aplicación consumidora.

## Filtros disponibles

El modelo de petición es:

```ts
interface TicketBaiWsListSpfeReceivedInvoicesRequest {
  readonly desde_id?: number;
  readonly id?: number;
  readonly estado?: TicketBaiWsSpfeReceivedInvoiceState;
  readonly nif_emisor?: string;
  readonly factura?: string;
  readonly desde?: string;
  readonly hasta?: string;
  readonly limite?: number;
  readonly ubl?: boolean;
}
```

Todos los filtros son opcionales.

### `desde_id`

Devuelve únicamente facturas cuyo identificador
sea mayor que el indicado.

Es especialmente útil para sincronización incremental.

```ts
const response = await client.spfe.receivedInvoices.list({
  desde_id: 56,
});
```

Berein documenta que los resultados se devuelven
ordenados por ID ascendente.

El SDK conserva el orden recibido.

### `id`

Permite consultar una factura concreta:

```ts
const response = await client.spfe.receivedInvoices.list({
  id: 57,
});
```

Aunque se busque un único ID, `return` sigue siendo
un array.

### `estado`

Los estados disponibles son:

```ts
type TicketBaiWsSpfeReceivedInvoiceState = 'pendiente' | 'pagada' | 'rechazada';
```

Ejemplo:

```ts
const response = await client.spfe.receivedInvoices.list({
  estado: 'pendiente',
});
```

Estos estados son independientes del resultado
general `OK` o `ERROR` del API.

### `nif_emisor` y `factura`

Permiten buscar por proveedor o por identificador
de factura:

```ts
const response = await client.spfe.receivedInvoices.list({
  nif_emisor: 'B01000012',
  factura: 'F2026-0153',
});
```

### `desde` y `hasta`

Filtran por fecha de expedición de la factura.

Las fechas utilizan formato `dd/mm/yyyy`:

```ts
const response = await client.spfe.receivedInvoices.list({
  desde: '01/11/2026',
  hasta: '30/11/2026',
});
```

El SDK no realiza conversiones entre formatos
de fecha.

### `limite`

Permite limitar la cantidad de resultados:

```ts
limite: 500;
```

Berein documenta:

- Valor predeterminado: 100.
- Valor máximo: 500.

El SDK no sustituye ni corrige automáticamente
el valor solicitado.

### `ubl`

Permite incluir el XML UBL original de cada factura.

```ts
ubl: true;
```

El valor predeterminado documentado por Berein
es `false`.

El SDK no solicita el XML si el consumidor no
lo indica expresamente.

## Modelo de factura recibida

Cada registro se representa mediante:

```ts
interface TicketBaiWsSpfeReceivedInvoice {
  readonly id: number;
  readonly factura: string;
  readonly fecha_factura: string;
  readonly tipo_factura: string;
  readonly copia: boolean;
  readonly nif_emisor: string;
  readonly nombre_emisor: string;
  readonly base: number;
  readonly cuota: number;
  readonly total: number;
  readonly vencimiento: string | null;
  readonly estado: TicketBaiWsSpfeReceivedInvoiceState;
  readonly localizador: string;
  readonly fecha_descarga: string;
  readonly ubl?: string;
  readonly [key: string]: unknown;
}
```

### Identificación

`id` es el identificador asignado por TicketBaiWS.

`factura` contiene la serie y número proporcionados
por el emisor de la factura.

`fecha_factura` es la fecha de expedición,
en formato `dd/mm/yyyy`.

### Tipo de factura UBL

El campo `tipo_factura` contiene un código UBL.

Entre los códigos documentados están:

| Código  | Tipo                  |
| ------- | --------------------- |
| `'380'` | Factura               |
| `'381'` | Abono                 |
| `'384'` | Factura rectificativa |
| `'386'` | Factura de anticipo   |
| `'389'` | Autofactura           |

El SDK mantiene `tipo_factura` como `string`.

No restringe el campo a estos cinco valores
porque el estándar UBL puede contemplar otros
códigos válidos.

### Copias

El campo:

```ts
copia: boolean;
```

indica si el documento es una copia de la factura.

### Datos del emisor

Los campos:

```ts
nif_emisor: string;
nombre_emisor: string;
```

identifican al proveedor.

Estos datos pueden reutilizarse para comunicar
el pago o rechazo mediante `spfe.statuses.create()`.

### Importes

Los campos:

```ts
base: number;
cuota: number;
total: number;
```

representan la base imponible, la cuota de IVA
y el importe total de la factura.

El SDK conserva estos importes como números,
siguiendo el contrato publicado.

No calcula impuestos ni realiza redondeos.

### Vencimiento

El campo:

```ts
vencimiento: string | null;
```

contiene la fecha de vencimiento en formato
`dd/mm/yyyy`, o `null` cuando no existe.

### Estado

Los estados posibles son:

```ts
'pendiente';
'pagada';
'rechazada';
```

Para comunicar un nuevo estado de pago o rechazo
debe utilizarse el recurso SPFE de estados.

### Localizador y fecha de descarga

`localizador` identifica la factura en SPFE.

`fecha_descarga` indica cuándo TicketBaiWS descargó
el documento desde la AEAT.

El SDK devuelve ambos valores sin modificarlos.

## Obtener el XML UBL

El formato UBL es el documento electrónico de la
factura tal como lo proporciona la AEAT.

Para solicitarlo:

```ts
const response = await client.spfe.receivedInvoices.list({
  id: 57,
  ubl: true,
});

const invoice = response.return[0];

if (invoice?.ubl !== undefined) {
  console.log(invoice.ubl);
}
```

El XML se recibe mediante la propiedad opcional:

```ts
ubl?: string
```

El SDK no lo interpreta, valida, transforma ni
convierte a otros formatos.

La aplicación consumidora debe decidir cómo
almacenarlo y procesarlo.

Al solicitar `ubl: true`, las respuestas pueden
tener un tamaño considerablemente mayor.

## Sincronización incremental

Berein recomienda utilizar `desde_id` para recuperar
únicamente las facturas nuevas.

El procedimiento consiste en conservar el ID
más alto que se haya procesado correctamente.

### Primera consulta

Si todavía no existe un cursor guardado:

```ts
const response = await client.spfe.receivedInvoices.list({
  desde_id: 0,
  limite: 500,
});
```

El SDK mantiene `desde_id: 0` y lo envía
como parámetro GET.

### Consultas posteriores

Si la última factura procesada tiene ID 58:

```ts
const response = await client.spfe.receivedInvoices.list({
  desde_id: 58,
  limite: 500,
});
```

Berein devolverá únicamente las facturas
con ID superior, en orden ascendente.

### Gestión del cursor

El SDK no almacena ni modifica el cursor.

La aplicación consumidora es responsable de
guardar el último ID procesado.

La regla recomendada es:

**No avanzar el cursor hasta haber guardado
correctamente la factura correspondiente.**

Flujo conceptual:

```text
1. Leer último ID persistido
2. Consultar SPFE mediante desde_id
3. Comprobar result y msg
4. Procesar las facturas en el orden recibido
5. Guardar cada factura correctamente
6. Avanzar el cursor tras confirmar su persistencia
7. Repetir la consulta cuando corresponda
```

El proceso debe poder recuperarse después de
un fallo sin perder facturas.

Es recomendable que la aplicación utilice
identificadores únicos y operaciones de
almacenamiento idempotentes para evitar duplicados.

El SDK no implementa sincronización automática,
reintentos programados ni almacenamiento local.

## Avisos de autorización

La AEAT puede impedir la consulta de facturas
cuando falta autorización, el certificado no existe,
ha caducado o ha sido revocado.

Berein documenta respuestas como:

```json
{
  "result": "OK",
  "return": [],
  "msg": "SPFE: not authorized to query received invoices"
}
```

Esto significa que una respuesta `OK` con lista vacía
no garantiza que no haya facturas pendientes.

La aplicación debe comprobar también `msg`.

Ejemplo:

```ts
const response = await client.spfe.receivedInvoices.list({
  desde_id: 58,
});

if (response.msg !== null && response.msg !== '') {
  console.warn('Aviso SPFE:', response.msg);
}

console.log('Facturas recuperadas:', response.return.length);
```

`msg` puede ser una cadena, un array o `null`.

Ante un aviso de autorización, la aplicación debe
revisar la situación antes de considerar
completada la sincronización.

**No debe avanzar el cursor basándose únicamente
en una respuesta vacía acompañada de un aviso.**

## Comunicar pagos y rechazos

Las facturas recibidas pueden pasar a los estados
`pagada` o `rechazada`.

Para comunicar estos cambios se utiliza:

```ts
client.spfe.statuses.create(...)
```

Ejemplo de pago utilizando una factura recibida:

```ts
const response = await client.spfe.receivedInvoices.list({
  id: 57,
});

const invoice = response.return[0];

if (invoice !== undefined && invoice.vencimiento !== null) {
  await client.spfe.statuses.create({
    estado: 'pago',
    factura: invoice.factura,
    fecha_factura: invoice.fecha_factura,
    nif_emisor: invoice.nif_emisor,
    nombre_emisor: invoice.nombre_emisor,
    vencimiento: invoice.vencimiento,
  });
}
```

El ejemplo muestra cómo reutilizar los datos
de identificación de la factura.

La aplicación consumidora sigue siendo responsable
de determinar cuándo se ha producido realmente el
pago y qué fecha corresponde comunicar.

Consulta [Estados SPFE](statuses.md) para conocer
las cuatro modalidades disponibles.

## Notificaciones por webhook

TicketBaiWS puede notificar la llegada de una nueva
factura recibida mediante el evento:

```ts
'spfe_recibida';
```

El SDK publica el tipo:

```ts
TicketBaiWsSpfeReceivedWebhookNotification;
```

Esta notificación no contiene el XML UBL.

Para obtener el documento completo, debe utilizarse
la consulta de facturas recibidas con `ubl: true`.

Consulta [Webhooks](../webhooks.md) para más detalles.

## Respuesta del SDK

El método devuelve:

```ts
type TicketBaiWsListSpfeReceivedInvoicesResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsSpfeReceivedInvoice[]
>;
```

La respuesta contiene el sobre original de TicketBaiWS.

El SDK no desempaqueta `return` ni elimina `msg`.

Si el API devuelve `result: 'ERROR'`, se lanza
`TicketBaiWsApiError`.

Si la consulta GET devuelve inesperadamente
`result: 'PENDING'`, el cliente HTTP lanza
`TicketBaiWsResponseError`.

## Tipos públicos

Todos los tipos se exportan desde `@osumi/ticketbaiws`:

```ts
import type {
  TicketBaiWsListSpfeReceivedInvoicesRequest,
  TicketBaiWsListSpfeReceivedInvoicesResponse,
  TicketBaiWsSpfeReceivedInvoice,
  TicketBaiWsSpfeReceivedInvoiceState,
} from '@osumi/ticketbaiws';
```

No es necesario importar archivos internos.

## Documentación oficial

- [Consultar facturas recibidas SPFE](https://ticketbaiws.eus/es/spfe-recibidas-get/)
- [Comunicar estados SPFE](https://ticketbaiws.eus/es/spfe-estados-post/)
- [Documentación general de TicketBaiWS](https://ticketbaiws.eus/es/documentacion-api/)

---

[← Volver al índice de documentación](../README.md)
