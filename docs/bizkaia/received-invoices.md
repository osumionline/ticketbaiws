# LROE — Facturas recibidas

[← Volver al índice Bizkaia](README.md)

Este documento describe:

```ts
client.bizkaia.lroe.receivedInvoices
```

El recurso permite enviar, modificar, consultar y anular facturas recibidas en el LROE de BATUZ Bizkaia.

## Resumen de métodos

```ts
client.bizkaia.lroe.receivedInvoices.create(...)
client.bizkaia.lroe.receivedInvoices.update(...)
client.bizkaia.lroe.receivedInvoices.list(...)
client.bizkaia.lroe.receivedInvoices.cancel(...)
```

Correspondencia:

| SDK | HTTP | Endpoint |
| --- | --- | --- |
| `create()` | `POST` | `lroe-recibidas/` |
| `update()` | `PUT` | `lroe-recibidas/` |
| `list()` | `GET` | `lroe-recibidas/` |
| `cancel()` | `DELETE` | `lroe-recibidas/` |

Las mutaciones aceptan lotes de hasta 1000 registros según TicketBaiWS.

# Crear facturas recibidas

```ts
await client.bizkaia.lroe.receivedInvoices.create({
    ejercicio: 2026,
    facturas: [
        {
            fecha: '17/08/2026',
            nombre_social: 'Proveedor S.L.',
            nif: 'B01000012',
            num_factura: 'F-2026-100',
            descripcion: 'Compra de mercancía',
            importacion: false,
            tipo_factura: 'compras',
            importe_total: 121,
            bases: [
                {
                    base_imponible: 100,
                    tipo_iva: 21,
                    tipo_req: 0
                }
            ],
            regimen_iva: 1,
            rectificativa: false
        }
    ]
});
```

El request es:

```ts
interface TicketBaiWsCreateLroeReceivedInvoicesRequest {
    readonly ejercicio: number;
    readonly facturas:
        readonly TicketBaiWsLroeReceivedInvoice[];
}
```

## Tipo de factura

```ts
type TicketBaiWsLroeReceivedInvoiceType =
    | 'compras'
    | 'inversion'
    | 'gasto';
```

Los mismos valores pueden utilizarse globalmente:

```ts
tipo_factura: 'compras'
```

y, cuando proceda, en una base concreta:

```ts
tipo: 'inversion'
```

para especificar un valor distinto al global.

El SDK no decide qué categoría corresponde fiscalmente a una operación.

## Datos principales

El modelo de alta incluye:

```ts
interface TicketBaiWsLroeReceivedInvoice {
    readonly fecha: string;
    readonly fecha_operacion?: string;
    readonly fecha_recepcion?: string;

    readonly nif: string;
    readonly tipo_documento?:
        TicketBaiWsLroeReceivedInvoiceDocumentType;
    readonly pais?: string;
    readonly nombre_social: string;

    readonly serie?: string;
    readonly num_factura: string;
    readonly descripcion: string;

    readonly importacion: boolean;
    readonly tipo_factura:
        TicketBaiWsLroeReceivedInvoiceType;
    readonly importe_total: number;

    readonly bases:
        readonly TicketBaiWsLroeReceivedInvoiceBase[];

    readonly regimen_iva?: number;
    readonly regimen_iva_2?: number;
    readonly regimen_iva_3?: number;
    readonly inversion_sujeto_pasivo?: boolean;

    readonly rectificativa: boolean;

    // campos de rectificación opcionales...
}
```

Las fechas se envían como strings, siguiendo el formato documentado por TicketBaiWS, normalmente:

```text
dd/mm/yyyy
```

El SDK no parsea ni normaliza las fechas.

## Proveedores extranjeros

`tipo_documento` permite:

```ts
type TicketBaiWsLroeReceivedInvoiceDocumentType =
    | '02'
    | '03'
    | '04'
    | '05'
    | '06';
```

También puede utilizarse:

```ts
pais?: string;
```

Ejemplo:

```ts
{
    nif: 'DE123456789',
    tipo_documento: '02',
    pais: 'DE',
    nombre_social: 'Proveedor GmbH'
}
```

El SDK no valida el código de país ni la coherencia fiscal entre país/documento.

# Bases imponibles

Cada factura incluye:

```ts
bases: readonly TicketBaiWsLroeReceivedInvoiceBase[];
```

Modelo:

