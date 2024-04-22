import { OutgoingHttpHeaders } from 'node:http'

export interface IndependentRequest {
  query?: Record<string, any>
  params?: Record<string, any>
  body?: Record<string, any>
  headers?: IncomingHttpHeaders | Record<string, any>
}

export interface IndependentResponse {
  statusCode: number
  body?: string | Record<string, any>
  headers?: OutgoingHttpHeaders | Record<string, any>
}

export interface IndependentRequestHandler {
  (request: IndependentRequest): Promise<IndependentResponse>
}

export interface FrameworkHandlerAdapter {
  parseStandardRequest (request: any): IndependentRequest
  adapt (controllerMethod: IndependentRequestHandler): any
}
