# TASK_017: Example Pages

## Overview
Create a comprehensive set of example pages that showcase the application's capabilities, demonstrate design patterns, and provide practical examples for developers. This task focuses on building real-world pages including landing, features, pricing, about, contact, blog, dashboard, and error pages.

## Objectives
- Build a compelling landing page with hero section and features showcase
- Create features and pricing pages for marketing
- Implement about and contact pages with working forms
- Develop blog functionality with list and detail pages
- Create comprehensive dashboard with multiple sections
- Build user settings and profile pages
- Implement 404 and error pages with proper UX
- Ensure all pages are responsive and accessible
- Demonstrate best practices for Next.js app router

## Implementation Steps

### 1. Create Landing Page

Create `src/app/page.tsx`:

```tsx
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { 
  CheckIcon, 
  StarIcon,
  ArrowRightIcon,
  PlayIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl" data-testid="hero-section">
        <Container>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                Build Amazing Apps
                <span className="block text-primary">Faster Than Ever</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern Next.js starter with everything you need to build 
                production-ready applications. TypeScript, Tailwind CSS, 
                testing, and more.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild data-testid="cta-button">
                <Link href="/features">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#demo">
                  <PlayIcon className="mr-2 h-4 w-4" />
                  View Demo
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2">Trusted by 1000+ developers</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Overview */}
      <Section variant="muted">
        <Container>
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with modern tools and best practices to help you 
                ship faster and build better.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <Button asChild>
              <Link href="/features">View All Features</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Social Proof */}
      <Section>
        <Container>
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-bold">Loved by Developers</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <OptimizedImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="accent">
        <Container>
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Join thousands of developers building amazing applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Start Building</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

const features = [
  {
    icon: CheckIcon,
    title: "TypeScript Ready",
    description: "Built with TypeScript for better developer experience and type safety."
  },
  {
    icon: CheckIcon,
    title: "Modern UI",
    description: "Beautiful components built with Tailwind CSS and Radix UI primitives."
  },
  {
    icon: CheckIcon,
    title: "Production Ready",
    description: "Optimized builds, testing setup, and deployment configuration included."
  }
];

const testimonials = [
  {
    content: "This starter saved me weeks of setup time. Everything just works!",
    author: "Sarah Johnson",
    role: "Frontend Developer",
    avatar: "/avatars/sarah.jpg"
  },
  {
    content: "The best Next.js starter I've used. Great documentation and examples.",
    author: "Mike Chen",
    role: "Full Stack Developer", 
    avatar: "/avatars/mike.jpg"
  },
  {
    content: "Clean code, modern patterns, and excellent performance out of the box.",
    author: "Emma Davis",
    role: "Tech Lead",
    avatar: "/avatars/emma.jpg"
  }
];
```

### 2. Create Features Page

