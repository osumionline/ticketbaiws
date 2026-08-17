# Documento de representación Verifactu

[← Volver al índice de documentación](README.md)

Este documento describe el recurso específico de Verifactu de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.verifactu.representation
```

y cubre el ciclo completo del documento de representación necesario para utilizar el certificado de TicketBaiWS en envíos Verifactu:

```text
1. Descargar el modelo precargado.
2. Firmarlo digitalmente fuera del SDK.
3. Subir el PDF firmado.
4. Recuperar posteriormente el documento almacenado.
5. Revocarlo cuando todavía sea posible.
```

## Índice

- [Resumen de métodos](#resumen-de-métodos)
- [Flujo completo](#flujo-completo)
- [Descargar el modelo](#descargar-el-modelo)
  - [Empresas con personalidad jurídica](#empresas-con-personalidad-jurídica)
  - [Personas físicas](#personas-físicas)
  - [Respuesta Base64](#respuesta-base64)
- [Firmar el documento](#firmar-el-documento)
- [Subir el documento firmado](#subir-el-documento-firmado)
  - [Usar `File` en navegador](#usar-file-en-navegador)
  - [Usar `Blob`](#usar-blob)
  - [Nombre de archivo opcional](#nombre-de-archivo-opcional)
  - [`multipart/form-data`](#multipartform-data)
- [Recuperar el documento almacenado](#recuperar-el-documento-almacenado)
- [Revocar el documento](#revocar-el-documento)
- [Tipos públicos](#tipos-públicos)
- [Errores](#errores)
- [Compatibilidad y datos binarios](#compatibilidad-y-datos-binarios)
- [Notas sobre la documentación oficial](#notas-sobre-la-documentación-oficial)
- [Documentación oficial](#documentación-oficial)

## Resumen de métodos

```ts
client.verifactu.representation.getTemplate(...)
client.verifactu.representation.upload(...)
client.verifactu.representation.get()
client.verifactu.representation.revoke()
```

Correspondencia con TicketBaiWS:

| Método del SDK | Método HTTP | Recurso |
| --- | --- | --- |
| `getTemplate()` | `GET` | `doc-representante/modelo/` |
| `upload()` | `POST` | `doc-representante/` |
| `get()` | `GET` | `doc-representante/` |
| `revoke()` | `DELETE` | `doc-representante/` |

Los cuatro métodos utilizan el transporte común de `@osumi/ticketbaiws` y, por tanto, reciben automáticamente las cabeceras de autenticación configuradas en `TicketBaiWsClient`.

---

# Flujo completo

Un flujo típico puede representarse así:

```ts
// 1. Descargar modelo
const template =
    await client.verifactu.representation.getTemplate({
        nombre_representante: 'Juan Martínez Pérez',
        nif_representante: '12345678Z',
        poblacion_representante: 'Madrid',
        direccion_representante: 'Calle de ejemplo 1'
    });

const templateBase64 = template.return;

// 2. El consumidor convierte/guarda el PDF
//    y lo firma digitalmente fuera del SDK.

// 3. Subir el PDF firmado
await client.verifactu.representation.upload({
    file: signedPdfBlob,
    filename: 'representacion-firmada.pdf'
});

// 4. Recuperarlo si es necesario
const stored =
    await client.verifactu.representation.get();

const storedBase64 = stored.return;

// 5. Revocarlo si todavía está permitido
await client.verifactu.representation.revoke();
```

`@osumi/ticketbaiws` no firma digitalmente el PDF.

La firma se realiza fuera del SDK mediante las herramientas y certificados adecuados para el representante de la empresa.

---

# Descargar el modelo

```ts
const response =
    await client.verifactu.representation.getTemplate(...);
```

La operación utiliza:

```text
GET /doc-representante/modelo/
```

El request es:

```ts
interface TicketBaiWsRepresentationTemplateRequest {
    readonly nombre_representante?: string;
    readonly nif_representante?: string;
    readonly poblacion_representante?: string;
    readonly direccion_representante?: string;
}
```

Todos los campos son opcionales en el tipo porque TicketBaiWS solo los exige para empresas con personalidad jurídica.

## Empresas con personalidad jurídica

TicketBaiWS documenta cuatro datos del representante:

```ts
{
    nombre_representante: 'Juan Martínez Pérez',
    nif_representante: '12345678Z',
    poblacion_representante: 'Madrid',
    direccion_representante: 'Calle de ejemplo 1'
}
```

Ejemplo completo:

```ts
const response =
    await client.verifactu.representation.getTemplate({
        nombre_representante:
            'Juan Martínez Pérez',
        nif_representante:
            '12345678Z',
        poblacion_representante:
            'Madrid',
        direccion_representante:
            'Calle de ejemplo 1'
    });

