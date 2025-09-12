# Modern Next.js Application

A production-ready Next.js application built with the latest technologies and best practices.

## 🚀 Tech Stack

### Core
- **Next.js 15** - Latest React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety and better DX

### UI & Styling
- **shadcn/ui** - Modern, accessible component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide Icons** - Beautiful, consistent icon set

### Design System
- **CSS Variables** - Dynamic theming support
- **Dark Mode** - Built-in light/dark theme switching
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components

### Developer Experience
- **ESLint** - Code linting with Next.js config
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **lint-staged** - Run linters on staged files

## 📁 Project Structure

```
openbase-v2/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── shared/           # Shared components
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── config/               # Configuration files
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

## 🎨 Design System

### Colors
The application uses a semantic color system with CSS variables that adapt to light/dark themes:
- Primary, Secondary, Accent colors
- Semantic colors (success, warning, error)
- Neutral grays for UI elements

### Typography
- System font stack for optimal performance
- Responsive font sizing
- Consistent spacing scale

### Components
All components follow these principles:
- Accessibility first (keyboard navigation, ARIA labels)
- Responsive by default
- Themeable via CSS variables
- Consistent API design

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### VS Code Settings
Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## 📝 Development Guidelines

1. **Component Development**
   - Use TypeScript for all components
   - Implement proper prop validation
   - Include JSDoc comments for complex logic

2. **Styling**
   - Use Tailwind utilities first
   - Create custom CSS only when necessary
   - Follow mobile-first responsive design

3. **Performance**
   - Optimize images with Next.js Image component
   - Use dynamic imports for code splitting
   - Implement proper loading states

4. **Testing**
   - Write unit tests for utilities
   - Component testing with React Testing Library
   - E2E testing for critical user flows

## 🚀 Deployment

The application is optimized for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted with Docker

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.
