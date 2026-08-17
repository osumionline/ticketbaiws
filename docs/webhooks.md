# Webhooks

[← Volver al índice de documentación](README.md)

Este documento describe el recurso de webhooks de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.webhooks
```

y permite crear, modificar y consultar webhooks configurados en TicketBaiWS.

## Resumen de métodos

```ts
client.webhooks.create(...)
client.webhooks.update(...)
client.webhooks.get(...)
client.webhooks.list(...)
```

Correspondencia con TicketBaiWS:

| Método del SDK | Método HTTP | Recurso |
| --- | --- | --- |
| `create()` | `POST` | `webhooks/` |
| `update()` | `PUT` | `webhooks/{codigo}/` |
| `get()` | `GET` | `webhooks/{codigo}/` |
| `list()` | `GET` | `webhooks/` |

TicketBaiWS documenta tres operaciones HTTP, pero la consulta GET admite dos rutas distintas: listado completo y consulta por código.

El SDK las separa en `list()` y `get()` para ofrecer una API más explícita.

## Crear un webhook

```ts
const response = await client.webhooks.create({
    url: 'https://example.com/ticketbai/webhook',
    secret: 'una-clave-secreta',
    solo_errores: true,
    activo: true
});
```

El request utiliza:

```ts
interface TicketBaiWsWebhookRequest {
    readonly url: string;
    readonly secret: string;
    readonly solo_errores?: boolean;
    readonly activo?: boolean;
}
```

## `url`

URL a la que TicketBaiWS enviará las notificaciones.

Ejemplo:

```ts
url: 'https://example.com/ticketbai/webhook'
```

La aplicación consumidora debe asegurarse de que la URL sea accesible para TicketBaiWS.

## `secret`

Clave utilizada para verificar la autenticidad del webhook.

Ejemplo:

```ts
secret: 'una-clave-secreta'
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
solo_errores: true
```

## `activo`

```ts
activo?: boolean;
```

Permite activar o desactivar temporalmente el webhook.

Ejemplo:

```ts
activo: true
```

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
}
```

Ejemplo:

```ts
const response = await client.webhooks.create({
    url: 'https://example.com/webhook',
    secret: 'secret',
    activo: true
});

console.log(response.return.codigo);
```

### `codigo`

Identificador del webhook.

Se utiliza posteriormente para:

```ts
client.webhooks.get(codigo)
client.webhooks.update(codigo, ...)
```

### `entorno`

El SDK lo mantiene como:

```ts
string
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
await client.webhooks.update(
    '6904a3501884e',
    {
        url: 'https://example.com/new-webhook',
        secret: 'nuevo-secret',
        solo_errores: false,
        activo: true
    }
);
```

El SDK construye:

```text
PUT /webhooks/6904a3501884e/
```

El body utiliza de nuevo:

```ts
TicketBaiWsWebhookRequest
```

Actualmente `url` y `secret` son obligatorios en ese modelo, siguiendo la tabla oficial de modificación.

## Consultar un webhook por código

```ts
const response = await client.webhooks.get(
    '6904a3501884e'
);
```

La petición es:

```text
GET /webhooks/6904a3501884e/
```

Tipo de respuesta:

```ts
type TicketBaiWsGetWebhookResult =
    | TicketBaiWsWebhook
    | readonly TicketBaiWsWebhook[];
```

y:

```ts
type TicketBaiWsGetWebhookResponse =
    TicketBaiWsSuccessResponse<
        TicketBaiWsGetWebhookResult
    >;
```

### Por qué el resultado admite objeto o array

La documentación oficial declara explícitamente ambas rutas:

```text
GET /webhooks/
GET /webhooks/{codigo_webhook}/
```

pero el ejemplo de respuesta publicado muestra únicamente un array.

No queda completamente definido si el endpoint por código devuelve:

```ts
TicketBaiWsWebhook
```

o:

```ts
readonly TicketBaiWsWebhook[]
```

Para no inventar un contrato más estricto que el documentado, el SDK acepta ambas formas.

El consumidor puede comprobarlo mediante:

```ts
const response = await client.webhooks.get(code);

if (Array.isArray(response.return)) {
    const webhook = response.return[0];
}
else {
    const webhook = response.return;
}
```

Si TicketBaiWS aclara el contrato en el futuro, este tipo podrá hacerse más específico.

## Listar webhooks

Sin filtros:

```ts
const response = await client.webhooks.list();
```

Con filtros:

```ts
const response = await client.webhooks.list({
    solo_errores: true,
    activo: true
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
TicketBaiWsListWebhooksResponse
```

con:

```ts
readonly TicketBaiWsWebhook[]
```

dentro de `return`.

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
        hash: 'SHA-256'
    },
    false,
    ['sign']
);

const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(rawBody)
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
environment: 'test'
```

o:

```ts
environment: 'production'
```

del cliente.

## Tipos públicos

```ts
import type {
    TicketBaiWsGetWebhookResponse,
    TicketBaiWsGetWebhookResult,
    TicketBaiWsListWebhooksRequest,
    TicketBaiWsListWebhooksResponse,
    TicketBaiWsWebhook,
    TicketBaiWsWebhookRequest,
    TicketBaiWsWebhookResponse
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

Aunque se documenta la ruta:

```text
GET /webhooks/{codigo_webhook}/
```

el ejemplo de respuesta publicado es el mismo formato array utilizado para el listado.

Por ello `webhooks.get()` mantiene un tipo compatible con objeto o array.

## Documentación oficial

Crear webhook:

https://ticketbaiws.eus/es/webhooks-post/

Modificar webhook:

https://ticketbaiws.eus/es/documentacion-api/webhooks-put/

Consultar webhooks:

https://ticketbaiws.eus/es/documentacion-api/webhooks-get/

---

[← Volver al índice de documentación](README.md)
