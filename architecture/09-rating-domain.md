# 09. Rating Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 09-rating-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Rating Domain es el dominio responsable de administrar el sistema de reputación de la plataforma Tachi.

Su objetivo consiste en medir la calidad del servicio ofrecido por conductores y pasajeros mediante un mecanismo de calificaciones mutuas, permitiendo construir una reputación histórica confiable para cada participante de la plataforma.

La reputación constituye uno de los principales indicadores de confianza dentro del ecosistema de Tachi.

Por esta razón, el Rating Domain ha sido diseñado para evitar manipulaciones, reducir fraudes y reflejar de la manera más precisa posible el comportamiento histórico de cada usuario.

---

# 2. Objetivos

Los principales objetivos del Rating Domain son:

- Administrar las calificaciones de la plataforma.
- Construir la reputación histórica de usuarios y conductores.
- Permitir evaluaciones mutuas.
- Reducir comportamientos fraudulentos.
- Incentivar la calidad del servicio.
- Proporcionar información para futuras decisiones del Trip Engine.
- Facilitar procesos de soporte e investigaciones.

---

# 3. Responsabilidades

El Rating Domain será responsable de:

- registrar calificaciones
- registrar comentarios
- calcular reputaciones
- administrar historial de evaluaciones
- detectar inconsistencias
- generar estadísticas
- suministrar reputación a otros dominios

No será responsable de:

- viajes
- pagos
- autenticación
- usuarios
- conductores
- promociones
- auditoría
- notificaciones

Cada dominio continuará siendo responsable de su propia lógica de negocio.

---

# 4. Principios del Dominio

El Rating Domain ha sido diseñado siguiendo los siguientes principios.

---

## Justicia

La reputación deberá reflejar el comportamiento histórico y no depender de un único evento aislado.

---

## Imparcialidad

Tanto pasajeros como conductores podrán evaluar la experiencia vivida.

La plataforma mantendrá equilibrio entre ambas partes.

---

## Transparencia

Toda calificación deberá estar asociada a un viaje real.

No existirán calificaciones anónimas ni independientes de un servicio prestado.

---

## Integridad

Una calificación registrada nunca podrá modificarse.

Si se requiere una revisión, esta deberá gestionarse mediante procesos administrativos.

---

## Escalabilidad

El sistema permitirá incorporar nuevas métricas de reputación sin afectar las evaluaciones existentes.

---

# 5. Conceptos del Dominio

Para comprender el funcionamiento del Rating Domain se definen los siguientes conceptos.

---

## Calificación

Valor numérico asignado al finalizar un viaje.

Inicialmente estará compuesto por una escala de cinco estrellas.

```
★★★★★
```

---

## Comentario

Observación escrita que complementa la calificación.

Permitirá describir aspectos positivos o negativos del servicio.

---

## Reputación

Representa la valoración histórica acumulada de un usuario o conductor.

No corresponde únicamente al promedio de estrellas.

La reputación podrá considerar diferentes variables en futuras versiones.

---

## Evaluador

Persona que emite la calificación.

Podrá ser:

- pasajero
- conductor

---

## Evaluado

Persona que recibe la calificación.

Podrá ser:

- conductor
- pasajero

---

# 6. Actores

Dentro del Rating Domain participan los siguientes actores.

---

## Pasajero

Podrá evaluar al conductor una vez finalizado el viaje.

La evaluación incluirá:

- estrellas
- comentario opcional

---

## Conductor

Podrá evaluar al pasajero al finalizar el servicio.

La evaluación permitirá registrar la experiencia vivida durante el viaje.

---

## Administrador

Podrá consultar el historial completo de calificaciones.

También podrá intervenir cuando existan reclamaciones o investigaciones relacionadas con una evaluación.

---

## Sistema

El sistema administrará automáticamente:

- disponibilidad de evaluaciones
- vencimiento del período de calificación
- cálculo de reputaciones
- generación de estadísticas

---

# 7. Modelo Conceptual

El Rating Domain administra el proceso de evaluación que ocurre al finalizar un viaje.

Conceptualmente el flujo puede representarse de la siguiente manera.

```
Viaje Finalizado

↓

Habilitar Evaluación

↓

Pasajero Evalúa

↓

Conductor Evalúa

↓

Actualizar Reputación

↓

Actualizar Estadísticas
```

Cada evaluación estará asociada exclusivamente a un viaje existente.

No será posible generar calificaciones fuera del contexto de un servicio prestado.

---

# 8. Flujo General de Evaluación

