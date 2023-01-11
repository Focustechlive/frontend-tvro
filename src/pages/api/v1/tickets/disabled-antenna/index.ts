import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {
      email,
      zipcode,
      ibge_code,
      user_watch_channels,
      working_antenna
    } = req.body

    try {
      await axios.post(
        'https://sigaantenado.freshdesk.com/api/v2/tickets',
        {
          description: 'Solicita Agendamento - Parabolica desativada',
          email,
          priority: 1,
          status: 5,
          subject: 'Solicita Agendamento - Parabolica desativada',
          type: 'Solicita Agendamento - Parabolica desativada',
          custom_fields: {
            cf_cep: zipcode,
            cf_cdigo_ibge: ibge_code ?? '',
            cf_modelo_da_antena: 'Antena Parabólica Convencional',
            cf_voc_consegue_assistir_aos_canais_da_sua_tv_conectada_a_sua_antena_parablica:
              user_watch_channels ?? '',
            cf_at_o_dia_da_instalao_a_sua_tv_estar_conectada_antena_parablica_e_funcionando:
              working_antenna ?? ''
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
