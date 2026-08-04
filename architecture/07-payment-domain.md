# 07. Payment Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 07-payment-domain.md |
| Versión | 2.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Payment Domain constituye el motor financiero de la plataforma Tachi.

Su responsabilidad consiste en administrar todos los movimientos económicos generados durante la operación de la plataforma, garantizando integridad, trazabilidad y consistencia sobre cada transacción registrada.

Este dominio no se limita únicamente al procesamiento de pagos.

También administra las cuentas financieras de los conductores, las comisiones de la plataforma, las liquidaciones, los retiros, las recargas, las conciliaciones y el historial completo de movimientos económicos.

Toda operación monetaria realizada dentro de Tachi deberá pasar por este dominio.

---

# 2. Objetivos

Los principales objetivos del Payment Domain son:

- administrar los pagos de los viajes
- registrar todas las transacciones económicas
- administrar las cuentas financieras de los conductores
- calcular las liquidaciones
- registrar las comisiones de la plataforma
- administrar retiros
- administrar recargas
- mantener un historial financiero completo
- permitir conciliaciones financieras
- garantizar trazabilidad económica
- integrarse con pasarelas de pago
- soportar múltiples métodos de pago
- proporcionar información financiera al Administration Domain

---

# 3. Responsabilidades

El Payment Domain será responsable de:

- registrar pagos
- registrar cobros
- registrar comisiones
- administrar wallets
- administrar cuentas financieras
- registrar movimientos
- administrar retiros
- administrar recargas
- calcular saldos
- administrar liquidaciones
- registrar conciliaciones
- consultar historial financiero

No será responsable de:

- calcular tarifas
- administrar promociones
- definir porcentajes de comisión
- definir políticas comerciales
- autenticar usuarios
- asignar viajes

Las reglas comerciales serán administradas por el Administration Domain.

El cálculo del precio del viaje será responsabilidad del Pricing Domain.

---

# 4. Principios del Dominio

El Payment Domain ha sido diseñado siguiendo los siguientes principios.

---

## Trazabilidad

Toda operación financiera deberá quedar registrada.

Nunca existirá dinero sin un movimiento asociado.

---

## Inmutabilidad

Los movimientos financieros nunca serán modificados.

En caso de requerir una corrección, se registrará un nuevo movimiento compensatorio.

---

## Consistencia

Todo saldo deberá poder reconstruirse únicamente a partir del historial de movimientos.

El saldo nunca será la fuente principal de información.

---

## Desacoplamiento

El dominio financiero nunca decidirá reglas comerciales.

Las políticas económicas serán consultadas al Administration Domain.

---

## Escalabilidad

El dominio deberá soportar la incorporación de nuevos métodos de pago, nuevas pasarelas y nuevos productos financieros sin modificar la arquitectura existente.

---

# 5. Conceptos del Dominio

Para comprender el funcionamiento del Payment Domain se definen los siguientes conceptos.

---

## Driver Financial Account

Representa la cuenta financiera oficial de un conductor dentro de la plataforma.

En ella se consolidan todos los movimientos económicos asociados a su operación.

Esta cuenta constituye la fuente oficial para calcular saldos, retiros, deudas y liquidaciones.

---

## Wallet

La Wallet representa la interfaz visible de la cuenta financiera del conductor.

Desde ella el conductor podrá consultar:

- saldo disponible
- saldo pendiente
- historial
- retiros
- recargas
- movimientos

La Wallet no almacena dinero de forma independiente.

Su saldo se calcula a partir de la cuenta financiera.

---

# 6. Arquitectura Financiera

El Payment Domain administra todas las operaciones económicas mediante una arquitectura basada en cuentas financieras y movimientos contables.

Conceptualmente.

```
Payment Domain

        │

        ▼

Driver Financial Account

        │

        ▼

Ledger Financiero

        │

        ▼

Movimientos

        │

        ▼

Saldo
```

