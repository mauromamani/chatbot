# @mauromamani/ai-chatbot

Una librería de componentes React para crear chatbots con interfaz de usuario moderna, construida con Assistant UI y Tailwind CSS.

## Instalación

Esta librería está publicada en GitHub Packages. Para instalarla, necesitas configurar npm para usar GitHub Packages como registro.

### Configuración inicial (solo la primera vez)

1. **Crear un Personal Access Token (PAT) en GitHub:**
   - Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Genera un nuevo token con permisos `read:packages` (y `repo` si el repositorio es privado)
   - Copia el token generado

2. **Configurar npm para usar GitHub Packages:**

   Crea o edita el archivo `.npmrc` en la raíz de tu proyecto (donde está el `package.json`):

   ```
   @mauromamani:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=TU_TOKEN_AQUI
   ```

3. **Instalar la librería:**

   ```bash
   npm install @mauromamani/ai-chatbot
   ```

### Requisitos de acceso

- Debes tener acceso al repositorio privado `mauromamani/chatbot` en GitHub
- Tu token debe tener permisos `read:packages` (y `repo` si el repositorio es privado)

## Publicación en GitHub Packages

Para publicar nuevas versiones de la librería en GitHub Packages:

### Configuración inicial (solo la primera vez)

1. **Crear un Personal Access Token (PAT) en GitHub:**
   - Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Genera un nuevo token con permisos `write:packages` y `repo`
   - Copia el token generado

2. **Configurar el archivo `.npmrc` local:**

   Copia el archivo `.npmrc.example` a `.npmrc`:
   ```bash
   cp .npmrc.example .npmrc
   ```

   O crea manualmente `.npmrc` en la raíz del proyecto:
   ```
   @mauromamani:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

   **⚠️ Importante:** El archivo `.npmrc` está en `.gitignore` y NO debe subirse al repositorio.

3. **Configurar la variable de entorno:**

   ```bash
   # Windows (PowerShell)
   $env:GITHUB_TOKEN="tu_token_aqui"
   
   # Windows (CMD)
   set GITHUB_TOKEN=tu_token_aqui
   
   # Linux/Mac
   export GITHUB_TOKEN=tu_token_aqui
   ```

### Publicar una nueva versión

1. **Actualizar la versión en `package.json`:**
   ```bash
   npm version patch  # Para 1.0.0 → 1.0.1
   npm version minor  # Para 1.0.0 → 1.1.0
   npm version major  # Para 1.0.0 → 2.0.0
   ```

2. **Construir y publicar:**
   ```bash
   npm run build
   npm publish
   ```

   El script `prepublishOnly` ejecutará automáticamente el build antes de publicar.

3. **Verificar la publicación:**

   Ve a `https://github.com/mauromamani/chatbot/packages` para ver el paquete publicado.

## Publicación local (para desarrollo)

Para usar esta librería localmente en tu proyecto antes de publicarla:

1. Construye la librería:
```bash
npm run build
```

2. En tu proyecto, instala desde la carpeta local:
```bash
npm install file:../ruta/a/chatbot
```

O crea un paquete tarball:
```bash
npm pack
```

Y luego instálalo:
```bash
npm install ./mauromamani-ai-chatbot-1.0.0.tgz
```

## Licencia

MIT
