import { ConsumeMessage } from 'amqplib'
import { UserOrdersController } from '../../adapters/controllers/user-orders.controller'
import { DataParser } from '../../adapters/services/data-parser.service'
import { AppConfig } from '../../configs/app.config'
import { DependencyContainer } from '../../configs/dependency.config'
import { RABBITMQ_EXPORT_QUEUE_NAME, RABBITMQ_EXPORT_ROUTING_KEY, RABBITMQ_IMPORT_QUEUE_NAME, RABBITMQ_IMPORT_ROUTING_KEY, RABBITMQ_MAIN_EXCHANGE_NAME } from '../../constants'
import { RabbitMQStatelessBroker } from './lib/broker'
import { BrokerConfig } from './lib/types'
import { performManualAck } from './utils'


const TasksWorkerConfig: BrokerConfig = {
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
        name: RABBITMQ_EXPORT_QUEUE_NAME,
        options: { durable: true, }
      },
      {
        name: RABBITMQ_IMPORT_QUEUE_NAME,
        options: { durable: true },
      }
    ],
    binding: [
      {
        exchange: RABBITMQ_MAIN_EXCHANGE_NAME,
        targetQueue: RABBITMQ_EXPORT_QUEUE_NAME,
        routingKeys: RABBITMQ_EXPORT_ROUTING_KEY
      },
      {
        exchange: RABBITMQ_MAIN_EXCHANGE_NAME,
        targetQueue: RABBITMQ_IMPORT_QUEUE_NAME,
        routingKeys: RABBITMQ_IMPORT_ROUTING_KEY
      }
    ],
  }
}


const dataTransformerService = new DataParser()

export async function CreateTasksWorker () {
  const b = new RabbitMQStatelessBroker(TasksWorkerConfig)
  console.log(`\r
    \r🚀 [TasksWorker]
    \r   Process started on pid: ${process.pid}
  `)
  await b.createResources()
  return b
}

export async function RunTasksWorker () {
  const worker = await CreateTasksWorker()
  worker.config.logger = console

  worker.addConsumer(
    RABBITMQ_EXPORT_QUEUE_NAME,
    processOrderWithWorker(worker),
    // { noAck: true }
  )

  worker.addConsumer(
    RABBITMQ_IMPORT_QUEUE_NAME,
    processOrderWithWorker(worker),
    // { noAck: true }
  )

  return worker
}

function processOrderWithWorker (worker: RabbitMQStatelessBroker) {
  return async (msg: ConsumeMessage | null) => {
    try {
      const queuedOrder = JSON.parse(msg?.content.toString() ?? '')
      if (!queuedOrder) {
        throw new Error(`[${__filename}] Not possible get order from queue. Error on message "${msg?.fields.deliveryTag}" from "${RABBITMQ_IMPORT_QUEUE_NAME}"`)
      }

      const order = await DependencyContainer.repositories.userOrders.findById(queuedOrder.id)
      if (!order) {
        throw new Error(`[${__filename}] Not possible get order "${queuedOrder.id}" from database. Error on message "${msg?.fields.deliveryTag}" from "${RABBITMQ_IMPORT_QUEUE_NAME}"`)
      }

      let convertedData
      if (order.type === 'import') {
        convertedData = dataTransformerService.csvToJson(order.data)
      } else if (order.type === 'export') {
        convertedData = dataTransformerService.jsonToCsv(order.data)
      } else {
        throw new Error(`[${__filename}] Not possible convert data from order "${order.id}" from database. Error on message "${msg?.fields.deliveryTag}" from "${RABBITMQ_IMPORT_QUEUE_NAME}"`)
      }

      const updatedOrder = await DependencyContainer.repositories.userOrders.update(
        order.id,
        { data: convertedData, status: 'delivered' }
      )

      if (!updatedOrder) {
        throw new Error(`[${__filename}] Not possible update the order ${order.id}. Error on message "${msg?.fields.deliveryTag}" from "${RABBITMQ_IMPORT_QUEUE_NAME}"`)
      }

      delete updatedOrder.data // to decrease cost of the message stored in line

      worker.sendToExchange(
        RABBITMQ_MAIN_EXCHANGE_NAME,
        `notification.${queuedOrder.type}`,
        updatedOrder
      )

      performManualAck(worker, msg)
    } catch (error) {
      console.error(error)
      return
    }
  }
}
