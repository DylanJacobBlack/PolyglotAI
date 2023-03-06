import "/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import NavBar from "components/NavBar/NavBar";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <main className={inter.className}>
      <SessionProvider session={session}>
        <NavBar />
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
}
