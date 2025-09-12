import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';

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
            <div className="bg-muted rounded-lg p-1">
              <div className="grid grid-cols-2">
                <button className="bg-background text-foreground rounded-md px-4 py-2 text-sm font-medium">
                  Monthly
                </button>
                <button className="text-muted-foreground rounded-md px-4 py-2 text-sm font-medium">
                  Yearly
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div
            className="grid gap-8 md:grid-cols-3"
            data-testid="pricing-section"
          >
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-card relative rounded-lg border p-8 ${
                  plan.popular ? 'ring-primary ring-2' : ''
                }`}
                data-testid="pricing-card"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
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
                      <p className="text-muted-foreground text-sm">
                        <span className="line-through">
                          ${plan.originalPrice}/mo
                        </span>
                        <span className="ml-2 font-medium text-green-600">
                          Save{' '}
                          {Math.round(
                            (1 - plan.price / plan.originalPrice) * 100
                          )}
                          %
                        </span>
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-4">
                    <p
                      className="text-sm font-medium"
                      data-testid="features-list"
                    >
                      What&apos;s included:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          {feature.included ? (
                            <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          ) : (
                            <XMarkIcon className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? 'text-foreground'
                                : 'text-muted-foreground'
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

            <div className="grid gap-8 md:grid-cols-2">
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
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    price: 0,
    billing: '/month',
    cta: 'Get Started',
    features: [
      { name: 'Up to 3 projects', included: true },
      { name: 'Basic components', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced features', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'Great for growing teams and businesses',
    price: 29,
    originalPrice: 39,
    billing: '/month',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'All components', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced features', included: true },
      { name: 'Analytics dashboard', included: true },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 99,
    billing: '/month',
    cta: 'Contact Sales',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Custom training', included: true },
      { name: 'White-label options', included: true },
    ],
  },
];

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, we offer a 14-day free trial for all paid plans. No credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.',
  },
];