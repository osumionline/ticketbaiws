# BATUZ / LROE Bizkaia

[← Volver al índice general](../README.md)

Esta sección documenta las operaciones específicas de Bizkaia disponibles en `@osumi/ticketbaiws`.

La API pública se organiza así:

```text
client.bizkaia
├── epigraphs
└── lroe
    ├── receivedInvoices
    ├── cashCollections
    └── cashPayments
```

## Índice

- [Epígrafes IAE](epigraphs.md)
- [LROE — Facturas recibidas](received-invoices.md)
- [LROE — Criterio de caja: cobros](cash-collections.md)
- [LROE — Criterio de caja: pagos](cash-payments.md)

## Operaciones disponibles

### Epígrafes

```ts
client.bizkaia.epigraphs.list()
```

### Facturas recibidas

```ts
client.bizkaia.lroe.receivedInvoices.create(...)
client.bizkaia.lroe.receivedInvoices.update(...)
client.bizkaia.lroe.receivedInvoices.list(...)
client.bizkaia.lroe.receivedInvoices.cancel(...)
```

### Cobros por criterio de caja

```ts
client.bizkaia.lroe.cashCollections.create(...)
client.bizkaia.lroe.cashCollections.update(...)
client.bizkaia.lroe.cashCollections.list(...)
client.bizkaia.lroe.cashCollections.cancel(...)
```

### Pagos por criterio de caja

```ts
client.bizkaia.lroe.cashPayments.create(...)
client.bizkaia.lroe.cashPayments.update(...)
client.bizkaia.lroe.cashPayments.list(...)
client.bizkaia.lroe.cashPayments.cancel(...)
```

En total, este dominio cubre las 13 operaciones específicas para BATUZ Bizkaia documentadas actualmente por TicketBaiWS.

## Alcance

Estos endpoints son específicos de BATUZ Bizkaia.

La documentación del SDK explica cómo construir las peticiones y cómo interpretar los modelos tipados, pero no pretende sustituir la documentación fiscal del LROE ni determinar:

- qué modelo corresponde a cada contribuyente;
- qué epígrafe debe utilizarse;
- cuándo una operación debe declararse como compra, inversión o gasto;
- cuándo una operación de criterio de caja debe registrarse con o sin factura;
- qué importes son fiscalmente deducibles;
- qué régimen IVA corresponde;
- qué reglas de rectificación deben aplicarse.

La validación final corresponde a TicketBaiWS y a la Hacienda Foral de Bizkaia.

## Modelos 140 y 240

La documentación de TicketBaiWS hace referencias frecuentes a:

```text
modelo 140
modelo 240
```

y condiciona determinados campos a uno u otro tipo de contribuyente.

El SDK no expone una propiedad global `modelo: 140 | 240` ni intenta inferirlo.

En su lugar, los DTO permiten representar los campos que TicketBaiWS documenta para cada operación.

Ejemplos especialmente relacionados con el modelo 140 son:

```text
epigrafe
bien_afecto_irpf_iva
importe_gasto_irpf
concepto_contable
referencia_bien
modo_recargo_simplificado
tipo_ingreso
concepto
linea
ingreso_irpf
gasto_irpf
```

La aplicación consumidora debe conocer qué campos corresponden al contribuyente para el que realiza el envío.

## Lotes

Las operaciones de alta, modificación y anulación LROE trabajan con arrays.

TicketBaiWS documenta un máximo de:

```text
1000 registros por petición
```

Ejemplo conceptual:

```ts
await client.bizkaia.lroe.receivedInvoices.create({
    ejercicio: 2026,
    facturas: [
        /* hasta 1000 facturas */
    ]
});
```

El SDK no divide automáticamente lotes superiores en varias peticiones.

Si la aplicación necesita enviar más registros debe paginarlos o agruparlos externamente.

## Año fiscal

Los tres dominios LROE utilizan:

```ts
ejercicio: number
```

Ejemplo:

```ts
ejercicio: 2026
```

El SDK no comprueba que el ejercicio coincida con las fechas de los registros.

## Estados por registro

Las mutaciones devuelven un resultado individual por cada elemento procesado.

Los estados conocidos son:

```ts
'Correcto'
'AceptadoConErrores'
'Incorrecto'
```

Estos estados se exponen mediante tipos específicos de cada dominio, por ejemplo:

```ts
TicketBaiWsLroeReceivedInvoiceResultStatus
TicketBaiWsLroeCashCollectionResultStatus
TicketBaiWsLroeCashPaymentResultStatus
```

