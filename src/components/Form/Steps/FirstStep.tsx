import { ChangeEvent, useState } from 'react'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner
} from '@chakra-ui/react'

import type { FormData } from '../../../pages/index'

import { api } from '../../../services/api'
import { alertEventEmitter } from '../../../utils/alertEventEmitter'

const CPF_OR_NIS_MAX_LENGTH = 11

type FirstStepProps = {
  onCpfOrNisIsValid(isValid: boolean): void
}

export function FirstStep({ onCpfOrNisIsValid }: FirstStepProps) {
  const [cpfOrNisField, meta, cpfOrNisHelper] = useField('cpfOrNis')
  const [validatingDocument, setValidatingDocument] = useState(false)

  const { setValues } = useFormikContext<FormData>()

  async function checkIfCpfOrNisIsValid(value: string) {
    try {
      setValidatingDocument(true)

      const response = await api.get(`/cadunico/${value}`)

      const { name, cpf, nis, family_code, zip_code } = response.data

      setValues((prevState) => ({
        ...prevState,
        name,
        family_code,
        cpf,
        nis,
        cadunico_zipcode: zip_code
      }))

      return onCpfOrNisIsValid(true)
    } catch {
      cpfOrNisHelper.setValue('')

      return alertEventEmitter({
        title: 'Atenção',
        text: 'Não encontramos seus dados na nossa base de informações. Se você faz parte de algum programa social, atualize seus dados no CRAS da sua cidade.'
      })
    } finally {
      setValidatingDocument(false)
    }
  }

  function handleCpfOrNisChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/[^0-9]/g, '')

    cpfOrNisField.onChange(event)
    cpfOrNisHelper.setValue(value)

    if (value.length === CPF_OR_NIS_MAX_LENGTH) {
      checkIfCpfOrNisIsValid(value)
    } else {
      onCpfOrNisIsValid(false)
    }
  }

  return (
    <FormControl
      isRequired
      isInvalid={!!meta.touched && !!meta.error}
      isDisabled={validatingDocument}
    >
      <FormLabel>CPF/NIS</FormLabel>

      <Box position="relative">
        <Field
          as={Input}
          name="cpfOrNis"
          placeholder="Informe CPF ou NIS do responsável familiar"
          maxLength={CPF_OR_NIS_MAX_LENGTH}
          onChange={handleCpfOrNisChange}
        />
        {validatingDocument && (
          <Spinner
            position="absolute"
            right="4"
            top="2"
            color="gray.500"
          />
        )}
      </Box>

      <ErrorMessage name="cpfOrNis" component={FormErrorMessage} />
    </FormControl>
  )
}
