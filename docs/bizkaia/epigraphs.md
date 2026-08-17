# Epígrafes IAE

[← Volver al índice Bizkaia](README.md)

El recurso:

```ts
client.bizkaia.epigraphs
```

permite consultar el catálogo de epígrafes IAE publicado por TicketBaiWS para las operaciones específicas de Bizkaia.

## Método disponible

```ts
client.bizkaia.epigraphs.list()
```

Correspondencia:

```text
GET /epigrafes/
```

No recibe parámetros.

## Ejemplo

```ts
const response =
    await client.bizkaia.epigraphs.list();

for (const epigraph of response.return) {
    console.log(
        epigraph.codigo,
        epigraph.nombre_es,
        epigraph.nombre_eu
    );
}
```

## Modelo de respuesta

Cada elemento utiliza:

```ts
interface TicketBaiWsEpigraph {
    readonly codigo: string;
    readonly nombre_es: string;
    readonly nombre_eu: string;
}
```

La respuesta completa es:

```ts
type TicketBaiWsListEpigraphsResponse =
    TicketBaiWsSuccessResponse<
        readonly TicketBaiWsEpigraph[]
    >;
```

Ejemplo conceptual:

```ts
{
    result: 'OK',
    return: [
        {
            codigo: '101100',
            nombre_es:
                'EXPLOTACION EXTENSIVA DE GANADO BOVINO',
            nombre_eu:
                'BETABEREEN USTIAPEN ESTENSIBOA '
        }
    ],
    msg: null
}
```

## `codigo`

El código se representa como:

```ts
string
```

y no como `number`.

Ejemplo:

```ts
const code = epigraph.codigo; // string
```

Los epígrafes son identificadores, no magnitudes, por lo que no existe ninguna ventaja en convertirlos automáticamente a número.

Esto también mantiene coherencia con los DTO LROE:

```ts
epigrafe?: string;
```

## Nombres en castellano y euskera

El servicio devuelve:

```ts
nombre_es
nombre_eu
```

El SDK conserva ambos textos literalmente.

No elimina espacios finales, cambia mayúsculas/minúsculas ni realiza traducciones.

Si la aplicación necesita normalizar la presentación debe hacerlo en su capa de UI.

## Uso con otros recursos

Un código obtenido aquí puede utilizarse, cuando corresponda, en campos LROE como:

```ts
epigrafe: '197210'
```

Ejemplo conceptual:

```ts
const epigraphs =
    await client.bizkaia.epigraphs.list();

const selected =
    epigraphs.return.find(
        epigraph =>
            epigraph.codigo === '197210'
    );

if (selected !== undefined) {
    await client.bizkaia.lroe.cashCollections.create({
        ejercicio: 2026,
        cobros: [
            {
                epigrafe: selected.codigo,
                fecha_cobro: '17/08/2026',
                tipo_operacion: 'sin_factura',
                tipo_ingreso: '2',
                linea: 1,
                importe_cobrado: 500
            }
        ]
    });
}
```

El SDK no valida que un epígrafe sea aplicable a la actividad concreta del contribuyente.

## Entorno

La página específica de epígrafes de TicketBaiWS muestra actualmente únicamente:

```text
https://api.ticketbaiws.eus/epigrafes/
```

mientras la documentación general del API define los entornos:

```text
api-test
api
```

`@osumi/ticketbaiws` mantiene la misma política que el resto de resources y utiliza el entorno configurado en el cliente:

```ts
const client = new TicketBaiWsClient({
    token: '...',
    issuerNif: '...',
    environment: 'test'
});
```

Conceptualmente:

```text
test       → https://api-test.ticketbaiws.eus/epigrafes/
production → https://api.ticketbaiws.eus/epigrafes/
```

## Petición GET

El método no recibe filtros y el SDK realiza un GET sin body.

La página oficial dice que no requiere parámetros y la mayoría de ejemplos hacen precisamente una petición vacía, aunque el ejemplo PHP añade un body `{}` y `Content-Type: application/json`.

El SDK no reproduce ese body vacío.

## Tipos públicos

```ts
import type {
    TicketBaiWsEpigraph,
    TicketBaiWsListEpigraphsResponse
} from '@osumi/ticketbaiws';
```

## Errores

Puede lanzar los errores comunes:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Consulta [Primeros pasos](../getting-started.md).

## Documentación oficial

https://ticketbaiws.eus/es/epigrafes-get/

---

[← Volver al índice Bizkaia](README.md)
