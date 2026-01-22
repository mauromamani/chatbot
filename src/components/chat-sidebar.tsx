"use client";

import { PlusIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ChatItem {
  session_id: string;
  name: string;
  id: number;
}

export interface ChatSidebarProps {
  chats?: ChatItem[];
  onNewChat?: () => void;
  onChatSelect?: (sessionId: string) => void;
  onDeleteChat?: (conversationId: number) => Promise<void>;
  selectedSessionId?: string;
  className?: string;
}

export const ChatSidebar: FC<ChatSidebarProps> = ({
  chats = [],
  onNewChat,
  onChatSelect,
  onDeleteChat,
  selectedSessionId,
  className,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const handleChatSelect = (sessionId: string) => {
    if (selectedSessionId === sessionId) return;
    onChatSelect?.(sessionId);
  };

  const handleDeleteClick = async (conversationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDeleteChat) return;
    
    try {
      setDeletingId(conversationId);
      await onDeleteChat(conversationId);
      setOpenPopoverId(null);
    } catch (error) {
      console.error("Error al eliminar conversación:", error);
    } finally {
      setDeletingId(null);
    }
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
                  "tw:text-left tw:p-2 tw:rounded-md tw:transition-colors tw:flex tw:items-center tw:gap-2 tw:group tw:cursor-pointer",
                  selectedSessionId === chat.session_id
                    ? "tw:bg-primary tw:text-primary-foreground"
                    : "tw:hover:bg-accent tw:text-foreground"
                )}
              >
                <MessageSquareIcon className="tw:size-4 tw:shrink-0" />
                <div className="tw:flex-1 tw:min-w-0">
                  <div className="tw:font-medium tw:text-sm tw:truncate">
                    {chat.name}
                  </div>
                </div>
                {onDeleteChat && (
                  <Popover open={openPopoverId === chat.id} onOpenChange={(open) => setOpenPopoverId(open ? chat.id : null)}>
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        className={cn(
                          "tw:size-6 tw:opacity-0 tw:group-hover:opacity-100 tw:transition-opacity tw:shrink-0 tw:flex tw:items-center tw:justify-center tw:rounded-md tw:hover:bg-accent/50 tw:cursor-pointer tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring",
                          selectedSessionId === chat.session_id && "tw:text-primary-foreground"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPopoverId(openPopoverId === chat.id ? null : chat.id);
                        }}
                      >
                        <Trash2Icon className="tw:size-3" />
                      </button>
                    </PopoverAnchor>
                    <PopoverContent 
                      className="tw:w-56 tw:z-50" 
                      onClick={(e) => e.stopPropagation()}
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      side="left"
                      align="end"
                    >
                      <div className="tw:space-y-3">
                        <div className="tw:text-sm">
                          ¿Desea eliminar esta conversación?
                        </div>
                        <div className="tw:flex tw:gap-2 tw:justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPopoverId(null);
                            }}
                            disabled={deletingId === chat.id}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(chat.id, e);
                            }}
                            disabled={deletingId === chat.id}
                          >
                            {deletingId === chat.id ? "Eliminando..." : "Eliminar"}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
};
