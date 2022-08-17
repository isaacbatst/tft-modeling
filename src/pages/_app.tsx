import type {AppProps} from 'next/app';
import '../application/frontend/styles/globals.css';

export default function MyApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />;
}
