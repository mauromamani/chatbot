"use client";

import { BotIcon, ChevronDownIcon, Maximize2Icon, Minimize2Icon } from "lucide-react";

import { type FC, forwardRef, useState } from "react";
import { AssistantModalPrimitive } from "@assistant-ui/react";

import { Thread } from "@/components/thread";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { ChatSidebar, type ChatItem } from "@/components/chat-sidebar";
import { cn } from "@/lib/utils";

export interface AssistantModalProps {
  chatList?: ChatItem[];
  selectedSessionId?: string;
  isLoadingHistory?: boolean;
  onNewChat?: () => void;
  onChatSelect?: (sessionId: string) => void;
  onDeleteChat?: (conversationId: number) => Promise<void>;
}

export const AssistantModal: FC<AssistantModalProps> = ({
  chatList = [],
  selectedSessionId,
  isLoadingHistory = false,
  onNewChat,
  onChatSelect,
  onDeleteChat,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AssistantModalPrimitive.Root>
      <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor tw:fixed tw:right-4 tw:bottom-4 tw:size-11">
        <AssistantModalPrimitive.Trigger asChild>
          <AssistantModalButton />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>
      <AssistantModalPrimitive.Content
        sideOffset={isExpanded ? -40 :16 } 
        className={cn(
          "aui-root aui-modal-content tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:slide-out-to-bottom-1/2 tw:data-[state=closed]:slide-out-to-right-1/2 tw:data-[state=closed]:zoom-out tw:data-[state=open]:fade-in-0 tw:data-[state=open]:slide-in-from-bottom-1/2 tw:data-[state=open]:slide-in-from-right-1/2 tw:data-[state=open]:zoom-in tw:z-50 tw:overflow-x-hidden tw:overscroll-contain tw:rounded-xl tw:border tw:border-input tw:bg-popover tw:p-0 tw:text-popover-foreground tw:shadow-sm tw:outline-none tw:data-[state=closed]:animate-out tw:data-[state=open]:animate-in tw:[&>.aui-thread-root]:bg-inherit tw:relative tw:transition-all tw:duration-200 tw:flex",
          isExpanded ? "tw:h-[calc(100dvh-40px)] tw:w-[calc(100dvw-30px)]" : "tw:h-[500px] tw:w-[400px]"
        )}
      >
        <div className="aui-modal-header tw:absolute tw:top-2 tw:left-2 tw:z-10">
          <TooltipIconButton
            tooltip={isExpanded ? "Reducir tamaño" : "Duplicar tamaño"}
            variant="ghost"
            size="icon"
            className="aui-modal-expand tw:size-8 tw:rounded-md tw:bg-background/80 tw:backdrop-blur-sm tw:hover:bg-background"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2Icon className="tw:size-4" />
            ) : (
              <Maximize2Icon className="tw:size-4" />
            )}
          </TooltipIconButton>
        </div>
        
        {isExpanded && (
          <div className="tw:w-64 tw:shrink-0">
            <ChatSidebar
              chats={chatList}
              selectedSessionId={selectedSessionId}
              onNewChat={onNewChat}
              onChatSelect={onChatSelect}
              onDeleteChat={onDeleteChat}
            />
          </div>
        )}
        
        <div className="tw:flex-1 tw:min-w-0">
          <Thread isLoadingHistory={isLoadingHistory} />
        </div>
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>
  );
};

type AssistantModalButtonProps = { "data-state"?: "open" | "closed" };

const AssistantModalButton = forwardRef<
  HTMLButtonElement,
  AssistantModalButtonProps
>(({ "data-state": state, ...rest }, ref) => {
  const tooltip = state === "open" ? "Cerrar asistente" : "Abrir asistente";

  return (
    <TooltipIconButton
      variant="default"
      tooltip={tooltip}
      side="left"
      {...rest}
      className="aui-modal-button tw:size-full tw:rounded-full tw:shadow tw:transition-transform tw:hover:scale-110 tw:active:scale-90 tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary/90 tw:hover:text-primary-foreground"
      ref={ref}
    >
      <BotIcon
        data-state={state}
        className="aui-modal-button-closed-icon tw:absolute tw:size-6 tw:transition-all tw:data-[state=closed]:rotate-0 tw:data-[state=open]:rotate-90 tw:data-[state=closed]:scale-100 tw:data-[state=open]:scale-0 tw:text-current"
      />

      <ChevronDownIcon
        data-state={state}
        className="aui-modal-button-open-icon tw:absolute tw:size-6 tw:transition-all tw:data-[state=closed]:-rotate-90 tw:data-[state=open]:rotate-0 tw:data-[state=closed]:scale-0 tw:data-[state=open]:scale-100 tw:text-current"
      />
      <span className="aui-sr-only tw:sr-only">{tooltip}</span>
    </TooltipIconButton>
  );
});

AssistantModalButton.displayName = "AssistantModalButton";