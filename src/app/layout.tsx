import type { Metadata } from 'next';
import { Inter, Outfit, Geist } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import ClientLayout from '@/components/ClientLayout';
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap', variable: '--font-outfit' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Dr. Muhammad Arif Rashid | Consultant Anesthesiologist & Pain Specialist',
    template: '%s | Dr. Muhammad Arif Rashid',
  },
  description:
    'Dr. Muhammad Arif Rashid is a leading Consultant Anesthesiologist, Pain Physician, and Perioperative Pain Specialist offering expert chronic pain management, interventional procedures, and surgical pain care in Pakistan.',
  keywords: [
    'Dr Muhammad Arif Rashid',
    'Pain specialist Pakistan',
    'Anesthesiologist Pakistan',
    'Chronic pain management',
    'Pain clinic',
    'Nerve block Pakistan',
    'Epidural injection',
    'Back pain specialist',
    'Pain physician Lahore',
  ],
  authors: [{ name: 'Dr. Muhammad Arif Rashid' }],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Dr. Muhammad Arif Rashid - Pain Specialist',
    title: 'Dr. Muhammad Arif Rashid | Consultant Anesthesiologist & Pain Specialist',
    description:
      'Expert chronic pain management, interventional pain procedures, and perioperative care in Pakistan.',
    images: [{ url: '/images/doctor/dr_arif.png', width: 1200, height: 630, alt: 'Dr. Muhammad Arif Rashid' }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.className, outfit.variable, 'font-sans', geist.variable)}>
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
