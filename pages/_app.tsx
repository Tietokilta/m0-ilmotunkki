import '../styles/global.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import Locale from '../components/Locale';
import Timer from '../components/Timer';
import Header from '../components/Header';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Head>
        <title>RWBK Teekkarius 150</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
        <meta property="og:image" content="/logo.png" />
        <meta property="og:title" content="Retuperän WBK liput" />
        <meta property="og:url" content="https://liput.rwbk.fi" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fi_FI" />
        <meta property="robots" content="index, archive" />
        <meta
          name="description"
          content="Retuperän WBK Teekkarius 150 konsertti"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <Locale />
        <Timer/>
      </Header>
          <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp
