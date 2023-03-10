import { ChangeEvent, useEffect } from 'react'
import { ErrorMessage, Field, FieldProps, useField } from 'formik'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Radio,
  RadioGroup
} from '@chakra-ui/react'

import { formatPhone } from '../../../utils/formatPhone'
import { alertEventEmitter } from '../../../utils/alertEventEmitter'

export function SecondStep() {
  const [phoneField, phoneMeta, phoneHelper] = useField('mobile')
  const [, emailMeta] = useField('email')
  const [, haveWhatsappMeta] = useField('have_whatsapp')
  const [, agreeToBeContactedMeta] = useField('agree_to_be_contacted')

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/[^0-9]/g, '')

    const formattedValue = formatPhone(value)

    phoneField.onChange(event)
    phoneHelper.setValue(formattedValue)
  }

  const shouldRenderTheHaveWhatsappField =
    !emailMeta.error && !phoneMeta.error
  const shouldRenderTheConcordanceField =
    shouldRenderTheHaveWhatsappField && haveWhatsappMeta.value === 'Sim'

  useEffect(() => {
    if (
      haveWhatsappMeta.value === 'Não' ||
      agreeToBeContactedMeta.value === 'Não'
    ) {
      return alertEventEmitter({
        type: 'warning',
        title: 'Atenção',
        text: 'Para concluir o seu agendamento por favor entre em contato com o 0800 729 2404. Nosso horário de atendimento é de segunda a sexta-feira das 08:00 às 20:00 horas e aos sábados das 08:00 às 16:00 horas.'
      })
    }
  }, [haveWhatsappMeta.value, agreeToBeContactedMeta.value])

  return (
    <>
      <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem>
          <FormControl
            isRequired
            isInvalid={!!phoneMeta.touched && !!phoneMeta.error}
          >
            <FormLabel>Celular</FormLabel>

            <Field
              as={Input}
              name="mobile"
              placeholder="(11) 00000 0000"
              maxLength={15}
              onChange={handlePhoneChange}
            />

            <ErrorMessage name="mobile" component={FormErrorMessage} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl
            isInvalid={!!emailMeta.touched && !!emailMeta.error}
          >
            <FormLabel>E-mail</FormLabel>

            <Field
              as={Input}
              type="email"
              name="email"
              placeholder="exemplo@google.com"
            />

            <ErrorMessage name="email" component={FormErrorMessage} />
          </FormControl>
        </GridItem>
      </Grid>

      {shouldRenderTheHaveWhatsappField && (
        <Field name="have_whatsapp">
          {({ field }: FieldProps) => {
            const { onChange, ...rest } = field

            return (
              <FormControl id="have_whatsapp" isRequired>
                <FormLabel htmlFor="have_whatsapp">
                  Possui Whatsapp?
                </FormLabel>
                <RadioGroup
                  {...rest}
                  id="have_whatsapp"
                  name="have_whatsapp"
                  py={2}
                  display="flex"
                  gridColumnGap={2}
                >
                  <HStack spacing="24px">
                    <Radio onChange={onChange} value="Sim">
                      Sim
                    </Radio>
                    <Radio onChange={onChange} value="Não">
                      Não
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            )
          }}
        </Field>
      )}

      {shouldRenderTheConcordanceField && (
        <Field name="agree_to_be_contacted">
          {({ field }: FieldProps) => {
            const { onChange, ...rest } = field

            return (
              <FormControl id="agree_to_be_contacted" isRequired>
                <FormLabel htmlFor="agree_to_be_contacted">
                  Autorizo continuar o atendimento pelo E-mail ou número de
                  telefone
                </FormLabel>
                <RadioGroup
                  {...rest}
                  id="agree_to_be_contacted"
                  name="agree_to_be_contacted"
                  py={2}
                  display="flex"
                  gridColumnGap={2}
                >
                  <HStack spacing="24px">
                    <Radio onChange={onChange} value="Sim">
                      Sim
                    </Radio>
                    <Radio onChange={onChange} value="Não">
                      Não
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            )
          }}
        </Field>
      )}
    </>
  )
}
