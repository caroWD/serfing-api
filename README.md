# Serfing API

## Pre-requisitos

### Instalar [PNPM](https://pnpm.io/es/installation)

- Windows o Linux

```bash
npm install --global corepack@latest
corepack enable pnpm
```

- macOS

```bash
brew install pnpm
```

### Clonar el repositorio

- [Tutorial](https://docs.github.com/es/repositories/creating-and-managing-repositories/cloning-a-repository)

- Paso a paso:

```bash
# Cambiar directorio
cd <path-your-project-directory>

# Git clone
git clone https://github.com/caroWD/serfing-api.git

# Cambiar directorio
cd serfing-api
```

### Instalar dependencias

```bash
pnpm install
```

## Definir variables de entorno

1. Crear el archivo ".env"

```bash
NODE_ENV=development
```

2. Crea el archivo ".env.development.local"

```bash
NODE_ENV=development
PORT=3000
ACCEPTED_ORIGINS=http://localhost:1234,http://localhost:5678
SQLITE_DB_FILE_NAME=file:path/to/db-file.db
USER_ADMIN_PASSWORD=Pass123/*
USER_SUPPORT_PASSWORD=Pass456/*
SALT_ROUNDS=10
MYSQL_DB_HOST=localhost
MYSQL_DB_USER=root
MYSQL_DB_PASSWORD=root
MYSQL_DB=name_db
```

3. Crear el archivo ".env.production.local"

```bash
NODE_ENV=production
PORT=4000
ACCEPTED_ORIGINS=http://localhost:1234,http://localhost:5678
SQLITE_DB_FILE_NAME=file:path/to/db-file.db
USER_ADMIN_PASSWORD=Pass123/*
USER_SUPPORT_PASSWORD=Pass456/*
SALT_ROUNDS=10
MYSQL_DB_HOST=localhost
MYSQL_DB_USER=root
MYSQL_DB_PASSWORD=root
MYSQL_DB=name_db
```

## Instructivo para ejecutar

1. Crear base de datos local

```bash
pnpm drizzle
```

2. Compilar API

```bash
pnpm build
```

3. Lanzar API

```bash
pnpm dev
```
