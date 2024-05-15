import { ChatList } from "@/components/chat-list"
import InputPrompt from "@/components/input-prompt"

import { UserMessage, BotMessage, SystemMessage, SpinnerMessage } from "@/components/messages/message"


const messages = [
  {
    display: <UserMessage content="Hello" />,
  },
  {
    display: <SystemMessage content="This is a system message" />,
  },
  {
    display: <BotMessage content="Hi there" />,
  },
  {
    display: <UserMessage content="How are you?" />,
  },
  {
    display: <BotMessage content="I'm doing well, thank you" />,
  },
  {
    display: <SpinnerMessage />,
  }
]

export default function Home() {
  return (
    <div className="flex flex-col flex-grow h-full focus-visible:outline-0">
      <div>
        <div className="pb-[200px] pt-4 md:pt-10">
          <ChatList messages={messages} />
        </div>
        <InputPrompt />
      </div>
    </div>
  )
}
