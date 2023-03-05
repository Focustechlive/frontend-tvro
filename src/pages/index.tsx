/* eslint-disable @typescript-eslint/no-explicit-any */
import Head from 'next/head'
import { Formik } from 'formik'
import { Box } from '@chakra-ui/react'
import * as yup from 'yup'

import { Alert } from '../components/Alert'
import { Form } from '../components/Form'
import { FormHeader } from '../components/FormHeader'

import { api } from '../services/api'

import { alertEventEmitter } from '../utils/alertEventEmitter'

const FormSchema = yup.object().shape({
  cpfOrNis: yup
    .string()
    .min(11, 'CPF ou NIS inválido')
    .max(11, 'CPF ou NIS inválido')
    .required('CPF ou NIS é obrigátorio'),
  mobile: yup
    .string()
    .min(14, 'Telefone inválido')
    .max(15, 'Telefone inválido')
    .required('Telefone é obrigátorio'),
  email: yup.string().email('E-mail inválido'),
  have_whatsapp: yup.string().required('Campo obrigátorio'),
  agree_to_be_contacted: yup.string().required('Campo obrigátorio'),
  zipcode: yup
    .string()
    .min(9, 'CEP inválido')
    .max(9, 'CEP inválido')
    .required('CEP é obrigátorio'),
  state: yup.string().required('Estado é obrigátorio'),
  city: yup.string().required('Cidade é obrigátorio'),
  address: yup.string().required('Endereço é obrigátorio'),
  address_number: yup.string().required('Número é obrigátorio'),
  address_complement: yup.string(),
  district: yup.string().required('Bairro é obrigátorio'),
  reference_point: yup
    .string()
    .required('Ponto de Referência é obrigátorio'),
  antenna: yup.string().required('Selecione pelo menos uma antena')
})

export type FormData = {
  id: string
  name: string
  cpfOrNis: string
  cpf: string
  nis: string
  mobile: string
  email: string
  have_whatsapp: string
  agree_to_be_contacted: string
  family_code: string
  zipcode: string
  cadunico_zipcode: string
  state: string
  city: string
  ibge_code: string
  address: string
  address_number: number
  address_complement: string
  district: string
  reference_point: string
  user_watch_channels: string
  working_antenna: string
  antenna: string
  group_id: string
  date: string
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Enviar uma solicitação – Siga Antenado</title>
      </Head>

      <Box minH="100vh" py="10" px="6" bg="blackAlpha.50">
        <Box maxW={800} margin="0 auto" p={8} borderRadius={10} bg="white">
          <FormHeader />
          <Formik
            initialValues={{
              id: '',
              name: '',
              cpfOrNis: '',
              cpf: '',
              nis: '',
              mobile: '',
              email: '',
              have_whatsapp: '',
              agree_to_be_contacted: '',
              family_code: '',
              zipcode: '',
              cadunico_zipcode: '',
              state: '',
              city: '',
              ibge_code: '',
              address: '',
              address_number: '',
              address_complement: '',
              district: '',
              reference_point: '',
              antenna: '',
              user_watch_channels: '',
              group_id: '',
              date: '',
              working_antenna: ''
            }}
            validationSchema={FormSchema}
            onSubmit={async (values, actions) => {
              const {
                id,
                name,
                mobile,
                email,
                cpf,
                family_code,
                district,
                address,
                address_number,
                address_complement,
                reference_point,
                city,
                state,
                zipcode,
                ibge_code,
                cadunico_zipcode,
                have_whatsapp,
                agree_to_be_contacted,
                user_watch_channels,
                working_antenna
              } = values

              const contact = {
                id,
                name,
                mobile,
                email,
                cpf,
                family_code,
                district,
                city,
                state,
                address,
                house_number: address_number,
                complement: address_complement,
                reference_point,
                zip_code: zipcode,
                ibge_code,
                same_zip_code:
                  cadunico_zipcode === zipcode ? 'Sim' : 'Não',
                have_whatsapp: have_whatsapp,
                agree_to_be_contacted
              }

              const ticket = {
                name,
                mobile,
                email,
                zipcode,
                ibge_code,
                user_watch_channels,
                working_antenna
              }

              try {
                await api.post('/contacts', contact)

                await api.post('/tickets/installation', ticket)

                actions.resetForm()

                return (window.location.href = '/finalizar-atendimento')
              } catch {
                return alertEventEmitter({
                  type: 'error',
                  title: 'Atenção',
                  text: 'Ocorreu um erro ao tentar registrar seus dados. Tente novamente mais tarde'
                })
              } finally {
                actions.setSubmitting(false)
              }
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Form />
              </form>
            )}
          </Formik>

          <Alert />
        </Box>
      </Box>
    </>
  )
}
