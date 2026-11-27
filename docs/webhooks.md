# Webhooks

[← Volver al índice de documentación](README.md)

Este documento describe el recurso de webhooks de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.webhooks;
```

y permite crear, modificar y consultar webhooks configurados en TicketBaiWS.

## Resumen de métodos

```ts
client.webhooks.create(...)
client.webhooks.update(...)
client.webhooks.get(...)
client.webhooks.delete(...)
client.webhooks.list(...)
```

Correspondencia con TicketBaiWS:

| Método del SDK | HTTP     | Recurso              |
| -------------- | -------- | -------------------- |
| `create()`     | `POST`   | `webhooks/`          |
| `update()`     | `PUT`    | `webhooks/{codigo}/` |
| `get()`        | `GET`    | `webhooks/{codigo}/` |
| `delete()`     | `DELETE` | `webhooks/{codigo}/` |
| `list()`       | `GET`    | `webhooks/`          |

Las operaciones GET se separan en consulta individual y listado.

La creación y modificación permiten seleccionar los eventos de
notificación mediante la propiedad opcional `eventos`.

## Crear un webhook

```ts
const response = await client.webhooks.create({
  url: 'https://example.com/ticketbai/webhook',
  secret: 'una-clave-secreta',
  solo_errores: true,
  activo: true,
});
```

El request utiliza:

```ts
interface TicketBaiWsWebhookRequest {
  readonly url: string;
  readonly secret: string;
  readonly solo_errores?: boolean;
  readonly activo?: boolean;
  readonly eventos?: readonly TicketBaiWsWebhookEvent[];
}
```

## `url`

URL a la que TicketBaiWS enviará las notificaciones.

Ejemplo:

```ts
url: 'https://example.com/ticketbai/webhook';
```

La aplicación consumidora debe asegurarse de que la URL sea accesible para TicketBaiWS.

## `secret`

Clave utilizada para verificar la autenticidad del webhook.

Ejemplo:

```ts
secret: 'una-clave-secreta';
```

Debe almacenarse de forma segura.

La documentación de TicketBaiWS indica que la firma se calcula mediante HMAC-SHA256 sobre el cuerpo recibido y se transmite codificada en Base64 mediante la cabecera:

```text
X-Tbaiws-Hmac-Sha256
```

La clave `secret` es necesaria para recalcular esa firma en el receptor.

## `solo_errores`

```ts
solo_errores?: boolean;
```

Permite pedir que el webhook se envíe únicamente cuando se produzcan errores o resultados aceptados con errores/avisos.

Ejemplo:

```ts
solo_errores: true;
```

## `activo`

```ts
activo?: boolean;
```

Permite activar o desactivar temporalmente el webhook.

Ejemplo:

```ts
activo: true;
```

## `eventos`

Permite seleccionar qué notificaciones debe recibir el webhook.

```ts
type TicketBaiWsWebhookEvent =
  | 'cambio_estado'
  | 'spfe_envio'
  | 'spfe_estado'
  | 'spfe_recibida';
```

| Evento          | Descripción                                                     |
| --------------- | --------------------------------------------------------------- |
| `cambio_estado` | Cambios de estado de facturas TicketBAI o Verifactu             |
| `spfe_envio`    | Resultado del envío de una factura a SPFE                       |
| `spfe_estado`   | Resultado de comunicar pagos, cobros, rechazos o impagos a SPFE |
| `spfe_recibida` | Recepción de una factura electrónica a través de SPFE           |

Ejemplo:

```ts
await client.webhooks.create({
  url: 'https://example.com/webhook',
  secret: 'una-clave-secreta',
  eventos: ['cambio_estado', 'spfe_recibida'],
});
```

Cuando se omite `eventos` al crear, Berein utiliza
`['cambio_estado']` como valor predeterminado.

Cuando se omite al modificar, Berein conserva las
suscripciones existentes.

El SDK no introduce ni modifica automáticamente
esos valores.

## Respuesta

Un webhook utiliza:

```ts
interface TicketBaiWsWebhook {
  readonly codigo: string;
  readonly url: string;
  readonly entorno: string;
  readonly secret: string;
  readonly solo_errores: boolean;
  readonly activo: boolean;
  readonly fecha_creado: string;
  readonly fecha_modificado: string;
  readonly nif?: string;
  readonly eventos?: readonly TicketBaiWsWebhookEvent[];
}
```

Ejemplo:

```ts
const response = await client.webhooks.create({
  url: 'https://example.com/webhook',
  secret: 'secret',
  activo: true,
});

