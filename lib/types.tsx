import { JSONValue, Message } from "ai"

export type ToolCallResponse = {
  tool_call_id: string;
  function_name: string;
  function_args?: JSONValue;
  tool_call_result: JSONValue;
}

export type AIState = Message[]

export type UIState = {
  id: string
  display: React.ReactNode
}[]
