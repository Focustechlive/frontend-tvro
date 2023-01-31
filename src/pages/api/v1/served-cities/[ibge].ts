//sigaantenado.freshdesk.com/api/v2/custom_objects/schemas/146513/records?ibge=3550308

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ibge } = req.query

  try {
    const response = await axios.get(
      `https://sigaantenado.freshdesk.com/api/v2/custom_objects/schemas/163989/records?ibge=${ibge}`,
      {
        auth: {
          username: process.env.FRESHDESK_USERNAME as string,
          password: process.env.FRESHDESK_PASSWORD as string
        }
      }
    )

    if (response.data.records.length === 0) {
      return res.status(200).json({
        served: false
      })
    }

    return res.status(200).json({
      served: true
    })
  } catch {
    return res.status(500).end('Internal server error')
  }
}
