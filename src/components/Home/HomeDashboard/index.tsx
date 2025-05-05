import { useEffect, useRef, useState } from 'react';
import RenewableCores from './RenewableCores';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import AuctionPhaseStatus from './AuctionPhaseStatus';
import CorePurchaseCard from './CorePurchaseCard';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import styles from './HomeDashboard.module.scss';

export default function HomeDashboard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      setScrolled(wrapper.scrollTop > 0);
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`${styles.dashboardWrapper} ${scrolled ? styles.scrolled : ''}`}
      ref={wrapperRef}
    >
      <div className={styles.dashboard}>
        <RenewableCores />
        <CoreComparison />
        <CorePurchaseCard />

        <AuctionPhaseStatus />
        <DutchAuctionChart />
        <PurchaseHistoryTable />
      </div>
    </div>
  );
}
