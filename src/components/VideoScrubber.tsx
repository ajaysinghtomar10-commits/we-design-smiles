'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface VideoScrubberProps {
  /** Path to the folder containing extracted frames (e.g., "/videos/video_1_frames") */
  videoFramePath?: string;
  /** Total count of frames to scrub through */
  totalFrames?: number;
  /** Main hero title inside the bottom overlay */
  overlayTitle?: string;
  /** Descriptor text below the title */
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

export const VideoScrubber: React.FC<VideoScrubberProps> = ({
  videoFramePath = '/videos/video_1_frames',
  totalFrames = 300,
  overlayTitle = 'We Design Smiles - Professional Dental Care',
  overlayDescription = 'Your journey to perfect smiles starts here. Step inside our tranquil Alkapuri, Vadodara clinic.',
  padLength = 4,
  fileExtension = 'webp',
  fileNamePrefix = 'frame_',
  scrollTrackHeight = '320vh',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Minimal state to avoid triggering unnecessary main-thread React re-renders
  const [firstFrameLoaded, setFirstFrameLoaded] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  // References for frame & render tracking
  const currentFrameRef = useRef<number>(1);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeRequestsRef = useRef<Set<number>>(new Set());
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
   * Render frame onto the high-resolution canvas with 16:9 coverage.
   * If exact frame isn't loaded yet, gracefully falls back to closest loaded frame.
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const cache = imageCacheRef.current;
    let img = cache.get(frameIndex);

    // If target frame is still streaming, find closest available frame in cache
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closestFrame = -1;
      let minDiff = Infinity;
      cache.forEach((cachedImg, cachedIdx) => {
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          const diff = Math.abs(cachedIdx - frameIndex);
          if (diff < minDiff) {
            minDiff = diff;
            closestFrame = cachedIdx;
          }
        }
      });
      if (closestFrame !== -1) {
        img = cache.get(closestFrame);
      }
    }

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
   * Load a single frame into memory on demand without flooding network
   */
  const preloadFrame = useCallback(
    (frameIndex: number) => {
      if (frameIndex < 1 || frameIndex > totalFrames) return;
      const cache = imageCacheRef.current;
      if (cache.has(frameIndex) || activeRequestsRef.current.has(frameIndex)) return;

      activeRequestsRef.current.add(frameIndex);
      const img = new Image();
      img.src = getFrameUrl(frameIndex);
      img.onload = () => {
        activeRequestsRef.current.delete(frameIndex);
        cache.set(frameIndex, img);
        if (currentFrameRef.current === frameIndex) {
          drawFrame(frameIndex);
        }
      };
      img.onerror = () => {
        activeRequestsRef.current.delete(frameIndex);
      };
    },
    [totalFrames, getFrameUrl, drawFrame]
  );

  /**
   * Intersection Observer: only active when within viewport
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
        rootMargin: '100px 0px',
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  /**
   * Window resize handler
   */
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 1920;
      canvas.height = 1080;
      drawFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  /**
   * On-demand initial load: only fetch Frame 1 initially for lightning-fast LCP & zero TBT.
   */
  useEffect(() => {
    if (!isIntersecting) return;

    const cache = imageCacheRef.current;
    if (!cache.has(1)) {
      const firstImg = new Image();
      firstImg.src = getFrameUrl(1);
      firstImg.onload = () => {
        cache.set(1, firstImg);
        setFirstFrameLoaded(true);
        drawFrame(1);

        // Preload immediate small buffer (frames 2-5) for seamless initial scroll
        for (let i = 2; i <= Math.min(5, totalFrames); i++) {
          preloadFrame(i);
        }
      };
    } else {
      setFirstFrameLoaded(true);
      drawFrame(currentFrameRef.current);
    }
  }, [isIntersecting, getFrameUrl, totalFrames, drawFrame, preloadFrame]);

  /**
   * Window Scroll listener: smoothly maps container scroll position to frame sequence
   * Uses sliding window frame loading to eliminate main-thread congestion.
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

      const currentScrollOffset = -rect.top;
      const progress = Math.min(Math.max(currentScrollOffset / totalScrollableDistance, 0), 1);

      // Direct DOM updates for progress bar & scroll indicator (prevents React re-renders)
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }
      if (scrollIndicatorRef.current) {
        const isEarly = progress < 0.08;
        scrollIndicatorRef.current.style.opacity = isEarly
          ? '1'
          : `${Math.max(0, 1 - (progress - 0.08) * 8)}`;
        scrollIndicatorRef.current.style.transform = `translate(-50%, ${isEarly ? 0 : 12}px)`;
      }

      // Compute frame index
      const targetFrame = Math.min(
        totalFrames,
        Math.max(1, Math.floor(progress * (totalFrames - 1)) + 1)
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(targetFrame);
        });

        // Preload sliding window (next 8 frames, previous 3 frames)
        const forwardEnd = Math.min(totalFrames, targetFrame + 8);
        for (let f = targetFrame; f <= forwardEnd; f++) {
          preloadFrame(f);
        }
        const backwardEnd = Math.max(1, targetFrame - 3);
        for (let b = targetFrame - 1; b >= backwardEnd; b--) {
          preloadFrame(b);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isIntersecting, totalFrames, drawFrame, preloadFrame]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-neutral-950 ${className}`}
      style={{ height: scrollTrackHeight }}
      aria-label="We Design Smiles Walkthrough Hero Section"
    >
      {/* Sticky viewport-filling video container */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Full-width responsive 16:9 canvas */}
        <div className="relative w-full h-full max-w-full aspect-video flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-opacity duration-500 ease-out"
            style={{ opacity: firstFrameLoaded ? 1 : 0 }}
          />

          {/* Skeleton placeholder while first frame loads */}
          {!firstFrameLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 animate-pulse text-white/70">
              <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm tracking-widest uppercase font-medium">
                Loading Clinic Experience...
              </p>
            </div>
          )}
        </div>

        {/* Ambient Top Subtle Vignette */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Bottom 15% White Gradient Overlay with 85% opacity */}
        <div className="absolute bottom-0 left-0 right-0 h-[18%] md:h-[20%] bg-gradient-to-t from-white/85 via-white/50 to-transparent pointer-events-none z-20 flex flex-col justify-end">
          {/* Centered responsive typography container */}
          <div className="w-full max-w-6xl mx-auto px-6 pb-6 sm:pb-8 md:pb-10 flex flex-col items-center text-center">
            {/* Clinic Eyebrow Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-cyan-900/10 text-cyan-900 mb-2 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-ping" />
              Cinematic Walkthrough
            </span>

            {/* Main Title Overlay */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs">
              {overlayTitle}
            </h1>

            {/* Descriptor Subtext */}
            <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-700 max-w-2xl drop-shadow-xs">
              {overlayDescription}
            </p>
          </div>
        </div>

        {/* Subtle Animated Scroll Indicator / Arrow at bottom */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none transition-all duration-300"
          aria-hidden="true"
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-600">
            Scroll to Explore
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

        {/* Subtle progress indicator bar at very bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300/30 z-40">
          <div
            ref={progressBarRef}
            className="h-full bg-cyan-600 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(8,145,178,0.8)]"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoScrubber;
