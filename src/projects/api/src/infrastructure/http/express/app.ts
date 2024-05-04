import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import http from 'node:http'

import morgan from 'morgan'
import { pinoHttp } from 'pino-http'
import { logger } from '../../../adapters/services/logger.service'
import { AppConfigType } from '../../../configs/app.config'
import RequestID from './middlewares/rid.middleware'
import router from './routes/router'
import promBundle from "express-prom-bundle"


// Add the options to the prometheus middleware most option are for http_request_duration_seconds histogram metric
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: '@repohub/api', project_type: 'test_metrics_labels' },
  promClient: {
    collectDefaultMetrics: {
    }
  }
})


function CreateExpressApp (cfg: AppConfigType): express.Application {
  const app = express()

  app.use(cfg.logging.useMorgan ? morgan('dev') : pinoHttp({ logger }))
  app.use(express.json())
  // app.use(express.urlencoded({ extended: true }))
  app.use(helmet())
  app.use(cors(cfg.security.cors))
  app.use(RequestID())
  app.use(metricsMiddleware)

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
