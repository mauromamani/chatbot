"use client";

import { PlusIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  const handleChatSelect = (sessionId: string) => {
    if (selectedSessionId === sessionId) return;
    onChatSelect?.(sessionId);
  };

  const handleDeleteClick = async (conversationId: number) => {
    if (!onDeleteChat) return;
    
    try {
      setDeletingId(conversationId);
      await onDeleteChat(conversationId);
      setOpenDialogId(null);
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
                  "tw:relative tw:text-left tw:p-2 tw:rounded-md tw:transition-colors tw:flex tw:items-center tw:gap-2 tw:group tw:cursor-pointer",
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
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        'tw:size-6 tw:opacity-0 tw:group-hover:opacity-100 tw:transition-opacity tw:shrink-0 tw:border-none tw:bg-transparent tw:absolute tw:right-1.5 tw:top-1.5 tw:z-20',
                        selectedSessionId === chat.session_id && "tw:text-primary-foreground"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDialogId(chat.id);
                      }}
                    >
                      <Trash2Icon className="tw:size-3 tw:text-destructive" />
                    </Button>
                    <Dialog open={openDialogId === chat.id} onOpenChange={(open) => setOpenDialogId(open ? chat.id : null)} modal={true}>
                      <DialogContent 
                        className="tw:z-[10000000000000000000] tw:border-gray-100" 
                        onClick={(e) => e.stopPropagation()}
                        showCloseButton={false}
                      >
                        <DialogHeader>
                          <DialogTitle>Eliminar conversación</DialogTitle>
                          <DialogDescription>
                            ¿Está seguro de que desea eliminar esta conversación? Esta acción no se puede deshacer.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setOpenDialogId(null)}
                            disabled={deletingId === chat.id}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="destructive"
                            className="tw:border-0"
                            onClick={() => handleDeleteClick(chat.id)}
                            disabled={deletingId === chat.id}
                          >
                            {deletingId === chat.id ? "Eliminando..." : "Eliminar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
};
