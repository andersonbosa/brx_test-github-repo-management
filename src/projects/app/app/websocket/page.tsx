import { SocketIOClient } from '@/components/WebSocketClient'


// https://socket.io/how-to/use-with-react
const SocketIOClientPage = () => {
  return (
    <div>
      <SocketIOClient url={'http://localhost:3000'} />
    </div>
  )
}

export default SocketIOClientPage
