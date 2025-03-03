import { Network } from "@/types";
import { useRouter } from "next/router";
import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
} from "@/assets/networks/relay";
import { useUnit } from "effector-react";
import { $network } from "@/api/connection";
import { Select } from "@region-x/components";
import styles from "./network.module.scss";

const NetworkSelector = () => {
  const router = useRouter();
  const network = useUnit($network);

  const handleChange = (value: Network | null) => {
    if (value) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, network: value },
        },
        undefined,
        { shallow: false }
      );
    }
  };

  const networks = [
    {
      value: Network.POLKADOT,
      label: "",
      icon: (
        <img
          src={PolkadotIcon.src}
          alt="Polkadot"
          className={styles.smallIcon}
        />
      ),
    },
    {
      value: Network.KUSAMA,
      label: "",
      icon: (
        <img src={KusamaIcon.src} alt="Kusama" className={styles.smallIcon} />
      ),
    },
    {
      value: Network.PASEO,
      label: "",
      icon: (
        <img src={PaseoIcon.src} alt="Paseo" className={styles.smallIcon} />
      ),
    },
    {
      value: Network.WESTEND,
      label: "",
      icon: (
        <img src={WestendIcon.src} alt="Westend" className={styles.smallIcon} />
      ),
    },
  ];

  return (
    <Select
      selectedValue={network}
      onChange={handleChange}
      options={networks.map((network) => ({
        value: network.value,
        label: network.label,
        icon: network.icon,
      }))}
    />
  );
};

export default NetworkSelector;
