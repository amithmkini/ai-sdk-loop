'use client'

import dynamic from 'next/dynamic'

export const Schedule = dynamic(
  () => import('./calendar').then((mod) => mod.Schedule),
  { 
    ssr: false
  }
)

export const SearchContacts = dynamic(
  () => import('./search-contact').then((mod) => mod.SearchContacts),
  { 
    ssr: false
  }
)

export const SearchNearby = dynamic(
  () => import('./search-nearby').then((mod) => mod.SearchNearby),
  { 
    ssr: false
  }
)
