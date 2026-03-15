import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/providers/Providers';
import './globals.css';

export const metadata = {
  title: 'GIRIRAM CYCLE MART | Premium Cycles & Repairs',
  description: 'Your one-stop shop for premium cycles, accessories, and expert repair services.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
