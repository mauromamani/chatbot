import { AssistantModal } from "./components/assistant-modal"
import { MyRuntimeProvider } from "./providers/runtime.provider"

function App() {
  return (
    <MyRuntimeProvider 
      apiUrl="https://n8nnew.mpajujuy.gob.ar/webhook/chatbot"
      userId={4356}
      sessionId="ee7fd5d3-430c-492b-8c4c-f3c6ba0e6a01"
    >
      <AssistantModal />
    </MyRuntimeProvider>
  )
}

export default App