La cuenta financiera constituye la fuente oficial de información económica.

La Wallet únicamente representa una vista simplificada para el conductor.

---

# 7. Arquitectura de la Cuenta Financiera

Cada conductor dispondrá de una única cuenta financiera.

Esta cuenta será creada automáticamente cuando el conductor sea aprobado por la plataforma.

Conceptualmente.

```
Conductor

↓

Driver Financial Account

↓

Ledger

↓

Movimientos

↓

Saldo
```

Toda operación económica estará asociada a esta cuenta.

Nunca existirán movimientos sin una cuenta financiera asociada.

---

# 8. Wallet

La Wallet representa la interfaz mediante la cual el conductor consulta el estado de su cuenta financiera.

Permitirá visualizar.

- saldo disponible
- saldo pendiente
- movimientos
- retiros
- recargas
- liquidaciones
- comisiones
- bonificaciones
- promociones

La Wallet no constituye la fuente oficial de información.

Su contenido siempre será generado a partir del Ledger Financiero.

---

# 9. Ledger Financiero

El Ledger constituye el libro contable oficial de la plataforma.

Su responsabilidad consiste en almacenar cronológicamente todos los movimientos económicos realizados sobre una cuenta financiera.

Conceptualmente.

```
Cuenta Financiera

↓

Movimiento

↓

Movimiento

↓

Movimiento

↓

Movimiento

↓

Movimiento

↓

Saldo
```

El saldo nunca será registrado manualmente.

Siempre será el resultado de la suma de todos los movimientos registrados.

---

# 10. Movimientos Financieros

Todo cambio económico será representado mediante un movimiento financiero.

Los movimientos son inmutables.

Nunca podrán modificarse.

En caso de requerir una corrección se registrará un nuevo movimiento compensatorio.

Cada movimiento contendrá información como.

- identificador
- cuenta financiera
- tipo
- valor
- moneda
- fecha
- referencia
- descripción
- estado
- origen

---

# 11. Tipos de Movimiento

El sistema contemplará inicialmente los siguientes tipos.

```
TRIP_PAYMENT
```

Ingreso generado por un viaje pagado electrónicamente.

---

```
CASH_COMMISSION
```

Comisión pendiente generada por un viaje pagado en efectivo.

---

```
CARD_COMMISSION
```

Comisión descontada automáticamente de un pago electrónico.

---

```
WITHDRAWAL
```

Retiro realizado por el conductor.

---

```
DEPOSIT
```

Recarga realizada por el conductor.

---

```
BONUS
```

Bonificación otorgada por la plataforma.

---

```
PROMOTION
```

Beneficio económico generado por campañas promocionales.

---

```
PENALTY
```

Descuento aplicado por incumplimientos definidos por las políticas de la plataforma.

---

```
REFUND
```

Devolución de dinero.

---

```
ADJUSTMENT
```

Movimiento excepcional utilizado únicamente para procesos administrativos autorizados.

Toda utilización de este tipo deberá quedar registrada por el Audit Domain.

---

# 12. Cálculo del Saldo

El saldo disponible será calculado exclusivamente mediante la suma de todos los movimientos registrados.

Conceptualmente.

```
Saldo

=

Σ Movimientos
```

El sistema nunca actualizará directamente un campo de saldo como fuente principal.

Esto garantiza trazabilidad completa y facilita los procesos de auditoría y conciliación.

---

# 13. Estados del Dinero

No todo el dinero tendrá disponibilidad inmediata.

Por esta razón la cuenta financiera manejará diferentes estados.

---

## Saldo Disponible

Representa el dinero que puede ser utilizado inmediatamente por el conductor.

Podrá retirarse o utilizarse para compensar obligaciones pendientes.

---

## Saldo Pendiente

Representa operaciones que aún no han sido confirmadas.

Ejemplos.

- pagos electrónicos pendientes de confirmación
- transferencias en proceso
- conciliaciones bancarias
- validaciones de pasarelas de pago

