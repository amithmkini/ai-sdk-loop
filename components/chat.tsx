"use client"

import { useUIState } from "ai/rsc"

import { ChatList } from "@/components/chat-list"
import InputPrompt from "@/components/input-prompt"
import type { AI } from "@/lib/actions"

export function Chat() {
  const [messages] = useUIState<typeof AI>()
  
  return (
    <div className="flex flex-col flex-grow h-full focus-visible:outline-0">
      <div>
        <div className="pb-[200px] pt-4 md:pt-10">
          <ChatList messages={messages}/>
        </div>
        <InputPrompt />
      </div>
    </div>
  )
}
