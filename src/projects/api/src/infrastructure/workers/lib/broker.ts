
import amqp from 'amqplib'
import { v4 as uuidv4 } from 'uuid'
import {
  BrokerBinding,
  BrokerConfig,
  BrokerExchange,
  BrokerQueue,
  BrokerResources
} from './types'

export type RabbitMQConsumerHandler = (msg: amqp.ConsumeMessage | null) => Promise<void>

export interface RabbitMQMappedConsumer {
  channel: amqp.Channel
  handler: RabbitMQConsumerHandler
}

/* The connections are created, used and closed. */
export class RabbitMQStatelessBroker {
  public consumersMap = new Map<string, RabbitMQMappedConsumer>();

  constructor(
    public config: BrokerConfig
  ) { }

  async createCommunication (): Promise<amqp.Channel> {
    const connection = await amqp.connect(this.config.connection.url)
    const channel = await connection.createChannel()
    channel.connection.on('error', (err: { message: unknown }) => {
      this.config?.logger?.error(`[${__filename}#createCommunication#onError] connection error.`, err)
    })
    channel.on('close', () => {
      this.config?.logger?.debug(`[${__filename}#createCommunication#onClose] connection closed.`)
    })
    this.config?.logger?.debug(`[${__filename}#createCommunication] successfully connected!`)
    return channel
  }

  async temporaryConnection<T> (
    callback: (channel: amqp.Channel) => T,
    errorCallback?: (error: any) => any,
    withTimeout: boolean = true
  ): Promise<T | undefined> {
    const channel = await this.createCommunication()
    try {
      return await callback(channel)
    } catch (error) {
      this.config?.logger?.error(`[${__filename}#temporaryConnection]:`, error)
      return errorCallback && errorCallback(error)
    } finally {
      if (withTimeout) setTimeout(channel.connection.close.bind(channel.connection), 3000)
    }
  }

  async assertExchange (exchange: BrokerExchange) {
    const channel = await this.createCommunication()
    try {
      return channel.assertExchange(
        exchange.name,
        exchange.type,
        exchange.options as amqp.Options.AssertExchange
      ).then(
        (createdExchange: amqp.Replies.AssertExchange) => {
          this.config?.logger?.info(`[${__filename}#createResources] created exchange = `, createdExchange)
          return createdExchange
        }
      )
    } catch (error) {
      this.config?.logger?.error(`[${__filename}#assertExchange]:`, error)
    } finally {
      setTimeout(channel.connection.close.bind(channel.connection), 3000)
    }
  }

  async assertQueue (queue: BrokerQueue) {
    const channel = await this.createCommunication()
    return await channel.assertQueue(
      queue.name,
      queue.options as amqp.Options.AssertQueue
    ).then(
      (createdQueue: amqp.Replies.AssertQueue) => {
        this.config?.logger?.info(`[${__filename}#createResources] created queue = `, createdQueue)
      }
    )
  }

  async bindQueue (binding: BrokerBinding) {
    const channel = await this.createCommunication()
    return await channel.bindQueue(
      binding.targetQueue,
      binding.exchange,
      binding.routingKeys,
    ).then(
      (e: amqp.Replies.Empty) => {
        this.config?.logger?.info(`[${__filename}#createResources] created brinding = `, binding)
      }
    )

  }

  async deleteExchange (exchange: BrokerExchange): Promise<amqp.Replies.Empty> {
    const channel = await this.createCommunication()
    return channel.deleteExchange(exchange.name)
  }

  async deleteQueue (queue: BrokerQueue): Promise<amqp.Replies.Empty> {
    const channel = await this.createCommunication()
    return channel.deleteQueue(queue.name)
  }

  async createResources (resources?: BrokerResources): Promise<void> {
    const createResourcesCallback = async (channel: amqp.Channel): Promise<void> => {
      try {
        const resourcesToCreate = resources ? resources : this.config.resources
        if (!resourcesToCreate) {
          throw new Error('Resources was not specified.')
        }

        const assertExchange = async (exchange: BrokerExchange): Promise<void> => {
          await channel.assertExchange(
            exchange.name,
            exchange.type,
            exchange.options as amqp.Options.AssertExchange
          ).then(
            (createdExchange: amqp.Replies.AssertExchange) => {
              this.config?.logger?.info(`[${__filename}#createResources] created exchange = `, createdExchange)
              return createdExchange
            }
          )
        }

        const assertQueue = async (queue: BrokerQueue): Promise<void> => {
          await channel.assertQueue(
            queue.name,
            queue.options as amqp.Options.AssertQueue
          ).then(
            (createdQueue: amqp.Replies.AssertQueue) => {
              this.config?.logger?.info(`[${__filename}#createResources] created queue = `, createdQueue)
              return createdQueue
            }
          )
        }

        const bindQueue = async (binding: BrokerBinding): Promise<void> => {
          await channel.bindQueue(
            binding.targetQueue,
            binding.exchange,
            binding.routingKeys
          ).then(
            (e: amqp.Replies.Empty) => {
              this.config?.logger?.info(`[${__filename}#createResources] created brinding = `, binding)
              return e
            }
          )
        }

        await Promise.all(resourcesToCreate.exchanges.map(assertExchange))
        await Promise.all(resourcesToCreate.queues.map(assertQueue))
        await Promise.all(resourcesToCreate.binding.map(bindQueue))
      } catch (error) {
        throw error
      }
    }

    const onError = (error: any) => {
      this.config?.logger?.error(`[${__filename}#createResources]:`, error)
    }

    return this.temporaryConnection<void>(createResourcesCallback, onError)
  }

