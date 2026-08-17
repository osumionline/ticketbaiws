# LROE — Criterio de caja: cobros

[← Volver al índice Bizkaia](README.md)

Este documento describe:

```ts
client.bizkaia.lroe.cashCollections
```

El recurso permite enviar, modificar, consultar y anular cobros del régimen especial del criterio de caja en BATUZ Bizkaia.

## Resumen

```ts
client.bizkaia.lroe.cashCollections.create(...)
client.bizkaia.lroe.cashCollections.update(...)
client.bizkaia.lroe.cashCollections.list(...)
client.bizkaia.lroe.cashCollections.cancel(...)
```

Correspondencia:

| SDK | HTTP | Endpoint |
| --- | --- | --- |
| `create()` | `POST` | `lroe-critcaja-cobros/` |
| `update()` | `PUT` | `lroe-critcaja-cobros/` |
| `list()` | `GET` | `lroe-critcaja-cobros/` |
| `cancel()` | `DELETE` | `lroe-critcaja-cobros/` |

Las mutaciones admiten lotes de hasta 1000 cobros según TicketBaiWS.

# Dos tipos de operación

Los cobros pueden ser:

```text
con_factura
sin_factura
```

El SDK los modela mediante una unión discriminada:

```ts
type TicketBaiWsLroeCashCollection =
    | TicketBaiWsLroeCashCollectionWithInvoice
    | TicketBaiWsLroeCashCollectionWithoutInvoice;
```

Esto evita un único objeto con todos sus campos opcionales.

## Cobro con factura

```ts
interface TicketBaiWsLroeCashCollectionWithInvoice
    extends TicketBaiWsLroeCashCollectionBase {
    readonly tipo_operacion?: 'con_factura';
    readonly serie?: string;
    readonly num_factura: string;
    readonly fecha_factura: string;
}
```

Ejemplo:

```ts
{
    fecha_factura: '15/08/2026',
    fecha_cobro: '17/08/2026',
    serie: 'A',
    num_factura: 'F-2026-100',
    importe_cobrado: 121,
    iva_devengado: 21,
    forma_pago: '01',
    descripcion_fpago: 'Transferencia'
}
```

`tipo_operacion` puede indicarse:

```ts
tipo_operacion: 'con_factura'
```

pero es opcional en esta variante.

La tabla oficial lo describe como obligatorio, aunque los ejemplos JSON oficiales con factura lo omiten. El SDK permite ambas formas.

## Cobro sin factura

Para operaciones sin factura el discriminante sí es obligatorio:

```ts
interface TicketBaiWsLroeCashCollectionWithoutInvoice
    extends TicketBaiWsLroeCashCollectionBase {
    readonly tipo_operacion: 'sin_factura';
    readonly tipo_ingreso:
        TicketBaiWsLroeCashCollectionIncomeType;
    readonly linea: number;
}
```

Ejemplo:

```ts
{
    epigrafe: '197210',
    fecha_cobro: '17/08/2026',
    tipo_operacion: 'sin_factura',
    tipo_ingreso: '2',
    linea: 1,
    importe_cobrado: 500,
    ingreso_irpf: 500,
    forma_pago: '04',
    descripcion_fpago: 'Otros medios'
}
```

# Campos comunes

```ts
interface TicketBaiWsLroeCashCollectionBase {
    readonly epigrafe?: string;
    readonly fecha_cobro: string;
    readonly importe_cobrado: number;
    readonly iva_devengado?: number;
    readonly ingreso_irpf?: number;
    readonly forma_pago?:
        TicketBaiWsLroeCashCollectionPaymentMethod;
    readonly descripcion_fpago?: string;
}
```

## Epígrafe

```ts
epigrafe?: string;
```

permite indicar un epígrafe específico cuando corresponda en LROE 140.

Ejemplo:

```ts
epigrafe: '197210'
```

## Importe cobrado

