"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface Milestone {
  year: string
  title: string
  description: string
}

interface KalawaTimelineProps {
  milestones: Milestone[]
}

/* ---- Decorative SVG: tied kalawa knot icon ---- */
function KalawaKnot({ active, size = 40 }: { active: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-700 ease-out"
      style={{ transform: active ? "scale(1)" : "scale(0.7)" }}
    >
      {/* outer ring */}
      <circle
        cx="20"
        cy="20"
        r="17"
        stroke={active ? "#A03A13" : "#E8D5C4"}
        strokeWidth="1.5"
        fill="none"
        className="transition-all duration-700"
      />
      {/* pulsing ring when active */}
      {active && (
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="#F8843F"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
          className="animate-[ping_2.5s_ease-in-out_infinite]"
        />
      )}
      {/* inner filled circle */}
      <circle
        cx="20"
        cy="20"
        r="8"
        fill={active ? "#A03A13" : "#E8D5C4"}
        className="transition-all duration-700"
      />
      {/* center dot */}
      <circle
        cx="20"
        cy="20"
        r="3"
        fill={active ? "#F8843F" : "#D2B48C"}
        className="transition-all duration-700"
      />
      {/* cross threads through knot */}
      <line
        x1="8"
        y1="20"
        x2="32"
        y2="20"
        stroke={active ? "#F8843F" : "#D2B48C"}
        strokeWidth="1"
        opacity="0.5"
        className="transition-all duration-700"
      />
      <line
        x1="20"
        y1="8"
        x2="20"
        y2="32"
        stroke={active ? "#F8843F" : "#D2B48C"}
        strokeWidth="1"
        opacity="0.5"
        className="transition-all duration-700"
      />
    </svg>
  )
}

