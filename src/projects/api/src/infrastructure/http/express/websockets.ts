import express from 'express'
import http, { createServer } from 'node:http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { WebSocket, WebSocketServer as WsServer } from 'ws'
import { AppConfigType } from './../../../configs/app.config'


export function createSocketIOServerFromExpress (app: express.Application, config: AppConfigType) {
  const http = createServer(app)

  // Add this to where your other requires are
  const sio = new SocketIOServer(http, {
    cors: config.security.cors
  })
  // Above our `app.get("/users")` handler
  sio.on("connection", (socket: Socket) => {
    console.log(`[ ⚡] ${socket.id} user just connected!`)

    socket.on('message', (data) => {
      console.log('[ ⚡] from client:', data)
    })

    socket.on("disconnect", () => {
      console.log(`[ ⚡] ${socket.id} user disconnected!`)
    })
  })

  app.set('io', sio)
  return http
}

export function createSocketIOServer (http: http.Server, config: AppConfigType) {
  // Add this to where your other requires are
  const sio = new SocketIOServer(http, {
    cors: config.security.cors,
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    }
  })
  // Above our `app.get("/users")` handler
  sio.on("connection", (socket: Socket) => {
    console.log(`[ ⚡] ${socket.id} user just connected!`)

    socket.on('message', (data) => {
      console.log('[ ⚡] from client:', data)
    })

    socket.on("disconnect", () => {
      console.log("[ ⚡] A user disconnected")
    })
  })

  return http
}

export function createWebSocketServer (http: http.Server) {
  const wss = new WsServer({
    server: http,
  })

  setInterval(
    () => {
      wss.clients.forEach(client => {
        client.send('ping from server')
      })
    },
    1000
  )

  wss.on("connection", (socket: WebSocket) => {
    //console.log(`[wss]: ${socket.url} socket just connected!`)

    socket.on('message', (data) => {
      //console.log('[wss]', data.toString())
    })

    socket.on("disconnect", () => {
      //console.log('[wss] A user disconnected')
    })
  })

  return http
}