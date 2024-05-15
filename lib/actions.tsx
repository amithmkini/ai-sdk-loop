import "server-only"


import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState
} from "ai/rsc"
import { Message } from "ai"

import { nanoid } from "nanoid"

import { 
  AIState,
  UIState
} from '@/lib/types'
import { runAsyncFnWithoutBlocking } from "@/lib/utils"
import { BotMessage, SystemMessage, UserMessage, SpinnerMessage } from "@/components/messages/message"


async function submitUserMessage(content: string) {
  "use server"

  const aiState = getMutableAIState<typeof AI>()

  // Add the user message to the AI state
  aiState.update([
    ...aiState.get(),
    {
      id: nanoid(),
      role: "user",
      content
    }
  ])

  // For now, add some delay to simulate the AI thinking
  // and respond back with the same message
  const responseUI = createStreamableUI(<></>)
  const spinnerUI = createStreamableUI(<SpinnerMessage />)
  const spinnerWithResponseUI = createStreamableUI(
    <>
      {responseUI.value}
      {spinnerUI.value}
    </>
  )

  runAsyncFnWithoutBlocking(async () => {
    // Wait for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the spinner UI to the response
    responseUI.done(<BotMessage content={content + "!!!"} />)
    spinnerUI.done(<></>)
    spinnerWithResponseUI.done()
    aiState.done([
      ...aiState.get(),
    ])
  })

  return {
    id: nanoid(),
    display: spinnerWithResponseUI.value
  }
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
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
