// Classe base para erros personalizados
class CustomError extends Error {
  constructor(message: string, originalCause?: Error) {
    super(message)
    if (originalCause) this.cause = originalCause
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}


export class DatabaseConnectionError extends CustomError {
  constructor(originalCause?: Error) {
    super('Error connecting to the database.', originalCause)
  }
}

export class DatabaseQueryError extends CustomError {
  constructor() {
    super('Error executing the query in the database.')
  }
}