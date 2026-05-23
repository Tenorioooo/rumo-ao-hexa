import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartProvider from '@/components/CartProvider';

export const metadata = {
  title: 'Hexa Store | Camisetas Copa do Mundo 2026',
  description: 'A maior loja de camisetas oficiais da Copa do Mundo 2026. Camisetas de Brasil, Argentina, França, Portugal, Alemanha, Espanha e muito mais!',
  keywords: 'camiseta copa do mundo 2026, camiseta seleção brasileira, camiseta futebol, hexa, jersey copa 2026',
  openGraph: {
    title: 'Hexa Store | Camisetas Copa do Mundo 2026',
    description: 'Camisetas oficiais das seleções para a Copa do Mundo 2026',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
