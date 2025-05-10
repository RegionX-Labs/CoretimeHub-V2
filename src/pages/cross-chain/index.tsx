import React, { useState, useEffect } from 'react';
import styles from './cross-chain.module.scss';
import Select from '../../components/elements/Select';
import AmountInput from '../../components/elements/AmountInput/AmountInput';
import AddressInput from '../../components/elements/AdressInput/AddressInput';
import Button from '../../components/elements/Button/Button';

import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
  KusamaCoretime,
  PaseoCoretime,
  PolkadotCoretime,
  WestendCoretime,
} from '@/assets/networks';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import Image from 'next/image';
import { ChainId, chains } from '@/network/chains';
import { isHex } from '@polkadot/util';
import { validateAddress } from '@polkadot/util-crypto';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $selectedAccount } from '@/wallet';
import {
  XcmV3Junction,
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedAssets,
  XcmVersionedLocation,
} from '@polkadot-api/descriptors';
import { AccountId, Binary } from 'polkadot-api';
import { CORETIME_PARA_ID, fromUnit } from '@/utils';

const CrossChain = () => {
  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [originChain, setOriginChain] = useState<ChainId | null>(null);
  const [destinationChain, setDestinationChain] = useState<ChainId | null>(null);
  const [amount, setAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState<string | null>(null);

  const currencyMapping: Record<ChainId, { symbol: string; icon: any }> = {
    [chains.polkadot.chainId]: { symbol: 'DOT', icon: PolkadotIcon },
    [chains.kusama.chainId]: { symbol: 'KSM', icon: KusamaIcon },
    [chains.paseo.chainId]: { symbol: 'PAS', icon: PaseoIcon },
    [chains.westend.chainId]: { symbol: 'WND', icon: WestendIcon },
    [chains.polkadotCoretime.chainId]: { symbol: 'DOT', icon: PolkadotIcon },
    [chains.kusamaCoretime.chainId]: { symbol: 'KSM', icon: KusamaIcon },
    [chains.paseoCoretime.chainId]: { symbol: 'PAS', icon: PaseoIcon },
    [chains.westendCoretime.chainId]: { symbol: 'WND', icon: WestendIcon },
  };

  const handleOriginChainChange = (value: ChainId | null) => {
    setOriginChain(value);
  };

  const handleDestinationChainChange = (value: ChainId | null) => {
    setDestinationChain(value);
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBeneficiary(value);
    setBeneficiaryError(isValidAddress(value) ? null : 'Invalid address');
  };

  const handleTransfer = async () => {
    console.log('Transfer initiated with:', {
      originChain,
      destinationChain,
      amount,
      beneficiary,
    });

    if (originChain === destinationChain) {
      toast.error('Origin and destination chains are the same');
      return;
    }

    if (!originChain) {
      toast.error('Origin chain not selected');
      return;
    }

    if (!destinationChain) {
      toast.error('Destination chain not selected');
      return;
    }

    if (isCoretimeChain(originChain)) {
      // Coretime to relay
      await coretimeChainToRelayChain();
    } else {
      // Relay to coretime
      await relayChainToCoretimeChain();
    }
  };

  const relayChainToCoretimeChain = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.relayChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;

    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    try {
      const tx = (
        client.getTypedApi(metadata.relayChain).tx as any
      ).XcmPallet.limited_teleport_assets({
        dest: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(CORETIME_PARA_ID)),
        }),
        beneficiary: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(beneficiary)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V3([
          {
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, BigInt(amount)) as bigint),
            id: XcmV3MultiassetAssetId.Concrete({ interior: XcmV3Junctions.Here(), parents: 0 }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

      const res = await tx.signAndSubmit(selectedAccount.polkadotSigner);
      if (res.ok) {
        toast.success('Transaction succeded!');
      } else {
        // TODO: provide more detailed error
        toast.error('Transaction failed');
      }
    } catch (e) {
      toast.error('Transaction cancelled');
      console.log(e);
    }
  };

  const coretimeChainToRelayChain = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;

    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    try {
      const tx = (
        client.getTypedApi(metadata.coretimeChain).tx as any
      ).PolkadotXcm.limited_teleport_assets({
        dest: XcmVersionedLocation.V3({
          parents: 1,
          interior: XcmV3Junctions.Here(),
        }),
        beneficiary: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(beneficiary)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V3([
          {
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, BigInt(amount)) as bigint),
            id: XcmV3MultiassetAssetId.Concrete({ interior: XcmV3Junctions.Here(), parents: 0 }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

      const res = await tx.signAndSubmit(selectedAccount.polkadotSigner);
      if (res.ok) {
        toast.success('Transaction succeded!');
      } else {
        // TODO: provide more detailed error
        toast.error('Transaction failed');
      }
    } catch (e) {
      toast.error('Transaction cancelled');
      console.log(e);
    }
  };

  const handleSwapChains = () => {
    setOriginChain(destinationChain);
    setDestinationChain(originChain);
  };

  const networks = [
    {
      value: chains.polkadot.chainId,
      label: 'Polkadot',
      icon: (
        <Image
          src={PolkadotIcon.src}
          alt='Polkadot'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.kusama.chainId,
      label: 'Kusama',
      icon: (
        <Image
          src={KusamaIcon.src}
          alt='Kusama'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.paseo.chainId,
      label: 'Paseo',
      icon: (
        <Image
          src={PaseoIcon.src}
          alt='Paseo'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.westend.chainId,
      label: 'Westend',
      icon: (
        <Image
          src={WestendIcon.src}
          alt='Westend'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.polkadotCoretime.chainId,
      label: 'Polkadot Coretime',
      icon: (
        <Image
          src={PolkadotCoretime.src}
          alt='Polkadot Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.kusamaCoretime.chainId,
      label: 'Kusama Coretime',
      icon: (
        <Image
          src={KusamaCoretime.src}
          alt='Kusama Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.paseoCoretime.chainId,
      label: 'Paseo Coretime',
      icon: (
        <Image
          src={PaseoCoretime.src}
          alt='Paseo Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.westendCoretime.chainId,
      label: 'Westend Coretime',
      icon: (
        <Image
          src={WestendCoretime.src}
          alt='Westend Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
  ];

  const isCoretimeChain = (chainId: string): boolean => {
    return chainId === chains[`${network}Coretime` as keyof typeof chains]?.chainId;
  };

  const filteredNetworks = networks.filter((n) => {
    if (!network) return true;
    return n.value === chains[network as keyof typeof chains]?.chainId || isCoretimeChain(n.value);
  });

  useEffect(() => {
    if (filteredNetworks.length > 0) {
      const isOriginChainValid = filteredNetworks.some((n) => n.value === originChain);
      const isDestinationChainValid = filteredNetworks.some((n) => n.value === destinationChain);

      if (!isOriginChainValid) {
        setOriginChain(filteredNetworks[0].value);
      }

      if (!isDestinationChainValid) {
        setDestinationChain(filteredNetworks[0].value);
      }
    }
  }, [network]);

  const isValidAddress = (chainAddress: string, ss58Prefix = 42) => {
    if (isHex(chainAddress)) return false;
    try {
      validateAddress(chainAddress, true, ss58Prefix);
      return true;
    } catch {
      return false;
    }
  };

  const selectedCurrency = originChain ? currencyMapping[originChain] : null;

  return (
    <div className={styles.container}>
      <div className={styles.chainSelectionContainer}>
        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Origin chain:</label>

          <Select<ChainId>
            selectedValue={originChain}
            onChange={handleOriginChainChange}
            options={filteredNetworks.map((network) => ({
              key: String(network.value),
              value: network.value,
              label: network.label,
              icon: network.icon,
            }))}
          />
        </div>

        <div className={styles.swapIcon} onClick={handleSwapChains}>
          ⇅
        </div>

        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Destination chain:</label>

          <Select<ChainId>
            selectedValue={destinationChain}
            onChange={handleDestinationChainChange}
            options={filteredNetworks.map((network) => ({
              key: String(network.value),
              value: network.value,
              label: network.label,
              icon: network.icon,
            }))}
          />
        </div>
      </div>

      <div className={styles.transferSection}>
        <label>Transfer to</label>
        <AddressInput
          onChange={handleBeneficiaryChange}
          value={beneficiary}
          placeholder='Address of the recipient'
        />
        {beneficiaryError && <p className={styles.errorText}>{beneficiaryError}</p>}

        <div className={styles.amountSection}>
          <label>Transfer Amount:</label>
          <AmountInput
            currencyOptions={
              selectedCurrency
                ? [
                    {
                      key: selectedCurrency.symbol,
                      value: selectedCurrency.symbol,
                      label: selectedCurrency.symbol,
                      icon: (
                        <Image
                          src={selectedCurrency.icon.src}
                          alt={selectedCurrency.symbol}
                          className={styles.smallIcon}
                          width={20}
                          height={20}
                        />
                      ),
                    },
                  ]
                : []
            }
            onAmountChange={setAmount}
            placeholder='Enter amount'
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Button onClick={handleTransfer}>Transfer</Button>
      </div>
      <Toaster />
    </div>
  );
};

export default CrossChain;
