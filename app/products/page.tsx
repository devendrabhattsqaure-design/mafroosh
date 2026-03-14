import type { Metadata } from "next"
import HeroSection from "@/components/HeroSection"
import ProductsGrid from "@/components/ProductsGrid"

export const metadata: Metadata = {
  title: "Collection - Mafroosh",
  description:
    "Explore our curated selection of premium furniture and home decor designed for the modern lifestyle.",
}

export default function ProductsPage() {
  return (
    <div className="bg-background">
      <HeroSection
        title="The Art of Living"
        subtitle="Meticulously curated masterpieces for your sanctuary"
        size="large"
      />
      <div className="-mt-12 relative z-20">
        <ProductsGrid />
      </div>
    </div>
  )
}
