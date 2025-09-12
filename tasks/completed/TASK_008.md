# TASK_008: Husky and Git Hooks

## Overview

Implement automated code quality checks and enforcement using Husky for Git hooks and lint-staged for running checks on staged files. This ensures code quality is maintained consistently across all commits and prevents issues from entering the repository.

## Objectives

- Install and configure Husky for Git hook management
- Set up lint-staged for efficient file processing
- Create pre-commit hooks for code quality checks
- Implement pre-push hooks for comprehensive validation
- Configure commit message linting for consistent commit standards
- Ensure all team members can work with the setup seamlessly

## Implementation Steps

### 1. Install Dependencies

```bash
# Install Husky for Git hooks
npm install --save-dev husky

# Install lint-staged for running commands on staged files
npm install --save-dev lint-staged

# Install commitlint for commit message linting
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Optional: Install commitizen for interactive commits
npm install --save-dev commitizen cz-conventional-changelog
```

### 2. Initialize Husky

```bash
# Initialize Husky (creates .husky directory)
npx husky install

# Add install script to package.json for team setup
npm pkg set scripts.prepare="husky install"
```

### 3. Configure Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "lint:staged": "lint-staged",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test:ci": "npm run type-check && npm run lint && npm run format:check",
    "commit": "cz",
    "build:check": "next build"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### 4. Create Pre-commit Hook

```bash
# Create pre-commit hook
npx husky add .husky/pre-commit "npm run lint:staged"
```

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged
npm run lint:staged

# Type checking
echo "🔧 Running type check..."
npm run type-check

# Check for console.log statements in production
echo "🧹 Checking for console statements..."
if grep -r "console\." --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/; then
  echo "❌ Console statements found in source code. Please remove them before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
```

### 5. Create Pre-push Hook

```bash
# Create pre-push hook
npx husky add .husky/pre-push "npm run test:ci && npm run build:check"
```

Create `.husky/pre-push`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Run comprehensive checks
echo "🔍 Running linting..."
npm run lint

echo "🎨 Checking code formatting..."
npm run format:check

echo "🔧 Running type check..."
npm run type-check

echo "🏗️  Testing build process..."
npm run build:check

# Optional: Run tests if they exist
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
  echo "🧪 Running tests..."
  npm test
fi

echo "✅ Pre-push checks passed!"
```

### 6. Configure Commit Message Linting

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New features
        'fix', // Bug fixes
        'docs', // Documentation changes
        'style', // Code style changes (formatting, missing semicolons, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Changes to build system or dependencies
        'ci', // Changes to CI configuration
        'chore', // Other changes that don't modify src or test files
        'revert', // Reverting previous commits
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};
```

### 7. Create Commit Message Hook

```bash
# Create commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

Create `.husky/commit-msg`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📝 Validating commit message..."
npx --no -- commitlint --edit ${1}

if [ $? -eq 0 ]; then
  echo "✅ Commit message is valid!"
else
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Format: <type>[optional scope]: <description>"
  echo ""
  echo "Examples:"
  echo "  feat: add user authentication"
  echo "  fix(ui): resolve button alignment issue"
  echo "  docs: update installation guide"
  echo ""
  exit 1
fi
```

### 8. Create Hook for Branch Naming

Create `.husky/pre-push-branch-check`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Get current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Define valid branch patterns
valid_pattern="^(main|develop|release\/.*|hotfix\/.*|feature\/.*|bugfix\/.*|chore\/.*)$"

echo "🌿 Checking branch name: $branch"

if [[ $branch =~ $valid_pattern ]]; then
  echo "✅ Branch name is valid!"
else
  echo "❌ Branch name '$branch' does not follow naming convention!"
  echo ""
  echo "Valid patterns:"
  echo "  main, develop"
  echo "  feature/description"
  echo "  bugfix/description"
  echo "  hotfix/description"
  echo "  release/version"
  echo "  chore/description"
  echo ""
  exit 1
fi
```

### 9. Advanced Lint-staged Configuration

Create `.lintstagedrc.js` for more complex configurations:

