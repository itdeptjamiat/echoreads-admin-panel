# EchoReads Admin Panel - Project Structure

## 📁 Complete File Structure

```
echoreads-Admin_panel-main/
├── 📁 components/                          # React Components
│   ├── 📁 auth/                           # Authentication Components
│   │   ├── LoginForm.tsx                  # Admin login form
│   │   └── ProtectedRoute.tsx             # Route protection wrapper
│   │
│   ├── 📁 common/                         # Shared Components
│   │   ├── NotificationDropdown.tsx       # Notification system dropdown
│   │   └── SettingsDropdown.tsx           # Settings dropdown menu
│   │
│   ├── 📁 dashboard/                      # Dashboard Components
│   │   └── SummaryCard.tsx                # Dashboard statistics cards
│   │
│   ├── 📁 layouts/                        # Layout Components
│   │   └── AdminLayout.tsx                # Main admin layout with sidebar
│   │
│   ├── 📁 magazines/                      # Magazine Management Components
│   │   ├── EditMagazineForm.tsx           # Magazine editing modal
│   │   ├── MagazineForm.tsx               # Magazine creation form
│   │   └── MagazineTable.tsx              # Magazine listing table
│   │
│   ├── 📁 plans/                          # Subscription Plan Components
│   │   ├── BulkFeatureManager.tsx         # Bulk feature management modal
│   │   ├── DeletePlanModal.tsx            # Plan deletion confirmation
│   │   ├── EditPlanForm.tsx               # Plan editing form
│   │   ├── PlanForm.tsx                   # Plan creation form
│   │   └── SimplePlanCard.tsx             # Plan display cards
│   │
│   ├── 📁 ui/                             # Reusable UI Components
│   │   ├── Button.tsx                     # Reusable button component
│   │   ├── FileInput.tsx                  # File upload input
│   │   ├── Input.tsx                      # Reusable input component
│   │   ├── Modal.tsx                      # Modal wrapper component
│   │   └── Table.tsx                      # Reusable table component
│   │
│   └── 📁 users/                          # User Management Components
│       ├── UserDetailCard.tsx             # User detail display
│       ├── UserForm.tsx                   # User creation/editing form
│       └── UserTable.tsx                  # User listing table
│
├── 📁 lib/                                # Utility Libraries
│   ├── api.ts                             # API integration functions
│   ├── authContext.tsx                    # Authentication context provider
│   ├── cloudflareStorage.ts               # Cloudflare R2 storage utilities
│   ├── config.ts                          # Configuration constants
│   ├── mockData.ts                        # Mock data for development
│   ├── notificationContext.tsx            # Notification system context
│   ├── simpleUpload.ts                    # File upload utilities
│   └── tokenManager.ts                    # JWT token management
│
├── 📁 pages/                              # Next.js Pages & API Routes
│   ├── 📁 api/                            # API Endpoints
│   │   ├── 📁 auth/                       # Authentication APIs
│   │   │   └── login.ts                   # User login endpoint
│   │   │
│   │   ├── 📁 categories/                 # Category Management APIs
│   │   │   └── index.ts                   # CRUD operations for categories
│   │   │
│   │   ├── 📁 magazines/                  # Magazine Management APIs
│   │   │   ├── [mid].ts                   # Individual magazine operations
│   │   │   ├── create.ts                  # Magazine creation
│   │   │   ├── delete.ts                  # Magazine deletion
│   │   │   ├── index.ts                   # Magazine listing
│   │   │   └── update.ts                  # Magazine updates
│   │   │
│   │   ├── 📁 plans/                      # Plan Management APIs
│   │   │   ├── create.ts                  # Plan creation
│   │   │   ├── delete.ts                  # Plan deletion
│   │   │   ├── index.ts                   # Plan listing
│   │   │   └── update.ts                  # Plan updates
│   │   │
│   │   ├── 📁 users/                      # User Management APIs
│   │   │   ├── [uid].ts                   # Individual user operations
│   │   │   ├── create.ts                  # User creation
│   │   │   ├── delete.ts                  # User deletion
│   │   │   └── index.ts                   # User listing
│   │   │
│   │   ├── r2-url.js                      # Cloudflare R2 URL generation
│   │   └── upload.ts                      # File upload endpoint
│   │
│   ├── 📁 admin/                          # Admin Pages
│   │   └── login.tsx                      # Admin login page
│   │
│   ├── 📁 categories/                     # Category Pages
│   │   └── index.tsx                      # Category management page
│   │
│   ├── 📁 magazines/                      # Magazine Pages
│   │   ├── [id].tsx                       # Magazine detail page
│   │   ├── add.tsx                        # Magazine creation page
│   │   └── index.tsx                      # Magazine listing page
│   │
│   ├── 📁 plans/                          # Plan Pages
│   │   └── index.tsx                      # Plan management page
│   │
│   ├── 📁 users/                          # User Pages
│   │   ├── [id].tsx                       # User detail page
│   │   └── index.tsx                      # User listing page
│   │
│   ├── _app.tsx                           # App wrapper with providers
│   ├── _document.tsx                      # Document wrapper
│   ├── index.tsx                          # Dashboard page
│   ├── notifications.tsx                  # Notification management page
│   └── settings.tsx                       # Settings page
│
├── 📁 public/                             # Static Assets
│   ├── favicon.ico                        # Site favicon
│   ├── file.svg                           # File icon
│   ├── globe.svg                          # Globe icon
│   ├── next.svg                           # Next.js logo
│   ├── vercel.svg                         # Vercel logo
│   └── window.svg                         # Window icon
│
├── 📁 styles/                             # Global Styles
│   ├── globals.css                        # Global CSS styles
│   └── magazines.css                      # Magazine-specific styles
│
├── 📄 Configuration Files
│   ├── .eslintrc.js                       # ESLint configuration
│   ├── next.config.ts                     # Next.js configuration
│   ├── package.json                       # Dependencies and scripts
│   ├── postcss.config.mjs                 # PostCSS configuration
│   ├── tailwind.config.ts                 # Tailwind CSS configuration
│   └── tsconfig.json                      # TypeScript configuration
│
├── 📄 Documentation Files
│   ├── CLOUDFLARE_SETUP.md                # Cloudflare R2 setup guide
│   ├── FINAL_NOTIFICATION_SYSTEM.md       # Notification system documentation
│   ├── LOGIN_API_SETUP.md                 # Login API documentation
│   ├── MAGAZINE_EDIT_API_SETUP.md         # Magazine edit API documentation
│   ├── NOTIFICATIONS_SETUP.md             # Notifications setup guide
│   ├── PLAN_EDIT_API_SETUP.md             # Plan edit API documentation
│   ├── PLANS_SETUP.md                     # Plans management documentation
│   ├── PROJECT_STRUCTURE.md               # This file
│   ├── README.md                          # Main project documentation
│   ├── SECURITY_AUDIT.md                  # Security audit documentation
│   └── SETTINGS_DROPDOWN_UPDATE.md        # Settings dropdown documentation
│
└── 📄 Other Files
    ├── package-lock.json                  # Locked dependencies
    └── .gitignore                         # Git ignore rules
```

