import { $connections, $network } from '@/api/connection';
import styles from './MyCore.module.scss';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { $potentialRenewals, potentialRenewalsRequested } from '@/coretime/renewals';

export default function MyCore() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const potentialRenewals = useUnit($potentialRenewals);

  console.log(Array.from(potentialRenewals.entries()));

  const options: SelectOption<string>[] = Array.from(potentialRenewals.entries()).map((renewal) => ({
    label: `${renewal[0].core}-${renewal[0].when}`,
    value: `${renewal[0].core}-${renewal[0].when}`,
  }));

  useEffect(() => {
    potentialRenewalsRequested({network, connections})
  }, [network, connections]);

  console.log(potentialRenewals);

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className={styles.myCoreCard}>
      <p className={styles.title}>My Coress</p>

      <div className={styles.selectBox}>
        <Select options={options} selectedValue={selected} onChange={(val) => setSelected(val)} />
      </div>

      <div className={styles.details}>
        <div className={styles.detailBlock}>
          <p className={styles.label}>Renewal Price</p>
          <p className={styles.value}>9 DOT</p>
        </div>
        <div className={styles.detailBlock}>
          <p className={styles.label}>Renewal deadline</p>
          <p className={styles.value}>April 9, 2025</p>
        </div>
      </div>

      <button className={styles.renewButton}>Renew Now</button>
    </div>
  );
}
