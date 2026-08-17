# LROE — Criterio de caja: pagos

[← Volver al índice Bizkaia](README.md)

Este documento describe:

```ts
client.bizkaia.lroe.cashPayments
```

El recurso permite enviar, modificar, consultar y anular pagos del régimen especial del criterio de caja en BATUZ Bizkaia.

## Resumen

```ts
client.bizkaia.lroe.cashPayments.create(...)
client.bizkaia.lroe.cashPayments.update(...)
client.bizkaia.lroe.cashPayments.list(...)
client.bizkaia.lroe.cashPayments.cancel(...)
```

Correspondencia:

| SDK | HTTP | Endpoint |
| --- | --- | --- |
| `create()` | `POST` | `lroe-critcaja-pagos/` |
| `update()` | `PUT` | `lroe-critcaja-pagos/` |
| `list()` | `GET` | `lroe-critcaja-pagos/` |
| `cancel()` | `DELETE` | `lroe-critcaja-pagos/` |

Las mutaciones admiten lotes de hasta 1000 pagos según TicketBaiWS.

# Operaciones con y sin factura

El SDK utiliza una unión discriminada:

```ts
type TicketBaiWsLroeCashPayment =
    | TicketBaiWsLroeCashPaymentWithInvoice
    | TicketBaiWsLroeCashPaymentWithoutInvoice;
```

## Pago con factura

```ts
interface TicketBaiWsLroeCashPaymentWithInvoice
    extends TicketBaiWsLroeCashPaymentBase {
    readonly tipo_operacion?: 'con_factura';
    readonly serie?: string;
    readonly num_factura: string;
    readonly fecha_factura: string;
}
```

Ejemplo:

```ts
{
    nombre_social: 'Proveedor S.L.',
    nif: 'B01000012',

    fecha_factura: '15/08/2026',
    fecha_pago: '17/08/2026',
    serie: 'A',
    num_factura: 'P-2026-100',

    importe_pagado: 121,
    iva_soportado: 21,
    iva_deducible: 21,

    forma_pago: '01',
    descripcion_fpago: 'Transferencia'
}
```

`tipo_operacion` puede declararse:

```ts
tipo_operacion: 'con_factura'
```

pero es opcional en esta variante porque los ejemplos oficiales con factura lo omiten aunque la tabla lo marque como obligatorio para ciertos escenarios.

## Pago sin factura

```ts
interface TicketBaiWsLroeCashPaymentWithoutInvoice
    extends TicketBaiWsLroeCashPaymentBase {
    readonly tipo_operacion: 'sin_factura';
    readonly concepto:
        TicketBaiWsLroeCashPaymentConcept;
    readonly linea: number;
}
```

Ejemplo:

```ts
{
    epigrafe: '197210',

    fecha_pago: '17/08/2026',

    nombre_social: 'Proveedor S.L.',
    nif: 'B01000012',

    tipo_operacion: 'sin_factura',
    concepto: '600',
    linea: 1,

    importe_pagado: 500,
    gasto_irpf: 500,

    forma_pago: '04',
    descripcion_fpago: 'Otros medios'
}
```

En esta variante `tipo_operacion: 'sin_factura'` es obligatorio para discriminar el modelo.

# Campos comunes

```ts
interface TicketBaiWsLroeCashPaymentBase {
    readonly epigrafe?: string;

    readonly fecha_pago: string;

    readonly nif: string;
    readonly pais?: string;
    readonly nombre_social: string;

    readonly importe_pagado: number;

    readonly iva_soportado?: number;
    readonly iva_deducible?: number;
    readonly gasto_irpf?: number;

    readonly forma_pago?:
        TicketBaiWsLroeCashPaymentMethod;
    readonly descripcion_fpago?: string;
}
```

## Proveedor

A diferencia de los cobros, los pagos incluyen datos del proveedor/emisor:

```ts
nif
pais
nombre_social
```

Ejemplo extranjero:

```ts
{
    nif: 'DE123456789',
    pais: 'DE',
    nombre_social: 'Proveedor GmbH'
}
```

El SDK no valida la existencia del proveedor ni el código ISO.

## Importe pagado

```ts
importe_pagado: number;
```

se escribe como número.

En lectura TicketBaiWS lo devuelve como:

```ts
importe_pagado: string;
```

## IVA soportado y deducible

```ts
iva_soportado?: number;
iva_deducible?: number;
```

