import { createServer } from 'http'
import { DependencyContainer } from '../configs/dependency.config'
import { CreateExpressApp } from './http/express/app'
import { createSocketIOServer } from './http/express/websockets'


export async function RunInfrastructure () {
  /**
   * database and other dependencies
   */

  // mariadb connection
  // redis connection
  // rabbitmq connection


  /**
   * main services
   */

  // express app
  const expressApp = CreateExpressApp(DependencyContainer.config)

  // http server
  const httpServer = createServer(expressApp)

  // websockets server
  const websocketsServer = createSocketIOServer(httpServer, DependencyContainer.config)

  httpServer.listen(
    DependencyContainer.config.http.port,
    () => {
      console.log(`\r
        \r🚀 [ExpressJS]
        \r   Process started on pid: ${process.pid}
        \r   Environment: ${DependencyContainer.config.env}
        \r   Listening on port: ${DependencyContainer.config.http.port}
      `)
    }
  )
  // tasks worker
  // notifications worker


  // return a instance that extends EventEmitter class to work with events
}

RunInfrastructure()