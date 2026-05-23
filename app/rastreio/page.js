import Link from 'next/link';
import styles from '../sobre/page.module.css';

export const metadata = {
  title: 'Rastrear Pedido | Hexa Store',
  description: 'Acompanhe o status e a entrega do seu pedido na Hexa Store.',
};

export default function RastreioPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="badge badge-gold">📍 Entrega</span>
          <h1 className={`section-title ${styles.title}`}>
            Rastrear <span className="gradient-text">Pedido</span>
          </h1>
          <p className={styles.subtitle}>
            Insira o código de rastreamento recebido por e-mail para acompanhar a entrega do seu pedido em tempo real.
          </p>
        </div>

        {/* Content (Mock tracking form) */}
        <div className={styles.content} style={{ flexDirection: 'column', alignItems: 'center' }}>
          <div className={styles.storyCard} style={{ width: '100%', maxWidth: '600px' }}>
            <h2 className={styles.storyTitle} style={{ textAlign: 'center', marginBottom: '1rem' }}>Onde está minha camiseta?</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Código Ex: BR123456789BR" 
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }} 
              />
              <button className="btn btn-gold" style={{ padding: '0 1.5rem' }}>Buscar</button>
            </div>
            <p className={styles.storyText} style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
              *O código de rastreio pode levar até 24h para atualizar no sistema após o envio.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Não recebeu o código?</h2>
          <p className={styles.ctaText}>Verifique sua caixa de spam ou entre em contato com o suporte.</p>
          <Link href="/contato" className="btn btn-outline btn-lg">
            📞 Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
