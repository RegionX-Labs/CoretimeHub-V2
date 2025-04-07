import { $regions, regionsRequested } from '@/coretime/regions';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { RegionCard } from '@region-x/components';
import { useEffect, useState } from 'react';
import styles from './my-regions.module.scss';
import { $saleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { timesliceToTimestamp } from '@/utils';

type RegionDateInfo = {
  beginDate: string;
  endDate: string;
};

TimeAgo.addLocale(en);

const getRelativeTime = (timestamp: number | Date): string => {
  const timeAgo = new TimeAgo('en-US');
  return timeAgo.format(timestamp, {
    steps: [
      { formatAs: 'second' },
      { formatAs: 'minute', minTime: 60 },
      { formatAs: 'hour', minTime: 60 * 60 },
      { formatAs: 'day', minTime: 24 * 60 * 60 },
    ],
    labels: 'long',
  });
};

// --- localStorage region name logic ---
const getRegionName = (regionId: string, core: number) => {
  const storedNames = JSON.parse(localStorage.getItem('regionNames') || '{}');
  return storedNames[regionId] || `Region #${core}`;
};

const setRegionName = (regionId: string, name: string) => {
  const storedNames = JSON.parse(localStorage.getItem('regionNames') || '{}');
  storedNames[regionId] = name;
  localStorage.setItem('regionNames', JSON.stringify(storedNames));
};

const MyRegionsPage = () => {
  const network = useUnit($network);
  const regions = useUnit($regions);
  const saleInfo = useUnit($saleInfo);
  const connections = useUnit($connections);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [regionDateInfos, setRegionDateInfos] = useState<Record<string, RegionDateInfo>>({});
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const countBits = (regionMask: string) => {
    let count = 0;
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
    if (!saleInfo) return;
    const regionDuration = saleInfo.regionEnd - saleInfo.regionBegin;
    const afterTimeslice = saleInfo.regionBegin - regionDuration;
    regionsRequested({ network, afterTimeslice });
  }, [network, saleInfo]);

  useEffect(() => {
    latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    regions.map(async (region) => {
      const beginTimestamp = await timesliceToTimestamp(region.begin, network, connections);
      const endTimestamp = await timesliceToTimestamp(region.end, network, connections);
      if (beginTimestamp && endTimestamp) {
        const beginDate = getRelativeTime(Number(beginTimestamp.toString()));
        const endDate = getRelativeTime(Number(endTimestamp.toString()));
        setRegionDateInfos((prev) => ({
          ...prev,
          [region.id]: {
            beginDate,
            endDate,
          },
        }));
      }
    });
  }, [regions, network, connections]);

  const handleNameChange = (regionId: string, value: string) => {
    setEditedNames((prev) => ({ ...prev, [regionId]: value }));
  };

  const handleSaveName = (regionId: string) => {
    const name = editedNames[regionId]?.trim();
    if (name) {
      setRegionName(regionId, name);
    }
    setEditingRegionId(null);
  };

  return (
    <>
      <div className={styles.container}>
        {regions.length > 0 ? (
          regions.map((region) => {
            const defaultName = getRegionName(region.id, region.core);
            const isEditing = editingRegionId === region.id;

            return (
              <div className={styles['region-card']} key={region.id}>
                <RegionCard
                  selected={selectedRegionId === region.id}
                  regionData={{
                    chainColor: 'greenDark',
                    chainLabel: 'Coretime Chain',
                    coreIndex: region.core,
                    consumed: 0,
                    coreOcupaccy: ((countBits(region.mask) * 720) / 57600) * 100,
                    duration: '28 days',
                    name: isEditing ? 'Editing...' : defaultName,
                    regionEnd: regionDateInfos?.[region.id]?.endDate
                      ? `End: ${regionDateInfos[region.id].endDate}`
                      : `End: Timeslice #${region.end}`,
                    regionStart: regionDateInfos?.[region.id]?.beginDate
                      ? `Begin: ${regionDateInfos[region.id].beginDate}`
                      : `Begin: Timeslice #${region.begin}`,
                    currentUsage: 0,
                    onClick: () => setSelectedRegionId(region.id),
                  }}
                  task={'Unassigned'}
                />
                <div className={styles.nameEditor}>
                  {isEditing ? (
                    <>
                      <input
                        className={styles.nameInput}
                        value={editedNames[region.id] ?? defaultName}
                        onChange={(e) => handleNameChange(region.id, e.target.value)}
                        onBlur={() => handleSaveName(region.id)}
                        onKeyDown={(e) => (e.key === 'Enter' ? handleSaveName(region.id) : null)}
                        autoFocus
                      />
                    </>
                  ) : (
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditedNames((prev) => ({
                          ...prev,
                          [region.id]: defaultName,
                        }));
                        setEditingRegionId(region.id);
                      }}
                    >
                      Edit name
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No regions available.</p>
        )}
      </div>

      <div>
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
