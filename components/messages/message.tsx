"use client"

import { StreamableValue } from "ai/rsc"
import { RobotOutlined } from "@ant-design/icons"

import { MessageMarkdown } from "./markdown"
import { spinner } from "./spinner"

import { useStreamableText } from "@/lib/hooks/use-streamable-text"

interface MessageProps {
  content: string | StreamableValue<string>
}

export function UserMessage({ content }: MessageProps ) {
  const text = useStreamableText(content)
  return (
    <div className="flex flex-col justify-center md:-ml-12 items-end rtl:items-start">
      <div className="relative max-w-[90%] rounded-3xl px-5 py-2.5 bg-gray-200 dark:bg-gray-900">
        <MessageMarkdown content={text} />
      </div>
    </div>
  );
}

export function BotMessage({ content }: MessageProps ) {
  const text = useStreamableText(content)
  return (
    <div className="flex flex-row justify-center md:-ml-12 items-center">
      <div className="flex size-8 select-none items-center justify-center rounded-full border bg-background shadow-sm">
        <RobotOutlined />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 flex items-center">
        <MessageMarkdown content={text} />
      </div>
    </div>
  );
}

export function SystemMessage({ content }: { content: string }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial'}>{content}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="flex flex-row justify-center md:-ml-12 items-center">
      <div className="flex size-8 select-none items-center justify-center rounded-full border bg-background shadow-sm">
        <RobotOutlined />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 flex items-center">
        {spinner}
      </div>
    </div>
  )
}