Una vez confirmadas, estas operaciones pasarán automáticamente al saldo disponible.

---

# 14. Métodos de Pago

El Payment Domain soportará múltiples métodos de pago.

Todos los métodos compartirán una misma arquitectura financiera.

Inicialmente se contemplan los siguientes.

---

## Pago Electrónico

El pasajero realiza el pago mediante una pasarela de pago integrada con la plataforma.

Flujo.

```
Pasajero

↓

Pasarela de Pago

↓

Payment Domain

↓

Driver Financial Account

↓

Wallet
```

En este escenario la plataforma recibe el dinero directamente.

La comisión correspondiente será descontada automáticamente antes de acreditar el saldo al conductor.

---

## Pago en Efectivo

El pasajero entrega el dinero directamente al conductor.

Flujo.

```
Pasajero

↓

Conductor

↓

Pago en Efectivo
```

En este caso la plataforma no recibe dinero directamente.

Sin embargo, la comisión correspondiente seguirá siendo registrada dentro de la cuenta financiera del conductor.

La comisión generará un movimiento negativo que disminuirá el saldo disponible de la cuenta financiera.

Este mecanismo permitirá mantener un control económico unificado independientemente del método de pago utilizado.

---

# 15. Comisión de la Plataforma

La comisión representa el ingreso económico generado por la plataforma por la intermediación del servicio.

El Payment Domain nunca calculará el porcentaje de comisión.

La comisión será recibida desde el Pricing Domain, el cual aplicará la política comercial vigente definida por el Administration Domain.

Conceptualmente.

```
Administration Domain

↓

Política Comercial

↓

Pricing Domain

↓

Valor Comisión

↓

Payment Domain
```

El Payment Domain únicamente registrará la comisión y ejecutará los movimientos financieros correspondientes.

---

# 16. Límites Negativos

La cuenta financiera podrá operar con saldo negativo dentro de límites definidos por la plataforma.

Ejemplo.

```
Límite Negativo

-$50.000
```

Mientras el saldo permanezca dentro del límite permitido, el conductor podrá continuar aceptando viajes.

Si el saldo supera el límite configurado, el conductor será suspendido temporalmente para recibir nuevos servicios.

Conceptualmente.

```
Saldo

↓

-$45.000

↓

Puede operar

------------------------

Saldo

↓

-$55.000

↓

Suspendido
```

El límite negativo será completamente configurable desde el Administration Domain.

Incluso podrá variar según:

- ciudad
- categoría del conductor
- plan de suscripción
- campañas comerciales

---

# 17. Recargas

Las recargas permitirán incrementar el saldo disponible de la cuenta financiera.

Podrán realizarse mediante diferentes mecanismos.

Ejemplos.

- PSE
- transferencia bancaria
- Nequi
- Daviplata
- billeteras digitales
- futuras integraciones

Flujo.

```
Conductor

↓

Recarga

↓

Pasarela

↓

Payment Domain

↓

Wallet

↓

Saldo Disponible
```

Cada recarga generará un movimiento financiero independiente.

---

# 18. Retiros

Los conductores podrán solicitar retiros del saldo disponible de su cuenta financiera.

Proceso.

```
Wallet

↓

Solicitar Retiro

↓

Validación

↓

Transferencia

↓

Completado
```

Un retiro únicamente podrá realizarse si existe saldo suficiente.

Cada retiro generará un movimiento financiero y quedará registrado para procesos de auditoría y conciliación.

---

# 19. Liquidaciones

La liquidación representa el proceso mediante el cual la plataforma determina el valor económico que corresponde al conductor.

La liquidación podrá realizarse en diferentes modalidades.

Ejemplos.

- inmediata
- diaria
- semanal
- quincenal
- personalizada

La modalidad será configurable desde el Administration Domain.

Durante la liquidación podrán considerarse.