Aunque actualmente tienen los mismos literales, se mantienen separados para que cada modelo sea autocontenido y pueda evolucionar si TicketBaiWS modifica uno de los contratos.

## Estado global del lote

Además del estado individual, las mutaciones devuelven:

```ts
'OK'
'ERROR'
```

Ejemplo conceptual:

```ts
{
    result: 'OK',
    return: {
        response: [
            {
                estado: 'Correcto',
                // ...
            },
            {
                estado: 'Incorrecto',
                // ...
            }
        ],
        status: 'ERROR'
    },
    msg: null
}
```

Es importante distinguir:

```text
result
```

del sobre general de TicketBaiWS y:

```text
return.status
```

del resultado del lote LROE.

Una respuesta HTTP/API puede llegar correctamente y, aun así, contener registros individuales rechazados.

La aplicación debe revisar siempre:

```ts
response.return.response
```

y no limitarse a comprobar el `result` exterior.

## Escritura y lectura usan tipos diferentes

Una particularidad importante de los endpoints LROE es que TicketBaiWS no utiliza siempre la misma representación al escribir y al consultar datos.

Por ejemplo, al enviar una factura:

```ts
{
    importe_total: 121,
    bases: [
        {
            base_imponible: 100,
            tipo_iva: 21
        }
    ],
    regimen_iva: 1
}
```

los valores son `number`.

Una consulta puede devolver conceptualmente:

```ts
{
    importe_total: '121.00',
    bases: [
        {
            base_imponible: '100.00',
            tipo_iva: '21.00'
        }
    ],
    regimen_iva: '01'
}
```

como `string`.

Lo mismo ocurre en criterio de caja con campos como:

```text
importe_cobrado
iva_devengado
ingreso_irpf
importe_pagado
iva_soportado
iva_deducible
gasto_irpf
```

`@osumi/ticketbaiws` **no normaliza silenciosamente esos valores**.

Los modelos de escritura utilizan `number` cuando el request documentado trabaja con números y los modelos de consulta utilizan `string` cuando esa es la representación devuelta por TicketBaiWS.

Por ello no debe reutilizarse un resultado GET como si fuese directamente un request POST/PUT.

## GET mediante query string

Las consultas LROE oficiales son operaciones GET.

La documentación de TicketBaiWS muestra actualmente ejemplos que envían los filtros mediante un body JSON en GET.

`@osumi/ticketbaiws` adopta una política uniforme:

> Los filtros de operaciones GET se envían mediante query string.

Ejemplo conceptual:

```text
GET /lroe-recibidas/?ejercicio=2026&pagina=1
```

La aplicación solo proporciona el objeto tipado:

```ts
await client.bizkaia.lroe.receivedInvoices.list({
    ejercicio: 2026,
    pagina: 1
});
```

## Epígrafes como strings

Los códigos de epígrafe se representan como:

```ts
string
```

Ejemplo:

```ts
'197210'
```

Esto es coherente con el listado oficial de epígrafes y con los JSON publicados por TicketBaiWS.

En algunas tablas de endpoints LROE, `epigrafe` aparece descrito como `integer`. El SDK mantiene `string` para preservar el carácter de código identificativo y la representación observada en los ejemplos.

## Códigos como strings

Otros códigos también se mantienen como strings:

```text
tipo_documento
tipo_ingreso
concepto
forma_pago
```

Aunque algunos sean numéricos visualmente, se tratan como códigos y no como magnitudes.

Ejemplos:

```ts
tipo_documento: '02'
tipo_ingreso: '2'
concepto: '600'
forma_pago: '01'
```

Esto preserva ceros iniciales y evita conversiones innecesarias.

## Errores

Los recursos Bizkaia usan la misma infraestructura de errores que el resto del SDK.

Pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Además, una mutación puede ser técnicamente correcta a nivel API y contener un:

```text
return.status = 'ERROR'
```

por fallos parciales de los registros enviados.

Consulta [Primeros pasos](../getting-started.md) para la jerarquía global de errores.

## Documentación oficial

Documentación general:

https://ticketbaiws.eus/es/documentacion-api/

Listado de epígrafes:

https://ticketbaiws.eus/es/epigrafes-get/

Facturas recibidas:

https://ticketbaiws.eus/es/lroe-recibidas-post/

Cobros por criterio de caja:

https://ticketbaiws.eus/es/lroe-critcaja-cobros-post/

Pagos por criterio de caja:

https://ticketbaiws.eus/es/lroe-critcaja-pagos-post/

---

[← Volver al índice general](../README.md)
