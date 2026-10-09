'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoOverlay, VideoOverlayProps } from './VideoOverlay';

export interface VideoSection3Props {
  /** Path to extracted frames directory (default: "/videos/video_3_frames") */
  videoFramePath?: string;
  /** Total count of frames in sequence (default: 299) */
  totalFrames?: number;
  /** Main overlay text / title */
  overlayText?: string;
  /** Subtext description below title */
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

export const VideoSection3: React.FC<VideoSection3Props> = ({
  videoFramePath = '/videos/video_3_frames',
  totalFrames = 299,
  overlayText = 'Professional Clinic Design - Built for Your Comfort',
  overlayDescription = 'Every space designed for your peace of mind.',
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
   * High-performance 16:9 canvas rendering with object-cover aspect centering
   * Gracefully falls back to closest loaded frame if requested frame is streaming.
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
   * Intersection Observer for lazy loading: decodes only when in view
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
   * Native 1080p canvas resolution sync
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
   * Progressive frame preloading once near or inside viewport
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

        // Preload immediate small buffer (frames 2-5)
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

      // Direct DOM updates for progress bar & scroll indicator
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

      // Compute targeted frame
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
      aria-label="We Design Smiles Clinic Continuity Walkthrough Section"
    >
      {/* Visual Divider & Breathing Room between Section 2 and Section 3 */}
      <div className="relative z-30 w-full bg-slate-900 border-t border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
              Section 03 &bull; Clinic Continuity
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400">
            <span>Patient Area &rarr; Active Clinic Flow</span>
            <span className="h-3 w-px bg-slate-700" />
            <span>Interactive Parallax Scrubber</span>
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
              <div className="w-12 h-12 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm tracking-widest uppercase font-medium">
                Loading Clinic Continuity Walkthrough...
              </p>
            </div>
          )}
        </div>

        {/* Ambient Top Subtle Gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Reusable VideoOverlay Child Component */}
        <VideoOverlay
          text={overlayText}
          description={overlayDescription}
          badgeText="Atmosphere & Design"
        />

        {/* Subtle Animated Scroll Indicator / Arrow at bottom */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none transition-all duration-300"
          aria-hidden="true"
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-600">
            Scroll for Clinic Flow
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
            ref={progressBarRef}
            className="h-full bg-indigo-600 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(79,70,229,0.8)]"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </section>
  );
};

// Re-export VideoOverlay for easy unified import
export { VideoOverlay };
export type { VideoOverlayProps };

export default VideoSection3;
