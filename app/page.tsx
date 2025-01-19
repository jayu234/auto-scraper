import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Code2, Globe, Languages, MessageSquare, Settings2, Star, Zap } from 'lucide-react'
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <header className="fixed w-full bg-background/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AutoScraper</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 md:gap-1">
            <Link href="/sign-in">
              <Button variant="outline">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button>
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="sm:min-h-screen flex justify-center items-center relative overflow-hidden py-40 sm:py-32">
          <div className="w-[60%] container relative z-10 mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-1 lg:gap-8">
              <div className="flex flex-col justify-center items-center space-y-8 text-center">
                <div className="space-y-4">
                  <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
                    Automate Your Web Scraping Efforts with {' '}
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                      Auto
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">Scraper</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-forground md:text-xl">
                    Fast, Smart, and Easy Web Scraping without the Hassle.
                    Transform how you collect data from the web.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-primary hover:bg-green-700">
                      Start Scraping Now
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DotPattern
            cy={0.5}
            cr={1}
            cx={1}
            className={cn(
              "[mask-image:radial-gradient(550px_circle_at_center,white,transparent)]",
            )}
          />
        </section>

        {/* Features Section */}
        <section className="bg-primary-foreground/10 py-20">
          <div className="container">
            <div className="mx-auto max-w-[58rem] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Features that Make Scraping Simple
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to extract web data efficiently and reliably.
              </p>
            </div>
            <div className="mx-auto mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-muted-foreground/20">
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <feature.icon className="h-12 w-12 text-primary-600" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-center text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How AutoScraper Works
            </h2>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center space-y-4 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10 text-2xl font-bold text-primary">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-forground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-primary-foreground/10 py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Users Say
            </h2>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-muted-foreground/20">
                  <CardContent className="flex flex-col space-y-4 p-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-current text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-forground">{testimonial.quote}</p>
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-muted-foreground/10 p-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-forground">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/20">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AutoScraper</span>
              </Link>
              <p className="text-sm text-muted-forground">
                Automating web scraping for everyone.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-forground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-forground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-forground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-forground">
            © {new Date().getFullYear()} AutoScraper. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Automatic Detection",
    description:
      "Smart algorithms automatically detect and extract data patterns without manual selectors.",
    icon: Zap,
  },
  {
    title: "User-Friendly Interface",
    description:
      "Intuitive interface suitable for both beginners and experienced developers.",
    icon: Settings2,
  },
  {
    title: "API Integration",
    description:
      "Seamlessly integrate with popular APIs and services for enhanced functionality.",
    icon: Code2,
  },
  {
    title: "Multi-Language Support",
    description:
      "Support for multiple programming languages including Python, JavaScript, and more.",
    icon: Languages,
  },
]

const steps = [
  {
    title: "Select Your Target",
    description:
      "Choose the website you want to scrape and specify the data you need.",
  },
  {
    title: "Configure Settings",
    description:
      "Set up your scraping preferences and customize the output format.",
  },
  {
    title: "Get Your Data",
    description: "Receive clean, structured data ready for analysis or integration.",
  },
]

const testimonials = [
  {
    quote:
      "AutoScraper has revolutionized how we collect market data. It's fast, reliable, and incredibly easy to use.",
    author: "Sarah Johnson",
    title: "Data Analyst at TechCorp",
  },
  {
    quote:
      "The automatic detection feature saved us countless hours of manual work. Highly recommended!",
    author: "Michael Chen",
    title: "Lead Developer at DataFlow",
  },
  {
    quote:
      "As a researcher, AutoScraper has been invaluable for collecting data across multiple websites efficiently.",
    author: "Dr. Emily Williams",
    title: "Research Scientist",
  },
]