- ingresos por viajes
- comisiones
- promociones
- bonificaciones
- penalizaciones
- ajustes
- retiros pendientes

El resultado final será acreditado o ajustado dentro de la cuenta financiera del conductor.

---

# 20. Conciliación Financiera

La conciliación financiera garantiza que todas las operaciones económicas registradas dentro de la plataforma coincidan con las operaciones ejecutadas por las entidades externas.

Entre ellas.

- pasarelas de pago
- entidades bancarias
- billeteras digitales
- transferencias
- sistemas de recaudo

La conciliación permitirá detectar diferencias antes de afectar el saldo de los conductores o de la plataforma.

---

## Objetivos

La conciliación permitirá.

- validar pagos
- validar retiros
- validar recargas
- detectar errores
- detectar duplicados
- detectar pagos pendientes
- detectar operaciones rechazadas

---

## Flujo General

```
Pasarela

↓

Confirmación

↓

Payment Domain

↓

Conciliación

↓

Ledger

↓

Wallet
```

Ningún movimiento económico será considerado definitivo hasta completar su proceso de conciliación.

---

# 21. Estados Financieros

Cada movimiento financiero dispondrá de un estado durante su ciclo de vida.

Inicialmente se contemplan los siguientes.

```
PENDING
```

Movimiento creado.

Aún no confirmado.

---

```
PROCESSING
```

La operación se encuentra siendo procesada.

---

```
COMPLETED
```

La operación fue ejecutada exitosamente.

---

```
FAILED
```

La operación no pudo completarse.

---

```
CANCELLED
```

La operación fue cancelada.

---

```
REVERSED
```

Movimiento revertido mediante una operación compensatoria.

Nunca mediante modificación directa.

---

# 22. Integración con otros Dominios

El Payment Domain trabaja de manera coordinada con el resto de la plataforma.

---

## Pricing Domain

Recibe.

- valor del viaje
- valor de la comisión
- impuestos
- promociones aplicadas

Nunca calcula estos valores.

---

## Administration Domain

Consulta.

- políticas comerciales
- límites negativos
- reglas de retiro
- reglas de liquidación
- configuraciones financieras

Nunca modifica estas políticas.

---

## Trip Domain

Recibe.

- viaje finalizado
- valor del viaje
- método de pago
- conductor
- pasajero

A partir de esta información inicia el proceso financiero.

---

## Audit Domain

Toda operación económica deberá generar automáticamente un evento de auditoría.

Ejemplos.

- recargas
- retiros
- liquidaciones
- ajustes
- reversos
- pagos
- modificaciones administrativas

---

## Notification Domain

Permitirá informar automáticamente eventos financieros.

Ejemplos.

```
Retiro aprobado

↓

Notificación
```

```
Recarga confirmada

↓

Notificación
```

```
Saldo negativo

↓

Notificación
```

```
Nueva liquidación

↓

Notificación
```

---

# 23. Seguridad Financiera

Toda operación financiera deberá cumplir los siguientes principios.

---

## Idempotencia

Una operación nunca podrá ejecutarse dos veces.

Si una solicitud es repetida accidentalmente, el sistema deberá reconocerla y devolver el mismo resultado.

---

## Atomicidad

Cada operación financiera será ejecutada completamente o no será ejecutada.

Nunca existirán estados parcialmente aplicados.

---

## Integridad

Toda transacción deberá mantener la consistencia de la información financiera.

---

## Auditoría Obligatoria

Todas las operaciones económicas deberán quedar registradas.

No existirán excepciones.

---

## Trazabilidad

Cada movimiento deberá poder reconstruirse completamente desde su origen hasta su estado final.

---

# 24. Roadmap Financiero

El Payment Domain ha sido diseñado para crecer progresivamente.

Entre las funcionalidades previstas se encuentran.

