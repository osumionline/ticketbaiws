# Herramienta de facturación — Clientes

[← Volver al índice de documentación](../README.md)

Esta guía documenta el recurso:

```ts
client.billing.customers;
```

Permite buscar, consultar, crear y modificar los clientes
de la herramienta de facturación del área privada de
TicketBaiWS.

## Alcance

Este recurso gestiona los clientes utilizados por la
herramienta de facturación de Berein.

No debe confundirse con:

```ts
client.companies;
```

`client.companies` administra las empresas asociadas
a la cuenta de desarrollador.

`client.billing.customers` gestiona los destinatarios
de las facturas de una empresa.

### Datos compartidos entre entornos

**Los clientes no están separados entre los entornos
de pruebas y producción.**

Berein documenta que ambos entornos consultan y
modifican los mismos clientes de la herramienta
de facturación.

Por tanto, ejecutar `create()` o `update()` con el
token de pruebas puede modificar datos utilizados
también en producción.

Los tests automatizados del SDK utilizan respuestas
simuladas y no realizan modificaciones reales.

## Resumen de métodos

```ts
client.billing.customers.list(...)
client.billing.customers.get(...)
client.billing.customers.create(...)
client.billing.customers.update(...)
```

| SDK        | HTTP   | Endpoint         |
| ---------- | ------ | ---------------- |
| `list()`   | `GET`  | `clientes/`      |
| `get()`    | `GET`  | `clientes/{id}/` |
| `create()` | `POST` | `clientes/`      |
| `update()` | `PUT`  | `clientes/{id}/` |

El SDK no expone un método de eliminación de clientes.

## Buscar clientes

Sin filtros:

```ts
const response = await client.billing.customers.list();
```

Con búsqueda:

```ts
const response = await client.billing.customers.list({
  buscar: 'Uribe',
  pagina: 0,
  cantidad: 25,
});
```

El modelo de filtros es:

```ts
interface TicketBaiWsListBillingCustomersRequest {
  readonly buscar?: string;
  readonly nif?: string;
  readonly pagina?: number;
  readonly cantidad?: number;
}
```

Todos los campos son opcionales.

### `buscar`

Busca coincidencias en los datos del cliente:

- NIF.
- Nombre o razón social.
- Nombre comercial.
- Correo electrónico.
- Teléfono.

Ejemplo:

```ts
await client.billing.customers.list({
  buscar: 'Uribe',
});
```

### `nif`

Permite buscar por identificador fiscal exacto:

```ts
await client.billing.customers.list({
  nif: 'B89670855',
});
```

Puede combinarse con `buscar`.

### Paginación

Los parámetros disponibles son:

```ts
pagina?: number;
cantidad?: number;
```

Berein documenta:

| Parámetro  | Comportamiento      |
| ---------- | ------------------- |
| `pagina`   | Primera página: `0` |
| `cantidad` | Predeterminado: 50  |
| `cantidad` | Máximo: 250         |

Ejemplo:

```ts
const response = await client.billing.customers.list({
  pagina: 0,
  cantidad: 50,
});
```

El SDK conserva `pagina: 0` cuando se envía
explícitamente.

No pagina automáticamente ni impone los límites
mediante validaciones locales.

### Respuesta del listado

Tipo público:

```ts
type TicketBaiWsListBillingCustomersResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsBillingCustomer[]
> & {
  readonly count?: number;
};
```

`return` contiene los clientes de la página.

`count` es una propiedad adicional del sobre
de TicketBaiWS que indica el total de resultados.

El SDK la conserva cuando el API la proporciona.

Ejemplo:

```ts
const response = await client.billing.customers.list({
  buscar: 'Uribe',
});

console.log('Total:', response.count);

for (const customer of response.return) {
  console.log(customer.id, customer.nombre);
}
```

El cliente HTTP no elimina ni transforma las
propiedades adicionales de la respuesta.

## Consultar un cliente por ID

Para recuperar un cliente concreto:

```ts
const response = await client.billing.customers.get(123);

console.log(response.return.nombre);
console.log(response.return.nif);
```

El método recibe un identificador numérico:

```ts
get(id: number)
```

Realiza:

```text
GET /clientes/123/
```

A diferencia de `list()`, devuelve un solo cliente
dentro de `return`.

El tipo utilizado es:

```ts
TicketBaiWsBillingCustomerResponse;
```

## Modelo de cliente

Los clientes devueltos por el API se representan
mediante:

```ts
interface TicketBaiWsBillingCustomer {
  readonly id: number;
  readonly nif: string;
  readonly tipo_documento: string;
  readonly nombre: string;
  readonly nombre_comercial: string;
  readonly direccion: string;
  readonly cp: string;
  readonly poblacion: string;
  readonly provincia: string;
  readonly pais: string;
  readonly pais_cliente: string;
  readonly email: string;
  readonly telefono: string;
  readonly web: string;
  readonly fecha_alta: string;
}
```

### `id`

Identificador numérico del cliente en la herramienta
de facturación de Berein.

Se utiliza para consultar y modificar el registro.

### `nombre` y `nombre_comercial`

`nombre` contiene el nombre o razón social.

`nombre_comercial` contiene el nombre comercial,
si corresponde.

Ambos campos se conservan por separado.

### `nif` y `tipo_documento`

Contienen los datos de identificación fiscal.

