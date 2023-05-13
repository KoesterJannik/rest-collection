import './globals.css';
import { Inter } from 'next/font/google';

import Navbar from '@/app/components/Navbar';
import Providers from '@/app/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
