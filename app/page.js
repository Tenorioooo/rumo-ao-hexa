import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CountdownTimer from '@/components/CountdownTimer';
import { products } from '@/lib/products';
import styles from './page.module.css';

export default function HomePage() {
  const featured = [...products].sort((a, b) => a.price - b.price).slice(0, 3);
  const preview = products.slice(0, 12);

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-label="Banner principal">
        {/* Background */}
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGrid} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span className="badge badge-gold">🏆 Copa do Mundo 2026</span>
            </div>

            <h1 className={styles.heroTitle}>
              Vista a Camisa{' '}
              <span className="gradient-text">do Seu Time</span>
              {' '}Favorito
            </h1>

            <p className={styles.heroDesc}>
              Camisetas oficiais das maiores seleções do mundo. Brasil, Argentina, França e muito mais — 
              prontos para a Copa do Mundo 2026!
            </p>

            <div className={styles.heroCtas}>
              <Link href="/produtos" id="hero-shop-btn" className="btn btn-gold btn-lg">
                🛒 Ver Camisetas
              </Link>
              <Link href="/produtos?cat=america-sul" id="hero-brasil-btn" className="btn btn-outline btn-lg">
                🇧🇷 Seleção Brasileira
              </Link>
            </div>

            {/* Trust row */}
            <div className={styles.heroTrust}>
              <span>🔒 Pagamento seguro</span>
              <span>🚚 Entrega rápida</span>
              <span>↩️ 30 dias para troca</span>
            </div>
          </div>

          {/* Countdown — client component isolado */}
          <CountdownTimer styles={styles} />
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} aria-hidden>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} aria-label="Diferenciais">
        <div className="container">
          <div className={styles.featureGrid}>
            {[
              { icon: '⚡', title: 'Entrega Expressa', desc: 'Receba em até 3 dias úteis' },
              { icon: '🛡️', title: 'Qualidade Garantida', desc: 'Tecidos premium DRI-FIT' },
              { icon: '⚡', title: 'Pagamento Instantâneo', desc: 'Aprovação imediata via PIX' },
              { icon: '↩️', title: 'Troca fácil', desc: '30 dias sem burocracia' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className={styles.featureItem}>
                <span className={styles.featureIcon}>{icon}</span>
                <div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className={styles.section} id="destaques" aria-label="Destaques">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-gold">⭐ Em Destaque</span>
              <h2 className={`section-title ${styles.sectionTitle}`}>
                As Mais <span className="gradient-text">Vendidas</span>
              </h2>
              <p className="section-subtitle">As camisetas favoritas dos torcedores</p>
            </div>
            <Link href="/produtos" id="see-all-btn" className="btn btn-outline">
              Ver todas →
            </Link>
          </div>

          <div className={styles.productGrid}>
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner Copa ── */}
      <section className={styles.copaBanner} aria-label="Banner Copa 2026">
        <div className={`container ${styles.copaBannerInner}`}>
          <div>
            <h2 className={`section-title ${styles.bannerTitle}`}>
              🏆 Rumo ao <span className="gradient-text">Hexa!</span>
            </h2>
            <p className={styles.bannerDesc}>
              A Copa do Mundo 2026 será realizada nos EUA, Canadá e México. 
              O Brasil vai em busca do sexto título. Você já está pronto?
            </p>
          </div>
          <Link href="/produtos?cat=america-sul" id="banner-cta-btn" className="btn btn-gold btn-lg">
            🇧🇷 Quero a Camisa do Brasil
          </Link>
        </div>
      </section>

      {/* ── All Products (preview — 12 itens) ── */}
      <section className={styles.section} id="todas" aria-label="Todas as camisetas">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-green">⚽ Coleção Completa</span>
              <h2 className={`section-title ${styles.sectionTitle}`}>
                Todas as <span className="gradient-text">Seleções</span>
              </h2>
              <p className="section-subtitle">Escolha a camiseta do seu time</p>
            </div>
          </div>

          <div className={`${styles.productGrid} ${styles.productGrid4}`}>
            {preview.map((p, i) => (
              <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/produtos" id="load-more-btn" className="btn btn-outline btn-lg">
              Ver todas as {products.length} camisetas →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
