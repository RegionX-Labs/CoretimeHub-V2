import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, latestSaleRequested, fetchSellout } from '@/coretime/saleInfo';
import { $network, $connections } from '@/api/connection';
import {
  $purchaseHistory,
  purchaseHistoryRequested,
  PurchaseType,
} from '@/coretime/purchaseHistory';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CoreComparison.module.scss';

export default function CoreComparison() {
  const [network, saleInfo, purchaseHistory, connections] = useUnit([
    $network,
    $latestSaleInfo,
    $purchaseHistory,
    $connections,
  ]);

  const [renewalPrice, setRenewalPrice] = useState<number | null>(null);
  const [corePrice, setCorePrice] = useState<number | null>(null);

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (network && saleInfo) {
      purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });

      (async () => {
        const now = saleInfo.saleStart + saleInfo.leadinLength;
        const currentPrice = getCorePriceAt(now, {
          ...saleInfo,
          price: Number(saleInfo.endPrice),
        });

        setCorePrice(currentPrice);

        const sellout = await fetchSellout(network, connections);

        if (sellout !== null) {
          setRenewalPrice(Number(sellout));
        }
      })();
    }
  }, [network, saleInfo, connections]);

  const isReady = renewalPrice !== null && corePrice !== null;
  const priceDiff = isReady ? corePrice! - renewalPrice! : null;
  const priceDiffFormatted = priceDiff?.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const diffPercent = isReady ? ((priceDiff! / corePrice!) * 100).toFixed(0) : null;

  return (
    <div className={styles.coreComparisonCard}>
      <p className={styles.title}>Renewal vs New Core price difference</p>
      <h2 className={styles.value}>{isReady ? `+${priceDiffFormatted}` : ''}</h2>
      <p className={styles.subtext}>
        Is <span className={styles.positive}>+{diffPercent}%</span> more convenient the renewal
      </p>

      <div className={styles.row}>
        <span className={styles.label}>Renewal cost</span>
        <span className={styles.amount}>
          {isReady ? toUnitFormatted(network, BigInt(renewalPrice!)) : ''}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Buy New</span>
        <span className={styles.amount}>
          {isReady ? toUnitFormatted(network, BigInt(corePrice!)) : ''}
        </span>
      </div>
    </div>
  );
}
