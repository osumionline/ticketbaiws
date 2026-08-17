# Licencias

[← Volver al índice de documentación](README.md)

Este documento describe el recurso de licencias de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.licenses
```

y permite crear nuevas licencias y consultar las licencias contratadas.

## Resumen de métodos

```ts
client.licenses.create(...)
client.licenses.list(...)
```

Correspondencia con TicketBaiWS:

| Método del SDK | Método HTTP | Recurso |
| --- | --- | --- |
| `create()` | `POST` | `licencias/` |
| `list()` | `GET` | `licencias/` |

## Crear licencias

```ts
const response = await client.licenses.create({
    plan: 3,
    cantidad: 2,
    meses_anos: 1,
    modalidad: 'mensual'
});
```

El request utiliza:

```ts
interface TicketBaiWsCreateLicenseRequest {
    readonly plan: number;
    readonly cantidad: number;
    readonly meses_anos: number;
    readonly modalidad: TicketBaiWsLicenseModality;
}
```

## `plan`

ID del plan que TicketBaiWS aplicará a las nuevas licencias.

Ejemplo:

```ts
plan: 3
```

El SDK no mantiene un catálogo local de planes ni valida que el ID exista.

## `cantidad`

Número de licencias que se quieren crear:

```ts
cantidad: 2
```

## `meses_anos`

Duración indicada para la contratación:

```ts
meses_anos: 1
```

La unidad se interpreta junto a `modalidad`.

## `modalidad`

El SDK restringe el campo a los dos valores documentados:

```ts
type TicketBaiWsLicenseModality =
    | 'mensual'
    | 'anual';
```

Ejemplo mensual:

```ts
modalidad: 'mensual'
```

Ejemplo anual:

```ts
modalidad: 'anual'
```

## Respuesta de creación

El resultado utiliza:

```ts
interface TicketBaiWsCreateLicenseResult {
    readonly ids_licencias: readonly string[];
}
```

Ejemplo:

```ts
const response = await client.licenses.create({
    plan: 3,
    cantidad: 3,
    meses_anos: 1,
    modalidad: 'mensual'
});

for (const id of response.return.ids_licencias) {
    console.log(id);
}
```

La respuesta documentada por TicketBaiWS devuelve los IDs como strings.

El SDK conserva esa representación:

```ts
readonly string[]
```

aunque conceptualmente representen identificadores numéricos.

## Listar licencias

Para consultar todas:

```ts
const response = await client.licenses.list();
```

Para filtrar por una licencia concreta:

```ts
const response = await client.licenses.list({
    id_licencia: 999
});
```

El request utiliza:

```ts
interface TicketBaiWsListLicensesRequest {
    readonly id_licencia?: number;
}
```

El SDK genera:

```text
GET /licencias/?id_licencia=999
```

No envía un body JSON en la petición GET.

## Modelo de licencia

Cada resultado utiliza:

```ts
interface TicketBaiWsLicense {
    readonly id: string;
    readonly id_plan: string;
    readonly fecha_alta: string;
    readonly fecha_fin: string;
    readonly renovacion_auto: string;
    readonly anual: string;
    readonly nombre_es: string;
    readonly nombre_eu: string;
    readonly precio_mensual: string;
    readonly precio_anual: string;
    readonly max_tickets_mes: string;
    readonly max_empresas: string;
    readonly max_facturacion: string;
    readonly n_empresas: string;
}
```

Ejemplo:

```ts
const response = await client.licenses.list();

for (const license of response.return) {
    console.log(
        license.id,
        license.nombre_es,
        license.fecha_fin
    );
}
```

## Valores numéricos devueltos como strings

Una característica importante de este endpoint es que TicketBaiWS devuelve como strings numerosos valores que conceptualmente podrían ser números o booleanos.

Ejemplo:

```ts
{
    id: '1',
    id_plan: '3',
    fecha_alta: '1648120433',
    fecha_fin: '1679656433',
    renovacion_auto: '1',
    anual: '1',
    precio_mensual: '5.99',
    precio_anual: '59.88',
    max_tickets_mes: '30',
    max_empresas: '1',
    max_facturacion: '6000',
    n_empresas: '1'
}
```

El SDK **no los convierte automáticamente**.

Por tanto:

```ts
license.precio_mensual
```

es un `string`, no un `number`.

Y:

```ts
license.renovacion_auto
```

es un `string` con valores como `'1'` o `'0'`, no un `boolean`.

Esto permite conservar fielmente la respuesta del servicio y evita conversiones silenciosas.

Si la aplicación necesita valores numéricos debe convertirlos explícitamente:

```ts
const monthlyPrice =
    Number(license.precio_mensual);
```

Si necesita interpretar flags:

```ts
const autoRenew =
    license.renovacion_auto === '1';
```

## Fechas

`fecha_alta` y `fecha_fin` aparecen documentadas mediante valores como:

```text
1648120433
1679656433
```

El SDK los conserva como strings.

No los convierte automáticamente a `Date`, ya que eso introduciría una interpretación adicional sobre el contrato recibido.

## Entorno

Al igual que con empresas, las páginas específicas de licencias muestran actualmente:

```text
https://api.ticketbaiws.eus/licencias/
```

pero `@osumi/ticketbaiws` utiliza siempre el entorno configurado en el cliente.

Conceptualmente:

```text
test       → https://api-test.ticketbaiws.eus/licencias/
production → https://api.ticketbaiws.eus/licencias/
```

Esta política mantiene todos los resources del SDK coherentes entre sí.

## Tipos públicos

```ts
import type {
    TicketBaiWsCreateLicenseRequest,
    TicketBaiWsCreateLicenseResponse,
    TicketBaiWsCreateLicenseResult,
    TicketBaiWsLicense,
    TicketBaiWsLicenseModality,
    TicketBaiWsListLicensesRequest,
    TicketBaiWsListLicensesResponse
} from '@osumi/ticketbaiws';
```

## Errores

Las operaciones pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Consulta [Primeros pasos](getting-started.md).

## Notas sobre la documentación oficial

El endpoint de consulta contiene algunas diferencias de representación:

- `id_licencia` se documenta como integer;
- algunos ejemplos cURL lo envían como string;
- casi todos los campos de respuesta se devuelven como string;
- algunos ejemplos GET envían el filtro mediante body JSON;
- las páginas específicas muestran solo producción, aunque la documentación general define entornos.

El SDK sigue una política uniforme: request tipado, query string en GET y preservación de los tipos recibidos en la respuesta.

## Documentación oficial

Crear licencia:

https://ticketbaiws.eus/es/licencias-post/

Consultar licencias:

https://ticketbaiws.eus/es/licencias-get/

---

[← Volver al índice de documentación](README.md)
