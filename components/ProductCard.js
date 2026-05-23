'use client';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice, getDiscount } from '@/lib/products';
import { useCart } from './CartProvider';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, style }) {
  const { addItem } = useCart();
  const [hovering, setHovering] = useState(false);
  const [adding, setAdding] = useState(false);
  const discount = getDiscount(product.originalPrice, product.price);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product, 'M');
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <article
      className={styles.card}
      style={style}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link href={`/produto/${product.slug}`} className={styles.link} id={`product-card-${product.id}`}>
        {/* Image */}
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={`Camiseta ${product.name}`}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />

          {/* Badges */}
          <div className={styles.badges}>
            {product.badge && (
              <span className={`badge badge-${product.badgeType}`}>
                {product.badgeType === 'gold' ? '⭐' : '🆕'} {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className={`badge badge-green`}>-{discount}%</span>
            )}
          </div>

          {/* Hover overlay */}
          <div className={`${styles.overlay} ${hovering ? styles.overlayVisible : ''}`}>
            <button
              id={`quick-add-${product.id}`}
              className={`btn btn-gold ${styles.quickAddBtn} ${adding ? styles.adding : ''}`}
              onClick={handleQuickAdd}
            >
              {adding ? '✓ Adicionado!' : '🛒 Adicionar ao Carrinho'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.teamRow}>
            <span className={styles.flag}>{product.flag}</span>
            <span className={styles.edition}>{product.edition}</span>
          </div>
          <h3 className={styles.name}>{product.name}</h3>

          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className={styles.ratingText}>{product.rating} ({product.reviews})</span>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <span className={styles.original}>{formatPrice(product.originalPrice)}</span>
          </div>

          {/* Sizes preview */}
          <div className={styles.sizes}>
            {product.sizes.map(s => (
              <span key={s} className={styles.size}>{s}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
