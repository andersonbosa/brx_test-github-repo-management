import { CommonProvider } from '@/app/provders'
import { EventEmitter } from 'events'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface EventContextType {
  emitter: EventEmitter
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export const useEventContext = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEventContext deve ser usado dentro de um provedor EventContext')
  }
  return context
}

export const EventProvider = ({ children }: CommonProvider): React.ReactNode => {
  const [emitter, _] = useState(new EventEmitter())

  // Clean the emitter when the component is unmounted to avoid memory leakage
  useEffect(
    () => {
      return () => {
        emitter.removeAllListeners()
      }
    },
    []
  )

  return (
    <EventContext.Provider value={{ emitter }}>
      {children}
    </EventContext.Provider>
  )
}


/* TODO melhoria centralizar eventos em uma constante e arquivo separado */
export const EVENT_TYPES = {
  TRIGGER: {
    GITHUB_REPOSITORY_SEARCH: 'TRIGGER:GITHUB_REPOSITORY_SEARCH',
  },
}