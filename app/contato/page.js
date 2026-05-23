import Link from 'next/link';
import styles from '../sobre/page.module.css';

export const metadata = {
  title: 'Fale Conosco | Hexa Store',
  description: 'Entre em contato com a equipe da Hexa Store.',
};

export default function ContatoPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="badge badge-gold">📞 Atendimento</span>
          <h1 className={`section-title ${styles.title}`}>
            Fale <span className="gradient-text">Conosco</span>
          </h1>
          <p className={styles.subtitle}>
            Nossa equipe está pronta para te ajudar. Escolha o canal de atendimento de sua preferência.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>💬</div>
            <h2 className={styles.storyTitle}>WhatsApp</h2>
            <p className={styles.storyText}>
              Atendimento rápido de Segunda a Sexta, das 09h às 18h.
            </p>
            <a href="#" className="btn btn-gold" style={{ marginTop: '1rem', display: 'inline-block' }}>Chamar no WhatsApp</a>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>✉️</div>
            <h2 className={styles.storyTitle}>E-mail</h2>
            <p className={styles.storyText}>
              Para dúvidas gerais, parcerias ou suporte relacionado ao seu pedido:
            </p>
            <p className={styles.storyText} style={{ fontWeight: 'bold' }}>
              suporte@hexastore.com.br
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>📱</div>
            <h2 className={styles.storyTitle}>Redes Sociais</h2>
            <p className={styles.storyText}>
              Siga-nos no Instagram e acompanhe as novidades e promoções exclusivas!
            </p>
            <a href="#" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>@HexaStoreOficial</a>
          </div>
        </div>
      </div>
    </div>
  );
}
