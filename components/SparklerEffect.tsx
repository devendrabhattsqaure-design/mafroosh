"use client"

import { useEffect, useRef } from "react"
import Lottie from "lottie-react"
import sparkle from "./sparkle.json"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: string
}

interface SparklerEffectProps {
  isActive: boolean
  x?: number
  y?: number
}

export default function SparklerEffect({
  isActive,
  x = 0,
  y = 0,
}: SparklerEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create sparkle particles
    const particleCount = 40
    const colors = [
      "#8B3A3A", // burgundy
      "#C9A961", // gold
      "#D4AF37", // golden
      "#A85C5C", // rose burgundy
      "#E8D7B8", // cream
    ]

    const createParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        const velocity = 2 + Math.random() * 4
        particlesRef.current.push({
          x: x || window.innerWidth / 2,
          y: y || window.innerHeight / 2,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2,
          life: 1,
          maxLife: 1,
          size: 3 + Math.random() * 3,
          hue: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    createParticles()

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life -= 0.02
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // gravity

        if (particle.life > 0) {
          ctx.globalAlpha = particle.life
          ctx.fillStyle = particle.hue
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          return true
        }
        return false
      })

      ctx.globalAlpha = 1

      if (particlesRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(animate)
      }
    }

    animationIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isActive, x, y])

  if (!isActive) return null

   return (
    <div className="absolute top-0 right-0 w-40 pointer-events-none">
      <Lottie
        animationData={sparkle}
        loop={false}
        autoplay={true}
      />
    </div>
  );
}
