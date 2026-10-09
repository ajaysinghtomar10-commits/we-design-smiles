import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WE DESIGN SMILES | Luxury Cosmetic & Implant Dental Clinic | Vadodara',
  description:
    'Experience cinematic, comfort-first dental healthcare in Alkapuri, Vadodara, Gujarat. Specializing in digital smile makeovers, clear aligners, and painless dental implants.',
  keywords: [
    'Dental Clinic Vadodara',
    'Cosmetic Dentistry Gujarat',
    'Smile Makeover India',
    'Invisalign Vadodara',
    'Dental Implants Gujarat',
    'Teeth Whitening Alkapuri',
    'Best Dentist Vadodara',
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