Toda evaluación seguirá exactamente el mismo proceso.

```
Viaje Finalizado

↓

Validar Elegibilidad

↓

Registrar Calificación

↓

Registrar Comentario

↓

Actualizar Reputación

↓

Actualizar Estadísticas

↓

Cerrar Evaluación
```

Este flujo será común para usuarios y conductores.

---

# 9. Evaluación Mutua

El sistema permitirá evaluaciones bidireccionales.

```
Pasajero

↓

Califica

↓

Conductor

------------------------

Conductor

↓

Califica

↓

Pasajero
```

Las dos evaluaciones serán completamente independientes.

Una de ellas no condicionará la otra.

---

# 10. Componentes de una Evaluación

Cada evaluación estará compuesta por varios elementos.

---

## Viaje

Identificador único del viaje asociado.

Toda evaluación deberá pertenecer a un viaje válido.

---

## Evaluador

Persona que realiza la calificación.

Podrá ser:

- pasajero
- conductor

---

## Evaluado

Persona que recibe la calificación.

Podrá ser:

- conductor
- pasajero

---

## Calificación

Valor numérico entre una y cinco estrellas.

```
★☆☆☆☆

★★☆☆☆

★★★☆☆

★★★★☆

★★★★★
```

---

## Comentario

Campo opcional donde el evaluador podrá describir su experiencia.

El comentario complementará la calificación numérica.

---

## Fecha

Momento exacto en que fue registrada la evaluación.

Todas las fechas serán almacenadas en UTC.

---

# 11. Ventana de Evaluación

Las evaluaciones no permanecerán disponibles indefinidamente.

Cada viaje dispondrá de una ventana configurable para ser calificado.

Ejemplo.

```
Viaje Finalizado

↓

24 horas

↓

Evaluación Disponible

↓

Expira
```

El tiempo máximo podrá modificarse desde el Administration Domain.

---

# 12. Estados de una Evaluación

Toda evaluación recorrerá un ciclo de vida.

```
PENDING

↓

AVAILABLE

↓

COMPLETED
```

Si expira el período permitido.

```
AVAILABLE

↓

EXPIRED
```

Una vez completada, la evaluación nunca podrá modificarse.

---

# 13. Restricciones de Evaluación

Con el objetivo de evitar fraudes, el sistema aplicará las siguientes restricciones.

---

## Una evaluación por viaje

Cada participante podrá calificar únicamente una vez por cada viaje.

---

## Sin duplicados

No será posible registrar múltiples evaluaciones para el mismo viaje y el mismo evaluador.

---

## Solo viajes finalizados

Únicamente podrán calificarse viajes cuyo estado sea:

```
COMPLETED
```

Los viajes cancelados no generarán evaluaciones.

---

## Identidad validada

Solo podrán evaluar los participantes que realmente hicieron parte del viaje.

No se permitirán evaluaciones de terceros.

---

## Independencia

Las evaluaciones serán privadas mientras ambas partes tengan oportunidad de calificar.

Esto evita influencias entre pasajero y conductor.

Una vez finalizada la ventana de evaluación, el sistema actualizará automáticamente la reputación correspondiente.

---

# 14. Motor de Reputación

El Rating Domain no utilizará únicamente el promedio de estrellas para representar la reputación de un usuario o conductor.

En su lugar, administrará un modelo de reputación que combine diferentes indicadores de comportamiento.

Este enfoque permitirá obtener una valoración más precisa y justa del desempeño histórico de cada participante de la plataforma.

---

# 15. Componentes de la Reputación

La reputación estará compuesta por múltiples indicadores.

Cada uno aportará información diferente sobre la calidad del servicio.

---

## Promedio de Calificaciones

Representa el promedio histórico de todas las evaluaciones recibidas.

Ejemplo.

```
★★★★★

4.93
```

Este indicador será visible para los usuarios.

---

## Número de Viajes

La cantidad de viajes realizados aporta contexto a la reputación.

Ejemplo.

```
★★★★★

4.98

15 viajes
```

no representa el mismo nivel de confianza que

```
★★★★★

4.98

8.250 viajes
```

Por esta razón, ambos indicadores siempre deberán analizarse conjuntamente.

---

## Historial de Evaluaciones

El sistema conservará todas las calificaciones recibidas.

Esto permitirá reconstruir la evolución de la reputación a lo largo del tiempo.

---

## Tendencia

La reputación podrá analizar su evolución.

Ejemplos.

```
En mejora

↓

★★★★★

4.92

→

4.96
```

o

```
En descenso

↓

★★★★★

4.95

→

4.81
```

