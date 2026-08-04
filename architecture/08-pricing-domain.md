# 08. Pricing Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 08-pricing-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Pricing Domain es el dominio responsable de calcular el valor económico de todos los servicios prestados por la plataforma Tachi.

Su función consiste en transformar la información operativa de un viaje en una tarifa final aplicando las reglas comerciales definidas por la plataforma.

Este dominio concentra toda la lógica relacionada con:

- tarifas
- costos
- recargos
- descuentos
- promociones
- multiplicadores dinámicos
- incentivos
- políticas comerciales

De esta manera, el resto de los dominios nunca necesitarán conocer cómo se calcula el precio de un viaje.

---

# 2. Objetivos

Los principales objetivos del Pricing Domain son:

- Calcular el valor total de un viaje.
- Centralizar todas las reglas tarifarias.
- Administrar promociones y descuentos.
- Permitir tarifas dinámicas.
- Soportar múltiples ciudades.
- Permitir configuraciones independientes por zona.
- Facilitar futuras estrategias comerciales.
- Mantener independencia respecto al Trip Engine.

---

# 3. Responsabilidades

El Pricing Domain será responsable exclusivamente del cálculo de tarifas.

Entre sus responsabilidades se encuentran:

- calcular tarifa base
- calcular distancia
- calcular tiempo
- aplicar tarifa dinámica
- aplicar promociones
- aplicar descuentos
- aplicar recargos
- calcular peajes
- calcular impuestos
- calcular incentivos
- generar el precio final

No será responsabilidad del Pricing Domain administrar:

- viajes
- conductores
- usuarios
- pagos
- vehículos
- autenticación
- mapas
- asignación de servicios

Estas responsabilidades pertenecen a sus respectivos dominios.

---

# 4. Principios del Dominio

El diseño del Pricing Domain se fundamenta en los siguientes principios.

---

## Desacoplamiento

El algoritmo de cálculo permanecerá completamente separado del resto de la plataforma.

Ningún dominio externo conocerá cómo se obtiene el precio final.

---

## Configuración

Todas las tarifas deberán poder modificarse sin necesidad de recompilar el sistema.

---

## Escalabilidad

La arquitectura permitirá incorporar nuevas reglas comerciales sin modificar las existentes.

---

## Reutilización

El mismo motor tarifario podrá utilizarse para:

- estimaciones
- cotizaciones
- viajes reales
- simulaciones
- promociones futuras

---

## Transparencia

Cada cálculo deberá poder explicarse completamente.

Será posible conocer exactamente cómo fue calculado el valor final.

---

# 5. Conceptos del Dominio

Para comprender el funcionamiento del Pricing Domain se definen los siguientes conceptos.

---

## Tarifa Base

Valor inicial que todo viaje posee antes de aplicar cualquier cálculo adicional.

---

## Distancia

Cantidad de kilómetros recorridos durante el viaje.

---

## Tiempo

Cantidad de minutos empleados durante el recorrido.

---

## Tarifa Dinámica

Multiplicador aplicado cuando existe una alta demanda de servicios.

---

## Promoción

Beneficio económico financiado por la plataforma.

---

## Descuento

Reducción aplicada sobre el valor del viaje.

---

## Recargo

Incremento aplicado por condiciones especiales.

Ejemplos:

- aeropuerto
- horario nocturno
- peajes
- zonas especiales

---

## Estimación

Valor aproximado mostrado al usuario antes de solicitar un viaje.

El valor definitivo podrá variar dependiendo del recorrido real.

---

# 6. Actores

Dentro del Pricing Domain participan los siguientes actores.

---

## Pasajero

Consulta la estimación del viaje antes de solicitar el servicio.

---

## Conductor

Recibe información sobre el valor estimado del servicio antes de aceptarlo.

---

## Plataforma

Define todas las reglas tarifarias.

---

## Administration Domain

Podrá modificar:

- tarifas
- promociones
- recargos
- multiplicadores
- políticas comerciales

Sin necesidad de realizar cambios en el código fuente.

---

# 7. Modelo Conceptual

El Pricing Domain transforma la información operativa de un viaje en un valor económico.

Conceptualmente el proceso puede representarse de la siguiente manera.

```
Solicitud de Viaje

↓

Origen

↓

Destino

↓

Distancia

↓

Tiempo Estimado

↓

Motor Tarifario

↓

Precio Estimado
```

