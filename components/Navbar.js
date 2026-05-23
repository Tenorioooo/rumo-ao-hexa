'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import CartDrawer from './CartDrawer';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { count, isOpen, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} id="nav-logo">
            <span className={styles.logoIcon}>⚽</span>
            <span className={styles.logoText}>
              <span className={styles.logoHexa}>HEXA</span>
              <span className={styles.logoStore}>STORE</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Navegação principal">
            <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>Início</Link>
            <Link href="/produtos" className={styles.navLink} onClick={() => setMenuOpen(false)}>Camisetas</Link>
            <Link href="/produtos?cat=america-sul" className={styles.navLink} onClick={() => setMenuOpen(false)}>América do Sul</Link>
            <Link href="/produtos?cat=europa" className={styles.navLink} onClick={() => setMenuOpen(false)}>Europa</Link>
            <Link href="/sobre" className={styles.navLink} onClick={() => setMenuOpen(false)}>Sobre</Link>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              id="nav-cart-btn"
              className={styles.cartBtn}
              onClick={() => setIsOpen(true)}
              aria-label={`Carrinho - ${count} itens`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className={styles.cartBadge}>{count}</span>
              )}
            </button>

            <button
              id="nav-menu-btn"
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen1 : ''}`} />
              <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen2 : ''}`} />
              <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen3 : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