Create `src/app/features/page.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { 
  CodeBracketIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Features"
          description="Everything you need to build modern web applications"
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Features' }
              ]}
            />
          }
        />
        
        <div className="grid gap-12 lg:gap-16" data-testid="features-grid">
          {featureGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{group.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {group.description}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex} 
                    className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow"
                    data-testid="feature-card"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon 
                          className="h-5 w-5 text-primary" 
                          data-testid="feature-icon"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 
                          className="text-lg font-semibold" 
                          data-testid="feature-title"
                        >
                          {feature.title}
                        </h3>
                        <p 
                          className="text-muted-foreground text-sm"
                          data-testid="feature-description"
                        >
                          {feature.description}
                        </p>
                      </div>
                      {feature.tags && (
                        <div className="flex flex-wrap gap-2">
                          {feature.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

const featureGroups = [
  {
    title: "Developer Experience",
    description: "Tools and workflows that make development enjoyable and productive.",
    features: [
      {
        icon: CodeBracketIcon,
        title: "TypeScript",
        description: "Full TypeScript support with strict mode enabled for better code quality and developer experience.",
        tags: ["TypeScript", "IntelliSense", "Type Safety"]
      },
      {
        icon: CogIcon,
        title: "ESLint & Prettier",
        description: "Configured linting and formatting with popular rule sets and automatic fixes on save.",
        tags: ["ESLint", "Prettier", "Code Quality"]
      },
      {
        icon: RocketLaunchIcon,
        title: "Hot Module Reload",
        description: "Fast refresh for instant feedback during development with Next.js built-in HMR.",
        tags: ["HMR", "Fast Refresh", "Development"]
      }
    ]
  },
  {
    title: "UI & Styling",
    description: "Modern styling solutions and component libraries for beautiful interfaces.",
    features: [
      {
        icon: PaintBrushIcon,
        title: "Tailwind CSS",
        description: "Utility-first CSS framework with custom design system and dark mode support.",
        tags: ["Tailwind CSS", "Dark Mode", "Responsive"]
      },
      {
        icon: CodeBracketIcon,
        title: "Component Library",
        description: "Pre-built components with consistent design patterns and accessibility features.",
        tags: ["Components", "Accessibility", "Storybook"]
      },
      {
        icon: PaintBrushIcon,
        title: "Icons",
        description: "Beautiful icon sets from Heroicons with consistent styling and sizing.",
        tags: ["Icons", "Heroicons", "SVG"]
      }
    ]
  },
  {
    title: "Performance & SEO",
    description: "Optimizations and features for fast loading and search engine visibility.",
    features: [
      {
        icon: RocketLaunchIcon,
        title: "Image Optimization",
        description: "Automatic image optimization with WebP/AVIF support and lazy loading.",
        tags: ["Images", "WebP", "Lazy Loading"]
      },
      {
        icon: ChartBarIcon,
        title: "Bundle Splitting",
        description: "Automatic code splitting and dynamic imports for optimal performance.",
        tags: ["Code Splitting", "Performance", "Optimization"]
      },
      {
        icon: ShieldCheckIcon,
        title: "SEO Ready",
        description: "Meta tags, structured data, and sitemap generation for better search rankings.",
        tags: ["SEO", "Meta Tags", "Sitemap"]
      }
    ]
  }
];
```

### 3. Create Pricing Page

Create `src/app/pricing/page.tsx`:

