import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import PublicShell from '@/components/PublicShell';

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
  metadataBase: new URL('https://dashambeautylounge.com'),
  title: {
    template: '%s | Dasham Beauty Lounge',
    default: "Dasham Beauty Lounge — Ibadan's Premium Beauty & Wellness Center",
  },
  description:
    "Experience nails, lashes, facials, massage, waxing, pedicure, and sauna at Dasham Beauty Lounge — Ibadan's top beauty and wellness destination. Book your appointment online.",
  keywords: [
    'beauty lounge Ibadan',
    'beauty spa Ibadan',
    'nails Ibadan',
    'pedicure Ibadan',
    'facial treatment Ibadan',
    'massage Ibadan',
    'waxing Ibadan',
    'lash extensions Ibadan',
    'Dasham Beauty Lounge',
  ],
  openGraph: {
    siteName: 'Dasham Beauty Lounge',
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
