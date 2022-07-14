import '../styles/global.css'
import { ThemeProvider } from 'styled-components';
import type { AppProps } from 'next/app'
import AppProvider from '../context/AppContext'
import Locale from '../components/Locale';
import { theme } from '../styles/styles';
import Timer from '../components/Timer';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <Locale />
        <Timer/>
        <Component {...pageProps} />
      </ThemeProvider>
    </AppProvider>
  );
}

export default MyApp
