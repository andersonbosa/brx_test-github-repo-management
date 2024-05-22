import { AppConfig } from '../../configs/app.config'
import { RABBITMQ_MAIN_EXCHANGE_NAME, RABBITMQ_NOTIFICATION_QUEUE_NAME, RABBITMQ_NOTIFICATION_ROUTING_KEY } from '../../constants'
import { RabbitMQStatelessBroker } from './lib/broker'
import { BrokerConfig } from './lib/types'


const NotificationsWorkerConfig: BrokerConfig = {
  // logger: console,
  reconnectTime: 3000,
  connection: {
    url: AppConfig.rabbitmq.connectionString
  },
  resources: {
    exchanges: [
      {
        type: 'topic',
        name: RABBITMQ_MAIN_EXCHANGE_NAME,
        options: {}
      },
    ],
    queues: [
      {
        name: RABBITMQ_NOTIFICATION_QUEUE_NAME,
        options: { durable: true },
      },
    ],
    binding: [
      {
        exchange: RABBITMQ_MAIN_EXCHANGE_NAME,
        targetQueue: RABBITMQ_NOTIFICATION_QUEUE_NAME,
        routingKeys: RABBITMQ_NOTIFICATION_ROUTING_KEY
      }
    ],
  }
}

export async function CreateNotificationsWorker () {
  const b = new RabbitMQStatelessBroker(NotificationsWorkerConfig)
  console.log(`\r
    \r🚀 [NotificationsWorker]
    \r   Process started on pid: ${process.pid}
  `)
  await b.createResources()
  return b
}

export async function RunNotificationWorker () {
  const worker = await CreateNotificationsWorker()
  worker.config.logger = console

  worker.addConsumer(
    RABBITMQ_NOTIFICATION_QUEUE_NAME,
    async (msg) => {
      // TODO consumir mensagem da fila de notificação
      // TODO enviar notificação para navegador usando websockets
      { noAck: true }
    }
  )
}