  async destroyResources (): Promise<void> {
    const destroyResourcesCallback = async (channel: amqp.Channel): Promise<void> => {
      try {
        const deleteExchange = async (exchange: BrokerExchange): Promise<void> => {
          await channel.deleteExchange(exchange.name)
            .then((deletedResource) => {
              this.config?.logger?.info(`[${__filename}#destroyResources] deleted exchange = `, deletedResource)
            })
        }

        const deleteQueue = async (queue: BrokerQueue): Promise<void> => {
          await channel.deleteQueue(queue.name)
            .then((deletedResource) => {
              this.config?.logger?.info(`[${__filename}#destroyResources] deleted queue = `, deletedResource)
            })
        }

        if (this.config.resources?.exchanges) {
          await Promise.all(this.config.resources.exchanges.map(deleteExchange))
        }

        if (this.config.resources?.queues) {
          await Promise.all(this.config.resources.queues.map(deleteQueue))
        }
      } catch (error) {
        throw error
      }
    }

    const onError = (error: any) => {
      this.config?.logger?.error(`[${__filename}#destroyResources]:`, error)
    }

    return this.temporaryConnection<void>(destroyResourcesCallback, onError)
  }


  async addConsumer (
    targetQueue: string,
    handler: (msg: amqp.ConsumeMessage | null) => Promise<void>,
    options?: amqp.Options.Consume
  ): Promise<void> {

    const addConsumerCallback = async (channel: amqp.Channel): Promise<void> => {
      try {
        const defaultOptions: amqp.Options.Consume = {
          noAck: false,
        }

        const consumer = await channel.consume(
          targetQueue,
          handler,
          Object.assign(defaultOptions, options)
        )

        this.consumersMap.set(consumer.consumerTag, { handler, channel })

      } catch (error) {
        throw error
      }
    }

    const onError = (error: any) => {
      this.config?.logger?.error(`[${__filename}#addConsumer]:`, error)
    }

    return this.temporaryConnection<void>(addConsumerCallback, onError, false)
  }

  async sendToExchange (
    exchangeName: string,
    routingKey: string,
    message: any,
    options?: amqp.Options.Publish
  ): Promise<boolean> {
    const sendToExchangeCallback = async (channel: amqp.Channel): Promise<boolean> => {
      const defaultOptions: amqp.Options.Publish = {
        timestamp: Date.now(),
        contentEncoding: 'utf-8',
        contentType: 'application/json',
        persistent: false,
        headers: {
          messageId: uuidv4(),
          source: `${exchangeName}:${routingKey}`,
        },
      }

      return channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        Object.assign(defaultOptions, options)
      )
    }

    const onError = (error: any) => {
      this.config?.logger?.error(`[${__filename}#sendToExchange#onError]`, error)
    }

    return this.temporaryConnection<Promise<boolean>>(sendToExchangeCallback, onError)
      .then(r => Boolean(r))
  }

  async sendToQueue (queueName: string, message: any, options?: amqp.Options.Publish): Promise<any> {
    const sendMessageCallback = async (__channel: amqp.Channel): Promise<any> => {
      const defaultOptions: amqp.Options.Publish = {
        timestamp: Date.now(),
        contentEncoding: 'utf-8',
        contentType: 'application/json',
        persistent: false,
        headers: {
          messageId: uuidv4(),
          source: `${queueName}`,
        },
      }
      this.config?.logger?.info(`[${__filename}] sending message to queue =`, queueName)
      return __channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
        Object.assign(defaultOptions, options)
      )
    }
    const onError = (err: any) => {
      this.config?.logger?.error(`[${__filename}]`, err)
    }

    return this.temporaryConnection<Promise<boolean>>(sendMessageCallback, onError)
  }
}