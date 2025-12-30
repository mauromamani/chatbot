"use client";

import "@assistant-ui/react-markdown/styles/dot.css";

import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { cn } from "@/lib/utils";

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md"
      components={defaultComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="aui-code-header-root tw:mt-4 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:rounded-t-lg tw:bg-muted-foreground/15 tw:px-4 tw:py-2 tw:font-semibold tw:text-foreground tw:text-sm tw:dark:bg-muted-foreground/20">
      <span className="aui-code-header-language tw:lowercase tw:[&>span]:text-xs">
        {language}
      </span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "aui-md-h1 tw:mb-8 tw:scroll-m-20 tw:font-extrabold tw:text-4xl tw:tracking-tight tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "aui-md-h2 tw:mt-8 tw:mb-4 tw:scroll-m-20 tw:font-semibold tw:text-3xl tw:tracking-tight tw:first:mt-0 tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "aui-md-h3 tw:mt-6 tw:mb-4 tw:scroll-m-20 tw:font-semibold tw:text-2xl tw:tracking-tight tw:first:mt-0 tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "aui-md-h4 tw:mt-6 tw:mb-4 tw:scroll-m-20 tw:font-semibold tw:text-xl tw:tracking-tight tw:first:mt-0 tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "aui-md-h5 tw:my-4 tw:font-semibold tw:text-lg tw:first:mt-0 tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "aui-md-h6 tw:my-4 tw:font-semibold tw:first:mt-0 tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "aui-md-p tw:mt-5 tw:mb-5 tw:leading-7 tw:first:mt-0 tw:last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "aui-md-a tw:font-medium tw:text-primary tw:underline tw:underline-offset-4",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("aui-md-blockquote tw:border-l-2 tw:pl-6 tw:italic", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn("aui-md-ul tw:my-5 tw:ml-6 tw:list-disc tw:[&>li]:mt-2", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("aui-md-ol tw:my-5 tw:ml-6 tw:list-decimal tw:[&>li]:mt-2", className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("aui-md-hr tw:my-5 tw:border-b", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <table
      className={cn(
        "aui-md-table tw:my-5 tw:w-full tw:border-separate tw:border-spacing-0 tw:overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "aui-md-th tw:bg-muted tw:px-4 tw:py-2 tw:text-left tw:font-bold tw:first:rounded-tl-lg tw:last:rounded-tr-lg tw:[[align=center]]:text-center tw:[[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "aui-md-td tw:border-b tw:border-l tw:px-4 tw:py-2 tw:text-left tw:last:border-r tw:[[align=center]]:text-center tw:[[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn(
        "aui-md-tr tw:m-0 tw:border-b tw:p-0 tw:first:border-t tw:[&:last-child>td:first-child]:rounded-bl-lg tw:[&:last-child>td:last-child]:rounded-br-lg",
        className,
      )}
      {...props}
    />
  ),
  sup: ({ className, ...props }) => (
    <sup
      className={cn("aui-md-sup tw:[&>a]:text-xs tw:[&>a]:no-underline", className)}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "aui-md-pre tw:overflow-x-auto tw:rounded-t-none! tw:rounded-b-lg tw:bg-black tw:p-4 tw:text-white",
        className,
      )}
      {...props}
    />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(
          !isCodeBlock &&
            "aui-md-inline-code tw:rounded tw:border tw:bg-muted tw:font-semibold",
          className,
        )}
        {...props}
      />
    );
  },
  CodeHeader,
});