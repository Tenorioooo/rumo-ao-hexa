'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/products';
import styles from './page.module.css';

export default function ProdutosContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'todos';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== 'todos') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, search, sort]);

  const [visibleCount, setVisibleCount] = useState(24);

  // Reseta a paginação ao mudar os filtros
  useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, search, sort]);

  const displayedProducts = filtered.slice(0, visibleCount);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={`container ${styles.pageHeaderInner}`}>
          <div>
            <span className="badge badge-gold">⚽ Copa 2026</span>
            <h1 className={`section-title ${styles.title}`}>
              Todas as <span className="gradient-text">Camisetas</span>
            </h1>
            <p className="section-subtitle">{filtered.length} camisetas disponíveis</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.cats}>
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.filterRight}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                id="search-input"
                type="text"
                placeholder="Buscar seleção..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar camisetas"
              />
            </div>

            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Ordenar por"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Melhor avaliação</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>😕</span>
            <h2>Nenhuma camiseta encontrada</h2>
            <p>Tente outro termo de busca ou categoria</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveCategory('todos'); }}>
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {displayedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${(i % 12) * 0.05}s` }} />
              ))}
            </div>
            
            {visibleCount < filtered.length && (
              <div style={{ textAlign: 'center', marginTop: '48px', paddingBottom: '32px' }}>
                <button 
                  className="btn btn-outline btn-lg" 
                  onClick={() => setVisibleCount(v => v + 24)}
                >
                  Carregar mais produtos ↓
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
