import { IMessageConsumer } from '../../../ports/services.ports'

export class MessageConsumerUsecase {
  constructor(private readonly messageConsumer: IMessageConsumer) { }

  async execute (queueName: string, callback: (message: string) => any): Promise<any> {
    return new Promise<any>(
      (resolve, _reject) => {
        this.messageConsumer.consumeMessages(queueName, (message) => {
          const result = callback(message)
          resolve(result)
        })
      }
    )
  }
}
