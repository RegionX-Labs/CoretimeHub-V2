import React, { useState, useRef, useEffect } from 'react';
import styles from './secondary-market.module.scss';
import { TableComponent } from '../../components/elements/TableComponent';
import { Filter } from 'lucide-react';

export default function SecondaryMarket() {
  const rawData = [
    {
      CoreId: { cellType: 'text' as const, data: '#1045' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '60%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1046' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '35 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '100%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1048' },
      Timeline: { cellType: 'text' as const, data: '2 June → 9 June' },
      Price: { cellType: 'text' as const, data: '38 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '100%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1049' },
      Timeline: { cellType: 'text' as const, data: '2 June → 9 June' },
      Price: { cellType: 'text' as const, data: '26 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '40%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1050' },
      Timeline: { cellType: 'text' as const, data: '2 June → 9 June' },
      Price: { cellType: 'text' as const, data: '50 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '75%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1051' },
      Timeline: { cellType: 'text' as const, data: '9 June → 16 June' },
      Price: { cellType: 'text' as const, data: '45 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '90%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1052' },
      Timeline: { cellType: 'text' as const, data: '9 June → 16 June' },
      Price: { cellType: 'text' as const, data: '30 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '55%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1053' },
      Timeline: { cellType: 'text' as const, data: '9 June → 16 June' },
      Price: { cellType: 'text' as const, data: '60 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '85%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1054' },
      Timeline: { cellType: 'text' as const, data: '16 June → 23 June' },
      Price: { cellType: 'text' as const, data: '20 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '30%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
  ];

  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minPercentage, setMinPercentage] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const parseNumber = (value: string) => parseFloat(value.replace(/[^\d.]/g, ''));

  const filteredData = rawData.filter((row) => {
    const price = parseNumber(row.Price.data);
    const percentage = parseNumber(row.CorePercentage.data);
    return (
      (maxPrice === null || price <= maxPrice) &&
      (minPercentage === null || percentage >= minPercentage)
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.secondaryMarketTableContainer}>
        <div className={styles.secondaryMarketTableInner}>
          <div className={styles.tableWrapper}>
            <div className={styles.headerRow}>
              <h2 className={styles.marketHeading}>Secondary Marketplace Snapshot</h2>
              <div className={styles.filterWrapper} ref={panelRef}>
                <button className={styles.filterButton} onClick={() => setOpen((prev) => !prev)}>
                  <Filter size={16} />
                  <span>Filters</span>
                </button>

                {open && (
                  <div className={styles.filterDropdown}>
                    <div className={styles.filterInputGroup}>
                      <label>Max Price (DOT)</label>
                      <input
                        type='number'
                        min='0'
                        value={maxPrice ?? ''}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value ? Math.max(0, parseFloat(e.target.value)) : null
                          )
                        }
                        placeholder='Maximum price in DOT
'
                      />
                    </div>
                    <div className={styles.filterInputGroup}>
                      <label>Min %</label>
                      <input
                        type='number'
                        min='0'
                        value={minPercentage ?? ''}
                        onChange={(e) =>
                          setMinPercentage(
                            e.target.value ? Math.max(0, parseFloat(e.target.value)) : null
                          )
                        }
                        placeholder='Minimum core %'
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <TableComponent data={filteredData} pageSize={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