```ts
importe_cobrado: number;
```

se escribe como número.

Las consultas lo devuelven como:

```ts
importe_cobrado: string;
```

## IVA devengado

```ts
iva_devengado?: number;
```

representa la cuota de IVA cobrada cuando procede.

El SDK no la calcula.

## Ingreso IRPF

```ts
ingreso_irpf?: number;
```

se utiliza en los supuestos de LROE 140 documentados por TicketBaiWS.

# Tipo de ingreso

Las operaciones sin factura utilizan:

```ts
type TicketBaiWsLroeCashCollectionIncomeType =
    | '1'
    | '2'
    | '3'
    | '4';
```

Los códigos documentados son:

| Código | Concepto |
| --- | --- |
| `'1'` | Percepciones por incapacidad temporal |
| `'2'` | Subvenciones |
| `'3'` | Ingresos financieros |
| `'4'` | Ingresos extraordinarios y otros |

El SDK los representa como strings porque son códigos.

Ejemplo:

```ts
tipo_ingreso: '2'
```

La página GET contiene actualmente un ejemplo de valor `02`, mientras POST/PUT/DELETE enumeran `1`, `2`, `3`, `4`. El SDK sigue el catálogo consistente de las operaciones de escritura.

# Forma de pago

```ts
type TicketBaiWsLroeCashCollectionPaymentMethod =
    | '01'
    | '02'
    | '03'
    | '04'
    | '05';
```

Catálogo documentado:

| Código | Forma |
| --- | --- |
| `'01'` | Transferencia |
| `'02'` | Cheque |
| `'03'` | No se cobra/paga por los supuestos indicados por TicketBaiWS |
| `'04'` | Otros medios |
| `'05'` | Domiciliación bancaria |

Ejemplo:

```ts
forma_pago: '01'
```

Si se utiliza:

```ts
forma_pago: '04'
```

puede resultar útil acompañarlo de:

```ts
descripcion_fpago: 'Tarjeta / pasarela / otro medio'
```

según las necesidades del registro.

# Crear cobros

El request agrupa los registros:

```ts
interface TicketBaiWsMutateLroeCashCollectionsRequest {
    readonly ejercicio: number;
    readonly cobros:
        readonly TicketBaiWsLroeCashCollection[];
}
```

Ejemplo mixto:

```ts
const response =
    await client.bizkaia.lroe.cashCollections.create({
        ejercicio: 2026,
        cobros: [
            {
                fecha_factura: '15/08/2026',
                fecha_cobro: '17/08/2026',
                serie: 'A',
                num_factura: 'F-2026-100',
                importe_cobrado: 121,
                iva_devengado: 21,
                forma_pago: '01',
                descripcion_fpago:
                    'Transferencia'
            },
            {
                epigrafe: '197210',
                fecha_cobro: '17/08/2026',
                tipo_operacion: 'sin_factura',
                tipo_ingreso: '2',
                linea: 1,
                importe_cobrado: 500,
                ingreso_irpf: 500
            }
        ]
    });
```

El SDK no impide mezclar operaciones con y sin factura dentro del mismo lote.

# Modificar cobros

`update()` utiliza el mismo modelo de request:

```ts
await client.bizkaia.lroe.cashCollections.update({
    ejercicio: 2026,
    cobros: [
        {
            tipo_operacion: 'con_factura',
            fecha_factura: '15/08/2026',
            fecha_cobro: '17/08/2026',
            serie: 'A',
            num_factura: 'F-2026-100',
            importe_cobrado: 100,
            forma_pago: '01'
        }
    ]
});
```

La aplicación debe proporcionar los campos identificativos que TicketBaiWS necesite para localizar el cobro.

# Resultado de mutaciones

El resultado global es:

```ts
interface TicketBaiWsLroeCashCollectionsMutationResult {
    readonly response:
        readonly TicketBaiWsLroeCashCollectionOperationResult[];
    readonly status:
        TicketBaiWsLroeCashCollectionsBatchStatus;
}
```

