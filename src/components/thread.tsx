import {
  // ComposerAddAttachment,
  // ComposerAttachments,
  UserMessageAttachments,
} from "@/components/attachment";
import { MarkdownText } from "@/components/markdown-text";
import { ToolFallback } from "@/components/tool-fallback";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ActionBarPrimitive,
  AssistantIf,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  RefreshCwIcon,
  SquareIcon,
} from "lucide-react";
import type { FC } from "react";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root tw:@container tw:flex tw:h-full tw:flex-col tw:bg-background"
      style={{
        ["--thread-max-width" as string]: "44rem",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        className="aui-thread-viewport tw:relative tw:flex tw:flex-1 tw:flex-col tw:overflow-x-hidden tw:overflow-y-scroll tw:scroll-smooth tw:px-4 tw:pt-4"
      >
        <AssistantIf condition={({ thread }) => thread.isEmpty}>
          <ThreadWelcome />
        </AssistantIf>

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer tw:sticky tw:bottom-0 tw:mx-auto tw:mt-auto tw:flex tw:w-full tw:max-w-(--thread-max-width) tw:flex-col tw:gap-4 tw:overflow-visible tw:rounded-t-3xl tw:bg-background tw:pb-4 tw:md:pb-6">
          <ThreadScrollToBottom />
          <Composer />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Ir al final"
        variant="outline"
        className="aui-thread-scroll-to-bottom tw:absolute tw:-top-12 tw:z-10 tw:self-center tw:rounded-full tw:p-4 tw:disabled:invisible tw:dark:bg-background tw:dark:hover:bg-accent"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root tw:mx-auto tw:my-auto tw:flex tw:w-full tw:max-w-(--thread-max-width) tw:flex-col">
      <div className="aui-thread-welcome-center tw:flex tw:w-full tw:flex-col tw:items-center tw:justify-center">
        <div className="aui-thread-welcome-message tw:flex tw:size-full tw:flex-col tw:justify-center tw:px-4">
          <h1 className="aui-thread-welcome-message-inner tw:fade-in tw:slide-in-from-bottom-1 tw:animate-in tw:font-semibold tw:text-2xl tw:duration-200">
            Hola!
          </h1>
          <p className="aui-thread-welcome-message-inner tw:fade-in tw:slide-in-from-bottom-1 tw:animate-in tw:text-muted-foreground tw:text-lg tw:delay-75 tw:duration-200 tw:-mt-2">
            Soy tu asistente jurídico personal. ¿En qué puedo ayudarte?
          </p>
        </div>
      </div>

      <ThreadSuggestions />
    </div>
  );
};

const SUGGESTIONS = [
  {
    title: "What's the weather",
    label: "in San Francisco?",
    prompt: "What's the weather in San Francisco?",
  },
  {
    title: "Explain React hooks",
    label: "like useState and useEffect",
    prompt: "Explain React hooks like useState and useEffect",
  },
] as const;

