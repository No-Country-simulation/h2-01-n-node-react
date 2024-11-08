# WAKI API

WAKI API es una plataforma para gestionar predicciones deportivas, con funcionalidades avanzadas de ranking, suscripción premium y autenticación. Los usuarios pueden realizar predicciones sobre partidos y goles de jugadores, participar en un sistema de divisiones con tres niveles (Gold, Silver y Bronze), y disfrutar de beneficios exclusivos como el doble de predicciones disponibles a través de una suscripción premium. Además, la API integra con MercadoPago para la gestión de pagos y suscripciones.

Para explorar la documentación completa de la API, consulta nuestra [documentación](https://waki.onrender.com/api/docs).

# Funcionalidades

- Predicciones: realización de predicciones simples y combinadas y su correspondiente resolución. Las predicciones posibles son sobre resultado de partidos y gol por jugador. La resolución de predicciones incluye el cálculo de puntaje obtenido por el usuario en caso de haber acertado.
- Notificaciones: el usuario es notificado cuando acierta/falla una predicción.
- Sistema de divisiones: 3 divisiones (Gold, Silver y Bronze) donde el usuario se va a ubicar segun los puntos acumulados que tiene. Incluye rank reset para resetear las divisiones (fecha determinada por el admin).
- Subscripción premium y MercadoPago: el usuario premium cuenta con el doble cantidad de predicciones disponibles. También cuenta con la integración de mercadopago.
- Auth: autenticación simple con uso de jwt y sistema de roles (User, Premium y Admin).
- Administrador: funcionalidades de usuario administrador (rank reset, precio de premium, etc).

# Futuras Funcionalidades

- Quema de tokens
- Expansión funcionalidad de tokens y scouting de players

# Cron Jobs

- Fn "updateFixtures": 1 vez por dia para actualizar partidos liga profesional Argentina hasta fin de año.
- Fn "solvePredictionsOfRecentlyCompletedFixtures": todos los días a las 45 minutos de cada hora, entre las 09:45 y las 23:45, para la resolución de predicciones y cierre de partidos.
- Fn "updateUserRanks": 1 vez por dia para actualizar divisiones.
- Fn "resetRanks": 1 vez por dia para chequear si se tiene que resetear divisiones o no.
- Fn "checkUsersExpireDate": 1 vez por dia para chequear si hay algun usuario premium que se le vence la subscripción.

# Aspectos a mejorar

## Redis

Como se comentó en la sección anterior, actualmente el servidor, mediante cron jobs, hace pedidos a la api externa de API-Football para obtener distintos datos, se guardan en la base de datos y luego son devueltos al cliente. Si bien se optó por esta modalidad debido al límite de peticiones al inicio del hackathon, hay muchos datos que se guardan en la base de datos que no son necesarios, así como también peticiones excesivas a la api externa para obtener datos que quizás le resultan de poca utilidad a los usuarios. Por eso sería ideal adoptar una tecnología como Redis, que permite guardar respuestas de la api externa por un tiempo determinado, y actualizar los datos según la necesidad de los usuarios.

## Agregar ligas

Una vez que se haya adoptado Redis, se podrían almacenar en la base de datos únicamente las ligas con sus correspondientes "IDs" (provenientes de API-Football). Esto permitiría restringir el acceso solo a los datos de las ligas almacenadas y no a otras.

## Partidos live (SSE)

El servidor ya usa Gateways que soporta websockets y/o socket.io "out-of-the-box" para manejar lo que son las notificaciones. Se podría utilizar esto para actualizar en tiempo real los partidos que se están jugando en vivo, o se podría optar por el uso de [SSE](https://docs.nestjs.com/techniques/server-sent-events).
