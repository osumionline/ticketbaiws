# Empresas

[← Volver al índice de documentación](README.md)

Este documento describe el recurso de empresas de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.companies
```

y permite crear empresas, modificar sus datos y consultar las empresas asociadas a la cuenta de TicketBaiWS.

## Resumen de métodos

```ts
client.companies.create(...)
client.companies.update(...)
client.companies.list(...)
```

Correspondencia con TicketBaiWS:

| Método del SDK | Método HTTP | Recurso |
| --- | --- | --- |
| `create()` | `POST` | `empresas/` |
| `update()` | `PUT` | `empresas/{NIF}/` |
| `list()` | `GET` | `empresas/` |

## Crear una empresa

```ts
const response = await client.companies.create({
    nombre_social: 'Empresa de ejemplo S.L.',
    nombre_comercial: 'Comercio de ejemplo',
    nif: 'B01000012',
    direccion: 'Calle de ejemplo 1',
    poblacion: 'Bilbao',
    provincia: 'Bizkaia',
    cp: '48001',
    email: 'info@example.com',
    web: 'https://example.com',
    diputacion: 2,
    epigrafe: '301800'
});
```

El request utiliza:

```ts
interface TicketBaiWsCreateCompanyRequest {
    readonly id_licencia?: number;
    readonly nombre_social: string;
    readonly nombre_comercial?: string;
    readonly nif: string;
    readonly direccion: string;
    readonly poblacion: string;
    readonly provincia: string;
    readonly cp: string;
    readonly email?: string;
    readonly web?: string;
    readonly diputacion: TicketBaiWsCompanyTaxAuthority;
    readonly epigrafe?: string;
}
```

### `id_licencia`

ID de la licencia a la que se asociará la empresa.

Es opcional en el SDK porque TicketBaiWS documenta que, si no se informa, utilizará una licencia disponible o creará una nueva según las condiciones de la cuenta.

### `diputacion`

El SDK expone:

```ts
type TicketBaiWsCompanyTaxAuthority =
    | 1
    | 2
    | 3
    | 4;
```

Códigos documentados por TicketBaiWS:

```text
1 → Álava
2 → Bizkaia
3 → Gipuzkoa
4 → Veri*Factu
```

Ejemplo:

```ts
diputacion: 2
```

para una empresa que presenta en Bizkaia.

### `epigrafe`

El campo:

```ts
epigrafe?: string;
```

se mantiene opcional en el modelo.

TicketBaiWS documenta que es obligatorio en determinados casos de Bizkaia, concretamente para ciertos tipos de contribuyente.

El SDK no intenta determinar automáticamente si una empresa está obligada a informarlo.

Ejemplo:

```ts
epigrafe: '301800'
```

## Respuesta

Las operaciones de empresa utilizan:

```ts
TicketBaiWsCompanyResponse
```

y devuelven un:

```ts
TicketBaiWsCompany
```

Modelo público:

```ts
interface TicketBaiWsCompany {
    readonly id: string;
    readonly id_licencia: string;
    readonly epigrafe: string;
    readonly nombre_social: string;
    readonly nombre_comercial: string;
    readonly nif: string;
    readonly direccion: string;
    readonly poblacion: string;
    readonly provincia: string;
    readonly cp: string;
    readonly email: string;
    readonly web: string;
    readonly diputacion?: TicketBaiWsCompanyTaxAuthority;
    readonly token: string;
    readonly token_test: string;
    readonly autorenovacion?: boolean;
}
```

Ejemplo:

```ts
const response = await client.companies.create({
    nombre_social: 'Empresa de ejemplo S.L.',
    nif: 'B01000012',
    direccion: 'Calle 1',
    poblacion: 'Bilbao',
    provincia: 'Bizkaia',
    cp: '48001',
    diputacion: 2
});

