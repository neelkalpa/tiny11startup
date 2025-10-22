"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CompareProps {
  firstImage: string;
  secondImage: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  className?: string;
  slideMode?: "hover" | "click" | "drag";
  autoplay?: boolean;
  autoplayInterval?: number;
}

export function Compare({
  firstImage,
  secondImage,
  firstImageClassName,
  secondImageClassname,
  className,
  slideMode = "hover",
  autoplay = false,
  autoplayInterval = 3000,
}: CompareProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const newPosition = Math.max(0, Math.min(100, percentage));
    
    // Only update if position changed significantly to prevent flickering
    setSliderPosition((prev) => {
      if (Math.abs(prev - newPosition) > 0.5) {
        return newPosition;
      }
      return prev;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (slideMode !== "click" && slideMode !== "drag") return;
    
    setIsDragging(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMoveGlobal = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current || slideMode !== "drag") return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (isDragging && slideMode === "drag") {
      document.addEventListener("mousemove", handleMouseMoveGlobal);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveGlobal);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, slideMode]);

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    // First, pause at 0% for 2 seconds
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      // Start the movement after 2 seconds
      autoplayRef.current = setInterval(() => {
        setSliderPosition((prev) => {
          if (prev >= 100) {
            // Stop the interval when we reach 100
            if (autoplayRef.current) {
              clearInterval(autoplayRef.current);
              autoplayRef.current = null;
            }
            // Set up the pause timeout at 100%
            if (pauseTimeoutRef.current) {
              clearTimeout(pauseTimeoutRef.current);
            }
            pauseTimeoutRef.current = setTimeout(() => {
              setSliderPosition(0);
              // Restart autoplay after reset
              if (autoplay && !isAutoplayPaused) {
                startAutoplay();
              }
            }, 2000);
            return prev;
          }
          return Math.min(prev + 4, 100);
        });
      }, autoplayInterval / 100);
    }, 2000);
  };

  useEffect(() => {
    if (autoplay && !isAutoplayPaused) {
      startAutoplay();
    } else {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isAutoplayPaused]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden select-none cursor-pointer", className)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => {
        setIsHovering(true);
        setIsAutoplayPaused(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsAutoplayPaused(false);
      }}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
    >
      {/* First Image (Background) */}
      <div className="absolute inset-0">
        <img
          src={firstImage}
          alt="Before"
          className={cn("w-full h-full object-cover select-none", firstImageClassName)}
          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', pointerEvents: 'none' }}
          draggable={false}
        />
      </div>

      {/* Second Image (Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={secondImage}
          alt="After"
          className={cn("w-full h-full object-cover select-none", secondImageClassname)}
          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', pointerEvents: 'none' }}
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div
        className="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer flex items-center justify-center select-none"
        style={{ left: `${sliderPosition}%`, userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      >
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
      </div>

      {/* Dynamic Label */}
      {sliderPosition < 50 ? (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          Before
        </div>
      ) : (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          After
        </div>
      )}
    </div>
  );
}
