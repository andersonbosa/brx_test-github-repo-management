'use client'

import { toasty } from '@/utils'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'


interface SocketIOClientProps {
  url: string
}

export const SocketIOClient = async ({ url }: SocketIOClientProps) => {
  const socket = io(url, {
    reconnectionDelayMax: 10000,
    transports: ['websocket'],
    autoConnect: true,
    query: {
      token: '123'
    }
  })

  const [isConnected, setIsConnected] = useState<any>(socket.connected)
  const [messages, setMessages] = useState<any[]>([])
  const [messageInput, setMessageInput] = useState<string>('')

  useEffect(() => {
    function onConnect () {
      setIsConnected(true)
    }

    function onDisconnect () {
      setIsConnected(false)
    }

    function onMessageEvent (value: any) {
      setMessages(previous => [...previous, value])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('foo', onMessageEvent)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('foo', onMessageEvent)
    }
  }, [])

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit('sendMessage', messageInput)
      setMessageInput('')
    }
  }

  const handleMessageInputChange = (event: any) => {
    setMessageInput(event.target.value)
  }

  const connect = () => {
    socket.connect()
  }

  const disconnect = () => {
    socket.disconnect()
  }

  return (
    <div>
      <h2>Socket.IO Messages:</h2>
      <br />
      <div>
        <p>State: {'' + isConnected}</p>;
        <br />
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>

      <br />
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={`message-${index}`}>{message}</li>
          ))}
        </ul>
      </div>

      <br />
      <div>
        <input
          type="text"
          className="max-w-[600px] container rounded -- px-4 py-2 mb-2 -- text-stone-600 outline-[var(--primary-color-bg)]"
          value={messageInput}
          onChange={handleMessageInputChange}
          placeholder="Type your message..."
        />
        <br />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>

  )
};

