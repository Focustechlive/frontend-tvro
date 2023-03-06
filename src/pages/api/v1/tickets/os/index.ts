import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
import moment from 'moment'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    name,
    mobile,
    cpf,
    address,
    address_number,
    group_id,
    contact_id,
    date,
    ibge_code,
    cep,
    district,
    address_complement,
    state,
    city,
    family_code,
    reference_point
  } = req.body

  const ticket = {
    type: 'Service Task',
    subject: 'OS de Instalação - Chat',
    description: `Agendamento de campos para o cliente dos dados abaixo.</p>Nome:${name} </p>CPF:${cpf} </p> Endereço${address} - Número: ${address_number}`,
    group_id: parseInt(group_id),
    source: 102,
    status: 9,
    priority: 1,
    requester_id: contact_id,
    custom_fields: {
      cf_fsm_contact_name: name,
      cf_fsm_phone_number: mobile,
      cf_fsm_service_location: `${address} ${address_number}`,
      cf_fsm_appointment_start_time: `${date}T12:00:00Z`,
      cf_fsm_appointment_end_time: `${date}T21:00:00Z`,
      cf_grupoid: parseInt(group_id),
      cf_data_da_visita: `${date}T12:00-00Z`,
      cf_data_hora_agendamento: `${date}T12:00-00Z`,
      cf_data_instalao: `${date}T12:00-00Z`,
      cf_data_inicio_instalao: `${date}T12:00-00Z`,
      cf_data_fim_instalao: `${date}T21:00-00Z`,
      cf_data_hora_gerao_os: moment().toISOString(),
      cf_data_de_registro: moment().toISOString(),
      cf_cdigo_ibge: ibge_code,
      cf_ponto_de_referncia: reference_point,
      cf_cep740081: cep,
      cf_bairro: district,
      cf_complemento: address_complement,
      cf_uf239745: state,
      cf_telefone_beneficiario: mobile,
      cf_cpf_do_solicitante: cpf,
      cf_cdigo_de_familia: family_code,
      cf_nmero: address_number,
      cf_cidade: city
    }
  }

  try {
    const response = await axios.post(
      'https://sigaantenado.freshdesk.com/api/v2/tickets',
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
}
