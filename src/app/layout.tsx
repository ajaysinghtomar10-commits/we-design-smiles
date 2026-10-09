import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WE DESIGN SMILES | Luxury Cosmetic & Implant Dental Clinic',
  description:
    'Experience cinematic, comfort-first dental healthcare in Manhattan. Specializing in digital smile makeovers, clear aligners, and guided dental implants.',
  keywords: [
    'Dental Clinic',
    'Cosmetic Dentistry',
    'Smile Makeover',
    'Invisalign',
    'Dental Implants',
    'Teeth Whitening',
    'Manhattan Dentist',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
