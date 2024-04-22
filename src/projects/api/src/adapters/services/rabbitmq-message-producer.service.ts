import amqp from 'amqplib/callback_api'
import { IMessageProducer } from '../../ports/services.ports'
import { RabbitMQService } from './rabbitmq.service'


export class RabbitMQMessageProducer implements IMessageProducer {
  queueService: RabbitMQService

  constructor(
    private connectionString: string,
  ) {
    this.queueService = new RabbitMQService(connectionString)
  }

  async sendMessage (queueName: string, message: string, callback?: () => any, TTL: number = 1000): Promise<any> {
    try {
      await this.queueService.connect()
      const connection = this.queueService.getConnection()
      if (!connection) {
        throw new Error('RabbitMQMessageProducer: Failed to establish connection to RabbitMQ')
      }

      await connection.createChannel((err1, channel: amqp.Channel) => {
        if (err1) {
          throw err1
        }

        channel.assertQueue(
          queueName,
          { exclusive: false, durable: false, },
          (err2: any, _ok: amqp.Replies.AssertQueue) => {
            if (err2) {
              throw err2
            }

            const messageBuffer = Buffer.from(message)
            channel.sendToQueue(queueName, messageBuffer)
            // //console.log(`RabbitMQMessageProducer: Sent message to queue ${queueName}.`)

            return callback ? callback() : null
          }
        )
      })

      setTimeout(
        () => {
          // //console.log(`RabbitMQMessageProducer: Closing because Time-To-live: ${TTL}`)
          connection.close()
        },
        TTL
      )
    } catch (error) {
      console.error('RabbitMQMessageProducer: Error sending message:', error)
      this.queueService.closeConnection()
    }

  }
}