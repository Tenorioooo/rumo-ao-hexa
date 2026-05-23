'use client';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/products';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`} aria-label="Carrinho de compras">
        <div className={styles.header}>
          <h2 className={styles.title}>
            🛒 Carrinho
            {items.length > 0 && <span className={styles.count}>{items.reduce((s,i)=>s+i.qty,0)}</span>}
          </h2>
          <button id="cart-close-btn" className={styles.closeBtn} onClick={onClose} aria-label="Fechar carrinho">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🏆</span>
            <p>Seu carrinho está vazio</p>
            <small>Adicione camisetas para continuar</small>
            <button className={`btn btn-primary btn-sm ${styles.emptyBtn}`} onClick={onClose}>
              Ver Camisetas
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.key} className={styles.item}>
                  <div className={styles.itemImg}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemFlag}>{item.flag}</div>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemSize}>Tamanho: <strong>{item.size}</strong></p>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                    <div className={styles.itemActions}>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label="Diminuir quantidade"
                        >−</button>
                        <span className={styles.qty}>{item.qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label="Aumentar quantidade"
                        >+</button>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.key)}
                        aria-label="Remover item"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span className={styles.totalValue}>{formatPrice(total)}</span>
              </div>
              <div className={styles.freeShipping}>
                <span>🚚</span> Frete grátis acima de R$ 299,90
              </div>
              <button 
                id="cart-checkout-btn" 
                className={`btn btn-gold btn-lg btn-full ${styles.checkoutBtn}`}
                onClick={() => {
                  onClose();
                  window.location.href = '/checkout';
                }}
              >
                Finalizar Pedido
              </button>
              <button className={styles.clearBtn} onClick={clearCart}>
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
