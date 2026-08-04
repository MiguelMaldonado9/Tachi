# 02. Matching Algorithm

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 02-matching-algorithm.md |
| Componente | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Matching Algorithm constituye el mecanismo responsable de seleccionar el conductor más adecuado para atender una solicitud de viaje.

Su objetivo no consiste únicamente en encontrar el conductor más cercano.

El algoritmo busca identificar el mejor candidato disponible considerando múltiples variables operativas y de negocio.

Esta estrategia permite mejorar la calidad del servicio, reducir cancelaciones y optimizar la utilización de la flota.

---

# 2. Objetivos

El algoritmo de Matching deberá cumplir los siguientes objetivos.

- minimizar el tiempo de asignación
- reducir el tiempo de espera del pasajero
- aumentar la aceptación de viajes
- distribuir equitativamente las oportunidades entre conductores
- reducir viajes rechazados
- minimizar reasignaciones
- mantener baja latencia
- escalar horizontalmente

---

# 3. Principios del Algoritmo

El algoritmo seguirá los siguientes principios.

- procesamiento determinístico
- decisiones reproducibles
- ejecución rápida
- baja complejidad computacional
- procesamiento concurrente
- independencia del Backend Principal
- desacoplamiento del Dispatcher

---

# 4. Filosofía

El algoritmo de Matching no selecciona automáticamente al conductor más cercano.

Selecciona el conductor con mayor probabilidad de completar exitosamente el servicio.

Para lograrlo evalúa múltiples factores antes de tomar una decisión.

Conceptualmente.

```
Solicitud

↓

Conductores Cercanos

↓

Aplicar Filtros

↓

Calcular Score

↓

Ordenar

↓

Seleccionar Mejor Candidato

↓

Enviar al Dispatcher
```

---

# 5. Entrada del Algoritmo

El Matching Engine recibe una solicitud de viaje completamente validada por el Backend Principal.

La información mínima disponible incluye.

- identificador del viaje
- ubicación de origen
- ubicación de destino
- tipo de servicio solicitado
- hora de creación
- parámetros de configuración

Toda la información de autenticación, validaciones de negocio y reglas administrativas ya habrá sido procesada previamente por el Backend.

---

# 6. Etapas del Algoritmo

El proceso de Matching se encuentra dividido en varias etapas consecutivas.

Cada etapa reduce progresivamente el conjunto de candidatos hasta seleccionar el conductor más adecuado.

Conceptualmente.

```

Solicitud

↓

Conductores Registrados

↓

Filtrado Inicial

↓

Filtrado Operativo

↓

Cálculo de Score

↓

Ordenamiento

↓

Selección

↓

Dispatcher

```

---

# 7. Filtrado Inicial

El primer nivel elimina inmediatamente todos los conductores que no pueden recibir el viaje.

Entre ellos.

- desconectados
- suspendidos
- bloqueados
- ocupados
- fuera del área de búsqueda
- sin conexión activa
- sin ubicación válida

Estos conductores no participan en el resto del algoritmo.

---

# 8. Filtrado Operativo

Una vez obtenidos los conductores elegibles, el algoritmo verifica condiciones adicionales.

Ejemplos.

- tipo de vehículo compatible
- disponibilidad real
- aceptación de servicios
- configuración del conductor
- restricciones temporales
- estado operativo del dispositivo

Este filtro garantiza que únicamente permanezcan candidatos viables.

---

# 9. Radio de Búsqueda

El algoritmo inicia la búsqueda dentro de un radio configurable.

Ejemplo.

```

1 km

```

Si no se obtiene un conductor disponible, el radio aumenta progresivamente.

Conceptualmente.

```

1 km

↓

2 km

↓

3 km

↓

4 km

↓

5 km

↓

6 km

```

El límite máximo será configurable desde el dominio administrativo.

---

# 10. Expansión Inteligente

Cada expansión del radio deberá respetar un tiempo máximo de espera.

El algoritmo evitará incrementar innecesariamente el área de búsqueda cuando ya existan candidatos suficientes.

La estrategia de expansión deberá minimizar.

- tiempo de espera
- consumo de recursos
- asignaciones innecesarias

---

# 11. Candidatos

