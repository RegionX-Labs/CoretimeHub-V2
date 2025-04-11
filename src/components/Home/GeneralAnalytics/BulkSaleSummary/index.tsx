import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import styles from './BulkSaleSummary.module.scss';

import { $network } from '@/api/connection';
import { latestSaleRequested, $latestSaleInfo } from '@/coretime/saleInfo';
import {
  $purchaseHistory,
  $totalPurchases,
  purchaseHistoryRequested,
  PurchaseType,
} from '@/coretime/purchaseHistory';
import { toUnitFormatted } from '@/utils';

export default function BulkSaleSummary() {
  const [network, saleInfo, purchaseHistory, totalPurchases] = useUnit([
    $network,
    $latestSaleInfo,
    $purchaseHistory,
    $totalPurchases,
  ]);

  useEffect(() => {
    if (network) {
      latestSaleRequested(network);
    }
  }, [network]);

  useEffect(() => {
    if (network && saleInfo) {
      purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });
    }
  }, [network, saleInfo]);

  const bulkRevenue = purchaseHistory
    .filter((item) => item.type === PurchaseType.BULK)
    .reduce((sum, item) => sum + item.price, 0);

  const Renewals = purchaseHistory
    .filter((item) => item.type === PurchaseType.RENEWAL)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={styles.analyticsCard}>
      <div className={styles.metricBox}>
        <p className={styles.metricLabel}>Total Sales</p>
        <h3 className={styles.coretimeValue}>{totalPurchases.toLocaleString()}</h3>
        <p className={styles.gain}>
          Compared to last month <span className={styles.gainAmount}>+420</span>
        </p>
        <div className={styles.splitCards}>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Spent on Bulk sale</p>
            <div className={styles.splitDetails}>
              <span>{toUnitFormatted(network, BigInt(bulkRevenue))}</span>
              <span className={styles.positive}>+3.4%</span>
            </div>
          </div>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Spent on Renewals</p>
            <div className={styles.splitDetails}>
              <span>{toUnitFormatted(network, BigInt(Renewals))}</span>
              <span className={styles.negative}>-0.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
