import Link from 'next/link';
import styles from '../sobre/page.module.css';

export const metadata = {
  title: 'Trocas e Devoluções | Hexa Store',
  description: 'Política de trocas e devoluções da Hexa Store.',
};

export default function TrocasPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="badge badge-gold">↩️ Política da Loja</span>
          <h1 className={`section-title ${styles.title}`}>
            Trocas e <span className="gradient-text">Devoluções</span>
          </h1>
          <p className={styles.subtitle}>
            Nosso compromisso é com a sua total satisfação. Veja como funciona nossa política.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>📅</div>
            <h2 className={styles.storyTitle}>Prazo de 30 Dias</h2>
            <p className={styles.storyText}>
              Você tem até 30 dias corridos após o recebimento do produto para solicitar a troca por outro tamanho ou modelo, sem nenhum custo adicional na primeira troca.
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>🛡️</div>
            <h2 className={styles.storyTitle}>Devolução por Arrependimento</h2>
            <p className={styles.storyText}>
              Em conformidade com o Código de Defesa do Consumidor, você tem até 7 dias corridos para solicitar o cancelamento e devolução do dinheiro após o recebimento do pedido.
            </p>
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>📦</div>
            <h2 className={styles.storyTitle}>Condições do Produto</h2>
            <p className={styles.storyText}>
              O produto deve ser devolvido na embalagem original, sem indícios de uso, sem odores e com todas as etiquetas intactas fixadas à peça.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Deseja iniciar uma troca?</h2>
          <p className={styles.ctaText}>Entre em contato com o suporte informando o número do seu pedido.</p>
          <Link href="/contato" className="btn btn-gold btn-lg">
            📞 Solicitar Troca
          </Link>
        </div>
      </div>
    </div>
  );
}