```ts
interface TicketBaiWsLroeReceivedInvoiceBase {
    readonly base_imponible: number;
    readonly tipo_iva: number;
    readonly tipo_req: number;

    readonly tipo?:
        TicketBaiWsLroeReceivedInvoiceType;

    readonly cuota_soportada?: number;
    readonly cuota_deducible?: number;

    readonly epigrafe?: string;
    readonly bien_afecto_irpf_iva?:
        TicketBaiWsLroeReceivedInvoiceIrpfVatAssetType;
    readonly importe_gasto_irpf?: number;
    readonly concepto_contable?: number;
    readonly referencia_bien?: string;
    readonly modo_recargo_simplificado?:
        TicketBaiWsLroeReceivedInvoiceSimplifiedSurchargeMode;
}
```

## Cuota soportada y deducible

TicketBaiWS indica que puede calcular automáticamente la cuota soportada si no se informa.

Cuando la aplicación necesite enviar valores explícitos dispone de:

```ts
cuota_soportada?: number;
cuota_deducible?: number;
```

El SDK no calcula ninguna de las dos.

## Epígrafe

```ts
epigrafe?: string;
```

se utiliza cuando TicketBaiWS requiere asociar una base a un epígrafe específico, especialmente en escenarios LROE 140.

Ejemplo:

```ts
epigrafe: '197210'
```

## Afectación IRPF / IVA

El tipo público es:

```ts
type TicketBaiWsLroeReceivedInvoiceIrpfVatAssetType =
    | 'I'
    | 'R'
    | 'N';
```

TicketBaiWS documenta esos valores como códigos aunque en alguna tabla el campo aparezca incorrectamente como `integer`.

El SDK usa los valores reales:

```ts
bien_afecto_irpf_iva: 'N'
```

## Importe gasto IRPF

```ts
importe_gasto_irpf?: number;
```

se representa como `number`.

En la tabla oficial aparece como `integer`, pero su significado y ejemplos corresponden a un importe potencialmente decimal.

## Referencia de bien

```ts
referencia_bien?: string;
```

se mantiene como string.

La documentación lo describe como `integer` en una tabla, pero el ejemplo publicado es alfanumérico.

## Recargo en régimen simplificado

```ts
type TicketBaiWsLroeReceivedInvoiceSimplifiedSurchargeMode =
    | 'E'
    | 'N'
    | 'S';
```

se utiliza mediante:

```ts
modo_recargo_simplificado?: ...
```

El SDK conserva esos códigos literalmente.

# Regímenes IVA

El modelo permite:

```ts
regimen_iva?: number;
regimen_iva_2?: number;
regimen_iva_3?: number;
```

en escritura.

Es importante tener en cuenta que las consultas pueden devolver:

```ts
regimen_iva: string;
```

con valores como:

```text
"01"
```

El SDK representa deliberadamente esa diferencia entre escritura y lectura.

# Facturas rectificativas

Una factura recibida puede indicar:

```ts
rectificativa: true
```

y utilizar:

```ts
serie_factura_rectificada?: string;
num_factura_rectificada?: string;
fecha_rectificada?: string;
clave_rectificativa?: TicketBaiWsLroeReceivedInvoiceRectificationKey;
tipo_rectificativa?: TicketBaiWsLroeReceivedInvoiceRectificationType;
base_rectificada?: number;
cuota_rectificada?: number;
```

## Clave rectificativa

```ts
type TicketBaiWsLroeReceivedInvoiceRectificationKey =
    | 'R1'
    | 'R2'
    | 'R3'
    | 'R4'
    | 'R5';
```

## Tipo rectificativo

```ts
type TicketBaiWsLroeReceivedInvoiceRectificationType =
    | 'S'
    | 'I';
```

El SDK no determina qué combinación es fiscalmente correcta.

# Clave de factura

El alta dispone de:

```ts
type TicketBaiWsLroeReceivedInvoiceKey =
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'LC';
```

mediante:

```ts
clave_factura?: TicketBaiWsLroeReceivedInvoiceKey;
```

Los códigos se conservan tal como los define TicketBaiWS.

# Resultado de alta/modificación/anulación

Una mutación devuelve:

```ts
interface TicketBaiWsLroeReceivedInvoicesMutationResult {
    readonly response:
        readonly TicketBaiWsLroeReceivedInvoiceOperationResult[];
    readonly status:
        TicketBaiWsLroeReceivedInvoicesBatchStatus;
}
```

Estados por factura:

```ts
type TicketBaiWsLroeReceivedInvoiceResultStatus =
    | 'Correcto'
    | 'AceptadoConErrores'
    | 'Incorrecto';
```

Estado global:

```ts
type TicketBaiWsLroeReceivedInvoicesBatchStatus =
    | 'OK'
    | 'ERROR';
```

Cada resultado conocido incluye:

