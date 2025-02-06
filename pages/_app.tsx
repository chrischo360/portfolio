import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, MantineProvider, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { theme } from '../theme';
import { Navbar } from '../components/Navbar/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>My Work and Writing</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <AppShell header={{ height: 60 }} footer={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Navbar />
        </AppShell.Header>
        <AppShell.Main>
          <Component {...pageProps} />
        </AppShell.Main>
        <AppShell.Footer />
      </AppShell>
    </MantineProvider>
  );
}
