import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Admin Panel | Dasham Beauty Lounge',
};

// Admin pages get their own minimal root layout (no Header/Footer/WhatsApp float)
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body style={{ background: '#f4f1ea' }}>
        {children}
      </body>
    </html>
  );
}
