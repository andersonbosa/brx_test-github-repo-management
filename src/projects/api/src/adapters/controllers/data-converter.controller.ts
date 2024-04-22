import { IndependentRequest, IndependentResponse } from '../../@types'
import { httpStatusCodes } from '../../constants'
import { IDataParser } from '../services/data-parser.service'

export interface IDataParserInput {
  data: string
}

export class DataParserController {
  constructor(
    private dataParserService: IDataParser
  ) { }

  async csvToJson (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const { data } = iRequest.body || {}
      if (!data) {
        return {
          statusCode: httpStatusCodes.BAD_REQUEST,
          body: { error: 'CSV data is missing' }
        }
      }
      const jsonData = this.dataParserService.csvToJson(JSON.parse(data))
      return {
        statusCode: httpStatusCodes.OK,
        body: jsonData,
        headers: {
          'Content-Disposition': 'attachment; filename=output.json',
          'Content-Type': 'application/json'
        }
      }
    } catch (error) {
      console.error('[DataParserController] Error converting CSV to JSON:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: 'Error converting CSV to JSON' }
      }
    }
  }

  async jsonToCsv (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const { data } = iRequest.body || {}
      if (!data) {
        return {
          statusCode: httpStatusCodes.BAD_REQUEST,
          body: { error: 'JSON data is missing' }
        }
      }
      const csvData = this.dataParserService.jsonToCsv(data)
      return {
        statusCode: httpStatusCodes.OK,
        body: csvData,
        headers: {
          'Content-Disposition': 'attachment; filename=data.csv',
          'Content-Type': 'text/csv',
        }
      }
    } catch (error) {
      console.error('[DataParserController] Error converting JSON to CSV:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: 'Error converting JSON to CSV' }
      }
    }
  }
}
