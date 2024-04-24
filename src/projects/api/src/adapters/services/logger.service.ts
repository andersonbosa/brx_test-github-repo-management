import { join } from 'node:path'
import pino from 'pino'
import { AppConfig } from '../../configs/app.config'


function createFileDir (fileName: string): string {
  const logsDir = join(__dirname, '..', '..', '..', 'logs')
  const filePath = join(logsDir, fileName)
  return filePath
}

const pinoTranports = pino.transport({
  targets: [
    {
      level: AppConfig.logging.level,
      target: 'pino/file',
      options: {
        destination: createFileDir(AppConfig.logging.fileName),
        // append: false,
      }
    },
    {
      level: AppConfig.logging.level,
      target: 'pino-pretty',
      options: {
        // translateTime: 'HH:MM:ss Z',
        translateTime: 'UTC:yyyy-mm-dd \'T\'HH:MM:ss \'Z\'',
        ignore: 'pid',
      },
    },
  ]
})

export const logger = pino(
  {
    name: '@brx/api',
    level: AppConfig.logging.level,
  },
  pinoTranports
)

