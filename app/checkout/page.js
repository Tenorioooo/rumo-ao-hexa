'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import styles from './page.module.css';

const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;
  return true;
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

const maskCEP = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'document') {
      value = maskCPF(value);
    } else if (name === 'zipCode') {
      value = maskCEP(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-complete via CEP
    if (name === 'zipCode') {
      const cleanZip = value.replace(/\D/g, '');
      if (cleanZip.length === 8) {
        fetch(`https://viacep.com.br/ws/${cleanZip}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              setFormData(prev => ({
                ...prev,
                street: data.logradouro || prev.street,
                neighborhood: data.bairro || prev.neighborhood,
                city: data.localidade || prev.city,
                state: data.uf || prev.state
              }));
            }
          })
          .catch(err => console.error("Erro ao buscar CEP", err));
      }
    }
  };

  const handleGeneratePix = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações Reais
    if (!validateCPF(formData.document)) {
      setError('CPF inválido. Por favor, verifique o número digitado.');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('E-mail inválido. Por favor, insira um e-mail válido.');
      setLoading(false);
      return;
    }

    if (!formData.zipCode || formData.zipCode.replace(/\D/g, '').length !== 8) {
      setError('CEP inválido. Por favor, digite um CEP válido.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout/pix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: Math.round(total * 100), // convert to cents
    payer: {
      name: formData.name,
      email: formData.email,
      document: formData.document.replace(/\D/g, '') // remove non-digits
    },
    // Capture UTM parameters from URL (client-side)
    trackingParameters: typeof window !== 'undefined' ? Object.fromEntries(
      Array.from(new URLSearchParams(window.location.search).entries())
        .filter(([k]) => k.startsWith('utm_'))
    ) : {}
  })
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar pagamento PIX');
      }

      setPixData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (pixData?.pix_copy_paste) {
      navigator.clipboard.writeText(pixData.pix_copy_paste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (items.length === 0 && !pixData) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h2>Seu carrinho está vazio</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Adicione produtos para continuar com o checkout.</p>
          <Link href="/produtos" className="btn btn-gold" style={{ marginTop: '2rem' }}>
            Ver Camisetas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge badge-gold">🔒 Checkout Seguro</span>
          <h1 className={`section-title ${styles.title}`}>
            Finalizar <span className="gradient-text">Pedido</span>
          </h1>
          <p className={styles.subtitle}>
            Pagamento rápido e seguro via PIX com aprovação imediata.
          </p>
        </div>

        {pixData ? (
          // PIX Payment Screen
          <div className={styles.card} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className={styles.cardTitle}>🟢 Escaneie o QR Code</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Abra o app do seu banco e escaneie o código abaixo para pagar.
            </p>
            
            <div className={styles.qrContainer}>
              {(() => {
                let qrSrc = null;
                const codeStr = pixData.pix_copy_paste || pixData.qr_code_image;
                if (pixData.qr_code_image && (pixData.qr_code_image.startsWith('http') || pixData.qr_code_image.startsWith('data:'))) {
                  qrSrc = pixData.qr_code_image;
                } else if (codeStr) {
                  qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(codeStr)}`;
                }

                return qrSrc ? (
                  <img 
                    src={qrSrc} 
                    alt="QR Code PIX" 
                    className={styles.qrImage} 
                  />
                ) : (
                  <div className={styles.qrImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>QR Code Indisponível</span>
                  </div>
                );
              })()}
              
              <h3 style={{ marginBottom: '0.5rem' }}>Ou copie o código PIX:</h3>
              <div className={styles.copyCode}>
                {pixData.pix_copy_paste || pixData.qr_code_image || 'Código indisponível'}
              </div>
              
              <button 
                className={`btn btn-lg ${copied ? 'btn-outline' : 'btn-gold'}`} 
                onClick={handleCopy}
              >
                {copied ? '✓ Código Copiado!' : '📋 Copiar Código PIX'}
              </button>
            </div>
          </div>
        ) : (
          // Checkout Form
          <div className={styles.checkoutLayout}>
            {/* Form */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>📝 Seus Dados</h2>
              
              {error && <div className={styles.errorMsg}>{error}</div>}
              
              <form onSubmit={handleGeneratePix}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: joao@email.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="document">CPF</label>
                  <input 
                    type="text" 
                    id="document" 
                    name="document" 
                    required 
                    value={formData.document}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                
                <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.1rem', color: 'var(--text-color)' }}>Endereço de Entrega</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="zipCode">CEP</label>
                    <input 
                      type="text" 
                      id="zipCode" 
                      name="zipCode" 
                      required 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 2 }}>
                    <label htmlFor="street">Endereço</label>
                    <input 
                      type="text" 
                      id="street" 
                      name="street" 
                      required 
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="number">Número</label>
                    <input 
                      type="text" 
                      id="number" 
                      name="number" 
                      required 
                      value={formData.number}
                      onChange={handleInputChange}
                      placeholder="123"
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 2 }}>
                    <label htmlFor="complement">Complemento</label>
                    <input 
                      type="text" 
                      id="complement" 
                      name="complement" 
                      value={formData.complement}
                      onChange={handleInputChange}
                      placeholder="Apto, Bloco, etc. (Opcional)"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="neighborhood">Bairro</label>
                    <input 
                      type="text" 
                      id="neighborhood" 
                      name="neighborhood" 
                      required 
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      placeholder="Seu Bairro"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ flex: 2 }}>
                    <label htmlFor="city">Cidade</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      required 
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Sua Cidade"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="state">Estado</label>
                    <input 
                      type="text" 
                      id="state" 
                      name="state" 
                      required 
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="UF"
                    />
                  </div>
                </div>
                
                
                <button 
                  type="submit" 
                  className={`btn btn-gold btn-lg ${styles.submitBtn}`}
                  disabled={loading}
                >
                  {loading ? 'Gerando PIX...' : 'Gerar PIX agora'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>🛒 Resumo do Pedido</h2>
              
              <div className={styles.orderItems}>
                {items.map(item => (
                  <div key={item.key} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemMeta}>Tamanho: {item.size} | Qtd: {item.qty}</span>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
