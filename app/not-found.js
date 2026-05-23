import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: '80px', display: 'block' }}>😕</span>
      <h1 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: '48px',
        background: 'linear-gradient(135deg, #00cc66, #f5c518)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        404
      </h1>
      <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Página não encontrada</h2>
      <p style={{ fontSize: '16px', color: '#8a9bb0', maxWidth: '400px' }}>
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link
        href="/"
        className="btn btn-primary btn-lg"
        style={{ marginTop: '12px' }}
      >
        ⚽ Voltar para o início
      </Link>
    </div>
  );
}