console.log(response.return);
```

TicketBaiWS indica que el nombre y NIF del representante deben coincidir con los datos de la firma digital que se utilizará posteriormente.

El SDK no valida esa coincidencia.

## Personas físicas

Cuando los datos del representante no son necesarios, puede llamarse sin argumentos:

```ts
const response =
    await client.verifactu.representation.getTemplate();
```

También puede utilizarse explícitamente un objeto vacío:

```ts
const response =
    await client.verifactu.representation.getTemplate({});
```

El SDK genera una petición GET sin parámetros adicionales.

## Parámetros GET

Cuando existen datos de representante, `@osumi/ticketbaiws` los envía mediante query string.

Ejemplo conceptual:

```text
GET /doc-representante/modelo/
    ?nombre_representante=Juan...
    &nif_representante=12345678Z
    &poblacion_representante=Madrid
    &direccion_representante=Calle...
```

El consumidor solo pasa el objeto tipado. No debe construir manualmente la URL.

Esta política es coherente con el resto de operaciones GET del SDK.

## Respuesta Base64

La respuesta utiliza:

```ts
type TicketBaiWsRepresentationPdfResponse =
    TicketBaiWsSuccessResponse<string>;
```

Por tanto:

```ts
response.return
```

contiene el PDF codificado como Base64.

Ejemplo:

```ts
const response =
    await client.verifactu.representation.getTemplate();

const pdfBase64: string = response.return;
```

El SDK no convierte automáticamente ese valor a archivo, `Blob`, `Buffer` o URL.

Esto permite mantener la librería independiente de plataforma.

---

# Firmar el documento

Después de descargar el modelo, el PDF debe firmarse digitalmente antes de enviarlo de nuevo a TicketBaiWS.

TicketBaiWS indica que debe utilizarse un certificado válido de representante para la AEAT.

La firma queda fuera del alcance de `@osumi/ticketbaiws`.

El SDK no:

- selecciona certificados;
- accede al almacén de certificados del sistema;
- firma PDF;
- valida firmas digitales;
- comprueba que el firmante coincida con los datos informados en `getTemplate()`.

La aplicación consumidora puede utilizar la herramienta de firma que corresponda a su entorno.

Una vez firmado el documento, debe proporcionarse al SDK como `Blob` o como un objeto compatible, como `File` en navegador.

---

# Subir el documento firmado

```ts
const response =
    await client.verifactu.representation.upload({
        file: signedPdf
    });
```

La operación utiliza:

```text
POST /doc-representante/
```

El request público es:

```ts
interface TicketBaiWsRepresentationUploadRequest {
    readonly file: Blob;
    readonly filename?: string;
}
```

## `file`

El PDF firmado se proporciona mediante:

```ts
file: Blob
```

El tipo `File` del navegador también es compatible porque extiende `Blob`.

El SDK no restringe en tiempo de ejecución:

```text
MIME type
extensión
firma digital
contenido PDF
```

TicketBaiWS realiza la validación final del documento.

---

## Usar `File` en navegador

Ejemplo con:

```html
<input type="file">
```

Código conceptual:

```ts
const input =
    document.querySelector<HTMLInputElement>(
        '#representation-file'
    );

const file = input?.files?.[0];

if (file !== undefined) {
    await client.verifactu.representation.upload({
        file
    });
}
```

Al proporcionar un `File`, el propio objeto ya contiene un nombre de archivo.

No es obligatorio indicar `filename`.

---

## Usar `Blob`

También puede construirse un `Blob` directamente:

```ts
const pdf = new Blob(
    [pdfBytes],
    {
        type: 'application/pdf'
    }
);

await client.verifactu.representation.upload({
    file: pdf,
    filename: 'representacion-firmada.pdf'
});
```

Este enfoque es útil cuando la aplicación ya dispone de los bytes del documento en memoria.

---

## Nombre de archivo opcional

El campo:

```ts
filename?: string;
```

permite asociar un nombre a un `Blob` genérico.

Ejemplo:

```ts
await client.verifactu.representation.upload({
    file: pdf,
    filename: 'representacion-firmada.pdf'
});
```

Si no se proporciona:

```ts
await client.verifactu.representation.upload({
    file: pdf
});
```

el SDK añade directamente el `Blob` al `FormData`.

Si sí se proporciona, utiliza el nombre como metadata de la parte multipart correspondiente a `file`.

`filename` no se envía como un campo independiente del formulario.

---

## `multipart/form-data`

Internamente el SDK crea:

```ts
const formData = new FormData();

