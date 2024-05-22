import { config } from 'dotenv'
import { MariadbConfig, RabbitMQConfig } from '../@types/app.config'
import { generateLogFileName, parseMariadbConfig, parseRabbitMQConfig } from './app.config.utils'

config()

interface LoggingConfig {
  level: string | 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'
  fileName: string
  useMorgan: boolean
}

export type AppConfigType = {
  env: 'production' | 'development' | 'test' | string

  http: {
    port: number
  }

  logging: LoggingConfig

  rabbitmq: RabbitMQConfig

  mariadb: MariadbConfig

  security: {
    cors: {
      origin?: string,
      credentials?: boolean,
    },
    cookieOptions?: {
      sameSite: boolean,
      secure: boolean,
      httpOnly: boolean,
      maxAge: number
    }
  }
}

const AppConfig: AppConfigType = {
  env: process.env.NODE_ENV || 'development',

  http: {
    port: Number(process.env.PORT) || 3001,
  },

  logging: {
    level: process.env.LOGGING_LEVEL ?? 'debug',
    fileName: process.env.LOGGING_FILE ?? generateLogFileName(),
    useMorgan: Boolean(process.env.LOGGING_USE_MORGAN) ?? false
  },

  rabbitmq: parseRabbitMQConfig(),

  mariadb: parseMariadbConfig(),

  security: {
    cors: {
      origin: '*', /* not recommended for security reasons, use only in development */
      // credentials: true,
    },

    cookieOptions: {
      sameSite: true,
      secure: true,
      httpOnly: true,
      maxAge: 10 * 60 * 1000 // 10 minutes
    },
  }
}

export { AppConfig }
/* TODO melhoria: nome mais explícito. são configurações gerais da aplicação inteira separada por solução */