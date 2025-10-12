<div align="center">

# 🌿 Talipapa-Frontend

### Barangay Information System with EcoCycle Trading Platform

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**An integrated platform for Barangay Talipapa featuring waste management, community services, and administrative tools.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-routes) • [Contributing](#-development-guidelines)

</div>

---

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔄 EcoCycle Trading

Earn points by submitting recyclable waste and swap them for community products. Real-time tracking and automated point calculation.

</td>
<td width="50%">

### 📦 Unified Inventory

All-in-one inventory management with tabs for overview, products, and materials. Track stock levels and point values.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Admin Dashboard

Comprehensive analytics, trading statistics, and content management. Real-time insights for decision making.

</td>
<td width="50%">

### 🔐 Secure & Modular

Protected routes with authentication, custom hooks for API integration, and clean separation of admin/user modules.

</td>
</tr>
<tr>
<td width="50%">

### 📝 Community Portal

Guidelines for barangay services, news & events, achievements, and official information.

</td>
<td width="50%">

### ⚡ Modern Stack

Built with React 18, TypeScript, Vite, and Tailwind CSS for optimal performance and developer experience.

</td>
</tr>
</table>

---

## 📁 Project Structure

<details>
<summary>Click to expand full structure</summary>

```
src/
├── admin/              # 🔒 Admin panel module
│   ├── auth/
│   │   └── AdminLogin.tsx
│   ├── components/     # Admin-specific components
│   │   ├── AdminHeader.tsx
│   │   ├── MenuBar.tsx
│   │   ├── Login.tsx
│   │   ├── Logout.tsx
│   │   ├── FloatingLabelInput.jsx
│   │   ├── ErrorMessage.tsx
│   │   ├── SuccessMessage.tsx
│   │   ├── WarningMessage.tsx
│   │   ├── InformationalMessage.tsx
│   │   └── Failed.tsx
│   ├── layout/
│   │   └── AdminLayout.tsx
│   ├── pages/          # 📄 Admin page components
│   │   ├── Dashboard.tsx
│   │   ├── AboutUs.tsx
│   │   ├── Achievements.tsx
│   │   ├── Guidelines.tsx
│   │   ├── NewsEvents.tsx
│   │   ├── Settings.tsx
│   │   ├── Records.tsx           # Trading transaction records
│   │   ├── EarnPoints.tsx        # Waste submission management
│   │   ├── SwapItem.tsx          # Point redemption (Trade Points)
│   │   ├── TradingStatistics.tsx # Trading analytics
│   │   └── Inventory.tsx         # Inventory management (all-in-one)
│   ├── hooks/          # 🪝 Custom React hooks
│   │   ├── useAuthFetch.ts
│   │   └── useFetchData.ts
│   ├── formatters/
│   │   └── currency.js
│   └── index.ts        # Admin module exports
│
├── users/              # 👥 Public user-facing module
│   ├── components/     # User page components
│   │   ├── NavBar.jsx
│   │   ├── Footer.jsx
│   │   ├── Carousel.jsx
│   │   ├── Achievement.jsx
│   │   ├── MissionVision.jsx
│   │   ├── AboutBarangay.jsx
│   │   └── CalendarEvents.jsx
│   ├── page/           # 📄 User pages
│   │   ├── Home.jsx
│   │   ├── AboutUs.jsx
│   │   ├── Guidelines.tsx
│   │   ├── GuideTemplate.tsx
│   │   ├── MoreGuides.tsx
│   │   └── Trading.tsx
│   └── guidelines/
│       ├── main.tsx
│       └── guides/
│           ├── UnifiedGuide.tsx
│           └── guideData.ts
│
├── components/         # 🧩 Shared components
│   ├── ui/            # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── index.ts
│   ├── ProtectedRoute.tsx
│   ├── ImageWithFallback.tsx
│   └── utils.ts
│
├── contexts/           # 🔄 React contexts
│   └── AuthContext.tsx
│
├── styles/             # 🎨 Global styles
│   ├── globals.css
│   ├── tailwind.css
│   └── variables.css
│
├── utils/              # 🛠️ Utility functions
│   ├── constants/
│   │   └── routes.js
│   └── formatter.js
│
├── App.jsx             # 🚀 Main app component
└── main.jsx            # 🎯 Application entry point
```

</details>

---

## 🛠️ Tech Stack

| Category               | Technologies                    |
| ---------------------- | ------------------------------- |
| **Frontend Framework** | React 18.3.1 + TypeScript 5.5.3 |
| **Build Tool**         | Vite 5.4.1                      |
| **Styling**            | Tailwind CSS 3.4.1 + PostCSS    |
| **UI Components**      | shadcn/ui + Radix UI            |
| **Routing**            | React Router DOM v6             |
| **Icons**              | Lucide React                    |
| **State Management**   | React Context API + Hooks       |

---

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/NSTP-Accreditation/Talipapa-Frontend.git

# Navigate to project directory
cd Talipapa-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
# 🌐 Server runs at http://localhost:3000
```

### Available Scripts

| Command                | Description               |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start development server  |
| `npm run build`        | Build for production      |
| `npm run preview`      | Preview production build  |
| `npm run format`       | Format code with Prettier |
| `npm run format:check` | Check code formatting     |
| `npm run lint:css`     | Lint CSS with Stylelint   |
| `npx tsc --noEmit`     | TypeScript type checking  |

---

---

## 🗺️ Routes

### 🌐 Public Routes

| Route                    | Description                             |
| ------------------------ | --------------------------------------- |
| `/`                      | Home page with mission/vision, carousel |
| `/guidelines`            | Barangay service guides                 |
| `/guidelines/:guideName` | Individual guide pages                  |
| `/trading`               | EcoCycle waste calculator               |
| `/aboutus`               | About barangay officials                |

### 🔒 Admin Routes (Protected)

<details>
<summary>View all admin routes</summary>

| Route                            | Description                    |
| -------------------------------- | ------------------------------ |
| `/admin/login`                   | 🔐 Admin authentication        |
| `/admin/dashboard`               | 📊 Analytics & overview        |
| `/admin/residents`               | 👥 Resident records management |
| **Trading System**               |                                |
| `/admin/trading/earn-points`     | 💰 Waste submission records    |
| `/admin/trading/statistics`      | 📈 Trading statistics          |
| `/admin/trading/swap-item`       | 🔄 Point redemption            |
| **Inventory Management**         |                                |
| `/admin/inventory?tab=overview`  | 📦 Inventory overview          |
| `/admin/inventory?tab=products`  | 📦 Product management          |
| `/admin/inventory?tab=materials` | ♻️ Material tracking           |
| **Content Management**           |                                |
| `/admin/guidelines`              | 📝 Manage service guidelines   |
| `/admin/news`                    | 📰 News & announcements        |
| `/admin/about`                   | ℹ️ Edit about page content     |
| `/admin/about/achievements`      | 🏆 Manage achievements         |
| `/admin/talipapa-natin`          | 🌿 Talipapa community section  |
| `/admin/settings`                | ⚙️ System settings             |

</details>

---

---

## 🎨 Design System

### 🎨 Color Palette

```css
/* Brand Colors */
--primary-green: #1a4d2e /* Main brand color */ --light-background: #f6f6f6
  /* Container backgrounds */ --secondary-gray: #838383
  /* Secondary text and icons */ /* Legacy Support */ --legacy-primary: #1b4c2e
  /* Primary */ --legacy-accent: #16a34a /* Accent */ --legacy-teal: #0d9488
  /* Teal */;
```

### 📐 Typography Scale

| Level          | Size        | Weight | Usage          |
| -------------- | ----------- | ------ | -------------- |
| **Hero**       | `text-4xl`  | Bold   | Main headings  |
| **Heading**    | `text-3xl`  | Bold   | Section titles |
| **Subheading** | `text-2xl`  | Bold   | Card headers   |
| **Body Large** | `text-lg`   | Medium | Descriptions   |
| **Body**       | `text-base` | Normal | Content        |
| **Small**      | `text-sm`   | Normal | Meta info      |

### 📏 Spacing System

| Token              | Value        | Usage                  |
| ------------------ | ------------ | ---------------------- |
| **Container**      | `space-y-12` | Between major sections |
| **Card Padding**   | `p-10`       | Inside cards           |
| **Grid Gap**       | `gap-10`     | Card layouts           |
| **Icon Container** | `p-3`        | Around icons           |

### 🎯 Icon Sizes

| Context         | Size | Class       |
| --------------- | ---- | ----------- |
| **Stats Icons** | 48px | `w-12 h-12` |
| **Navigation**  | 20px | `w-5 h-5`   |
| **Submenu**     | 16px | `w-4 h-4`   |
| **Inline**      | 24px | `w-6 h-6`   |

---

---

## 🔧 Development Guidelines

### 💅 Styling Best Practices

```tsx
// ✅ Use Tailwind utilities with brand colors
<div className="p-10 space-y-8" style={{ backgroundColor: '#F6F6F6' }}>
  <Icon className="w-12 h-12" style={{ color: '#1a4d2e' }} />
</div>;

// ✅ Use path aliases for imports
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### 🏗️ Component Architecture

- **Functional Components:** Use React functional components with hooks
- **TypeScript:** Add proper type definitions for props and state
- **Code Organization:** Separate admin and user modules
- **Reusable UI:** Use shadcn/ui components for consistency

### 🔐 Authentication Flow

```tsx
// Protected routes use ProtectedRoute wrapper
<Route
  path="/admin/*"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
/>;

// Custom hooks for API calls
const { data, loading, error } = useFetchData('/api/endpoint');
const { fetchWithAuth } = useAuthFetch();
```

### 📦 State Management

- **Local State:** `useState` for component-level state
- **Global State:** Context API (`AuthContext`) for auth
- **Effects:** `useEffect` for side effects and data fetching
- **Custom Hooks:** Reusable logic in `hooks/` directory

---

---

## 🗄️ Key Features

### 📊 Trading System

| Feature                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| **Records**            | Comprehensive transaction tracking with filtering and search |
| **Earn Points**        | Waste submission approval workflow with real-time stats      |
| **Swap Item**          | Product redemption with inventory management                 |
| **Trading Statistics** | Analytics and insights for trading activities                |

### 📦 Inventory Management

> **Unified Dashboard:** Single-page inventory management with tabbed interface

- ✅ **Overview Tab:** Dashboard with stats, quick actions, and activity tracking
- ✅ **Products Section:** Manage tradeable products (compost, fertilizers, tools)
- ✅ **Materials Section:** Track recyclable materials with point values per kg
- ✅ **Real-time Stats:** Total products, materials, low stock alerts, out of stock tracking

### 🎛️ Admin Dashboard

- 📈 **Real-time Stats:** Trading volume, resident activity, inventory levels
- 📰 **News & Events:** Manage announcements and community events
- ✍️ **Content Management:** Edit guidelines, about page, achievements
- 🔌 **Custom Hooks:** `useAuthFetch` and `useFetchData` for API integration

---

## 📦 Build Configuration

| File                  | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `vite.config.ts`      | Vite configuration with path aliases (`@/`)  |
| `tsconfig.json`       | TypeScript compiler options with strict mode |
| `tailwind.config.cjs` | Tailwind CSS custom theme and utilities      |
| `postcss.config.cjs`  | PostCSS plugins for CSS processing           |

---

## 🔐 Authentication

The application uses a **Context-based authentication system**:

```tsx
// Login flow
1. User enters credentials at /admin/login
2. AuthContext validates and stores auth state
3. ProtectedRoute components check authentication
4. Unauthorized users redirected to login

// Logout flow
- Logout button in admin sidebar
- Clears auth state from context
- Redirects to login page
```

### Session Management

- Auth state managed via React Context API
- Custom hooks (`useAuthFetch`) handle authenticated requests
- Protected routes automatically validate auth state

---

<div align="center">

## 📞 Contact & Support

**NSTP Accreditation - Barangay Talipapa**

[Report Bug](https://github.com/NSTP-Accreditation/Talipapa-Frontend/issues) • [Request Feature](https://github.com/NSTP-Accreditation/Talipapa-Frontend/issues) • [Documentation](https://github.com/NSTP-Accreditation/Talipapa-Frontend/wiki)

---

**Last Updated:** October 12, 2025

Made with 💚 for Barangay Talipapa

</div>
