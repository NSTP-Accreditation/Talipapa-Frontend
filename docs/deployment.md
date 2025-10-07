# Deployment Guide

## Production Deployment

### Prerequisites

- Node.js runtime environment
- Web server (Nginx, Apache, or similar)
- SSL certificate for HTTPS

### Build Process

1. Install dependencies:

   ```bash
   npm install --production
   ```

2. Build the application:

   ```bash
   npm run build
   ```

3. The `build/` directory contains the production-ready files

### Environment Variables

Create a `.env` file with production values:

```
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_AUTH_DOMAIN=your-auth-domain
# Add other production environment variables
```

### Web Server Configuration

#### Nginx Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Deployment

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Development Deployment

Use the development server for local testing:

```bash
npm start
```
