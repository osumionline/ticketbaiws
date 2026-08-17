# Validaciones AEAT y VIES

[← Volver al índice de documentación](README.md)

Este documento describe el recurso de validaciones de `@osumi/ticketbaiws`.

La API pública se encuentra en:

```ts
client.validation
```

y expone dos operaciones:

```ts
client.validation.aeat(...)
client.validation.vies(...)
```

Ambas operaciones utilizan los servicios de TicketBaiWS para validar identificadores fiscales frente a servicios externos.

## Índice

- [Resumen de métodos](#resumen-de-métodos)
- [Validación AEAT](#validación-aeat)
  - [Personas físicas](#personas-físicas)
  - [Personas jurídicas](#personas-jurídicas)
  - [Estados AEAT](#estados-aeat)
  - [Respuesta](#respuesta-aeat)
- [Validación VIES](#validación-vies)
  - [Estados VIES](#estados-vies)
  - [Respuesta](#respuesta-vies)
- [Tipos públicos](#tipos-públicos)
- [Errores](#errores)
- [Diferencia entre AEAT y VIES](#diferencia-entre-aeat-y-vies)
- [Nota sobre una inconsistencia de la documentación oficial](#nota-sobre-una-inconsistencia-de-la-documentación-oficial)
- [Documentación oficial](#documentación-oficial)

## Resumen de métodos

| Método del SDK | Método HTTP | Recurso TicketBaiWS |
| --- | --- | --- |
| `validation.aeat()` | `POST` | `validar-nif/` |
| `validation.vies()` | `POST` | `validar-nif-vies/` |

Los dos métodos envían JSON y devuelven el sobre estándar de TicketBaiWS:

```ts
{
    result: 'OK',
    return: ...,
    msg: null
}
```

Cuando TicketBaiWS devuelve `result: 'ERROR'`, el SDK lanza `TicketBaiWsApiError`.

---

# Validación AEAT

La validación AEAT permite contrastar un NIF con el censo de la Agencia Estatal de Administración Tributaria.

La llamada se realiza mediante:

```ts
const response = await client.validation.aeat({
    nif: '12345678Z',
    nombre: 'Juan Martínez'
});
```

El request utiliza:

```ts
interface TicketBaiWsAeatValidationRequest {
    readonly nif: string;
    readonly nombre?: string;
}
```

## Personas físicas

Para personas físicas TicketBaiWS documenta el nombre como obligatorio.

Ejemplo:

```ts
const response = await client.validation.aeat({
    nif: '12345678Z',
    nombre: 'Juan Martínez'
});
```

El SDK no intenta determinar si el NIF pertenece a una persona física ni obliga condicionalmente a proporcionar `nombre`.

La propiedad se mantiene opcional en TypeScript porque el mismo endpoint también admite personas jurídicas.

La validación final de los datos corresponde a TicketBaiWS.

## Personas jurídicas

Para personas jurídicas TicketBaiWS indica que el NIF es suficiente.

Ejemplo:

```ts
const response = await client.validation.aeat({
    nif: 'B12345678'
});
```

No es necesario enviar un nombre en este caso según el contrato documentado por TicketBaiWS.

## Estados AEAT

El SDK expone:

```ts
type TicketBaiWsAeatValidationStatus =
    | 'IDENTIFICADO'
    | 'NO IDENTIFICADO-SIMILAR'
    | 'NO IDENTIFICADO'
    | 'IDENTIFICADO-BAJA'
    | 'IDENTIFICADO-REVOCADO';
```

### `IDENTIFICADO`

El contribuyente ha sido identificado con los datos proporcionados.

Para personas físicas TicketBaiWS puede devolver el nombre y apellidos asociados al NIF.

### `NO IDENTIFICADO-SIMILAR`

Estado específico documentado para personas físicas.

Indica que no existe una coincidencia exacta con los datos identificativos aportados, pero sí una coincidencia similar.

TicketBaiWS puede devolver el nombre asociado al NIF para facilitar la corrección.

### `NO IDENTIFICADO`

Los datos proporcionados no han permitido identificar al contribuyente.

### `IDENTIFICADO-BAJA`

Estado documentado para entidades.

El NIF existe pero el contribuyente se encuentra en situación de baja.

### `IDENTIFICADO-REVOCADO`

Estado documentado para entidades.

El NIF está identificado pero se encuentra revocado.

El SDK conserva literalmente los valores devueltos por TicketBaiWS y no los transforma a códigos internos.

## Respuesta AEAT

El contenido de `return` utiliza:

```ts
interface TicketBaiWsAeatValidationResult {
    readonly nif: string;
    readonly nombre?: string;
    readonly resultado: TicketBaiWsAeatValidationStatus;
}
```

Ejemplo:

```ts
const response = await client.validation.aeat({
    nif: '12345678Z',
    nombre: 'Juan Martínez'
});

console.log(response.return.nif);
console.log(response.return.nombre);
console.log(response.return.resultado);
```

Ejemplo conceptual de respuesta:

```ts
{
    result: 'OK',
    return: {
        nif: '12345678Z',
        nombre: 'MARTINEZ RODRIGUEZ JUAN',
        resultado: 'IDENTIFICADO'
    },
    msg: ''
}
```

`nombre` es opcional en el tipo de respuesta porque una validación negativa puede no aportar un nombre asociado.

El tipo completo es:

```ts
type TicketBaiWsAeatValidationResponse =
    TicketBaiWsSuccessResponse<
        TicketBaiWsAeatValidationResult
    >;
```

---

# Validación VIES

La validación VIES comprueba si un identificador fiscal está registrado como operador intracomunitario.

La API del SDK es:

```ts
const response = await client.validation.vies({
    nif: 'B12345678',
    pais: 'ES'
});
```

El request utiliza:

```ts
interface TicketBaiWsViesValidationRequest {
    readonly nif: string;
    readonly pais: string;
}
```

Los dos campos son obligatorios.

### `nif`

Identificador fiscal que se quiere validar.

Ejemplo:

```ts
nif: 'B12345678'
```

### `pais`

Código de país asociado al identificador.

Ejemplo:

```ts
pais: 'ES'
```

La documentación de TicketBaiWS muestra códigos de país de dos letras.

El SDK no mantiene un catálogo propio de países ni valida que el código pertenezca a la Unión Europea.

## Estados VIES

El SDK expone:

```ts
type TicketBaiWsViesValidationStatus =
    | 'IDENTIFICADO'
    | 'NO IDENTIFICADO';
```

### `IDENTIFICADO`

TicketBaiWS documenta este resultado cuando el NIF es válido y figura registrado en VIES como operador intracomunitario.

### `NO IDENTIFICADO`

TicketBaiWS documenta este resultado cuando el NIF no es válido o no aparece registrado como operador intracomunitario.

El SDK no intenta distinguir entre esas dos causas.

## Respuesta VIES

El resultado utiliza:

```ts
interface TicketBaiWsViesValidationResult {
    readonly nif: string;
    readonly nombre?: string;
    readonly resultado: TicketBaiWsViesValidationStatus;
}
```

Ejemplo:

```ts
const response = await client.validation.vies({
    nif: 'B12345678',
    pais: 'ES'
});

console.log(response.return.nif);
console.log(response.return.nombre);
console.log(response.return.resultado);
```

Ejemplo conceptual:

```ts
{
    result: 'OK',
    return: {
        nif: 'B12345678',
        nombre: 'EMPRESA DE EJEMPLO S.L.',
        resultado: 'IDENTIFICADO'
    },
    msg: ''
}
```

`nombre` se mantiene opcional en el modelo de respuesta.

Esto permite representar tanto respuestas identificadas como respuestas negativas sin asumir que TicketBaiWS proporcionará siempre un nombre.

El tipo completo es:

```ts
type TicketBaiWsViesValidationResponse =
    TicketBaiWsSuccessResponse<
        TicketBaiWsViesValidationResult
    >;
```

---

# Tipos públicos

Los tipos de validación se exportan desde el entry point principal:

```ts
import type {
    TicketBaiWsAeatValidationRequest,
    TicketBaiWsAeatValidationResponse,
    TicketBaiWsAeatValidationResult,
    TicketBaiWsAeatValidationStatus,
    TicketBaiWsViesValidationRequest,
    TicketBaiWsViesValidationResponse,
    TicketBaiWsViesValidationResult,
    TicketBaiWsViesValidationStatus
} from '@osumi/ticketbaiws';
```

No es necesario importar desde rutas internas del paquete.

---

# Errores

Los métodos de validación utilizan el transporte común de `@osumi/ticketbaiws`.

Pueden lanzar:

```text
TicketBaiWsApiError
TicketBaiWsHttpError
TicketBaiWsNetworkError
TicketBaiWsResponseError
```

Ejemplo:

```ts
import {
    TicketBaiWsApiError
} from '@osumi/ticketbaiws';

try {
    const response = await client.validation.aeat({
        nif: '12345678Z',
        nombre: 'Juan Martínez'
    });

    console.log(response.return.resultado);
}
catch (error: unknown) {
    if (error instanceof TicketBaiWsApiError) {
        console.error(
            'TicketBaiWS rechazó la validación:',
            error.apiResponse
        );
    }
    else {
        throw error;
    }
}
```

Consulta [Primeros pasos](getting-started.md) para la jerarquía completa de errores.

---

# Diferencia entre AEAT y VIES

Los dos métodos responden a necesidades distintas.

## AEAT

```ts
client.validation.aeat(...)
```

se utiliza para validar la identidad fiscal frente al censo de la AEAT.

Para personas físicas puede tener en cuenta:

```text
NIF + nombre
```

y ofrece estados adicionales para coincidencias similares, bajas o revocaciones.

## VIES

```ts
client.validation.vies(...)
```

comprueba si un NIF está registrado como operador intracomunitario.

Su request utiliza:

```text
NIF + país
```

y sus posibles estados son únicamente:

```text
IDENTIFICADO
NO IDENTIFICADO
```

Validar correctamente un NIF en AEAT no implica necesariamente que esté registrado en VIES.

Del mismo modo, estos métodos no sustituyen las reglas fiscales que determinan cuándo una operación debe considerarse intracomunitaria.

---

# Nota sobre una inconsistencia de la documentación oficial

La página oficial de VIES contiene una contradicción relevante.

La tabla formal de parámetros documenta:

```text
nif   obligatorio
pais  obligatorio
```

y describe `pais` como el código de país.

Sin embargo, varios ejemplos de código publicados en esa misma página envían:

```json
{
    "nif": "12345678Z",
    "nombre": "Juan Martínez"
}
```

es decir, utilizan `nombre` en lugar de `pais`.

Esos ejemplos coinciden prácticamente con los del endpoint AEAT y parecen haber sido reutilizados accidentalmente.

`@osumi/ticketbaiws` sigue la definición formal del endpoint y por ello modela la petición VIES como:

```ts
interface TicketBaiWsViesValidationRequest {
    readonly nif: string;
    readonly pais: string;
}
```

No se admite `nombre` como parámetro de entrada de `validation.vies()`.

La respuesta documentada de VIES sí muestra una propiedad `nombre`, por lo que el SDK la conserva como opcional en:

```ts
TicketBaiWsViesValidationResult
```

---

# Documentación oficial

Documentación general de TicketBaiWS:

https://ticketbaiws.eus/es/documentacion-api/

Validar NIF en AEAT:

https://ticketbaiws.eus/es/validar-nif-post/

Validar NIF en VIES:

https://ticketbaiws.eus/es/validar-nif-vies-post/

---

[← Volver al índice de documentación](README.md)
