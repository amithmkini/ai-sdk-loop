// Copied from https://github.com/mckaywrigley/chatbot-ui/blob/0c6f619eb33c8d9b4203cab9be751373f8259725/components/messages/message-markdown.tsx

import React, { FC, memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { MessageCodeBlock } from "./message-codeblock"
import Image from "next/image"


const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)

interface MessageMarkdownProps {
  content: string
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        img({ node, ...props }) {
          return <Image alt="Response" className="max-w-[67%]" {...props as any} />
        },
        code({ node, className, children, ...props }) {
          const childArray = React.Children.toArray(children)
          const firstChild = childArray[0] as React.ReactElement
          const firstChildAsString = React.isValidElement(firstChild)
            ? (firstChild as React.ReactElement).props.children
            : firstChild

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍")
          }

          const match = /language-(\w+)/.exec(className || "")

          if (
            typeof firstChildAsString === "string" &&
            !firstChildAsString.includes("\n")
          ) {
            return (
              <code className={className} {...props}>
                {childArray}
              </code>
            )
          }

          return (
            <MessageCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          )
        }
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  )
}