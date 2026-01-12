"use client";

import { useAssistantState } from "@assistant-ui/react";
import type { SyntaxHighlighterProps } from "@assistant-ui/react-markdown";
import mermaid from "mermaid";
import { FC, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";

export type MermaidDiagramProps = SyntaxHighlighterProps & {
  className?: string;
};

mermaid.initialize({ theme: "default", startOnLoad: false });

export const MermaidDiagram: FC<MermaidDiagramProps> = ({
  code,
  className,
}) => {
  const ref = useRef<HTMLPreElement>(null);
  const [svgText, setSvgText] = useState<string | null>(null);

  const isComplete = useAssistantState(({ part }) => {
    if (part.type !== "text") return false;
    const codeIndex = part.text.indexOf(code);
    if (codeIndex === -1) return false;
    const afterCode = part.text.substring(codeIndex + code.length);
    return /^```|^\n```/.test(afterCode);
  });

  useEffect(() => {
    if (!isComplete) return;

    (async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const result = await mermaid.render(id, code);
        if (ref.current) {
          ref.current.innerHTML = result.svg;
          result.bindFunctions?.(ref.current);
          setSvgText(result.svg);
        }
      } catch (e) {
        console.warn("Failed to render Mermaid diagram:", e);
      }
    })();
  }, [isComplete, code]);

  /** Descargar PNG */
  const downloadPNG = () => {
    if (!svgText || !ref.current) return;

    const svgElement = ref.current.querySelector("svg");
    if (!svgElement) return;

    try {
      // Obtener las dimensiones del SVG
      const svgRect = svgElement.getBoundingClientRect();
      const width = svgRect.width || 800;
      const height = svgRect.height || 600;

      // Crear un SVG con dimensiones explícitas para la conversión
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      svgClone.setAttribute("width", width.toString());
      svgClone.setAttribute("height", height.toString());

      const svgData = new XMLSerializer().serializeToString(svgClone);
      // Convertir SVG a data URL directamente
      const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }

        // Dibujar fondo blanco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Dibujar la imagen SVG
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            const pngUrl = URL.createObjectURL(blob);
            triggerDownload(pngUrl, "diagram.png");
            URL.revokeObjectURL(pngUrl);
          },
          "image/png"
        );
      };

      img.onerror = () => {
        console.error("Error al cargar la imagen SVG");
      };

      img.src = dataUrl;
    } catch (error) {
      console.error("Error al descargar PNG:", error);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="tw:relative">
      {svgText && (
        <div className="tw:absolute tw:right-2 tw:top-2 tw:flex tw:gap-2">
          <Button
            onClick={downloadPNG}
            size="icon"
            className="tw:size-5 tw:p-0 tw:rounded-sm tw:border-none tw:border/80"
            variant="outline"
          >
            <DownloadIcon />
          </Button>
        </div>
      )}

      <pre
        ref={ref}
        className={cn(
          "aui-mermaid-diagram tw:rounded-b-lg tw:bg-muted tw:p-2 tw:text-center tw:[&_svg]:mx-auto",
          className,
        )}
      >
        Drawing diagram...
      </pre>
    </div>
  );
};

MermaidDiagram.displayName = "MermaidDiagram";
