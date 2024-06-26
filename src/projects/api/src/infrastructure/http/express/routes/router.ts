import express from 'express'
import { AuthController } from '../../../../adapters/controllers/auth.controller'
import { GithubSearchController } from '../../../../adapters/controllers/github-search.controller'
import { HealthCheckController } from '../../../../adapters/controllers/healthcheck.controller'
import { UserOrdersController } from '../../../../adapters/controllers/user-orders.controller'
import { ExpressHandlerAdapter } from '../../../../adapters/handlers/express.handler'
import { DependencyContainer } from '../../../../configs/dependency.config'
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware'
import { DataParserController } from '../../../../adapters/controllers/data-converter.controller'
import { DataParser } from '../../../../adapters/services/data-parser.service'


const frameworkAdapter = new ExpressHandlerAdapter()
const router = express.Router()

router.all('/api/v1/healthcheck', frameworkAdapter.adapt(new HealthCheckController().execute))

router.post('/api/v1/auth/sign-in', frameworkAdapter.adapt(new AuthController().login))
router.post('/auth/sign-out', AuthenticationMiddleware, frameworkAdapter.adapt(new AuthController().logout))


const githubSearchController = new GithubSearchController()
router.get('/api/v1/search/user', frameworkAdapter.adapt(githubSearchController.searchUser))
router.get('/api/v1/search/repos', frameworkAdapter.adapt(githubSearchController.searchRepository))


const userOrdersController = new UserOrdersController(DependencyContainer.repositories.userOrders)
router.post('/api/v1/orders', frameworkAdapter.adaptWithBind(userOrdersController, userOrdersController.createOrder))
router.get('/api/v1/orders/:id', frameworkAdapter.adaptWithBind(userOrdersController, userOrdersController.getOrder))
router.put('/api/v1/orders/:id', frameworkAdapter.adaptWithBind(userOrdersController, userOrdersController.updateOrder))
router.delete('/api/v1/orders/:id', AuthenticationMiddleware, frameworkAdapter.adaptWithBind(userOrdersController, userOrdersController.deleteOrder))


const dataParserController = new DataParserController(new DataParser())
router.post('/api/v1/converter/csv2json', frameworkAdapter.adaptWithBind(dataParserController, dataParserController.csvToJson))
router.post('/api/v1/converter/json2csv', frameworkAdapter.adaptWithBind(dataParserController, dataParserController.jsonToCsv))

export default router
