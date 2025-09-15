'use client';

import { Search, Book, MessageCircle, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const faqs = [
  {
    question: 'How do I get started with Openbase?',
    answer:
      'Getting started is easy! Simply sign up for an account, choose your plan, and follow our onboarding wizard to set up your first project.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes! We offer a 14-day free trial for all new users. No credit card required to start your trial.',
  },
  {
    question: 'How secure is my data?',
    answer:
      'We use industry-standard encryption and security practices. All data is encrypted at rest and in transit, and we conduct regular security audits.',
  },
  {
    question: 'Do you offer customer support?',
    answer:
      'Yes, we offer 24/7 customer support via email and chat for all paid plans. Enterprise customers also get dedicated phone support.',
  },
];

const helpCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics and get up and running quickly',
    icon: Book,
    links: ['Quick Start Guide', 'Video Tutorials', 'Best Practices', 'FAQs'],
  },
  {
    title: 'Account & Billing',
    description: 'Manage your account, subscription, and payments',
    icon: MessageCircle,
    links: [
      'Account Settings',
      'Billing Information',
      'Subscription Management',
      'Invoices & Receipts',
    ],
  },
  {
    title: 'Technical Support',
    description: 'Get help with technical issues and troubleshooting',
    icon: Mail,
    links: [
      'API Documentation',
      'Integration Guides',
      'Troubleshooting',
      'System Status',
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">How can we help you?</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Search our knowledge base or browse topics below
          </p>

          <div className="relative mx-auto max-w-2xl">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
            <Input
              type="search"
              placeholder="Search for help..."
              className="py-6 pr-4 pl-10 text-lg"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Icon className="text-primary mb-2 h-8 w-8" />
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="hover:text-primary text-sm transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Still need help?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Our support team is here to assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span className="font-semibold">Email Support</span>
                </div>
                <p className="text-primary-foreground/80 text-sm">
                  support@openbase.com
                </p>
                <p className="text-primary-foreground/80 text-sm">
                  24-48 hour response time
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">Live Chat</span>
                </div>
                <p className="text-primary-foreground/80 text-sm">
                  Available Mon-Fri, 9am-5pm PST
                </p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Start Chat
                </Button>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">Phone Support</span>
                </div>
                <p className="text-primary-foreground/80 text-sm">
                  +1 (555) 123-4567
                </p>
                <p className="text-primary-foreground/80 text-sm">
                  Enterprise customers only
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
