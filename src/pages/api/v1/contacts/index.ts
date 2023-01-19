import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {
      name,
      phone,
      email,
      cpf,
      family_code,
      house_number,
      complement,
      district,
      city,
      address,
      state,
      zip_code,
      ibge_code,
      same_zip_code,
      have_whatsapp,
      reference_point,
      agree_to_be_contacted
    } = req.body

    try {
      await axios.post(
        'https://sigaantenado.freshdesk.com/api/v2/contacts',
        {
          name,
          phone,
          email: email || null,
          address,
          custom_fields: {
            cpf,
            cdigo_da_famlia: family_code || null,
            numero_da_residencia: house_number || null,
            complemento: complement || null,
            bairro: district,
            cidade: city,
            estado: state,
            ponto_de_referencia: reference_point || null,
            cep: zip_code,
            cep_igual_ao_do_cadunico: same_zip_code || null,
            codigo_ibge: ibge_code || null,
            celular_tem_whatsapp: have_whatsapp,
            concorda_em_ser_contatado_por_esse_nmero_ou_email:
              agree_to_be_contacted
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
        error: 'Contato já cadastrado'
      })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