const ThreadSuggestions: FC = () => {
  return null;
  return (
    <div className="aui-thread-welcome-suggestions tw:grid tw:w-full tw:@md:grid-cols-2 tw:gap-2 tw:pb-4">
      {SUGGESTIONS.map((suggestion, index) => (
        <div
          key={suggestion.prompt}
          className="aui-thread-welcome-suggestion-display tw:fade-in tw:slide-in-from-bottom-2 tw:@md:nth-[n+3]:block tw:nth-[n+3]:hidden tw:animate-in tw:fill-mode-both tw:duration-200"
          style={{ animationDelay: `${100 + index * 50}ms` }}
        >
          <ThreadPrimitive.Suggestion prompt={suggestion.prompt} send asChild>
            <Button
              variant="ghost"
              className="aui-thread-welcome-suggestion tw:h-auto tw:w-full tw:@md:flex-col tw:flex-wrap tw:items-start tw:justify-start tw:gap-1 tw:rounded-2xl tw:border tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:transition-colors tw:hover:bg-muted"
              aria-label={suggestion.prompt}
            >
              <span className="aui-thread-welcome-suggestion-text-1 tw:font-medium">
                {suggestion.title}
              </span>
              <span className="aui-thread-welcome-suggestion-text-2 tw:text-muted-foreground">
                {suggestion.label}
              </span>
            </Button>
          </ThreadPrimitive.Suggestion>
        </div>
      ))}
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="aui-composer-root tw:relative tw:flex tw:w-full tw:flex-col">
      <ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone tw:flex tw:w-full tw:flex-col tw:rounded-2xl tw:border tw:border-input tw:bg-background tw:px-1 tw:pt-2 tw:outline-none tw:transition-shadow tw:has-[textarea:focus-visible]:border-ring tw:has-[textarea:focus-visible]:ring-2 tw:has-[textarea:focus-visible]:ring-ring/20 tw:data-[dragging=true]:border-ring tw:data-[dragging=true]:border-dashed tw:data-[dragging=true]:bg-accent/50 tw:overflow-hidden">
        {/* <ComposerAttachments /> */}
        <ComposerPrimitive.Input
          placeholder="Enviar un mensaje..."
          className="aui-composer-input tw:mb-1 tw:max-h-32 tw:min-h-14 tw:w-full tw:resize-none tw:bg-transparent tw:border-0 tw:px-4 tw:pt-2 tw:pb-3 tw:text-sm tw:outline-none tw:placeholder:text-muted-foreground tw:focus-visible:ring-0"
          rows={1}
          autoFocus
          aria-label="Entrada de mensaje"
        />
        <ComposerAction />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper tw:relative tw:mx-2 tw:mb-2 tw:flex tw:items-center tw:justify-end">
      {/* TODO: Add attachment dropzone */}
      {/* <ComposerAddAttachment /> */}

      <AssistantIf condition={({ thread }) => !thread.isRunning}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Enviar mensaje"
            side="bottom"
            type="submit"
            variant="default"
            size="icon"
            className="aui-composer-send tw:size-8 tw:rounded-full"
            aria-label="Enviar mensaje"
          >
            <ArrowUpIcon className="aui-composer-send-icon tw:size-4" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </AssistantIf>

      <AssistantIf condition={({ thread }) => thread.isRunning}>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="default"
            size="icon"
            className="aui-composer-cancel tw:size-8 tw:rounded-full"
            aria-label="Detener generación"
          >
            <SquareIcon className="aui-composer-cancel-icon tw:size-3 tw:fill-current" />
          </Button>
        </ComposerPrimitive.Cancel>
      </AssistantIf>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root tw:mt-2 tw:rounded-md tw:border tw:border-destructive tw:bg-destructive/10 tw:p-3 tw:text-destructive tw:text-sm tw:dark:bg-destructive/5 tw:dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message tw:line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="aui-assistant-message-root tw:fade-in tw:slide-in-from-bottom-1 tw:relative tw:mx-auto tw:w-full tw:max-w-(--thread-max-width) tw:animate-in tw:py-3 tw:duration-150"
      data-role="assistant"
    >
      <div className="aui-assistant-message-content tw:wrap-break-word tw:px-2 tw:text-foreground tw:leading-relaxed">
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            tools: { Fallback: ToolFallback },
          }}
        />
        <MessageError />
      </div>

      <div className="aui-assistant-message-footer tw:mt-1 tw:ml-2 tw:flex">
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root tw:col-start-3 tw:row-start-2 tw:-ml-1 tw:flex tw:gap-1 tw:text-muted-foreground tw:data-floating:absolute tw:data-floating:rounded-md tw:data-floating:border tw:data-floating:border-input tw:data-floating:bg-background tw:data-floating:p-1 tw:data-floating:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copiar">
          <AssistantIf condition={({ message }) => message.isCopied}>
            <CheckIcon className="tw:size-4" />
          </AssistantIf>
          <AssistantIf condition={({ message }) => !message.isCopied}>
            <CopyIcon className="tw:size-4" />
          </AssistantIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.ExportMarkdown asChild>
        <TooltipIconButton tooltip="Exportar como Markdown">
          <DownloadIcon className="tw:size-4" />
        </TooltipIconButton>
      </ActionBarPrimitive.ExportMarkdown>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Actualizar">
          <RefreshCwIcon className="tw:size-4" />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="aui-user-message-root tw:fade-in tw:slide-in-from-bottom-1 tw:mx-auto tw:grid tw:w-full tw:max-w-(--thread-max-width) tw:animate-in tw:auto-rows-auto tw:grid-cols-[minmax(72px,1fr)_auto] tw:content-start tw:gap-y-2 tw:px-2 tw:py-1.5 tw:duration-150 tw:[&:where(>*)]:col-start-2"
      data-role="user"
    >
      <UserMessageAttachments />

      <div className="aui-user-message-content-wrapper tw:relative tw:col-start-2 tw:min-w-0">
        <div className="aui-user-message-content tw:wrap-break-word tw:rounded-2xl tw:bg-muted tw:px-3 tw:py-0 tw:text-foreground">
          <MessagePrimitive.Parts />
        </div>
        <div className="aui-user-action-bar-wrapper tw:absolute tw:top-1/2 tw:left-0 tw:-translate-x-full tw:-translate-y-1/2 tw:pr-2">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker className="aui-user-branch-picker tw:col-span-full tw:col-start-1 tw:row-start-3 tw:-mr-1 tw:justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root tw:flex tw:flex-col tw:items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Editar" className="aui-user-action-edit tw:p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root className="aui-edit-composer-wrapper tw:mx-auto tw:flex tw:w-full tw:max-w-(--thread-max-width) tw:flex-col tw:px-2 tw:py-3">
      <ComposerPrimitive.Root className="aui-edit-composer-root tw:ml-auto tw:flex tw:w-full tw:max-w-[85%] tw:flex-col tw:rounded-2xl tw:bg-muted">
        <ComposerPrimitive.Input
          className="aui-edit-composer-input tw:min-h-14 tw:w-full tw:resize-none tw:bg-transparent tw:border-0 tw:p-4 tw:text-foreground tw:text-sm tw:outline-none"
          autoFocus
        />
        <div className="aui-edit-composer-footer tw:mx-3 tw:mb-3 tw:flex tw:items-center tw:gap-2 tw:self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm" className="tw:border-0">
              Cancelar
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm" className="tw:border-0">Actualizar</Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root tw:mr-2 tw:-ml-2 tw:inline-flex tw:items-center tw:text-muted-foreground tw:text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Anterior">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state tw:font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Siguiente">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};