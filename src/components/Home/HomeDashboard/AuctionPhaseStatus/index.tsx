import styles from './AuctionPhaseStatus.module.scss';

export default function AuctionPhaseStatus() {
  const segments = [
    { label: 'Interlude Phase', value: 50, color: '#00E676' },
    { label: 'Leadin Phase', value: 30, color: '#00E676' },
    { label: 'Fixed Price Phase', value: 20, color: '#888' },
  ];

  const TOTAL_ANGLE = 190;
  const RADIUS = 90;
  const GAP_ANGLE = 10;
  const CENTER = 100;
  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

  let currentAngle = (10 - TOTAL_ANGLE) / 2;

  const renderedSegments = segments.map((segment, i) => {
    const angleSpan = (segment.value / totalValue) * TOTAL_ANGLE - GAP_ANGLE;
    const x1 = CENTER + RADIUS * Math.cos((Math.PI / 180) * currentAngle);
    const y1 = CENTER + RADIUS * Math.sin((Math.PI / 180) * currentAngle);
    const x2 = CENTER + RADIUS * Math.cos((Math.PI / 180) * (currentAngle + angleSpan));
    const y2 = CENTER + RADIUS * Math.sin((Math.PI / 180) * (currentAngle + angleSpan));

    const largeArc = angleSpan > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}
    `;

    currentAngle += angleSpan + GAP_ANGLE;

    return (
      <path
        key={i}
        d={path}
        stroke={segment.color}
        strokeWidth={10}
        fill='none'
        strokeLinecap='round'
      />
    );
  });

  const DOT_COUNT = 20;
  const dotRadius = 1;
  const innerRadius = RADIUS - 12;
  const dots = [];

  const startAngle = (0 - TOTAL_ANGLE) / 2;

  const angleIncrement = TOTAL_ANGLE / (DOT_COUNT - 1);

  for (let i = 0; i < DOT_COUNT; i++) {
    const angle = startAngle + i * angleIncrement;
    const rad = (Math.PI / 195) * angle;
    const x = CENTER + innerRadius * Math.cos(rad);
    const y = CENTER + innerRadius * Math.sin(rad);

    dots.push(<circle key={`dot-${i}`} cx={x} cy={y} r={dotRadius} fill='#6b7280' />);
  }

  return (
    <div className={styles.auctionPhaseCard}>
      <div className={styles.header}>Auction Phase Status</div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.label}>Current Phase</div>
          <div className={styles.value}>Secondary Market</div>
          <div className={styles.label}>Next Phase in</div>
          <div className={styles.value}>30 Minutes</div>
        </div>

        <div className={styles.progressWrapper}>
          <svg width='200' height='200' viewBox='0 0 200 200'>
            {dots}
            {renderedSegments}
            <text x='100' y='90' textAnchor='left' fill='#888' fontSize='12'>
              Progress
            </text>
            <text x='100' y='110' textAnchor='left' fill='#fff' fontSize='15' fontWeight='600'>
              80%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
