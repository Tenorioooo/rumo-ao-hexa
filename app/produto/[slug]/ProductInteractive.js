'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import styles from './page.module.css';

export default function ProductInteractive({ product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setAdding(true);
    for (let i = 0; i < qty; i++) addItem(product, selectedSize);
    setTimeout(() => setAdding(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize);
    window.location.href = '/checkout';
  };

  return (
    <>
      <div className={styles.divider} />

      {/* Size selector */}
      <div className={styles.sizeSection}>
        <div className={styles.sizeLabelRow}>
          <span className={styles.sizeLabel}>Tamanho:</span>
          {selectedSize && <span className={styles.selectedSize}>{selectedSize}</span>}
        </div>
        <div className={styles.sizes}>
          {product.sizes.map(size => (
            <button
              key={size}
              id={`size-${size}`}
              className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''} ${sizeError && !selectedSize ? styles.sizeError : ''}`}
              onClick={() => { setSelectedSize(size); setSizeError(false); }}
              aria-label={`Tamanho ${size}`}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
        {sizeError && (
          <p className={styles.sizeErrorMsg}>⚠️ Por favor, selecione um tamanho</p>
        )}
      </div>

      {/* Quantity */}
      <div className={styles.qtySection}>
        <span className={styles.sizeLabel}>Quantidade:</span>
        <div className={styles.qtyControl}>
          <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir">−</button>
          <span className={styles.qtyNum}>{qty}</span>
          <button className={styles.qtyBtn} onClick={() => setQty(qty + 1)} aria-label="Aumentar">+</button>
        </div>
      </div>

      {/* CTAs */}
      <button
        id="add-to-cart-btn"
        className={`btn btn-primary btn-lg btn-full ${styles.ctaBtn} ${adding ? styles.ctaAdding : ''}`}
        onClick={handleAdd}
      >
        {adding ? '✓ Adicionado ao carrinho!' : '🛒 Adicionar ao Carrinho'}
      </button>

      <button id="buy-now-btn" className={`btn btn-gold btn-lg btn-full`} onClick={handleBuyNow}>
        ⚡ Comprar Agora
      </button>

      <div className={styles.divider} />
    </>
  );
}