son opcionales y no se calculan dentro del SDK.

La aplicación debe aportar los importes que correspondan a su operación.

## Gasto IRPF

```ts
gasto_irpf?: number;
```

está disponible para los supuestos LROE 140 correspondientes.

# Forma de pago

```ts
type TicketBaiWsLroeCashPaymentMethod =
    | '01'
    | '02'
    | '03'
    | '04'
    | '05';
```

Catálogo:

| Código | Forma |
| --- | --- |
| `'01'` | Transferencia |
| `'02'` | Cheque |
| `'03'` | No se cobra/paga por los supuestos indicados por TicketBaiWS |
| `'04'` | Otros medios |
| `'05'` | Domiciliación bancaria |

# Concepto en operaciones sin factura

Las operaciones sin factura utilizan:

```ts
TicketBaiWsLroeCashPaymentConcept
```

El SDK conserva los códigos contables como strings:

```ts
type TicketBaiWsLroeCashPaymentConcept =
    | '600'
    | '601'
    | '602'
    | '606'
    | '607'
    | '608'
    | '609'
    | '620'
    | '621'
    | '622'
    | '623'
    | '624'
    | '625'
    | '626'
    | '627'
    | '628'
    | '629'
    | '631'
    | '634'
    | '639'
    | '640'
    | '641'
    | '64201'
    | '64202'
    | '643'
    | '644'
    | '649'
    | '65'
    | '66'
    | '67'
    | '680'
    | '681'
    | '682'
    | '69';
```

## Catálogo documentado

| Código | Concepto |
| --- | --- |
| `600` | Compras de mercaderías |
| `601` | Compras de materias primas |
| `602` | Compras de otros aprovisionamientos |
| `606` | Descuentos sobre compras por pronto pago |
| `607` | Trabajos realizados por otras empresas |
| `608` | Devoluciones de compras y operaciones similares |
| `609` | Rappels por compras |
| `620` | Gastos en investigación y desarrollo del ejercicio |
| `621` | Arrendamientos y cánones |
| `622` | Reparaciones y conservación |
| `623` | Servicios de profesionales independientes |
| `624` | Transportes |
| `625` | Primas de seguros |
| `626` | Servicios bancarios y similares |
| `627` | Publicidad, propaganda y relaciones públicas |
| `628` | Suministros |
| `629` | Otros servicios |
| `631` | Otros tributos |
| `634` | Ajustes negativos en la imposición indirecta |
| `639` | Ajustes positivos en la imposición indirecta |
| `640` | Sueldos y salarios |
| `641` | Indemnizaciones |
| `64201` | Seguridad Social a cargo de la empresa: autónomos |
| `64202` | Seguridad Social a cargo de la empresa: empleados |
| `643` | Retribuciones a largo plazo mediante sistemas de aportación definida |
| `644` | Retribuciones a largo plazo mediante sistemas de prestación definida |
| `649` | Otros gastos sociales |
| `65` | Otros gastos de gestión |
| `66` | Gastos financieros |
| `67` | Gastos excepcionales |
| `680` | Amortización del inmovilizado intangible |
| `681` | Amortización del inmovilizado material |
| `682` | Amortización de las inversiones inmobiliarias |
| `69` | Pérdidas por deterioro y otras dotaciones |

No deben interpretarse como números sobre los que realizar cálculos.

# Crear pagos

Request:

```ts
interface TicketBaiWsMutateLroeCashPaymentsRequest {
    readonly ejercicio: number;
    readonly pagos:
        readonly TicketBaiWsLroeCashPayment[];
}
```

Ejemplo:

```ts
const response =
    await client.bizkaia.lroe.cashPayments.create({
        ejercicio: 2026,
        pagos: [
            {
                nombre_social:
                    'Proveedor S.L.',
                nif: 'B01000012',

                fecha_factura:
                    '15/08/2026',
                fecha_pago:
                    '17/08/2026',
                serie: 'A',
                num_factura:
                    'P-2026-100',

                importe_pagado: 121,
                iva_soportado: 21,
                iva_deducible: 21,

                forma_pago: '01'
            },
            {
                epigrafe: '197210',

                fecha_pago:
                    '17/08/2026',

                nombre_social:
                    'Otro proveedor S.L.',
                nif: 'B02000013',

                tipo_operacion:
                    'sin_factura',
                concepto: '600',
                linea: 1,

                importe_pagado: 500,
                gasto_irpf: 500
            }
        ]
    });
```

