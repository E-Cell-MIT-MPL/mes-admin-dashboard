"use client";

import React, { useEffect, useRef, useState, useId } from 'react';

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  className?: string;
  style?: React.CSSProperties;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = "fit-content",
  height = "fit-content",
  borderRadius = 40,
  borderWidth = 0.5,
  brightness = 100, // Adjusted for dark mode pop
  opacity = 0.5,
  blur = 20, // Higher blur for that "TripGlide" premium feel
  displace = 0,
  backgroundOpacity = 0.1,
  saturation = 1.2,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  mixBlendMode = 'normal',
  className = '',
  style = {}
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  
  const [svgSupported, setSvgSupported] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSvgSupported(
        typeof CSS !== 'undefined' && 
        CSS.supports('backdrop-filter', 'blur(10px)')
    );
  }, []);

  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles = {
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: `${borderRadius}px`,
    };

    // Modern browser support (Chrome/Safari/Edge)
    return {
        ...baseStyles,
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: `blur(${blur}px) saturate(${saturation})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
        border: `1px solid rgba(255, 255, 255, ${borderWidth})`,
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${className}`}
      style={getContainerStyles()}
    >
      {children}
    </div>
  );
};

export default GlassSurface;