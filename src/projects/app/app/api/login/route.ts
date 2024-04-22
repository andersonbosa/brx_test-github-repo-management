// import { createBackendAPIUrl } from '@/env.config'
// import axios from 'axios'
// import { randomUUID } from 'crypto'
// import { StatusCodes } from 'http-status-codes'
// import type { NextApiRequest, NextApiResponse } from 'next'


// export async function POST (req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // const sessionData = req.body
//     const sessionCookie = await getSessionCookie()
//     if (sessionCookie) {
//       res.setHeader('Set-Cookie', ['session-id', sessionCookie])
//     }
//     res.status(StatusCodes.CONTINUE).json({ message: 'Successfully set cookie!' })
//   } catch (error) {
//     console.error('Error setting cookie:', error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
//   }
// }

// async function getSessionCookie (): Promise<string | null> {
//   try {
//     const response = await axios.post(
//       createBackendAPIUrl('/api/v1/auth/sign-in'),
//       { username: randomUUID() },
//     )
//     const cookies = response.headers['set-cookie']
//     return cookies?.find(c => c.includes('session-id')) ?? null
//   } catch (error) {
//     console.error('Error getting session cookie:', error)
//     return null
//   }
// }