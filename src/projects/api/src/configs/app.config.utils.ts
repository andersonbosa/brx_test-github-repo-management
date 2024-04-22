import { CommonConnObject, MariadbConfig, RabbitMQConfig } from '../@types/app.config'
import { AppConfig } from './app.config'


export const isProduction = () => AppConfig.env.toLowerCase() === 'production'

/**
 * Merges two objects, keeping only the keys from the preferedProps object and replacing their values
 * with the corresponding values from the preferedProps object, if defined.
 *
 * @template T - The type of the target object.
 * @param {T} defaultProps - The target object from which to keep the keys.
 * @param {Partial<T>} preferedProps - The source object containing the values to merge.
 * @returns {T} - The merged object with the same keys as the target object.
 */
export function mergeObjects<T extends Record<string, any>> (defaultProps: T, preferedProps: Partial<T>): T {
  const merged: Partial<T> = Object.assign(defaultProps, preferedProps)

  for (const key in defaultProps) {
    if (Object.prototype.hasOwnProperty.call(defaultProps, key)) {
      if (preferedProps[key] !== undefined && preferedProps[key] !== '') {
        merged[key] = preferedProps[key]
      } else {
        merged[key] = defaultProps[key]
      }
    }
  }

  return merged as T
}

export function parseRabbitMQConfig (): RabbitMQConfig {
  const defaultCfg = {
    connectionString: 'amqp://username:password@host:port/database',
    queues: {
      main: {
        name: 'MainQueue'
      }
    }
  }

  const envCfg = {
    connectionString: process.env.RABBITMQ_CONNECTION_URL,
  }

  return mergeObjects(defaultCfg, envCfg)
}

export function parseMariadbConfig (): MariadbConfig {
  const defaultCfg = {
    connectionString: 'mysql://username:password@host:port/database',
  }

  const envCfg = {
    connectionString: process.env.MARIADB_CONNECTION_URL,
  }

  if (envCfg.connectionString) {
    Object.assign(
      envCfg,
      { connectionObject: parseConnectionUrl(envCfg.connectionString) }
    )
  }

  return mergeObjects(defaultCfg, envCfg)
}

export function generateLogFileName (
  includeTime: boolean = false
): string {

  const formatDateToFile = (date: Date): string => {
    const year = date.getFullYear().toString().padStart(4, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}_${month}_${day}--${hours}_${minutes}_${seconds}.log`
    }

    return `${year}_${month}_${day}.log`
  }

  return formatDateToFile(new Date())
}

export function parseConnectionUrl (url: string): CommonConnObject {
  const urlObj = new URL(url)
  const connObject: any = {
    port: Number(urlObj.port),
    host: urlObj.hostname,
    database: urlObj.pathname.replaceAll('/', ''),
    password: urlObj.password,
  }
  connObject.user = urlObj?.username
  return connObject
}
