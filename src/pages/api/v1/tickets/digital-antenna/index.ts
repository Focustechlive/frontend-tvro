import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, phone, email, antenna, zipcode, ibge_code } = req.body

    const ticket = {
      description: 'Antena é DIGITAL',
      name,
      phone: phone.replace(/\D/g, ''),
      email: email || null,
      priority: 1,
      status: 5,
      subject: 'Antena é DIGITAL',
      type: 'Antena é DIGITAL',
      custom_fields: {
        cf_cep: zipcode,
        cf_cdigo_ibge: ibge_code || null,
        cf_modelo_da_antena: antenna
      }
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
