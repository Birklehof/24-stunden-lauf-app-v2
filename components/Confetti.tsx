'use client';

import { useEffect, useMemo, useRef } from 'react';

const possibleColors = [
  'DodgerBlue',
  'OliveDrab',
  'Gold',
  'Pink',
  'SlateBlue',
  'LightBlue',
  'Gold',
  'Violet',
  'PaleGreen',
  'SteelBlue',
  'SandyBrown',
  'Chocolate',
  'Crimson',
];
const maxConfettis = 150;

interface ConfettiProps {
  timeoutSeconds?: number;
}

const ConfettiCanvas = ({ timeoutSeconds = 3 }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);  
  const particles: any[] = useMemo(() => [], []);

  const randomFromTo = (from: number, to: number) => {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    canvas.width = W;
    canvas.height = H;

    class ConfettiParticle {
      x: number;
      y: number;
      r: number;
      d: number;
      color: string;
      tilt: number;
      tiltAngleIncremental: number;
      tiltAngle: number;

      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H - H;
        this.r = randomFromTo(11, 33);
        this.d = Math.random() * maxConfettis + 11;
        this.color =
          possibleColors[Math.floor(Math.random() * possibleColors.length)];
        this.tilt = Math.floor(Math.random() * 33) - 11;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + this.r / 3, this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        ctx.stroke();
      }
    }

    const particles: ConfettiParticle[] = [];

    for (let i = 0; i < maxConfettis; i++) {
      particles.push(new ConfettiParticle());
    }

    let animationFrameId: number;
    let allowRespawn = true;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      context.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.draw(context);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

        if (p.y > H || p.x > W + 30 || p.x < -30) {
          if (allowRespawn) {
            // Recycle offscreen particles only during active animation
            p.x = Math.random() * W;
            p.y = -30;
            p.tilt = Math.floor(Math.random() * 10) - 20;
          }
          // else: let it fall away
        }
      }
    };

    draw();

    // After 30 seconds, stop recycling particles
    const timeoutId = setTimeout(() => {
      allowRespawn = false;
    }, timeoutSeconds * 1000);

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [timeoutSeconds, particles]);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default ConfettiCanvas;
