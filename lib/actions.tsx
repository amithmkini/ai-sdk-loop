import "server-only"

import {
  CoreMessage,
} from "ai"
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
  streamUI
} from "ai/rsc"
import { openai } from "@ai-sdk/openai"
import { nanoid } from "nanoid"

import {
  AIState,
  UIState
} from '@/lib/types'
import {
  UserMessage,
  BotMessage,
  SystemMessage,
  SpinnerMessage
} from "@/components/messages"


export const dynamic = "force-dynamic"

async function askLLM(iteration: number, response: any) {
  console.log("Iteration %d: Start", iteration)
  const result = createStreamableUI(<SpinnerMessage />);
  console.log("Iteration %d: Result created", iteration)
  response.append(result.value);
  console.log("Iteration %d: Result appended", iteration);
  
  // Simulate multiple calls to the API and responses
  // IIFE
  (async () => {
    console.log("Iteration %d: Async start", iteration)
    // Wait for 2 seconds before responding
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Iteration %d: Async Waited for 2 sec", iteration)
    result.done(<div>{"Response from: " + iteration}</div>)
    console.log("Iteration %d: Async Result done", iteration)
    // Ask AI 3 times before ending the conversation
    if (iteration < 2) {
      console.log("Iteration %d: Async Calling next iter", iteration)
      await askLLM(iteration + 1, response)
      console.log("Iteration %d: Async Calling next iter done", iteration)
    } else {
      console.log("Iteration %d: Async No Calling", iteration)
      response.done()
      console.log("Iteration %d: Async Response Done", iteration)
    }
  })();
  console.log("Iteration %d: Function end", iteration)
}

async function submitUserMessage() {
  "use server"

  const response = createStreamableUI(<>Testing</>)
  await askLLM(0, response)

  return {
    id: nanoid(),
    display: response.value
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
        id: nanoid(),
        display: getDisplayContent(message)
      }
    })

    return uiState
  }
})

const getDisplayContent = (message: CoreMessage) => {
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
