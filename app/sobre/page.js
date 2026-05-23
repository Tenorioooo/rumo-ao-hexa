import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Sobre Nós | Hexa Store',
  description: 'Conheça a Hexa Store — a maior loja online de camisetas da Copa do Mundo 2026.',
};

export default function SobrePage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="badge badge-gold">🏆 Nossa História</span>
          <h1 className={`section-title ${styles.title}`}>
            Sobre a <span className="gradient-text">Hexa Store</span>
          </h1>
          <p className={styles.subtitle}>
            Nascemos da paixão pelo futebol e do sonho de ver o Brasil campeão mais uma vez.
          </p>
        </div>

        {/* Story */}
        <div className={styles.content}>
          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>⚽</div>
            <h2 className={styles.storyTitle}>Nossa Missão</h2>
            <p className={styles.storyText}>
              A Hexa Store foi criada com uma missão simples: permitir que cada torcedor vista a camisa 
              do seu time do coração com orgulho e qualidade. Oferecemos camisetas oficiais das maiores 
              seleções do mundo, com foco especial na Copa do Mundo 2026.
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>🇧🇷</div>
            <h2 className={styles.storyTitle}>Rumo ao Hexa</h2>
            <p className={styles.storyText}>
              A Copa do Mundo 2026 será histórica — realizada nos EUA, Canadá e México, 
              pela primeira vez com 48 seleções. O Brasil vai em busca do sexto título mundial, 
              e nós queremos que você esteja pronto para torcer com estilo.
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>✨</div>
            <h2 className={styles.storyTitle}>Qualidade Garantida</h2>
            <p className={styles.storyText}>
              Todas as nossas camisetas são feitas com tecidos premium, como Dri-FIT e Climacool, 
              garantindo conforto e durabilidade. Cada peça possui escudos bordados e patches 
              oficiais da Copa do Mundo 2026.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { value: '10K+', label: 'Clientes satisfeitos' },
            { value: '6', label: 'Seleções disponíveis' },
            { value: '4.8', label: 'Nota média' },
            { value: '30', label: 'Dias para troca' },
          ].map(({ value, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Pronto para vestir a camisa? 🏆</h2>
          <p className={styles.ctaText}>Explore nossa coleção completa de camisetas da Copa 2026</p>
          <Link href="/produtos" id="sobre-cta-btn" className="btn btn-gold btn-lg">
            🛒 Ver Camisetas
          </Link>
        </div>
      </div>
    </div>
  );
}
