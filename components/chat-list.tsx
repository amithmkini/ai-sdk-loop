import { UIState } from "@/lib/types"

export function ChatList({ messages }: { messages: UIState }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message) => {
        if (message.display === null) return null;
        if (Array.isArray(message.display) && 
            !message.display.some(
              item => item !== null && item !== undefined)) {
          return null;
        }

        return (
          <div key={message.id}>
            {message.display !== null && message.display}
          </div>
        );
      })}
    </div>
  )
}