## 🔧 Component Architecture

### Authentication Layer
```
auth/
├── LoginForm.tsx          # Handles admin login
└── ProtectedRoute.tsx     # Protects admin routes
```

### Layout System
```
layouts/
└── AdminLayout.tsx        # Main layout with sidebar navigation
```

### Feature Modules

#### User Management
```
users/
├── UserTable.tsx          # User listing with search/filter
├── UserForm.tsx           # User creation/editing
└── UserDetailCard.tsx     # User profile display
```

#### Magazine Management
```
magazines/
├── MagazineTable.tsx      # Magazine listing
├── MagazineForm.tsx       # Magazine creation
└── EditMagazineForm.tsx   # Magazine editing
```

#### Plan Management
```
plans/
├── SimplePlanCard.tsx     # Plan display cards
├── PlanForm.tsx           # Plan creation
├── EditPlanForm.tsx       # Plan editing
├── DeletePlanModal.tsx    # Plan deletion
└── BulkFeatureManager.tsx # Bulk feature management
```

### Shared Components
```
ui/
├── Button.tsx             # Reusable button
├── Input.tsx              # Reusable input
├── Modal.tsx              # Modal wrapper
├── Table.tsx              # Reusable table
└── FileInput.tsx          # File upload input
```

## 🗂️ API Structure