Estado global:

```ts
'OK' | 'ERROR'
```

Estado por operación:

```ts
type TicketBaiWsLroeCashCollectionResultStatus =
    | 'Correcto'
    | 'AceptadoConErrores'
    | 'Incorrecto';
```

Los campos conocidos son:

```ts
interface TicketBaiWsLroeCashCollectionOperationResult {
    readonly fecha_factura?: string;
    readonly fecha_cobro: string;
    readonly serie?: string;
    readonly num_factura?: string;
    readonly linea?: number;
    readonly estado:
        TicketBaiWsLroeCashCollectionResultStatus;
    readonly [key: string]: unknown;
}
```

El índice adicional permite conservar posibles campos de error u otros datos que TicketBaiWS añada, especialmente en respuestas de operaciones sin factura que no están documentadas con el mismo detalle que los ejemplos con factura.

# Consultar cobros

```ts
const response =
    await client.bizkaia.lroe.cashCollections.list({
        ejercicio: 2026,
        pagina: 1
    });
```

Filtros:

```ts
interface TicketBaiWsListLroeCashCollectionsRequest {
    readonly ejercicio: number;
    readonly fecha_factura_desde?: string;
    readonly fecha_factura_hasta?: string;
    readonly fecha_operacion_desde?: string;
    readonly fecha_operacion_hasta?: string;
    readonly fecha_cobro_desde?: string;
    readonly fecha_cobro_hasta?: string;
    readonly tipo_ingreso?:
        TicketBaiWsLroeCashCollectionIncomeType;
    readonly num_factura?: string;
    readonly epigrafe?: string;
    readonly estado?:
        TicketBaiWsLroeCashCollectionResultStatus;
    readonly pagina?: number;
}
```

Ejemplo:

```ts
const response =
    await client.bizkaia.lroe.cashCollections.list({
        ejercicio: 2026,
        fecha_cobro_desde: '01/08/2026',
        fecha_cobro_hasta: '31/08/2026',
        estado: 'Correcto',
        pagina: 1
    });
```

El SDK genera query string:

```text
GET /lroe-critcaja-cobros/
    ?ejercicio=2026
    &fecha_cobro_desde=01/08/2026
    &...
```

y no un body JSON.

# Modelo de consulta

```ts
interface TicketBaiWsLroeCashCollectionQueryItem {
    readonly fecha_factura?: string;
    readonly fecha_cobro: string;
    readonly serie?: string;
    readonly num_factura?: string;

    readonly importe_cobrado: string;
    readonly iva_devengado?: string;

    readonly forma_pago?:
        TicketBaiWsLroeCashCollectionPaymentMethod;
    readonly descripcion_fpago?: string;

    readonly tipo_operacion?:
        TicketBaiWsLroeCashCollectionOperationType;
    readonly tipo_ingreso?:
        TicketBaiWsLroeCashCollectionIncomeType;
    readonly linea?: number;

    readonly ingreso_irpf?: string;
    readonly epigrafe?: string;

    readonly estado:
        TicketBaiWsLroeCashCollectionResultStatus;

    readonly [key: string]: unknown;
}
```

Nótese de nuevo:

```text
POST/PUT:
importe_cobrado: number
iva_devengado: number
ingreso_irpf: number

GET:
importe_cobrado: string
iva_devengado: string
ingreso_irpf: string
```

El SDK conserva esa diferencia.

# Anular cobros

```ts
await client.bizkaia.lroe.cashCollections.cancel({
    ejercicio: 2026,
    cobros: [
        {
            fecha_factura: '15/08/2026',
            fecha_cobro: '17/08/2026',
            serie: 'A',
            num_factura: 'F-2026-100',
            importe_cobrado: 121
        }
    ]
});
```

Las variantes de cancelación vuelven a separar operaciones con/sin factura.

## Con factura

