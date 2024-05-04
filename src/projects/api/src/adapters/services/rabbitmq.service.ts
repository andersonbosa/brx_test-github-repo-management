import amqp from 'amqplib'
import amqpCallback from 'amqplib/callback_api'
import { IQueueService } from '../../ports/services.ports'

interface IRabbitQueueService extends IQueueService {
  connect (): Promise<void>
  getConnection (): amqpCallback.Connection | null
  closeConnection (): Promise<void>
}

export class RabbitMQService implements IRabbitQueueService {
  private connection: amqpCallback.Connection | null = null

  constructor(private readonly connectionString: string) { }

  async connect (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      amqpCallback.connect(
        this.connectionString,
        {},
        (err: any, connection: amqpCallback.Connection) => {
          if (err) {
            reject(err)
            return
          }
          this.connection = connection
          resolve()
        }
      )
    })
  }

  getConnection (): amqpCallback.Connection | null {
    return this.connection
  }

  async closeConnection (): Promise<void> {
    return new Promise<void>((resolve) => {
      this.connection?.close((err) => {
        if (err) {
          console.error('RabbitMQService: Error closing connection:', err)
        } else {
          //console.log('RabbitMQService: Connection closed successfully')
        }
        resolve()
      })
    })
  }
}



export class RabbitMQServiceV2 {
  private connection: amqpCallback.Connection | null = null
  
  constructor(private readonly connectionString: string) { }

  static async getChannel (connectionString: string) {
    try {
      const connection = await amqp.connect(connectionString)
      const channel = await connection.createChannel()
      return channel
    } catch (error) {
      console.error('Erro ao conectar-se ao RabbitMQ:', error)
    }
  }

  static async sendToExchange (
    channel: amqp.Channel,
    exchangeName: string,
    topic: string,
    message: any
  ): Promise<void> {
    try {
      await channel.assertExchange(exchangeName, 'topic', { durable: true })
      channel.publish(exchangeName, topic, Buffer.from(JSON.stringify(message)))
      //console.log(`Message sent to Exchange with topic ${topic}`)
    } catch (error) {
      console.error('Error sending message to Exchange:', error)
    }
  }

  static async consumeQueue (
    channel: amqp.Channel,
    taskQueue: string,
    exchangeName: string,
    topicPattern: string
  ): Promise<void> {
    try {
      await channel.assertQueue(taskQueue, { durable: true })
      await channel.bindQueue(taskQueue, exchangeName, topicPattern)

      channel.consume(taskQueue, async (msg) => {
        if (msg !== null) {
          const taskData = JSON.parse(msg.content.toString())
          // Processar a tarefa...
          setTimeout(async () => {
            //console.log('Simulação de algum processo')
            const notificationData = { message: 'Tarefa processada com sucesso!' }
            await RabbitMQServiceV2.sendToExchange(channel, exchangeName, 'NOTIFICATION', notificationData)
            channel.ack(msg)
          }, 4000)
        }
      })
    } catch (error) {
      console.error('Erro ao consumir a fila TASK:', error)
    }
  }

  static async consumeNotification (
    channel: amqp.Channel,
    notificationQueue: string,
    exchangeName: string,
    topicPattern: string
  ): Promise<void> {
    try {
      await channel.assertQueue(notificationQueue, { durable: true })
      await channel.bindQueue(notificationQueue, exchangeName, topicPattern)

      channel.consume(notificationQueue, (msg) => {
        if (msg !== null) {
          const notificationData = JSON.parse(msg.content.toString())
          //console.log('NOTIFICATION:', notificationData)
          channel.ack(msg)
        }
      })
    } catch (error) {
      console.error('Erro ao consumir a fila NOTIFICATION:', error)
    }
  }
}
