import type { Metadata } from "next"
import Image from "next/image"
import { Eye, Heart, Target, Sparkles } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import AnimatedSection from "@/components/AnimatedSection"
import KalawaTimeline from "@/components/KalawaTimeline"

export const metadata: Metadata = {
  title: "About Us - Mafroosh",
  description:
    "Discover Mafroosh's journey of bringing premium home decor and furniture to Indian homes with elegance and quality craftsmanship.",
}

const milestones = [
  {
    year: "2015",
    title: "The Beginning",
    description:
      "Founded with a vision to bring premium, curated home decor and furniture to Indian homes with international quality standards.",
  },
  {
    year: "2018",
    title: "Expanding Collections",
    description:
      "Grew our product line to 500+ decor pieces and furniture, partnering with renowned artisans and designers from across India.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description:
      "Launched our comprehensive online store, making premium home decor accessible to design-conscious customers across the country.",
  },
  {
    year: "2023",
    title: "Trust of Thousands",
    description:
      "Served over 30,000 happy customers with our commitment to quality, design excellence, and outstanding customer service.",
  },
  {
    year: "2025",
    title: "A Premier Home Decor Brand",
    description:
      "Recognized as one of India's leading home decor and furniture brands, with nationwide delivery and premium experience.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Our Mission",
    description:
      "To transform Indian homes with premium decor and furniture that blends aesthetic beauty with functional excellence, making luxury accessible.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To be India's leading home decor and furniture brand, recognized for design innovation, quality craftsmanship, and customer delight.",
  },
  {
    icon: Target,
    title: "Our Values",
    description:
      "Quality, elegance, sustainability, and integrity guide every decision. We stand for honest craftsmanship and exceptional value.",
  },
  {
    icon: Sparkles,
    title: "Our Commitment",
    description:
      "We are dedicated to sourcing sustainable materials, supporting local artisans, and creating spaces that inspire and comfort families across India.",
  },
]

export default function AboutPage() {
  return (
    <>
      <HeroSection
        title="Crafting Beautiful Homes"
        subtitle="From a vision of elegance to homes across India, Mafroosh brings premium decor and timeless design to every space."
      />

      {/* Story Section */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/about-store.jpg"
                  alt="Inside our premium home decor and furniture store"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Our Story
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
                Where Design Meets Soul
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Mafroosh was born from a passion for transforming living spaces. What began as a
                curated collection of handpicked decor pieces and furniture has grown into a trusted brand
                serving discerning customers across India.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Our founder believed that every home tells a story, and the right decor can make that story
                beautiful. We collaborate with master artisans, sustainable material suppliers, and visionary
                designers to create pieces that add character and warmth to every space.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                From statement furniture to subtle decorative accents, every piece in our collection is crafted
                with meticulous attention to detail, ensuring that your home becomes a reflection of your unique
                style and personality.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              What Drives Us
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Our Philosophy and Commitment
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 100}>
                <div className="flex gap-6 rounded-xl bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Kalawa / Raksha Sutra */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Timeline
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Milestones of Craftsmanship
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Like the sacred kalawa (raksha sutra) tied to protect and bless, our journey
              is an unbroken thread of dedication connecting every milestone with passion.
            </p>
          </AnimatedSection>

          <div className="mt-14">
            <KalawaTimeline milestones={milestones} />
          </div>
        </div>
      </section>
    </>
  )
}