Este indicador permitirá detectar cambios importantes en el comportamiento.

---

## Consistencia

El sistema podrá identificar si un usuario mantiene una calidad de servicio estable.

Ejemplo.

```
500 viajes

↓

Todas las calificaciones

4.8 - 5.0
```

presentan mayor confiabilidad que

```
500 viajes

↓

Calificaciones

5.0

↓

1.0

↓

5.0

↓

2.0
```

---

# 16. Estadísticas

El Rating Domain generará diferentes indicadores estadísticos.

Ejemplos.

- promedio general
- promedio mensual
- promedio anual
- cantidad de viajes evaluados
- porcentaje de viajes calificados
- cantidad de comentarios
- distribución de estrellas

Estas estadísticas estarán disponibles para otros dominios cuando sea necesario.

---

# 17. Detección de Comportamientos Anómalos

El sistema podrá identificar patrones potencialmente sospechosos.

Ejemplos.

---

## Calificaciones Masivas

```
100 calificaciones

↓

10 minutos
```

Este comportamiento podrá marcarse para revisión.

---

## Patrones Repetitivos

Ejemplo.

```
★★★★★

★★★★★

★★★★★

★★★★★

★★★★★
```

provenientes siempre del mismo grupo de usuarios.

Esto podría indicar un intento de manipulación.

---

## Calificaciones Extremas

Ejemplo.

```
★★★★★

↓

★

↓

★★★★★

↓

★

↓

★★★★★
```

Cambios bruscos y repetitivos podrán generar alertas para el Administration Domain.

---

## Relaciones Repetidas

Si un pasajero y un conductor se califican entre sí de forma inusual durante un número elevado de viajes consecutivos, el sistema podrá marcar el patrón para análisis.

Esto ayuda a detectar posibles intentos de inflar artificialmente la reputación.

---

# 18. Índice de Confiabilidad

Además del promedio de estrellas, el sistema calculará un indicador interno de confiabilidad.

Este índice no será visible para los usuarios.

Su objetivo será ayudar a otros dominios en la toma de decisiones.

El índice podrá considerar variables como:

- cantidad de viajes
- estabilidad de las calificaciones
- antigüedad de la cuenta
- frecuencia de uso
- porcentaje de evaluaciones recibidas
- comportamiento histórico

Este indicador será utilizado principalmente por procesos automáticos de la plataforma.

---

# 19. Integración con el Trip Engine

El Rating Domain suministrará información al Trip Engine para mejorar la asignación de servicios.

La reputación será uno de los múltiples factores considerados durante el proceso de selección de conductores.

Conceptualmente.

```
Trip Engine

↓

Conductores Cercanos

↓

Disponibilidad

↓

Distancia

↓

Tiempo Estimado

↓

Reputación

↓

Asignación
```

La reputación nunca será el único criterio de asignación.

Su función será complementar el algoritmo junto con otras variables operativas.

Esto permitirá mantener un equilibrio entre eficiencia, equidad y calidad del servicio.

---

# 20. Reglas de Negocio

El Rating Domain aplicará un conjunto de reglas que garantizarán la integridad y confiabilidad del sistema de reputación.

---

## Regla 1

Toda calificación deberá estar asociada a un viaje finalizado.

No existirán evaluaciones independientes.

---

## Regla 2

Cada participante podrá emitir únicamente una evaluación por viaje.

No se permitirán modificaciones posteriores.

---

## Regla 3

Las evaluaciones únicamente podrán realizarse dentro de la ventana de tiempo definida por la plataforma.

Una vez vencido dicho período, la evaluación expirará automáticamente.

---

## Regla 4

Las calificaciones siempre serán mutuas e independientes.

La evaluación realizada por un pasajero nunca condicionará la evaluación del conductor.

---

## Regla 5

Toda evaluación registrada actualizará automáticamente la reputación histórica del participante evaluado.

---

## Regla 6

El promedio de estrellas nunca será el único indicador utilizado para representar la reputación.

El sistema utilizará múltiples métricas para construir una valoración más precisa.

---

## Regla 7

Toda actividad sospechosa detectada por el sistema podrá generar alertas para el Administration Domain.

---

## Regla 8

Las estadísticas históricas nunca deberán perderse.

Toda evaluación permanecerá disponible para procesos de consulta, análisis y auditoría.

---

# 21. Integración con otros Dominios

El Rating Domain interactúa con varios dominios de la plataforma.

Su comunicación será siempre desacoplada.

---

## Integración con Trip Domain

