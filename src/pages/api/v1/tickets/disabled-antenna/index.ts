import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {
      name,
      phone,
      email,
      zipcode,
      ibge_code,
      user_watch_channels,
      working_antenna
    } = req.body

    const ticket = {
      description: 'Solicita Agendamento - Parabolica desativada',
      name,
      phone: phone.replace(/\D/g, ''),
      email: email || null,
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
    }

    try {
      const response = await axios.post(
        'https://sigaantenadosandbox.freshdesk.com/api/v2/tickets',
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
