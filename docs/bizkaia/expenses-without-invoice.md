# LROE — Gastos sin factura

[← Volver al índice Bizkaia](README.md)

Este documento describe el recurso:

```ts
client.bizkaia.lroe.expensesWithoutInvoice;
```

Permite registrar, modificar, consultar y anular gastos sin factura
en el LROE de BATUZ Bizkaia.

## Alcance

Este recurso corresponde al apartado 2.2 del LROE de Bizkaia,
modelo 140.

Está destinado a contribuyentes a los que se aplica ese modelo,
como personas físicas con actividad económica y determinadas
entidades en atribución de rentas.

Algunos ejemplos de gastos son:

- Cuotas de autónomos.
- Comisiones y servicios bancarios.
- Primas de seguros.
- Otros gastos empresariales no documentados mediante factura.

El SDK no determina si un gasto debe declararse en este apartado.
Esa decisión corresponde a la aplicación consumidora y a la
normativa fiscal aplicable.

## Resumen de métodos

```ts
client.bizkaia.lroe.expensesWithoutInvoice.create(...)
client.bizkaia.lroe.expensesWithoutInvoice.update(...)
client.bizkaia.lroe.expensesWithoutInvoice.list(...)
client.bizkaia.lroe.expensesWithoutInvoice.cancel(...)
```

Correspondencia con TicketBaiWS:

| SDK        | HTTP     | Endpoint                  |
| ---------- | -------- | ------------------------- |
| `create()` | `POST`   | `lroe-gastos-sinfactura/` |
| `update()` | `PUT`    | `lroe-gastos-sinfactura/` |
| `list()`   | `GET`    | `lroe-gastos-sinfactura/` |
| `cancel()` | `DELETE` | `lroe-gastos-sinfactura/` |

Las operaciones de alta, modificación y anulación aceptan
lotes de hasta 1000 registros.

El SDK no divide automáticamente los lotes.

## Identificación de un gasto

El identificador de un gasto está formado por cuatro campos:

| Campo             | Tipo     | Obligatorio |
| ----------------- | -------- | ----------- |
| `fecha_operacion` | `string` | Sí          |
| `concepto`        | `string` | Sí          |
| `epigrafe`        | `string` | No          |
| `linea`           | `number` | No          |

El modelo público es:

```ts
interface TicketBaiWsLroeExpenseWithoutInvoiceKey {
  readonly fecha_operacion: string;
  readonly concepto: TicketBaiWsLroeExpenseWithoutInvoiceConcept;
  readonly epigrafe?: string;
  readonly linea?: number;
}
```

### `fecha_operacion`

Fecha del gasto en formato `dd/mm/yyyy`.

Debe corresponder al ejercicio indicado en la petición.

### `concepto`

Código contable del gasto.

El SDK lo representa como una cadena, aunque esté formado
exclusivamente por dígitos.

Ejemplos:

| Código    | Concepto                                          |
| --------- | ------------------------------------------------- |
| `'625'`   | Primas de seguros                                 |
| `'626'`   | Servicios bancarios y similares                   |
| `'628'`   | Suministros                                       |
| `'64201'` | Seguridad Social a cargo de la empresa: autónomos |
| `'64202'` | Seguridad Social a cargo de la empresa: empleados |

El catálogo completo se representa mediante:

```ts
TicketBaiWsLroeExpenseWithoutInvoiceConcept;
```

Este tipo reutiliza el catálogo de códigos definido para
pagos por criterio de caja.

### `epigrafe`

Epígrafe IAE de la actividad.

Si se omite, Berein documenta que utiliza el epígrafe
configurado en la ficha de empresa.

El SDK no consulta ni introduce automáticamente ese epígrafe.

### `linea`

Número de línea del gasto, entre 1 y 99.

El valor predeterminado documentado por Berein es 1.

Permite diferenciar varios gastos de la misma fecha,
epígrafe y concepto.

Por ejemplo, dos comisiones bancarias del mismo día
pueden identificarse con líneas diferentes.

**Importante:** una vez registrado el gasto, sus campos
identificadores no pueden modificarse. Para cambiarlos
es necesario anularlo y enviarlo de nuevo.

## Crear gastos

Ejemplo:

```ts
const response = await client.bizkaia.lroe.expensesWithoutInvoice.create({
  ejercicio: 2026,
  gastos: [
    {
      fecha_operacion: '30/09/2026',
      concepto: '64201',
      importe: 294,
    },
    {
      fecha_operacion: '30/09/2026',
      concepto: '626',
      linea: 2,
      importe: 12.5,
      nif: 'B01000017',
      nombre_social: 'Banco de ejemplo S.A.',
    },
  ],
});
```

El request utiliza:

```ts
interface TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest {
  readonly ejercicio: number;
  readonly gastos: readonly TicketBaiWsLroeExpenseWithoutInvoice[];
}
```

### Modelo de gasto

```ts
interface TicketBaiWsLroeExpenseWithoutInvoice extends TicketBaiWsLroeExpenseWithoutInvoiceKey {
  readonly importe: number;
  readonly nif?: string;
  readonly nombre_social?: string;
  readonly pais?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly referencia_bien?: string;
  readonly referencia_catastral?: string;
  readonly territorio_alta_actividad?: TicketBaiWsLroeExpenseWithoutInvoiceTerritory;
  readonly criterio_cobros_pagos?: boolean;
}
```