El Trip Domain habilitará automáticamente las evaluaciones cuando un viaje cambie al estado:

```
COMPLETED
```

Una vez habilitada la evaluación, el Rating Domain administrará completamente el proceso.

---

## Integración con Driver Domain

El Driver Domain consultará la reputación del conductor para mostrarla dentro de su perfil.

También podrá utilizar indicadores estadísticos para presentar información de desempeño.

---

## Integración con Users Domain

Los pasajeros también dispondrán de una reputación histórica.

Esto permitirá mejorar la convivencia entre ambas partes de la plataforma.

---

## Integración con Notification Domain

El Notification Domain enviará recordatorios como:

- califica tu viaje
- aún puedes evaluar al conductor
- evaluación próxima a expirar

Una vez registrada la evaluación, también podrá confirmar su recepción.

---

## Integración con Audit Domain

Toda evaluación registrada generará un evento de auditoría.

Ejemplos.

- evaluación creada
- ventana expirada
- comentario registrado
- cálculo de reputación actualizado

Esto permitirá reconstruir completamente el historial de reputación de la plataforma.

---

## Integración con Administration Domain

El Administration Domain permitirá:

- consultar evaluaciones
- investigar reclamaciones
- generar reportes
- analizar estadísticas
- detectar comportamientos anómalos

Las evaluaciones no podrán modificarse directamente desde el panel administrativo.

Cualquier intervención deberá quedar registrada por el Audit Domain.

---

## Integración con Trip Engine

El Trip Engine podrá consultar el Rating Domain para obtener indicadores de reputación.

Sin embargo, la reputación representará únicamente uno de los múltiples factores considerados durante el proceso de asignación.

---

# 22. Operational Score (Preparación Futura)

Con el objetivo de optimizar el proceso de asignación de viajes, la plataforma podrá incorporar un indicador interno denominado **Operational Score**.

Este valor no será visible para usuarios ni conductores.

Su finalidad será proporcionar una medida integral del desempeño operativo de cada conductor.

Conceptualmente podrá construirse a partir de variables como:

- reputación histórica
- porcentaje de aceptación de viajes
- puntualidad
- cancelaciones
- documentación vigente
- actividad reciente
- disponibilidad
- incidencias registradas

```
Operational Score

↓

Reputación

+

Aceptación

+

Puntualidad

+

Disponibilidad

+

Cumplimiento Documental

↓

Resultado
```

Este indicador será utilizado exclusivamente por procesos automáticos del Trip Engine.

La fórmula exacta podrá evolucionar conforme crezca la plataforma.

---

# 23. Roadmap del Dominio

El Rating Domain ha sido diseñado para evolucionar junto con la plataforma.

Entre las funcionalidades previstas para futuras versiones se encuentran las siguientes.

---

## Reputación Inteligente

Incorporación de modelos de análisis que permitan detectar automáticamente cambios significativos en el comportamiento de usuarios y conductores.

---

## Comentarios Clasificados

Los comentarios podrán organizarse mediante categorías.

Ejemplos.

- puntualidad
- limpieza
- conducción
- amabilidad
- seguridad

Esto facilitará la generación de estadísticas más precisas.

---

## Análisis mediante Inteligencia Artificial

La plataforma podrá utilizar modelos de IA para identificar tendencias dentro de los comentarios escritos.

Ejemplos.

- sentimiento positivo
- sentimiento negativo
- temas recurrentes
- recomendaciones automáticas

---

## Gamificación

Se podrán implementar reconocimientos como:

- conductor destacado
- conductor ejemplar
- excelente pasajero
- insignias
- niveles de reputación

Con el objetivo de incentivar un mejor comportamiento dentro de la plataforma.

---

# 24. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------|--------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Creación inicial del Rating Domain |

---

# Conclusión

El Rating Domain constituye el sistema oficial de reputación de la plataforma Tachi.

Su arquitectura ha sido diseñada para garantizar evaluaciones confiables, transparentes y resistentes a manipulaciones, permitiendo construir una reputación histórica que refleje de manera precisa el comportamiento de usuarios y conductores.

Gracias a su integración con el Trip Engine, el Notification Domain, el Audit Domain y el Administration Domain, la reputación dejará de ser únicamente un promedio de estrellas para convertirse en un elemento estratégico que contribuirá a mejorar la calidad del servicio y la eficiencia operativa de la plataforma.

El diseño presentado proporciona una base sólida para evolucionar hacia modelos avanzados de reputación, análisis inteligente y algoritmos de asignación cada vez más precisos.

---