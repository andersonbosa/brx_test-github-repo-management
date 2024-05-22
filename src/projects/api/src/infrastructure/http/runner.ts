import { DependencyContainer } from '../../configs/dependency.config'
import { CreateExpressApp, RunExpressApp } from './express/app'
import { createSocketIOServerFromExpress } from './express/websockets'

const _runningServer = RunExpressApp(DependencyContainer.config)

// const app = CreateExpressApp(DependencyContainer.config)
// const _runningServer = createSocketIOServerFromExpress(app, DependencyContainer.config)