# Modificar pagos

`update()` reutiliza el mismo modelo:

```ts
await client.bizkaia.lroe.cashPayments.update({
    ejercicio: 2026,
    pagos: [
        {
            tipo_operacion: 'con_factura',

            nombre_social:
                'Proveedor S.L.',
            nif: 'B01000012',

            fecha_factura:
                '15/08/2026',
            fecha_pago:
                '17/08/2026',
            serie: 'A',
            num_factura:
                'P-2026-100',

            importe_pagado: 100,

            forma_pago: '01'
        }
    ]
});
```

# Resultado de mutaciones

```ts
interface TicketBaiWsLroeCashPaymentsMutationResult {
    readonly response:
        readonly TicketBaiWsLroeCashPaymentOperationResult[];
    readonly status:
        TicketBaiWsLroeCashPaymentsBatchStatus;
}
```

Estado global:

```ts
'OK' | 'ERROR'
```

Estado individual:

```ts
type TicketBaiWsLroeCashPaymentResultStatus =
    | 'Correcto'
    | 'AceptadoConErrores'
    | 'Incorrecto';
```

Los campos conocidos de cada resultado:

```ts
interface TicketBaiWsLroeCashPaymentOperationResult {
    readonly fecha_factura?: string;
    readonly fecha_pago: string;
    readonly serie?: string;
    readonly num_factura?: string;
    readonly linea?: number;
    readonly estado:
        TicketBaiWsLroeCashPaymentResultStatus;
    readonly [key: string]: unknown;
}
```

# Consultar pagos

```ts
const response =
    await client.bizkaia.lroe.cashPayments.list({
        ejercicio: 2026,
        pagina: 1
    });
```

Filtros:

```ts
interface TicketBaiWsListLroeCashPaymentsRequest {
    readonly ejercicio: number;
    readonly fecha_factura_desde?: string;
    readonly fecha_factura_hasta?: string;
    readonly fecha_operacion_desde?: string;
    readonly fecha_operacion_hasta?: string;
    readonly fecha_pago_desde?: string;
    readonly fecha_pago_hasta?: string;
    readonly concepto?:
        TicketBaiWsLroeCashPaymentConcept;
    readonly num_factura?: string;
    readonly epigrafe?: string;
    readonly estado?:
        TicketBaiWsLroeCashPaymentResultStatus;
    readonly pagina?: number;
}
```

Ejemplo:

```ts
const response =
    await client.bizkaia.lroe.cashPayments.list({
        ejercicio: 2026,
        fecha_pago_desde: '01/08/2026',
        fecha_pago_hasta: '31/08/2026',
        concepto: '600',
        estado: 'Correcto',
        pagina: 1
    });
```

Los filtros se envían mediante query string.

# Modelo de lectura

```ts
interface TicketBaiWsLroeCashPaymentQueryItem {
    readonly fecha_factura?: string;
    readonly fecha_pago: string;
    readonly serie?: string;
    readonly num_factura?: string;

    readonly importe_pagado: string;
    readonly iva_soportado?: string;
    readonly iva_deducible?: string;
    readonly gasto_irpf?: string;

    readonly forma_pago?:
        TicketBaiWsLroeCashPaymentMethod;
    readonly descripcion_fpago?: string;

    readonly tipo_operacion?:
        TicketBaiWsLroeCashPaymentOperationType;
    readonly concepto?:
        TicketBaiWsLroeCashPaymentConcept;
    readonly linea?: number;

    readonly epigrafe?: string;

    readonly estado:
        TicketBaiWsLroeCashPaymentResultStatus;

    readonly [key: string]: unknown;
}
```

Diferencia importante:

```text
POST/PUT:
importe_pagado: number
iva_soportado: number
iva_deducible: number
gasto_irpf: number

GET:
importe_pagado: string
iva_soportado: string
iva_deducible: string
gasto_irpf: string
```

El SDK no convierte automáticamente los strings recibidos.

# Anular pagos

```ts
await client.bizkaia.lroe.cashPayments.cancel({
    ejercicio: 2026,
    pagos: [
        {
            nombre_social:
                'Proveedor S.L.',
            nif: 'B01000012',

            fecha_factura:
                '15/08/2026',
            fecha_pago:
                '17/08/2026',
            serie: 'A',
            num_factura:
                'P-2026-100',

            importe_pagado: 121
        }
    ]
});
```