- múltiples billeteras
- wallet para pasajeros
- wallet empresarial
- programas de fidelización
- cashback
- créditos para conductores
- préstamos
- pagos internacionales
- múltiples monedas
- integración con Open Finance
- pagos instantáneos
- conciliación automática bancaria
- inteligencia financiera

---

# 25. Arquitectura General del Dominio

El Payment Domain ha sido diseñado como un motor financiero desacoplado de los demás dominios de la plataforma.

Su responsabilidad consiste en administrar todas las operaciones económicas generadas por Tachi, manteniendo la integridad financiera sin depender de la lógica interna de otros componentes.

Conceptualmente.

```
                     Payment Domain

                            │

      ┌─────────────────────┼─────────────────────┐

      │                     │                     │

 Driver Financial     Payments Engine      Settlement Engine
      Account

      │                     │                     │

      ├──────────────┬──────┴──────┬──────────────┤

      │              │             │              │

    Wallet        Ledger      Withdrawals     Deposits

      │

 Financial Transactions

      │

 Financial Reports
```

Cada componente posee una responsabilidad claramente definida.

La comunicación entre ellos se realizará mediante servicios internos del dominio.

---

# 26. Filosofía del Dominio

El Payment Domain fue diseñado siguiendo principios utilizados en plataformas financieras modernas.

Entre ellos.

- separación de responsabilidades
- trazabilidad completa
- movimientos inmutables
- conciliación financiera
- consistencia transaccional
- escalabilidad
- auditoría permanente

El objetivo consiste en garantizar que ningún movimiento económico pueda perderse, duplicarse o modificarse sin dejar evidencia.

---

# 27. Beneficios de la Arquitectura

La arquitectura propuesta ofrece múltiples ventajas.

## Para los Conductores

- consulta clara del saldo disponible
- historial financiero completo
- cálculo automático de comisiones
- proyección estimada de ingresos
- transparencia en las liquidaciones
- reducción de errores administrativos

---

## Para la Plataforma

- control financiero centralizado
- conciliación simplificada
- auditoría completa
- facilidad para incorporar nuevos métodos de pago
- integración con nuevas pasarelas
- soporte para múltiples modelos comerciales

---

## Para el Equipo de Desarrollo

- arquitectura desacoplada
- componentes reutilizables
- facilidad de pruebas
- escalabilidad horizontal
- mantenimiento simplificado

---

# 28. Evolución del Dominio

El diseño del Payment Domain permitirá incorporar nuevas funcionalidades sin modificar la arquitectura principal.

Entre ellas.

- múltiples wallets por usuario
- billeteras para pasajeros
- cuentas empresariales
- programas de fidelización
- recompensas automáticas
- cashback
- anticipos de ingresos
- créditos para conductores
- seguros
- pagos internacionales
- múltiples monedas
- Open Finance
- Open Banking
- integraciones bancarias directas

La arquitectura actual ha sido preparada para soportar esta evolución de manera progresiva.

---

# 29. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|-------------------------------------------|
| 2.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Rediseño completo del Payment Domain como motor financiero de Tachi. |

---

# Conclusión

El Payment Domain constituye el motor financiero de la plataforma Tachi.

Su responsabilidad va mucho más allá del procesamiento de pagos.

Administra de forma centralizada las cuentas financieras de los conductores, las wallets, las comisiones, las liquidaciones, los retiros, las recargas y el historial completo de movimientos económicos.

Gracias a una arquitectura basada en cuentas financieras, ledger contable y movimientos inmutables, el dominio garantiza trazabilidad, consistencia y escalabilidad para soportar el crecimiento de la plataforma.

El diseño desacoplado respecto al Pricing Domain, Administration Domain, Trip Domain y Audit Domain permite evolucionar el modelo de negocio sin afectar la estabilidad del sistema financiero.

Esta arquitectura establece las bases para que Tachi evolucione desde un MVP hasta una plataforma de movilidad con capacidades financieras comparables a las utilizadas por las principales plataformas internacionales.

---