### Authentication APIs
```
api/auth/
└── login.ts               # POST /api/auth/login
```

### User Management APIs
```
api/users/
├── index.ts               # GET /api/users
├── create.ts              # POST /api/users/create
├── delete.ts              # DELETE /api/users/delete
└── [uid].ts               # GET /api/users/[uid]
```

### Magazine Management APIs
```
api/magazines/
├── index.ts               # GET /api/magazines
├── create.ts              # POST /api/magazines/create
├── update.ts              # PUT /api/magazines/update
├── delete.ts              # DELETE /api/magazines/delete
└── [mid].ts               # GET /api/magazines/[mid]
```

### Plan Management APIs
```
api/plans/
├── index.ts               # GET /api/plans
├── create.ts              # POST /api/plans/create
├── update.ts              # PUT /api/plans/update
└── delete.ts              # DELETE /api/plans/delete
```

### Category Management APIs
```
api/categories/
└── index.ts               # CRUD operations for categories
```

### File Management APIs
```
api/
├── r2-url.js              # Cloudflare R2 URL generation
└── upload.ts              # File upload handling
```

## 📚 Library Structure

### Core Utilities
```
lib/
├── api.ts                 # API integration functions
├── config.ts              # Configuration constants
└── tokenManager.ts        # JWT token management
```

### Context Providers
```
lib/
├── authContext.tsx        # Authentication state
└── notificationContext.tsx # Notification system
```

### File Management
```
lib/
├── cloudflareStorage.ts   # Cloudflare R2 integration
└── simpleUpload.ts        # File upload utilities
```

### Development
```
lib/
└── mockData.ts            # Mock data for development
```

## 🎨 Styling Structure

### Global Styles
```
styles/
├── globals.css            # Global CSS variables and base styles
└── magazines.css          # Magazine-specific styles
```

### Tailwind Configuration
```
tailwind.config.ts         # Custom design system configuration
```

## 🔧 Configuration Files

### Build Configuration
```
├── next.config.ts         # Next.js build configuration
├── postcss.config.mjs     # PostCSS processing
└── tsconfig.json          # TypeScript configuration
```

### Code Quality
```
├── .eslintrc.js           # ESLint rules and configuration
└── .gitignore             # Git ignore patterns
```

### Dependencies
```
├── package.json           # Project dependencies and scripts
└── package-lock.json      # Locked dependency versions
```

## 📄 Documentation Structure

### Setup Guides
```
├── CLOUDFLARE_SETUP.md    # Cloudflare R2 configuration
├── LOGIN_API_SETUP.md     # Authentication setup
└── NOTIFICATIONS_SETUP.md # Notification system setup
```

### Feature Documentation
```
├── MAGAZINE_EDIT_API_SETUP.md # Magazine editing
├── PLAN_EDIT_API_SETUP.md     # Plan editing
└── PLANS_SETUP.md             # Plan management
```

### System Documentation
```
├── FINAL_NOTIFICATION_SYSTEM.md # Notification system
├── SECURITY_AUDIT.md           # Security documentation
└── SETTINGS_DROPDOWN_UPDATE.md # Settings system
```

## 🚀 Deployment Structure

### Production Build
- **Build Command**: `npm run build`
- **Output Directory**: `.next/`
- **Static Assets**: `public/`
- **Environment Variables**: `.env.local`

### Development
- **Dev Server**: `npm run dev`
- **Port**: `3000`
- **Hot Reload**: Enabled
- **TypeScript**: Strict mode

## 🔒 Security Structure

### Authentication
- JWT token-based authentication
- Protected route middleware
- Token refresh mechanism
- Secure logout handling

### API Security
- CORS protection
- Input validation
- Error handling
- Rate limiting (backend)

### File Security
- File type validation
- Size limits
- Secure upload endpoints
- Cloudflare R2 integration

## 📊 Performance Structure

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### Optimization
- Image optimization
- Bundle optimization
- Caching strategies
- Static generation

---

**This structure provides a clean, scalable, and maintainable architecture for the EchoReads Admin Panel.** 