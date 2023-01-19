import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, phone, email, antenna, zipcode, ibge_code } = req.body

    try {
      await axios.post(
        'https://sigaantenado.freshdesk.com/api/v2/tickets',
        {
          description: 'Antena é DIGITAL',
          name,
          phone,
          email: email || null,
          priority: 1,
          status: 5,
          subject: 'Antena é DIGITAL',
          type: 'Antena é DIGITAL',
          custom_fields: {
            cf_cep: zipcode,
            cf_cdigo_ibge: ibge_code ?? '',
            cf_modelo_da_antena: antenna
          }
        },
        {
          auth: {
            username: process.env.FRESHDESK_USERNAME as string,
            password: process.env.FRESHDESK_PASSWORD as string
          }
        }
      )

      return res.status(201).end()
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
