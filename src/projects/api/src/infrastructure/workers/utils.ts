import { ConsumeMessage } from 'amqplib'
import { RabbitMQStatelessBroker } from './lib/broker'

export async function performManualAck (
  worker: RabbitMQStatelessBroker,
  msg: ConsumeMessage | null
): Promise<void> {
  if (!msg) {
    throw new Error(`[${__filename}] Can use the message`)
  }
  const mappedConsumer = msg?.fields.consumerTag ? worker.consumersMap.get(msg?.fields.consumerTag) : undefined
  if (mappedConsumer) {
    mappedConsumer.channel.ack(msg)
  } else {
    throw new Error(`[${__filename}] Can ACK the message "${msg?.fields.deliveryTag}" from ${msg?.fields.exchange}`)
  }
}