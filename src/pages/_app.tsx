import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="lazyOnload"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING}`}
      />

      <Script
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING}');
          `
        }}
      />

      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