console.log(response.return.codigo);
```

### `codigo`

Identificador del webhook.

Se utiliza posteriormente para:

```ts
client.webhooks.get(codigo)
client.webhooks.update(codigo, ...)
client.webhooks.delete(codigo)
```

### `entorno`

El SDK lo mantiene como:

```ts
string;
```

y no como una unión cerrada.

La documentación muestra valores como:

```text
test
```

en respuestas de configuración, mientras las notificaciones documentan también una cabecera de entorno con valores diferentes.

Para evitar imponer un catálogo no suficientemente definido, el SDK conserva el valor recibido como string.

### `nif`

```ts
nif?: string;
```

Aparece en la respuesta documentada de listado, pero no está presente de forma uniforme en todos los ejemplos.

Por ello se mantiene opcional.

## Modificar un webhook

La modificación recibe el código por separado:

```ts
await client.webhooks.update('6904a3501884e', {
  url: 'https://example.com/new-webhook',
  secret: 'nuevo-secret',
  solo_errores: false,
  activo: true,
});
```

El SDK construye:

```text
PUT /webhooks/6904a3501884e/
```

El body utiliza de nuevo:

```ts
TicketBaiWsWebhookRequest;
```

Actualmente `url` y `secret` son obligatorios en ese modelo, siguiendo la tabla oficial de modificación.

## Consultar un webhook por código

```ts
const response = await client.webhooks.get('6904a3501884e');
```

La petición es:

```text
GET /webhooks/6904a3501884e/
```

Tipo de respuesta:

```ts
type TicketBaiWsGetWebhookResult = TicketBaiWsWebhook;

type TicketBaiWsGetWebhookResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsGetWebhookResult>;
```

El resultado contiene un único objeto de configuración:

```ts
const response = await client.webhooks.get('6904a3501884e');

console.log(response.return.codigo);
console.log(response.return.url);
console.log(response.return.eventos);
```

A diferencia de `list()`, no devuelve un array.

## Eliminar un webhook

```ts
const response = await client.webhooks.delete('6904a3501884e');
```

El SDK realiza:

```text
DELETE /webhooks/6904a3501884e/
```

No envía cuerpo JSON.

La respuesta satisfactoria documentada por Berein contiene
un array vacío dentro de `return`:

```ts
{
    result: 'OK',
    return: [],
    msg: null
}
```

El tipo público es:

```ts
type TicketBaiWsDeleteWebhookResponse = TicketBaiWsSuccessResponse<
  readonly unknown[]
>;
```

La eliminación afecta al webhook identificado por su código
en el entorno configurado en el cliente.

## Listar webhooks

Sin filtros:

```ts
const response = await client.webhooks.list();
```

Con filtros:

```ts
const response = await client.webhooks.list({
  solo_errores: true,
  activo: true,
});
```

Modelo:

```ts
interface TicketBaiWsListWebhooksRequest {
  readonly solo_errores?: boolean;
  readonly activo?: boolean;
}
```

El SDK construye query parameters:

```text
GET /webhooks/?solo_errores=true&activo=true
```

No envía JSON en el body del GET.

La respuesta es:

```ts
TicketBaiWsListWebhooksResponse;
```

con:

```ts
readonly TicketBaiWsWebhook[]
```

dentro de `return`.

## Notificaciones entrantes

TicketBaiWS envía notificaciones HTTP POST a la URL configurada
en cada webhook.

El SDK publica los tipos TypeScript de los cuatro eventos,
pero no implementa un servidor receptor ni interpreta
automáticamente los mensajes entrantes.

### Identificación del evento

La cabecera `X-TbaiWs-Topic` identifica el evento:

```ts
type TicketBaiWsWebhookEvent =
  | 'cambio_estado'
  | 'spfe_envio'
  | 'spfe_estado'
  | 'spfe_recibida';
```

El cuerpo JSON no siempre contiene la propiedad `evento`.
En particular, los ejemplos de `cambio_estado` pueden omitirla.

Por tanto, no debe dependerse exclusivamente de esa
propiedad para identificar la notificación.

### Cabeceras

El SDK expone:

```ts
interface TicketBaiWsWebhookNotificationHeaders {
  readonly 'X-TbaiWs-Id': string;
  readonly 'X-TbaiWs-Environment': 'test' | 'real';
  readonly 'X-TbaiWs-Topic': TicketBaiWsWebhookEvent;
  readonly 'X-Tbaiws-Hmac-Sha256'?: string;
}
```

Los nombres de cabeceras HTTP no distinguen entre mayúsculas
y minúsculas. En una aplicación web pueden obtenerse mediante
`Headers.get()`.

La cabecera de firma es opcional en el contrato documentado.

### Tipos de los cuatro eventos

| Evento          | Tipo público                                  |
| --------------- | --------------------------------------------- |
| `cambio_estado` | `TicketBaiWsInvoiceStatusWebhookNotification` |
| `spfe_envio`    | `TicketBaiWsSpfeSentWebhookNotification`      |
| `spfe_estado`   | `TicketBaiWsSpfeStatusWebhookNotification`    |
| `spfe_recibida` | `TicketBaiWsSpfeReceivedWebhookNotification`  |

También están disponibles:

```ts
TicketBaiWsWebhookNotification;
TicketBaiWsWebhookNotificationByEvent;
TicketBaiWsWebhookNotificationEnvironment;
TicketBaiWsWebhookNotificationHeaders;
TicketBaiWsWebhookSpfeError;
```

`TicketBaiWsWebhookNotificationByEvent` permite relacionar
cada nombre de evento con su tipo correspondiente:

```ts
import type { TicketBaiWsWebhookNotificationByEvent } from '@osumi/ticketbaiws';

