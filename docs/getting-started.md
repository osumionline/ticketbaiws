# Primeros pasos

Esta guía explica cómo instalar, configurar y utilizar `@osumi/ticketbaiws`, cómo interpretar sus respuestas y cómo tratar los distintos tipos de error.

Para la referencia detallada de cada recurso consulta el [índice de documentación](README.md).

## Instalación

Instala el paquete desde npm:

```bash
npm install @osumi/ticketbaiws
```

La librería es ESM only.

Un proyecto TypeScript moderno puede importar el cliente directamente desde el entry point público:

```ts
import {
    TicketBaiWsClient
} from '@osumi/ticketbaiws';
```

Los tipos también se exportan desde ese mismo entry point:

```ts
import {
    TicketBaiWsClient,
    type TicketBaiWsClientOptions,
    type TicketBaiWsEnvironment
} from '@osumi/ticketbaiws';
```

No es necesario importar archivos internos de `@osumi/ticketbaiws`.

## Compatibilidad

El SDK utiliza APIs Web estándar.

La funcionalidad básica requiere que el entorno proporcione `fetch`. Algunas operaciones, como la subida del documento de representación Verifactu, utilizan además `FormData` y `Blob`.

La interfaz pública no depende de APIs específicas de Node.js como `Buffer`, `fs` o `node:crypto`.

Esto permite utilizar la misma librería en Node.js moderno y en aplicaciones web siempre que el entorno disponga de las APIs Web necesarias.

## Crear el cliente

La configuración básica es:

```ts
import {
    TicketBaiWsClient
} from '@osumi/ticketbaiws';

const client = new TicketBaiWsClient({
    token: '...',
    issuerNif: '...',
    environment: 'test'
});
```

El constructor recibe un objeto `TicketBaiWsClientOptions`:

```ts
interface TicketBaiWsClientOptions {
    readonly token: string;
    readonly issuerNif: string;
    readonly environment: 'test' | 'production';
    readonly fetch?: typeof globalThis.fetch;
}
```

### `token`

Token de autenticación utilizado para acceder a TicketBaiWS.

Es obligatorio y no puede ser una cadena vacía.

El SDK lo envía automáticamente en las peticiones realizadas por el cliente.

### `issuerNif`

NIF de la empresa emisora con la que se realizarán las operaciones.

Es obligatorio y no puede ser una cadena vacía.

El SDK lo envía automáticamente en las peticiones realizadas por el cliente.

### `environment`

Entorno de TicketBaiWS que utilizará el cliente.

Valores admitidos:

```ts
'test'
'production'
```

Las URLs utilizadas internamente son:

```text
test
https://api-test.ticketbaiws.eus/

production
https://api.ticketbaiws.eus/
```

No existe un entorno por defecto. Debe indicarse expresamente al crear el cliente.

Esto reduce el riesgo de utilizar producción accidentalmente cuando se esperaba trabajar contra el entorno de pruebas.

### `fetch`

Implementación opcional de `fetch`.

Si no se proporciona, el cliente utiliza `globalThis.fetch`.

Ejemplo normal:

```ts
const client = new TicketBaiWsClient({
    token: '...',
    issuerNif: '...',
    environment: 'test'
});
```

Ejemplo proporcionando una implementación propia:

```ts
const customFetch: typeof globalThis.fetch = async (
    input,
    init
) => {
    console.log('TicketBaiWS request:', input);

    return globalThis.fetch(input, init);
};

const client = new TicketBaiWsClient({
    token: '...',
    issuerNif: '...',
    environment: 'test',
    fetch: customFetch
});
```

La inyección de `fetch` puede resultar útil para tests, instrumentación, trazas o entornos que necesiten proporcionar su propia implementación compatible.

Si no se proporciona `fetch` y `globalThis.fetch` tampoco está disponible, el constructor lanza `TicketBaiWsConfigurationError`.

## Credenciales

Las credenciales pertenecen al consumidor de la librería.

`@osumi/ticketbaiws` no almacena, cifra ni persiste el token ni el NIF.

En aplicaciones con frontend público debe tenerse en cuenta que cualquier credencial incluida en código ejecutado por el navegador puede quedar expuesta al usuario. La arquitectura de la aplicación consumidora debe decidir dónde es seguro utilizar las credenciales de TicketBaiWS.

## Primera petición

Una primera comprobación sencilla consiste en consultar el estado del servicio:

```ts
const response = await client.system.status();

console.log(response);
```

El acceso a los métodos se organiza por recursos.

Por ejemplo:

```ts
await client.validation.aeat({
    nif: '12345678Z',
    nombre: 'Nombre Apellidos'
});

await client.invoices.list({
    fecha_inicio: '01/01/2026',
    fecha_fin: '31/01/2026'
});

await client.bizkaia.epigraphs.list();
```

