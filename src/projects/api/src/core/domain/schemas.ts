import { StatusCodes } from 'http-status-codes'
import z, { ZodError } from 'zod'


export const CreateUserOrderInputSchema = z.object({
  type: z.enum(['import', 'export']),
  data: z.any()
})

export const FindByIdUserOrderInputSchema = z.object({
  id: z.coerce.number()
})

export const UpdateUserOrderInputSchema = CreateUserOrderInputSchema
  .merge(FindByIdUserOrderInputSchema)


/**
 * Removes evidence from the object belongs to the Framework Zod.
 */
export function replaceZodError (obj: any): any {
  const wantedValue = 'ZodError'
  const obfuscatedValue = 'Error'

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceZodError(item))
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = replaceZodError(obj[key])
        if (key === 'name' && obj[key] === wantedValue) {
          newObj[key] = obfuscatedValue
        }
      }
    }
    return newObj
  } else {
    return obj
  }
}

/**
 * Format Zod error to create a good user response using error feedback from Zod.
 */
export function createZodResponse (message: string, error: ZodError) {
  return {
    statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    body: {
      error: message,
      details: replaceZodError(error.issues)
    }
  }
}