### `importe`

Importe del gasto a efectos del IRPF.

Se representa como `number` y puede ser negativo.

Berein documenta una precisión de dos decimales.

El SDK transmite el valor recibido sin redondearlo ni
aplicar reglas fiscales adicionales.

### Datos de la contraparte

Puede identificarse al proveedor o entidad asociada
al gasto mediante:

```ts
nif?: string;
nombre_social?: string;
pais?: string;
tipo_documento?: TicketBaiWsDocumentType;
```

Cuando se informa `nif`, Berein exige también
`nombre_social`.

El SDK documenta esta condición, pero no la valida
automáticamente en el modelo TypeScript.

Para contrapartes extranjeras pueden utilizarse
`pais` y `tipo_documento`.

El país se expresa mediante un código ISO-3166 Alpha-2.

El tipo de documento admite los códigos documentados
por TicketBaiWS, del `02` al `06`.

### Referencias de bienes

Están disponibles:

```ts
referencia_bien?: string;
referencia_catastral?: string;
```

Se utilizan cuando corresponde relacionar el gasto
con un bien afecto o un inmueble.

### Territorio de alta de la actividad

```ts
type TicketBaiWsLroeExpenseWithoutInvoiceTerritory =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5';
```

Códigos:

| Código | Territorio |
| ------ | ---------- |
| `'1'`  | Araba      |
| `'2'`  | Bizkaia    |
| `'3'`  | Gipuzkoa   |
| `'4'`  | Navarra    |
| `'5'`  | Estado     |

### Criterio de cobros y pagos

```ts
criterio_cobros_pagos?: boolean;
```

Indica si el gasto se imputa mediante el criterio
de cobros y pagos.

El SDK no determina cuándo corresponde aplicar este
criterio y no introduce ningún valor predeterminado.

## Modificar gastos

La modificación utiliza el mismo modelo que el alta:

```ts
await client.bizkaia.lroe.expensesWithoutInvoice.update({
  ejercicio: 2026,
  gastos: [
    {
      fecha_operacion: '30/09/2026',
      concepto: '64201',
      importe: 310,
    },
  ],
});
```

Berein exige reenviar los datos del gasto.

Los campos que lo identifican no pueden modificarse:

- `fecha_operacion`
- `epigrafe`
- `concepto`
- `linea`

Si alguno debe cambiar, la aplicación consumidora
debe anular el registro anterior y crear uno nuevo.

## Resultado de las mutaciones

Las operaciones `create()`, `update()` y `cancel()`
utilizan la misma estructura de respuesta.

Tipo público:

```ts
TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse;
```

Su contenido principal es:

```ts
interface TicketBaiWsLroeExpensesWithoutInvoiceMutationResult {
  readonly response: readonly TicketBaiWsLroeExpenseWithoutInvoiceOperationResult[];
  readonly status: TicketBaiWsLroeExpensesWithoutInvoiceBatchStatus;
}
```

Cada elemento tiene:

```ts
interface TicketBaiWsLroeExpenseWithoutInvoiceOperationResult {
  readonly fecha_operacion: string;
  readonly epigrafe: string;
  readonly concepto: TicketBaiWsLroeExpenseWithoutInvoiceConcept;
  readonly linea: number;
  readonly estado: TicketBaiWsLroeExpenseWithoutInvoiceResultStatus;
  readonly codigo_error?: string;
  readonly descripcion_error?: string;
  readonly existe?: boolean;
}
```

### Estado individual

Los posibles estados tipados son:

```ts
'Correcto';
'AceptadoConErrores';
'Incorrecto';
```

El campo `existe` puede aparecer cuando un gasto
ya consta como aceptado.

Berein documenta que los gastos aceptados previamente
no se vuelven a enviar durante el alta.

### Estado global

El resultado del lote contiene:

```ts
status: 'OK' | 'ERROR';
```

Es importante diferenciar los dos niveles de resultado:

```ts
response.result;
response.return.status;
```

Por ejemplo:

```ts
const response = await client.bizkaia.lroe.expensesWithoutInvoice.create({
  ejercicio: 2026,
  gastos: [
    {
      fecha_operacion: '30/09/2026',
      concepto: '626',
      importe: 12.5,
    },
  ],
});

console.log(response.result);
console.log(response.return.status);

for (const item of response.return.response) {
  console.log(item.estado);
  console.log(item.codigo_error);
  console.log(item.descripcion_error);
}
```

Una respuesta general `OK` no garantiza que todos
los registros individuales hayan sido aceptados.

La aplicación debe revisar el resultado de cada gasto.

## Consultar gastos

Es obligatorio indicar el ejercicio:

```ts
const response = await client.bizkaia.lroe.expensesWithoutInvoice.list({
  ejercicio: 2026,
});
```

Pueden aplicarse filtros adicionales:

