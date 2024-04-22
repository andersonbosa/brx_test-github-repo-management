export type RabbitMQQueue = {
  name: string
}

export type RabbitMQConfig = {
  connectionString: string
  queues: {
    main: RabbitMQQueue
  }
}

export type MariadbConfig = {
  connectionString: string
  connectionObject?: CommonConnObject
}

export type CommonConnObject = {
  user?: string
  password?: string
  host: string
  port: number
  database?: string
}
