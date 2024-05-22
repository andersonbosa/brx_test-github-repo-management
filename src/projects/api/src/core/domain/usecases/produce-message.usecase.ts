import { IMessageProducer } from '../../../ports/services.ports'

export class MessageProducerUsecase {
  constructor(private readonly messageProducer: IMessageProducer) { }

  async execute (queueName: string, message: string, callback: () => any): Promise<any> {
    return new Promise<any>(
      (resolve, _reject) => {
        this.messageProducer.sendMessage(queueName, message, () => {
          const result = callback()
          resolve(result)
        })
      }
    )
  }
}