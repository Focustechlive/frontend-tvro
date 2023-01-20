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

      <Script id="freshchat" type="text/javascript">
        {`
         (function (d, w, c) { if(!d.getElementById("spd-busns-spt")) { var n = d.getElementsByTagName('script')[0], s = d.createElement('script'); var loaded = false; s.id = "spd-busns-spt"; s.async = "async"; s.setAttribute("data-self-init", "false"); s.setAttribute("data-init-type", "opt"); s.src = 'https://cdn.freshbots.ai/assets/share/js/freshbots.min.js'; s.setAttribute("data-client", "8d5d03264074648c2469dee6168f444bf5602a0f"); s.setAttribute("data-bot-hash", "9f5e967001b19386d260722806c27b1d88a6f70f"); s.setAttribute("data-env", "prod"); s.setAttribute("data-region", "us"); if (c) { s.onreadystatechange = s.onload = function () { if (!loaded) { c(); } loaded = true; }; } n.parentNode.insertBefore(s, n); } }) (document, window, function () { Freshbots.initiateWidget({ autoInitChat: false, getClientParams: function () { return ; } }, function(successResponse) { }, function(errorResponse) { }); });
        `}
      </Script>

      <Box minH="100vh" py="10" px="6" bg="blackAlpha.50">
        <Box maxW={800} margin="0 auto" p={8} borderRadius={10} bg="white">
          <FormHeader />

          <Success />
        </Box>
      </Box>
    </>
  )
}
