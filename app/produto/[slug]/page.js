import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, formatPrice, getDiscount } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import ProductInteractive from './ProductInteractive';
import styles from './page.module.css';

export default async function ProductPage({ params }) {
  // In Next.js 15+, params is a Promise in Server Components
  const { slug } = await params;

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.id, 3);
  const discount = getDiscount(product.originalPrice, product.price);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.crumbLink}>Início</Link>
          <span className={styles.crumbSep}>›</span>
          <Link href="/produtos" className={styles.crumbLink}>Camisetas</Link>
          <span className={styles.crumbSep}>›</span>
          <span className={styles.crumbCurrent}>{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className={styles.productLayout}>
          {/* Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrap}>
              <img src={product.image} alt={`Camiseta ${product.name}`} className={styles.image} />
              <div className={styles.imageBadges}>
                {product.badge && (
                  <span className={`badge badge-${product.badgeType}`}>
                    {product.badgeType === 'gold' ? '⭐' : '🆕'} {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className="badge badge-green">-{discount}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoSection}>
            <div className={styles.teamRow}>
              <span className={styles.flag}>{product.flag}</span>
              <span className={styles.edition}>{product.edition}</span>
              <span className={styles.category}>
                {product.category === 'america-sul' ? '🌎 América do Sul' : '🌍 Europa'}
              </span>
            </div>

            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.rating}>
              <div className={styles.stars}>
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className={styles.ratingNum}>{product.rating}</span>
              <span className={styles.ratingCount}>({product.reviews} avaliações)</span>
            </div>

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              <div className={styles.priceOldRow}>
                <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                <span className={styles.savings}>
                  Economia de {formatPrice(product.originalPrice - product.price)}
                </span>
              </div>
              <p className={styles.installments}>
                ou 12x de {formatPrice(product.price / 12)} sem juros
              </p>
            </div>

            {/* Componente Client Interativo (Tamanhos e Botões) */}
            <ProductInteractive product={product} />

            {/* Features */}
            <div className={styles.features}>
              {product.features.map(f => (
                <div key={f} className={styles.featureItem}>
                  <span className={styles.featureCheck}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <h3 className={styles.descTitle}>Sobre a camiseta</h3>
              <p className={styles.descText}>{product.description}</p>
            </div>

            {/* Trust */}
            <div className={styles.trust}>
              {[
                { icon: '🔒', text: 'Pagamento 100% seguro' },
                { icon: '🚚', text: 'Frete grátis acima de R$ 299' },
                { icon: '↩️', text: 'Troca em até 30 dias' },
              ].map(({ icon, text }) => (
                <div key={text} className={styles.trustItem}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className={styles.related} aria-label="Produtos relacionados">
          <div className={styles.relatedHeader}>
            <h2 className="section-title">
              Você também pode <span className="gradient-text">gostar</span>
            </h2>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
