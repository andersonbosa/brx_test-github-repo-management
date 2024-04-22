import { createBackendAPIUrl } from '@/env.config'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { ICreateUserOrderInput } from '../../backend-integration'
import axios from 'axios'


export async function POST (request: NextRequest) {
  try {
    const payload: ICreateUserOrderInput = await request.json()
    const backendURL = createBackendAPIUrl('/api/v1/orders')
    //console.log(backendURL, )
    const response = await axios.post(backendURL, payload)
    return NextResponse.json(
      {
        data: response.data,
      },
      { status: StatusCodes.OK }
    )

  } catch (error: any) {
    return NextResponse.json(
      { error: `${error.message}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
