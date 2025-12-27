import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import {
  Sparkles,
  Zap,
  Eye,
  Shield,
  Smartphone,
  Search,
  ArrowRight,
  Star,
  Check,
  Globe,
  Palette,
  Code,
  Layers,
  Clock,
  HeartPulse,
  UtensilsCrossed,
  Store,
  Building2,
  ChevronRight,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-4xl mx-auto text-center text-white z-10">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 px-4 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Claude AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your Website
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              In Minutes, Not Months
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Just describe what you want. Our AI builds it instantly.
            No coding required. Deploy with one click.
          </p>

          {/* Auth-aware buttons */}
          {user ? (
            <Button
              size="lg"
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg shadow-blue-600/25"
            >
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA - Gradient */}
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-brand-500/25 border-0"
              >
                <Link href="/register">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* Secondary CTA - MAXIMUM VISIBILITY WHITE */}
              <Button
                size="lg"
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white px-8 py-6 text-lg font-semibold backdrop-blur-sm"
              >
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-400">
            No credit card required · Free tier available · Deploy in seconds
          </p>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-400 mb-8">
            Trusted by <span className="text-white font-semibold">2,500+</span> businesses worldwide
          </p>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Built our entire medical practice website in under an hour. The HIPAA compliance features are incredible."
              author="Dr. Sarah Chen"
              role="Dental Clinic Owner"
              rating={5}
            />
            <TestimonialCard
              quote="We tried 5 different website builders before NuStack. Nothing compares to the AI assistance."
              author="Marcus Rodriguez"
              role="Restaurant Owner"
              rating={5}
            />
            <TestimonialCard
              quote="Saved $15,000 in agency fees. Our e-commerce site was live in 2 days instead of 2 months."
              author="Jennifer Park"
              role="E-commerce Founder"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powerful features to create, customize, and deploy professional websites
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI-Powered Building"
              description="Describe your vision in plain English and watch Claude build it for you in real-time"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Instant Deploy"
              description="One-click deployment to Vercel with custom domains and SSL certificates"
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6" />}
              title="Live Preview"
              description="See changes instantly as you build with our real-time preview panel"
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="SEO Optimized"
              description="Built-in SEO best practices, meta tags, and schema markup for better rankings"
            />
            <FeatureCard
              icon={<Smartphone className="h-6 w-6" />}
              title="Mobile Responsive"
              description="Every site is fully responsive and optimized for all device sizes"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="HIPAA Compliant"
              description="Healthcare-ready templates with built-in compliance features"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Custom Domains"
              description="Connect your own domain or get a free subdomain instantly"
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title="Brand Customization"
              description="Import your brand colors, fonts, and logos automatically"
            />
            <FeatureCard
              icon={<Code className="h-6 w-6" />}
              title="Code Export"
              description="Export clean, production-ready code anytime you want"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400">
              Three simple steps to your new website
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                title="Describe Your Site"
                description="Tell us about your business, goals, and design preferences in plain English"
                color="blue"
              />
              <StepCard
                number="2"
                title="AI Builds It"
                description="Watch as Claude creates your pages, components, and content in real-time"
                color="purple"
              />
              <StepCard
                number="3"
                title="Deploy & Launch"
                description="One click to go live with hosting, SSL, and custom domain included"
                color="pink"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industry Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              Industries
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Every Business
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Specialized templates and features for your industry
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <IndustryCard
              icon={<HeartPulse className="h-8 w-8" />}
              title="Healthcare"
              features={["HIPAA Compliant", "Appointment Booking", "Patient Forms"]}
              color="red"
            />
            <IndustryCard
              icon={<UtensilsCrossed className="h-8 w-8" />}
              title="Restaurants"
              features={["Online Ordering", "Menu Builder", "Reservations"]}
              color="orange"
            />
            <IndustryCard
              icon={<Store className="h-8 w-8" />}
              title="E-commerce"
              features={["Product Catalog", "Shopping Cart", "Payment Processing"]}
              color="green"
            />
            <IndustryCard
              icon={<Building2 className="h-8 w-8" />}
              title="Services"
              features={["Lead Forms", "Testimonials", "Service Pages"]}
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Starter"
              price="$0"
              period="forever"
              description="Perfect for trying out NuStack"
              features={[
                "1 Website",
                "NuStack subdomain",
                "Basic AI features",
                "Community support",
              ]}
              cta="Start Free"
              href="/register"
            />
            <PricingCard
              name="Pro"
              price="$29"
              period="per month"
              description="For growing businesses"
              features={[
                "5 Websites",
                "Custom domains",
                "Advanced AI features",
                "Priority support",
                "Analytics dashboard",
                "Remove NuStack branding",
              ]}
              cta="Start Pro Trial"
              href="/register"
              highlighted
            />
            <PricingCard
              name="Agency"
              price="$99"
              period="per month"
              description="For agencies and teams"
              features={[
                "Unlimited websites",
                "White-label option",
                "Team collaboration",
                "API access",
                "Dedicated support",
                "Custom integrations",
              ]}
              cta="Contact Sales"
              href="/register"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />

            <div className="relative z-10">
              <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Build Your Site?
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join thousands of businesses who built their websites with NuStack.
                Start for free, no credit card required.
              </p>
              {user ? (
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold"
                >
                  <Link href="/register">
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  N
                </div>
                <span className="text-white font-semibold text-lg">NuStack</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Build beautiful websites with AI. No coding required.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} NuStack. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>using Claude AI</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: "blue" | "purple" | "pink";
}) {
  const colorClasses = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    pink: "bg-pink-600",
  }

  return (
    <div className="text-center relative">
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}>
        {number}
      </div>
      <h3 className="font-semibold text-white mb-2 text-lg">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  rating,
}: {
  quote: string;
  author: string;
  role: string;
  rating: number;
}) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-slate-300 mb-4 italic">&quot;{quote}&quot;</p>
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function IndustryCard({
  icon,
  title,
  features,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  features: string[];
  color: "red" | "orange" | "green" | "blue";
}) {
  const colorClasses = {
    red: "bg-red-500/20 text-red-400",
    orange: "bg-orange-500/20 text-orange-400",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
  }

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      <div className={`w-14 h-14 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl border transition-all ${
        highlighted
          ? "bg-blue-600/10 border-blue-500/50 ring-2 ring-blue-500/20"
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      {highlighted && (
        <Badge className="mb-4 bg-blue-600 text-white border-0">Most Popular</Badge>
      )}
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-slate-400 ml-1">/{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={`w-full ${
          highlighted
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-white/10 hover:bg-white/20 text-white"
        }`}
      >
        <Link href={href}>
          {cta}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
