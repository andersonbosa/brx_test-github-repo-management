import axios from 'axios'
import { IGithubService, PaginationMetadata } from './../../ports/services.ports'


/**
 * #TODO GithubRESTAPIService melhorias
 * - corrigir paginação
 * - melhorar tipos e interfaces
 */
export class GithubRESTAPIService implements IGithubService {
  constructor(
    public baseURL: string = 'https://api.github.com'
  ) { }

  async searchUser (username: string) {
    try {
      const uri = `${this.baseURL}/search/users?q=${encodeURIComponent(username)}`
      const response = await axios.get(uri)
      return {
        data: response.data,
      }
    } catch (error) {
      throw new Error(`[GithubRESTAPIService] Error when searching user ${username} from GitHub: ${error}`)
    }
  }

  async getUserRepositories (
    username: string,
    page: number = 0,
    perPage: number = 100
  ) {
    try {
      const uri = `${this.baseURL}/users/${encodeURIComponent(username)}/repos`
      const response = await axios.get(uri, {
        params: { page, per_page: perPage }
      })
      const pagination = this.extractPaginationMetadata(response.headers)
      return {
        data: response.data,
        metadata: pagination
      }
    } catch (error) {
      throw new Error(`[GithubRESTAPIService] Error when obtaining user repositories ${username} from GitHub: ${error}`)
    }
  }

  /* https://docs.github.com/pt/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers */
  private extractPaginationMetadata (headers: any): PaginationMetadata {
    const linkHeader = headers.link
    if (!linkHeader) {
      return {}
    }

    const links = linkHeader.split(',').map((link: string) => link.trim().split(';'))
    const paginationMetadata: PaginationMetadata = {}

    links.forEach((link: string[]) => {
      const url = link[0].slice(1, -1)
      const rel = link[1].split('=')[1].slice(1, -1)
      const pageNumber = parseInt(url.match(/page=(\d+)/)?.[1] || '')

      if (rel === 'prev') {
        paginationMetadata.prevPage = pageNumber
      } else if (rel === 'next') {
        paginationMetadata.nextPage = pageNumber
      } else if (rel === 'last') {
        paginationMetadata.lastPage = pageNumber
      } else if (rel === 'first') {
        paginationMetadata.firstPage = pageNumber
      }
    })

    return paginationMetadata
  }
}