Al finalizar las etapas de filtrado, el algoritmo obtiene un conjunto reducido de candidatos.

Este conjunto será utilizado para calcular el Score de cada conductor.

El cálculo del Score nunca se realizará sobre la totalidad de conductores registrados.

---

# 12. Sistema de Puntuación (Matching Score)

Una vez obtenido el conjunto de candidatos elegibles, el algoritmo calculará una puntuación para cada conductor.

La puntuación representa la probabilidad de que un conductor complete exitosamente el servicio.

El conductor con mayor puntuación será seleccionado como primer candidato.

---

# 13. Factores del Score

La puntuación podrá considerar múltiples factores.

Entre ellos.

- distancia al pasajero
- calificación del conductor
- porcentaje de aceptación
- porcentaje de cancelación
- estabilidad de conexión
- disponibilidad actual
- tiempo desde el último viaje
- prioridad operativa
- reglas administrativas

Cada factor podrá tener un peso independiente.

---

## Distancia

La distancia representa uno de los factores principales.

En igualdad de condiciones, un conductor más cercano obtendrá una mejor puntuación.

No obstante, la distancia nunca será el único criterio de decisión.

---

## Calificación

Conductores con mejor historial de servicio podrán recibir una mayor puntuación.

El objetivo consiste en mejorar la experiencia del pasajero.

---

## Aceptación

El algoritmo podrá favorecer conductores con buenos niveles de aceptación.

Esto reduce tiempos muertos y disminuye reasignaciones.

---

## Cancelaciones

Conductores con altos niveles de cancelación podrán recibir una penalización dentro del Score.

---

## Disponibilidad

El sistema considerará únicamente conductores realmente disponibles.

No


# 14. Selección del Candidato

Después de calcular el Matching Score, los candidatos serán ordenados de mayor a menor puntuación.

El algoritmo generará una lista priorizada de posibles conductores.

Ejemplo.

```
1. Driver #125  Score: 94
2. Driver #842  Score: 89
3. Driver #331  Score: 86
4. Driver #900  Score: 82
```

El primer candidato será enviado al Dispatcher para iniciar el proceso de oferta.

---

# 15. Integración con Dispatcher

El Matching Algorithm no realiza directamente el envío de viajes.

Su responsabilidad termina al entregar una lista priorizada de candidatos.

El Dispatcher será responsable de:

- enviar la oferta
- controlar tiempos
- recibir respuestas
- gestionar rechazos
- continuar con siguientes candidatos

Separación:

```
Matching Engine

↓

¿Quién debería recibirlo?

↓

Dispatcher

↓

¿Cómo se entrega?

```

---

# 16. Estrategia de Oferta

Las ofertas deberán gestionarse mediante una estrategia configurable.

Existen diferentes modos posibles.

---

## Sequential Matching

El sistema envía la oferta a un conductor a la vez.

Ejemplo.

```
Driver A

↓

No responde

↓

Driver B

↓

Acepta
```

Ventajas.

- menor cantidad de rechazos simultáneos
- menor competencia entre conductores
- mayor control

---

## Parallel Matching

El sistema envía la oferta a varios conductores simultáneamente.

Ejemplo.

```
Driver A
Driver B
Driver C

↓

Primer conductor que acepta gana
```

Ventajas.

- menor tiempo de asignación
- mayor probabilidad de aceptación rápida

---

# 17. Estrategia para MVP

Para la primera versión de Tachi se recomienda utilizar un modelo controlado.

Configuración inicial sugerida.

```
Matching Sequential

+

Expansión progresiva de radio

+

Timeout configurable

+

Reintentos automáticos
```

Esta estrategia permite validar el comportamiento real de la plataforma antes de implementar modelos más complejos.

---

# 18. Reintentos

Cuando un conductor rechace una oferta o no responda dentro del tiempo establecido, el sistema deberá continuar con el siguiente candidato disponible.

El conductor rechazado no deberá recibir nuevamente la misma solicitud.

---

# 19. Expiración

Toda oferta deberá tener un tiempo máximo de validez.

Ejemplo.

```
Oferta creada

↓

30 segundos

↓

Expira automáticamente
```

Las ofertas expiradas deberán generar eventos internos para continuar el flujo.

---

# 20. Manejo de Errores