type ReceivedInvoiceNotification =
  TicketBaiWsWebhookNotificationByEvent['spfe_recibida'];
```

Las propiedades de los payloads se mantienen opcionales
cuando el esquema OpenAPI no garantiza su presencia.

Estos tipos representan el contrato publicado; no validan
automáticamente el JSON recibido.

### Seguridad y validación

El receptor debe verificar la firma HMAC, cuando corresponda,
utilizando los bytes originales del cuerpo recibido.

Después debe validar el contenido antes de tratarlo como
uno de los modelos públicos del SDK.

La existencia de un tipo TypeScript no demuestra que una
notificación sea auténtica ni que sus datos sean válidos.

Los eventos SPFE pueden incluir información fiscal y
personal, por lo que deben procesarse y almacenarse
con las medidas de seguridad correspondientes.

## Verificación de la firma HMAC

TicketBaiWS documenta la firma del webhook mediante HMAC-SHA256.

Conceptualmente, el receptor debe:

1. conservar exactamente el body recibido;
2. calcular HMAC-SHA256 usando el `secret`;
3. codificar el resultado en Base64;
4. compararlo con `X-Tbaiws-Hmac-Sha256`.

`@osumi/ticketbaiws` **no implementa actualmente un helper de verificación de webhooks entrantes**.

La librería está centrada en el cliente REST saliente. La verificación del webhook ocurre en el servidor receptor y puede depender del entorno en el que se ejecute la aplicación.

Ejemplo conceptual en una plataforma con Web Crypto:

```ts
const encoder = new TextEncoder();

const key = await crypto.subtle.importKey(
  'raw',
  encoder.encode(secret),
  {
    name: 'HMAC',
    hash: 'SHA-256',
  },
  false,
  ['sign'],
);

const signature = await crypto.subtle.sign(
  'HMAC',
  key,
  encoder.encode(rawBody),
);
```

Después sería necesario codificar `signature` en Base64 y compararlo de forma segura con la cabecera recibida.

Este ejemplo es orientativo y no forma parte de la API pública del SDK.

## Seguridad

Los webhooks implican datos sensibles y una clave compartida.

Recomendaciones para la aplicación consumidora:

- usar HTTPS;
- utilizar secretos suficientemente aleatorios;
- no guardar `secret` en logs;
- verificar la firma antes de procesar el contenido;
- preservar el body original para calcular el HMAC;
- responder con rapidez y procesar tareas pesadas después si la arquitectura lo permite;
- distinguir correctamente los entornos de test y producción.

## Entornos

Los endpoints de webhooks sí se documentan explícitamente mediante:

```text
https://{entorno}.ticketbaiws.eus/webhooks/
```

Por ello respetan directamente:

```ts
environment: 'test';
```

o:

```ts
environment: 'production';
```

del cliente.

## Tipos públicos

```ts
import type {
  TicketBaiWsDeleteWebhookResponse,
  TicketBaiWsGetWebhookResponse,
  TicketBaiWsGetWebhookResult,
  TicketBaiWsInvoiceStatusWebhookNotification,
  TicketBaiWsListWebhooksRequest,
  TicketBaiWsListWebhooksResponse,
  TicketBaiWsSpfeReceivedWebhookNotification,
  TicketBaiWsSpfeSentWebhookNotification,
  TicketBaiWsSpfeStatusWebhookNotification,
  TicketBaiWsWebhook,
  TicketBaiWsWebhookEvent,
  TicketBaiWsWebhookNotification,
  TicketBaiWsWebhookNotificationByEvent,
  TicketBaiWsWebhookNotificationEnvironment,
  TicketBaiWsWebhookNotificationHeaders,
  TicketBaiWsWebhookRequest,
  TicketBaiWsWebhookResponse,
  TicketBaiWsWebhookSpfeError,
} from '@osumi/ticketbaiws';
```

## Errores

Las operaciones REST pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Consulta [Primeros pasos](getting-started.md).

## Notas sobre la documentación oficial

Hay dos puntos especialmente relevantes:

### GET con body o query string

Algunos ejemplos cURL/PHP utilizan un body JSON para filtrar un GET, mientras otros ejemplos construyen:

```text
?activo=true
```

`@osumi/ticketbaiws` utiliza siempre query string en operaciones GET.

### Respuesta del GET individual

`GET /webhooks/{codigo_webhook}/` devuelve un único
objeto de configuración.

El SDK utiliza `TicketBaiWsWebhook` como tipo de `return`.

El listado `GET /webhooks/` continúa devolviendo un array.

## Documentación oficial

- [Crear webhook](https://ticketbaiws.eus/es/webhooks-post/)
- [Modificar webhook](https://ticketbaiws.eus/es/webhooks-put/)
- [Consultar webhooks](https://ticketbaiws.eus/es/webhooks-get/)
- [Documentación general](https://ticketbaiws.eus/es/documentacion-api/)

---

[← Volver al índice de documentación](README.md)
