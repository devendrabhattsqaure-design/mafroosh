import type { Metadata } from "next"
import HeroSection from "@/components/HeroSection"
import ProductsGrid from "@/components/ProductsGrid"

export const metadata: Metadata = {
  title: "Products - Sacred Samagri",
  description:
    "Explore our divine collection of authentic pooja samagri, incense, idols, diyas, and complete pooja kits.",
}

export default function ProductsPage() {
  return (
    <>
      <HeroSection
        title="Explore Our Divine Collection"
        subtitle="Handpicked sacred essentials for every ritual and celebration"
      />
      <ProductsGrid />
    </>
  )
}
