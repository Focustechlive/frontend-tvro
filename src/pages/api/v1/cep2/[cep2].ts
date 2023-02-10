import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let token: any
  try {
    const params = new URLSearchParams()
    params.append('username', 'weverson')
    params.append('password', 'abc123')
    params.append('expires_in', '84600')
    params.append('grant_type', 'password')
    const response = await axios.post(
      `https://api.datasintese.com//oauth/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    token = 'Bearer ' + response.data.access_token
  } catch {
    return res.status(500).end('Internal server error')
  }

  try {
    const response1 = await axios.get(
      `https://api.datasintese.com//v2/datasearch/enderecos/${req.query.cep2}`,
      {
        headers: {
          Authorization: `${token}`
        }
      }
    )

    const { cep, bairro, localidade, logradouro, uf, ibge } = {
      cep: response1.data.sintese.endereco_postal['0'].cep,
      bairro: response1.data.sintese.endereco_postal['0'].bairro,
      localidade: response1.data.sintese.endereco_postal['0'].municipio,
      logradouro:
        response1.data.sintese.endereco_postal['0'].tipo_logradouro +
        ' ' +
        response1.data.sintese.endereco_postal['0'].logradouro === 'null'
          ? ''
          : response1.data.sintese.endereco_postal['0'].logradouro,
      uf: response1.data.sintese.endereco_postal['0'].uf,
      ibge: response1.data.sintese.endereco_postal['0'].codigo_municipio
    }

    return res.status(response1.status).json({
      cep,
      ibge,
      district: bairro,
      city: localidade,
      state: uf,
      street: logradouro
    })
  } catch (error) {
    return res.status(500).end('Internal server error')
  }
}
