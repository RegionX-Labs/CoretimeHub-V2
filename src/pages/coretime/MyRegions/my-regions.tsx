import { $regions, regionsRequested } from '@/coretime/regions';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { RegionCard } from '@region-x/components';
import { useEffect } from 'react';
import styles from './my-regions.module.scss';

const MyRegionsPage = () => {
  const network = useUnit($network);
  const regions = useUnit($regions);

  const countBits = (regionMask: string) => {
    let count = 0;
    // Convert hex to bits and count ones.
    for (let i = 2; i < regionMask.length; ++i) {
      let v = parseInt(regionMask.slice(i, i + 1), 16);
      while (v > 0) {
        if (v & 1) ++count;
        v >>= 1;
      }
    }

    return count;
  };

  useEffect(() => {
    regionsRequested(network);
  }, [network]);

  useEffect(() => {
    console.log(regions);
  }, [regions]);

  return (
    <>
      <div className={styles.container}>
        {regions.length > 0 ? (
          regions.slice(0, 6).map((region) => (
            <div className={styles['region-card']} key={region.core}>
              <RegionCard
                regionData={{
                  chainColor: 'greenDark',
                  chainLabel: 'Coretime Chain',
                  coreIndex: region.core,
                  consumed: 0,
                  // 57600 / 80 = 720
                  coreOcupaccy: ((countBits(regions[0].mask) * 720) / 57600) * 100,
                  duration: '28 days', // TODO,
                  name: '', // TODO
                  regionEnd: regions[0].end.toString(), // TODO: Human readable format
                  regionStart: regions[0].begin.toString(), // TODO: Human readable format
                  currentUsage: 0, // TODO
                  onClick: () => {},
                }}
                task={`Unassigned`} // TODO
              />
            </div>
          ))
        ) : (
          <p>No regions available.</p>
        )}
      </div>
      <div>
        {' '}
        <nav className={styles.menu}>
          <ul>
            <li>
              <a href='#partition'>Partition</a>
            </li>
            <li>
              <a href='#interface'>Interface</a>
            </li>
            <li>
              <a href='#transfer'>Transfer</a>
            </li>
            <li>
              <a href='#assign'>Assign</a>
            </li>
            <li>
              <a href='#sell'>Sell</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MyRegionsPage;
