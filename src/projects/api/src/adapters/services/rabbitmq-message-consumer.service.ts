import amqp from 'amqplib/callback_api'
import { IMessageConsumer } from '../../ports/services.ports'
import { RabbitMQService } from './rabbitmq.service'


export class RabbitMQMessageConsumer implements IMessageConsumer {
  queueService: RabbitMQService

  constructor(connectionString: string) {
    this.queueService = new RabbitMQService(connectionString)
  }

  async consumeMessages (queueName: string, callback: (message: amqp.Message | null) => void): Promise<void> {
    try {
      await this.queueService.connect()

      const connection = this.queueService.getConnection()
      if (!connection) {
        throw new Error('RabbitMQMessageConsumer: Failed to establish connection to RabbitMQ')
      }

      connection.createChannel((err1: any, channel: amqp.Channel) => {
        if (err1) {
          throw err1
        }

        channel.assertQueue(
          queueName,
          { exclusive:false, durable: false },
          (err2: any, _ok: amqp.Replies.AssertQueue) => {
            if (err2) {
              throw err2
            }

            const onMessage = (msg: amqp.Message | null) => {
              if (msg !== null) {
                callback(msg)
                channel.ack(msg)
              }
            }

            channel.consume(queueName, onMessage, { noAck: false })
          })
      })

    } catch (error) {
      console.error('RabbitMQMessageConsumer: Error consuming message:', error)
      this.queueService.closeConnection()
    } 
  }
}
