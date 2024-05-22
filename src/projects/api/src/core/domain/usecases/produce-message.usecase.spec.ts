
import {
  NewIQueueRepository,
  ProduceMessageToExchange,
  ProduceMessageToQueue,
  RabbitMQExchangeAdapter,
  RabbitMQQueueAdapter
} from '../../repositories/queue.repository'
import { MessageProducerUsecase } from './produce-message.usecase'

// Mock da implementação do QueueRepository
class QueueRepositoryMock implements NewIQueueRepository {
  async sendMessage (message: string, queueName: string): Promise<boolean> {
    console.log(`queue: ${queueName} -- message: ${message}`)
    return true
  }
}

describe(`${MessageProducerUsecase.name}`, () => {
  it('should produce a message to given queue with mock repository', async () => {
    const repositoryAdapter = new QueueRepositoryMock()
    const usecase = new ProduceMessageToQueue(repositoryAdapter)

    const isSend = await usecase.execute(new Date().toISOString(), 'jest_queue')

    expect(isSend).toBe(true)
  })

  it('should produce a message to given queue with rabbitmq repository', async () => {
    const repositoryAdapter = new RabbitMQQueueAdapter('amqp://admin:admin@localhost:5672')
    const usecase = new ProduceMessageToQueue(repositoryAdapter)

    const isSend = await usecase.execute(new Date().toISOString(), 'jest_queue')

    expect(isSend).toBe(true)

  })

  it('should produce a message to given exchange with rabbitmq repository', async () => {
    const repositoryAdapter = new RabbitMQExchangeAdapter(
      'amqp://admin:admin@localhost:5672',
      'jest_exchante',
      'topic',
      { durable: true }
    )
    const usecase = new ProduceMessageToExchange(repositoryAdapter)

    const isSend = await usecase.execute(new Date().toISOString())

    expect(isSend).toBe(true)
  })
})