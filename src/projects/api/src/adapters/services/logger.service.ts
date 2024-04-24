import { join } from 'node:path'
import pino from 'pino'
import { AppConfig } from '../../configs/app.config'
import { accessSync, constants } from 'node:fs'


function createFileDir (fileName: string): string {
  const logsDir = join(__dirname, '..', '..', '..', 'logs')
  const filePath = join(logsDir, fileName)
  try {
    // Verificar se o arquivo já existe
    accessSync(filePath, constants.F_OK)
    // Verificar se o usuário tem permissão de escrita
    accessSync(filePath, constants.W_OK)
  } catch (error) {
    console.error('[src/projects/api/src/adapters/services/logger.service.ts#createFileDir]', error)
    return filePath.concat('_user')
  }
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

