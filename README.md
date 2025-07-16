# TaskNest

![TaskNest Screenshot](./screenshots/screenshot_01.jpg)

## Español

**TaskNest** es una aplicación web de gestión de tareas estilo Trello, que permite crear tableros, listas y tareas con una interfaz moderna y responsiva. Ideal para organizar tu trabajo o proyectos personales.

## 🚀 Funcionalidades

- ✅ Registro de usuarios con verificación por correo electrónico
- 🔐 Autenticación segura
- 📌 Crear múltiples tableros
- 📝 Crear listas dentro de los tableros y agregar tareas
- ✔️ Marcar tareas como completadas
- 🧪 Modo local sin necesidad de registro (usa localStorage)
- 🎨 Interfaz responsiva y moderna
- 🌙 Soporte para modo oscuro (si aplica)

## 🛠️ Tecnologías utilizadas

- **Laravel** (backend)
- **Inertia.js** (puente entre Laravel y React)
- **React** (frontend)
- **Tailwind CSS** (estilos)
- **SweetAlert2** (alertas e inputs modales)

## 📦 Instalación local

1. Clona el repositorio

```bash
    git clone https://github.com/Pex-Dev/TaskNest.git
```

2. Instalar dependencias

```bash
    composer install
    npm install
```

3. Crea tu archivo .env

```bash
    cp .env.example .env
    php artisan key:generate
```

4. Configura tu base de datos y APP_URL en .env
5. Ejecuta las migraciones

```bash
    php artisan migrate
```

6. Levanta el servidor

```bash
    composer run dev
```
