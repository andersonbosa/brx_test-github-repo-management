import express from 'express'
import { FrameworkHandlerAdapter, IndependentRequest, IndependentRequestHandler } from '../../@types'
import { httpStatusCodes } from '../../constants'



interface ObjectWithMethod {
  [key: string]: any
}

function createBoundMethod<T extends ObjectWithMethod, K extends keyof T> (obj: T, methodName: K): T[K] {
  if (!obj || typeof obj !== 'object' || typeof obj[methodName] !== 'function') {
    throw new Error('Invalid object or method name')
  }
  // return obj[methodName]//.bind(obj)
  return obj[methodName].bind(obj)
}

export class ExpressHandlerAdapter implements FrameworkHandlerAdapter {

  parseStandardRequest (request: express.Request): IndependentRequest {
    return {
      query: request.query,
      params: request.params,
      body: request.body,
      headers: request.headers,
    }
  }


  /**
   * Removes the dependencies of the framework to work with the controller independently without the specificity of the frameworks.
   * Each implementation of frameworkhandleradapter should specify your adapter method.
   */
  adapt (controllerMethod: IndependentRequestHandler): express.RequestHandler {
    return async (frameworkRequest: express.Request, frameworkReply: express.Response, _frameworkNext: express.NextFunction) => {
      try {
        const IndependentRequest = this.parseStandardRequest(frameworkRequest)
        const IndependentResponse = await controllerMethod(IndependentRequest)

        if (IndependentResponse.headers) {
          for (const header of Object.keys(IndependentResponse.headers)) {
            frameworkReply.appendHeader(header, IndependentResponse.headers[header])
          }
        }

        return frameworkReply
          .status(IndependentResponse.statusCode)
          .send(IndependentResponse.body)

      } catch (error) {
        console.error(`[${__filename}] Error during request handling:`, error)
        return frameworkReply
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .send(httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR))
      }
    }
  }

  /**
   * Call `.adapt` while ensures that the controller will not lose the context reference of his father object, which is where the controller dependencies are instantiated.
   * @see {ExpressHandlerAdapter.adapt}
   */
  adaptWithBind (controllerInstance: any, controllerMethod: any): any {
    return this.adapt(
      createBoundMethod(
        controllerInstance,
        typeof controllerMethod === 'string' ? controllerMethod : controllerMethod.name
      )
    )
  }
}