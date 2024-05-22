import { GithubUserRepositoryItem } from '@/types'
import { mapGithubUserRepositoryItems } from '@/utils'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'


/* TODO melhoria implementar uso de autenticação para consumir API backend */
export async function GET (request: NextRequest) {
  const parsedUrl = new URL(request.url)
  const username = parsedUrl.searchParams.get('username')
  const page = parsedUrl.searchParams.get('page') ?? 1

  try {
    if (!username) {
      return NextResponse.json(
        { error: `Missing username parameter.` },
        { status: StatusCodes.BAD_REQUEST }
      )
    }

    /* TODO melhoria; oS correto seria implementar paginação, para este projeto iremos consultar 1000 registros para facilitar */
    const data = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=1000`)
      .then(response => response.json())
      .catch(err => console.error(err))

    return NextResponse.json({
      data: mapGithubUserRepositoryItems(data)
    })

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
//   return getMock(username ?? '')
// }

function getMock (username: string) {
  const mocks: GithubUserRepositoryItem[] = [
    {
      owner: 'Craig Robbins',
      title: '486 Olhak Drive',
      stars: 126,
      description: 'Exercitation Lorem cillum sint velit laborum voluptate amet commodo incididunt nulla incididunt dolor fugiat et.',
    },
    {
      owner: 'Willie Sparks',
      title: '1500 Imorag Manor',
      stars: 194,
      description: 'Commodo ea non proident est aute nisi occaecat dolor duis ullamco.',
    },
    {
      owner: 'Peter Huff',
      title: '220 Jaro Pike',
      stars: 180,
      description: 'Irure duis incididunt mollit ad minim duis deserunt ea officia labore nulla eiusmod.',
    },
    {
      owner: 'Lena Wade',
      title: '580 Zagoti Turnpike',
      stars: 205,
      description: 'Eu laborum deserunt amet officia ut minim.',
    },
    {
      owner: 'Josephine Vargas',
      title: '1568 Gukbu Circle',
      stars: 96,
      description: 'Incididunt id deserunt esse do cupidatat do exercitation Lorem dolor.',
    },
    {
      owner: 'Mamie Lewis',
      title: '1663 Uzhev Ridge',
      stars: 52,
      description: 'Quis aliquip fugiat aute cupidatat ea ad mollit.',
    },
    {
      owner: 'Agnes Gutierrez',
      title: '250 Olbe Trail',
      stars: 63,
      description: 'Ipsum officia magna et irure laborum fugiat consectetur nostrud deserunt.',
    },
    {
      owner: 'Logan Alexander',
      title: '724 Kikmo Way',
      stars: 81,
      description: 'Lorem id labore aliqua do.',
    },
    {
      owner: 'Sarah Beck',
      title: '1105 Hasba Junction',
      stars: 79,
      description: 'Ad quis exercitation duis nisi exercitation reprehenderit dolore velit aliquip.',
    }
  ]
  return NextResponse.json({ data: mocks })
}