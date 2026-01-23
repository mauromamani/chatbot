import { useCallback, useEffect, useState } from "react";
import { AssistantModal } from "./assistant-modal";
import { MyRuntimeProvider } from "../providers/runtime.provider";
import { ChatbotQueryClientProvider } from "../providers/query-client.provider";
import {
  useChatHistory,
  useChatList,
  useDeleteChat,
} from "../hooks/use-chat-queries";
import type { QueryClient } from "@tanstack/react-query";

export interface ChatApiUrls {
  /**
   * Base URL for loading chat history.
   * Should include the full path up to the session ID parameter.
   * Example: "https://api.example.com/webhook/xxx/chatbot/mensaje/recuperar-por-id-sesion"
   */
  chatHistory: string;
  /**
   * Base URL for loading chat list.
   * Should include the full path up to the userId parameter.
   * Example: "https://api.example.com/webhook/xxx/chatbot/conversacion/recuperar-por-id-usuario"
   */
  chatList: string;
  /**
   * Base URL for deleting a chat.
   * Should include the full path up to the conversationId parameter.
   * Example: "https://api.example.com/webhook/xxx/chatbot/conversacion/borrar"
   */
  deleteChat: string;
  /**
   * Base URL for sending chat messages.
   * Example: "https://api.example.com/webhook/xxx/chatbot"
   */
  sendMessage: string;
}

export interface ChatbotProps {
  /**
   * API URLs configuration for all chatbot endpoints
   */
  apiUrls: ChatApiUrls;
  /**
   * User ID for the chatbot
   */
  userId: number;
  /**
   * Initial session ID. If not provided, a new one will be generated.
   */
  initialSessionId?: string;
  /**
   * Optional QueryClient instance from the host app.
   * If not provided, a new QueryClient will be created internally.
   */
  queryClient?: QueryClient;
  /**
   * SessionStorage key for storing session ID.
   * Defaults to "chatbot_session_id"
   */
  sessionStorageKey?: string;
}

// Function to get session ID from sessionStorage or generate a new one
const getInitialSessionId = (
  providedId: string | undefined,
  storageKey: string
): string => {
  if (providedId) {
    return providedId;
  }
  const storedSessionId = sessionStorage.getItem(storageKey);
  if (storedSessionId) {
    return storedSessionId;
  }
  // If no session ID exists, generate a new one (new chat)
  const newSessionId = crypto.randomUUID();
  sessionStorage.setItem(storageKey, newSessionId);
  return newSessionId;
};

/**
 * Internal component that uses React Query hooks.
 * Must be rendered inside a QueryClientProvider.
 */
function ChatbotContent({
  apiUrls,
  userId,
  initialSessionId,
  sessionStorageKey,
}: Omit<ChatbotProps, "queryClient">) {
  // Get initial session ID
  const [sessionId, setSessionId] = useState<string>(() =>
    getInitialSessionId(initialSessionId, sessionStorageKey)
  );

  // Use React Query hooks (must be inside QueryClientProvider)
  const {
    data: chatHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useChatHistory({
    sessionId,
    apiUrl: apiUrls.chatHistory,
  });

  const {
    data: chatList = [],
    isLoading: isLoadingChatList,
  } = useChatList({
    userId,
    apiUrl: apiUrls.chatList,
  });

  const deleteChatMutation = useDeleteChat({
    apiUrl: apiUrls.deleteChat,
  });

  // Function to handle new chat creation
  const handleNewChat = useCallback(() => {
    // Generate new UUID for session
    const newSessionId = crypto.randomUUID();

    // Save new session ID to sessionStorage
    sessionStorage.setItem(sessionStorageKey, newSessionId);

    // Update session ID - this will trigger the query to refetch
    setSessionId(newSessionId);
  }, [sessionStorageKey]);

  // Function to handle chat selection
  const handleChatSelect = useCallback(
    (selectedSessionId: string) => {
      // Save selected session ID to sessionStorage
      sessionStorage.setItem(sessionStorageKey, selectedSessionId);
      // Update session ID - this will trigger the query to refetch
      setSessionId(selectedSessionId);
    },
    [sessionStorageKey]
  );

  // Function to handle chat deletion
  const handleDeleteChat = useCallback(
    async (conversationId: number) => {
      try {
        await deleteChatMutation.mutateAsync(conversationId);

        // If the deleted chat was the current session, create a new chat
        const deletedChat = chatList.find((chat) => chat.id === conversationId);
        if (deletedChat && deletedChat.session_id === sessionId) {
          handleNewChat();
        }
      } catch (error) {
        console.error("Error al eliminar conversación:", error);
        throw error;
      }
    },
    [chatList, sessionId, deleteChatMutation, handleNewChat]
  );

  // Refetch history when sessionId changes
  useEffect(() => {
    if (sessionId) {
      refetchHistory();
    }
  }, [sessionId, refetchHistory]);

  // Show loading state only on initial load
  if (isLoadingChatList && chatList.length === 0) {
    return <div>Cargando historial...</div>;
  }

  return (
    <MyRuntimeProvider
      apiUrl={apiUrls.sendMessage}
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
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
      />
    </MyRuntimeProvider>
  );
}

/**
 * Main Chatbot component that handles all chat logic using React Query.
 * This component wraps everything in a QueryClientProvider (either provided
 * by the host app or created internally by ChatbotQueryClientProvider).
 */
export function Chatbot({
  apiUrls,
  userId,
  initialSessionId,
  queryClient,
  sessionStorageKey = "chatbot_session_id",
}: ChatbotProps) {
  return (
    <ChatbotQueryClientProvider queryClient={queryClient}>
      <ChatbotContent
        apiUrls={apiUrls}
        userId={userId}
        initialSessionId={initialSessionId}
        sessionStorageKey={sessionStorageKey}
      />
    </ChatbotQueryClientProvider>
  );
}
