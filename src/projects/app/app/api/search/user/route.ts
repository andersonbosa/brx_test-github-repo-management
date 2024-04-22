import { createBackendAPIUrl } from '@/env.config'
import { mapGithubUserItems } from '@/utils'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'


/* TODO melhoria implementar uso de autenticação para consumir API backend */

export async function GET (request: NextRequest) {
  const parsedUrl = new URL(request.url)
  const username = parsedUrl.searchParams.get('username')

  try {
    if (!username) {
      return NextResponse.json(
        { error: `Missing username parameter.` },
        { status: StatusCodes.BAD_REQUEST }
      )
    }
    const res = await fetch(
      createBackendAPIUrl(`/api/v1/search/user?username=${username}`),
    )
    const data = await res.json()
    return NextResponse.json(
      { data: mapGithubUserItems(data.items) },
      { status: StatusCodes.OK }
    )

  } catch (error: any) {
    return NextResponse.json(
      { error: `${error.message}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}

// /* #HACK usado como mock no desenvolvimento */
// export async function GET (request: NextRequest) {
//   const parsedUrl = new URL(request.url)
//   const username = parsedUrl.searchParams.get('username')
//   // fetch('https://google.com/api/test')
//   const mocks: GithubUserItem[] = [
//     {
//       username: 'kenneth-casey-all',
//       url: 'http://jozaji.ae/sah',
//       imageURL: 'https://picsum.photos/200?id=20880',
//     },
//     {
//       username: 'harold-dawson-all',
//       url: 'http://fa.sm/zomegu',
//       imageURL: 'https://picsum.photos/200?id=3329',
//     },
//     {
//       username: 'sarah-lyons-all',
//       url: 'http://ju.tg/incepu',
//       imageURL: 'https://picsum.photos/200?id=18806',
//     },
//     {
//       username: 'albert-bennett-all',
//       url: 'http://juj.ir/suvileti',
//       imageURL: 'https://picsum.photos/200?id=37739',
//     },
//     {
//       username: 'sara-paul-all',
//       url: 'http://paj.mc/cuno',
//       imageURL: 'https://picsum.photos/200?id=60323',
//     }
//   ]
//   return NextResponse.json({
//     data: mocks.filter(item => username && item.username.includes(username))
//   })
// }