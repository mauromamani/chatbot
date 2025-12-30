import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";

export interface RuntimeProviderProps {
  children: ReactNode;
  apiUrl?: string;
}

// async function* backendApi({ messages, abortSignal, context, apiUrl }) {
//   const response = await fetch(apiUrl || "http://127.0.0.1:3001/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages }),
//     signal: abortSignal,
//   });

//   const reader = response.body?.getReader();
//   const decoder = new TextDecoder("utf-8");

//   let buffer = "";
//   while (true) {
//     const { done, value } = await reader?.read();
//     if (done) break;
//     buffer += decoder.decode(value, { stream: true });

//     const parts = buffer.split("\n\n");
//     buffer = parts.pop() || "";

//     for (const part of parts) {
//       if (part.startsWith("data:")) {
//         const data = part.replace("data: ", "").trim();
//         if (data === "[DONE]") return;
//         yield JSON.parse(data);
//       }
//     }
//   }
// }

const createModelAdapter = (apiUrl: string): ChatModelAdapter => ({
  async run({ messages, abortSignal }) {
    const result = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
      signal: abortSignal,
    });

    const data = await result.json();
    return {
      content: [
        {
          type: "text",
          text: data.text,
        },
      ],
    };
  },

  // async *run({ messages, abortSignal, context }) {
  //   const stream = await backendApi({ messages, abortSignal, context, apiUrl });

  //   let text = "";
  //   for await (const part of stream) {
  //     text += part.choices[0]?.delta?.content || "";
  //     yield {
  //       content: [{ type: "text", text }],
  //     };
  //   }
  // },
});

export function MyRuntimeProvider({
  children,
  apiUrl = "http://localhost:3001/api/chat",
}: Readonly<RuntimeProviderProps>) {
  const modelAdapter = createModelAdapter(apiUrl);
  const runtime = useLocalRuntime(modelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}