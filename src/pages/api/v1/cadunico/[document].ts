import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { document } = req.query

  try {
    const API_URL = process.env.CADUNICO_API_URL as string

    const [cpfResponse, nisResponse] = await Promise.all([
      axios.post(API_URL, {
        cpf: document
      }),
      axios.post(API_URL, {
        nis: document
      })
    ])

    const documentExists =
      cpfResponse.data.found === 1 || nisResponse.data.found === 1

    if (!documentExists) {
      return res.status(404).json({
        error: 'Documento não encontrado.'
      })
    }

    return res.status(200).json({
      name: cpfResponse.data?.no_pessoa ?? nisResponse.data?.no_pessoa,
      cpf:
        cpfResponse?.data?.nu_cpf_pessoa?.padStart(11, '0') ??
        nisResponse?.data?.nu_cpf_pessoa?.padStart(11, '0'),
      nis:
        cpfResponse.data?.nu_nis_pessoa?.padStart(11, '0') ??
        nisResponse.data?.nu_nis_pessoa?.padStart(11, '0'),
      zip_code:
        cpfResponse.data?.nu_cep_logradouro_fam ??
        nisResponse.data?.nu_cep_logradouro_fam,
      family_code:
        cpfResponse.data?.co_familiar_fam ??
        nisResponse.data?.co_familiar_fam
    })
  } catch {
    return res.status(500).end('Internal server error')
  }
}
