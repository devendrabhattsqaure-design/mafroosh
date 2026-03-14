import type { Metadata } from "next"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import AnimatedSection from "@/components/AnimatedSection"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us - Mafroosh | Premium Home Decor",
  description:
    "Connect with Mafroosh for exclusive home decor and design consultations. Visit our Lucknow studio or reach us online for bespoke interior solutions.",
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Store Address",
    lines: ["529C/011-CC, Ring Road, Vikas Nagar", "Lucknow, Uttar Pradesh", "India - 226022"],
  },
  {
    icon: Phone,
    title: "Phone",
   lines: ["+91 9621374263", "+91 962137463"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@mafroosh.com", "orders@mafroosh.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Mon - Sat: 8:00 AM - 9:00 PM", "Sunday: 9:00 AM - 6:00 PM", "Open on all festivals"],
  },
]

export default function ContactPage() {
  return (
    <>
      <HeroSection
        title="Connect with Our Studio"
        subtitle="Schedule a design consultation or inquire about our artisanal collections. We are here to help you define your sanctuary."
      />

      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-24 lg:grid-cols-2 items-start">
            {/* Contact Form Area */}
            <AnimatedSection>
              <div className="border border-border p-10 md:p-16 relative">
                 <div className="absolute top-0 left-0 w-2 h-2 bg-secondary" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-6 block">
                    Inquiry Form
                 </span>
                 <h2 className="font-serif text-4xl font-medium text-black md:text-5xl tracking-tighter mb-8">
                    Start a Dialogue
                 </h2>
                 <p className="text-muted-foreground/80 leading-relaxed font-light tracking-wide text-lg mb-12">
                    Whether you're looking for a single statement piece or a full house transformation, our team is ready to assist.
                 </p>
                 <ContactForm />
              </div>
            </AnimatedSection>

            {/* Information Grid */}
            <div className="flex flex-col gap-16">
              <AnimatedSection delay={100}>
                <div className="grid gap-12 sm:grid-cols-2">
                  {contactInfo.map((info) => (
                    <div
                      key={info.title}
                      className="group flex flex-col gap-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center border border-secondary transition-all duration-500 group-hover:bg-secondary group-hover:text-white text-secondary">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                         <h3 className="font-serif text-xl font-medium text-black mb-3">
                           {info.title}
                         </h3>
                         <div className="flex flex-col gap-1">
                           {info.lines.map((line) => (
                             <p key={line} className="text-sm text-muted-foreground/70 font-light tracking-wide leading-relaxed">
                               {line}
                             </p>
                           ))}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Map - Now grayscale for that premium look */}
              <AnimatedSection delay={200}>
                <div className="relative border border-border overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-premium">
                  <iframe
                    title="Mafroosh Studio Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.8765432109876!2d80.946123!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f325437%3A0xd03e4aa2947ee73b!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute inset-0 pointer-events-none border-[20px] border-white/10" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