Cuando el viaje termina, el proceso se ejecutará nuevamente utilizando los valores reales del recorrido.

```
Viaje Finalizado

↓

Distancia Real

↓

Tiempo Real

↓

Motor Tarifario

↓

Precio Final
```

---

# 8. Flujo General de Cálculo

Todo cálculo tarifario seguirá exactamente el mismo orden.

```
Tarifa Base

↓

Costo por Distancia

↓

Costo por Tiempo

↓

Tarifa Dinámica

↓

Recargos

↓

Peajes

↓

Promociones

↓

Descuentos

↓

Redondeo

↓

Precio Final
```

Cada etapa representa una responsabilidad independiente.

Esto permitirá modificar una regla sin afectar las demás.

---

# 9. Componentes del Precio

El precio final de un viaje estará compuesto por diferentes elementos.

---

## Tarifa Base

Representa el costo mínimo por iniciar un servicio.

Ejemplo.

```
Tarifa Base

$3.500
```

Todo viaje comenzará con este valor.

---

## Distancia

Representa el costo asociado al recorrido.

Ejemplo.

```
12 km

×

$1.250

=

$15.000
```

La distancia será calculada por el Maps Domain.

El Pricing Domain únicamente utilizará el resultado.

---

## Tiempo

Representa el costo asociado a la duración del recorrido.

Ejemplo.

```
18 minutos

×

$180

=

$3.240
```

---

## Tarifa Dinámica

Cuando exista alta demanda el sistema podrá aplicar un multiplicador.

Ejemplo.

```
Precio Parcial

$20.000

×

1.5

=

$30.000
```

La lógica del multiplicador permanecerá completamente encapsulada dentro del Pricing Domain.

---

## Recargos

El sistema podrá aplicar recargos adicionales.

Ejemplos:

- aeropuerto
- terminal
- horario nocturno
- eventos especiales
- zonas rurales

Los recargos podrán ser:

- fijos
- porcentuales

---

## Peajes

Los peajes podrán agregarse automáticamente al cálculo.

El sistema permitirá:

- uno
- varios
- ninguno

dependiendo de la ruta utilizada.

---

## Promociones

Las promociones representan beneficios financiados por la plataforma.

Ejemplo.

```
Valor

$30.000

↓

Promoción

$5.000

↓

Subtotal

$25.000
```

---

## Descuentos

Los descuentos podrán aplicarse mediante:

- cupones
- campañas
- programas de fidelización
- convenios empresariales

---

## Redondeo

Como último paso el sistema podrá aplicar políticas de redondeo.

Ejemplos.

```
$23.842

↓

$23.900
```

o

```
$23.842

↓

$24.000
```

La política será configurable desde Administration Domain.

---

# 10. Fórmula Conceptual

Conceptualmente el cálculo podrá representarse de la siguiente forma.

```
Precio Final

=

(

Tarifa Base

+

Distancia

+

Tiempo

+

Recargos

+

Peajes

)

×

Multiplicador Dinámico

-

Promociones

-

Descuentos
```

Esta fórmula representa únicamente el modelo conceptual.

La implementación interna podrá dividir el cálculo en múltiples componentes especializados.

---

# 11. Estimación vs Precio Final

El Pricing Domain realizará dos tipos de cálculo.

---

## Estimación

Se ejecuta antes de iniciar el viaje.

Utiliza información proyectada.

Ejemplos:

- ruta estimada
- tráfico esperado
- tiempo estimado

Su objetivo es informar al pasajero cuánto podría costar el servicio.

---

## Precio Final

Se calcula cuando el viaje termina.

Utiliza información real.

Ejemplos:

- distancia recorrida
- tiempo real
- peajes utilizados
- cambios de ruta

Este será el valor utilizado por el Payment Domain para generar la transacción financiera.

---

# 12. Reglas de Negocio

El Pricing Domain será el único responsable de aplicar las reglas comerciales de la plataforma.

Ningún otro dominio podrá modificar el valor económico de un viaje.

Todas las reglas serán configurables desde el Administration Domain.

---

## Regla 1

Todo viaje deberá tener una tarifa base.

No existirán viajes con valor inicial igual a cero.

---

## Regla 2

La distancia utilizada para el cálculo siempre será suministrada por el Maps Domain.

El Pricing Domain nunca calculará rutas.

---

## Regla 3

El tiempo utilizado para el cálculo será suministrado por el Trip Domain.

---

