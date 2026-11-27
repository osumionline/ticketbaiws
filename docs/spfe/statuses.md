# SPFE — Comunicación y consulta de estados

[← Volver al índice de documentación](../README.md)

Esta guía documenta el recurso:

```ts
client.spfe.statuses;
```

Permite comunicar y consultar estados de facturas en la
Solución Pública de Facturación Electrónica (SPFE) de la AEAT.

## Alcance y requisitos

TicketBaiWS permite comunicar cuatro estados:

| Estado    | Significado                      | Tipo de factura |
| --------- | -------------------------------- | --------------- |
| `cobro`   | Factura cobrada                  | Emitida         |
| `impago`  | Factura no pagada al vencimiento | Emitida         |
| `pago`    | Factura pagada                   | Recibida        |
| `rechazo` | Factura rechazada                | Recibida        |

Estos métodos requieren que la empresa tenga activada
la facturación electrónica B2B mediante SPFE.

Esta configuración puede gestionarse en el área privada
de Berein o mediante la propiedad `spfe` de los métodos
de empresas del SDK.

El SDK no activa SPFE automáticamente ni determina cuándo
corresponde comunicar un estado conforme a la normativa.

## Resumen de métodos

```ts
client.spfe.statuses.create(...)
client.spfe.statuses.list(...)
```

| SDK        | HTTP   | Endpoint        |
| ---------- | ------ | --------------- |
| `create()` | `POST` | `spfe-estados/` |
| `list()`   | `GET`  | `spfe-estados/` |

No existe un método independiente para anular un estado.

La anulación utiliza `create()` con `baja: true`.

## Modelo de petición

La petición se representa mediante:

```ts
type TicketBaiWsSpfeStatusRequest =
  | TicketBaiWsSpfeCollectionRequest
  | TicketBaiWsSpfeNonPaymentRequest
  | TicketBaiWsSpfePaymentRequest
  | TicketBaiWsSpfeRejectionRequest;
```

El SDK utiliza una unión discriminada mediante `estado`.

Esto permite que TypeScript compruebe los campos
obligatorios de cada modalidad.

### Campos comunes

Las cuatro modalidades admiten:

```ts
interface TicketBaiWsSpfeStatusRequestBase {
  readonly baja?: boolean;
  readonly fecha?: string;
  readonly fecha_recepcion_mercancia?: string;
  readonly fecha_recepcion_factura?: string;
  readonly sincrono?: boolean;
}
```

`fecha` corresponde a la fecha del evento comunicado,
en formato `dd/mm/yyyy`.

Berein documenta que no puede ser futura y que,
si se omite, se utiliza la fecha actual.

`fecha_recepcion_mercancia` y
`fecha_recepcion_factura` permiten informar las fechas
relevantes para calcular los plazos de pago.

El SDK conserva todas las fechas como cadenas de texto;
no realiza conversiones ni validaciones fiscales.

## Identificación de la factura

La identificación depende de si la factura fue
emitida o recibida.

### Facturas emitidas

Se utilizan:

```ts
serie: string;
numero: string;
fecha_factura?: string;
```

`serie` y `numero` son obligatorios.

`fecha_factura` es opcional y puede ayudar a
distinguir facturas con la misma serie y número.

### Facturas recibidas

Se utilizan:

```ts
factura: string;
fecha_factura: string;
nif_emisor: string;
nombre_emisor: string;
```

Los cuatro campos son obligatorios.

Son los mismos datos de identificación disponibles
en la consulta de facturas recibidas mediante:

```ts
client.spfe.receivedInvoices.list(...)
```

Esto permite utilizar la información de una factura
recibida al comunicar su pago o rechazo.

## Comunicar un cobro

Un cobro corresponde a una factura emitida.

Modelo:

```ts
interface TicketBaiWsSpfeCollectionRequest extends TicketBaiWsSpfeIssuedInvoiceStatus {
  readonly estado: 'cobro';
  readonly vencimiento?: string;
  readonly financiacion?: boolean;
}
```

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'cobro',
  serie: 'A',
  numero: '2026000245',
  fecha: '10/11/2026',
  financiacion: false,
});
```

El campo `financiacion` indica si el cobro se realizó
mediante un instrumento de financiación concertado
por el emisor.

La fecha de vencimiento es opcional para cobros.

## Comunicar un impago

Un impago también corresponde a una factura emitida.

Modelo:

```ts
interface TicketBaiWsSpfeNonPaymentRequest extends TicketBaiWsSpfeIssuedInvoiceStatus {
  readonly estado: 'impago';
  readonly vencimiento: string;
}
```

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'impago',
  serie: 'A',
  numero: '2026000245',
  vencimiento: '27/11/2026',
});
```

En esta modalidad, `vencimiento` es obligatorio.

Identifica la fecha en la que debía haberse pagado
la factura.

