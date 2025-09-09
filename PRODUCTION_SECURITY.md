# Production Security Configuration

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# API Configuration
AUTH_API_URL=https://api.echoreads.online/api/v1/user/login

# Cloudflare R2 Configuration
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
NEXT_PUBLIC_CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL=https://pub-b8050509235e4bcca261901d10608e30.r2.dev

# Security
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

# Performance
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## Security Headers

The application includes the following security headers:

- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME type sniffing)
- **Referrer-Policy**: origin-when-cross-origin
- **X-XSS-Protection**: 1; mode=block (XSS protection)
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains (HTTPS enforcement)

## Production Build

### Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Production Optimizations
- Source maps disabled in production
- SWC minification enabled
- Response compression enabled
- Image optimization enabled
- All console.log statements removed

## Security Checklist

- [ ] Environment variables properly configured
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Authentication tokens secured
- [ ] File upload validation enabled
- [ ] Error messages sanitized
- [ ] No sensitive data in client-side code

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure HTTPS is enabled
- Set NODE_ENV=production
- Configure environment variables
- Enable compression
- Set up proper CORS headers 