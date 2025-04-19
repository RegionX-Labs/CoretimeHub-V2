import MyCore from './MyCore';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import styles from './HomeDashboard.module.scss';

export default function HomeDashboard() {
  return (
    <div className={styles.dashboard}>
      <MyCore />
      <CoreComparison />
      <DutchAuctionChart />
    </div>
  );
}