## Comunicar el pago de una factura recibida

Modelo:

```ts
interface TicketBaiWsSpfePaymentRequest extends TicketBaiWsSpfeReceivedInvoiceStatus {
  readonly estado: 'pago';
  readonly vencimiento: string;
  readonly rectificada?: boolean;
  readonly rectificativa_negativa?: boolean;
}
```

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'pago',
  factura: 'F2026-0153',
  fecha_factura: '03/11/2026',
  nif_emisor: 'B01000012',
  nombre_emisor: 'Empresa de ejemplo S.L.',
  fecha: '10/11/2026',
  vencimiento: '03/12/2026',
});
```

`vencimiento` es obligatorio.

También pueden informarse:

- `rectificada`: la factura pagada fue rectificada.
- `rectificativa_negativa`: factura rectificativa
  negativa sin pago asociado.

Estas propiedades son opcionales y no se calculan
automáticamente.

## Comunicar el rechazo de una factura recibida

Modelo:

```ts
interface TicketBaiWsSpfeRejectionRequest extends TicketBaiWsSpfeReceivedInvoiceStatus {
  readonly estado: 'rechazo';
  readonly vencimiento?: string;
  readonly motivo_rechazo?: TicketBaiWsSpfeRejectionReason;
}
```

Los motivos documentados son:

```ts
type TicketBaiWsSpfeRejectionReason = '01' | '02';
```

| Código | Motivo                                        |
| ------ | --------------------------------------------- |
| `'01'` | Rechazo comercial                             |
| `'02'` | Consumo particular o no afecto a la actividad |

Berein documenta `'01'` como valor predeterminado.

El SDK no añade automáticamente ese valor al JSON.

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'rechazo',
  factura: 'F2026-0153',
  fecha_factura: '03/11/2026',
  nif_emisor: 'B01000012',
  nombre_emisor: 'Empresa de ejemplo S.L.',
  motivo_rechazo: '02',
});
```

## Anular un estado comunicado

Para solicitar la anulación de un estado, se repite
la petición correspondiente incluyendo:

```ts
baja: true;
```

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'pago',
  factura: 'F2026-0153',
  fecha_factura: '03/11/2026',
  nif_emisor: 'B01000012',
  nombre_emisor: 'Empresa de ejemplo S.L.',
  vencimiento: '03/12/2026',
  baja: true,
});
```

No hay un método `cancel()` o `delete()` en este recurso.

El SDK utiliza el mismo POST para comunicar y
anular estados, siguiendo el contrato de Berein.

## Procesamiento asíncrono

Por defecto, Berein deja los estados en una cola
para enviarlos posteriormente a la AEAT.

Por tanto, una respuesta válida puede tener:

```ts
result: 'PENDING';
```

Esto no indica un error del SDK.

El método `create()` permite ambos resultados:

```ts
'OK' | 'PENDING';
```

Su tipo de respuesta es:

```ts
type TicketBaiWsSpfeStatusResponse =
  TicketBaiWsNonErrorResponse<TicketBaiWsSpfeStatusRecord>;
```

### Solicitar procesamiento síncrono

Puede enviarse:

```ts
sincrono: true;
```

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'cobro',
  serie: 'A',
  numero: '2026000245',
  sincrono: true,
});
```

Con esta opción se solicita a Berein que comunique
el estado a la AEAT durante la propia petición.

El SDK no añade `sincrono: true` por defecto.

### Cómo interpretar `PENDING`

Ejemplo:

```ts
const response = await client.spfe.statuses.create({
  estado: 'cobro',
  serie: 'A',
  numero: '2026000245',
});

if (response.result === 'PENDING') {
  console.log('Estado en cola:', response.return.id);
} else {
  console.log('Resultado:', response.return.result);
}
```

Cuando el resultado es `PENDING`, la aplicación debe
consultar posteriormente el estado mediante `list()`.

No debe considerar un estado pendiente como aceptado
definitivamente por la AEAT.

## Modelo de respuesta

Un registro utiliza:

```ts
interface TicketBaiWsSpfeStatusRecord {
  readonly id: number;
  readonly estado: TicketBaiWsSpfeStatusKind;
  readonly baja: boolean;
  readonly factura: string;
  readonly fecha_factura?: string;
  readonly nif_emisor?: string;
  readonly fecha?: string | null;
  readonly vencimiento?: string | null;
  readonly result: TicketBaiWsSpfeStatusResult;
  readonly errores: readonly TicketBaiWsSpfeStatusError[];
  readonly [key: string]: unknown;
}
```

El resultado individual puede ser:

```ts
type TicketBaiWsSpfeStatusResult = 'PENDING' | 'OK' | 'ERROR';
```

Significado:

