import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ThreadMessage } from "@assistant-ui/react";

// Tipos para los mensajes del backend
export interface BackendMessage {
  id: number;
  id_sesion: string;
  mensaje: {
    tipo: "humano" | "ia";
    contenido: string;
  };
  creado: string;
}

export interface BackendResponse {
  mensajes: BackendMessage[];
}

export interface Conversacion {
  id: number;
  id_sesion: string;
  titulo: string;
}

export interface ChatListResponse {
  conversaciones: Conversacion[];
}

export interface ChatListItem {
  session_id: string;
  name: string;
  id: number;
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

export interface UseChatHistoryOptions {
  sessionId: string;
  /**
   * Base URL for the chat history API endpoint.
   * Should include the full path up to the session ID parameter.
   * Example: "https://api.example.com/webhook/xxx/chatbot/mensaje/recuperar-por-id-sesion"
   */
  apiUrl: string;
  enabled?: boolean;
}

/**
 * Hook para cargar el historial de mensajes de una sesión de chat
 */
export function useChatHistory({
  sessionId,
  apiUrl,
  enabled = true,
}: UseChatHistoryOptions) {
  return useQuery({
    queryKey: ["chatHistory", sessionId],
    queryFn: async (): Promise<ThreadMessage[]> => {
      // Construct URL - apiUrl should be the base URL, we append sessionId and query params
      const url = `${apiUrl}/${sessionId}?pagina=1&cantidad=10`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al cargar historial: ${response.status}`);
      }

      const backendResponse: BackendResponse = await response.json();
      return adaptBackendMessagesToThreadMessages(
        backendResponse.mensajes
      ).reverse();
    },
    enabled: enabled && !!sessionId,
  });
}

export interface UseChatListOptions {
  userId: number;
  /**
   * Base URL for the chat list API endpoint.
   * Should include the full path up to the userId parameter.
   * Example: "https://api.example.com/webhook/xxx/chatbot/conversacion/recuperar-por-id-usuario"
   */
  apiUrl: string;
}

/**
 * Hook para cargar la lista de conversaciones de un usuario
 */
export function useChatList({ userId, apiUrl }: UseChatListOptions) {
  return useQuery({
    queryKey: ["chatList", userId],
    queryFn: async (): Promise<ChatListItem[]> => {
      // Construct URL - apiUrl should be the base URL, we append userId
      const url = `${apiUrl}/${userId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al cargar lista de chats: ${response.status}`);
      }

      const chatListResponse: ChatListResponse = await response.json();
      return chatListResponse.conversaciones.map((conversacion) => ({
        session_id: conversacion.id_sesion,
        name: conversacion.titulo,
        id: conversacion.id,
      }));
    },
    enabled: !!userId,
  });
}

export interface UseDeleteChatOptions {
  /**
   * Base URL for the delete chat API endpoint.
   * Should include the full path up to the conversationId parameter.
   * Example: "https://api.example.com/webhook/xxx/chatbot/conversacion/borrar"
   */
  apiUrl: string;
  onSuccess?: () => void;
}

/**
 * Hook para eliminar una conversación
 */
export function useDeleteChat({ apiUrl, onSuccess }: UseDeleteChatOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: number): Promise<void> => {
      // Construct URL - apiUrl should be the base URL, we append conversationId
      const url = `${apiUrl}/${conversationId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar conversación: ${response.status}`);
      }
    },
    onSuccess: () => {
      // Invalidar la lista de chats para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
      onSuccess?.();
    },
  });
}