## Jerarquía de recursos

La instancia de `TicketBaiWsClient` expone:

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

Cada documento de esta carpeta explica los métodos concretos de su dominio.

## Formato de las respuestas

TicketBaiWS utiliza normalmente un sobre de respuesta con esta forma:

```ts
interface TicketBaiWsResponse<T> {
    readonly result: 'OK' | 'ERROR';
    readonly return: T;
    readonly msg: string | null;
}
```

Cuando una llamada termina correctamente, los métodos públicos devuelven una respuesta tipada cuyo `result` es `'OK'`.

Ejemplo:

```ts
const response = await client.validation.aeat({
    nif: '12345678Z',
    nombre: 'Nombre Apellidos'
});

if (response.result === 'OK') {
    console.log(response.return.resultado);
}
```

El contenido de `return` depende de cada endpoint.

El SDK no sustituye el sobre por su contenido. Esto permite conservar la respuesta de TicketBaiWS y cualquier información adicional que el servicio incluya en ella.

## Errores

Todos los errores propios del SDK heredan de:

```ts
TicketBaiWsError
```

La jerarquía pública es:

```text
TicketBaiWsError
├── TicketBaiWsConfigurationError
├── TicketBaiWsApiError
├── TicketBaiWsHttpError
├── TicketBaiWsNetworkError
└── TicketBaiWsResponseError
```

Todos ellos pueden importarse desde el paquete:

```ts
import {
    TicketBaiWsApiError,
    TicketBaiWsConfigurationError,
    TicketBaiWsError,
    TicketBaiWsHttpError,
    TicketBaiWsNetworkError,
    TicketBaiWsResponseError
} from '@osumi/ticketbaiws';
```

### `TicketBaiWsConfigurationError`

Indica un problema local al construir el cliente.

Por ejemplo:

- opciones inexistentes;
- `token` vacío;
- `issuerNif` vacío;
- entorno distinto de `test` o `production`;
- ausencia de una implementación de `fetch`.

Ejemplo:

```ts
try {
    const client = new TicketBaiWsClient({
        token: '',
        issuerNif: 'B12345678',
        environment: 'test'
    });
}
catch (error: unknown) {
    if (error instanceof TicketBaiWsConfigurationError) {
        console.error(error.message);
    }
}
```

### `TicketBaiWsApiError`

Se lanza cuando TicketBaiWS responde correctamente a nivel HTTP pero el sobre del API contiene:

```ts
{
    result: 'ERROR',
    ...
}
```

La respuesta original queda disponible en:

```ts
error.apiResponse
```

Ejemplo:

```ts
try {
    await client.validation.aeat({
        nif: '...',
        nombre: '...'
    });
}
catch (error: unknown) {
    if (error instanceof TicketBaiWsApiError) {
        console.error(error.message);
        console.error(error.apiResponse);
    }
}
```

### `TicketBaiWsHttpError`

Se lanza cuando la respuesta HTTP no es correcta.

Expone:

```ts
error.status
error.statusText
error.responseBody
```

Ejemplo:

```ts
catch (error: unknown) {
    if (error instanceof TicketBaiWsHttpError) {
        console.error(error.status);
        console.error(error.statusText);
        console.error(error.responseBody);
    }
}
```

### `TicketBaiWsNetworkError`

Se lanza cuando `fetch` falla antes de obtener una respuesta HTTP.

El error original está disponible mediante la propiedad estándar:

```ts
error.cause
```

Ejemplo:

```ts
catch (error: unknown) {
    if (error instanceof TicketBaiWsNetworkError) {
        console.error(error.message);
        console.error(error.cause);
    }
}
```

### `TicketBaiWsResponseError`

Se lanza cuando TicketBaiWS devuelve una respuesta que el SDK no puede interpretar como una respuesta válida del API.

Expone el cuerpo recibido mediante:

```ts
error.responseBody
```

Puede utilizarse para diagnosticar respuestas vacías, JSON inválido o estructuras inesperadas.

## Tratamiento conjunto de errores

Un patrón completo puede ser:

