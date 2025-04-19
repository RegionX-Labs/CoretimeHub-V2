import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './BulkSaleSummary.module.scss';

import { $network } from '@/api/connection';
import { latestSaleRequested, $latestSaleInfo, fetchSaleInfoAt } from '@/coretime/saleInfo';
import {
  $purchaseHistory,
  purchaseHistoryRequested,
  PurchaseType,
} from '@/coretime/purchaseHistory';
import { toUnitFormatted } from '@/utils';
import RevenueBox from '../RevenueBox/index';

export default function BulkSaleSummary() {
  const [network, saleInfo, purchaseHistory] = useUnit([
    $network,
    $latestSaleInfo,
    $purchaseHistory,
  ]);

  const [previousBulkRevenue, setPreviousBulkRevenue] = useState<number | null>(null);
  const [previousRenewalRevenue, setPreviousRenewalRevenue] = useState<number | null>(null);

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (network && saleInfo) {
      purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });
    }
  }, [network, saleInfo]);

  useEffect(() => {
    const fetchPreviousCycleRevenue = async () => {
      if (!network || !saleInfo) return;

      const nodes = await fetchSaleInfoAt(network, saleInfo.saleCycle - 1);
      if (!nodes) return;

      const bulkOnly = nodes.filter((item: any) => item.purchaseType === PurchaseType.BULK);
      const renewalOnly = nodes.filter((item: any) => item.purchaseType === PurchaseType.RENEWAL);

      const bulkSum = bulkOnly.reduce((acc: number, item: any) => acc + parseInt(item.price), 0);
      const renewalSum = renewalOnly.reduce(
        (acc: number, item: any) => acc + parseInt(item.price),
        0
      );

      setPreviousBulkRevenue(bulkSum);
      setPreviousRenewalRevenue(renewalSum);
    };

    fetchPreviousCycleRevenue();
  }, [network, saleInfo]);

  const bulkRevenue = purchaseHistory
    .filter((item) => item.type === PurchaseType.BULK)
    .reduce((sum, item) => sum + item.price, 0);

  const renewals = purchaseHistory
    .filter((item) => item.type === PurchaseType.RENEWAL)
    .reduce((sum, item) => sum + item.price, 0);

  const gainRaw = previousBulkRevenue !== null ? bulkRevenue - previousBulkRevenue : 0;
  const gainSign = gainRaw >= 0 ? '+' : '-';
  const gainAmount = toUnitFormatted(network, BigInt(Math.abs(gainRaw)));

  const bulkChangePercent =
    previousBulkRevenue && previousBulkRevenue !== 0
      ? ((bulkRevenue - previousBulkRevenue) / previousBulkRevenue) * 100
      : 0;

  const renewalChangePercent =
    previousRenewalRevenue && previousRenewalRevenue !== 0
      ? ((renewals - previousRenewalRevenue) / previousRenewalRevenue) * 100
      : 0;

  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;

  return (
    <div className={styles.analyticsCard}>
      <RevenueBox
        network={network}
        purchaseHistory={purchaseHistory}
        previousBulkRevenue={previousBulkRevenue}
        bulkRevenue={bulkRevenue}
        renewals={renewals}
        bulkChangePercent={bulkChangePercent}
        renewalChangePercent={renewalChangePercent}
      />
      <RevenueBox
        network={network}
        purchaseHistory={purchaseHistory}
        previousBulkRevenue={previousBulkRevenue}
        bulkRevenue={bulkRevenue}
        renewals={renewals}
        bulkChangePercent={bulkChangePercent}
        renewalChangePercent={renewalChangePercent}
      />
      <RevenueBox
        network={network}
        purchaseHistory={purchaseHistory}
        previousBulkRevenue={previousBulkRevenue}
        bulkRevenue={bulkRevenue}
        renewals={renewals}
        bulkChangePercent={bulkChangePercent}
        renewalChangePercent={renewalChangePercent}
      />
    </div>
  );
}
