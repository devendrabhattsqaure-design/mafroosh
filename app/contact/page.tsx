import type { Metadata } from "next"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import AnimatedSection from "@/components/AnimatedSection"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us - Sacred Samagri",
  description:
    "Get in touch with Sacred Samagri. Visit our store in Varanasi or reach us online for all your pooja product needs.",
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Store Address",
    lines: ["Vikas Khand -5 , Gomti Nagar", "Varanasi, Uttar Pradesh", "India - 221001"],
  },
  {
    icon: Phone,
    title: "Phone",
   lines: ["+91 8840403939", "+91 9125233285"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@sacredsamagri.com", "orders@sacredsamagri.com"],
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
        title="Get in Touch"
        subtitle="We would love to hear from you. Reach out for orders, queries, or simply to connect."
      />

      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <AnimatedSection>
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm md:p-10">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill in the form below and we will get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </AnimatedSection>

            {/* Contact info + map */}
            <div className="flex flex-col gap-8">
              <AnimatedSection delay={100}>
                <div className="grid gap-6 sm:grid-cols-2">
                  {contactInfo.map((info) => (
                    <div
                      key={info.title}
                      className="rounded-xl border border-border bg-card p-6 shadow-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mt-4 font-serif text-base font-semibold text-foreground">
                        {info.title}
                      </h3>
                      <div className="mt-2 flex flex-col gap-0.5">
                        {info.lines.map((line) => (
                          <p key={line} className="text-sm text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Map */}
              <AnimatedSection delay={200}>
                <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                  <iframe
                    title="Sacred Samagri Store Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.8045949078963!2d83.00835547513647!3d25.31106477706781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2e2b1a6b0a5b%3A0x68a0a5c9e2f0c62e!2sKashi%20Vishwanath%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