```ts
const response = await client.bizkaia.lroe.expensesWithoutInvoice.list({
  ejercicio: 2026,
  fecha_operacion_desde: '01/09/2026',
  fecha_operacion_hasta: '30/09/2026',
  nif: 'B01000017',
  estado: 'Correcto',
  pagina: 1,
});
```

Modelo de filtros:

```ts
interface TicketBaiWsListLroeExpensesWithoutInvoiceRequest {
  readonly ejercicio: number;
  readonly fecha_operacion_desde?: string;
  readonly fecha_operacion_hasta?: string;
  readonly nif?: string;
  readonly pais?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly epigrafe?: string;
  readonly estado?: TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus;
  readonly pagina?: number;
}
```

Los filtros se envían mediante query string.

Ejemplo conceptual:

```text
GET /lroe-gastos-sinfactura/?ejercicio=2026&pagina=1
```

El SDK no envía un body JSON en las peticiones GET.

### Estados de consulta

El tipo de estado permite:

```ts
type TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus =
  | 'Correcto'
  | 'AceptadoConErrores'
  | 'Incorrecto'
  | 'Anulado';
```

La página oficial de consulta enumera expresamente
`Correcto`, `AceptadoConErrores` y `Anulado` como filtros.

El SDK conserva también `Incorrecto` en el tipo
compartido de estados, sin modificar los valores recibidos.

### Modelo de respuesta

El resultado contiene:

```ts
interface TicketBaiWsListLroeExpensesWithoutInvoiceResult {
  readonly response: readonly TicketBaiWsLroeExpenseWithoutInvoiceQueryItem[];
}
```

Cada registro utiliza:

```ts
interface TicketBaiWsLroeExpenseWithoutInvoiceQueryItem {
  readonly fecha_operacion: string;
  readonly epigrafe: string;
  readonly concepto: TicketBaiWsLroeExpenseWithoutInvoiceConcept;
  readonly linea: number;
  readonly importe: number;
  readonly nif?: string;
  readonly nombre_social?: string;
  readonly pais?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly estado: TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus;
  readonly fecha_presentacion?: string;
  readonly [key: string]: unknown;
}
```

El SDK conserva otros campos que el API pueda
devolver sin eliminarlos.

### Importe en las consultas

A diferencia de algunos otros recursos LROE,
la documentación de gastos sin factura muestra:

```ts
importe: 12.5;
```

como número y no como cadena.

El SDK utiliza:

```ts
importe: number;
```

También en el modelo de consulta.

No realiza conversiones automáticas entre cadenas
y números.

## Anular gastos

La anulación solo requiere el ejercicio y los campos
identificadores de los gastos:

```ts
const response = await client.bizkaia.lroe.expensesWithoutInvoice.cancel({
  ejercicio: 2026,
  gastos: [
    {
      fecha_operacion: '30/09/2026',
      concepto: '626',
      linea: 2,
    },
  ],
});
```

El request utiliza:

```ts
interface TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest {
  readonly ejercicio: number;
  readonly gastos: readonly TicketBaiWsLroeExpenseWithoutInvoiceKey[];
}
```

No es necesario enviar `importe`, `nif` ni los demás
datos del gasto.

La anulación se realiza mediante una petición DELETE
con cuerpo JSON.

El resultado utiliza el mismo tipo que el alta
y la modificación.

## Tipos públicos

Todos los modelos están disponibles desde
`@osumi/ticketbaiws`:

```ts
import type {
  TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsListLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsListLroeExpensesWithoutInvoiceResponse,
  TicketBaiWsListLroeExpensesWithoutInvoiceResult,
  TicketBaiWsLroeExpenseWithoutInvoice,
  TicketBaiWsLroeExpenseWithoutInvoiceConcept,
  TicketBaiWsLroeExpenseWithoutInvoiceKey,
  TicketBaiWsLroeExpenseWithoutInvoiceOperationResult,
  TicketBaiWsLroeExpenseWithoutInvoiceQueryItem,
  TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus,
  TicketBaiWsLroeExpenseWithoutInvoiceResultStatus,
  TicketBaiWsLroeExpenseWithoutInvoiceTerritory,
  TicketBaiWsLroeExpensesWithoutInvoiceBatchStatus,
  TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse,
  TicketBaiWsLroeExpensesWithoutInvoiceMutationResult,
  TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest,
} from '@osumi/ticketbaiws';
```

No es necesario importar archivos internos del paquete.

## Errores

Las operaciones pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Además de estos errores, los resultados de mutaciones
pueden contener registros rechazados individualmente.

La aplicación debe comprobar ambos niveles de resultado.

Consulta [Primeros pasos](../getting-started.md)
para más información sobre el tratamiento de errores.

## Documentación oficial

- [Enviar gastos sin factura](https://ticketbaiws.eus/es/lroe-gastos-sinfactura-post/)
- [Modificar gastos sin factura](https://ticketbaiws.eus/es/lroe-gastos-sinfactura-put/)
- [Consultar gastos sin factura](https://ticketbaiws.eus/es/lroe-gastos-sinfactura-get/)
- [Anular gastos sin factura](https://ticketbaiws.eus/es/lroe-gastos-sinfactura-del/)

---

[← Volver al índice Bizkaia](README.md)
