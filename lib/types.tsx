import { Message } from "ai"

export type OpenAIMessage = Omit<Message, 'id'>

export type AIState = Array<OpenAIMessage>

export type UIState = {
  id: string
  display: React.ReactNode
}[]
