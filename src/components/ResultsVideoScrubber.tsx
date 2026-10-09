'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface ResultsVideoScrubberProps {
  /** Path to the folder containing extracted frames (default: "/videos/video_2_frames") */
  videoFramePath?: string;
  /** Total count of frames to scrub through (default: 300) */
  totalFrames?: number;
  /** Main overlay title inside the bottom gradient section */
  overlayTitle?: string;
  /** Supporting message text below the title */
  overlayDescription?: string;
  /** Zero-padding length for filenames, e.g. 4 -> "0001" (default: 4) */
  padLength?: number;
  /** Frame image extension, without leading dot (default: "webp") */
  fileExtension?: string;
  /** Prefix for frame images (default: "frame_") */
  fileNamePrefix?: string;
  /** Total scroll height for parallax scrubber track (default: "320vh") */
  scrollTrackHeight?: string;
  /** Optional additional CSS class for root wrapper */
  className?: string;
}

export const ResultsVideoScrubber: React.FC<ResultsVideoScrubberProps> = ({
  videoFramePath = '/videos/video_2_frames',
  totalFrames = 300,
  overlayTitle = 'See Our Smile Transformations - Before & After Results',
  overlayDescription = 'Join hundreds of satisfied patients who achieved their dream smiles.',
  padLength = 4,
  fileExtension = 'webp',
  fileNamePrefix = 'frame_',
  scrollTrackHeight = '320vh',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Frame tracking and progress state
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState<boolean>(false);
  const [loadedFrameCount, setLoadedFrameCount] = useState<number>(0);

  // In-memory cache for loaded frame images
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafIdRef = useRef<number | null>(null);

  /**
   * Helper to construct individual frame asset URL
   */
  const getFrameUrl = useCallback(
    (frameIndex: number): string => {
      const paddedNum = String(frameIndex).padStart(padLength, '0');
      const cleanPath = videoFramePath.replace(/\/+$/, '');
      return `${cleanPath}/${fileNamePrefix}${paddedNum}.${fileExtension}`;
    },
    [videoFramePath, fileNamePrefix, padLength, fileExtension]
  );

  /**
   * Render frame onto the high-resolution canvas with responsive 16:9 object-cover
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imageCacheRef.current.get(frameIndex);
    if (img && img.complete && img.naturalWidth > 0) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, []);

  /**
   * Intersection Observer for lazy loading: only decodes & scrubs when in viewport
   */
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  /**
   * Progressive frame preloading once component is near/in viewport
   */
  useEffect(() => {
    if (!isIntersecting) return;

    let isSubscribed = true;
    const cache = imageCacheRef.current;

    // 1. Instantly load initial frame
    if (!cache.has(1)) {
      const firstImg = new Image();
      firstImg.src = getFrameUrl(1);
      firstImg.onload = () => {
        if (!isSubscribed) return;
        cache.set(1, firstImg);
        setFirstFrameLoaded(true);
        setLoadedFrameCount((prev) => prev + 1);
        drawFrame(1);
      };
    } else {
      setFirstFrameLoaded(true);
      drawFrame(1);
    }

    // 2. High-priority keyframes (every 4th frame)
    const batchPreload = (start: number, end: number, step = 1) => {
      for (let i = start; i <= end; i += step) {
        if (cache.has(i)) continue;
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          if (!isSubscribed) return;
          cache.set(i, img);
          setLoadedFrameCount((prev) => prev + 1);
        };
      }
    };

    batchPreload(2, totalFrames, 4);

    // 3. Idle-load all remaining intermediary frames
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(() => batchPreload(2, totalFrames, 1))
      : setTimeout(() => batchPreload(2, totalFrames, 1), 300);

    return () => {
      isSubscribed = false;
      if (typeof idleId === 'number' && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId as unknown as ReturnType<typeof setTimeout>);
      }
    };
  }, [isIntersecting, getFrameUrl, totalFrames, drawFrame]);

  /**
   * Native 1080p canvas resolution sync
   */
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 1920;
      canvas.height = 1080;
      drawFrame(currentFrame);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, currentFrame]);

  /**
   * Scroll listener: smooth frame advancing without audio
   */
  useEffect(() => {
    if (!isIntersecting) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScrollY = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScrollY / totalScrollableDistance));

      setScrollProgress(progress);

      const targetFrame = Math.min(
        totalFrames,
        Math.max(1, Math.floor(progress * (totalFrames - 1)) + 1)
      );

      if (targetFrame !== currentFrame) {
        setCurrentFrame(targetFrame);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(targetFrame);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isIntersecting, totalFrames, currentFrame, drawFrame]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-neutral-950 ${className}`}
      style={{ height: scrollTrackHeight }}
      aria-label="We Design Smiles Results Gallery Section"
    >
      {/* Subtle Visual Divider & Section Break from Section 1 */}
      <div className="relative z-30 w-full bg-slate-900 border-t border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
              Section 02 &bull; Smile Gallery
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400">
            <span>Treatment Chair &rarr; Results Wall</span>
            <span className="h-3 w-px bg-slate-700" />
            <span>Interactive Scrubber</span>
          </div>
        </div>
      </div>

      {/* Sticky Viewport Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Full-width responsive 16:9 canvas container */}
        <div className="relative w-full h-full max-w-full aspect-video flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-opacity duration-500 ease-out"
            style={{ opacity: firstFrameLoaded ? 1 : 0 }}
          />

          {/* Skeleton placeholder while first frame loads */}
          {!firstFrameLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 animate-pulse text-white/70">
              <div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm tracking-widest uppercase font-medium">
                Loading Results Gallery...
              </p>
            </div>
          )}
        </div>

        {/* Ambient Top Subtle Gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Bottom 15% White Gradient Overlay with 85% opacity */}
        <div className="absolute bottom-0 left-0 right-0 h-[18%] md:h-[20%] bg-gradient-to-t from-white/85 via-white/50 to-transparent pointer-events-none z-20 flex flex-col justify-end">
          {/* Centered responsive typography container */}
          <div className="w-full max-w-6xl mx-auto px-6 pb-6 sm:pb-8 md:pb-10 flex flex-col items-center text-center">
            {/* Gallery Eyebrow Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-emerald-900/10 text-emerald-950 mb-2 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Before &amp; After Showcase
            </span>

            {/* Main Title Overlay */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs">
              {overlayTitle}
            </h2>

            {/* Descriptor Supporting Message */}
            <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-700 max-w-2xl drop-shadow-xs">
              {overlayDescription}
            </p>
          </div>
        </div>

        {/* Subtle Animated Scroll Indicator / Arrow at bottom */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none transition-all duration-500"
          style={{
            opacity: scrollProgress < 0.08 ? 1 : Math.max(0, 1 - (scrollProgress - 0.08) * 8),
            transform: `translate(-50%, ${scrollProgress < 0.08 ? 0 : 12}px)`,
          }}
          aria-hidden="true"
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-600">
            Scroll for Transformations
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-slate-700/60 flex items-start justify-center p-1 backdrop-blur-xs">
            <span className="w-1.5 h-2 bg-slate-800 rounded-full animate-bounce" />
          </div>
          <svg
            className="w-4 h-4 text-slate-700 animate-bounce -mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Micro progress indicator bar at very bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300/30 z-40">
          <div
            className="h-full bg-emerald-600 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(5,150,105,0.8)]"
            style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default ResultsVideoScrubber;
