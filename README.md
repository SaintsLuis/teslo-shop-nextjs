# Teslo Shop

Teslo Shop es una aplicación de comercio electrónico construida con **Next.js** y **Prisma**. Este proyecto incluye autenticación, gestión de productos, y un sistema de carrito de compras.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías](#tecnologías)
- [Licencia](#licencia)

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/teslo-shop.git
   cd teslo-shop
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia el archivo de configuración `.env.template` y renómbralo a `.env`:

   ```bash
   cp .env.template .env
   ```

4. Levanta la base de datos con Docker:

   ```bash
   docker-compose up -d
   ```

5. Ejecuta las migraciones de Prisma:

   ```bash
   npx prisma migrate dev
   ```

6. Llena la base de datos con datos iniciales (opcional) (solo para desarrollo):

   ```bash
   npm run seed
   ```

7. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Uso

Una vez que el servidor esté corriendo, abre tu navegador y accede a:

```
http://localhost:3000
```

Desde aquí podrás explorar la tienda, gestionar productos y realizar pruebas.

## Tecnologías

Este proyecto utiliza las siguientes tecnologías destacadas:

- **Next.js**: Framework de React para aplicaciones web.
- **Prisma**: ORM para manejar la base de datos.
- **PostgreSQL**: Base de datos relacional.
- **TypeScript**: Tipado estático para JavaScript.
- **Tailwind CSS**: Framework de estilos para diseño responsivo.
- **Zustand**: Librería para manejo de estado.
- **Better Auth**: Autenticación para Next.js.
- **PayPal**: Integración de pagos.
- **React Hook Form**: Manejo de formularios en React.
- **Cloudinary**: Gestión de imágenes y recursos multimedia.
- **Swiper.js**: Carruseles interactivos.
- **Docker**: Contenedores para la base de datos y servicios.

## Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).
