"use client";

import { PlusIcon, MessageSquareIcon } from "lucide-react";
import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatItem {
  session_id: string;
  name: string;
}

export interface ChatSidebarProps {
  chats?: ChatItem[];
  onNewChat?: () => void;
  onChatSelect?: (sessionId: string) => void;
  selectedSessionId?: string;
  className?: string;
}

export const ChatSidebar: FC<ChatSidebarProps> = ({
  chats = [],
  onNewChat,
  onChatSelect,
  selectedSessionId,
  className,
}) => {
  const handleChatSelect = (sessionId: string) => {
    if (selectedSessionId === sessionId) return;
    onChatSelect?.(sessionId);
  };

  return (
    <aside
      className={cn(
        "tw:flex tw:flex-col tw:h-full tw:bg-muted/30 tw:border-r tw:border-border tw:transition-all tw:duration-200",
        className
      )}
    >
      <div className="tw:p-3 tw:border-b tw:border-border">
        <Button
          onClick={onNewChat}
          className="tw:w-full tw:justify-start tw:gap-2 tw:border-none"
          variant="default"
        >
          <PlusIcon className="tw:size-4" />
          Nueva Conversación
        </Button>
      </div>

      <div className="tw:flex-1 tw:overflow-y-auto tw:p-2">
        <nav className="tw:space-y-1">
          {chats.length === 0 ? (
            <div className="tw:p-3 tw:text-sm tw:text-muted-foreground tw:text-center">
              No hay conversaciones disponibles
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.session_id}
                onClick={() => handleChatSelect(chat.session_id)}
                className={cn(
                  "tw:text-left tw:p-2 tw:rounded-md tw:transition-colors tw:flex tw:flex-col tw:gap-1 tw:group tw:cursor-pointer",
                  selectedSessionId === chat.session_id
                    ? "tw:bg-primary tw:text-primary-foreground"
                    : "tw:hover:bg-accent tw:text-foreground"
                )}
              >
                <div className="tw:flex tw:items-start tw:gap-2">
                  <MessageSquareIcon className="tw:size-4 tw:mt-0.5 tw:shrink-0" />
                  <div className="tw:flex-1 tw:min-w-0">
                    <div className="tw:font-medium tw:text-sm tw:truncate">
                      {chat.name}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
};
