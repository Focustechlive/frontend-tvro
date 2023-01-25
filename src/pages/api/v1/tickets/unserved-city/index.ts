import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, phone, email } = req.body

    const ticket = {
      description: 'Cidade não atendida',
      name,
      email: email || null,
      phone: phone.replace(/\D/g, ''),
      priority: 1,
      status: 5,
      subject: 'Cidade não atendida',
      type: 'Cidade não atendida'
    }

    try {
      const response = await axios.post(
        'https://sigaantenado.freshdesk.com/api/v2/tickets',
        ticket,
        {
          auth: {
            username: process.env.FRESHDESK_USERNAME as string,
            password: process.env.FRESHDESK_PASSWORD as string
          }
        }
      )

      return res.status(response.status).json(response.data)
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data) {
        return res.status(error.response.status).json(error.response.data)
      }
    }
  } else {
    return res.status(405).end('Method not allowed')
  }
}