formData.append(
    'file',
    data.file,
    data.filename
);
```

conceptualmente.

La petición se realiza con:

```ts
body: formData
```

y el SDK **no fija manualmente**:

```text
Content-Type: multipart/form-data
```

ni:

```text
Content-Type: application/json
```

Esto es importante.

Cuando se utiliza `FormData`, `fetch` debe generar automáticamente una cabecera similar a:

```text
Content-Type: multipart/form-data; boundary=...
```

El `boundary` pertenece al cuerpo concreto de la petición y no debe construirse manualmente.

## Respuesta de subida

El tipo es:

```ts
type TicketBaiWsRepresentationUploadResponse =
    TicketBaiWsSuccessResponse<string>;
```

TicketBaiWS documenta actualmente una respuesta como:

```ts
{
    result: 'OK',
    return: 'Documento procesado correctamente',
    msg: null
}
```

Ejemplo:

```ts
const response =
    await client.verifactu.representation.upload({
        file: pdf,
        filename: 'representacion-firmada.pdf'
    });

console.log(response.return);
```

La aplicación no debería depender innecesariamente del texto literal del mensaje de éxito.

El indicador estructural de éxito sigue siendo:

```ts
response.result === 'OK'
```

---

# Recuperar el documento almacenado

Después de haber cargado el documento firmado, puede recuperarse mediante:

```ts
const response =
    await client.verifactu.representation.get();
```

La operación utiliza:

```text
GET /doc-representante/
```

No recibe parámetros.

El resultado reutiliza:

```ts
TicketBaiWsRepresentationPdfResponse
```

por tanto:

```ts
response.return
```

es el documento PDF almacenado codificado como Base64.

Ejemplo:

```ts
const response =
    await client.verifactu.representation.get();

const pdfBase64 = response.return;
```

El SDK no comprueba si el documento recuperado coincide byte a byte con el que se subió originalmente.

TicketBaiWS describe el resultado como el documento ya cargado y firmado por el servicio.

---

# Revocar el documento

```ts
const response =
    await client.verifactu.representation.revoke();
```

La operación utiliza:

```text
DELETE /doc-representante/
```

y no recibe parámetros.

El tipo de respuesta es:

```ts
type TicketBaiWsRepresentationRevokeResponse =
    TicketBaiWsSuccessResponse<null>;
```

Por tanto:

```ts
response.return
```

es:

```ts
null
```

Ejemplo:

```ts
const response =
    await client.verifactu.representation.revoke();

console.log(response.return); // null
console.log(response.msg);
```

TicketBaiWS documenta actualmente un mensaje similar a:

```text
Document voided
```

La aplicación no debería depender del texto literal de `msg`.

## Cuándo puede revocarse

TicketBaiWS indica que la revocación solo está permitida mientras no se hayan realizado envíos en el entorno real utilizando ese documento/certificado.

Después de realizar envíos reales, el servicio puede rechazar la revocación.

El SDK no intenta determinar localmente si la operación está permitida:

```ts
await client.verifactu.representation.revoke();
```

simplemente envía la petición y deja que TicketBaiWS aplique sus reglas.

Si el servicio rechaza la operación, el transporte común del SDK lanzará el error correspondiente.

---

# Tipos públicos

Los tipos de representación Verifactu se exportan desde el entry point principal:

```ts
import type {
    TicketBaiWsRepresentationPdfResponse,
    TicketBaiWsRepresentationRevokeResponse,
    TicketBaiWsRepresentationTemplateRequest,
    TicketBaiWsRepresentationUploadRequest,
    TicketBaiWsRepresentationUploadResponse
} from '@osumi/ticketbaiws';
```

No es necesario importar recursos o modelos desde rutas internas.

La API de recursos se obtiene siempre desde:

```ts
client.verifactu.representation
```

---

# Errores

Los cuatro métodos utilizan el transporte común de `@osumi/ticketbaiws`.

Pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Ejemplo:

```ts
import {
    TicketBaiWsApiError
} from '@osumi/ticketbaiws';

