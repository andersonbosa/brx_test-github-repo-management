import Papa from 'papaparse'

export interface IDataParser {
  csvToJson (csvData: string): string
  jsonToCsv (jsonData: string): string
}

export class DataParser implements IDataParser {

  csvToJson (csvData: string): string {
    return JSON.stringify(Papa.parse(csvData, {
      header: true
    }))
  }

  jsonToCsv (jsonData: string): string {
    return Papa.unparse(JSON.parse(jsonData))
  }
}