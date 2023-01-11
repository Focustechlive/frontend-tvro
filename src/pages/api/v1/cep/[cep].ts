import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${req.query.cep}/json/`
    )

    if (response.data.erro) {
      return res.status(404).json({
        error: 'CEP não encontrado'
      })
    }

    const { cep, bairro, localidade, logradouro, uf, ibge } = response.data

    return res.status(200).json({
      zip_code: cep,
      ibge,
      district: bairro,
      city: localidade,
      state: uf,
      street: logradouro
    })
  } catch {
    return res.status(500).end('Internal server error')
  }
}
