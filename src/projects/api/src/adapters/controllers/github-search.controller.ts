import axios from 'axios'
import { IndependentRequest, IndependentResponse } from '../../@types'
import { httpStatusCodes } from '../../constants'

export class GithubSearchController {
  async searchUser (iRequest: IndependentRequest): Promise<IndependentResponse> {
    const username = iRequest.query?.username
    if (!username) {
      return {
        statusCode: httpStatusCodes.BAD_REQUEST,
        body: { error: "Missing 'username' parameter." }
      }
    }

    try {
      const result = await axios.get('https://api.github.com/search/users', {
        params: {
          q: username,
          per_page: 10
          /* 
            HACK only requests the first ten users
            TODO melhoria; implementar paginação
          */
        }
      })

      return {
        statusCode: httpStatusCodes.OK,
        body: result.data
      }
    } catch (error) {
      console.error('[GithubSearchController] Error during request handling:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR) }
      }
    }
  }

  async searchRepository (iRequest: IndependentRequest): Promise<IndependentResponse> {
    const page = iRequest.query?.page ?? 1
    const username = iRequest.query?.username

    if (!username) {
      return {
        statusCode: httpStatusCodes.BAD_REQUEST,
        body: { error: "Missing 'username' parameter." }
      }
    }

    try {
      const result = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: {
          page,
          per_page: 1000
          /* 
            HACK (possibly) requests all the user repositories
            TODO melhoria; implementar paginação
          */
        }
      })
      return {
        statusCode: httpStatusCodes.OK,
        body: result.data
      }
    } catch (error) {
      console.error('[src/api/src/controllers/search.controller.ts] Error during request handling:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR) }
      }
    }
  }
}