```ts
interface TicketBaiWsLroeReceivedInvoiceOperationResult {
    readonly fecha: string;
    readonly num_factura: string;
    readonly estado:
        TicketBaiWsLroeReceivedInvoiceResultStatus;
    readonly nif: string;
    readonly codigo_error?: string;
    readonly descripcion_error?: string;
}
```

Ejemplo:

```ts
const response =
    await client.bizkaia.lroe.receivedInvoices.create({
        ejercicio: 2026,
        facturas: [
            /* ... */
        ]
    });

for (const item of response.return.response) {
    if (item.estado !== 'Correcto') {
        console.error(
            item.num_factura,
            item.codigo_error,
            item.descripcion_error
        );
    }
}

console.log(response.return.status);
```

# Modificar facturas

```ts
await client.bizkaia.lroe.receivedInvoices.update({
    ejercicio: 2026,
    facturas: [
        {
            fecha: '17/08/2026',
            nif: 'B01000012',
            nombre_social: 'Proveedor S.L.',
            num_factura: 'F-2026-100',
            descripcion: 'Descripción actualizada',
            importacion: false,
            tipo_factura: 'compras',
            importe_total: 121,
            bases: [
                {
                    base_imponible: 100,
                    tipo_iva: 21,
                    tipo_req: 0
                }
            ],
            rectificativa: false
        }
    ]
});
```

El update utiliza un modelo separado:

```ts
TicketBaiWsLroeReceivedInvoiceUpdate
```

y sus bases:

```ts
TicketBaiWsLroeReceivedInvoiceUpdateBase
```

Esto es intencionado.

La tabla oficial PUT no incluye todos los campos disponibles en POST. El SDK no presupone que un campo omitido por la documentación de modificación pueda modificarse libremente.

Por ejemplo, el modelo de actualización actual no expone varios campos específicos del alta.

## `tipo_factura` en PUT

La página PUT describe de forma más restrictiva determinados valores que la página POST.

El SDK reutiliza:

```ts
'compras' | 'inversion' | 'gasto'
```

para no impedir modificar una factura que el propio endpoint de alta permite crear.

# Consultar facturas recibidas

```ts
const response =
    await client.bizkaia.lroe.receivedInvoices.list({
        ejercicio: 2026,
        pagina: 1
    });
```

Filtros:

```ts
interface TicketBaiWsListLroeReceivedInvoicesRequest {
    readonly ejercicio: number;
    readonly fecha_factura_desde?: string;
    readonly fecha_factura_hasta?: string;
    readonly fecha_recepcion_desde?: string;
    readonly fecha_recepcion_hasta?: string;
    readonly pais_emisor?: string;
    readonly tipo_documento?:
        TicketBaiWsLroeReceivedInvoiceDocumentType;
    readonly nif?: string;
    readonly num_factura?: string;
    readonly epigrafe?: string;
    readonly estado?:
        TicketBaiWsLroeReceivedInvoiceResultStatus;
    readonly pagina?: number;
}
```

Ejemplo:

```ts
const response =
    await client.bizkaia.lroe.receivedInvoices.list({
        ejercicio: 2026,
        fecha_factura_desde: '01/08/2026',
        fecha_factura_hasta: '31/08/2026',
        nif: 'B01000012',
        estado: 'Correcto',
        pagina: 1
    });
```

El SDK genera query string y no un body JSON en el GET.

## Filtros obligatorios

El tipo requiere:

```ts
ejercicio
```

y deja opcional el resto.

La documentación oficial dice al mismo tiempo que todos los parámetros salvo `ejercicio` son opcionales y que “se debe especificar al menos uno”, sin aclarar si se refiere al propio ejercicio o a un filtro adicional.

El SDK no impone una segunda condición no suficientemente definida.

# Modelo de consulta

Los elementos leídos son:

```ts
interface TicketBaiWsLroeReceivedInvoiceQueryItem {
    readonly fecha: string;
    readonly fecha_operacion: string;
    readonly fecha_recepcion: string;
    readonly num_factura: string;
    readonly descripcion: string;
    readonly nif: string;
    readonly nombre_social: string;
    readonly bases:
        readonly TicketBaiWsLroeReceivedInvoiceQueryBase[];
    readonly importe_total: string;
    readonly inversion_sujeto_pasivo: boolean;
    readonly regimen_iva: string;
    readonly fecha_presentacion: string;
    readonly fecha_modificacion: string;
    readonly estado:
        TicketBaiWsLroeReceivedInvoiceResultStatus;
}
```

Bases de consulta:

