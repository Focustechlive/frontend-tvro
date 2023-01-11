import { useState } from 'react'
import { useField, useFormikContext } from 'formik'

import { FirstStep, SecondStep, ThirdStep, FourthStep } from './Steps'

import type { FormData } from '../../pages/index'

import { Box } from '@chakra-ui/react'

export function Form() {
  const [cpfOrNisIsValid, setCpfOrNisIsValid] = useState(false)
  const [zipCodeIsValid, setZipCodeIsValid] = useState(false)

  const { values } = useFormikContext<FormData>()

  const [, cpfOrNisMeta] = useField('cpfOrNis')
  const [, phoneMeta] = useField('phone')
  const [, emailMeta] = useField('email')
  const [, zipCodeMeta] = useField('zipcode')
  const [, addressNumberMeta] = useField('address_number')
  const [, referencePointMeta] = useField('reference_point')

  function handleCpfOrNisIsValid(isValid: boolean) {
    setCpfOrNisIsValid(isValid)
  }

  function handleZipCodeIsValid(isValid: boolean) {
    setZipCodeIsValid(isValid)
  }

  const shouldRenderSecondStep =
    cpfOrNisIsValid && !cpfOrNisMeta.error && values.cpfOrNis

  const shouldRenderThirdStep =
    cpfOrNisIsValid &&
    !emailMeta.error &&
    !phoneMeta.error &&
    values.have_whatsapp &&
    values.agree_to_be_contacted

  const shouldRenderFourthStep =
    shouldRenderThirdStep &&
    zipCodeIsValid &&
    !zipCodeMeta.error &&
    !addressNumberMeta.error &&
    !referencePointMeta.error

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <FirstStep onCpfOrNisIsValid={handleCpfOrNisIsValid} />

      {shouldRenderSecondStep && <SecondStep />}

      {shouldRenderThirdStep && (
        <ThirdStep
          zipCodeIsValid={zipCodeIsValid}
          onZipCodeIsValid={handleZipCodeIsValid}
        />
      )}

      {shouldRenderFourthStep && <FourthStep />}
    </Box>
  )
}
