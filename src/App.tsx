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

interface ChatListResponse {
  ids_sesion: string[];
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
  const [chatList, setChatList] = useState<Array<{ session_id: string; name: string }>>([]);
  const [isLoadingChatList, setIsLoadingChatList] = useState(true);
  const userId = 4356;
  const sessionId = "3980a847-d6fa-4ad3-9602-08f65bd18f96";

  // Load chat history for current session
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

  // Load chat list for user
  useEffect(() => {
    const loadChatList = async () => {
      try {
        const url = `https://n8nnew.mpajujuy.gob.ar/webhook/4bdfa13f-8b20-450e-97c2-652092b739d4/chatbot/conversacion/recuperar-por-id-usuario/${userId}`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Error al cargar lista de chats: ${response.status}`);
          setIsLoadingChatList(false);
          return;
        }

        const chatListResponse: ChatListResponse = await response.json();
        // Transform response to {session_id: string, name: string}[]
        const transformedChatList = chatListResponse.ids_sesion.map((id_sesion) => ({
          session_id: id_sesion,
          name: id_sesion,
        }));
        setChatList(transformedChatList);
      } catch (error) {
        console.error("Error al cargar lista de chats:", error);
      } finally {
        setIsLoadingChatList(false);
      }
    };

    loadChatList();
  }, [userId]);

  if (isLoadingHistory || isLoadingChatList) {
    return <div>Cargando historial...</div>;
  }

  return (
    <MyRuntimeProvider 
      apiUrl="https://n8nnew.mpajujuy.gob.ar/webhook/chatbot"
      userId={userId}
      sessionId={sessionId}
      chatApi={{
        chatHistory: chatHistory,
      }}
    >
      <AssistantModal
        chatList={chatList}
        selectedSessionId={sessionId}
        onNewChat={() => {
          console.log("New chat clicked");
        }}
        onChatSelect={(selectedSessionId) => {
          console.log("Chat selected:", selectedSessionId);
        }}
      />
    </MyRuntimeProvider>
  );
}

export default App