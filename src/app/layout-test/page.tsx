import { Container } from '@/components/shared/container';
import { LayoutWrapper } from '@/components/shared/layout-wrapper';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LayoutTest() {
  return (
    <LayoutWrapper>
      <Container>
        <PageHeader
          title="Layout Components Test"
          description="Testing all layout components for proper rendering and responsiveness"
        />
      </Container>

      <Section className="bg-muted/50">
        <Container>
          <Card>
            <CardHeader>
              <CardTitle>Section with Container</CardTitle>
            </CardHeader>
            <CardContent>
              This demonstrates the Section and Container components working
              together. The section provides vertical spacing while the
              container manages horizontal padding.
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card 1</CardTitle>
              </CardHeader>
              <CardContent>Responsive grid layout</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card 2</CardTitle>
              </CardHeader>
              <CardContent>Works on all screen sizes</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card 3</CardTitle>
              </CardHeader>
              <CardContent>Mobile-first approach</CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </LayoutWrapper>
  );
}
