import '../styles/global.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import Locale from '../components/Locale';
import Timer from '../components/Timer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <style jsx global>{`
        :root {
          --color-dynamic-100: hsl(50 80% 100%);
          --color-dynamic-200: hsl(50 80% 90%);
          --color-dynamic-300: hsl(50 80% 80%);
          --color-dynamic-400: hsl(50 80% 70%);
          --color-dynamic-500: hsl(50 80% 60%);
          --color-dynamic-600: hsl(50 80% 50%);
          --color-dynamic-700: hsl(50 80% 40%);
          --color-dynamic-800: hsl(50 80% 30%);
          --color-dynamic-900: hsl(50 80% 20%);
        }
      `}</style>
      <Head>
        <title>Muistinnollaus 100101</title>
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
        <meta property="og:title" content="Muistinnollaus 37" />
        <meta property="og:url" content="https://muistinnollaus.fi" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fi_FI" />
        <meta property="robots" content="index, archive" />
        <meta
          name="description"
          content="Muistinnollaus 37 saapuu 17.2.2023"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <Locale />
        <Timer/>
      </Header>
      <Component {...pageProps} />
      <Footer/>
    </AppProvider>
  );
}

export default MyApp
