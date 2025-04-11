import styles from './CoreComparison.module.scss';

export default function CoreComparison() {
  return (
    <div className={styles.coreComparisonCard}>
      <p className={styles.title}>Renewal vs New Core price difference</p>
      <h2 className={styles.value}>+65.740</h2>
      <p className={styles.subtext}>
        Is <span className={styles.positive}>+30%</span> more convinient the renewal
      </p>

      <div className={styles.row}>
        <span className={styles.label}>Renewal cost</span>
        <span className={styles.amount}>$29,340.20</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Buy New</span>
        <span className={styles.amount}>$95,080.30</span>
      </div>
    </div>
  );
}
