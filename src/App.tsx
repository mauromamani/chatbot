import { useEffect, useState } from "react";
import { AssistantModal } from "./components/assistant-modal";
import { MyRuntimeProvider } from "./providers/runtime.provider";
import type { ThreadMessage } from "@assistant-ui/react";

// Tipos para los mensajes del backend
interface BackendMessage {
  id: number;
  id_sesion: string;
  mensaje: {
    tipo: "humano" | "ia";
    contenido: string;
  };
  creado: string;
}

interface BackendResponse {
  mensajes: BackendMessage[];
}

// Función adapter para convertir mensajes del backend al formato ThreadMessage
const adaptBackendMessagesToThreadMessages = (
  backendMessages: BackendMessage[]
): ThreadMessage[] => {
  return backendMessages.map((backendMsg) => {
    const role = backendMsg.mensaje.tipo === "humano" ? "user" : "assistant";
    
    if (role === "user") {
      return {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: backendMsg.mensaje.contenido,
          },
        ],
        attachments: [],
        metadata: {
          custom: {},
        },
      } as unknown as ThreadMessage;
    } else {
      return {
        role: "assistant" as const,
        content: [
          {
            type: "text" as const,
            text: backendMsg.mensaje.contenido,
          },
        ],
        status: "complete" as const,
        metadata: {
          custom: {},
        },
      } as unknown as ThreadMessage;
    }
  });
};

function App() {
  const [chatHistory, setChatHistory] = useState<ThreadMessage[] | undefined>(undefined);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const sessionId = "3980a847-d6fa-4ad3-9602-08f65bd18f96";

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const url = `https://n8nnew.mpajujuy.gob.ar/webhook/b57eb0cf-1892-4b54-a479-e99c2792ea77/chatbot/mensaje/recuperar-por-id-sesion/${sessionId}`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Error al cargar historial: ${response.status}`);
          setIsLoadingHistory(false);
          return;
        }

        const backendResponse: BackendResponse = await response.json();
        const threadMessages = adaptBackendMessagesToThreadMessages(backendResponse.mensajes);
        setChatHistory(threadMessages);
      } catch (error) {
        console.error("Error al cargar mensajes históricos:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [sessionId]);

  if (isLoadingHistory) {
    return <div>Cargando historial...</div>;
  }

  return (
    <MyRuntimeProvider 
      apiUrl="https://n8nnew.mpajujuy.gob.ar/webhook/chatbot"
      userId={4356}
      sessionId={sessionId}
      chatApi={{
        chatHistory: chatHistory,
      }}
    >
      <AssistantModal />
    </MyRuntimeProvider>
  );
}

export default App