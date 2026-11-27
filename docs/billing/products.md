# Herramienta de facturación — Productos

[← Volver al índice de documentación](../README.md)

Esta guía documenta el recurso:

```ts
client.billing.products;
```

Permite buscar y consultar los productos de la
herramienta de facturación del área privada de
TicketBaiWS.

## Alcance

Los productos consultados son los configurados
en la herramienta de facturación de Berein.

**Los productos son compartidos entre los entornos
de pruebas y producción.**

El SDK no mantiene una base de datos propia de
productos ni modifica sus valores.

El recurso disponible es de solo lectura.

## Resumen de métodos

```ts
client.billing.products.list(...)
client.billing.products.get(...)
```

| SDK      | HTTP  | Endpoint              |
| -------- | ----- | --------------------- |
| `list()` | `GET` | `productos/`          |
| `get()`  | `GET` | `productos/{codigo}/` |

El OpenAPI consultado no publica operaciones
POST, PUT o DELETE para estos productos.

Por tanto, el SDK no expone métodos para
crearlos, modificarlos ni eliminarlos.

## Buscar productos

Sin filtros:

```ts
const response = await client.billing.products.list();
```

Con búsqueda:

```ts
const response = await client.billing.products.list({
  buscar: 'mantenimiento',
  pagina: 0,
  cantidad: 50,
});
```

La petición utiliza:

```text
GET /productos/?buscar=mantenimiento&pagina=0&cantidad=50
```

Los filtros se envían mediante query string,
sin cuerpo JSON.

## Filtros disponibles

El modelo público es:

```ts
interface TicketBaiWsListBillingProductsRequest {
  readonly buscar?: string;
  readonly referencia?: string;
  readonly familia?: string;
  readonly pagina?: number;
  readonly cantidad?: number;
}
```

Todos sus campos son opcionales.

### `buscar`

Permite realizar una búsqueda textual.

Berein documenta la búsqueda sobre nombres
en distintos idiomas y otros datos del producto,
incluidas referencias, marcas, códigos HS
y familias.

Ejemplo:

```ts
await client.billing.products.list({
  buscar: 'mantenimiento',
});
```

### `referencia`

Permite filtrar mediante la referencia exacta
del producto:

```ts
await client.billing.products.list({
  referencia: 'MANT-H',
});
```

La referencia es independiente de `codigo`,
que identifica el producto en su endpoint individual.

### `familia`

Filtra por el código de familia:

```ts
await client.billing.products.list({
  familia: '12',
});
```

Se mantiene como `string` porque es un código
identificativo y no una magnitud numérica.

### `pagina` y `cantidad`

La paginación comienza en la página cero.

Berein documenta:

| Parámetro  | Comportamiento      |
| ---------- | ------------------- |
| `pagina`   | Primera página: `0` |
| `cantidad` | Predeterminado: 50  |
| `cantidad` | Máximo: 250         |

Ejemplo:

```ts
const response = await client.billing.products.list({
  pagina: 1,
  cantidad: 100,
});
```

El SDK no implementa paginación automática
ni ajusta estos valores.

## Respuesta del listado

El listado utiliza:

```ts
type TicketBaiWsListBillingProductsResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsBillingProduct[]
> & {
  readonly count?: number;
};
```

`return` contiene los productos devueltos.

`count` contiene el número total de resultados
cuando Berein lo proporciona.

Ejemplo:

```ts
const response = await client.billing.products.list({
  buscar: 'mantenimiento',
});

console.log('Total:', response.count);

for (const product of response.return) {
  console.log(product.codigo, product.descripcion, product.importe_unitario);
}
```

El SDK mantiene las propiedades originales
de la respuesta, incluido el `count` opcional.

## Consultar un producto por código

Para recuperar un producto concreto:

```ts
const response = await client.billing.products.get('4512');

console.log(response.return.descripcion);
console.log(response.return.importe_unitario);
```

Se realiza:

```text
GET /productos/4512/
```

El método recibe un código de tipo `string`:

```ts
get(code: string)
```

### Por qué `codigo` es una cadena

El identificador de producto puede contener dígitos,
pero no representa una cantidad.

El SDK lo trata como un código y conserva
su representación exacta.

Por ejemplo:

```ts
await client.billing.products.get('004512');
```

No elimina los ceros iniciales.

Los caracteres especiales se codifican
correctamente para construir la URL.

La consulta individual devuelve:

```ts
TicketBaiWsBillingProductResponse;
```

