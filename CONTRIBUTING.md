# Contributing Guidelines

Thank you for your interest in contributing to OpenBase v2! This document provides guidelines and steps for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.0.0 or higher
- **TypeScript** knowledge
- **React** and **Next.js** experience

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/openbase-v2.git
   cd openbase-v2
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify setup**
   - Open http://localhost:3000
   - Run tests: `npm test`
   - Check Storybook: `npm run storybook`

### Create a development branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Daily Development

1. **Pull latest changes**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Make your changes**
   - Follow coding standards
   - Write tests for new features
   - Update documentation

4. **Test your changes**
   ```bash
   npm run test           # Unit tests
   npm run test:e2e       # E2E tests
   npm run lint           # Linting
   npm run typecheck      # Type checking
   npm run build          # Production build
   ```

### Quality Checks

Before committing, ensure all checks pass:

```bash
# Run all quality checks
npm run check-all

# Individual checks
npm run lint           # ESLint
npm run lint:fix       # Fix auto-fixable issues
npm run format         # Prettier formatting
npm run typecheck      # TypeScript compilation
npm run test           # Jest unit tests
npm run test:e2e       # Playwright E2E tests
npm run build          # Next.js build
```

## Coding Standards

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Add proper JSDoc comments for public APIs
- Use meaningful variable and function names

```typescript
// Good
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Formats a user's display name
 * @param user - User object with name properties
 * @returns Formatted display name
 */
function formatUserDisplayName(user: UserProfile): string {
  return user.name.trim();
}
```

### React Components

- Use functional components with hooks
- Follow the component structure pattern
- Add proper prop interfaces
- Include JSDoc documentation

```typescript
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable button component with variants and sizes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
const Button = ({ variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  // Component implementation
};
```

### Testing

- Write tests for all new features and bug fixes
- Use descriptive test names
- Test user behavior, not implementation details
- Include edge cases and error scenarios

```typescript
describe('Button Component', () => {
  describe('when clicked', () => {
    it('should call onClick handler with correct arguments', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic color classes from the theme
- Maintain accessibility standards

```tsx
// Good - Responsive, accessible styling
<button className="
  px-4 py-2 
  bg-primary text-primary-foreground 
  hover:bg-primary/90 
  focus-visible:ring-2 focus-visible:ring-ring 
  disabled:opacity-50 disabled:cursor-not-allowed
  rounded-md transition-colors
  sm:px-6 sm:py-3
">
  Submit
</button>
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature for the user
- **fix**: Bug fix for the user
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples

```bash
# Feature
feat(auth): add OAuth login support

# Bug fix
fix(ui): resolve button alignment issue in mobile view

# Documentation
docs: update API documentation for user endpoints

# Breaking change
feat(api)!: change user authentication flow

BREAKING CHANGE: The authentication endpoint now requires a different request format.
```

### Commit Message Guidelines

- Use imperative mood ("add" not "added" or "adds")
- Keep the first line under 72 characters
- Reference issues and pull requests when applicable
- Include breaking changes in the footer

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   npm run test
   npm run test:e2e
   ```

2. **Run code quality checks**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

3. **Update documentation**
   - Add JSDoc comments to new functions
   - Update component stories if needed
   - Update README if necessary

4. **Rebase your branch**
   ```bash
   git rebase main
   ```

### PR Description Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Manual testing completed
- [ ] Tests added for new functionality

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Breaking Changes
List any breaking changes and migration instructions.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added and passing
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing by reviewers when applicable
4. **Documentation**: Ensure documentation is updated
5. **Approval**: PR approved by maintainer
6. **Merge**: Maintainer merges the PR

### After Your PR is Merged

1. **Delete your branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your local main**
   ```bash
   git checkout main
   git pull upstream main
   ```

## Issue Guidelines

### Bug Reports

Include the following information:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Numbered steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, browser, Node.js version, etc.
- **Screenshots**: If applicable
- **Additional context**: Any other relevant information

### Feature Requests

Include the following information:

- **Problem description**: What problem does this solve?
- **Proposed solution**: Detailed description of the proposed feature
- **Alternatives considered**: Other solutions you've considered
- **Additional context**: Mockups, examples, or references

### Issue Labels

We use the following labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

## Testing Requirements

### Unit Tests

- **Coverage**: Maintain >80% code coverage
- **Tools**: Jest, React Testing Library
- **Location**: `__tests__` directories or `.test.ts` files

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Integration Tests

- **Tools**: Playwright
- **Location**: `e2e/` directory
- **Coverage**: Major user flows and features

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific test file
npx playwright test auth.spec.ts
```

### Component Testing

- **Tools**: Storybook
- **Coverage**: All UI components
- **Visual regression**: Chromatic integration

```bash
# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Test component interactions
npm run test-storybook
```

## Documentation

### Component Documentation

- Add Storybook stories for all UI components
- Include usage examples and prop documentation
- Document accessibility features

### API Documentation

- Use JSDoc comments for all functions and classes
- Include parameter and return type documentation
- Provide usage examples

### User Documentation

- Update user guides for new features
- Include screenshots and step-by-step instructions
- Keep documentation current with changes

## Development Best Practices

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize images with Next.js Image component
- Monitor bundle size and loading performance

### Security

- Validate all user inputs
- Use environment variables for sensitive data
- Keep dependencies updated
- Follow OWASP security guidelines

### Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## Getting Help

### Resources

- **Documentation**: Check the docs/ directory
- **API Reference**: Visit `/api-docs` when running the app
- **Component Library**: Visit Storybook at `:6006`
- **Style Guide**: See `docs/STYLE_GUIDE.md`

### Communication

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Code Review**: For specific code feedback

### Debugging

- Use React Developer Tools
- Check browser console for errors
- Use Next.js built-in error overlay
- Run tests to identify breaking changes

## Recognition

Contributors will be:

- Added to the CONTRIBUTORS.md file
- Mentioned in release notes
- Recognized in community communications
- Given appropriate credit in documentation

## Development Environment Tips

### VS Code Extensions

Recommended extensions for better development experience:

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Jest Runner
- GitLens

### Git Hooks

We use Husky for Git hooks to maintain code quality:

- **pre-commit**: Runs lint-staged for code formatting
- **commit-msg**: Validates commit message format
- **pre-push**: Runs tests before pushing

Thank you for contributing to OpenBase v2! 🎉

Your contributions help make this project better for everyone.