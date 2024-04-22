import { v4 as uuidv4 } from 'uuid'

import express from 'express'
import { Request, Response, NextFunction } from 'express'

declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }
}

interface Options {
  setHeader?: boolean
  headerName?: string
  generator?: (request: Request) => string
}

const generateV4UUID = (): string => {
  return uuidv4()
}

const ATTRIBUTE_NAME = 'id'

export const RequestID = (options: Options = {}): express.RequestHandler => {
  const {
    generator = generateV4UUID,
    headerName = 'X-Request-Id',
    setHeader = true
  } = options

  return (request: Request, response: Response, next: NextFunction) => {
    const oldValue = request.get(headerName)
    const id = oldValue === undefined ? generator(request) : oldValue

    if (setHeader) {
      response.set(headerName, id)
    }

    request[ATTRIBUTE_NAME] = id

    next()
  }
}

export default RequestID