console.log(response.return.id);
console.log(response.return.token);
console.log(response.return.token_test);
```

### Tokens

La respuesta puede incluir:

```ts
token
token_test
```

Estos valores son credenciales y deben tratarse como información sensible por la aplicación consumidora.

No deben registrarse en logs ni incluirse en repositorios.

## Modificar una empresa

La modificación utiliza el NIF en la URL:

```ts
await client.companies.update(
    'B01000012',
    {
        nombre_comercial: 'Nuevo nombre comercial',
        email: 'nuevo@example.com',
        autorenovacion: true
    }
);
```

Firma conceptual:

```ts
update(
    nif: string,
    company: TicketBaiWsUpdateCompanyRequest
)
```

Modelo:

```ts
interface TicketBaiWsUpdateCompanyRequest {
    readonly nombre_social?: string;
    readonly nombre_comercial?: string;
    readonly direccion?: string;
    readonly poblacion?: string;
    readonly provincia?: string;
    readonly cp?: string;
    readonly email?: string;
    readonly web?: string;
    readonly epigrafe?: string;
    readonly autorenovacion?: boolean;
}
```

Todos los campos son opcionales porque TicketBaiWS indica que solo deben enviarse los datos que se quieran modificar.

El NIF no forma parte del body: se proporciona como primer argumento y se utiliza para construir:

```text
PUT /empresas/{NIF}/
```

El SDK codifica correctamente el valor al construir la URL.

### `autorenovacion`

El SDK lo modela como:

```ts
autorenovacion?: boolean;
```

Ejemplo:

```ts
await client.companies.update(
    'B01000012',
    {
        autorenovacion: true
    }
);
```

La tabla oficial describe actualmente `autorenovacion` como `string`, pero sus ejemplos JSON y respuestas lo utilizan como booleano.

El SDK sigue el JSON efectivo y utiliza `boolean`.

## Listar empresas

```ts
const response = await client.companies.list();
```

Sin filtros devuelve las empresas disponibles para la cuenta.

También se pueden aplicar:

```ts
interface TicketBaiWsListCompaniesRequest {
    readonly id_licencia?: string;
    readonly nif?: string;
}
```

### Por licencia

```ts
const response = await client.companies.list({
    id_licencia: '999'
});
```

### Por NIF

```ts
const response = await client.companies.list({
    nif: 'B01000012'
});
```

### Combinando filtros

```ts
const response = await client.companies.list({
    id_licencia: '999',
    nif: 'B01000012'
});
```

El SDK envía estos filtros mediante query string:

```text
GET /empresas/?id_licencia=999&nif=B01000012
```

No envía un body JSON en la petición GET.

La respuesta es:

```ts
TicketBaiWsListCompaniesResponse
```

con:

```ts
readonly TicketBaiWsCompany[]
```

dentro de `return`.

## Entorno

`@osumi/ticketbaiws` utiliza el entorno configurado en `TicketBaiWsClient`:

```ts
environment: 'test'
```

o:

```ts
environment: 'production'
```

Por tanto, conceptualmente:

```text
test       → https://api-test.ticketbaiws.eus/empresas/
production → https://api.ticketbaiws.eus/empresas/
```

Las páginas específicas de empresas de TicketBaiWS muestran actualmente únicamente URLs de producción, mientras la documentación general define el patrón de entornos para el API.

El SDK mantiene una política uniforme y utiliza el entorno seleccionado en el cliente.

## Tipos públicos

```ts
import type {
    TicketBaiWsCompany,
    TicketBaiWsCompanyResponse,
    TicketBaiWsCompanyTaxAuthority,
    TicketBaiWsCreateCompanyRequest,
    TicketBaiWsListCompaniesRequest,
    TicketBaiWsListCompaniesResponse,
    TicketBaiWsUpdateCompanyRequest
} from '@osumi/ticketbaiws';
```

## Errores

Las operaciones pueden lanzar los errores comunes del SDK:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Consulta [Primeros pasos](getting-started.md) para más detalles.

## Notas sobre la documentación oficial

Hay varias diferencias relevantes entre tablas y ejemplos:

- `id_licencia` se documenta como `integer`, pero algunos ejemplos JSON lo muestran como string.
- `autorenovacion` figura como `string` en la tabla de edición, pero los JSON lo utilizan como booleano.
- las páginas específicas muestran `api.ticketbaiws.eus`, mientras la documentación general describe entornos de test y producción;
- algunos ejemplos GET envían un body JSON, mientras el SDK utiliza query string.

El SDK intenta seguir el contrato más coherente y predecible sin transformar innecesariamente la respuesta del servicio.

## Documentación oficial

Nueva empresa:

https://ticketbaiws.eus/es/empresas-post/

Editar empresa:

https://ticketbaiws.eus/es/documentacion-api/empresas-put/

Consulta de empresas:

https://ticketbaiws.eus/es/empresas-get/

---

[← Volver al índice de documentación](README.md)
