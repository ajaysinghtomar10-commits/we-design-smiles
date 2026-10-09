'use client';

import React from 'react';

export interface BusinessHours {
  weekday?: string;
  saturday?: string;
  sunday?: string;
}

export interface LocationSectionProps {
  /** Clinic display name (default: "WE DESIGN SMILES") */
  clinicName?: string;
  /** Full street address with city/zip */
  address?: string;
  /** Primary clinic phone number for tel: link */
  phone?: string;
  /** Primary clinic email address for mailto: link */
  email?: string;
  /** Business hours object or text */
  hours?: BusinessHours;
  /** Location neighborhood & parking description */
  locationDescription?: string;
  /** Pre-configured Google Maps embed iframe URL */
  mapEmbedUrl?: string;
  /** Google Maps URL opened when clicking 'Get Directions' */
  directionsUrl?: string;
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.6820210214!2d73.10304595295982!3d22.322102646695345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe1473fb8!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin';

const DEFAULT_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=WE+DESIGN+SMILES+Alkapuri+Vadodara+Gujarat';

export const LocationSection: React.FC<LocationSectionProps> = ({
  clinicName = 'WE DESIGN SMILES',
  address = '301-304 Crystal Plaza, R.C. Dutt Road, Alkapuri, Vadodara, Gujarat 390007',
  phone = '+91 98250 12345',
  email = 'care@wedesignsmiles.com',
  hours = {
    weekday: 'Mon - Fri: 9:00 AM - 6:00 PM',
    saturday: 'Saturday: 10:00 AM - 4:00 PM',
    sunday: 'Sunday: Closed',
  },
  locationDescription = 'Centrally situated in the heart of Alkapuri, Vadodara. Features dedicated reserved patient parking, touchless elevator accessibility, and a serene, soundproof clinical environment.',
  mapEmbedUrl = DEFAULT_MAP_EMBED_URL,
  directionsUrl = DEFAULT_DIRECTIONS_URL,
  className = '',
}) => {
  // Strip non-numeric/plus characters for clean tel URI
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const mailtoHref = `mailto:${email}`;

  return (
    <section
      id="location"
      className={`py-20 lg:py-28 bg-white border-t border-slate-200 relative overflow-hidden ${className}`}
      aria-label="Location and Contact Information"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#06b6d4]/10 text-[#06b6d4] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
            Visit Our Clinic &bull; Vadodara, Gujarat
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Find Us in Alkapuri, Vadodara
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Experience painless, luxury dental healthcare in a calm, contemporary architectural setting.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Contact Card & Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ─────────────────────────────────────────────────────────────
              1. CONTACT INFORMATION CARD (5 Cols on Desktop)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-3xl p-6 sm:p-8 lg:p-9 border border-slate-200/90 shadow-md shadow-slate-200/50 flex flex-col justify-between">
            <div>
              {/* Clinic Branding Emblem */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <div className="w-11 h-11 rounded-2xl bg-[#06b6d4] text-white flex items-center justify-center shadow-md shadow-[#06b6d4]/30 shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {clinicName}
                  </h3>
                  <span className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider block">
                    Advanced Cosmetic &amp; Implant Center
                  </span>
                </div>
              </div>

              {/* Location Description */}
              <p className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {locationDescription}
              </p>

              {/* Details List */}
              <div className="mt-6 space-y-4">
                {/* Full Address */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-[#06b6d4] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Clinic Address
                    </span>
                    <span className="block text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
                      {address}
                    </span>
                    <span className="block text-[11px] font-medium text-[#06b6d4] mt-1">
                      Vadodara, Gujarat &bull; Near Inox Alkapuri
                    </span>
                  </div>
                </div>

                {/* Clickable Phone Number */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Direct Appointments Desk
                    </span>
                    <a
                      href={telHref}
                      className="inline-block text-sm font-bold text-slate-900 hover:text-[#06b6d4] transition-colors mt-0.5"
                    >
                      {phone}
                    </a>
                    <span className="block text-[11px] text-emerald-600 font-medium">
                      Call or WhatsApp Available
                    </span>
                  </div>
                </div>

                {/* Clickable Email */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Patient Inquiries
                    </span>
                    <a
                      href={mailtoHref}
                      className="inline-block text-sm font-semibold text-slate-900 hover:text-[#06b6d4] transition-colors mt-0.5"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Consultation Hours
                    </span>
                    <div className="mt-1 space-y-1 text-xs font-medium text-slate-700">
                      <div className="flex justify-between">
                        <span>{hours.weekday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{hours.saturday}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{hours.sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Accreditation Badge & Action Link */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">
                  NABH &bull; IDA Registered Clinic
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Vadodara Central
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. EMBEDDED GOOGLE MAP (7 Cols on Desktop, 16:9, Max-H 500px)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-video max-h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 group">
              <iframe
                title="WE DESIGN SMILES Dental Clinic - Vadodara, Gujarat Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-[1.02] grayscale-[10%] group-hover:grayscale-0 transition-all duration-300"
              />

              {/* Floating Map Label Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/90 shadow-md pointer-events-none flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] animate-ping" />
                <span className="text-xs font-bold text-slate-900">
                  {clinicName} &bull; Vadodara, Gujarat
                </span>
              </div>

              {/* Quick Map Controls Overlay on Hover */}
              <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none">
                <svg className="w-3.5 h-3.5 text-[#06b6d4]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Interactive Map View</span>
              </div>
            </div>

            {/* "Get Directions" Button Opening Google Maps in New Tab */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Need help finding the clinic? Call our concierge or open directions on your phone.
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#06b6d4] hover:bg-[#0891b2] shadow-md shadow-[#06b6d4]/25 hover:shadow-lg hover:shadow-[#06b6d4]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0 w-full sm:w-auto cursor-pointer"
              >
                <span>Get Directions</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
