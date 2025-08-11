# Ambient - Development Setup & Deployment Guide

## Prerequisites

Before setting up Ambient locally, ensure you have:

- **Node.js**: Version 18.17+ or 20.0+ (recommended)
- **npm**: Version 8+ (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge for testing

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/[username]/ambient.git
cd ambient
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages:
- Next.js 15.4.6 (React framework)
- TypeScript 5+ (type safety)
- Tailwind CSS 4 (styling)
- @vercel/og (Open Graph image generation)

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Verify Installation

Navigate to `http://localhost:3000` and verify:
- ✅ Main form loads correctly
- ✅ Time presets work (now, 30min, tonight, custom)
- ✅ Form validation shows errors for empty fields
- ✅ Confirmation screen appears after form submission
- ✅ Link generation and clipboard copy work

## Development Commands

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server (requires build first)
npm start

# Run ESLint for code quality
npm run lint

# Type checking
npx tsc --noEmit
```

### Development Workflow

```bash
# 1. Start development server
npm run dev

# 2. Make changes to files in src/
# 3. Browser automatically reloads

# 4. Before committing, run linting
npm run lint

# 5. Build to verify production compatibility
npm run build
```

## Project Structure Deep Dive

```
ambient/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/og/         # Open Graph image API
│   │   ├── i/[payload]/    # Dynamic intention pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ConfirmationScreen.tsx
│   │   ├── IntentionDisplay.tsx
│   │   └── IntentionForm.tsx
│   └── lib/               # Utility functions
│       └── intention.ts   # Core business logic
├── public/                # Static assets
├── docs/                  # Documentation
├── package.json          # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS config
├── next.config.ts       # Next.js configuration
└── render.yaml         # Deployment configuration
```

## Environment Variables

### Development Environment

No environment variables are required for local development. The application works entirely client-side.

### Production Environment

For production deployment on Render.com:

```yaml
# render.yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_ENCRYPTION_KEY
    generateValue: true  # Auto-generated (currently unused)
```

## Deployment Guide

### Render.com Deployment (Recommended)

Ambient is configured for automatic deployment on Render.com:

1. **Connect Repository**:
   - Create Render.com account
   - Connect GitHub repository
   - Render automatically detects `render.yaml`

2. **Automatic Build Process**:
   ```yaml
   buildCommand: npm install && npm run build
   startCommand: npm start
   ```

3. **Environment Setup**:
   - `NODE_ENV=production` (set automatically)
   - Auto-generated encryption key (for future features)

### Manual Deployment Options

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### Netlify Deployment
```bash
# Build locally
npm run build

# Upload dist/ folder to Netlify
# Configure build command: npm run build
# Configure publish directory: .next
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Configuration Files

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default configuration works for Ambient
  // Add customizations here as needed
};

export default nextConfig;
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

## Debugging & Troubleshooting

### Common Issues

#### 1. Build Fails with TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Fix common issues:
# - Missing type definitions
# - Incorrect prop types
# - Unused variables
```

#### 2. Styles Not Loading
```bash
# Verify Tailwind is properly configured
npm run build

# Check that globals.css imports Tailwind
# @import "tailwindcss";
```

#### 3. localStorage Issues in Development
```javascript
// Check browser developer tools
// Application > Local Storage > localhost:3000

// Clear localStorage if needed
localStorage.clear();
```

#### 4. Open Graph Images Not Generating
```bash
# Verify API route works:
curl http://localhost:3000/api/og?payload=test

# Check for Edge Runtime compatibility issues
# No Node.js APIs in /api/og/route.tsx
```

### Development Tools

#### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests
- **Application**: Inspect localStorage data
- **Elements**: Debug CSS styling

#### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Hero
- Prettier - Code formatter

## Testing Strategy

### Manual Testing Checklist

```markdown
- [ ] Form validation works for required fields
- [ ] Time presets set correct values
- [ ] Confirmation screen shows correct preview
- [ ] URL generation creates shareable links
- [ ] Intention display works for shared links
- [ ] Expiration logic works correctly
- [ ] localStorage tracks user interactions
- [ ] Open Graph images generate correctly
- [ ] Mobile responsive design works
- [ ] Accessibility features function properly
```

### Performance Testing

```bash
# Build and analyze bundle size
npm run build

# Check for performance issues
npx next build --analyze
```

### Cross-Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing Guidelines

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature: description"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

### Code Quality

- Run `npm run lint` before committing
- Ensure TypeScript compilation succeeds
- Test on mobile devices
- Verify accessibility compliance

This development setup ensures a smooth experience for contributors while maintaining the high quality and zero-friction philosophy of Ambient.