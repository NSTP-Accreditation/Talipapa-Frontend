# Contributing to Talipapa-Web

Thank you for your interest in contributing to Talipapa-Web! This guide will help you understand our project structure and development workflow.

## 📁 File Organization Guidelines

### Naming Conventions

#### Files and Folders
- **Components**: Use PascalCase (e.g., `UserProfile.jsx`, `ProductCard.jsx`)
- **Utilities**: Use camelCase (e.g., `formatCurrency.js`, `validateEmail.js`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`, `ERROR_MESSAGES.js`)
- **Hooks**: Prefix with `use` in camelCase (e.g., `useAuth.js`, `useLocalStorage.js`)
- **Folders**: Use kebab-case for multi-word folders (e.g., `user-profile/`, `product-management/`)

#### CSS Classes
- Use kebab-case for CSS classes (e.g., `.user-profile`, `.product-card`)
- Use BEM methodology when appropriate (e.g., `.card__header`, `.card__header--active`)

### Directory Structure Rules

#### Components (`src/components/`)
```
components/
├── Button/
│   ├── Button.jsx          # Main component
│   ├── Button.module.css   # Component styles
│   ├── Button.test.js      # Unit tests
│   └── index.js            # Export file
├── UserProfile/
│   ├── UserProfile.jsx
│   ├── UserProfile.module.css
│   ├── components/         # Sub-components if needed
│   │   ├── Avatar/
│   │   └── ContactInfo/
│   └── index.js
└── common/                 # Shared/generic components
    ├── Modal/
    ├── Loading/
    └── ErrorBoundary/
```

#### Pages (`src/pages/`)
```
pages/
├── Home/
│   ├── Home.jsx
│   ├── Home.module.css
│   ├── components/         # Page-specific components
│   └── index.js
├── Dashboard/
│   ├── Dashboard.jsx
│   ├── Dashboard.module.css
│   ├── hooks/             # Page-specific hooks
│   └── services/          # Page-specific services
└── Auth/
    ├── Login/
    ├── Register/
    └── ForgotPassword/
```

#### Services (`src/services/`)
```
services/
├── api/
│   ├── auth.js            # Authentication API calls
│   ├── users.js           # User-related API calls
│   ├── products.js        # Product-related API calls
│   └── index.js           # API service exports
├── storage/
│   ├── localStorage.js    # Local storage utilities
│   └── sessionStorage.js  # Session storage utilities
└── validation/
    ├── userValidation.js  # User input validation
    └── formValidation.js  # Form validation utilities
```

#### Utils (`src/utils/`)
```
utils/
├── formatters/
│   ├── currency.js        # Currency formatting
│   ├── date.js           # Date formatting
│   └── text.js           # Text formatting
├── helpers/
│   ├── auth.js           # Authentication helpers
│   ├── navigation.js     # Navigation helpers
│   └── api.js            # API helpers
└── constants/
    ├── routes.js         # Route constants
    ├── apiEndpoints.js   # API endpoint constants
    └── appConfig.js      # App configuration
```

### File Structure Templates

#### Component Template
```jsx
// ComponentName.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentName.module.css';

const ComponentName = ({ prop1, prop2, ...props }) => {
  return (
    <div className={styles.container} {...props}>
      {/* Component content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

#### Service Template
```javascript
// serviceName.js
import api from './api';

export const serviceName = {
  // Get all items
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/endpoint', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }
  },

  // Get single item by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/endpoint/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch item: ${error.message}`);
    }
  },

  // Create new item
  create: async (data) => {
    try {
      const response = await api.post('/endpoint', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create item: ${error.message}`);
    }
  }
};
```

#### Hook Template
```javascript
// useHookName.js
import { useState, useEffect } from 'react';

export const useHookName = (initialValue) => {
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Effect logic here
  }, []);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Action logic here
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    state,
    loading,
    error,
    handleAction
  };
};
```

## 🔄 Development Workflow

### 1. Before You Start
- Check the existing file structure
- Ensure your changes follow the naming conventions
- Read through related documentation

### 2. Making Changes
- Create feature branches from `main`
- Place files in the appropriate directories
- Follow the established patterns and templates
- Write tests for new functionality

### 3. Code Quality
- Run linting: `npm run lint`
- Format code: `npm run format`
- Run tests: `npm test`
- Update documentation if needed

### 4. Pull Request Guidelines
- Use descriptive commit messages
- Include tests for new features
- Update relevant documentation
- Follow the file organization guidelines

## 📋 Checklist for New Features

- [ ] Files are placed in correct directories
- [ ] Naming conventions are followed
- [ ] Component structure follows templates
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No linting errors
- [ ] Code is properly formatted

## 🚫 What to Avoid

- Don't create deeply nested folder structures (max 3-4 levels)
- Don't mix different concerns in the same file
- Don't use generic names like `helper.js` or `utils.js`
- Don't skip the index.js export files for components
- Don't put large files in the root of directories

## 🤝 Getting Help

If you have questions about file organization or where to place your code:
1. Check this guide first
2. Look at similar existing code
3. Ask in the project discussions
4. Create an issue for clarification

## 📚 Additional Resources

- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [CSS Architecture Guidelines](https://css-tricks.com/sass-style-guide/)