| Resultado | Interpretación               |
| --------- | ---------------------------- |
| `PENDING` | Pendiente de procesamiento   |
| `OK`      | Aceptado por la AEAT         |
| `ERROR`   | Rechazado; consultar errores |

Los errores se representan mediante:

```ts
interface TicketBaiWsSpfeStatusError {
  readonly codigo: string;
  readonly descripcion: string;
}
```

### Dos niveles de resultado

Una respuesta de creación tiene un resultado general:

```ts
response.result;
```

y otro propio del estado comunicado:

```ts
response.return.result;
```

No son conceptos equivalentes.

En las consultas pueden aparecer registros cuyo
`result` individual sea `ERROR` aunque la consulta
general haya terminado correctamente.

## Errores de la API

Cuando Berein devuelve:

```ts
result: 'ERROR';
```

en el nivel general, el cliente HTTP lanza
`TicketBaiWsApiError`.

El error conserva el objeto de respuesta completo:

```ts
import { TicketBaiWsApiError } from '@osumi/ticketbaiws';

try {
  await client.spfe.statuses.create({
    estado: 'cobro',
    serie: 'A',
    numero: '2026000245',
    sincrono: true,
  });
} catch (error: unknown) {
  if (error instanceof TicketBaiWsApiError) {
    console.error(error.message);
    console.error(error.apiResponse.return);
  } else {
    throw error;
  }
}
```

`error.apiResponse.return` se conserva como `unknown`
porque la forma concreta de una respuesta de error
puede variar.

El consumidor debe comprobar su estructura antes
de acceder a propiedades específicas.

Una respuesta HTTP 200 también puede contener
`result: 'ERROR'` y provocar esta excepción.

## Consultar estados comunicados

Se utiliza:

```ts
client.spfe.statuses.list(...)
```

Sin filtros:

```ts
const response = await client.spfe.statuses.list();
```

Berein documenta la devolución de los últimos
100 estados comunicados.

El SDK no implementa paginación automática.

### Filtros disponibles

```ts
interface TicketBaiWsListSpfeStatusesRequest {
  readonly id?: number;
  readonly serie?: string;
  readonly numero?: string;
  readonly factura?: string;
  readonly nif_emisor?: string;
}
```

Todos son opcionales y se pueden combinar.

Ejemplo:

```ts
const response = await client.spfe.statuses.list({
  factura: 'F2026-0153',
  nif_emisor: 'B01000012',
});

for (const item of response.return) {
  console.log(item.id, item.estado, item.result);
}
```

Para consultar un estado concreto utilizando el
identificador devuelto por POST:

```ts
const response = await client.spfe.statuses.list({
  id: 128,
});
```

El SDK envía los filtros mediante query string,
sin cuerpo JSON.

La respuesta de listado es:

```ts
type TicketBaiWsListSpfeStatusesResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsSpfeStatusRecord[]
>;
```

Por tanto, `return` contiene un array, mientras que
`create()` devuelve un solo registro.

## Notificaciones por webhook

TicketBaiWS también puede enviar notificaciones
cuando cambia el resultado de un estado SPFE.

El evento correspondiente es:

```ts
'spfe_estado';
```

El SDK publica el tipo:

```ts
TicketBaiWsSpfeStatusWebhookNotification;
```

Consulta [Webhooks](../webhooks.md) para conocer
los eventos y los requisitos de verificación de firmas.

El SDK no instala un receptor ni procesa
automáticamente las notificaciones.

## Tipos públicos

Los modelos se exportan desde `@osumi/ticketbaiws`:

```ts
import type {
  TicketBaiWsListSpfeStatusesRequest,
  TicketBaiWsListSpfeStatusesResponse,
  TicketBaiWsSpfeCollectionRequest,
  TicketBaiWsSpfeIssuedInvoiceStatus,
  TicketBaiWsSpfeNonPaymentRequest,
  TicketBaiWsSpfePaymentRequest,
  TicketBaiWsSpfeReceivedInvoiceStatus,
  TicketBaiWsSpfeRejectionReason,
  TicketBaiWsSpfeRejectionRequest,
  TicketBaiWsSpfeStatusError,
  TicketBaiWsSpfeStatusKind,
  TicketBaiWsSpfeStatusRecord,
  TicketBaiWsSpfeStatusRequest,
  TicketBaiWsSpfeStatusResponse,
  TicketBaiWsSpfeStatusResult,
} from '@osumi/ticketbaiws';
```

No es necesario importar archivos internos.

## Documentación oficial

- [Comunicar pago, cobro, rechazo o impago](https://ticketbaiws.eus/es/spfe-estados-post/)
- [Consultar estados comunicados](https://ticketbaiws.eus/es/spfe-estados-get/)
- [Documentación general de TicketBaiWS](https://ticketbaiws.eus/es/documentacion-api/)

---

[← Volver al índice de documentación](../README.md)
