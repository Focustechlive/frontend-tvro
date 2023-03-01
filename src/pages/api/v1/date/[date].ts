import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = {
    ibge: `${req.query.date}`
  }

  try {
    const API_URL = process.env.DATE_URL as string
    const response = await axios.post(API_URL, body)
    const loopData = []
    loopData.push({
      label: response['data'].data_1.data,
      value: response['data'].data_1.id
    })
    loopData.push({
      label: response['data'].data_2.data,
      value: response['data'].data_2.id
    })
    loopData.push({
      label: response['data'].data_3.data,
      value: response['data'].data_3.id
    })
    return res.status(response.status).json(loopData)
  } catch {
    return res.status(500).end('Internal server error')
  }
}
