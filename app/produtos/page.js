'use client';
import { Suspense } from 'react';
import ProdutosContent from './ProdutosContent';

export default function ProdutosPage() {
  return (
    <Suspense fallback={<ProdutosLoading />}>
      <ProdutosContent />
    </Suspense>
  );
}

function ProdutosLoading() {
  return (
    <div style={{ paddingTop: 160, textAlign: 'center', color: '#8a9bb0' }}>
      <p style={{ fontSize: 18 }}>⚽ Carregando camisetas...</p>
    </div>
  );
}
