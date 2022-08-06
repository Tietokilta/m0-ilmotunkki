import '../styles/global.css'
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import Locale from '../components/Locale';
import Timer from '../components/Timer';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Locale />
      <Timer/>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp
