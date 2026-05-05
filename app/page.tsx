import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Sparkles, Zap, Shield, Users } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built on Next.js 16 with React 19 for optimal performance and developer experience.",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Supabase Auth with Row Level Security ensures your data stays protected.",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete authentication flows including sign up, sign in, and profile management.",
    },
    {
      icon: Sparkles,
      title: "Subscription Tiers",
      description: "Built-in free and pro tier system with gated features and upgrade flows.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Frontend Engineering Assessment Template
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
              Build something{" "}
              <span className="text-primary">amazing</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              A modern SaaS starter template with authentication, subscription management,
              and everything you need to demonstrate your frontend skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                <Link href="/upgrade">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">What's included</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Everything you need to build and showcase a modern web application.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4 p-6 rounded-xl bg-card border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "Shadcn/ui"].map((tech) => (
              <div key={tech} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border">
                <Check className="w-4 h-4 text-primary" />
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to start?</h2>
          <p className="text-lg text-muted-foreground">
            Create an account and explore the features of this template.
          </p>
          <Button size="lg" className="px-8 py-6 text-lg" asChild>
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
