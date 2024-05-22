
// src/core/repositories/queue.repository.ts
export interface NewIQueueRepository {
  sendMessage (message: QueueMessage, queueName: string): Promise<boolean>
}

// src/infra/queueAdapters/RabbitMQQueueAdapter.ts
import { Channel, connect, Connection, Options } from "amqplib"

export class RabbitMQQueueAdapter implements NewIQueueRepository {
  private connection!: Connection
  private channel!: Channel

  constructor(private readonly queueUrl: string) { }

  private async init (): Promise<void> {
    this.connection = await connect(this.queueUrl)
    this.channel = await this.connection.createChannel()
  }

  async end (): Promise<void> {
    await this.channel.close()
    await this.connection.close()
  }

  async sendMessage (message: QueueMessage, queueName: string): Promise<boolean> {
    try {
      await this.init()
      await this.channel.assertQueue(queueName)
      console.log(`[${__filename}]: Sending message to queue "${queueName}" `)
      return this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message))
      )
    } catch (error) {
      console.error(error)
      return false
    } finally {
      await this.end()
    }
  }
}


// src/useCases/ProduceMessageToQueue.ts
// import NewIQueueRepository from "../domain/repositories/QueueRepository";

export class ProduceMessageToQueue {
  constructor(private readonly queueRepository: NewIQueueRepository) { }

  async execute (message: QueueMessage, queueName: string): Promise<boolean> {
    return this.queueRepository.sendMessage(message, queueName)
  }
}

/* -------------------------------------------------------------------- */

// src/infra/queueAdapters/RabbitMQExchangeAdapter.ts
type RabbitMQExchangeType = 'fanout' | 'topic' | 'headers' | 'direct'

export class RabbitMQExchangeAdapter /* TODO implements interface */ {
  private connection!: Connection
  private channel!: Channel

  constructor(
    private queueUrl: string,
    private exchangeName: string,
    private exchangeType: RabbitMQExchangeType,
    private exchangeOptions?: Options.AssertExchange,
  ) { }

  async init (
  ): Promise<void> {
    this.connection = await connect(this.queueUrl)
    this.channel = await this.connection.createChannel()
    await this.channel.assertExchange(
      this.exchangeName,
      this.exchangeType,
      this.exchangeOptions
    )
  }

  async end (): Promise<void> {
    await this.channel.close()
    await this.connection.close()
  }

  private exitIfNotConnected (): void {
    if (!this.connection.connection.serverProperties.host) {
      throw new Error('conexao nao foi criado')
    }
  }

  async publishMessage (message: QueueMessage, routingKey: string = ''): Promise<boolean> {
    try {
      await this.init()
      console.log(`[${__filename}]: Publishing message to exchange "${this.exchangeName}" with routingKey "${routingKey}" `)
      return this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message))
      )
    } catch (error) {
      console.error(error)
      return false
    } finally {
      await this.end()
    }
  }
}

export class ProduceMessageToExchange {
  constructor(private readonly exchangeRepository: RabbitMQExchangeAdapter/* abstrair */) { }

  async execute (message: QueueMessage, routingKey: string): Promise<boolean> {
    return this.exchangeRepository.publishMessage(
      message,
      routingKey
    )
  }
}

export type QueueMessage = string | { [key: string]: any }