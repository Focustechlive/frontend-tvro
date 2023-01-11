import { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay
} from '@chakra-ui/react'

export type AlertMessage = {
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
      const { title, text } = event.detail

      setMessage({
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

        <AlertDialogHeader>{message.title}</AlertDialogHeader>

        <AlertDialogBody pb="6">{message.text}</AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  ) : null
}