En el modelo de lectura, `tipo_documento` es `string`.

En los modelos de escritura utiliza
`TicketBaiWsDocumentType`, con los códigos
documentados por la API.

### `pais` y `pais_cliente`

La respuesta incluye dos campos relacionados
con el país:

- `pais`: representación del país usada por
  la herramienta de facturación.
- `pais_cliente`: código del país utilizado
  para la emisión de facturas.

El SDK conserva ambos valores y no sustituye
uno por el otro.

### `fecha_alta`

Fecha de creación registrada por TicketBaiWS.

El SDK la devuelve sin convertirla a `Date`.

## Crear un cliente

Ejemplo:

```ts
const response = await client.billing.customers.create({
  nombre: 'Construcciones Uribe S.L.',
  nombre_comercial: 'Construcciones Uribe',
  nif: 'B89670855',
  direccion: 'Calle Mayor 1',
  cp: '48001',
  poblacion: 'Bilbao',
  provincia: 'Bizkaia',
  pais: 'ES',
  email: 'facturas@uribe.example',
});

console.log(response.return.id);
```

El tipo público es:

```ts
interface TicketBaiWsCreateBillingCustomerRequest extends TicketBaiWsBillingCustomerFields {
  readonly nombre: string;
}
```

`nombre` es el único campo obligatorio del modelo
de alta.

Por tanto, también es válido:

```ts
await client.billing.customers.create({
  nombre: 'Cliente sin NIF',
});
```

### Campos admitidos

Los campos comunes del alta y la modificación son:

```ts
interface TicketBaiWsBillingCustomerFields {
  readonly nombre?: string;
  readonly nombre_comercial?: string;
  readonly nif?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly direccion?: string;
  readonly cp?: string;
  readonly poblacion?: string;
  readonly provincia?: string;
  readonly pais?: string;
  readonly email?: string;
  readonly telefono?: string;
  readonly web?: string;
}
```

Los nombres de los campos se mantienen en
`snake_case`, siguiendo la API de Berein.

### Alias documentados

El OpenAPI menciona `nombre_social` como alias
de `nombre` y `pais_cliente` como alias de `pais`
en la escritura.

Sin embargo, el esquema publicado exige `nombre`
y no declara estos alias como propiedades
independientes del request.

Por ello, el SDK utiliza los nombres documentados
en el esquema de escritura:

```ts
nombre: 'Empresa S.L.',
pais: 'ES'
```

Esta ambigüedad está registrada como `DISC-011`
en [Discrepancias de la documentación](../discrepancias.md).

No se recomienda utilizar los alias pendientes
de aclaración hasta conocer el contrato definitivo.

## Modificar un cliente

Para modificar un registro:

```ts
const response = await client.billing.customers.update(123, {
  nombre_comercial: 'Uribe Construcciones',
  email: 'administracion@uribe.example',
});
```

La petición utiliza:

```text
PUT /clientes/123/
```

El método recibe:

```ts
update(
    id: number,
    customer: TicketBaiWsUpdateBillingCustomerRequest
)
```

El modelo es un alias de los campos comunes:

```ts
type TicketBaiWsUpdateBillingCustomerRequest = TicketBaiWsBillingCustomerFields;
```

Todos sus campos son opcionales.

La modificación es parcial: solo se envían las
propiedades presentes en el objeto recibido.

Por ejemplo:

```ts
await client.billing.customers.update(123, {
  telefono: '944111111',
});
```

El SDK envía únicamente:

```json
{
  "telefono": "944111111"
}
```

No recupera previamente el cliente ni completa
los datos omitidos.

La operación modifica los datos compartidos
entre ambos entornos.

## Respuestas y errores

`create()`, `get()` y `update()` devuelven:

```ts
TicketBaiWsBillingCustomerResponse;
```

El listado devuelve:

```ts
TicketBaiWsListBillingCustomersResponse;
```

Todas las respuestas conservan el sobre general:

```ts
{
    result: 'OK',
    return: ...,
    msg: null
}
```

Si Berein devuelve `result: 'ERROR'`, el SDK lanza
`TicketBaiWsApiError`.

Por ejemplo, el API puede rechazar un cliente
duplicado o una petición inválida.

También pueden lanzarse errores de HTTP, red
o estructura de respuesta.

El SDK no valida ni modifica previamente los datos
fiscales del cliente.

## Tipos públicos

Los tipos están disponibles desde el paquete:

```ts
import type {
  TicketBaiWsBillingCustomer,
  TicketBaiWsBillingCustomerFields,
  TicketBaiWsBillingCustomerResponse,
  TicketBaiWsCreateBillingCustomerRequest,
  TicketBaiWsListBillingCustomersRequest,
  TicketBaiWsListBillingCustomersResponse,
  TicketBaiWsUpdateBillingCustomerRequest,
} from '@osumi/ticketbaiws';
```

No es necesario importar archivos internos.

## Documentación oficial

- [Documentación general de TicketBaiWS](https://ticketbaiws.eus/es/documentacion-api/)
- [Especificación OpenAPI](https://api.ticketbaiws.eus/openapi.json)
- [Ejemplo de clientes y productos en la librería PHP](https://ticketbaiws.eus/es/desarrolladores/api-verifactu-php/)

---

[← Volver al índice de documentación](../README.md)
