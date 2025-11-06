📦 Instalación del entorno con Docker

Este proyecto utiliza Redis para manejo de colas (BullMQ / Bull / NestJS).

✅ Requisitos

Docker Desktop instalado

Node.js (v18 o superior)

Yarn o npm

✅ Levantar dependencias (Redis)

Ejecuta:

docker compose up -d


Esto levantará:

Servicio	Puerto
Redis	6379

Verificar que está corriendo:

docker compose ps

✅ Apagar servicios
docker compose down

▶️ Ejecutar el proyecto NestJS

Instalar dependencias

npm install


o

yarn


Arrancar en desarrollo:

npm run start:dev

🧪 Probar Redis
redis-cli ping


Debe responder:

PONG
