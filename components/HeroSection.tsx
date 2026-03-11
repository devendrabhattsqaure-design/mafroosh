interface HeroSectionProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  size?: "default" | "large"
  videoSrc?: string 
  videoType?: "mp4" | "webm" | "ogg" 
  overlayOpacity?: number 
}

export default function HeroSection({
  title,
  subtitle,
  children,
  size = "default",
  videoSrc,
  videoType = "mp4",
  overlayOpacity = 0, 
}: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-secondary ${
        size === "large" ? "py-28 md:py-40" : "py-20 md:py-28"
      }`}
    >
      {/* Video Background */}
      {videoSrc ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type={`video/${videoType}`} />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay to ensure text readability */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      ) : (
        /* Original animated background - only shows if no video */
        <>
          {/* Animated Elegant Background - creates video-like effect */}
          <div className="pointer-events-none absolute inset-0 animate-elegant-flow opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-burgundy)]/20 via-transparent to-[var(--color-deep-burgundy)]/10" />
          </div>

          {/* Floating light elements - video-like aesthetic */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-[var(--color-gold)]/30 to-transparent rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-[var(--color-burgundy)]/20 to-transparent rounded-full blur-3xl animate-float-slower" />
          </div>
        </>
      )}

      {/* Decorative elements - shown in both modes but with adjusted opacity for video */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute left-10 top-10 h-24 w-24 rounded-full bg-primary/10 animate-pulse ${videoSrc ? 'opacity-30' : ''}`} />
        <div className={`absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary/5 animate-pulse ${videoSrc ? 'opacity-30' : ''}`} style={{ animationDelay: "1s" }} />
        <div className={`absolute right-1/4 top-1/3 h-16 w-16 rounded-full bg-[var(--color-gold)]/10 animate-pulse ${videoSrc ? 'opacity-30' : ''}`} style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center z-10">
        <h1
          className={`animate-fade-in-up font-serif font-bold text-balance text-[var(--color-gold)] ${
            size === "large"
              ? "text-4xl md:text-6xl lg:text-7xl"
              : "text-3xl md:text-5xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-in-up-delay-1 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-secondary-foreground/80 md:text-xl">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="animate-fade-in-up-delay-2 mt-10">{children}</div>
        )}
      </div>
    </section>
  )
}
