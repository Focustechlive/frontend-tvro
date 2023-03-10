import { ChangeEvent, useState } from 'react'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Spinner
} from '@chakra-ui/react'

import type { FormData } from '../../../pages/index'

import { api } from '../../../services/api'

import { formatZipCode } from '../../../utils/formatZipCode'
import { alertEventEmitter } from '../../../utils/alertEventEmitter'

const ZIP_CODE_MAX_LENGTH = 9

type FourthStep = {
  zipCodeIsValid: boolean
  onZipCodeIsValid(isValid: boolean): void
}

export function ThirdStep({
  zipCodeIsValid,
  onZipCodeIsValid
}: FourthStep) {
  const [searchingZipCode, setSearchingZipCode] = useState(false)

  const [zipcodeField, zipcodeMeta, zipcodeHelper] = useField('zipcode')
  const [, addressMeta] = useField('address')
  const [, addressNumberMeta] = useField('address_number')
  const [, addressComplementMeta] = useField('address_complement')
  const [, districtMeta] = useField('district')
  const [, referencePointMeta] = useField('reference_point')

  const { values, setValues, resetForm, initialValues } =
    useFormikContext<FormData>()

  async function checkIfZipCodeExists(value: string) {
    try {
      setSearchingZipCode(true)
      let data: any
      try {
        data = await api.get(`/cep2/${value}`)
      } catch {
        data = await api.get(`/cep/${value}`)
      }
      const { district, city, state, street, ibge } = data.data

      setValues((prevState) => ({
        ...prevState,
        ibge_code: ibge.toString(),
        address: street,
        city,
        state,
        district
      }))

      const response2 = await api.get(`/date/${ibge}`)
      const response = await api.get(`/served-cities/${ibge}`)

      if (response.data.served === true) {
        return onZipCodeIsValid(true)
      }

      const {
        name,
        mobile,
        cpf,
        email,
        have_whatsapp,
        family_code,
        agree_to_be_contacted,
        cadunico_zipcode
      } = values

      const contact = {
        name,
        mobile,
        cpf,
        family_code,
        district,
        address: street,
        city,
        state,
        zip_code: value,
        ibge_code: ibge,
        same_zip_code: cadunico_zipcode === value ? 'Sim' : 'N??o',
        have_whatsapp: have_whatsapp,
        agree_to_be_contacted
      }

      const ticket = {
        name,
        mobile,
        email
      }

      await api.post('/contacts', contact)

      await api.post('/tickets/unserved-city', ticket)

      resetForm()
      setValues(initialValues)

      return alertEventEmitter({
        type: 'warning',
        title: 'Aten????o',
        text: 'Sua cidade ainda n??o come??ou o processo de instala????o dos kits gratuitos para benefici??rios de programas socias na sua cidade. Mas n??o se preocupe, sua vez ainda vai chegar! Logo que o processo se iniciar na sua cidade, voc?? ser?? avisado pelos meios de comunica????o.'
      })
    } catch {
      return alertEventEmitter({
        type: 'error',
        title: 'Aten????o',
        text: 'CEP n??o existe, por favor tente novamente'
      })
    } finally {
      setSearchingZipCode(false)
    }
  }

  async function handleZipcodeChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value.replace(/[^0-9]/g, '')

    const formattedValue = formatZipCode(value)

    zipcodeField.onChange(event)
    zipcodeHelper.setValue(formattedValue)

    if (formattedValue.length !== ZIP_CODE_MAX_LENGTH) {
      onZipCodeIsValid(false)

      return
    }

    await checkIfZipCodeExists(value)
  }

  const shouldRenderOtherAddressFields =
    zipCodeIsValid && !zipcodeMeta.error

  return (
    <>
      <Grid templateColumns={{ md: 'repeat(3, 1fr)' }} gap={6}>
        <GridItem>
          <FormControl
            isRequired
            isInvalid={!!zipcodeMeta.touched && !!zipcodeMeta.error}
            isDisabled={searchingZipCode}
          >
            <FormLabel>CEP</FormLabel>

            <Box position="relative">
              <Field
                as={Input}
                name="zipcode"
                placeholder="00000-000"
                maxLength={ZIP_CODE_MAX_LENGTH}
                onChange={handleZipcodeChange}
              />

              {searchingZipCode && (
                <Spinner
                  position="absolute"
                  right="4"
                  top="2"
                  color="gray.500"
                />
              )}
            </Box>

            <ErrorMessage name="zipcode" component={FormErrorMessage} />
          </FormControl>
        </GridItem>

        {shouldRenderOtherAddressFields && (
          <>
            <GridItem>
              <FormControl isRequired isDisabled>
                <FormLabel>Estado</FormLabel>

                <Field as={Input} name="state" variant="filled" />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired isDisabled>
                <FormLabel>Cidade</FormLabel>

                <Field as={Input} name="city" variant="filled" />
              </FormControl>
            </GridItem>
          </>
        )}
      </Grid>

      {shouldRenderOtherAddressFields && (
        <>
          <Grid templateColumns={{ md: 'repeat(3, 1fr)' }} gap={6}>
            <GridItem>
              <FormControl
                isRequired
                isInvalid={!!addressMeta.touched && !!addressMeta.error}
              >
                <FormLabel>Endere??o</FormLabel>

                <Field as={Input} name="address" />

                <ErrorMessage
                  name="address"
                  component={FormErrorMessage}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl
                isRequired
                isInvalid={
                  !!addressNumberMeta.touched && !!addressNumberMeta.error
                }
              >
                <FormLabel>N??mero</FormLabel>

                <Field as={Input} name="address_number" placeholder="N??" />

                <ErrorMessage
                  name="address_number"
                  component={FormErrorMessage}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl
                isInvalid={
                  !!addressComplementMeta.touched &&
                  !!addressComplementMeta.error
                }
              >
                <FormLabel>Complemento</FormLabel>

                <Field as={Input} name="address_complement" />

                <ErrorMessage
                  name="address_complement"
                  component={FormErrorMessage}
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <FormControl
                isRequired
                isInvalid={!!districtMeta.touched && !!districtMeta.error}
              >
                <FormLabel>Bairro</FormLabel>

                <Field as={Input} name="district" />

                <ErrorMessage
                  name="district"
                  component={FormErrorMessage}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl
                isRequired
                isInvalid={
                  !!referencePointMeta.touched &&
                  !!referencePointMeta.error
                }
              >
                <FormLabel>Ponto de Refer??ncia</FormLabel>

                <Field
                  as={Input}
                  name="reference_point"
                  placeholder="Ex: Perto das Casas Bahia"
                />

                <ErrorMessage
                  name="reference_point"
                  component={FormErrorMessage}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </>
      )}
    </>
  )
}
