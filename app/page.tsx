import { ChatList } from "@/components/chat-list"
import InputPrompt from "@/components/input-prompt"

import { UserMessage, RobotMessage } from "@/components/messages"


const messages = [
  {
    display: <UserMessage>Hi</UserMessage>,
  },
  {
    display: <RobotMessage>Hello</RobotMessage>,
  },
  {
    display: <UserMessage>How are you?</UserMessage>,
  },
  {
    display: <RobotMessage>Good, thanks</RobotMessage>,
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
