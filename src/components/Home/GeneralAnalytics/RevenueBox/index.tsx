import styles from '../BulkSaleSummary/BulkSaleSummary.module.scss';
import { toUnitFormatted } from '@/utils';

type RevenueBoxProps = {
  network: any;
  purchaseHistory: any[];
  previousBulkRevenue: number | null;
  bulkRevenue: number;
  renewals: number;
  bulkChangePercent: number;
  renewalChangePercent: number;
};

const RevenueBox = ({
  network,
  purchaseHistory,
  previousBulkRevenue,
  bulkRevenue,
  renewals,
  bulkChangePercent,
  renewalChangePercent,
}: RevenueBoxProps) => {
  const gainRaw = previousBulkRevenue !== null ? bulkRevenue - previousBulkRevenue : 0;
  const gainSign = gainRaw >= 0 ? '+' : '-';
  const gainAmount = toUnitFormatted(network, BigInt(Math.abs(gainRaw)));

  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;

  return (
    <div className={styles.metricBox}>
      <p className={styles.metricLabel}>Total Sales</p>
      <h3 className={styles.coretimeValue}>{purchaseHistory.length.toLocaleString()}</h3>
      <p className={styles.gain}>
        Compared to last month{' '}
        <span className={styles.gainAmount}>
          {previousBulkRevenue === null ? 'Loading...' : `${gainSign}${gainAmount}`}
        </span>
      </p>
      <div className={styles.splitCards}>
        <div className={styles.splitCard}>
          <p className={styles.splitLabel}>Spent on Bulk sale</p>
          <div className={styles.splitDetails}>
            <span>{toUnitFormatted(network, BigInt(bulkRevenue))}</span>
            <span className={bulkChangePercent >= 0 ? styles.positive : styles.negative}>
              {formatPercent(bulkChangePercent)}
            </span>
          </div>
        </div>
        <div className={styles.splitCard}>
          <p className={styles.splitLabel}>Spent on Renewals</p>
          <div className={styles.splitDetails}>
            <span>{toUnitFormatted(network, BigInt(renewals))}</span>
            <span className={renewalChangePercent >= 0 ? styles.positive : styles.negative}>
              {formatPercent(renewalChangePercent)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueBox;
