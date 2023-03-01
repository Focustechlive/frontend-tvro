import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {cpf} = req.body
  let API_URL = `https://sigaantenado.freshdesk.com/api/v2/search/contacts?query="cpf:'` as string
    try {
      API_URL = API_URL+ cpf + `'"`
      const response = await axios.get(
        API_URL,
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
}