```tsx
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Simple, Transparent Pricing"
          description="Choose the plan that fits your needs. Upgrade or downgrade at any time."
        />
        
        <div className="space-y-8">
          {/* Pricing Toggle */}
          <div className="flex justify-center">
            <div className="bg-muted p-1 rounded-lg">
              <div className="grid grid-cols-2">
                <button className="px-4 py-2 rounded-md bg-background text-foreground text-sm font-medium">
                  Monthly
                </button>
                <button className="px-4 py-2 rounded-md text-muted-foreground text-sm font-medium">
                  Yearly
                </button>
              </div>
            </div>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8" data-testid="pricing-section">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-card p-8 rounded-lg border relative ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}
                data-testid="pricing-card"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold" data-testid="price">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {plan.billing}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-muted-foreground">
                        <span className="line-through">${plan.originalPrice}/mo</span>
                        <span className="ml-2 text-green-600 font-medium">
                          Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                        </span>
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                  
                  <div className="space-y-4">
                    <p className="text-sm font-medium" data-testid="features-list">
                      What's included:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          {feature.included ? (
                            <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <span 
                            className={`text-sm ${
                              feature.included ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small projects",
    price: 0,
    billing: "/month",
    cta: "Get Started",
    features: [
      { name: "Up to 3 projects", included: true },
      { name: "Basic components", included: true },
      { name: "Community support", included: true },
      { name: "Advanced features", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false }
    ]
  },
  {
    name: "Pro",
    description: "Great for growing teams and businesses",
    price: 29,
    originalPrice: 39,
    billing: "/month",
    cta: "Start Free Trial",
    popular: true,
    features: [
      { name: "Unlimited projects", included: true },
      { name: "All components", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced features", included: true },
      { name: "Analytics dashboard", included: true },
      { name: "Custom integrations", included: false }
    ]
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: 99,
    billing: "/month",
    cta: "Contact Sales",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated support", included: true },
      { name: "SLA guarantee", included: true },
      { name: "Custom training", included: true },
      { name: "White-label options", included: true }
    ]
  }
];

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  }
];
```

### 4. Create About Page

Create `src/app/about/page.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { 
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container>
          <PageHeader
            title="About Us"
            description="We're on a mission to help developers build better applications faster"
          />
          
          <div className="space-y-16">
            {/* Mission Section */}
            <div data-testid="mission-section" className="text-center space-y-6">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We believe that great software should be accessible to everyone. Our goal is to 
                provide developers with the tools, components, and patterns they need to build 
                amazing applications without reinventing the wheel every time.
              </p>
            </div>
            
            {/* Values */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Our Values</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team Section */}
            <div className="space-y-8" data-testid="team-section">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Meet Our Team</h2>
                <p className="text-muted-foreground mt-2">
                  The people behind the product
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="text-center space-y-4" data-testid="team-member">
                    <OptimizedImage
                      src={member.avatar}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="mx-auto rounded-full"
                    />
                    <div className="space-y-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

const values = [
  {
    icon: LightBulbIcon,
    title: "Innovation",
    description: "We constantly explore new technologies and patterns to stay ahead of the curve."
  },
  {
    icon: HeartIcon,
    title: "Quality",
    description: "We believe in shipping code that we're proud of, with attention to every detail."
  },
  {
    icon: UserGroupIcon,
    title: "Community",
    description: "We build for developers, by developers, and we listen to our community."
  },
  {
    icon: GlobeAltIcon,
    title: "Accessibility",
    description: "We create tools that are accessible to developers of all skill levels and backgrounds."
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Full-stack developer with 10+ years building web applications.",
    avatar: "/team/sarah.jpg"
  },
  {
    name: "Mike Chen",
    role: "CTO",
    bio: "Former Google engineer passionate about developer experience and performance.",
    avatar: "/team/mike.jpg"
  },
  {
    name: "Emma Davis",
    role: "Design Lead",
    bio: "UI/UX designer focused on creating beautiful and functional interfaces.",
    avatar: "/team/emma.jpg"
  }
];

const stats = [
  { value: "1000+", label: "Developers" },
  { value: "50K+", label: "Downloads" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" }
];
```

### 5. Create Contact Page

Create `src/app/contact/page.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Contact Us"
          description="Get in touch with our team. We'd love to hear from you!"
        />
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Get in touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{info.title}</h3>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                      {info.link && (
                        <a 
                          href={info.link} 
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          {info.linkText}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Office Hours */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-primary" />
                Office Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
            
            {/* FAQ Link */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Frequently Asked Questions</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Looking for quick answers? Check out our FAQ section for common questions.
              </p>
              <a 
                href="/faq" 
                className="text-primary hover:underline text-sm font-medium"
              >
                View FAQ →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: "Email",
    description: "Send us an email and we'll get back to you within 24 hours.",
    link: "mailto:hello@yourapp.com",
    linkText: "hello@yourapp.com"
  },
  {
    icon: PhoneIcon,
    title: "Phone",
    description: "Call us during business hours for immediate assistance.",
    link: "tel:+1-555-123-4567",
    linkText: "+1 (555) 123-4567"
  },
  {
    icon: MapPinIcon,
    title: "Office",
    description: "Visit us at our headquarters in San Francisco.",
    linkText: "123 Main St, San Francisco, CA 94105"
  }
];
```

### 6. Create Blog Pages

Create `src/app/blog/page.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Blog"
          description="Latest news, tutorials, and insights from our team"
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-grid">
          {posts.map((post, index) => (
            <article 
              key={index} 
              className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              data-testid="blog-card"
            >
              <OptimizedImage
                src={post.image}
                alt={post.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={post.date} data-testid="post-date">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold" data-testid="post-title">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground" data-testid="post-excerpt">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <OptimizedImage
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">
                      {post.author.name}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Load More Posts
          </button>
        </div>
      </Container>
    </Section>
  );
}

const posts = [
  {
    title: "Getting Started with Next.js 14",
    slug: "getting-started-nextjs-14",
    excerpt: "Learn how to build modern web applications with the latest features in Next.js 14.",
    image: "/blog/nextjs-14.jpg",
    date: "2024-01-15",
    readTime: "5 min read",
    author: {
      name: "Sarah Johnson",
      avatar: "/authors/sarah.jpg"
    },
    tags: ["Next.js", "React", "Tutorial"]
  },
  {
    title: "Building Accessible Components",
    slug: "building-accessible-components", 
    excerpt: "Best practices for creating components that work for everyone, including users with disabilities.",
    image: "/blog/accessibility.jpg",
    date: "2024-01-10",
    readTime: "8 min read",
    author: {
      name: "Mike Chen",
      avatar: "/authors/mike.jpg"
    },
    tags: ["Accessibility", "React", "Best Practices"]
  },
  {
    title: "Optimizing Performance with React",
    slug: "optimizing-performance-react",
    excerpt: "Techniques and patterns for building fast React applications that scale.",
    image: "/blog/performance.jpg", 
    date: "2024-01-05",
    readTime: "12 min read",
    author: {
      name: "Emma Davis",
      avatar: "/authors/emma.jpg"
    },
    tags: ["Performance", "React", "Optimization"]
  }
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

Create `src/app/blog/[slug]/page.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: BlogPostProps) {
  // In a real app, you would fetch the post data based on the slug
  const post = getBlogPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Section>
      <Container size="md">
        <article>
          <header className="space-y-6 mb-8">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title }
              ]}
            />
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <OptimizedImage
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <OptimizedImage
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </header>
          
          <div 
            className="prose prose-gray dark:prose-invert max-w-none"
            data-testid="post-content"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          <footer className="mt-12 pt-8 border-t border-border">
            <div 
              className="bg-muted/50 rounded-lg p-6"
              data-testid="author-info"
            >
              <div className="flex items-start space-x-4">
                <OptimizedImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div className="space-y-2">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </Container>
    </Section>
  );
}

// Mock function - in real app, this would fetch from CMS/database
function getBlogPost(slug: string) {
  const posts = {
    "getting-started-nextjs-14": {
      title: "Getting Started with Next.js 14",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "/blog/nextjs-14.jpg",
      author: {
        name: "Sarah Johnson",
        avatar: "/authors/sarah.jpg",
        bio: "Full-stack developer with 10+ years building web applications."
      },
      tags: ["Next.js", "React", "Tutorial"],
      content: `
        <p>Next.js 14 brings exciting new features and improvements...</p>
        <h2>App Router</h2>
        <p>The new App Router provides better performance...</p>
        <!-- More content -->
      `
    }
  };
  
  return posts[slug as keyof typeof posts] || null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

### 7. Create Dashboard Example

Create `src/app/dashboard/page.tsx`:

```tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Container } from '@/components/layout/Container';
import { 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrendingUpIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="dashboard">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-lg border"
              data-testid="dashboard-widget"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs flex items-center ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUpIcon className="h-3 w-3 mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart Component Placeholder
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">User Activity</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart Component Placeholder
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const stats = [
  {
    label: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: UsersIcon
  },
  {
    label: "Revenue",
    value: "$12,345",
    change: "+8%",
    icon: CurrencyDollarIcon
  },
  {
    label: "Conversions",
    value: "23.5%",
    change: "+2.4%",
    icon: TrendingUpIcon
  },
  {
    label: "Page Views",
    value: "45,678",
    change: "+15%",
    icon: ChartBarIcon
  }
];

const activities = [
  {
    description: "New user registered: john.doe@example.com",
    time: "2 minutes ago"
  },
  {
    description: "Payment received from customer #1234",
    time: "15 minutes ago"
  },
  {
    description: "System backup completed successfully",
    time: "1 hour ago"
  },
  {
    description: "New feature deployed to production",
    time: "2 hours ago"
  }
];
```

### 8. Create Settings Page

Create `src/app/settings/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Checkbox } from '@/components/forms/Checkbox';
import { Select } from '@/components/forms/Select';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: ''
    },
    notifications: {
      email: true,
      push: false,
      marketing: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC'
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
        
        <form className="space-y-8" data-testid="settings-form">
          {/* Profile Settings */}
          <div className="bg-card p-6 rounded-lg border" data-testid="settings-profile">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input 
                  value={settings.profile.firstName}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, firstName: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input 
                  value={settings.profile.lastName}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, lastName: e.target.value }
                  }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, email: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-card p-6 rounded-lg border" data-testid="settings-notifications">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <Checkbox
                id="email-notifications"
                label="Email notifications"
                description="Receive notifications via email"
                checked={settings.notifications.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
              />
              <Checkbox
                id="push-notifications"
                label="Push notifications"
                description="Receive push notifications in your browser"
                checked={settings.notifications.push}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: e.target.checked }
                }))}
              />
              <Checkbox
                id="marketing-notifications"
                label="Marketing emails"
                description="Receive promotional emails and updates"
                checked={settings.notifications.marketing}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, marketing: e.target.checked }
                }))}
              />
            </div>
          </div>
          
          {/* Privacy */}
          <div className="bg-card p-6 rounded-lg border" data-testid="settings-privacy">
            <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, profileVisibility: e.target.value }
                  }))}
                  options={[
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                    { value: 'friends', label: 'Friends Only' }
                  ]}
                />
              </div>
              <Checkbox
                id="show-email"
                label="Show email publicly"
                checked={settings.privacy.showEmail}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showEmail: e.target.checked }
                }))}
              />
              <Checkbox
                id="show-phone"
                label="Show phone number publicly"
                checked={settings.privacy.showPhone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showPhone: e.target.checked }
                }))}
              />
            </div>
          </div>
          
          {/* Account */}
          <div className="bg-card p-6 rounded-lg border" data-testid="settings-account">
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <Select
                  value={settings.preferences.theme}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: e.target.value }
                  }))}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select
                  value={settings.preferences.language}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value }
                  }))}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' }
                  ]}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" data-testid="save-settings">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
