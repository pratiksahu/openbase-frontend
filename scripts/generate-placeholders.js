const fs = require('fs');
const path = require('path');

// Simple SVG avatar generator
function generateAvatar(name, initials, bgColor) {
  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${bgColor}" />
  <text x="100" y="100" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="white">
    ${initials}
  </text>
</svg>`;
}

// Generate placeholder image
function generatePlaceholder() {
  return `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#e5e7eb" />
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" dominant-baseline="central" fill="#9ca3af">
    Placeholder Image
  </text>
</svg>`;
}

// Avatar data
const avatars = [
  {
    filename: 'sarah.jpg',
    name: 'Sarah Johnson',
    initials: 'SJ',
    bgColor: '#8b5cf6',
  },
  {
    filename: 'mike.jpg',
    name: 'Mike Chen',
    initials: 'MC',
    bgColor: '#3b82f6',
  },
  {
    filename: 'emma.jpg',
    name: 'Emma Davis',
    initials: 'ED',
    bgColor: '#ec4899',
  },
];

// Create avatars directory if it doesn't exist
const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate avatar files (as SVG, though named .jpg for compatibility)
avatars.forEach(({ filename, name, initials, bgColor }) => {
  const svg = generateAvatar(name, initials, bgColor);
  const svgFilename = filename.replace('.jpg', '.svg');
  fs.writeFileSync(path.join(avatarsDir, svgFilename), svg);
  console.log(`Created ${svgFilename}`);
});

// Generate placeholder image
const placeholderSvg = generatePlaceholder();
fs.writeFileSync(path.join(imagesDir, 'placeholder.svg'), placeholderSvg);
console.log('Created placeholder.svg');

console.log(
  '\nNote: SVG files created. You may need to convert them to actual images or update the code to use SVG files.'
);
