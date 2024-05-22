import type { Function as ToolFunc, Tool } from 'ai'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const searchContacts: ToolFunc = {
  name: 'searchContacts',
  description: 'Search for contacts',
  parameters: zodToJsonSchema(
    z.object({
      query: z.string().describe('The name to search')
    }).required()
  )
}

const getEvents: ToolFunc = {
  name: 'getEvents',
  description: 'Get events for a particular date and list of contacts',
  parameters: zodToJsonSchema(
    z.object({
      date: z.string().describe('The date to search'),
      contacts: z.array(z.string()).describe('The contacts to search')
    }).required()
  )
}

const searchNearby: ToolFunc = {
  name: 'searchNearby',
  description: 'Search for nearby places by type',
  parameters: zodToJsonSchema(
    z.object({
      type: z.string().describe('The type of place to search'),
    }).required()
  )
}

const createEvent: ToolFunc = {
  name: 'createEvent',
  description: 'Create a new event',
  parameters: zodToJsonSchema(
    z.object({
      name: z.string().describe('The name of the event (with the location)'),
      date: z.string().describe('The date of the event'),
      startTime: z.number().int().describe('The start hour of the event in 24h'),
      endTime: z.number().int().describe('The end hour of the event in 24h'),
      contacts: z.array(z.string()).describe('The contacts to create event for')
    }).required()
  )
}

export const Tools: Tool[] = [
  searchContacts,
  getEvents,
  searchNearby,
  createEvent
]  
  .map(tool => (
  {
    type: 'function',
    function: tool
  }
))