```ts
interface TicketBaiWsLroeReceivedInvoiceQueryBase {
    readonly base_imponible: string;
    readonly tipo_iva: string;
}
```

La diferencia respecto al request es importante:

```text
escritura → number
lectura   → string
```

Ejemplo:

```ts
const invoice =
    response.return.response[0];

console.log(invoice?.importe_total); // string
console.log(invoice?.regimen_iva);   // string
```

Si la aplicación necesita cálculos debe convertir explícitamente:

```ts
const total =
    Number(invoice?.importe_total ?? 0);
```

# Anular facturas recibidas

```ts
await client.bizkaia.lroe.receivedInvoices.cancel({
    ejercicio: 2026,
    facturas: [
        {
            nif: 'B01000012',
            num_factura: 'F-2026-100'
        }
    ]
});
```

Modelo:

```ts
interface TicketBaiWsCancelLroeReceivedInvoice {
    readonly nif: string;
    readonly pais?: string;
    readonly num_factura: string;
}
```

Request:

```ts
interface TicketBaiWsCancelLroeReceivedInvoicesRequest {
    readonly ejercicio: number;
    readonly facturas:
        readonly TicketBaiWsCancelLroeReceivedInvoice[];
}
```

La anulación reutiliza el mismo modelo de resultado de lote que alta y modificación.

# Tipos públicos

Los principales tipos se exportan desde el entry point:

```ts
import type {
    TicketBaiWsCancelLroeReceivedInvoice,
    TicketBaiWsCancelLroeReceivedInvoicesRequest,
    TicketBaiWsCreateLroeReceivedInvoicesRequest,
    TicketBaiWsListLroeReceivedInvoicesRequest,
    TicketBaiWsListLroeReceivedInvoicesResponse,
    TicketBaiWsListLroeReceivedInvoicesResult,
    TicketBaiWsLroeReceivedInvoice,
    TicketBaiWsLroeReceivedInvoiceBase,
    TicketBaiWsLroeReceivedInvoiceDocumentType,
    TicketBaiWsLroeReceivedInvoiceIrpfVatAssetType,
    TicketBaiWsLroeReceivedInvoiceKey,
    TicketBaiWsLroeReceivedInvoiceOperationResult,
    TicketBaiWsLroeReceivedInvoiceQueryBase,
    TicketBaiWsLroeReceivedInvoiceQueryItem,
    TicketBaiWsLroeReceivedInvoiceRectificationKey,
    TicketBaiWsLroeReceivedInvoiceRectificationType,
    TicketBaiWsLroeReceivedInvoiceResultStatus,
    TicketBaiWsLroeReceivedInvoicesBatchStatus,
    TicketBaiWsLroeReceivedInvoiceSimplifiedSurchargeMode,
    TicketBaiWsLroeReceivedInvoicesMutationResponse,
    TicketBaiWsLroeReceivedInvoicesMutationResult,
    TicketBaiWsLroeReceivedInvoiceType,
    TicketBaiWsLroeReceivedInvoiceUpdate,
    TicketBaiWsLroeReceivedInvoiceUpdateBase,
    TicketBaiWsUpdateLroeReceivedInvoicesRequest
} from '@osumi/ticketbaiws';
```

# Inconsistencias relevantes de la documentación oficial

Este endpoint contiene varias diferencias entre tablas y ejemplos que explican algunas decisiones de tipado del SDK:

- `epigrafe` aparece como integer en ciertas tablas, pero se envía como string en los JSON;
- `bien_afecto_irpf_iva` aparece descrito como integer aunque los valores son `I`, `R`, `N`;
- `importe_gasto_irpf` figura como integer aunque es un importe potencialmente decimal;
- `referencia_bien` figura como integer aunque el ejemplo es alfanumérico;
- `modo_recargo_simplificado` figura como integer aunque usa códigos `E`, `N`, `S`;
- `regimen_iva*` se escribe como número pero se devuelve en GET como string con posible cero inicial;
- PUT no documenta todos los campos disponibles en POST;
- los ejemplos GET envían body JSON; el SDK usa query string;
- existe una ambigüedad sobre si `ejercicio` por sí solo es suficiente para consultar.

# Documentación oficial

Alta:

https://ticketbaiws.eus/es/lroe-recibidas-post/

Modificación:

https://ticketbaiws.eus/es/lroe-recibidas-put/

Consulta:

https://ticketbaiws.eus/es/documentacion-api/lroe-recibidas-get/

Anulación:

https://ticketbaiws.eus/es/documentacion-api/lroe-recibidas-del/

---

[← Volver al índice Bizkaia](README.md)
