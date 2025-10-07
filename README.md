# Talipapa-Web

A modern web application built with React for Barangay Talipapa Test

## 📁 Project Structure

```
Talipapa-Web/
├── 📂 src/                    # Source code
│   ├── 📂 components/         # Reusable UI components
│   ├── 📂 pages/              # Page components/views
│   ├── 📂 styles/             # CSS/SCSS stylesheets
│   ├── 📂 utils/              # Utility functions
│   ├── 📂 services/           # API calls and external services
│   ├── 📂 hooks/              # Custom React hooks
│   ├── 📂 context/            # React Context providers
│   └── 📂 assets/             # Images, fonts, static files
├── 📂 public/                 # Static public assets
│   ├── 📂 images/             # Public images
│   ├── 📂 icons/              # Icons and favicons
│   ├── 📂 fonts/              # Font files
│   └── index.html             # Main HTML template
├── 📂 docs/                   # Documentation files
├── 📂 config/                 # Configuration files
├── 📂 tests/                  # Test files
├── 📂 scripts/                # Build and deployment scripts
├── package.json               # Dependencies and scripts
├── .gitignore                 # Git ignore rules
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

-
-

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run lint:css         # Lint and fix CSS files
npm run lint:css:check   # Check CSS for errors
```

> **Note:** A major CSS refactoring was completed on October 7, 2025. See [REFACTOR.md](./REFACTOR.md) for details on the new structure, dark mode support, and migration guide.

## 📖 File Organization Guide

### Components (`src/components/`)

- Place reusable UI components here
- Use PascalCase for component names
- Each component should have its own folder with:
  - `ComponentName.jsx` - Main component file
  - `ComponentName.module.css` - Component-specific styles
  - `index.js` - Export file

### Pages (`src/pages/`)

- Full page components/views
- Follow same naming convention as components
- Organize by feature or route

### Styles (`src/styles/`)

- `globals.css` - Main stylesheet (imports others)
- `variables.css` - All CSS custom properties & theming (light/dark)
- `tailwind.css` - Tailwind directives
- Component-specific styles: use Tailwind utilities when possible
- **Import alias:** Use `@/` for cleaner imports (e.g., `import Button from '@/components/ui/button'`)

### Utils (`src/utils/`)

- Helper functions and utilities
- Pure functions without side effects
- Use camelCase naming

### Services (`src/services/`)

- API calls and external service integrations
- Authentication logic
- Data fetching functions

### Hooks (`src/hooks/`)

- Custom React hooks
- Start with `use` prefix (e.g., `useAuth.js`)

### Context (`src/context/`)

- React Context providers
- Global state management
- Theme and user context
