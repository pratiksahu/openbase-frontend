# TASK_007: ESLint and Prettier Setup

## Overview
Establish a comprehensive code quality and formatting system using ESLint and Prettier to maintain consistent code standards across the project. This task focuses on configuring automated linting, formatting, and code quality enforcement.

## Objectives
- Install and configure ESLint for code quality checking
- Set up Prettier for consistent code formatting
- Create configuration files for both tools
- Integrate with VS Code for seamless development experience
- Ensure compatibility with TypeScript and React

## Implementation Steps

### 1. Install Dependencies

```bash
# Install ESLint and related packages
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install ESLint plugins for React and Next.js
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y @next/eslint-config-next

# Install Prettier and integration packages
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Install additional useful plugins
npm install --save-dev eslint-plugin-import eslint-plugin-unused-imports
```

### 2. Create ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "unused-imports"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {}
    }
  },
  "rules": {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-const": "error",
    
    // React specific rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // Import rules
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ],
    
    // Accessibility rules
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    
    // General code quality
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error"
  },
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "out/",
    "build/",
    "dist/",
    "*.config.js"
  ]
}
```

### 3. Create Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 4. Create Prettier Ignore File

Create `.prettierignore`:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
.next/
out/
build/
dist/

# Generated files
*.tsbuildinfo
next-env.d.ts

# Package manager
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment files
.env*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### 5. Add Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "code-quality": "npm run type-check && npm run lint && npm run format:check"
  }
}
```

### 6. Configure VS Code Settings

Create or update `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.insertFinalNewline": true,
  "editor.trimAutoWhitespace": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### 7. Add VS Code Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "christian-kohler.npm-intellisense"
  ]
}
```

### 8. Create ESLint Override for Specific Files

For files that need special treatment, create additional configurations:

```javascript
// eslint.config.js (alternative flat config format)
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  // Override for config files
  {
    files: ['*.config.{js,ts}', '.*rc.{js,ts}'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },
];
```

## Acceptance Criteria

- [ ] ESLint is configured and running without errors
- [ ] Prettier formats code consistently across all files
- [ ] VS Code automatically formats code on save
- [ ] Import statements are automatically organized
- [ ] TypeScript errors are caught by ESLint
- [ ] Accessibility rules are enforced
- [ ] No console warnings or errors in clean codebase
- [ ] Code formatting is consistent with team standards

## Testing Instructions

### 1. Test ESLint Configuration
```bash
# Run linting on entire project
npm run lint

# Test automatic fix capability
npm run lint:fix

# Verify no linting errors remain
npm run lint
```

### 2. Test Prettier Integration
```bash
# Format all files
npm run format

# Check if any files need formatting
npm run format:check
```

### 3. Test VS Code Integration
1. Open any `.ts` or `.tsx` file
2. Add intentional formatting issues (extra spaces, wrong quotes)
3. Save the file - formatting should auto-correct
4. Add ESLint violations (unused variables, console.log)
5. Verify red squiggly lines appear

### 4. Test Import Organization
1. Create a file with unorganized imports
2. Save the file
3. Verify imports are automatically sorted and grouped

## References and Dependencies

### Dependencies
- `eslint`: Core ESLint package
- `@typescript-eslint/parser`: TypeScript parser for ESLint
- `@typescript-eslint/eslint-plugin`: TypeScript rules
- `eslint-plugin-react`: React-specific rules
- `eslint-plugin-react-hooks`: React Hooks rules
- `prettier`: Code formatter
- `eslint-config-prettier`: Disables conflicting ESLint rules

### Documentation
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)

## Estimated Time
**4-6 hours**

- Configuration setup: 2-3 hours
- VS Code integration: 1-2 hours
- Testing and fine-tuning: 1-2 hours
- Documentation: 1 hour

## Troubleshooting

### Common Issues

1. **ESLint and Prettier conflicts**
   - Ensure `eslint-config-prettier` is last in extends array
   - Use `eslint-plugin-prettier` for integration

2. **VS Code not formatting on save**
   - Check VS Code settings
   - Ensure Prettier extension is installed and enabled
   - Verify file associations are correct

3. **TypeScript parsing errors**
   - Ensure `tsconfig.json` path is correct in ESLint config
   - Verify TypeScript parser is properly configured

4. **Import resolution issues**
   - Configure import resolver for TypeScript
   - Set up path mapping in both TypeScript and ESLint configs