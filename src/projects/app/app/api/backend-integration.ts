import { createBackendAPIUrl, createNextAPIUrl } from '@/env.config'
import { GithubUserItem } from '@/types'
import axios from 'axios'


export async function apiGithubRepositoryGet (username: string): Promise<GithubUserItem[]> {
  const URL = createNextAPIUrl(`/api/search/repository?username=${username}`)
  const response = await axios.get(URL)
    .catch(error => console.error('apiGithubRepositoryGet: Error when seeking users:', error))
  return response?.data?.data ?? []
}

export async function apiGithubUserSearch (username: string): Promise<GithubUserItem[]> {
  const URL = createNextAPIUrl(`/api/search/user?username=${username}`)
  const response = await axios.get(URL)
    .catch(error => console.error('apiGithubUserSearch: Error when seeking users:', error))
  return response?.data?.data ?? []
}

export interface ICreateUserOrderInput {
  type: 'import' | 'export'
  data: any
}

export function createUserOrderInput ({ type, data }: ICreateUserOrderInput): ICreateUserOrderInput {
  return { type, data: JSON.stringify(data) }
}

export async function apiCreateUserOrder (payload: ICreateUserOrderInput) {
  const nextURL = createBackendAPIUrl('/api/v1/orders')
  const response = await axios.post(nextURL, payload)
  return response.data ?? {}
}

export async function apiConvertCsvToJson (payload: ICreateUserOrderInput) {
  const nextURL = createBackendAPIUrl('/api/v1/converter/csv2json')
  const response = await axios.post(nextURL, payload)
  return response.data ?? ''
}

export async function apiConvertJsonToCsv (payload: ICreateUserOrderInput) {
  const nextURL = createBackendAPIUrl('/api/v1/converter/json2csv')
  const response = await axios.post(nextURL, payload)
  return downloadFile(response.data, response.headers['Content-Type'], 'output.csv')
}

function downloadFile (responseData: BlobPart, contentType: any, fileName: string) {
  const blob = new Blob([responseData], { type: contentType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}