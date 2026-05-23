'use client';
import { useState, useEffect } from 'react';

const COPA_DATE = new Date('2026-06-11T16:00:00Z');

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calcTime() {
  const diff = COPA_DATE - Date.now();
  if (diff <= 0) return ZERO;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ styles }) {
  // Inicia com zeros para SSR — evita hydration mismatch
  const [time, setTime] = useState(ZERO);

  useEffect(() => {
    // Atualiza imediatamente no cliente e depois a cada segundo
    setTime(calcTime());
    const id = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days, label: 'Dias' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ];

  return (
    <div className={styles.countdown} aria-label="Contagem regressiva para a Copa">
      <p className={styles.countdownLabel}>⏱️ Copa começa em</p>
      <div className={styles.countdownGrid}>
        {units.map(({ value, label }) => (
          <div key={label} className={styles.countdownUnit}>
            <span className={styles.countdownNum}>
              {String(value).padStart(2, '0')}
            </span>
            <span className={styles.countdownLbl}>{label}</span>
          </div>
        ))}
      </div>
      <div className={styles.countdownDividers}>
        <span>:</span><span>:</span><span>:</span>
      </div>

      <div className={styles.flagGrid}>
        {['🇧🇷','🇦🇷','🇫🇷','🇵🇹','🇩🇪','🇪🇸','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇮🇹'].map(f => (
          <span key={f} className={styles.flagItem}>{f}</span>
        ))}
      </div>
    </div>
  );
}
