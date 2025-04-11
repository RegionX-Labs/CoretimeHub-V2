import styles from './GeneralAnalytics.module.scss';
import BulkSaleSummary from './BulkSaleSummary/index';

export default function GeneralAnalytics() {
  return (
    <div className={styles.analyticsCard}>
      <div className={styles.header}>
        <h2>General Analytics</h2>
        <p>Control all the metrics in this section</p>
      </div>
      <div className={styles.tabsWrapper}>
        <ul className={styles.tabs}>
          <li className={`${styles.tab} ${styles.active}`}>All stats</li>
          <li className={styles.tab}>Sales</li>
          <li className={styles.tab}>Users</li>
          <li className={styles.tab}>Market</li>
        </ul>
      </div>
      <BulkSaleSummary />
    </div>
  );
}
