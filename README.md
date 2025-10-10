# Talipapa-Web

A Barangay Information System and Content Management Platform for Barangay Talipapa. Features an eco-friendly recycling trading system (EcoCycle) and comprehensive administrative tools for barangay operations.

## 🌟 Key Features

- **EcoCycle Trading** - Calculate recyclable waste points and exchange for community goods
- **Admin Dashboard** - Real-time analytics and content management
- **Community Portal** - Guides, news, and barangay information
- **Secure Admin Panel** - Protected routes with authentication

## 📁 Project Structure

```
src/
├── components/         # UI components (NavBar, Footer, UI kit)
├── pages/             
│   ├── Home/          # Landing page
│   ├── aboutus/       # About page
│   ├── guidelines/    # Community guides
│   ├── trading/       # EcoCycle calculator
│   └── Admin/         # Admin panel & subcomponents
├── contexts/          # AuthContext
├── styles/            # Global CSS & Tailwind
├── utils/             # Routes & formatters
└── App.jsx            # Main app
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript** + **Vite** - Modern development
- **Tailwind CSS** + **Radix UI** - Styled components
- **React Router** - Navigation
- **Lucide React** - Icons

## �️ Routes

**Public:** `/`, `/guidelines`, `/trading`, `/aboutus`

**Admin (Protected):** `/admin/dashboard`, `/admin/trading`, `/admin/news`, `/admin/about`, `/admin/settings`

## �️ Application Routes

### Public Routes
- `/` - Home page
- `/guidelines` - How-to guides
- `/guidelines/more` - Extended guides
- `/trading` - EcoCycle trading calculator
- `/aboutus` - About the barangay

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin dashboard
- `/admin/trading` - Trading management hub
  - `/admin/trading/activity` - Activity logs
  - `/admin/trading/earn-points` - Earn points logs
  - `/admin/trading/swap` - Swap logs
- `/admin/about` - About Us management
- `/admin/about/achievements` - Achievements management
- `/admin/news` - News management
- `/admin/guidelines` - Guidelines management
- `/admin/settings` - System settings

## 🎨 Design System

**Colors:** Primary Green `#1b4c2e`, Green accents `#16a34a`, Teal `#0d9488`

**Components:** Tailwind utilities, Radix UI primitives, `@/` import alias

## 🔧 Development

- Use **PascalCase** for components
- **Tailwind CSS** for styling
- **AuthContext** for authentication
- Responsive, mobile-first design

## 📄 License

This project is private and proprietary to Barangay Talipapa.

## 👥 Contributors

Developed for NSTP Accreditation - Barangay Talipapa Website Project

---

**Last Updated:** October 8, 2025

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
