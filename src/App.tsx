import { useCallback, useEffect, useState } from "react";
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

interface Conversacion {
  id: number;
  id_sesion: string;
  titulo: string;
}

interface ChatListResponse {
  conversaciones: Conversacion[];
}

// SessionStorage key for storing session ID
const SESSION_STORAGE_KEY = "chatbot_session_id";

// Function to get session ID from sessionStorage or generate a new one
const getInitialSessionId = (): string => {
  const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (storedSessionId) {
    return storedSessionId;
  }
  // If no session ID exists, generate a new one (new chat)
  const newSessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  return newSessionId;
};

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
  const [chatList, setChatList] = useState<Array<{ session_id: string; name: string, id: number }>>([]);
  const [isLoadingChatList, setIsLoadingChatList] = useState(true);
  const userId = 4356;
  const [sessionId, setSessionId] = useState<string>(() => getInitialSessionId());

  // Function to load chat history for a given session
  const loadHistory = useCallback(async (targetSessionId: string) => {
    setIsLoadingHistory(true);
    try {
      const url = `https://n8nnew.mpajujuy.gob.ar/webhook/b57eb0cf-1892-4b54-a479-e99c2792ea77/chatbot/mensaje/recuperar-por-id-sesion/${targetSessionId}?pagina=1&cantidad=10`;
      
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
      const threadMessages = adaptBackendMessagesToThreadMessages(backendResponse.mensajes).reverse();
      // Replace previous messages with new ones
      setChatHistory(threadMessages);
    } catch (error) {
      console.error("Error al cargar mensajes históricos:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Function to handle new chat creation
  const handleNewChat = useCallback(() => {
    // Generate new UUID for session
    const newSessionId = crypto.randomUUID();
    
    // Clear previous messages immediately
    setChatHistory([]);
    
    // Save new session ID to sessionStorage
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    
    // Update session ID - this will trigger useEffect to load history
    // but since it's a new chat, it will likely return empty array
    setSessionId(newSessionId);
  }, []);

  // Load chat history for current session
  useEffect(() => {
    loadHistory(sessionId);
  }, [sessionId, loadHistory]);

  // Function to load chat list for user
  const loadChatList = useCallback(async () => {
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
      // Transform response to {session_id: string, name: string, id: number}[]
      const transformedChatList = chatListResponse.conversaciones.map((conversacion) => ({
        session_id: conversacion.id_sesion,
        name: conversacion.titulo,
        id: conversacion.id,
      }));
      setChatList(transformedChatList);
    } catch (error) {
      console.error("Error al cargar lista de chats:", error);
    } finally {
      setIsLoadingChatList(false);
    }
  }, [userId]);

  // Function to handle chat deletion
  const handleDeleteChat = useCallback(async (conversationId: number) => {
    try {
      const url = `https://n8nnew.mpajujuy.gob.ar/webhook/2d1ed74a-5480-44ce-9f63-6b527ae2287c/chatbot/conversacion/borrar/${conversationId}`;
      
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`Error al eliminar conversación: ${response.status}`);
        throw new Error("Error al eliminar conversación");
      }

      // Reload chat list after successful deletion
      await loadChatList();
      
      // If the deleted chat was the current session, create a new chat
      const deletedChat = chatList.find(chat => chat.id === conversationId);
      if (deletedChat && deletedChat.session_id === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Error al eliminar conversación:", error);
      throw error;
    }
  }, [chatList, sessionId, loadChatList, handleNewChat]);

  // Load chat list for user
  useEffect(() => {
    loadChatList();
  }, [loadChatList]);

  // Only block initial load, not when switching chats
  if (isLoadingChatList) {
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
        isLoadingHistory={isLoadingHistory}
        onNewChat={handleNewChat}
        onChatSelect={(selectedSessionId) => {
          // Save selected session ID to sessionStorage
          sessionStorage.setItem(SESSION_STORAGE_KEY, selectedSessionId);
          // Update session ID - useEffect will automatically load the history
          setSessionId(selectedSessionId);
        }}
        onDeleteChat={handleDeleteChat}
      />
    </MyRuntimeProvider>
  );
}

export default App