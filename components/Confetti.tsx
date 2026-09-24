'use client'

import { useEffect, useRef } from 'react'

const possibleColors = [
  'DodgerBlue',
  'OliveDrab',
  'Gold',
  'Pink',
  'SlateBlue',
  'LightBlue',
  'Violet',
  'PaleGreen',
  'SteelBlue',
  'SandyBrown',
  'Chocolate',
  'Crimson',
] as const

const maxConfettis = 150

interface ConfettiProps {
  timeoutSeconds?: number
}

type ConfettiColor = (typeof possibleColors)[number]

class ConfettiParticle {
  x: number
  y: number
  r: number
  d: number
  color: ConfettiColor
  tilt: number
  tiltAngleIncremental: number
  tiltAngle: number

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height - height
    this.r = randomFromTo(11, 33)
    this.d = Math.random() * maxConfettis + 11
    this.color =
      possibleColors[
        Math.floor(Math.random() * possibleColors.length)
      ]
    this.tilt = Math.floor(Math.random() * 33) - 11
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05
    this.tiltAngle = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.lineWidth = this.r / 2
    ctx.strokeStyle = this.color
    ctx.moveTo(this.x + this.tilt + this.r / 3, this.y)
    ctx.lineTo(
      this.x + this.tilt,
      this.y + this.tilt + this.r / 5
    )
    ctx.stroke()
  }
}

function randomFromTo(from: number, to: number) {
  return Math.floor(Math.random() * (to - from + 1) + from)
}

export default function ConfettiCanvas({
  timeoutSeconds = 3,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    const particles: ConfettiParticle[] = Array.from(
      { length: maxConfettis },
      () => new ConfettiParticle(width, height)
    )

    let animationFrameId: number
    let allowRespawn = true

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw)

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.tiltAngle += p.tiltAngleIncremental
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15

        if (p.y > height || p.x > width + 30 || p.x < -30) {
          if (allowRespawn) {
            p.x = Math.random() * width
            p.y = -30
            p.tilt = Math.floor(Math.random() * 10) - 20
          }
        }

        p.draw(ctx)
      }
    }

    draw()

    const timeoutId = window.setTimeout(() => {
      allowRespawn = false
    }, timeoutSeconds * 1000)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [timeoutSeconds])

  return (
    <canvas
      ref={canvasRef}
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
  )
}
