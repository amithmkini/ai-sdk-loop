import { CoreMessage } from "ai"

export type AIState = Array<CoreMessage>

export type UIState = {
  id: string
  display: React.ReactNode
}[]