```

### 9. Create 404 Page

Create `src/app/not-found.tsx`:

```tsx
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Section className="min-h-screen flex items-center justify-center">
      <Container className="text-center" data-testid="404-page">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild>
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => history.back()}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              If you think this is an error, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

### 10. Update Navigation and Layout

Update `src/components/layout/Header.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            YourApp
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-menu">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 text-base font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
```

## Acceptance Criteria

- [ ] Landing page showcases key features and benefits
- [ ] Features page displays comprehensive feature list with categories
- [ ] Pricing page shows clear pricing tiers and comparisons
- [ ] About page includes team information and company values
- [ ] Contact page has working form and contact information
- [ ] Blog pages display posts with proper formatting and navigation
- [ ] Dashboard shows relevant metrics and user data
- [ ] Settings page allows users to configure preferences
- [ ] 404 page provides helpful navigation options
- [ ] All pages are fully responsive and accessible
- [ ] Navigation works correctly across all pages
- [ ] Loading states and error handling are implemented

## Testing Instructions

### 1. Test Page Navigation
```bash
# Navigate through all pages
# Check breadcrumbs and active states
# Test mobile navigation menu
```

### 2. Test Responsive Design
```bash
# Test on different screen sizes
# Check mobile menu functionality
# Verify touch interactions work
```

### 3. Test Forms
```bash
# Test contact form submission
# Check form validation
# Test settings form updates
```

### 4. Test Dashboard
```bash
# Check dashboard layout
# Test sidebar navigation
# Verify widgets display correctly
```

## References and Dependencies

### Dependencies
- All previously established components and utilities
- Next.js app router for routing
- Heroicons for consistent iconography

### Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Estimated Time
**10-12 hours**

- Landing and marketing pages: 3-4 hours
- Blog functionality: 2-3 hours
- Dashboard and settings: 3-4 hours
- Navigation and 404 page: 1-2 hours
- Testing and refinement: 2-3 hours

## Troubleshooting

### Common Issues

1. **Routing issues with app router**
   - Check file naming conventions
   - Verify directory structure
   - Ensure proper use of page.tsx files

2. **Mobile navigation not working**
   - Check state management
   - Verify click handlers
   - Test touch events on mobile devices

3. **Form submission issues**
   - Check API routes exist
   - Verify form validation
   - Test error handling

4. **Layout inconsistencies**
   - Check responsive breakpoints
   - Verify component props
   - Test across different screen sizes

5. **Image loading issues**
   - Check image paths
   - Verify Next.js Image configuration
   - Test placeholder and loading states