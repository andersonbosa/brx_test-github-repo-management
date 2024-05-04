import { RunNotificationWorker } from './notifications-worker'
import { RunTasksWorker } from './tasks-worker'

RunTasksWorker()
RunNotificationWorker()