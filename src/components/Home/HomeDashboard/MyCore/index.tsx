import styles from './MyCore.module.scss';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import { useState } from 'react';

const coreOptions: SelectOption<string>[] = [
  { label: 'ID 2425.3521', value: '2425.3521' },
  { label: 'ID 1421.0012', value: '1421.0012' },
  { label: 'ID 9876.5432', value: '9876.5432' },
];

export default function MyCore() {
  const [selected, setSelected] = useState<string | null>(coreOptions[0].value);

  return (
    <div className={styles.myCoreCard}>
      <p className={styles.title}>My Cores</p>

      <div className={styles.selectBox}>
        <Select
          options={coreOptions}
          selectedValue={selected}
          onChange={(val) => setSelected(val)}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.detailBlock}>
          <p className={styles.label}>Renewal Price</p>
          <p className={styles.value}>ID {selected}</p>
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
