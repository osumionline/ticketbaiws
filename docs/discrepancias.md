# Discrepancias de la documentación de TicketBaiWS

Registro de inconsistencias, ambigüedades y dudas detectadas durante
el desarrollo de `@osumi/ticketbaiws`.

El objetivo es reunir las cuestiones que deben comunicarse a Berein
antes de publicar una nueva versión del SDK.

## Seguimiento

- SDK en desarrollo: 1.1.0
- Inicio del registro: 27/11/2026
- Referencia: OpenAPI 3.1.0, versión 1.0.8
- Estado general: pendiente de comunicar a Berein

### Fuentes principales

- [Documentación oficial](https://ticketbaiws.eus/es/documentacion-api/)
- [OpenAPI oficial](https://api.ticketbaiws.eus/openapi.json)

### Estados posibles

- **Pendiente:** discrepancia identificada, pendiente de comunicar.
- **Por verificar:** requiere una comprobación adicional.
- **Comunicada:** enviada a Berein, pendiente de respuesta.
- **Respondida:** Berein ha contestado, pendiente de aplicar o revisar.
- **Resuelta:** documentación o comportamiento corregidos.
- **Descartada:** se ha confirmado que no existe inconsistencia.

Conservar los identificadores `DISC-XXX`, aunque se resuelva una incidencia.

---

## 1. BATUZ / LROE — Facturas recibidas

### DISC-001 — Tipos de campos con valores alfabéticos

**Estado:** Pendiente

**Endpoints:** POST/PUT `/lroe-recibidas/`

Los campos `bien_afecto_irpf_iva` y `modo_recargo_simplificado`
aparecen definidos como `integer` en la documentación/especificación,
pero sus valores posibles son alfabéticos:

- `bien_afecto_irpf_iva`: `I`, `R`, `N`.
- `modo_recargo_simplificado`: `E`, `N`, `S`.

**Consulta a Berein:** confirmar que ambos campos deben declararse
como `string`, preferiblemente con sus enumeraciones.

**SDK:** actualmente utiliza las uniones de cadenas documentadas.

**Fuente:**
https://ticketbaiws.eus/es/lroe-recibidas-post/

### DISC-002 — Tipo de `referencia_bien`

**Estado:** Pendiente

**Endpoint:** POST `/lroe-recibidas/`

`referencia_bien` aparece descrito como `integer`, pero el ejemplo
de la documentación utiliza `ABC`, que es una cadena.

**Consulta a Berein:** confirmar si el campo admite referencias
alfanuméricas y debe declararse `string`.

**SDK:** utiliza `string`, siguiendo el ejemplo documental.

**Fuente:**
https://ticketbaiws.eus/es/lroe-recibidas-post/

### DISC-003 — Tipo de `epigrafe` en las bases

**Estado:** Pendiente

**Endpoints:** POST/PUT `/lroe-recibidas/`

El campo `epigrafe` se documenta como `integer`, mientras que
los ejemplos JSON muestran valores como `"197210"`.

**Consulta a Berein:** confirmar si se aceptan tanto números como
cadenas o si el tipo correcto es únicamente `string`.

**SDK:** utiliza `string`.

**Fuente:**
https://ticketbaiws.eus/es/lroe-recibidas-post/

### DISC-004 — Alias `importe` frente a `base_imponible`

**Estado:** Por verificar

**Endpoints:** POST/PUT `/lroe-recibidas/`

En la revisión del OpenAPI se identificó `importe` como alternativa
a `base_imponible` dentro de las bases. Sin embargo,
`base_imponible` sigue figurando como obligatorio.

**Consulta a Berein:** confirmar si es posible enviar solamente
`importe`, sin `base_imponible`, y cómo debería expresarse esa
alternativa en el esquema OpenAPI.

**SDK:** por ahora exige `base_imponible`. No se ha incorporado
el alias hasta aclarar el contrato.

**Fuente:** OpenAPI oficial, esquemas de facturas recibidas.

### DISC-005 — `fecha_rectificada` en modificación

**Estado:** Pendiente

**Endpoint:** PUT `/lroe-recibidas/`

En la revisión del OpenAPI, `fecha_rectificada` aparece como
obligatoria sin condición, aunque su descripción la relaciona
con las facturas rectificativas.

**Consulta a Berein:** confirmar si únicamente es obligatoria
cuando `rectificativa = true` y ajustar el esquema en ese caso.

**SDK:** mantiene el campo opcional.

**Fuente:**
https://ticketbaiws.eus/es/lroe-recibidas-put/

---

## 2. BATUZ / LROE — Criterio de caja

### DISC-006 — Campos obligatorios incompatibles entre modalidades

**Estado:** Pendiente

**Endpoints:**

- POST/PUT `/lroe-critcaja-cobros/`
- POST/PUT `/lroe-critcaja-pagos/`

En las listas `required` del OpenAPI aparecen simultáneamente
campos de operaciones `con_factura` y `sin_factura`, pese a que
las dos modalidades tienen requisitos diferentes.

Por ejemplo, se combinan identificadores de factura con campos
específicos como `tipo_ingreso`, `concepto` o `linea`.

**Consulta a Berein:** confirmar los campos obligatorios de cada
modalidad y considerar esquemas discriminados mediante `oneOf`
y `tipo_operacion`.

**SDK:** utiliza uniones discriminadas para representar
las dos modalidades.

**Fuente:** OpenAPI oficial, esquemas de cobros y pagos.

### DISC-007 — Obligatoriedad de `fecha_operacion`

**Estado:** Pendiente

**Endpoints:**

- POST/PUT `/lroe-critcaja-cobros/`
- POST/PUT `/lroe-critcaja-pagos/`

La documentación identifica `fecha_operacion` como obligatoria
cuando `tipo_operacion = sin_factura`, pero las declaraciones
`required` no reflejan correctamente esa condición.

**Consulta a Berein:** confirmar la obligatoriedad condicional
e incorporarla al esquema de cada modalidad.

**SDK:** exige `fecha_operacion` en los tipos sin factura y la
mantiene opcional cuando existe una factura asociada.

**Fuente:** OpenAPI oficial, esquemas de cobros y pagos.

---

## 3. Webhooks

### DISC-008 — Eliminación de webhooks ausente del índice HTML

**Estado:** Pendiente

**Endpoint:** DELETE `/webhooks/{codigo_webhook}/`

La revisión anterior del OpenAPI 1.0.8 identificó la operación
DELETE para eliminar un webhook, pero el índice HTML de métodos
y el listado de herramientas MCP no la incluyen.

**Consulta a Berein:** confirmar la disponibilidad de DELETE
en pruebas y producción, y añadirlo a los índices documentales
y a los ejemplos públicos.

**SDK:** se incorporará `client.webhooks.delete()` en 1.1.0.

**Fuentes:**

- https://api.ticketbaiws.eus/openapi.json
- https://ticketbaiws.eus/es/documentacion-api/
- https://ticketbaiws.eus/es/desarrolladores/mcp/

### DISC-009 — Diferencias entre los ejemplos de notificaciones

**Estado:** Por verificar

**Eventos afectados:** principalmente `cambio_estado`

Algunos ejemplos del cuerpo JSON de `cambio_estado` incluyen
únicamente datos de la factura, mientras que los modelos más
recientes contemplan propiedades adicionales como
`codigo_webhook` o `evento`.

Además, los esquemas de las notificaciones entrantes del
OpenAPI no especifican propiedades obligatorias mediante
`required`.

**Consulta a Berein:** confirmar qué campos están garantizados
en todos los envíos de cada evento y cuáles son opcionales.
Aclarar si `X-TbaiWs-Topic` debe considerarse el identificador
canónico del evento.

**SDK:** los campos de los payloads se mantienen opcionales
y se tipan los cuatro eventos mediante el topic.

**Fuentes:**

- https://ticketbaiws.eus/es/webhooks-get/
- https://ticketbaiws.eus/es/webhooks-put/
- https://api.ticketbaiws.eus/openapi.json

### DISC-010 — Ejemplo Java de modificación de webhook

**Estado:** Pendiente

**Endpoint:** PUT `/webhooks/{codigo_webhook}/`

La operación se identifica como PUT, pero el ejemplo Java
publicado construye la petición mediante `.post(body)`.

**Consulta a Berein:** sustituirlo por el método PUT
correspondiente en el ejemplo Java.

**Fuente:**
https://ticketbaiws.eus/es/webhooks-put/

---

## 4. Clientes y productos de facturación

### DISC-011 — Alias de campos en el alta de clientes

**Estado:** Por verificar

**Endpoint:** POST `/clientes/`

El OpenAPI declara `nombre` como obligatorio mediante
`required: ["nombre"]`, pero la descripción del campo indica
que `nombre_social` es un alias.

De igual manera, el campo `pais` documenta `pais_cliente`
como alias, aunque no lo incluye como propiedad independiente
en el esquema del request.

**Consulta a Berein:** confirmar si el API admite un alta
con `nombre_social` sin enviar `nombre`, y si se acepta
`pais_cliente` en lugar de `pais`.

En caso afirmativo, reflejar las alternativas de forma
explícita en el OpenAPI.

**SDK:** requiere `nombre` en el alta y utiliza `pais`
en el DTO de escritura, siguiendo el esquema publicado.
Los campos devueltos por el API se conservan íntegramente.

**Fuente:**
https://api.ticketbaiws.eus/openapi.json

**Operación:** `POST /clientes/`

---

## 5. Cuestiones históricas

Antes de la versión 1.0.1 del SDK ya se comunicó a Berein un
informe con otras inconsistencias de documentación.

Entre ellas estaban las diferencias de ejemplos GET con body
frente a query string, descripciones copiadas de cobros a pagos
y diferencias entre tipos numéricos y cadenas en determinados
modelos LROE.

No deben duplicarse en el próximo informe salvo que se compruebe
que siguen pendientes y que conviene insistir en ellas.

---

## 6. Informe a Berein

Antes de publicar `@osumi/ticketbaiws` 1.1.0:

1. Revisar todas las incidencias pendientes.
2. Contrastar cada una con la versión más reciente del OpenAPI.
3. Eliminar del informe las cuestiones resueltas o descartadas.
4. Agrupar las dudas restantes por endpoint.
5. Enviar el informe a Berein.
6. Registrar la fecha de envío y actualizar los estados.
7. Incorporar las respuestas de Berein antes de cerrar la versión.

Este archivo es el registro de seguimiento. No es necesario
eliminar las incidencias resueltas: conservarlas permite
entender decisiones de tipado tomadas durante el desarrollo.
