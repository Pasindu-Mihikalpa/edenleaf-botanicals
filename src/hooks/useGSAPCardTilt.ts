import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glow?: boolean;
}

export const useGSAPCardTilt = <T extends HTMLElement>(options: TiltOptions = {}) => {
  const elementRef = useRef<T>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const {
    maxTilt = 12,
    perspective = 1000,
    scale = 1.02,
    glow = true
  } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Initialize GSAP transforms
    gsap.set(el, {
      transformPerspective: perspective,
      transformStyle: 'preserve-3d'
    });

    const xTo = gsap.quickTo(el, 'rotateY', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'rotateX', { duration: 0.4, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.3, ease: 'power2.out' });

    let glowXTo: ((value: number) => void) | null = null;
    let glowYTo: ((value: number) => void) | null = null;
    let glowOpacityTo: ((value: number) => void) | null = null;

    if (glow && glowRef.current) {
      glowXTo = gsap.quickTo(glowRef.current, 'x', { duration: 0.2, ease: 'power2.out' });
      glowYTo = gsap.quickTo(glowRef.current, 'y', { duration: 0.2, ease: 'power2.out' });
      glowOpacityTo = gsap.quickTo(glowRef.current, 'opacity', { duration: 0.3, ease: 'power2.out' });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      const normX = (relX / rect.width) * 2 - 1;
      const normY = (relY / rect.height) * 2 - 1;

      // Rotate calculations
      xTo(normX * maxTilt);
      yTo(-normY * maxTilt);
      scaleTo(scale);

      if (glow && glowRef.current && glowXTo && glowYTo && glowOpacityTo) {
        glowXTo(relX - 100);
        glowYTo(relY - 100);
        glowOpacityTo(0.6);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      scaleTo(1);
      if (glow && glowRef.current && glowOpacityTo) {
        glowOpacityTo(0);
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
      if (glowRef.current) gsap.killTweensOf(glowRef.current);
    };
  }, [maxTilt, perspective, scale, glow]);

  return { elementRef, glowRef };
};

