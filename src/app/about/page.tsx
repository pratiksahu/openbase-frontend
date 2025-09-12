import {
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { OptimizedImage } from '@/components/ui/optimized-image';

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
            <div
              data-testid="mission-section"
              className="space-y-6 text-center"
            >
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
                We believe that great software should be accessible to everyone.
                Our goal is to provide developers with the tools, components,
                and patterns they need to build amazing applications without
                reinventing the wheel every time.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Our Values</h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <div key={index} className="space-y-4 text-center">
                    <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                      <value.icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
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

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="space-y-4 text-center"
                    data-testid="team-member"
                  >
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
                      <p className="text-muted-foreground text-sm">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-primary text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
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
    title: 'Innovation',
    description:
      'We constantly explore new technologies and patterns to stay ahead of the curve.',
  },
  {
    icon: HeartIcon,
    title: 'Quality',
    description:
      "We believe in shipping code that we're proud of, with attention to every detail.",
  },
  {
    icon: UserGroupIcon,
    title: 'Community',
    description:
      'We build for developers, by developers, and we listen to our community.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Accessibility',
    description:
      'We create tools that are accessible to developers of all skill levels and backgrounds.',
  },
];

const team = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Full-stack developer with 10+ years building web applications.',
    avatar: '/team/sarah.jpg',
  },
  {
    name: 'Mike Chen',
    role: 'CTO',
    bio: 'Former Google engineer passionate about developer experience and performance.',
    avatar: '/team/mike.jpg',
  },
  {
    name: 'Emma Davis',
    role: 'Design Lead',
    bio: 'UI/UX designer focused on creating beautiful and functional interfaces.',
    avatar: '/team/emma.jpg',
  },
];

const stats = [
  { value: '1000+', label: 'Developers' },
  { value: '50K+', label: 'Downloads' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];