```ts
import {
    TicketBaiWsApiError,
    TicketBaiWsConfigurationError,
    TicketBaiWsError,
    TicketBaiWsHttpError,
    TicketBaiWsNetworkError,
    TicketBaiWsResponseError
} from '@osumi/ticketbaiws';

try {
    const response = await client.system.status();

    console.log(response);
}
catch (error: unknown) {
    if (error instanceof TicketBaiWsConfigurationError) {
        console.error('Configuración no válida:', error.message);
    }
    else if (error instanceof TicketBaiWsApiError) {
        console.error('Error TicketBaiWS:', error.apiResponse);
    }
    else if (error instanceof TicketBaiWsHttpError) {
        console.error(
            'Error HTTP:',
            error.status,
            error.statusText,
            error.responseBody
        );
    }
    else if (error instanceof TicketBaiWsNetworkError) {
        console.error('Error de red:', error.cause);
    }
    else if (error instanceof TicketBaiWsResponseError) {
        console.error(
            'Respuesta no válida:',
            error.responseBody
        );
    }
    else if (error instanceof TicketBaiWsError) {
        console.error('Error del SDK:', error.message);
    }
    else {
        throw error;
    }
}
```

En código real no es obligatorio tratar todas las variantes en cada llamada. La aplicación consumidora puede centralizar esta lógica según su arquitectura.

## DTO y nomenclatura

Los métodos y recursos propios del SDK usan nombres de TypeScript en `camelCase`:

```ts
client.invoices.completeSimplified(...)
client.bizkaia.lroe.cashCollections.list(...)
```

Los objetos enviados y recibidos conservan los nombres usados por TicketBaiWS:

```ts
{
    nombre_social: 'Empresa S.L.',
    num_factura: 'F-001',
    importe_total: 121
}
```

Esta mezcla es deliberada.

Permite que la API del SDK resulte cómoda de navegar sin dificultar la comparación entre un DTO y la documentación oficial de TicketBaiWS.

## Tipos estrictos y reglas fiscales

Los modelos restringen campos cuando el contrato del API ofrece un conjunto de valores claramente definido.

Por ejemplo, determinados estados o claves se representan mediante uniones de literales TypeScript.

Sin embargo, el SDK evita reproducir reglas fiscales condicionales complejas.

Que un campo sea opcional en TypeScript no implica necesariamente que sea fiscalmente opcional en todos los casos. Puede existir una condición dependiente del tipo de factura, territorio, régimen fiscal u otra regla que debe comprobar TicketBaiWS.

Consulta siempre la documentación oficial para conocer las reglas fiscales aplicables:

https://ticketbaiws.eus/es/documentacion-api/

## Diferencias entre escritura y lectura

El SDK no convierte automáticamente los datos devueltos por TicketBaiWS.

En algunos endpoints, especialmente LROE, un mismo concepto puede utilizar representaciones diferentes según la operación.

Por ejemplo, un importe puede enviarse como:

```ts
{
    importe_total: 121
}
```

y aparecer posteriormente en una respuesta de consulta como:

```ts
{
    importe_total: '121.00'
}
```

Lo mismo puede ocurrir con tipos impositivos o códigos de régimen.

Los tipos públicos representan esa diferencia de forma explícita. No debe asumirse que el modelo de creación y el modelo de consulta son intercambiables.

## Datos binarios y Base64

Algunos endpoints de TicketBaiWS devuelven documentos codificados como Base64.

El SDK conserva el Base64 como `string` y no fuerza una conversión específica de plataforma.

Esto afecta, entre otros, a determinados PDF y documentos descargables.

De este modo, cada consumidor puede decidir cómo convertirlos según su entorno.

Para subir el documento firmado de representación Verifactu, el SDK utiliza `Blob` y `FormData`:

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

Un objeto `File` del navegador también puede utilizarse porque es compatible con `Blob`.

## Peticiones GET

El SDK envía los filtros de las operaciones GET mediante query string:

```text
GET /recurso/?filtro=valor
```

Aunque algunos ejemplos de la documentación de TicketBaiWS utilizan cuerpos JSON en peticiones GET, `@osumi/ticketbaiws` adopta una política uniforme basada en parámetros de consulta.

El consumidor no necesita construir manualmente la URL: debe utilizar los objetos de filtros tipados de cada método.

## Seguridad

Algunas recomendaciones para la aplicación consumidora:

- no registrar tokens en logs;
- no incluir credenciales en repositorios;
- no exponer un token en código frontend si no se considera seguro para el caso de uso;
- separar credenciales de test y producción;
- seleccionar expresamente el entorno apropiado;
- tratar los datos fiscales y documentos de acuerdo con las necesidades de seguridad de la aplicación.

El SDK no sustituye la política de seguridad de la aplicación que lo utiliza.

## Siguientes pasos

Consulta la documentación del dominio que quieras utilizar:

- [Facturación](invoices.md)
- [Validaciones AEAT y VIES](validation.md)
- [Empresas](companies.md)
- [Licencias](licenses.md)
- [Webhooks](webhooks.md)
- [Documento de representación Verifactu](verifactu.md)
- [BATUZ / LROE Bizkaia](bizkaia/README.md)

Documentación oficial de TicketBaiWS:

https://ticketbaiws.eus/es/documentacion-api/
