"use client";

import { type ComponentPropsWithRef, forwardRef } from "react";
import { Slottable } from "@radix-ui/react-slot";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TooltipIconButtonProps = ComponentPropsWithRef<typeof Button> & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
};

export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  TooltipIconButtonProps
>(({ children, tooltip, side = "bottom", className, ...rest }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          {...rest}
          className={cn("aui-button-icon tw:size-6 tw:p-1 tw:border-0 tw:bg-transparent tw:hover:bg-transparent tw:text-muted-foreground tw:hover:text-foreground tw:shadow-none", className)}
          ref={ref}
        >
          <Slottable>{children}</Slottable>
          <span className="aui-sr-only tw:sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
});

TooltipIconButton.displayName = "TooltipIconButton";