## Regla 4

Las promociones nunca podrán generar un valor negativo.

El valor mínimo permitido será:

```

$0

```

---

## Regla 5

Los descuentos se aplicarán únicamente después de calcular el precio bruto del viaje.

---

## Regla 6

Los recargos siempre deberán aplicarse antes de las promociones.

---

## Regla 7

Toda modificación tarifaria deberá quedar registrada por el Audit Domain.

---

## Regla 8

El cálculo tarifario deberá ser completamente determinístico.

Con los mismos datos de entrada siempre deberá producir exactamente el mismo resultado.

---

## Regla 9

Todas las configuraciones tarifarias podrán cambiarse sin reiniciar el sistema.

---

## Regla 10

Toda estimación deberá indicar que corresponde a un valor aproximado.

El precio definitivo únicamente se conocerá al finalizar el viaje.

---

# 13. Configuración por Ciudad

El Pricing Domain permitirá administrar configuraciones independientes para cada ciudad.

Ejemplo conceptual.

```
Bogotá

Tarifa Base

$4.000

Km

$1.350

Minuto

$220

-------------------------

Mosquera

Tarifa Base

$3.200

Km

$1.050

Minuto

$180

-------------------------

Funza

Tarifa Base

$3.100

Km

$1.000

Minuto

$170
```

Cada ciudad podrá evolucionar de forma independiente.

---

# 14. Configuración por Tipo de Servicio

La plataforma podrá ofrecer múltiples categorías de servicio.

Ejemplo.

```
Tachi Go

↓

Vehículo Particular

----------------------

Tachi Comfort

↓

Vehículo Premium

----------------------

Tachi XL

↓

Vehículos Grandes

----------------------

Tachi Moto

↓

Motocicletas

----------------------

Tachi Taxi

↓

Taxi Tradicional
```

Cada categoría podrá tener tarifas completamente diferentes.

---

# 15. Tarifa Dinámica

El Pricing Domain permitirá aplicar multiplicadores automáticos cuando aumente la demanda.

Ejemplo.

```
Demanda Baja

↓

1.0

----------------

Demanda Media

↓

1.2

----------------

Demanda Alta

↓

1.5

----------------

Demanda Muy Alta

↓

2.0
```

Los valores serán completamente configurables.

---

## Factores que podrán activar la tarifa dinámica

Entre los factores considerados se encuentran:

- alta demanda
- baja disponibilidad de conductores
- congestión vehicular
- eventos masivos
- condiciones climáticas
- horarios especiales

Cada uno podrá activarse de forma independiente.

---

# 16. Recargos

El sistema permitirá configurar múltiples recargos.

Ejemplos.

```
Aeropuerto

+$8.000

----------------

Terminal

+$5.000

----------------

Horario Nocturno

+15%

----------------

Zona Rural

+$6.000

----------------

Peajes

Valor Real
```

Los recargos podrán combinarse entre sí.

---

# 17. Promociones

Las promociones serán administradas completamente por el Pricing Domain.

Podrán existir promociones como:

- primer viaje
- cumpleaños
- campañas publicitarias
- convenios empresariales
- eventos especiales
- códigos promocionales

Cada promoción tendrá sus propias reglas de vigencia.

---

# 18. Cupones

El dominio permitirá administrar cupones promocionales.

Cada cupón podrá definir:

- fecha inicio
- fecha fin
- número máximo de usos
- límite por usuario
- porcentaje
- valor fijo
- ciudades habilitadas
- categorías permitidas

---

# 19. Tarifas Corporativas

El sistema permitirá definir tarifas especiales para empresas afiliadas.

Ejemplos.

- descuentos permanentes
- tarifas negociadas
- límites mensuales
- facturación unificada
- centros de costo

Esta funcionalidad permitirá incorporar clientes empresariales en futuras versiones.

---

# 20. Integración con otros Dominios

El Pricing Domain interactúa con diferentes dominios de la plataforma, manteniendo siempre una clara separación de responsabilidades.

Cada dominio conserva su propia lógica de negocio y únicamente intercambia la información estrictamente necesaria para realizar el cálculo tarifario.

---

## Integración con Trip Domain

El Trip Domain solicita al Pricing Domain el cálculo del valor estimado y del valor final del viaje.

El flujo conceptual será el siguiente.

```
Trip

↓

Origen

↓

Destino

↓

Pricing Domain

↓

Precio Estimado
```

