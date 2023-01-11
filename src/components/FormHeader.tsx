import { Box, Heading, Image, VStack } from '@chakra-ui/react'

export function FormHeader() {
  return (
    <VStack as="header" spacing={6} marginBottom={10}>
      <Box
        h="100%"
        w="100%"
        maxW={220}
        as="a"
        href="https://sigaantenado.com.br/"
        rel="noopenner, noreferrer"
      >
        <Image src="/images/logo.svg" alt="Siga Antenado" />
      </Box>

      <Heading as="h1" size="lg" fontWeight="medium" textAlign="center">
        Agendamento Programa Distribuição de Kits
      </Heading>
    </VStack>
  )
}
