'use client'

import dynamic from 'next/dynamic'
// import { SpinnerMessage } from './message'

export const SpinnerMessage = dynamic(
  () => import('./message').then((mod) => mod.SpinnerMessage),
  { 
    ssr: false,
    // loading: () => <SpinnerMessage />
  }
)

export const UserMessage = dynamic(
  () => import('./message').then((mod) => mod.UserMessage),
  { 
    ssr: false,
    // loading: () => <SpinnerMessage />
  }
)

export const BotMessage = dynamic(
  () => import('./message').then((mod) => mod.BotMessage),
  { 
    ssr: false, 
    loading: () => <SpinnerMessage />
  }
)

export const SystemMessage = dynamic(
  () => import('./message').then((mod) => mod.SystemMessage),
  { 
    ssr: false, 
    loading: () => <SpinnerMessage />
  }
)
