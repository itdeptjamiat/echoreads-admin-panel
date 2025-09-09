# EchoReads Admin Panel

A modern, feature-rich admin panel for managing EchoReads magazine subscriptions, users, and content. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 📊 Dashboard
- **Real-time Statistics**: User count, magazine count, and subscription metrics
- **Quick Actions**: Direct access to common admin tasks
- **Recent Activity**: Latest user and magazine updates
- **Visual Analytics**: Clean, modern dashboard interface

### 👥 User Management
- **User List**: View all registered users with search and pagination
- **User Details**: Comprehensive user profiles and activity
- **User Creation**: Add new users with role assignment
- **User Deletion**: Remove users with confirmation
- **User Editing**: Update user information and permissions

### 📚 Magazine Management
- **Magazine List**: Browse all magazines with filtering options
- **Magazine Creation**: Upload new magazines with cover images and PDFs
- **Magazine Editing**: Update magazine details, images, and files
- **Magazine Deletion**: Remove magazines with confirmation
- **File Upload**: Cloudflare R2 integration for secure file storage
- **Category Management**: Organize magazines by categories

### 💰 Subscription Plans
- **Plan Management**: Create, edit, and delete subscription plans
- **Plan Types**: Free, EchoPro, and EchoPro Plus plans
- **Feature Management**: Add/remove features for each plan
- **Pricing Control**: Set prices, discounts, and duration
- **Usage Limits**: Configure download and magazine limits
- **Bulk Operations**: Manage multiple plans efficiently

### 🔔 Notification System
- **Real-time Notifications**: Toast notifications for all actions
- **Notification History**: View past notifications
- **Settings Management**: Configure notification preferences
- **Global State**: Consistent notification handling across the app

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Admin-only access to sensitive areas
- **Role-based Access**: Different permissions for different user types
- **Session Management**: Automatic token refresh and logout
- **CORS Protection**: Secure cross-origin request handling

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.4.4**: React framework with SSR and API routes
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management
- **Context API**: Global state management

### Backend Integration
- **External API**: Integration with EchoReads backend services
- **JWT Tokens**: Secure authentication
- **RESTful APIs**: Standard HTTP methods for all operations
- **Error Handling**: Comprehensive error management

### File Storage
- **Cloudflare R2**: Cloud storage for magazine files and images
- **File Upload**: Drag-and-drop and click-to-upload
- **Image Optimization**: Automatic image processing
- **PDF Handling**: Secure PDF storage and retrieval

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing
- **Hot Reload**: Fast development experience
- **TypeScript**: Static type checking

## 📁 Project Structure

```
echoreads-Admin_panel-main/
├── components/                 # React components
│   ├── auth/                  # Authentication components
│   ├── common/                # Shared UI components
│   ├── dashboard/             # Dashboard-specific components
│   ├── layouts/               # Layout components
│   ├── magazines/             # Magazine management components
│   ├── plans/                 # Subscription plan components
│   └── ui/                    # Reusable UI components
├── lib/                       # Utility libraries
│   ├── api.ts                 # API integration functions
│   ├── authContext.tsx        # Authentication context
│   ├── cloudflareStorage.ts   # File storage utilities
│   ├── config.ts              # Configuration constants
│   ├── mockData.ts            # Mock data for development
│   ├── notificationContext.tsx # Notification system
│   ├── simpleUpload.ts        # File upload utilities
│   └── tokenManager.ts        # Token management
├── pages/                     # Next.js pages and API routes
│   ├── api/                   # API endpoints
│   │   ├── auth/              # Authentication APIs
│   │   ├── categories/        # Category management APIs
│   │   ├── magazines/         # Magazine management APIs
│   │   ├── plans/             # Plan management APIs
│   │   ├── users/             # User management APIs
│   │   ├── r2-url.js          # Cloudflare R2 URL generation
│   │   └── upload.ts          # File upload API
│   ├── admin/                 # Admin-specific pages
│   ├── categories/            # Category management pages
│   ├── magazines/             # Magazine management pages
│   ├── plans/                 # Plan management pages
│   ├── users/                 # User management pages
│   ├── _app.tsx               # App wrapper
│   ├── _document.tsx          # Document wrapper
│   ├── index.tsx              # Dashboard page
│   ├── notifications.tsx      # Notification management
│   └── settings.tsx           # Settings page
├── public/                    # Static assets
├── styles/                    # Global styles
├── .eslintrc.js              # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- EchoReads backend API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd echoreads-Admin_panel-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   AUTH_API_URL=https://api.echoreads.online/api/v1/user/login
   NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   NEXT_PUBLIC_CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
   NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME=your_bucket_name
   NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL=https://pub-b8050509235e4bcca261901d10608e30.r2.dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Environment variables for production**
   See `PRODUCTION_SECURITY.md` for detailed configuration.

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Authentication
All API endpoints require JWT authentication via Bearer token in the Authorization header.

### Core Endpoints

#### Users
- `GET /api/users` - Fetch all users
- `POST /api/users/create` - Create new user
- `DELETE /api/users/delete` - Delete user
- `GET /api/users/[uid]` - Get user details

#### Magazines
- `GET /api/magazines` - Fetch all magazines
- `POST /api/magazines/create` - Create new magazine
- `PUT /api/magazines/update` - Update magazine
- `DELETE /api/magazines/delete` - Delete magazine
- `GET /api/magazines/[mid]` - Get magazine details

#### Plans
- `GET /api/plans` - Fetch all plans
- `POST /api/plans/create` - Create new plan
- `PUT /api/plans/update` - Update plan
- `DELETE /api/plans/delete` - Delete plan

#### Categories
- `GET /api/categories` - Fetch all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories` - Update category
- `DELETE /api/categories` - Delete category

## 🎨 UI Components

### Design System
- **Color Palette**: Consistent blue and purple theme
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing using Tailwind utilities
- **Components**: Reusable, accessible components

### Key Components
- **AdminLayout**: Main layout with sidebar navigation
- **SimplePlanCard**: Attractive plan display cards
- **EditPlanForm**: Comprehensive plan editing modal
- **DeletePlanModal**: Confirmation dialogs
- **NotificationDropdown**: Real-time notification system
- **SettingsDropdown**: User settings and preferences

## 🔧 Configuration

### Tailwind CSS
Custom configuration for consistent design system:
- Custom color palette
- Responsive breakpoints
- Component-specific utilities

### Next.js
Optimized for production:
- Image optimization
- API route handling
- Static generation where possible
- Error boundaries

### TypeScript
Strict type checking for:
- API responses
- Component props
- State management
- Utility functions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Heroku

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Admin-only access control
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Secure error responses
- **File Upload Security**: Validated file types and sizes

## 📊 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient caching strategies
- **Bundle Optimization**: Minimal bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for EchoReads. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

### v1.0.0 (Current)
- Complete admin panel functionality
- User, magazine, and plan management
- Real-time notifications
- File upload system
- Production-ready deployment

---

**Built with ❤️ for EchoReads**#   e c h o r e a d s - a d m i n - p a n e l 
 
 