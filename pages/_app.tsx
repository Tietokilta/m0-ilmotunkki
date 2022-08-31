import '../styles/global.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import Locale from '../components/Locale';
import Timer from '../components/Timer';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Header>
        <Locale />
        <Timer/>
      </Header>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp
