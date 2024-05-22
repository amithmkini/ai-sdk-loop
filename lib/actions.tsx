import "server-only"

import {
  JSONValue,
  OpenAIStream,
  ToolCallPayload,
} from "ai"
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState
} from "ai/rsc"

import { nanoid } from "nanoid"
import OpenAI from "openai"
import {
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions'

import {
  AIState,
  UIState,
  OpenAIMessage,
} from '@/lib/types'
import {
  UserMessage,
  BotMessage,
  SystemMessage,
  SpinnerMessage
} from "@/components/messages"
import {
  SearchContacts,
  Schedule,
  SearchNearby
} from "@/components/event"

import { Tools } from "@/lib/tools"
import { runAsyncFnWithoutBlocking } from "./utils"
import { ReactNode } from "react"
import { systemPrompt } from "./system-prompt"


export const dynamic = "force-dynamic"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const model = process.env.OPENAI_MODEL || "gpt-4o"
const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || "0.7")


async function fetchUsers() {
  // Simulate an async operation, such as a fetch request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: "max",
          username: "@mleiter",
          avatar: "https://vercel.com/api/www/avatar?u=mleiter&s=44$"
        },
        {
          name: "shu",
          username: "@shuding",
          avatar: "https://vercel.com/api/www/avatar?u=shuding&s=44$"
        }
      ])
    }, 2000) // Simulating a 1 second delay
  })
}

async function getEvents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: "Studio", startTime: 16, endTime: 18 },
      ])
    }, 2000) // Simulating a 1 second delay
  })
}

async function createEvent(
  additionalEvent: { title: string; startTime: number; endTime: number }
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = [
        { title: "Studio", startTime: 16, endTime: 18 },
        additionalEvent
      ]
      resolve(events)
    }, 2000) // Simulating a 1 second delay
  })
}

async function fetchPlaces() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "wild colonial", distance: "200m" },
        { name: "the eddy", distance: "1.3km" }
      ])
    }, 2000) // Simulating a 1 second delay
  })

}


async function submitUserMessage(content: string) {
  "use server"

  const aiState = getMutableAIState<typeof AI>()

  // Assign a constant user ID, ideally, you'd get this 
  // from auth
  const user = "@jrmy"

  const system = systemPrompt(user)

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content
    }
  ])

  const response = await openai.chat.completions.create({
    model,
    temperature,
    stream: true,
    messages: [
      system,
      ...aiState.get()
    ] as ChatCompletionMessageParam[],
    tools: Tools
  })

  const responseUI = createStreamableUI()

  runAsyncFnWithoutBlocking(async () => {
    let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    let textNode: undefined | ReactNode
    let textValue: string = ''
  
    const stream = OpenAIStream(response, {
      onCompletion(completion) {
        if (textStream && textNode) {
          textStream.done()

          textStream = undefined
          textNode = undefined

          aiState.update([
            ...aiState.get(),
            {
              role: "assistant",
              content: textValue
            }
          ])
          textValue = ''
        }
      },
      experimental_onToolCall: async (
        call: ToolCallPayload,
        appendToolCallMessage,
      ) => {
        let newMessages: OpenAIMessage[] = []

        const toolCallMessage: OpenAIMessage = {
          role: "assistant",
          content: "",
          tool_calls: call.tools.map((toolCall) => ({
            id: toolCall.id,
            type: toolCall.type,
            function: {
              name: toolCall.func.name,
              arguments: JSON.stringify(toolCall.func.arguments)
            }
          }))
        }

        for (const toolCall of call.tools) {
          let output: JSONValue = null

          if (toolCall.func.name === "searchContacts") {
            const query = toolCall.func.arguments.query as string
            const functionStr = `searchContacts(\"${query}\")`
            responseUI.append(<SystemMessage content={functionStr} />)
            const contacts = await fetchUsers()
            // Add the contacts to the output
            output = {
              success: true,
              contacts: contacts as JSONValue
            }
            responseUI.append(<SearchContacts users={contacts as any}/>)
          } else if (toolCall.func.name === "getEvents") {
            const date = toolCall.func.arguments.date as string
            const contacts = toolCall.func.arguments.contacts as string[]
            const functionStr = `getEvents(\"${date}\", [${contacts.join(", ")}])`
            responseUI.append(<SystemMessage content={functionStr} />)
            const events = await getEvents()
            // Add the events to the output
            output = {
              success: true,
              events: events as JSONValue
            }
            responseUI.append(<Schedule events={events as any} />)
          } else if (toolCall.func.name === "searchNearby") {
            const placeType = toolCall.func.arguments.type as string
            const functionStr = `searchNearby(\"${placeType}\")`
            responseUI.append(<SystemMessage content={functionStr} />)
            const places = await fetchPlaces()
            // Add the places to the output
            output = {
              success: true,
              places: places as JSONValue
            }
            responseUI.append(<SearchNearby locations={places as any}/>)
          } else if (toolCall.func.name === "createEvent") {
            const name = toolCall.func.arguments.name as string
            const date = toolCall.func.arguments.date as string
            const startTime = toolCall.func.arguments.startTime as number
            const endTime = toolCall.func.arguments.endTime as number
            const contacts = toolCall.func.arguments.contacts as string[]

            const functionStr = `createEvent(\"${name}\", \"${date}\", ${startTime}, ${endTime}, [${contacts.join(", ")}])`
            responseUI.append(<SystemMessage content={functionStr} />)
            const events = await createEvent({ title: name, startTime, endTime })
            // Add the events to the output
            output = {
              success: true,
              events: events as JSONValue
            }
            responseUI.append(<Schedule events={events as any} />)
          } else {
            console.error(`Unknown function: ${toolCall.func.name}`)
          }

          newMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(output || { success: false })
          })
        }

        aiState.update([
          ...aiState.get(),
          toolCallMessage,
          ...newMessages
        ])

        return openai.chat.completions.create({
          model,
          temperature,
          stream: true,
          messages: [
            system,
            ...aiState.get()
          ] as ChatCompletionMessageParam[],
          tools: Tools
        })
      },
      onText(text) {
        if (!textStream) {
          textStream = createStreamableValue('')
          textNode = <BotMessage content={textStream.value} />
          responseUI.append(textNode)
        } 
        textStream.update(text)
        textValue += text
      },
    })

    const reader = stream.getReader()
    while (true) {
      const { done } = await reader.read()
      if (done) {
        responseUI.done()
        aiState.done(aiState.get())
        break
      }
    }
  })

  return {
    id: nanoid(),
    display: responseUI.value
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

const getDisplayContent = (message: OpenAIMessage) => {
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
