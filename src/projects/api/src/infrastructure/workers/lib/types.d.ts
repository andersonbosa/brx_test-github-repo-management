
export type BrokerExchangeType = 'fanout' | 'direct' | 'topic' | 'headers'

export type BrokerExchange = {
  name: string
  type: string
  options: unknown
}

export type BrokerQueue = {
  name: string
  options: unknown
}

export type BrokerBinding = {
  exchange: string
  targetQueue: string
  routingKeys: string
}

export type BrokerLogger = {
  debug (message?: unknown, ...optionalParams: unknown[]): void
  info (message?: unknown, ...optionalParams: unknown[]): void
  warn (message?: unknown, ...optionalParams: unknown[]): void
  error (message?: unknown, ...optionalParams: unknown[]): void
}

export interface BrokerConnectionConfig {
  url: string
  name?: string
  timeout?: number
}

export interface BrokerMessage {
  content: unknown
}

export interface BrokerConsumer {
  handler: (msg: unknown | null) => Promise<void>
}

export interface BrokerResources {
  exchanges: BrokerExchange[]
  queues: BrokerQueue[]
  binding: BrokerBinding[]
}

export interface BrokerConfig {
  connection: BrokerConnectionConfig
  reconnectTime?: number
  logger?: BrokerLogger
  resources?: BrokerResources
}

export interface Broker {
  /* PROPERTIES */
  _connection: unknown | null
  _channel: unknown | null
  config: BrokerConfig
  consumersMap: Map<string, any>


  /* METHODS */
  close (): Promise<void>

  reconnect (): Promise<void>

  connect (): Promise<void>

  createResources (
    resources?: BrokerResources
  ): Promise<void>

  addConsumer (
    targetQueue: string,
    handler: (...args: unknown[]) => unknown,
    options: unknown
  ): Promise<void>

  sendToExchange (
    exchangeName: string,
    routingKey: string,
    message: any,
    options?: unknown
  ): Promise<boolean>

  sendToQueue (
    queueName: string,
    message: any,
    options?: unknown
  ): Promise<boolean>
}