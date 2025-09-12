import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import { ContactForm } from '@/components/forms/ContactForm';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          title="Contact Us"
          description="Get in touch with our team. We'd love to hear from you!"
        />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Send us a message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-xl font-semibold">Get in touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <info.icon className="text-primary h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{info.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {info.description}
                      </p>
                      {info.link && (
                        <a
                          href={info.link}
                          className="text-primary text-sm font-medium hover:underline"
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
              <h3 className="mb-4 flex items-center font-semibold">
                <ClockIcon className="text-primary mr-2 h-5 w-5" />
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
            <div className="bg-card rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">Frequently Asked Questions</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Looking for quick answers? Check out our FAQ section for common
                questions.
              </p>
              <a
                href="/faq"
                className="text-primary text-sm font-medium hover:underline"
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
    title: 'Email',
    description: "Send us an email and we'll get back to you within 24 hours.",
    link: 'mailto:hello@yourapp.com',
    linkText: 'hello@yourapp.com',
  },
  {
    icon: PhoneIcon,
    title: 'Phone',
    description: 'Call us during business hours for immediate assistance.',
    link: 'tel:+1-555-123-4567',
    linkText: '+1 (555) 123-4567',
  },
  {
    icon: MapPinIcon,
    title: 'Office',
    description: 'Visit us at our headquarters in San Francisco.',
    linkText: '123 Main St, San Francisco, CA 94105',
  },
];