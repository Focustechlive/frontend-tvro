import { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Heading,
  Text
} from '@chakra-ui/react'

export type AlertMessage = {
  type: 'success' | 'error' | 'warning'
  title: string
  text: string
}

export function Alert() {
  const [message, setMessage] = useState<AlertMessage | null>(null)

  const cancelRef = useRef(null)

  function handleRemoveMessage() {
    setMessage(null)
  }

  useEffect(() => {
    function handleAddAlert(event: CustomEvent<AlertMessage>) {
      const { type, title, text } = event.detail

      setMessage({
        type,
        title,
        text
      })
    }

    document.addEventListener('addalert', (event) => {
      return handleAddAlert(event as CustomEvent<AlertMessage>)
    })

    return () => {
      document.removeEventListener('addalert', (event) => {
        return handleAddAlert(event as CustomEvent<AlertMessage>)
      })
    }
  }, [])

  return message ? (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      onClose={handleRemoveMessage}
      isOpen
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogCloseButton />

        <AlertDialogHeader>
          <Heading fontSize="2xl">{message.title}</Heading>
        </AlertDialogHeader>

        <AlertDialogBody pb="6">
          <Box
            bg={
              message.type === 'error'
                ? 'red.100'
                : message.type === 'success'
                ? 'green.100'
                : 'yellow.100'
            }
            borderColor={
              message.type === 'error'
                ? 'red.200'
                : message.type === 'success'
                ? 'green.200'
                : 'yellow.200'
            }
            borderStyle="solid"
            borderWidth="thin"
            borderRadius="md"
            p="6"
          >
            <Text
              fontSize="1.2rem"
              color={
                message.type === 'error'
                  ? 'red.800'
                  : message.type === 'success'
                  ? 'green.800'
                  : 'yellow.800'
              }
            >
              {message.text}
            </Text>
          </Box>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  ) : null
}
