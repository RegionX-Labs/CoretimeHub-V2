'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import styles from './DutchAuctionChart.module.scss';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const series = [
  {
    name: 'Price',
    data: [
      { x: 0, y: 100 },
      { x: 1, y: 70 },
      { x: 2, y: 70 },
      { x: 3, y: 65 },
      { x: 4, y: null },
      { x: 5, y: 49 },
    ],
  },
  {
    name: 'Projection Guide',
    data: [
      { x: 3, y: 65 },
      { x: 5, y: 49 },
    ],
  },
];

const options: ApexOptions = {
  chart: {
    type: 'line',
    height: 300,
    background: 'transparent',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    width: [2, 2],
    curve: 'smooth',
    dashArray: [0, 7],
  },
  markers: {
    size: 0,
    strokeWidth: 0,
  },
  xaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
    min: 0,
    max: 5,
  },
  yaxis: {
    tickAmount: 4,
    min: 0,
    max: 100,
    labels: {
      style: { colors: '#888' },
      formatter: (val: number) => `${val} DOT`,
    },
  },
  grid: {
    show: true,
    borderColor: '#333',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  annotations: {
    xaxis: [
      {
        x: 0,
        x2: 2,
        fillColor: 'rgba(0, 255, 163, 0.05)',
        opacity: 0.3,
      },
      {
        x: 2,
        x2: 3,
        fillColor: 'rgba(0, 17, 255, 0.05)',
        opacity: 0.3,
      },
      {
        x: 3,
        x2: 5,
        fillColor: 'rgba(136, 136, 136, 0.05)',
        opacity: 0.3,
      },
    ],
  },
  tooltip: {
    theme: 'dark',
    shared: false,
    intersect: false,
  },
  legend: {
    show: false,
  },
  colors: ['#00FFA3', '#888'],
};

export default function DutchAuctionChart() {
  return (
    <div className={styles.chartCard}>
      <div className={styles.backgroundLabels}>
        <span className={styles.interlude}>Interlude</span>
        <span className={styles.leadin}>Leadin</span>
        <span className={styles.fixed}>Fixed Price</span>
      </div>
      <div className={styles.title}>Dutch Auction Chart</div>
      <ReactApexChart options={options} series={series} type='line' height={300} />
    </div>
  );
}
