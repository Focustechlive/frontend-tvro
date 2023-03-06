import React, { ChangeEvent, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Image,
  Radio,
  RadioGroup,
  Text
} from '@chakra-ui/react'
import AsyncSelect from 'react-select/async'

import type { FormData } from '../../../pages/index'

import { api } from '../../../services/api'
import { alertEventEmitter } from '../../../utils/alertEventEmitter'

export function FourthStep() {
  const [antennaIsParabolic, setAntennaIsParabolic] = useState(false)
  const [canTheUserWatchChannels, setCanTheUserWatchChannels] =
    useState(false)
  const [showSubmitButton, setShowSubmitButton] = useState(false)

  const { values, setValues, resetForm, initialValues, isSubmitting } =
    useFormikContext<FormData>()

  const [antennaField] = useField('antenna')
  const [, , userWatchChannelsHelper] = useField('user_watch_channels')
  const [, , workingAntennaHelper] = useField('working_antenna')
  const [, dateMeta] = useField('date')
  let [dateList]: any = useState([{ label: 'Sem Data', value: 1 }])

  async function handleAntennaChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { value } = event.target

    antennaField.onChange(event)

    if (value === 'Antena Parabólica Convencional') {
      return setAntennaIsParabolic(true)
    }

    alertEventEmitter({
      type: 'success',
      title: 'Atenção',
      text: 'Boa notícia! Você já possui uma antena digital que oferece mais qualidade de som e imagem. Se quiser saber mais detalhes, acesse www.sigaantenado.com.br'
    })

    const {
      name,
      mobile,
      cpf,
      email,
      have_whatsapp,
      agree_to_be_contacted,
      family_code,
      district,
      city,
      state,
      zipcode,
      address,
      ibge_code,
      cadunico_zipcode,
      address_complement,
      reference_point,
      address_number
    } = values

    const contact = {
      name,
      mobile,
      email,
      cpf,
      family_code,
      district,
      city,
      state,
      address,
      zip_code: zipcode,
      ibge_code,
      house_number: address_number,
      complement: address_complement,
      reference_point,
      same_zip_code: cadunico_zipcode === value ? 'Sim' : 'Não',
      have_whatsapp,
      agree_to_be_contacted
    }

    const ticket = {
      name,
      mobile,
      email,
      zipcode,
      antenna: value,
      ibge_code
    }

    const nrCpf = {
      cpf
    }

    contact.email = email === '' ? `${cpf}@sigaantenado.com.br` : email
    await api.post('/contacts', contact)
    await api.post('/tickets/digital-antenna', ticket)
    resetForm()
    setValues(initialValues)
  }

  async function callApi() {
    const { ibge_code } = values
    dateList = await api.get(`/date/${ibge_code}`)
    return dateList.data
  }

  async function handleAntennaQuestionsChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { value } = event.target

    if (canTheUserWatchChannels && value === 'Sim') {
      userWatchChannelsHelper.setValue('Sim')
      workingAntennaHelper.setValue('Sim')

      return setShowSubmitButton(true)
    }

    alertEventEmitter({
      type: 'warning',
      title: 'Atenção',
      text: 'Para que o kit gratuito seja instalado, é necessário que a residência tenha uma parabólica tradicional/convencional instalado e funcionando. Podemos voltar em outra data a ser reagendada, caso você opte por corrigir ou consertar a instalação da sua parabólica antiga.'
    })

    const {
      name,
      mobile,
      cpf,
      email,
      have_whatsapp,
      agree_to_be_contacted,
      family_code,
      district,
      city,
      state,
      zipcode,
      ibge_code,
      cadunico_zipcode,
      address,
      address_number,
      address_complement,
      reference_point
    } = values

    const contact = {
      name,
      mobile,
      email,
      cpf,
      family_code,
      district,
      city,
      state,
      address,
      zip_code: zipcode,
      ibge_code,
      house_number: address_number,
      complement: address_complement,
      reference_point,
      same_zip_code: cadunico_zipcode === value ? 'Sim' : 'Não',
      have_whatsapp,
      agree_to_be_contacted
    }
    const ticket = {
      name,
      mobile,
      email,
      zip_code: zipcode,
      ibge_code,
      user_watch_channels: canTheUserWatchChannels ? 'Sim' : 'Não',
      working_antenna: value
    }
    contact.email = email === '' ? `${cpf}@sigaantenado.com.br` : email
    await api.post('/contacts', contact)
    await api.post('/tickets/disabled-antenna', ticket)
    resetForm()
    setValues(initialValues)
  }

  async function handleChange(newValue: any) {
    const value2 = newValue.value
    const label2 = newValue.label
    values.date = label2
    values.group_id = value2
  }

  return (
    <>
      <Text align="center" fontSize="2xl" maxW={660} alignSelf="center">
        Selecione o tipo de antena que mais se assemelha com a que você
        possui atualmente:
      </Text>

      <FormControl>
        <RadioGroup id="antenna" name="antenna">
          <Grid
            templateColumns={{
              md: 'repeat(4, 1fr)',
              sm: 'repeat(2, 1fr)'
            }}
            gap={6}
          >
            <GridItem
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Radio
                onChange={handleAntennaChange}
                value="Antena Parabólica Convencional"
                flexDirection="column-reverse"
                textAlign="center"
              >
                <Box
                  width={100}
                  height={100}
                  margin="0 auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/images/antena-parabolica-convencional.png"
                    alt="Antena Parabólica Convencional"
                    height="100%"
                  />
                </Box>

                <Text textAlign="center" margin="2">
                  Parabólica Convencional
                </Text>
              </Radio>
            </GridItem>

            <GridItem
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Radio
                onChange={handleAntennaChange}
                value="Antena Espinha de Peixe"
                flexDirection="column-reverse"
              >
                <Box
                  width={100}
                  height={100}
                  margin="0 auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/images/antena-externa-para-tv-digital.png"
                    alt="Antena externa para TV digital"
                    height="100%"
                  />
                </Box>

                <Text textAlign="center" margin="2">
                  Antena externa para TV digital
                </Text>
              </Radio>
            </GridItem>

            <GridItem
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Radio
                onChange={handleAntennaChange}
                value="Antena Digital Interna"
                flexDirection="column-reverse"
              >
                <Box
                  width={100}
                  height={100}
                  margin="0 auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/images/antena-interna-para-tv-digital.png"
                    alt="Antena interna para TV digital"
                    height="100%"
                  />
                </Box>

                <Text textAlign="center" margin="2">
                  Antena interna para TV digital
                </Text>
              </Radio>
            </GridItem>

            <GridItem
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Radio
                onChange={handleAntennaChange}
                value="Antena de TV por Assinatura"
                flexDirection="column-reverse"
              >
                <Box
                  width={100}
                  height={100}
                  margin="0 auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/images/antena-usada-por-tv-por-assinatura.png"
                    alt="Antena de TV por Assinatura"
                    height="100%"
                  />
                </Box>

                <Text textAlign="center" margin="2">
                  Antena usada para TV por assinatura
                </Text>
              </Radio>
            </GridItem>
          </Grid>
        </RadioGroup>
      </FormControl>

      {antennaIsParabolic && (
        <>
          <FormControl isRequired>
            <FormLabel>
              Você consegue assistir aos canais na sua TV conectada a essa
              antena parabólica?
            </FormLabel>

            <RadioGroup py={2} display="flex" gridColumnGap={2}>
              <HStack spacing="24px">
                <Radio
                  onChange={() => setCanTheUserWatchChannels(true)}
                  value="Sim"
                >
                  Sim
                </Radio>

                <Radio
                  onChange={() => setCanTheUserWatchChannels(false)}
                  value="Não"
                >
                  Não
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              Até o dia da instalação a sua TV estará conectada à antena
              parabólica e funcionando?
            </FormLabel>

            <RadioGroup py={2} display="flex" gridColumnGap={2}>
              <HStack spacing="24px">
                <Radio onChange={handleAntennaQuestionsChange} value="Sim">
                  Sim
                </Radio>

                <Radio onChange={handleAntennaQuestionsChange} value="Não">
                  Não
                </Radio>
              </HStack>
            </RadioGroup>
            <FormLabel>Selecione o dia da instalação a sua TV?</FormLabel>
            <div className="App">
              <AsyncSelect
                defaultOptions
                cacheOptions
                loadOptions={callApi}
                onChange={handleChange}
              />
            </div>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={!!dateMeta.touched && !!dateMeta.error}
          >
            {showSubmitButton && (
              <Button type="submit" isLoading={isSubmitting}>
                Registrar
              </Button>
            )}
          </FormControl>
        </>
      )}
    </>
  )
}
