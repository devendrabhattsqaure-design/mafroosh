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
      className={`relative overflow-hidden bg-primary ${
        size === "large" ? "py-32 md:py-48" : "py-24 md:py-32"
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
          {/* Subtle gradient overlay for better text contrast */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
          />
        </div>
      ) : (
        /* Original animated background - only shows if no video */
        <div className="absolute inset-0 bg-primary">
          {/* Animated Elegant Background */}
          <div className="pointer-events-none absolute inset-0 animate-elegant-flow opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-black/30" />
          </div>

          {/* Floating light elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-secondary/10 to-transparent rounded-full blur-3xl animate-float-slower" />
          </div>
        </div>
      )}

      {/* Modern minimalist decorative elements */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute left-10 top-10 h-32 w-32 border border-secondary/30 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 h-48 w-48 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center z-10 flex flex-col items-center">
        <div className="mb-8 overflow-hidden">
           <span className="inline-block px-5 py-2 rounded-none border border-secondary/40 text-secondary text-[10px] font-bold uppercase tracking-[0.4em] animate-fade-in-up">
              The Art of Living
           </span>
        </div>
        <h1
          className={`animate-fade-in-up font-serif font-medium text-balance text-white leading-[1.05] tracking-tight ${
            size === "large"
              ? "text-6xl md:text-8xl lg:text-9xl"
              : "text-5xl md:text-7xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-in-up-delay-1 mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl font-light tracking-wide">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="animate-fade-in-up-delay-2 mt-16 w-full">{children}</div>
        )}
      </div>
    </section>
  )
}
