"use client"

import { useActions, useUIState } from "ai/rsc"
import { nanoid } from "nanoid"
import { useState, useRef, useEffect } from "react"
import Textarea from "react-textarea-autosize"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { type AI } from "@/lib/actions"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { UserMessage } from "./messages/message"

export default function PromptForm() {

  const [inputValue, setInputValue] = useState('')
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = inputValue.trim()
    setInputValue('')

    if (value === '') {
      return
    }

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage content={value} />,
      }
    ])

    const responseMessage = await submitUserMessage(value)
    setMessages(currentMessages => [
      ...currentMessages,
      responseMessage
    ])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        if (
          e.target &&
          ['INPUT', 'TEXTAREA'].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);

  return (
    <div className="fixed inset-x-0 bottom-2 w-full">
      <div className="mx-auto sm:max-w-2xl rounded-lg bg-gray-200 dark:bg-gray-800">
        <form
          ref={formRef}
          onSubmit={handleOnSubmit}
          className="flex flex-row items-center gap-1"
        >
          <div className="relative flex flex-col grow max-h-60"> 
            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              placeholder="Send a message..."
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={inputValue === ''}
            size="icon"
            className="bg-gray-700 hover:bg-gray-600 focus:outline-none mx-2"
          >
            <ArrowRightIcon className="h-5 w-5 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}