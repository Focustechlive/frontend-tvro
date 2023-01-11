import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email } = req.body

    try {
      const response = await axios.post(
        'https://sigaantenado.freshdesk.com/api/v2/tickets',
        {
          description: 'Cidade não atendida',
          email,
          priority: 1,
          status: 5,
          subject: 'Cidade não atendida',
          type: 'Cidade não atendida'
        },
        {
          auth: {
            username: process.env.FRESHDESK_USERNAME as string,
            password: process.env.FRESHDESK_PASSWORD as string
          }
        }
      )

      return res.status(201).json(response.data)
    } catch {
      return res.status(400).end({
        error: 'Ticket já cadastrado'
      })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