```javascript
module.exports = {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit', // Type check all files
  ],

  // Style files
  '*.{css,scss,sass}': ['prettier --write'],

  // Configuration and data files
  '*.{json,yaml,yml}': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write', 'markdownlint --fix'],

  // Package.json
  'package.json': ['sort-package-json', 'prettier --write'],

  // Run tests related to staged files
  '*.{js,jsx,ts,tsx}': ['jest --bail --findRelatedTests --passWithNoTests'],
};
```

### 10. Create Development Scripts

Add helper scripts to `package.json`:

```json
{
  "scripts": {
    "hooks:install": "husky install && chmod +x .husky/*",
    "hooks:uninstall": "husky uninstall",
    "hooks:test": "echo 'test commit message' | npx commitlint",
    "commit:help": "echo 'Use: npm run commit' for guided commits",
    "pre-commit:test": "lint-staged",
    "validate": "npm run type-check && npm run lint && npm run format:check",
    "clean:hooks": "rm -rf .husky && husky install"
  }
}
```

## Acceptance Criteria

- [ ] Husky is properly installed and configured
- [ ] Pre-commit hooks run lint-staged successfully
- [ ] Pre-push hooks validate code quality
- [ ] Commit message linting is enforced
- [ ] Branch naming conventions are validated
- [ ] All team members can install hooks with npm install
- [ ] Hooks can be bypassed when necessary (emergency commits)
- [ ] Performance impact is minimal
- [ ] Clear error messages guide developers

## Testing Instructions

### 1. Test Pre-commit Hook

```bash
# Make changes to a file
echo "console.log('test');" >> src/test.ts

# Try to commit
git add .
git commit -m "test: add console log"
# Should fail due to console.log check

# Fix the file and commit again
rm src/test.ts
git add .
git commit -m "test: remove test file"
# Should succeed
```

### 2. Test Commit Message Validation

```bash
# Test invalid commit message
git commit --allow-empty -m "bad commit message"
# Should fail

# Test valid commit message
git commit --allow-empty -m "feat: add new feature"
# Should succeed
```

### 3. Test Pre-push Hook

```bash
# Create a branch with code issues
git checkout -b test-branch
echo "const unused = 'variable';" >> src/test.ts
git add .
git commit -m "feat: add test code"

# Try to push
git push origin test-branch
# Should fail due to unused variable

# Fix and push again
git reset HEAD~1
rm src/test.ts
git commit --allow-empty -m "feat: add clean code"
git push origin test-branch
# Should succeed
```

### 4. Test Lint-staged

```bash
# Test lint-staged directly
npm run lint:staged
```

### 5. Test Interactive Commits

```bash
# Use commitizen for guided commits
npm run commit
```

## References and Dependencies

### Dependencies

- `husky`: Git hooks management
- `lint-staged`: Run commands on staged files
- `@commitlint/cli`: Commit message linting
- `@commitlint/config-conventional`: Conventional commit rules
- `commitizen`: Interactive commit tool

### Documentation

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Estimated Time

**3-4 hours**

- Husky setup and configuration: 1-2 hours
- Hook script creation: 1-2 hours
- Testing and validation: 1-2 hours
- Documentation and team onboarding: 1 hour

## Troubleshooting

### Common Issues

1. **Hooks not running**

   ```bash
   # Reinstall Husky
   npx husky uninstall
   npx husky install
   chmod +x .husky/*
   ```

2. **Permission denied errors**

   ```bash
   # Make hooks executable
   chmod +x .husky/pre-commit
   chmod +x .husky/pre-push
   chmod +x .husky/commit-msg
   ```

3. **Bypassing hooks in emergencies**

   ```bash
   # Skip pre-commit hook
   git commit -m "emergency fix" --no-verify

   # Skip pre-push hook
   git push --no-verify
   ```

4. **lint-staged not finding files**
   - Ensure files are staged: `git add .`
   - Check glob patterns in configuration
   - Verify file extensions match patterns

5. **Performance issues with large repositories**
   - Use more specific glob patterns
   - Consider running checks only on changed files
   - Optimize ESLint and Prettier configurations

## Team Onboarding

### Setup Instructions for New Team Members

1. Clone the repository
2. Run `npm install` (hooks will be installed automatically)
3. Test the setup: `npm run hooks:test`
4. Try making a commit to verify hooks work

### Emergency Procedures

- Use `--no-verify` flag to bypass hooks in emergencies
- Always follow up emergency commits with proper validation
- Document any bypassed checks for review
