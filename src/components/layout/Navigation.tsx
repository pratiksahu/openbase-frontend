import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              OpenBase V2
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
