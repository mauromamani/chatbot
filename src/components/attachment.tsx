"use client";

import { type PropsWithChildren, type FC } from "react";
import { XIcon, PlusIcon, FileText } from "lucide-react";
import {
  AttachmentPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  useAssistantState,
  useAssistantApi,
} from "@assistant-ui/react";
import { useShallow } from "zustand/shallow";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { cn } from "@/lib/utils";

const useFileSrc = (file: File | undefined) => {
  if (!file) {
    return undefined;
  }

  return URL.createObjectURL(file);
};

const useAttachmentSrc = () => {
  const { file, src } = useAssistantState(
    useShallow(({ attachment }): { file?: File; src?: string } => {
      if (attachment.type !== "image") return {};
      if (attachment.file) return { file: attachment.file };
      const src = attachment.content?.filter((c) => c.type === "image")[0]
        ?.image;
      if (!src) return {};
      return { src };
    }),
  );

  return useFileSrc(file) ?? src;
};

type AttachmentPreviewProps = {
  src: string;
};

const AttachmentPreview: FC<AttachmentPreviewProps> = ({ src }) => {
  return (
    <img
      src={src}
      alt="Vista previa de imagen"
      className="aui-attachment-preview-image-loaded tw:block tw:h-auto tw:max-h-[80vh] tw:w-auto tw:max-w-full tw:object-contain"
    />
  );
};

const AttachmentPreviewDialog: FC<PropsWithChildren> = ({ children }) => {
  const src = useAttachmentSrc();

  if (!src) return children;

  return (
    <Dialog>
      <DialogTrigger
        className="aui-attachment-preview-trigger tw:cursor-pointer tw:transition-colors tw:hover:bg-accent/50"
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent className="aui-attachment-preview-dialog-content tw:p-2 tw:sm:max-w-3xl tw:[&>button]:rounded-full tw:[&>button]:bg-foreground/60 tw:[&>button]:p-1 tw:[&>button]:opacity-100 tw:[&>button]:ring-0! tw:[&_svg]:text-background tw:[&>button]:hover:[&_svg]:text-destructive">
        <DialogTitle className="aui-sr-only tw:sr-only">
          Vista previa de adjunto de imagen
        </DialogTitle>
        <div className="aui-attachment-preview tw:relative tw:mx-auto tw:flex tw:max-h-[80dvh] tw:w-full tw:items-center tw:justify-center tw:overflow-hidden tw:bg-background">
          <AttachmentPreview src={src} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AttachmentThumb: FC = () => {
  const isImage = useAssistantState(
    ({ attachment }) => attachment.type === "image",
  );
  const src = useAttachmentSrc();

  return (
    <Avatar className="aui-attachment-tile-avatar tw:h-full tw:w-full tw:rounded-none">
      <AvatarImage
        src={src}
        alt="Vista previa de adjunto"
        className="aui-attachment-tile-image tw:object-cover"
      />
      <AvatarFallback delayMs={isImage ? 200 : 0}>
        <FileText className="aui-attachment-tile-fallback-icon tw:size-8 tw:text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
};

const AttachmentUI: FC = () => {
  const api = useAssistantApi();
  const isComposer = api.attachment.source === "composer";

  const isImage = useAssistantState(
    ({ attachment }) => attachment.type === "image",
  );
  const typeLabel = useAssistantState(({ attachment }) => {
    const type = attachment.type;
    switch (type) {
      case "image":
        return "Imagen";
      case "document":
        return "Documento";
      case "file":
        return "Archivo";
      default:
        return `Tipo de adjunto desconocido: ${type}`;
    }
  });

  return (
    <Tooltip>
      <AttachmentPrimitive.Root
        className={cn(
          "aui-attachment-root tw:relative",
          isImage &&
            "aui-attachment-root-composer tw:only:[&>#attachment-tile]:size-24",
        )}
      >
        <AttachmentPreviewDialog>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "aui-attachment-tile tw:size-14 tw:cursor-pointer tw:overflow-hidden tw:rounded-[14px] tw:border tw:bg-muted tw:transition-opacity tw:hover:opacity-75",
                isComposer &&
                  "aui-attachment-tile-composer tw:border-foreground/20",
              )}
              role="button"
              id="attachment-tile"
              aria-label={`${typeLabel} attachment`}
            >
              <AttachmentThumb />
            </div>
          </TooltipTrigger>
        </AttachmentPreviewDialog>
        {isComposer && <AttachmentRemove />}
      </AttachmentPrimitive.Root>
      <TooltipContent side="top">
        <AttachmentPrimitive.Name />
      </TooltipContent>
    </Tooltip>
  );
};

const AttachmentRemove: FC = () => {
  return (
    <AttachmentPrimitive.Remove asChild>
      <TooltipIconButton
        tooltip="Eliminar archivo"
        className="aui-attachment-tile-remove tw:absolute tw:top-1.5 tw:right-1.5 tw:size-3.5 tw:rounded-full tw:bg-white tw:text-muted-foreground tw:opacity-100 tw:shadow-sm tw:hover:bg-white! tw:[&_svg]:text-black tw:hover:[&_svg]:text-destructive"
        side="top"
      >
        <XIcon className="aui-attachment-remove-icon tw:size-3 tw:dark:stroke-[2.5px]" />
      </TooltipIconButton>
    </AttachmentPrimitive.Remove>
  );
};

export const UserMessageAttachments: FC = () => {
  return (
    <div className="aui-user-message-attachments-end tw:col-span-full tw:col-start-1 tw:row-start-1 tw:flex tw:w-full tw:flex-row tw:justify-end tw:gap-2">
      <MessagePrimitive.Attachments components={{ Attachment: AttachmentUI }} />
    </div>
  );
};

export const ComposerAttachments: FC = () => {
  return (
    <div className="aui-composer-attachments tw:mb-2 tw:flex tw:w-full tw:flex-row tw:items-center tw:gap-2 tw:overflow-x-auto tw:px-1.5 tw:pt-0.5 tw:pb-1 tw:empty:hidden">
      <ComposerPrimitive.Attachments
        components={{ Attachment: AttachmentUI }}
      />
    </div>
  );
};

export const ComposerAddAttachment: FC = () => {
  return (
    <ComposerPrimitive.AddAttachment asChild>
      <TooltipIconButton
        tooltip="Agregar adjunto"
        side="bottom"
        variant="ghost"
        size="icon"
        className="aui-composer-add-attachment tw:size-[34px] tw:rounded-full tw:p-1 tw:font-semibold tw:text-xs tw:hover:bg-muted-foreground/15 tw:dark:border-muted-foreground/15 tw:dark:hover:bg-muted-foreground/30"
        aria-label="Agregar adjunto"
      >
        <PlusIcon className="aui-attachment-add-icon tw:size-5 tw:stroke-[1.5px]" />
      </TooltipIconButton>
    </ComposerPrimitive.AddAttachment>
  );
};