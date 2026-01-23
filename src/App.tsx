import { Chatbot } from "./components/chatbot";
import type { ChatApiUrls } from "./components/chatbot";

function App() {
  const userId = 4356;

  // API URLs configuration for testing
  const apiUrls: ChatApiUrls = {
    chatHistory:
      "https://n8nnew.mpajujuy.gob.ar/webhook/b57eb0cf-1892-4b54-a479-e99c2792ea77/chatbot/mensaje/recuperar-por-id-sesion",
    chatList:
      "https://n8nnew.mpajujuy.gob.ar/webhook/4bdfa13f-8b20-450e-97c2-652092b739d4/chatbot/conversacion/recuperar-por-id-usuario",
    deleteChat:
      "https://n8nnew.mpajujuy.gob.ar/webhook/2d1ed74a-5480-44ce-9f63-6b527ae2287c/chatbot/conversacion/borrar",
    sendMessage: "https://n8nnew.mpajujuy.gob.ar/webhook/chatbot",
  };

  return <Chatbot apiUrls={apiUrls} userId={userId} />;
}

export default App