Al finalizar el viaje:

```
Trip Finalizado

↓

Distancia Real

↓

Tiempo Real

↓

Pricing Domain

↓

Precio Final
```

El Trip Domain nunca calculará tarifas.

---

## Integración con Maps Domain

El Maps Domain será responsable de suministrar:

- distancia
- tiempo estimado
- tiempo real
- peajes
- zonas especiales

El Pricing Domain utilizará esta información para realizar los cálculos económicos.

Nunca calculará rutas.

---

## Integración con Payment Domain

Una vez calculado el precio final, el resultado será enviado al Payment Domain.

```
Pricing

↓

Precio Final

↓

Payment Domain

↓

Cobro
```

El Payment Domain nunca modificará el precio recibido.

---

## Integración con Driver Domain

El Driver Domain utilizará la tarifa calculada para mostrar al conductor la estimación económica del servicio antes de aceptarlo.

Posteriormente recibirá el valor definitivo para generar la liquidación correspondiente.

---

## Integración con Promotions Domain

El Promotions Domain administrará todas las campañas promocionales.

El Pricing Domain consultará únicamente aquellas promociones que sean válidas para el viaje actual.

Esto permite mantener desacopladas las reglas comerciales de las campañas de mercadeo.

---

## Integración con Administration Domain

El Administration Domain permitirá administrar toda la configuración tarifaria.

Entre los parámetros configurables estarán:

- tarifa base
- precio por kilómetro
- precio por minuto
- multiplicadores
- recargos
- promociones
- descuentos
- ciudades
- categorías
- tarifas corporativas

Los cambios serán aplicados sin necesidad de reiniciar el sistema.

---

## Integración con Audit Domain

Toda modificación en la configuración tarifaria deberá generar un evento de auditoría.

Ejemplos.

- cambio de tarifa
- modificación de promociones
- creación de recargos
- eliminación de descuentos
- actualización de multiplicadores

Esto permitirá reconstruir completamente el historial de cambios comerciales de la plataforma.

---

# 21. Roadmap del Dominio

El Pricing Domain ha sido diseñado para evolucionar de forma incremental.

Entre las funcionalidades previstas para futuras versiones se encuentran las siguientes.

---

## Motor de Reglas

Incorporación de un motor de reglas configurable que permita crear políticas comerciales complejas sin modificar el código fuente.

Ejemplos.

- reglas por horarios
- reglas por zonas
- reglas por conductor
- reglas por tipo de usuario

---

## Predicción de Demanda

Implementación de modelos estadísticos capaces de estimar la demanda futura por ciudad y zona geográfica.

Esto permitirá anticipar la activación de tarifas dinámicas.

---

## Inteligencia Artificial

El dominio podrá incorporar algoritmos de Machine Learning para optimizar automáticamente las tarifas.

Entre las variables analizadas podrán incluirse:

- historial de viajes
- clima
- eventos
- tráfico
- disponibilidad de conductores
- comportamiento de los usuarios

---

## Tarifas Personalizadas

Permitirá ofrecer precios específicos según el perfil del cliente.

Ejemplos.

- clientes frecuentes
- empresas
- campañas especiales
- programas de fidelización

---

## Tarifas Predictivas

El sistema podrá sugerir la mejor tarifa posible para maximizar simultáneamente:

- satisfacción del pasajero
- ingresos del conductor
- rentabilidad de la plataforma

---

## Optimización Automática

La plataforma podrá ajustar continuamente los parámetros tarifarios utilizando información histórica.

Esto permitirá responder de manera automática a cambios en el mercado.

---

# 22. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------|--------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Creación inicial del Pricing Domain |

---

# Conclusión

El Pricing Domain constituye el núcleo comercial de la plataforma Tachi.

Toda la lógica relacionada con el cálculo de tarifas, promociones, descuentos, recargos y políticas comerciales permanece completamente encapsulada dentro de este dominio, permitiendo que el resto del sistema trabaje únicamente con precios ya calculados.

Su arquitectura desacoplada facilita la incorporación de nuevas estrategias tarifarias, múltiples ciudades, diferentes categorías de servicio y futuras capacidades basadas en inteligencia artificial sin afectar la estabilidad de la plataforma.

Gracias a esta separación de responsabilidades, Tachi podrá evolucionar su modelo de negocio de forma flexible, manteniendo un motor tarifario escalable, transparente y completamente configurable desde el panel de administración.

---