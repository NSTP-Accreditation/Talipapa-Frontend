# Talipapa-Web

Barangay Information System with EcoCycle Trading Platform for Barangay Talipapa.

## 🌟 Features

- **EcoCycle Trading** - Calculate recyclable waste points, exchange for community goods
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
└── utils/             # Routes & helpers
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Radix UI** 
- **React Router** + **Lucide Icons**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Format & lint
npm run format:check  # prettier
npm run lint:css
```

## 🗺️ Routes

**Public:** `/`, `/guidelines`, `/trading`, `/aboutus`

**Admin:** `/admin/dashboard`, `/admin/trading`, `/admin/news`, `/admin/settings`

## 🎨 Development

- **Colors:** Primary Green `#1b4c2e`, Accent `#16a34a`, Teal `#0d9488`
- **Styling:** Tailwind CSS utilities + Radix UI components
- **Imports:** Use `@/` alias (e.g., `@/components/ui/button`)
- **Auth:** Protected routes with `AuthContext`

---

**NSTP Accreditation - Barangay Talipapa** | Last Updated: October 8, 2025
