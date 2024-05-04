import httpStatusCodes from 'http-status-codes'
export { httpStatusCodes }


export const RABBITMQ_MAIN_EXCHANGE_NAME = 'work.main.exchange'
export const RABBITMQ_EXPORT_QUEUE_NAME = 'work.export.queue'
export const RABBITMQ_IMPORT_QUEUE_NAME = 'work.import.queue'
export const RABBITMQ_EXPORT_ROUTING_KEY = 'task.export'
export const RABBITMQ_IMPORT_ROUTING_KEY = 'task.import'
export const RABBITMQ_NOTIFICATION_QUEUE_NAME = 'work.notification.queue';
export const RABBITMQ_NOTIFICATION_ROUTING_KEY = 'notification.#';
