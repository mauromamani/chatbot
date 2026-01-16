// Export main components
export { AssistantModal } from "./components/assistant-modal";
export type { AssistantModalProps } from "./components/assistant-modal";
export { ChatSidebar } from "./components/chat-sidebar";
export type { ChatSidebarProps, ChatItem } from "./components/chat-sidebar";
export { MyRuntimeProvider } from "./providers/runtime.provider";
export type { RuntimeProviderProps } from "./providers/runtime.provider";

// Export UI components (optional, for customization)
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
export { Button, buttonVariants } from "./components/ui/button";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";

// Import styles - this will be bundled by Vite
import "./index.css";

