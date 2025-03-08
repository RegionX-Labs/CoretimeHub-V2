import '../styles/global.scss';
import '@region-x/components/dist/components.css';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { networkStarted } from '@/api/connection';
import { getExtensions } from '@/wallet';
import { $regions, regionsRequested } from '@/coretime/regions';
import { useUnit } from 'effector-react';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network } = router.query;
  const regions = useUnit($regions);

  useEffect(() => {
    let _network = Network.NONE;
    if (!router.isReady) return;
    if (network === 'polkadot') _network = Network.POLKADOT;
    else if (network === 'kusama') _network = Network.KUSAMA;
    else if (network === 'paseo') _network = Network.PASEO;
    else if (network === 'rococo') _network = Network.ROCOCO;
    else if (network === 'westend') _network = Network.WESTEND;
    else {
      // invalid network param. redirect to the default chain: polkadot
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            network: 'polkadot',
          },
        },
        undefined,
        { shallow: false }
      );
    }
    networkStarted(_network);
    getExtensions();
    regionsRequested(_network); // TODO: remove, only here for testing.
  }, [network, router, router.isReady]);

  useEffect(() => {
    console.log(regions); // TODO: remove, only here for testing.
  }, [regions]);

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default App;
