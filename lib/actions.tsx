import "server-only"

import {
  createAI,
  getAIState
} from "ai/rsc"

import { 
  AIState,
  UIState
} from '@/lib/types'
import { runAsyncFnWithoutBlocking } from "@/lib/utils"
import { Message } from "ai"
import { BotMessage, SystemMessage, UserMessage } from "@/components/messages/message"


export const AI = createAI<AIState, UIState>({
  actions: {},
  initialUIState: [],
  initialAIState: [],
  onGetUIState: async () => {
    "use server"

    // Honestly, this is only needed because I have sample
    // data in the Chat component. In a real-world scenario,
    // you would be loading data from DB or some other source.
    const aiState = getAIState() as AIState
    const uiState = aiState.map((message) => {
      return {
        id: message.id,
        display: getDisplayContent(message)
      }
    })

    return uiState
  }
})

const getDisplayContent = (message: Message) => {
  switch (message.role) {
    case "user":
      return <UserMessage content={message.content} />
    case "assistant":
      return <BotMessage content={message.content} />
    case "system":
      return <SystemMessage content={message.content} />
    default:
      return null
  }
}
