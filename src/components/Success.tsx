import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Text
} from '@chakra-ui/react'

export function Success() {
  return (
    <Box>
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p="6"
      >
        <AlertIcon boxSize="40px" mr={0} />

        <AlertTitle mt={4} mb={1} fontSize="lg">
          <Text fontSize="2xl">Muito bem!</Text>
        </AlertTitle>

        <AlertDescription maxWidth="sm">
          <Text>Todas as suas respostas estão registradas.</Text>

          <Text fontSize="large" my="6">
            Prossiga o atendimento pelo <strong>Chat Online</strong> logo
            abaixo para escolher o melhor dia para fazer sua instalação.
          </Text>
        </AlertDescription>
      </Alert>
    </Box>
  )
}
