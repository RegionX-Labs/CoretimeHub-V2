import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, latestSaleRequested, fetchSelloutPrice } from '@/coretime/saleInfo';
import { $network, $connections } from '@/api/connection';
import { $purchaseHistory, purchaseHistoryRequested } from '@/coretime/purchaseHistory';
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
        const endPrice = Number(saleInfo.endPrice);
        const currentPrice = getCorePriceAt(now, { ...saleInfo, price: endPrice } as any);

        setCorePrice(currentPrice);

        const sellout = await fetchSelloutPrice(network, connections);
        if (sellout !== null) {
          setRenewalPrice(Number(sellout));
        }
      })();
    }
  }, [network, saleInfo, connections]);

  const isReady = renewalPrice !== null && corePrice !== null;
  const priceDiff = isReady ? corePrice! - renewalPrice! : null;
  const priceDiffFormatted = isReady ? toUnitFormatted(network, BigInt(Math.abs(priceDiff!))) : '';
  const diffPercent = isReady ? ((priceDiff! / renewalPrice!) * 100).toFixed(0) : null;

  return (
    <div className={styles.coreComparisonCard}>
      <p className={styles.title}>Renewal vs New Core price difference</p>
      <h2 className={`${styles.value} ${priceDiff! >= 0 ? styles.positive : styles.negative}`}>
        {priceDiff! >= 0 ? '+' : '−'}
        {priceDiffFormatted}
      </h2>

      <p className={styles.subtext}>
        It is <span className={styles.priceDiff}>{Math.abs(Number(diffPercent))}%</span>{' '}
        {priceDiff! >= 0 ? 'cheaper' : 'more expensive'} to renew
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
