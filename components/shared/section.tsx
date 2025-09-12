import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section 
      id={id}
      className={cn("py-12 md:py-24 lg:py-32", className)}
      data-testid="section"
    >
      {children}
    </section>
  )
}