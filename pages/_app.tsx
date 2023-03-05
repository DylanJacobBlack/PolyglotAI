import "/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import NavBar from "components/NavBar/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <NavBar/>
      <Component {...pageProps} />
    </main>
  );
}