## Base de cancelación

```ts
interface TicketBaiWsCancelLroeCashPaymentBase {
    readonly epigrafe?: string;
    readonly fecha_pago: string;

    readonly nif: string;
    readonly pais?: string;
    readonly nombre_social: string;

    readonly importe_pagado?: number;
}
```

## Con factura

```ts
interface TicketBaiWsCancelLroeCashPaymentWithInvoice
    extends TicketBaiWsCancelLroeCashPaymentBase {
    readonly tipo_operacion?: 'con_factura';
    readonly serie?: string;
    readonly num_factura: string;
    readonly fecha_factura: string;
}
```

## Sin factura

```ts
interface TicketBaiWsCancelLroeCashPaymentWithoutInvoice
    extends TicketBaiWsCancelLroeCashPaymentBase {
    readonly tipo_operacion: 'sin_factura';
    readonly concepto:
        TicketBaiWsLroeCashPaymentConcept;
    readonly linea: number;
}
```

## `importe_pagado` opcional

La tabla oficial DELETE no documenta `importe_pagado` como campo de identificación, pero los ejemplos JSON de anulación con factura sí lo incluyen.

Por ello:

```ts
importe_pagado?: number;
```

es opcional.

# Tipos públicos

```ts
import type {
    TicketBaiWsCancelLroeCashPayment,
    TicketBaiWsCancelLroeCashPaymentBase,
    TicketBaiWsCancelLroeCashPaymentsRequest,
    TicketBaiWsCancelLroeCashPaymentWithInvoice,
    TicketBaiWsCancelLroeCashPaymentWithoutInvoice,
    TicketBaiWsListLroeCashPaymentsRequest,
    TicketBaiWsListLroeCashPaymentsResponse,
    TicketBaiWsListLroeCashPaymentsResult,
    TicketBaiWsLroeCashPayment,
    TicketBaiWsLroeCashPaymentBase,
    TicketBaiWsLroeCashPaymentConcept,
    TicketBaiWsLroeCashPaymentMethod,
    TicketBaiWsLroeCashPaymentOperationResult,
    TicketBaiWsLroeCashPaymentOperationType,
    TicketBaiWsLroeCashPaymentQueryItem,
    TicketBaiWsLroeCashPaymentResultStatus,
    TicketBaiWsLroeCashPaymentsBatchStatus,
    TicketBaiWsLroeCashPaymentsMutationResponse,
    TicketBaiWsLroeCashPaymentsMutationResult,
    TicketBaiWsLroeCashPaymentWithInvoice,
    TicketBaiWsLroeCashPaymentWithoutInvoice,
    TicketBaiWsMutateLroeCashPaymentsRequest
} from '@osumi/ticketbaiws';
```

# Inconsistencias relevantes de la documentación oficial

Entre las diferencias detectadas:

- varios textos POST/PUT hablan de “cobros” aunque el endpoint es pagos;
- `nombre_social` se describe como si fuese el cliente, cuando aquí identifica al proveedor/emisor;
- `tipo_operacion` figura obligatorio, pero los ejemplos con factura lo omiten;
- los ejemplos GET envían filtros mediante body JSON;
- `epigrafe` aparece como integer en GET aunque el resto del API lo trata como string;
- la condición de “al menos un filtro” además de `ejercicio` no está suficientemente clara;
- el ejemplo de respuesta GET aparece en algunas versiones de la documentación dentro de un envoltorio adicional de framework/HTTP en vez del sobre estándar;
- la tabla DELETE llama `tipo_ingreso` a lo que POST/PUT/GET denominan `concepto`;
- DELETE no lista `importe_pagado`, pero los ejemplos sí lo incluyen;
- existen descripciones de `fecha_pago` que hablan erróneamente de cobro.

El SDK mantiene los nombres y estructuras coherentes con el conjunto de endpoints:

```text
concepto
fecha_pago
importe_pagado
```

# Documentación oficial

Alta:

https://ticketbaiws.eus/es/lroe-critcaja-pagos-post/

Modificación:

https://ticketbaiws.eus/es/lroe-critcaja-pagos-put/

Consulta:

https://ticketbaiws.eus/es/lroe-critcaja-pagos-get/

Anulación:

https://ticketbaiws.eus/es/documentacion-api/lroe-critcaja-pagos-del/

---

[← Volver al índice Bizkaia](README.md)
