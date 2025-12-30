import { AssistantModal } from "./components/assistant-modal"
import { MyRuntimeProvider } from "./providers/runtime.provider"

function App() {
  return (
    <MyRuntimeProvider apiUrl="http://localhost:3001/api/chat">
      <AssistantModal />
    </MyRuntimeProvider>
  )
}

export default App