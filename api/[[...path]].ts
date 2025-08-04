import { NextApiRequest, NextApiResponse } from 'next'
import app from '../src/index'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Convert Next.js request to Express request
  const expressReq = req as any
  const expressRes = res as any

  // Handle the request with Express app
  app(expressReq, expressRes)
}
