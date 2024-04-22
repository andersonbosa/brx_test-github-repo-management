'use client'

import axios from 'axios'
import { KeyboardEvent, useEffect, useState } from 'react'

import { toast } from 'react-toastify'



const WS_URL = 'ws://localhost:3000/'



// function TestOne () {
//   /* CONSTANTS */
//   const WS_URL = 'ws://localhost:3000/ws'

//   /* UTILS */
//   const getSessionId = () => document.cookie.split('; ').find(row => row.startsWith('session-id='))?.split('=')[1] ?? ''
//   const createWebSocketPayload = (data: any, metadata: any) => JSON.stringify({ data, metadata: { sessionId, ...metadata } })

//   /* STATES */
//   const [isLoading, setIsLoading] = useState(false)
//   const [notification, setNotification] = useState('')
//   const [socket, setSocket] = useState<Socket | null>(null)
//   const [sessionId, setSessionId] = useState<string>('')

//   /* HANDLERS */
//   const handlePedidoClick = async () => {
//     setIsLoading(true)
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/requests',
//         {
//           type: 'importer',
//           data: {
//             id: '16cfe523-5f5d-5a0c-86e7-1e1fd923abb2',
//             country: 'China',
//             name: 'Alta Robinson',
//           },
//         },
//         {
//           withCredentials: true, /* Permitir o envio de cookies na requisição */
//         }
//       )
//       //console.log('response.data', response.data)
//     } catch (error) {
//       console.error('Erro ao fazer o pedido:', error)
//     }
//     setIsLoading(false)
//   }

//   function sendMessage (event: any) {
//     if (event.code && event.code !== 'Enter') return
//     //console.log('sendMessage', event.code)

//     socket?.emit('message', `[sendMessage] ${event.target.value}`)
//   }

//   /* CLIENT-SIDE */
//   function setupWebSocket () {
//     'use client'

//     const socket = io(WS_URL, {
//       auth: {
//         serverOffset: 0
//       }
//     })

//     socket.on('connect', () => {
//       //console.log('[wss] Conexão estabelecida.', socket.id)

//       socket.emit('message', 'Hello Server!')
//     })

//     socket.on('message', data => {
//       //console.log('[wss] Mensagem do servidor:', data)
//       setNotification(data.message)
//     })

//     socket.on('disconnect', () => {
//       //console.log('[wss] Conexão fechada.')
//     })

//     setSocket(socket)

//     return () => {
//       socket.disconnect()
//     }
//   }

//   async function setupSessionId () {
//     try {
//       // const response = await axios.get('http://localhost:3000/', { withCredentials: true })
//       // //console.log('setupSessionId', response)
//       // debugger
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(
//     () => {
//       setupSessionId()
//       // setupWebSocket()
//     }, []
//   )

//   return (
//     <div className="h-[100vh] text-center flex flex-col justify-center">
//       <h1 className="text-xl font-bold">DEMONHOOO!!! 👺</h1>
//       <br />
//       <div>
//         <button onClick={handlePedidoClick} disabled={isLoading}>
//           <span className=" p---(2) border border-green-300 border border-l-8 hover:bg-green-300">
//             {isLoading ? 'Enviando Pedido...' : 'Solicitar Pedido'}
//           </span>
//         </button>
//       </div>
//       <br />
//       <div onKeyDown={sendMessage}>
//         <input
//           type="text"
//           placeholder="type your message"
//           className="p---(1) text-black mb-4"
//         />
//         <input
//           type="button"
//           value="enviar"
//           className="p---(1) border border-green-300 border border-l-4 hover:bg-green-300"
//           onClick={sendMessage}
//         />
//       </div>
//       <div>{notification && <p>Notificação: {notification}</p>}</div>
//     </div>
//   )
// }

import { io } from "socket.io-client"


const TestTwo = (props: {}) => {
  const [connection, setConnection] = useState<any>(undefined)
  const [sessionId, setSessionId] = useState<any>(null)
  const [messages, setMessages] = useState<any>(['hi'])


  const notify = (msg: string) => toast(msg)

  const setupWebSocket = () => {
    // const socket = new WebSocket("ws://localhost:3000/")
    const socket = io("ws://localhost:3000/", {
      autoConnect: true,
      withCredentials: true
      // auth: sessionId,
    })

    socket.on("open", (event) => {
      socket.send("Connection established")
      notify("Connection established")
    })

    socket.on("message", (event) => {
      notify('Message received from Server')
      //console.log("Message from server ", event.data)
      setMessages(
        messages.concat([event.data])
      )
    })

    socket.on("close", (event) => {
      notify("Connection closed")
      socket.close()
    })

    setConnection(socket)
    return () => {
      socket.close()
    }
  }


  const setupSessionId = () => {
    // Função para obter o cookie de sessão da API
    const getSessionId = async () => {
      try {
        const response = await axios.get('http://localhost:3000/', { withCredentials: true })
        const sessionIdFromResponse = response.headers['session-id']
        setSessionId(sessionIdFromResponse)
      } catch (error) {
        console.error('Erro ao obter session-id:', error)
      }
    }

    getSessionId()

    return () => {
      // Limpar qualquer manipulação de recursos aqui, se necessário
    }
  }

  useEffect(setupSessionId, [])
  useEffect(setupWebSocket, [])

  function sendMessageToServer (event: KeyboardEvent<HTMLInputElement>): void {
    if (event.code.toLowerCase() !== 'enter') {
      return
    }

    const msg = event.currentTarget.value
    //console.log('sendMessageToServer', msg)
    connection.emit('message', msg)
    notify('Message sent')
    event.currentTarget.value = ''
  }

  return (
    <div>
      <div>
        <br />
        <input
          className='border-2 p---(2) border-blue-600'
          type="text"
          placeholder='type your message here'
          onKeyDown={sendMessageToServer} />
      </div>
      <br />
      <div>
        <h3>Messages from server</h3>
        <MessageList messages={messages} />
      </div>
    </div>
  )
}
const MessageList = ({ messages }: { messages: any[] }) => {
  return (
    <div>
      <ul className='list-disc border border-1 border-gray-500 hover:bg-black'>
        {messages.map((message: string, i: number) => (
          <li className='list-item ' key={i}>{i}. {message}</li>
        ))}
      </ul>
    </div>
  )
}

const HomePage = (props: {}) => {
  return (
    <div className="h-[100vh] text-center flex flex-col justify-center ">
      <div>
        <h1 className="text-xl font-extrabold">WebSocket Component</h1>
        <br />
      </div>
      <div>
        <button onClick={() => toast('Ok!')}>Test Toast</button>
        <br />
      </div>
      {/* <TestOne /> */}
      <TestTwo />
    </div>
  )
}

export default HomePage