El Matching Algorithm deberá manejar fallos durante todo el proceso de selección de candidatos.

Los errores no deberán detener el funcionamiento general del Trip Engine.

---

## Escenarios de Error

Entre los escenarios contemplados.

- ausencia de conductores disponibles
- información de ubicación inválida
- datos inconsistentes del conductor
- fallo temporal de servicios internos
- pérdida de comunicación
- expiración de candidatos

---

## Recuperación

Ante un error, el algoritmo deberá ejecutar estrategias de recuperación.

Ejemplos.

- ampliar radio de búsqueda
- seleccionar nuevos candidatos
- generar eventos de error
- solicitar una nueva evaluación
- notificar al Dispatcher

---

# 21. Métricas del Algoritmo

El funcionamiento del Matching Engine deberá medirse mediante indicadores operativos.

---

## Tiempo de Matching

Tiempo transcurrido desde la creación del viaje hasta la selección del primer candidato.

Objetivo.

Minimizar la latencia de asignación.

---

## Tasa de Aceptación

Porcentaje de ofertas aceptadas por los conductores.

Permite evaluar la calidad de la selección realizada.

---

## Tasa de Cancelación

Cantidad de viajes cancelados después de la asignación.

Permite detectar problemas en la selección de candidatos.

---

## Reasignaciones

Cantidad de veces que un viaje requiere nuevos candidatos.

Un número elevado puede indicar problemas en el algoritmo.

---

## Precisión del Matching

Capacidad del algoritmo para seleccionar conductores que realmente completan exitosamente los viajes.

---

# 22. Simulación del Algoritmo

El Matching Engine deberá disponer de capacidades de simulación para validar cambios antes de aplicarlos en producción.

La simulación permitirá ejecutar escenarios controlados.

Ejemplos.

- alta demanda
- baja disponibilidad
- múltiples solicitudes simultáneas
- diferentes configuraciones de Score
- cambios de pesos del algoritmo

---

Conceptualmente.

```
Conductores Simulados

+

Viajes Simulados

↓

Matching Engine

↓

Resultados

↓

Métricas

```

---

# 23. Evolución del Algoritmo

La arquitectura permitirá evolucionar progresivamente el algoritmo de Matching.

La primera versión estará basada en reglas configurables y puntuaciones ponderadas.

Versiones futuras podrán incorporar.

- aprendizaje automático
- predicción de aceptación
- predicción de demanda
- optimización de rutas
- análisis histórico
- modelos predictivos

---

# 24. Inteligencia Artificial

La incorporación de modelos inteligentes deberá realizarse sobre la arquitectura existente.

El modelo de IA no reemplazará el sistema de Matching.

Será utilizado como una fuente adicional de información para mejorar la puntuación.

Ejemplo.

```
Datos Históricos

+

Modelo Predictivo

↓

Probabilidad de aceptación

↓

Matching Score

↓

Selección

```

---

# 25. Seguridad del Algoritmo

El algoritmo deberá protegerse contra manipulación y abuso.

Las decisiones de asignación deberán estar respaldadas por reglas verificables.

---

## Protección

Se deberá evitar.

- manipulación del Score
- falsificación de ubicación
- generación artificial de disponibilidad
- abuso de prioridades

---

## Auditoría

Las decisiones relevantes del algoritmo deberán generar información suficiente para análisis posterior.

Debe ser posible responder.

- ¿Por qué se seleccionó este conductor?
- ¿Qué candidatos fueron evaluados?
- ¿Qué Score obtuvo cada uno?
- ¿Qué reglas participaron?

---

# 26. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|------------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Definición del algoritmo de Matching del Trip Engine. |

---

# Conclusión

El Matching Algorithm representa uno de los componentes más importantes del ecosistema Tachi.

Su diseño basado en filtros progresivos, puntuación configurable, procesamiento determinístico y evolución preparada para inteligencia artificial permite construir un sistema flexible y escalable.

La arquitectura evita depender únicamente de la distancia geográfica y permite tomar decisiones considerando múltiples variables operativas y de negocio.

Este enfoque permitirá que Tachi evolucione progresivamente desde un MVP funcional hasta una plataforma de movilidad inteligente capaz de optimizar millones de asignaciones de viajes.