con un único producto en `return`.

## Modelo de producto

El modelo público es:

```ts
interface TicketBaiWsBillingProduct {
  readonly codigo: string;
  readonly referencia: string;
  readonly descripcion: string;
  readonly nombre_en: string;
  readonly nombre_eu: string;
  readonly marca: string;
  readonly familia: string;
  readonly codigo_familia: string;
  readonly hs_code: string;
  readonly cantidad: number;
  readonly importe_unitario: number;
  readonly tipo_iva: number;
  readonly tipo_req: number;
  readonly tipo_retencion: number;
}
```

### Identificadores

El SDK distingue:

- `codigo`: identificador del producto utilizado
  para obtenerlo por su endpoint individual.
- `referencia`: referencia del producto.
- `codigo_familia`: código de la familia.

Los tres se conservan como cadenas.

### Descripciones e idiomas

Los campos disponibles son:

```ts
descripcion: string;
nombre_en: string;
nombre_eu: string;
```

`descripcion` contiene la descripción principal.

`nombre_en` y `nombre_eu` contienen los nombres
en inglés y euskera, respectivamente.

El SDK no realiza traducciones ni selecciona
automáticamente un idioma.

### Marca, familia y código HS

Los campos:

```ts
marca: string;
familia: string;
codigo_familia: string;
hs_code: string;
```

conservan la información de clasificación
facilitada por Berein.

No se normalizan a otros identificadores.

### Cantidad y precio unitario

Los campos:

```ts
cantidad: number;
importe_unitario: number;
```

se reciben como números.

`importe_unitario` representa el precio
unitario sin IVA.

El SDK no calcula el importe total de una línea
ni interpreta `cantidad` como existencias
de un almacén.

### Impuestos

Los porcentajes se representan mediante:

```ts
tipo_iva: number;
tipo_req: number;
tipo_retencion: number;
```

Son los valores numéricos devueltos por el API.

Por ejemplo:

```ts
{
    tipo_iva: 21,
    tipo_req: 0,
    tipo_retencion: 0
}
```

El SDK no transforma esos valores en fracciones,
ni calcula cuotas, ni aplica redondeos.

Las reglas fiscales corresponden a la aplicación
consumidora y al servicio TicketBaiWS.

## Uso de un producto para facturar

Los datos del producto pueden utilizarse
como origen de información al construir
las líneas de una factura.

Ejemplo conceptual:

```ts
const response = await client.billing.products.get('4512');

const product = response.return;

const line = {
  descripcion: product.descripcion,
  cantidad: 3,
  importe_unitario: product.importe_unitario,
  tipo_iva: product.tipo_iva,
  tipo_req: product.tipo_req,
};
```

Este ejemplo construye un objeto con algunos
campos habituales de una línea de factura.

El SDK no transforma automáticamente un
`TicketBaiWsBillingProduct` en una línea fiscal.

La aplicación es responsable de comprobar
los impuestos, cantidades y demás datos
necesarios antes de crear la factura.

Consulta [Facturación](../invoices.md) para
conocer los modelos de emisión de facturas.

## Respuestas y errores

Ambos métodos devuelven el sobre estándar:

```ts
{
    result: 'OK',
    return: ...,
    msg: null
}
```

El listado devuelve un array; la consulta
individual devuelve un objeto.

Si Berein responde con `result: 'ERROR'`,
el SDK lanza `TicketBaiWsApiError`.

También pueden lanzarse errores HTTP, de red
o de estructura de la respuesta.

Las consultas no aceptan normalmente `PENDING`.
Si una operación GET devuelve inesperadamente
ese resultado, el cliente HTTP lanza
`TicketBaiWsResponseError`.

## Tipos públicos

Todos los tipos se exportan desde el paquete:

```ts
import type {
  TicketBaiWsBillingProduct,
  TicketBaiWsBillingProductResponse,
  TicketBaiWsListBillingProductsRequest,
  TicketBaiWsListBillingProductsResponse,
} from '@osumi/ticketbaiws';
```

No es necesario importar rutas internas.

## Documentación oficial

- [Documentación general de TicketBaiWS](https://ticketbaiws.eus/es/documentacion-api/)
- [Especificación OpenAPI](https://api.ticketbaiws.eus/openapi.json)
- [Ejemplo de productos en la librería PHP](https://ticketbaiws.eus/es/desarrolladores/api-verifactu-php/)

---

[← Volver al índice de documentación](../README.md)
