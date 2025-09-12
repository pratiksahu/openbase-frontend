interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div
      className="space-y-4 pt-6 pb-8 md:pt-10 md:pb-12 lg:py-16"
      data-testid="page-header"
    >
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-[700px] text-lg sm:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
