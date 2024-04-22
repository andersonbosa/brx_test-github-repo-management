import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import http from 'node:http'

import { AppConfigType } from '../../../configs/app.config'
import RequestID from './middlewares/rid.middleware'
import router from './routes/router'
import { pinoHttp } from 'pino-http'
import { logger } from '../../../adapters/services/logger.service'
import morgan from 'morgan'


function CreateExpressApp (cfg: AppConfigType): express.Application {
  const app = express()

  app.use(cfg.logging.useMorgan ? morgan('dev') : pinoHttp({ logger }))
  app.use(express.json())
  // app.use(express.urlencoded({ extended: true }))
  app.use(helmet())
  app.use(cors(cfg.security.cors))
  app.use(RequestID())

  app.use(router)

  return app
}

function RunExpressApp (config: AppConfigType): http.Server {
  const app = CreateExpressApp(config)

  const runningApp = app.listen(
    config.http.port,
    () => {
      console.log(`\r
        \r🚀 [ExpressJS]
        \r   Process started on pid: ${process.pid}
        \r   Environment: ${config.env}
        \r   Listening on port: ${config.http.port}
      `)
    }
  )

  return runningApp
}

export { CreateExpressApp, RunExpressApp }
