import './globals.css';
import './slp.css';
import { Inter } from 'next/font/google';
import SLPNav from '@/components/SLPNav';
import ContactFormProvider from '@/components/ContactFormProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'SLP Microsystems | Oracle Cloud IT Business & Consulting',
  description: 'Oracle Service Partner since 1999. Cloud solutions, HCM, Payroll, ERP, Managed Services, Data Analytics & Training.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="slp-site min-h-screen">
          <SLPNav />
          {children}
        </div>
        <ContactFormProvider />
      </body>
    </html>
  );
}
