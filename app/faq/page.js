import Link from 'next/link';
import styles from '../sobre/page.module.css';

export const metadata = {
  title: 'Dúvidas Frequentes | Hexa Store',
  description: 'Tire suas dúvidas sobre compras, prazos e produtos na Hexa Store.',
};

export default function FAQPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="badge badge-gold">❓ Ajuda</span>
          <h1 className={`section-title ${styles.title}`}>
            Dúvidas <span className="gradient-text">Frequentes</span>
          </h1>
          <p className={styles.subtitle}>
            Encontre rapidamente as respostas para as perguntas mais comuns.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>💳</div>
            <h2 className={styles.storyTitle}>Quais são as formas de pagamento?</h2>
            <p className={styles.storyText}>
              Aceitamos pagamentos exclusivamente via PIX (com aprovação imediata e total segurança).
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>🚚</div>
            <h2 className={styles.storyTitle}>Qual o prazo de entrega?</h2>
            <p className={styles.storyText}>
              O prazo varia de acordo com a sua região. Para as capitais do Brasil, a entrega leva em média de 3 a 5 dias úteis. Para o interior, de 5 a 10 dias úteis.
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>🔒</div>
            <h2 className={styles.storyTitle}>Os produtos são originais?</h2>
            <p className={styles.storyText}>
              Sim! Trabalhamos apenas com camisas oficiais licenciadas e de marcas parceiras com garantia de autenticidade.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ainda precisa de ajuda?</h2>
          <p className={styles.ctaText}>Nossa equipe de suporte está pronta para te atender.</p>
          <Link href="/contato" className="btn btn-gold btn-lg">
            📞 Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
