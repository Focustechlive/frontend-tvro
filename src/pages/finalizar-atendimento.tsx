import Head from 'next/head'
import Script from 'next/script'
import { Box } from '@chakra-ui/react'

import { FormHeader } from '../components/FormHeader'
import { Success } from '../components/Success'

export default function FinalizarAtendimento() {
  return (
    <>
      <Head>
        <title>Finalizar atendimento – Siga Antenado</title>
      </Head>

      <Box minH="100vh" py="10" px="6" bg="blackAlpha.50">
        <Box maxW={800} margin="0 auto" p={8} borderRadius={10} bg="white">
          <FormHeader />

          <Success />
        </Box>
      </Box>

      <Script
        id="freshchat"
        type="text/javascript"
        async
        defer
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function initFreshChat() {
              window.fcWidget.init({
              token: "71760711-ffb7-4517-891b-bc33d9854c0f",
              host: "https://sigaantenado.freshchat.com",
              widgetUuid: "69696d3d-d094-4235-b24c-08a0694b8417"
              });
            }
            function initialize(i,t){var e;i.getElementById(t)?
            initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,
            e.src="https://sigaantenado.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}
            function initiateCall(){initialize(document,"Freshchat-js-sdk")}
            window.addEventListener?window.addEventListener("load",initiateCall,!1):
            window.attachEvent("load",initiateCall,!1);
          `
        }}
      />
    </>
  )
}
