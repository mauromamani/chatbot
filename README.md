# @mauromamani/ai-chatbot

Una librería de componentes React para crear chatbots con interfaz de usuario moderna, construida con Assistant UI y Tailwind CSS.

## Instalación

```bash
npm install @mauromamani/ai-chatbot
```

## Uso

### Instalación de dependencias peer

Asegúrate de tener React 18 instalado en tu proyecto:

```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

### Uso básico

```tsx
import { AssistantModal, MyRuntimeProvider } from '@mauromamani/ai-chatbot';
import '@mauromamani/ai-chatbot/style.css';

function App() {
  return (
    <MyRuntimeProvider apiUrl="http://localhost:3001/api/chat">
      <AssistantModal />
    </MyRuntimeProvider>
  );
}
```

### Configuración del API

El componente `MyRuntimeProvider` requiere una URL de API que maneje las solicitudes de chat. La API debe aceptar POST requests con el siguiente formato:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hola"
    }
  ]
}
```

Y debe responder con:

```json
{
  "text": "Respuesta del chatbot"
}
```

### Personalización

Puedes importar componentes UI individuales para personalizar la apariencia:

```tsx
import { Button, Dialog, Avatar } from '@mauromamani/ai-chatbot';
```

### Estilos CSS

Los estilos están incluidos en el paquete y se importan automáticamente cuando importas los componentes. Si necesitas importar los estilos manualmente:

```tsx
import '@mauromamani/ai-chatbot/style.css';
```

**Nota importante sobre Tailwind CSS**: Esta librería usa Tailwind CSS v4 con prefijo `tw:`. Los estilos están compilados en el CSS final, pero si tu proyecto también usa Tailwind CSS, asegúrate de que no haya conflictos. Los estilos de la librería están prefijados con `tw:`, por lo que no deberían interferir con tus estilos personalizados.

## Requisitos

- React ^18.2.0
- React DOM ^18.2.0

## Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Construir librería
npm run build

# Linting
npm run lint
```

## Publicación local (para desarrollo)

Para usar esta librería localmente en tu proyecto antes de publicarla en npm:

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
