import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, ibge_code, group_id } = req.body
  const body = {
    date,
    ibge_code,
    group_id
  }
  const API_URL = `http://20.226.3.124/mid/increment` as string
  try {
    const response = await axios.post(API_URL, body, {
      auth: {
        username: process.env.FRESHDESK_USERNAME as string,
        password: process.env.FRESHDESK_PASSWORD as string
      }
    })
    return res.status(response.status).json(response.data)
  } catch (error) {
    if (error instanceof AxiosError && error?.response?.data) {
      return res.status(error.response.status).json(error.response.data)
    }
  }
}
