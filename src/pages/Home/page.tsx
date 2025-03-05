import NetworkSelector from "@/components/NetworkSelector";
import styles from "./home.module.scss";
import { networkStarted } from "@/api/connection";
import { useEffect } from "react";
import { Network } from "@/types";
import { useRouter } from "next/router";
import { getExtensions } from "@/wallet";
import WalletSelector from "@/components/WalletSelector";
import AccountSelector from "@/components/AccountSelector";
import { Button } from "@region-x/components";
import { burnInfoRequested } from "@/coretime/burnInfo";
import { purchaseHistoryRequested } from "@/coretime/purchaseHistory";
import { useUnit } from "effector-react";
import { $theme, Theme, themeToggled } from "@/theme";

export default function Home() {
  const router = useRouter();
  const { network } = router.query;
  const theme = useUnit($theme);

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
    burnInfoRequested(_network);
    purchaseHistoryRequested({network: _network, saleCycle: 1});
  }, [network, router, router.isReady]);

  useEffect(() => {
    if(theme === Theme.Dark) {
      document.documentElement.setAttribute("data-theme", 'dark');
    }else {
      document.documentElement.setAttribute("data-theme", 'light');
    }
  }, [theme]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Coretime Hub V2
      </h1>
      <NetworkSelector />
      <WalletSelector />
      <AccountSelector />
      <Button color="redDark" onClick={() => console.log('works')}>
        Test Button
      </Button>
      <Button onClick={() => themeToggled()}>
        {theme === Theme.Dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </Button>
    </div>
  );
}
