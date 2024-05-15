import { Chat } from "@/components/chat"
import { UserMessage, BotMessage, SystemMessage, SpinnerMessage } from "@/components/messages/message"
import { AI } from "@/lib/actions"
import { AIState } from "@/lib/types"
import dedent from "dedent"

const messages = [
  {
    role: "user",
    content: "Hello",
  },
  {
    role: "system",
    content: "This is a system message"
  },
  {
    role: "assistant",
    content: "Hi there"
  },
  {
    role: "user",
    content: "Fix this tailwind please: py-2 px-3 text-base md:px-4 m-auto md:px-5 lg:px-1 xl:px-5"
  },
  {
    role: "assistant",
    content: dedent`
In the given Tailwind CSS class, the \`xl:px-5\` media query is redundant 
because it has the same value as the \`lg:px-5\` media query. If you want
to keep the padding consistent from large screens (\`lg\`) and up, you
don't need to specify \`xl:px-5\` again.

Here's the simplified version:
    
\`\`\`html
  class="py-2 px-3 text-base md:px-4 lg:px-5 m-auto"
\`\`\`
    
This ensures:
- \`py-2\` for consistent vertical padding.
- \`px-3\` for small screens.
- \`md:px-4\` for medium screens.
- \`lg:px-5\` for large screens and up.
- \`m-auto\` to center the element horizontally.
`
  }
] as AIState

export default function Home() {
  return (
    <AI initialAIState={messages}>
      <Chat />
    </AI>
  )
}
