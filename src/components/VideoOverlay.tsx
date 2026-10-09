'use client';

import React from 'react';

export interface VideoOverlayProps {
  /** Primary title text (or 'text') */
  text?: string;
  /** Primary title text (alias for 'text') */
  title?: string;
  /** Descriptor / supporting message */
  description?: string;
  /** Optional badge / eyebrow text */
  badgeText?: string;
  /** Optional custom class name */
  className?: string;
  /** Optional children for custom CTA buttons or extra content */
  children?: React.ReactNode;
}

/**
 * Reusable white gradient overlay component for dental clinic video scrubbers.
 * Layers a bottom 15% - 20% gradient (85% opacity to transparent) with
 * high-contrast, responsive typography.
 */
export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  text,
  title,
  description,
  badgeText = 'Clinic Environment',
  className = '',
  children,
}) => {
  const displayTitle = text || title || 'Professional Clinic Design - Built for Your Comfort';
  const displayDescription =
    description || 'Every space designed for your peace of mind.';

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[18%] md:h-[20%] bg-gradient-to-t from-white/85 via-white/50 to-transparent pointer-events-none z-20 flex flex-col justify-end ${className}`}
      aria-label="Video text overlay"
    >
      <div className="w-full max-w-6xl mx-auto px-6 pb-6 sm:pb-8 md:pb-10 flex flex-col items-center text-center">
        {/* Subtle Clinic Eyebrow Badge */}
        {badgeText && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-indigo-900/10 text-indigo-950 mb-2 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            {badgeText}
          </span>
        )}

        {/* Main Heading Overlay */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs leading-tight">
          {displayTitle}
        </h2>

        {/* Supporting Subtext */}
        <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-700 max-w-2xl drop-shadow-xs leading-relaxed">
          {displayDescription}
        </p>

        {children}
      </div>
    </div>
  );
};

export default VideoOverlay;