```ts
interface TicketBaiWsCancelLroeCashCollectionWithInvoice
    extends TicketBaiWsCancelLroeCashCollectionBase {
    readonly tipo_operacion?: 'con_factura';
    readonly serie?: string;
    readonly num_factura: string;
    readonly fecha_factura: string;
}
```

## Sin factura

```ts
interface TicketBaiWsCancelLroeCashCollectionWithoutInvoice
    extends TicketBaiWsCancelLroeCashCollectionBase {
    readonly tipo_operacion: 'sin_factura';
    readonly tipo_ingreso:
        TicketBaiWsLroeCashCollectionIncomeType;
    readonly linea: number;
}
```

Base:

```ts
interface TicketBaiWsCancelLroeCashCollectionBase {
    readonly epigrafe?: string;
    readonly fecha_cobro: string;
    readonly importe_cobrado?: number;
}
```

### `importe_cobrado` opcional en cancelación

La tabla oficial de DELETE no lista `importe_cobrado` entre los campos, pero todos los ejemplos JSON de anulación con factura lo incluyen.

Por ello el SDK lo permite:

```ts
importe_cobrado?: number;
```

sin hacerlo obligatorio.

# Tipos públicos

```ts
import type {
    TicketBaiWsCancelLroeCashCollection,
    TicketBaiWsCancelLroeCashCollectionsRequest,
    TicketBaiWsCancelLroeCashCollectionWithInvoice,
    TicketBaiWsCancelLroeCashCollectionWithoutInvoice,
    TicketBaiWsListLroeCashCollectionsRequest,
    TicketBaiWsListLroeCashCollectionsResponse,
    TicketBaiWsListLroeCashCollectionsResult,
    TicketBaiWsLroeCashCollection,
    TicketBaiWsLroeCashCollectionBase,
    TicketBaiWsLroeCashCollectionIncomeType,
    TicketBaiWsLroeCashCollectionOperationResult,
    TicketBaiWsLroeCashCollectionOperationType,
    TicketBaiWsLroeCashCollectionPaymentMethod,
    TicketBaiWsLroeCashCollectionQueryItem,
    TicketBaiWsLroeCashCollectionResultStatus,
    TicketBaiWsLroeCashCollectionsBatchStatus,
    TicketBaiWsLroeCashCollectionsMutationResponse,
    TicketBaiWsLroeCashCollectionsMutationResult,
    TicketBaiWsLroeCashCollectionWithInvoice,
    TicketBaiWsLroeCashCollectionWithoutInvoice,
    TicketBaiWsMutateLroeCashCollectionsRequest
} from '@osumi/ticketbaiws';
```

# Inconsistencias relevantes de la documentación oficial

Entre los puntos observados:

- `tipo_operacion` figura como obligatorio, pero los ejemplos con factura lo omiten;
- GET contiene texto copiado del endpoint de facturas recibidas;
- todos los ejemplos GET envían filtros en un body JSON;
- `epigrafe` aparece como integer en GET, pero como string en el resto del contrato;
- GET muestra `tipo_ingreso` con ejemplo `02`, mientras el catálogo usa `1`, `2`, `3`, `4`;
- se repite la ambigüedad de filtros opcionales “aunque se debe especificar al menos uno”;
- DELETE no lista `importe_cobrado`, pero los ejemplos sí lo envían;
- la descripción de DELETE habla de anular facturas recibidas aunque el endpoint anula cobros.

# Documentación oficial

Alta:

https://ticketbaiws.eus/es/lroe-critcaja-cobros-post/

Modificación:

https://ticketbaiws.eus/es/lroe-critcaja-cobros-put/

Consulta:

https://ticketbaiws.eus/es/lroe-critcaja-cobros-get/

Anulación:

https://ticketbaiws.eus/es/documentacion-api/lroe-critcaja-cobros-del/

---

[← Volver al índice Bizkaia](README.md)
