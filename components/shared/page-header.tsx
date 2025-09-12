interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16" data-testid="page-header">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          {description}
        </p>
      )}
    </div>
  )
}