import styles from './home.module.scss';
import Header from '@/components/Header';
import GeneralAnalytics from '@/components/Home/GeneralAnalytics';
import HomeDashboard from '@/components/Home/HomeDashboard';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <GeneralAnalytics />
      <HomeDashboard />
    </div>
  );
}