try {
    await client.verifactu.representation.upload({
        file: pdf,
        filename: 'representacion-firmada.pdf'
    });
}
catch (error: unknown) {
    if (error instanceof TicketBaiWsApiError) {
        console.error(
            'TicketBaiWS rechazó el documento:',
            error.apiResponse
        );
    }
    else {
        throw error;
    }
}
```

Consulta [Primeros pasos](getting-started.md) para la jerarquía completa de errores.

---

# Compatibilidad y datos binarios

`@osumi/ticketbaiws` está diseñado como librería universal.

Por ello utiliza:

```text
fetch
FormData
Blob
```

y evita exponer en su API pública tipos específicos de Node.js como:

```text
Buffer
fs.ReadStream
```

## Descargas

Los PDF descargados se devuelven como:

```ts
string
```

Base64.

Cada consumidor decide cómo convertirlos.

## Subidas

La subida acepta:

```ts
Blob
```

porque es una API Web estándar.

En navegador puede utilizarse directamente un:

```ts
File
```

## Node.js

En un entorno Node.js moderno que implemente las APIs Web necesarias puede construirse un `Blob`:

```ts
const pdf = new Blob(
    [bytes],
    {
        type: 'application/pdf'
    }
);

await client.verifactu.representation.upload({
    file: pdf,
    filename: 'representacion-firmada.pdf'
});
```

La obtención de `bytes` desde disco no forma parte de `@osumi/ticketbaiws`.

La aplicación Node puede utilizar las APIs de filesystem que considere adecuadas y convertir después el contenido a `Blob`.

---

# Notas sobre la documentación oficial

La documentación oficial de estos endpoints contiene varias inconsistencias que conviene conocer.

## GET del modelo: body frente a query string

Para:

```text
GET /doc-representante/modelo/
```

los ejemplos cURL/PHP muestran un body JSON:

```json
{
    "nombre_representante": "...",
    "nif_representante": "...",
    "poblacion_representante": "...",
    "direccion_representante": "..."
}
```

mientras otros ejemplos construyen esos mismos valores mediante query string.

`@osumi/ticketbaiws` adopta la política general del SDK:

> Los parámetros de las operaciones GET se envían mediante query string.

## POST: “sin parámetros” pero requiere `file`

La página de:

```text
POST /doc-representante/
```

indica en su tabla:

```text
El método no permite parámetros
```

pero los ejemplos muestran claramente el envío multipart de:

```text
file
```

El SDK interpreta `file` como la parte multipart necesaria para realizar la operación.

## POST: `application/json` junto a multipart

Algunos ejemplos oficiales incluyen:

```text
Content-Type: application/json
```

mientras al mismo tiempo utilizan:

```text
--form file=...
```

Estas dos indicaciones son incompatibles entre sí para una petición multipart normal.

El SDK utiliza `FormData` y no establece manualmente `Content-Type`, permitiendo que `fetch` genere:

```text
multipart/form-data; boundary=...
```

## POST: campo `filename`

Algunos ejemplos de lenguajes incluyen un campo adicional llamado:

```text
filename
```

mientras otros únicamente envían:

```text
file
```

La tabla no documenta `filename` como parámetro independiente.

Por ello el SDK expone:

```ts
filename?: string;
```

pero lo utiliza únicamente como nombre de la parte `file` del multipart.

No genera un segundo campo de formulario llamado `filename`.

## Entorno en POST

La cabecera del endpoint sigue el patrón:

```text
https://{entorno}.ticketbaiws.eus/doc-representante/
```

pero algunos ejemplos de subida utilizan directamente:

```text
https://api.ticketbaiws.eus/
```

El SDK mantiene el comportamiento uniforme de todos sus recursos y utiliza siempre el entorno configurado en:

```ts
TicketBaiWsClient
```

## DELETE: ejemplo incorrecto

El endpoint de revocación está documentado como:

```text
DELETE /doc-representante/
```

y los ejemplos principales utilizan DELETE.

Sin embargo, uno de los ejemplos publicados utiliza una configuración GET.

`@osumi/ticketbaiws` implementa la operación como `DELETE`, en coherencia con la definición del endpoint y el resto de ejemplos.

---

# Documentación oficial

Documentación general de TicketBaiWS:

https://ticketbaiws.eus/es/documentacion-api/

Descargar modelo del documento de representación:

https://ticketbaiws.eus/es/doc-representante-modelo-get/

Enviar documento firmado:

https://ticketbaiws.eus/es/documentacion-api/doc-representante-post/

Descargar documento cargado:

https://ticketbaiws.eus/es/documentacion-api/doc-representante-get/

Revocar documento cargado:

https://ticketbaiws.eus/es/doc-representante-delete/

---

[← Volver al índice de documentación](README.md)
