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
  '*.md': ['prettier --write'],

  // Package.json
  'package.json': ['prettier --write'],
};
