import { useEffect, useMemo, type ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadMessage,
} from "@assistant-ui/react";

export interface ChatApi {
  /**
   * Chat history
   * Array of messages converted to ThreadMessage format
   */
  chatHistory?: ThreadMessage[];
  
  /**
   * Get the list of all chats for the user
   * @returns Promise with the array of chats
   */
  getChatList?: () => Promise<Chat[]>;
  
  /**
   * Create a new chat
   * @returns Promise with the created chat
   */
  createChat?: () => Promise<Chat>;
  
  /**
   * Delete a specific chat
   * @param sessionId - ID of the chat to delete
   * @returns Promise that resolves when the chat is deleted
   */
  deleteChat?: (sessionId: string) => Promise<void>;
}

// Interface to represent a chat
export interface Chat {
  id: string;
  sessionId: string;
  title?: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface RuntimeProviderProps {
  children: ReactNode;
  apiUrl: string;
  userId: number;
  sessionId: string;
  chatApi?: ChatApi;
}

// async function* backendApi({ messages, abortSignal, context, apiUrl }) {
//   const response = await fetch(apiUrl || "http://127.0.0.1:3001/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages }),
//     signal: abortSignal,
//   });

//   const reader = response.body?.getReader();
//   const decoder = new TextDecoder("utf-8");

//   let buffer = "";
//   while (true) {
//     const { done, value } = await reader?.read();
//     if (done) break;
//     buffer += decoder.decode(value, { stream: true });

//     const parts = buffer.split("\n\n");
//     buffer = parts.pop() || "";

//     for (const part of parts) {
//       if (part.startsWith("data:")) {
//         const data = part.replace("data: ", "").trim();
//         if (data === "[DONE]") return;
//         yield JSON.parse(data);
//       }
//     }
//   }
// }

// Function to get session ID - always uses the provided sessionId prop
const getSessionId = (providedId: string): string => {
  if (!providedId) {
    throw new Error("sessionId is required");
  }
  return providedId;
};

// Función para extraer el mensaje del usuario del array de mensajes
const extractUserMessage = (messages: readonly ThreadMessage[]): string => {
  // Buscar el último mensaje del usuario
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === "user") {
      // El contenido puede ser un string o un array de objetos con type y text
      if (typeof message.content === "string") {
        return message.content;
      }
      if (Array.isArray(message.content)) {
        const textParts = message.content
          .filter((part) => part.type === "text")
          .map((part) => (typeof part.text === "string" ? part.text : ""))
          .join("");
        return textParts || "";
      }
    }
  }
  return "";
};

const createModelAdapter = (
  apiUrl: string,
  userId: number,
  sessionId: string
): ChatModelAdapter => ({
  async run({ messages, abortSignal }) {
    // Extraer el mensaje del usuario
    const mensaje = extractUserMessage(messages);
    
    // Preparar el body según el formato requerido
    const body = {
      mensaje,
      id_sesion: sessionId,
      id_usuario: userId,
    };

    try {
    const result = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: abortSignal,
    });

    if (!result.ok) {
      throw new Error(`Error en la API: ${result.status} ${result.statusText}`);
    }

    const data = await result.json();
    
    // La respuesta viene en formato { output: string }
    const responseText = data.output || "";
    
    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };

  } catch (error) {
    console.error(error);
    return {
      content: [
        {
          type: "text",
          text: "Error en la API: " + error,
        },
      ],
    };
  }
  },
});

export function MyRuntimeProvider({
  children,
  apiUrl,
  userId,
  sessionId,
  chatApi,
}: Readonly<RuntimeProviderProps>) {
  // Always use the provided sessionId prop
  const sessionIdValue = getSessionId(sessionId);
  
  // Memoize modelAdapter to recreate only when dependencies change
  const modelAdapter = useMemo(
    () => createModelAdapter(apiUrl, userId, sessionIdValue),
    [apiUrl, userId, sessionIdValue]
  );
  
  // Create runtime without initial messages - we'll update them via reset()
  const runtime = useLocalRuntime(modelAdapter);

  // Update thread messages when chatHistory or sessionId changes
  useEffect(() => {
    const messages = chatApi?.chatHistory;
    // Reset thread with new messages (empty array clears the thread)
    runtime.thread.reset(messages ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatApi?.chatHistory, sessionId]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}