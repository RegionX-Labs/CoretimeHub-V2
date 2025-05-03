import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.scss';
import { TableComponent } from '../../components/elements/TableComponent';
import { FaStar } from 'react-icons/fa';
import { useUnit } from 'effector-react';
import DashboardModal from '../../components/DashboardModal';
import { $connections, $network } from '@/api/connection';
import { ParaStateCard } from '@/components/ParaStateCard';
import { $parachains, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';
import { ParaState } from '../../components/ParaStateCard';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);

  const network = useUnit($network);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);

  const toggleWatchlist = (id: number) => {
    const watchlistKey = `watchlist_${network}`;
    setWatchlist((prev) => {
      const updatedWatchlist = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem(watchlistKey, JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  useEffect(() => {
    const watchlistKey = `watchlist_${network}`;
    const savedWatchlist = localStorage.getItem(watchlistKey);
    if (savedWatchlist) {
      try {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        if (Array.isArray(parsedWatchlist)) {
          setWatchlist(parsedWatchlist);
        }
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
      }
    } else {
      setWatchlist([]);
    }
  }, [network]);

  useEffect(() => {
    parachainsRequested(network);
  }, [network, connections]);

  const filteredData = showWatchlist
    ? parachains.filter((item) => watchlist.includes(item.id) && item.network === network)
    : parachains.filter((item) => item.network === network);

  const tableData: Record<string, TableData>[] = filteredData.map((item) => ({
    Id: {
      cellType: 'text',
      data: item.id.toString(),
    },
    Name: {
      cellType: 'jsx',
      data: (
        <div className={styles.parachainNameContainer}>
          {chainData[network][item.id]?.logo ? (
            <img
              src={chainData[network][item.id].logo}
              alt=''
              width={32}
              height={32}
              style={{ borderRadius: '100%' }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '100%',
                backgroundColor: '#8899A8',
              }}
            />
          )}
          <p>{chainData[network][item.id]?.name}</p>
        </div>
      ),
      searchKey: chainData[network][item.id]?.name || '',
    },
    State: {
      cellType: 'jsx',
      data: <ParaStateCard state={item.state} />,
      searchKey: ParaState[item.state],
    },
    Watchlist: {
      cellType: 'jsx',
      data: (
        <div className={styles.starIconContainer}>
          <FaStar
            className={`${styles.starIcon} ${watchlist.includes(item.id) ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist(item.id)}
          />
        </div>
      ),
    },
  }));

  return (
    <>
      <div className={styles.parachain_dashboard_table}>
        <div className={styles.buttonContainer}>
          <button className={styles.customButton} onClick={() => setShowWatchlist(!showWatchlist)}>
            {showWatchlist ? 'Show All' : 'Watchlist'}
          </button>
          <button
            className={`${styles.customButton} ${styles.secondary}`}
            onClick={() => setIsModalOpen(true)}
          >
            Reserve New Para
          </button>
        </div>

        <h2 className={styles.heading}>Parachain Dashboard</h2>

        <div className={styles.dashboard_table}>
          <div className={styles.tableWrapper}>
            <TableComponent data={tableData} pageSize={8} />
          </div>
        </div>

        <DashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default ParachainDashboard;
