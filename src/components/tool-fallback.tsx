import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isCancelled =
    status?.type === "incomplete" && status.reason === "cancelled";
  const cancelledReason =
    isCancelled && status.error
      ? typeof status.error === "string"
        ? status.error
        : JSON.stringify(status.error)
      : null;

  return (
    <div
      className={cn(
        "aui-tool-fallback-root tw:mb-4 tw:flex tw:w-full tw:flex-col tw:gap-3 tw:rounded-lg tw:border tw:py-3",
        isCancelled && "tw:border-muted-foreground/30 tw:bg-muted/30",
      )}
    >
      <div className="aui-tool-fallback-header tw:flex tw:items-center tw:gap-2 tw:px-4">
        {isCancelled ? (
          <XCircleIcon className="aui-tool-fallback-icon tw:size-4 tw:text-muted-foreground" />
        ) : (
          <CheckIcon className="aui-tool-fallback-icon tw:size-4" />
        )}
        <p
          className={cn(
            "aui-tool-fallback-title tw:grow",
            isCancelled && "tw:text-muted-foreground tw:line-through",
          )}
        >
          {isCancelled ? "Cancelled tool: " : "Used tool: "}
          <b>{toolName}</b>
        </p>
        <Button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="aui-tool-fallback-content tw:flex tw:flex-col tw:gap-2 tw:border-t tw:pt-2">
          {cancelledReason && (
            <div className="aui-tool-fallback-cancelled-root tw:px-4">
              <p className="aui-tool-fallback-cancelled-header tw:font-semibold tw:text-muted-foreground">
                Cancelled reason:
              </p>
              <p className="aui-tool-fallback-cancelled-reason tw:text-muted-foreground">
                {cancelledReason}
              </p>
            </div>
          )}
          <div
            className={cn(
              "aui-tool-fallback-args-root tw:px-4",
              isCancelled && "tw:opacity-60",
            )}
          >
            <pre className="aui-tool-fallback-args-value tw:whitespace-pre-wrap">
              {argsText}
            </pre>
          </div>
          {!isCancelled && result !== undefined && (
            <div className="aui-tool-fallback-result-root tw:border-t tw:border-dashed tw:px-4 tw:pt-2">
              <p className="aui-tool-fallback-result-header tw:font-semibold">
                Result:
              </p>
              <pre className="aui-tool-fallback-result-content tw:whitespace-pre-wrap">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};