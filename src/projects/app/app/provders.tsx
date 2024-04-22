'use client'


import { RootProvider } from '@/contexts'
import { EventProvider } from '@/contexts/events'
import React from 'react'


export interface CommonProvider {
  children: React.ReactNode
}

export const Providers = ({ children }: CommonProvider): React.ReactNode => {
  return (
    <>
      <RootProvider>
        <EventProvider>
          {children}
        </EventProvider>
      </RootProvider>
    </>
  )
}