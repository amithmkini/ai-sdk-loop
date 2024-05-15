import { Chat } from "@/components/chat"
import { UserMessage, BotMessage, SystemMessage, SpinnerMessage } from "@/components/messages/message"
import { AI } from "@/lib/actions"
import { AIState } from "@/lib/types"

const messages = [
  {
    id: "1",
    role: "user",
    content: "Hello",
  },
  {
    id: "2",
    role: "system",
    content: "This is a system message"
  },
  {
    id: "3",
    role: "assistant",
    content: "Hi there"
  },
  {
    id: "4",
    role: "user",
    content: "How are you?"
  },
  {
    id: "5",
    role: "assistant",
    content: "I'm doing well, thank you"
  }
] as AIState

export default function Home() {
  return (
    <AI initialAIState={messages}>
      <Chat />
    </AI>
  )
}
