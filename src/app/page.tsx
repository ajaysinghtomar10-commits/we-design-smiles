'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import BookingForm from '@/components/BookingForm';
import LocationSection from '@/components/LocationSection';

// Dynamically import video scrubbers to ensure optimal SSR performance and smooth client hydration
const VideoScrubber = dynamic(
  () => import('@/components/VideoScrubber'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white/50 animate-pulse">
        <span className="text-sm uppercase tracking-widest font-mono">Loading Hero Experience...</span>
      </div>
    ),
  }
);

const ResultsVideoScrubber = dynamic(
  () => import('@/components/ResultsVideoScrubber'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white/50 animate-pulse">
        <span className="text-sm uppercase tracking-widest font-mono">Loading Results Gallery...</span>
      </div>
    ),
  }
);

const VideoSection3 = dynamic(
  () => import('@/components/VideoSection3'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white/50 animate-pulse">
        <span className="text-sm uppercase tracking-widest font-mono">Loading Clinic Flow...</span>
      </div>
    ),
  }
);

export default function DentalClinicHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-[#06b6d4] selection:text-white font-sans scroll-smooth">
      {/* ─────────────────────────────────────────────────────────────
          STICKY REACT NAVIGATION WITH TEAL BRANDING (#06b6d4)
      ───────────────────────────────────────────────────────────── */}
      <Navigation
        sections={['home', 'videos', 'gallery', 'about', 'services', 'location', 'booking']}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO WALKTHROUGH (HOME / VIDEOS)
      ───────────────────────────────────────────────────────────── */}
      <section id="home" className="relative w-full">
        <div id="walkthrough" />
        <div id="videos" />
        <VideoScrubber
          videoFramePath="/videos/video_1_frames"
          totalFrames={300}
          fileExtension="webp"
          overlayTitle="We Design Smiles - Professional Dental Care"
          overlayDescription="Your journey to perfect smiles starts here. Step inside our tranquil Vadodara clinic."
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: RESULTS GALLERY
      ───────────────────────────────────────────────────────────── */}
      <section id="gallery" className="relative w-full">
        <div id="results" />
        <ResultsVideoScrubber
          videoFramePath="/videos/video_2_frames"
          totalFrames={300}
          fileExtension="webp"
          overlayTitle="See Our Smile Transformations - Before & After Results"
          overlayDescription="Join hundreds of satisfied patients who achieved their dream smiles with precision esthetics."
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CLINIC CONTINUITY (PATIENT AREA TO CLINIC FLOW)
      ───────────────────────────────────────────────────────────── */}
      <section id="clinic-continuity" className="relative w-full">
        <VideoSection3
          videoFramePath="/videos/video_3_frames"
          totalFrames={299}
          fileExtension="webp"
          overlayText="Professional Clinic Design - Built for Your Comfort"
          overlayDescription="Every space designed for your peace of mind. Experience zero-anxiety dental wellness."
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ABOUT US SECTION: PHILOSOPHY, STATS, TEAM INTRODUCTION
      ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-sky-50 text-sky-700 mb-3">
              About WE DESIGN SMILES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Where Dentistry Meets Architectural Artistry
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              We founded We Design Smiles with a singular purpose: to replace clinical apprehension with serene, bespoke healthcare. Every treatment suite features soundproof architectural glass, ergonomic memory-foam chairs, and 3D digital smile imaging.
            </p>
          </div>

          {/* Quick Credential Badges & Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { stat: '15,000+', label: 'Smiles Reimagined', desc: 'Across 14+ years of care' },
              { stat: '99.6%', label: 'Comfort Rating', desc: 'Certified pain-free protocol' },
              { stat: '100%', label: 'Digital Dentistry', desc: 'No messy silicone impressions' },
              { stat: '18+', label: 'Aesthetic Awards', desc: 'IDA & DCI Recognized Fellowship' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center hover:shadow-md hover:border-sky-300 transition-all"
              >
                <span className="block text-3xl sm:text-4xl font-extrabold text-sky-600 tracking-tight">
                  {item.stat}
                </span>
                <span className="block mt-2 font-semibold text-slate-900 text-sm sm:text-base">
                  {item.label}
                </span>
                <span className="block mt-1 text-xs text-slate-500 font-medium">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Doctors Team Grid */}
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900">Meet Your Smile Architects</h3>
            <p className="text-sm text-slate-600 mt-1">Board-certified clinicians with worldwide post-doctoral acclaim.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Aarav Patel, BDS, MDS',
                role: 'Founder & Principal Cosmetic Dentist',
                bio: 'Gold Medalist from Government Dental College (Ahmedabad) and Fellow of the International College of Dentists (FICD), specializing in digital smile makeovers, ultra-thin porcelain veneers, and full-mouth rehabilitation.',
                tags: ['Smile Design', 'Veneers', 'FICD Fellow'],
                color: 'from-sky-500 to-cyan-400',
              },
              {
                name: 'Dr. Ananya Sharma, BDS, MDS',
                role: 'Director of Orthodontics & Dentofacial Orthopaedics',
                bio: 'AIIMS New Delhi alumna with specialized training in biomechanical clear aligners, adult bite reconstruction, and non-extraction facial aesthetics.',
                tags: ['Invisalign Provider', 'Dentofacial Ortho', 'AIIMS Alumna'],
                color: 'from-cyan-500 to-teal-400',
              },
              {
                name: 'Dr. Rajesh Mehta, BDS, MDS',
                role: 'Chief Surgical Implantologist & Periodontist',
                bio: 'Manipal College of Dental Sciences alumnus and ICOI Diplomate with over 5,000 successful CBCT-guided robotic implants and biomimetic tissue grafting procedures.',
                tags: ['3D Implants', 'Bone Regeneration', 'Painless Surgery'],
                color: 'from-blue-600 to-sky-500',
              },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Avatar / Mock Portrait */}
                  <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden mb-5 border border-slate-200/60">
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white`} />
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${doc.color} flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                        {doc.name.split(' ')[1]?.[0] || 'D'}
                      </div>
                      <span className="text-xs font-semibold text-slate-500 mt-2">Active Specialist</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-xs font-semibold text-cyan-600 mt-0.5">{doc.role}</p>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{doc.bio}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {doc.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SERVICES / TREATMENTS MENU SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-cyan-100/70 text-cyan-800 mb-3">
              Tailored Clinical Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Care &bull; Zero Compromise
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Each treatment plan is engineered with microscopic attention to tooth biology, facial aesthetics, and long-term systemic oral health.
            </p>
          </div>

          {/* 3-Column Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Digital Smile Makeovers',
                desc: 'Bespoke hand-layered porcelain veneers, gum line recontouring, and AI smile simulation preview before we begin.',
                features: ['3D Pre-visualization', 'Ultra-thin E-max Veneers', 'Minimal Preparation'],
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                ),
              },
              {
                title: 'Clear Aligners & Ortho',
                desc: 'Straighten your teeth discreetly with custom-molded invisible trays, accelerated monitoring, and zero lifestyle disruption.',
                features: ['Virtually Invisible', 'Weekly Dental Monitoring App', 'Average 6-9 Mos Duration'],
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ),
              },
              {
                title: 'Guided Dental Implants',
                desc: 'Permanent, lifelike tooth replacements utilizing CBCT 3D navigation and titanium or ceramic biocompatible posts.',
                features: ['Same-Day Teeth Options', 'Natural Bone Preservation', 'Lifetime Post Warranty'],
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                ),
              },
              {
                title: 'Enamel Laser Whitening',
                desc: 'Cold-light laser activation lifting stains up to 8 shades lighter in just 45 minutes without postoperative sensitivity.',
                features: ['Desensitizing Gel Included', '45-Min Chairside Treatment', 'Long-Lasting Radiance'],
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
              },
              {
                title: 'Biomimetic Restorations',
                desc: 'Preserve natural tooth structure with adhesive bonding, tooth-colored ceramic inlays, and mercury-free aesthetics.',
                features: ['Mercury & BPA Free', 'Microscopic Precision', 'Fracture-Resistant Composites'],
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                ),
              },
              {
                title: 'Airflow Dental Hygiene & Spa',
                desc: 'Comfort-first prophylactic cleanings utilizing warm-water ultrasonic scaling and erythritol powder airflow polishing.',
                features: ['Warm Water Jet Polish', 'No Scraping or Discomfort', 'Deep Plaque Eradication'],
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                ),
              },
            ].map((svc, sIdx) => (
              <div
                key={sIdx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {svc.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <ul className="space-y-2">
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs font-medium text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 mt-5 group-hover:translate-x-1 transition-transform"
                  >
                    Reserve Treatment &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          LOCATION & GOOGLE MAPS SECTION
      {/* ─────────────────────────────────────────────────────────────
          LOCATION & GOOGLE MAPS SECTION (VADODARA, GUJARAT)
      ───────────────────────────────────────────────────────────── */}
      <LocationSection />

      {/* ─────────────────────────────────────────────────────────────
          APPOINTMENT BOOKING FORM SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="booking" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <BookingForm />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CLINICAL FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Brand & Accreditation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-base font-bold text-white tracking-tight">WE DESIGN SMILES</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gujarat&apos;s premier center for elevated aesthetic dentistry, clear aligners, and biomimetic restorative care.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="px-2 py-0.5 rounded-sm bg-slate-800 border border-slate-700">IDA Member</span>
                <span className="px-2 py-0.5 rounded-sm bg-slate-800 border border-slate-700">DCI Registered</span>
                <span className="px-2 py-0.5 rounded-sm bg-slate-800 border border-slate-700">ISO 9001</span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white block mb-4">
                Explore Clinic
              </span>
              <ul className="space-y-2 text-xs">
                <li><a href="#walkthrough" className="hover:text-white transition-colors">Video Walkthrough</a></li>
                <li><a href="#results" className="hover:text-white transition-colors">Before &amp; After Results</a></li>
                <li><a href="#clinic-continuity" className="hover:text-white transition-colors">Clinic Continuity Flow</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Doctors &amp; Philosophy</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Treatments Menu</a></li>
                <li><a href="#location" className="hover:text-white transition-colors">Directions &amp; Map</a></li>
              </ul>
            </div>

            {/* Column 3: Treatments List */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white block mb-4">
                Specialties
              </span>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="hover:text-white transition-colors">Digital Smile Makeovers</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Porcelain Veneers</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Invisalign Clear Aligners</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Computer-Guided Implants</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Laser Enamel Whitening</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Spa Prophylaxis Cleanings</a></li>
              </ul>
            </div>

            {/* Column 4: Urgent & Direct Contacts */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white block mb-4">
                Concierge Contact
              </span>
              <p className="text-xs text-slate-400">301-304 Crystal Plaza, R.C. Dutt Road<br />Alkapuri, Vadodara, Gujarat 390007</p>
              <p className="text-xs text-cyan-400 font-semibold mt-3">+91 98250 12345</p>
              <p className="text-xs text-slate-400 mt-1">care@wedesignsmiles.com</p>
              <div className="mt-4 pt-3 border-t border-slate-900">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Accepting New Patients Today
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} WE DESIGN SMILES Dental Clinic LLP. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#about" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#about" className="hover:text-slate-400 transition-colors">DCI Guidelines</a>
              <a href="#about" className="hover:text-slate-400 transition-colors">Terms of Care</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
