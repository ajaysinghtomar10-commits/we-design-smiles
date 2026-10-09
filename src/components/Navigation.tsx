'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export interface NavItem {
  id: string;
  label: string;
}

export interface NavigationProps {
  /**
   * Optional custom array of section IDs to track and link to.
   * Defaults to: ['home', 'videos', 'gallery', 'about', 'services', 'booking']
   */
  sections?: string[];
  /** Optional custom class name */
  className?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'videos', label: 'Videos' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'location', label: 'Location' },
  { id: 'booking', label: 'Book Appointment' },
];

export const Navigation: React.FC<NavigationProps> = ({
  sections,
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Derive nav list from props if provided, or default list
  const navItems: NavItem[] = React.useMemo(() => {
    if (!sections || sections.length === 0) return DEFAULT_NAV_ITEMS;
    return sections.map((secId) => {
      const match = DEFAULT_NAV_ITEMS.find(
        (item) => item.id.toLowerCase() === secId.toLowerCase()
      );
      if (match) return match;
      // Auto-format ID to Label (e.g. "about-us" -> "About Us")
      const label = secId
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { id: secId, label };
    });
  }, [sections]);

  // Track active section and navbar background opacity on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // offset for sticky header

      setIsScrolled(window.scrollY > 20);

      // Check which section is currently active in viewport
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Smooth scroll handler
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);

      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        // Fallback for hash navigation
        window.location.hash = targetId;
      }
    },
    []
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-md border-b border-slate-200/80 py-3.5'
          : 'bg-white/95 backdrop-blur-sm shadow-xs border-b border-slate-100 py-4 sm:py-5'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* ──────────────────────────────────────────
            1. CLINIC LOGO / BRANDING (TEAL #06b6d4)
        ────────────────────────────────────────── */}
        <Link
          href="#home"
          onClick={(e) => scrollToSection(e, 'home')}
          className="flex items-center gap-3 group focus:outline-hidden"
          aria-label="We Design Smiles - Back to top"
        >
          {/* Custom Teal Tooth/Smile Brand Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#06b6d4] flex items-center justify-center text-white shadow-md shadow-[#06b6d4]/30 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#06b6d4]/40 transition-all">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#06b6d4] transition-colors leading-tight">
              WE DESIGN SMILES
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#06b6d4]">
              Luxury Dental Care
            </span>
          </div>
        </Link>

        {/* ──────────────────────────────────────────
            2. DESKTOP NAVIGATION (HORIZONTAL LAYOUT)
        ────────────────────────────────────────── */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isBooking = item.id === 'booking';

            // Don't duplicate the CTA button in the main link list
            if (isBooking) return null;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-[#06b6d4] bg-[#06b6d4]/10'
                    : 'text-slate-600 hover:text-[#06b6d4] hover:bg-slate-50'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#06b6d4]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* ──────────────────────────────────────────
            3. DESKTOP CTA BUTTON (TEAL #06b6d4)
        ────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center">
          <a
            href="#booking"
            onClick={(e) => scrollToSection(e, 'booking')}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#06b6d4] hover:bg-[#0891b2] shadow-md shadow-[#06b6d4]/30 hover:shadow-lg hover:shadow-[#06b6d4]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all"
          >
            <span>Book Appointment</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>

        {/* ──────────────────────────────────────────
            4. MOBILE HAMBURGER BUTTON
        ────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 focus:outline-hidden transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* ──────────────────────────────────────────
          5. MOBILE VERTICAL ACCORDION MENU
      ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-6 py-6 flex flex-col gap-2 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isBooking = item.id === 'booking';

            if (isBooking) {
              return (
                <div key={item.id} className="pt-3">
                  <a
                    href="#booking"
                    onClick={(e) => scrollToSection(e, 'booking')}
                    className="w-full py-3.5 rounded-xl text-center font-bold text-sm text-white bg-[#06b6d4] hover:bg-[#0891b2] shadow-md shadow-[#06b6d4]/30 flex items-center justify-center gap-2"
                  >
                    <span>Book Appointment</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                </div>
              );
            }

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'text-[#06b6d4] bg-[#06b6d4]/10 font-bold'
                    : 'text-slate-700 hover:text-[#06b6d4] hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                )}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navigation;