/* ---- Milestone popup card with reveal animation ---- */
function MilestoneCard({
  milestone,
  index,
  isLeft,
  isRevealed,
}: {
  milestone: Milestone
  index: number
  isLeft: boolean
  isRevealed: boolean
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border bg-card shadow-sm
        transition-all duration-700 ease-out
        ${isRevealed
          ? "translate-y-0 scale-100 opacity-100 border-[var(--color-saffron)]/30"
          : `${isLeft ? "-translate-x-12" : "translate-x-12"} translate-y-6 scale-95 opacity-0 border-border`
        }
      `}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Kalawa thread accent - animated top bar */}
      <div className="relative h-[3px] overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-deep-maroon)] transition-all duration-1000 ease-out"
          style={{ width: isRevealed ? "100%" : "0%" }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-saffron)] transition-all duration-1200 ease-out delay-200"
          style={{ width: isRevealed ? "60%" : "0%", opacity: 0.5 }}
        />
      </div>

      <div className="p-6">
        {/* Year with reveal pop */}
        <div
          className={`
            flex items-center gap-2 transition-all duration-500
            ${isLeft ? "md:justify-end" : "md:justify-start"}
            ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
          style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-2xl font-bold text-primary">{milestone.year}</span>
        </div>

        {/* Title */}
        <h3
          className={`
            mt-3 font-serif text-lg font-semibold text-foreground
            transition-all duration-500
            ${isLeft ? "md:text-right" : "md:text-left"}
            ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
          style={{ transitionDelay: isRevealed ? "300ms" : "0ms" }}
        >
          {milestone.title}
        </h3>

        {/* Description */}
        <p
          className={`
            mt-2 text-sm leading-relaxed text-muted-foreground
            transition-all duration-500
            ${isLeft ? "md:text-right" : "md:text-left"}
            ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
          style={{ transitionDelay: isRevealed ? "400ms" : "0ms" }}
        >
          {milestone.description}
        </p>

        {/* Decorative thread at bottom */}
        <div
          className={`
            mt-4 flex items-center gap-1.5
            ${isLeft ? "md:justify-end" : "md:justify-start"}
          `}
          aria-hidden="true"
        >
          <span className="h-px w-6 bg-[var(--color-deep-maroon)]/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <span className="h-px w-10 bg-[var(--color-saffron)]/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-secondary/40" />
          <span className="h-px w-6 bg-[var(--color-deep-maroon)]/30" />
        </div>
      </div>
    </div>
  )
}

/* ---- Mobile milestone card ---- */
function MobileMilestoneCard({
  milestone,
  index,
  isRevealed,
}: {
  milestone: Milestone
  index: number
  isRevealed: boolean
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border bg-card shadow-sm
        transition-all duration-600 ease-out
        ${isRevealed ? "translate-y-0 scale-100 opacity-100 border-[var(--color-saffron)]/30" : "translate-y-8 scale-95 opacity-0 border-border"}
      `}
    >
      {/* top thread */}
      <div className="relative h-[3px] overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-deep-maroon)] transition-all duration-1000 ease-out"
          style={{ width: isRevealed ? "100%" : "0%" }}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-xl font-bold text-primary">{milestone.year}</span>
        </div>
        <h3 className="mt-2 font-serif text-base font-semibold text-foreground">
          {milestone.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {milestone.description}
        </p>
      </div>
    </div>
  )
}

/* ---- Main Timeline Component ---- */
export default function KalawaTimeline({ milestones }: KalawaTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([])

  /* --- Scroll progress: 0 at section top entering viewport, 1 when last milestone hits mid-screen --- */
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const windowH = window.innerHeight

    // Progress starts when the container top reaches the bottom of the viewport
    // Progress hits 1.0 when the container bottom reaches the vertical center of viewport
    const start = rect.top - windowH
    const end = rect.bottom - windowH * 0.5

    const range = end - start
    if (range <= 0) return

    const raw = (0 - start) / range
    const clamped = Math.max(0, Math.min(1, raw))

    setProgress(clamped)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [handleScroll])

  /* --- IntersectionObserver for card reveals --- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"))
            if (!isNaN(idx)) {
              setRevealedCards((prev) => {
                const next = new Set(prev)
                next.add(idx)
                return next
              })
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    mobileCardRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [milestones.length])

  const count = milestones.length

  /* --- Desktop SVG zig-zag path --- */
  // viewBox coords: width 1000, dynamic height
  const VB_W = 1000
  const ROW_H = 260
  const PAD_TOP = 30
  const SVG_H = PAD_TOP + ROW_H * (count - 1) + 30

  // node x positions: alternate left (200) and right (800)
  const nodes = milestones.map((_, i) => ({
    x: i % 2 === 0 ? 200 : 800,
    y: PAD_TOP + i * ROW_H,
  }))

  // build smooth cubic bezier path through nodes
  let d = `M ${nodes[0].x} ${nodes[0].y}`
  for (let i = 0; i < nodes.length - 1; i++) {
    const c = nodes[i]
    const n = nodes[i + 1]
    const midY = (c.y + n.y) / 2
    d += ` C ${c.x} ${midY}, ${n.x} ${midY}, ${n.x} ${n.y}`
  }

  /* --- Mobile SVG vertical zig-zag path --- */
  const M_VB_W = 60
  const M_ROW_H = 40
  const M_PAD = 10
  const M_SVG_H = M_PAD * 2 + M_ROW_H * (count - 1)

  const mobileNodes = milestones.map((_, i) => ({
    x: i % 2 === 0 ? 20 : 40,
    y: M_PAD + i * M_ROW_H,
  }))

  let mobileD = `M ${mobileNodes[0].x} ${mobileNodes[0].y}`
  for (let i = 0; i < mobileNodes.length - 1; i++) {
    const c = mobileNodes[i]
    const n = mobileNodes[i + 1]
    const midY = (c.y + n.y) / 2
    mobileD += ` C ${c.x} ${midY}, ${n.x} ${midY}, ${n.x} ${n.y}`
  }

  return (
    <div ref={containerRef} className="relative">
      {/* ======================== DESKTOP LAYOUT ======================== */}
      <div className="hidden md:block">
        <div className="relative" style={{ minHeight: `${ROW_H * (count - 1) + 120}px` }}>
          {/* SVG thread layer */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <svg
              viewBox={`0 0 ${VB_W} ${SVG_H}`}
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full"
            >
              <defs>
                <filter id="k-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Ghost path - full thread faded */}
              <path
                d={d}
                fill="none"
                stroke="#E8D5C4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 6"
                opacity="0.4"
              />

              {/* Glow behind active thread */}
              <ThreadPath
                d={d}
                progress={progress}
                stroke="#F8843F"
                strokeWidth={8}
                opacity={0.1}
                filter="url(#k-glow)"
              />

              {/* Primary thread - deep maroon */}
              <ThreadPath
                d={d}
                progress={progress}
                stroke="#A03A13"
                strokeWidth={3.5}
                opacity={1}
              />

              {/* Secondary thread - saffron accent for twist effect */}
              <ThreadPath
                d={d}
                progress={progress}
                stroke="#F8843F"
                strokeWidth={1.5}
                opacity={0.5}
                dashPattern="12 8"
              />

              {/* Knot circles at each node */}
              {nodes.map((pos, i) => {
                const nodeThreshold = count > 1 ? i / (count - 1) : 0
                const isActive = progress >= nodeThreshold * 0.95
                return (
                  <g key={i}>
                    {isActive && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="18"
                        fill="none"
                        stroke="#F8843F"
                        strokeWidth="1"
                        opacity="0.3"
                        className="animate-[ping_3s_ease-in-out_infinite]"
                      />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 10 : 7}
                      fill={isActive ? "#A03A13" : "#F5EDE6"}
                      stroke={isActive ? "#F8843F" : "#D2B48C"}
                      strokeWidth={isActive ? 2 : 1.5}
                      className="transition-all duration-700"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 4 : 3}
                      fill={isActive ? "#F8843F" : "#D2B48C"}
                      className="transition-all duration-700"
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Milestone cards positioned in the grid */}
          <div className="relative flex flex-col" style={{ gap: `${ROW_H - 180}px` }}>
            {milestones.map((milestone, i) => {
              const isLeft = i % 2 === 0
              const isRevealed = revealedCards.has(i)

              return (
                <div
                  key={milestone.year}
                  ref={(el) => { cardRefs.current[i] = el }}
                  data-idx={i}
                  className={`flex items-start ${isLeft ? "justify-start" : "justify-end"}`}
                >
                  <div className={`w-[38%] ${isLeft ? "pr-6" : "pl-6"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {isLeft && <div className="flex-1" />}
                      <KalawaKnot active={isRevealed} size={36} />
                      {!isLeft && <div className="flex-1" />}
                    </div>
                    <MilestoneCard
                      milestone={milestone}
                      index={i}
                      isLeft={isLeft}
                      isRevealed={isRevealed}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ======================== MOBILE LAYOUT ======================== */}
      <div className="block md:hidden">
        <div className="relative">
          {/* Mobile SVG zig-zag thread on the left */}
          <div className="pointer-events-none absolute left-4 top-0 bottom-0 w-[60px]" aria-hidden="true">
            <svg
              viewBox={`0 0 ${M_VB_W} ${M_SVG_H}`}
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              {/* ghost */}
              <path
                d={mobileD}
                fill="none"
                stroke="#E8D5C4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 4"
                opacity="0.4"
              />
              {/* active thread */}
              <ThreadPath
                d={mobileD}
                progress={progress}
                stroke="#A03A13"
                strokeWidth={2.5}
                opacity={1}
              />
              {/* accent */}
              <ThreadPath
                d={mobileD}
                progress={progress}
                stroke="#F8843F"
                strokeWidth={1}
                opacity={0.5}
                dashPattern="8 6"
              />
              {/* nodes */}
              {mobileNodes.map((pos, i) => {
                const nodeThreshold = count > 1 ? i / (count - 1) : 0
                const isActive = progress >= nodeThreshold * 0.95
                return (
                  <g key={i}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 5 : 3.5}
                      fill={isActive ? "#A03A13" : "#F5EDE6"}
                      stroke={isActive ? "#F8843F" : "#D2B48C"}
                      strokeWidth={isActive ? 1.5 : 1}
                      className="transition-all duration-500"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 2 : 1.5}
                      fill={isActive ? "#F8843F" : "#D2B48C"}
                      className="transition-all duration-500"
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Mobile cards stacked */}
          <div className="flex flex-col gap-8 pl-20 pr-2">
            {milestones.map((milestone, i) => {
              const isRevealed = revealedCards.has(i)
              return (
                <div
                  key={milestone.year}
                  ref={(el) => { mobileCardRefs.current[i] = el }}
                  data-idx={i}
                >
                  <MobileMilestoneCard
                    milestone={milestone}
                    index={i}
                    isRevealed={isRevealed}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ======================== PROGRESS BAR (bottom) ======================== */}
      <div className="mt-12 flex flex-col items-center gap-3" aria-hidden="true">
        {/* progress dots */}
        <div className="flex items-center gap-2">
          {milestones.map((_, i) => {
            const nodeThreshold = count > 1 ? i / (count - 1) : 0
            const isActive = progress >= nodeThreshold * 0.95
            return (
              <span
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  backgroundColor: isActive ? "#F8843F" : "#D2B48C",
                }}
              />
            )
          })}
        </div>
        {/* progress bar */}
        <div className="h-1 w-32 overflow-hidden rounded-full bg-[var(--color-sandal)]/30">
          <div
            className="h-full rounded-full bg-[var(--color-deep-maroon)] transition-all duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {Math.round(progress * 100)}% of our journey
        </p>
      </div>
    </div>
  )
}

/* ---- Reusable animated thread path ---- */
function ThreadPath({
  d,
  progress,
  stroke,
  strokeWidth,
  opacity,
  filter,
  dashPattern,
}: {
  d: string
  progress: number
  stroke: string
  strokeWidth: number
  opacity: number
  filter?: string
  dashPattern?: string
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const maskPathRef = useRef<SVGPathElement>(null)
  const idRef = useRef(`tp-${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    const maskPath = maskPathRef.current
    if (!maskPath) return
    const len = maskPath.getTotalLength()
    maskPath.style.strokeDasharray = `${len}`
    maskPath.style.strokeDashoffset = `${len * (1 - progress)}`
  }, [progress])

  return (
    <g>
      <defs>
        <mask id={idRef.current} suppressHydrationWarning>
          <path
            ref={maskPathRef}
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.25s ease-out" }}
          />
        </mask>
      </defs>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        filter={filter}
        strokeDasharray={dashPattern || "none"}
        mask={`url(#${idRef.current})`}
      />
    </g>
  )
}
