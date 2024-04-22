import express from 'express'
import { FrameworkHandlerAdapter, IndependentRequest, IndependentRequestHandler } from '../../@types'
import { httpStatusCodes } from '../../constants'


export class ExpressHandlerAdapter implements FrameworkHandlerAdapter {
  parseStandardRequest (request: express.Request): IndependentRequest {
    return {
      query: request.query,
      params: request.params,
      body: request.body,
      headers: request.headers,
    }
  }

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
        console.error('[src/api/src/adapters/handlers/express.handler.ts] Error during request handling:', error)
        return frameworkReply
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .send(httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR))
      }
    }
  }
}