import { DependencyContainer } from '../../configs/dependency.config'
import { RunExpressApp } from './express/app'

const _runningAPI = RunExpressApp(DependencyContainer.config)

