# UTMIST Client Application

A modern React/Next.js application with secure authentication using Supabase Auth, built for the University of Toronto Machine Intelligence Student Team (UTMIST).

## 🚀 Features

- **Secure Authentication**: Email/password and Google OAuth with Supabase
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Server-side session handling with cookies
- **Email Confirmation**: Support for email verification flows
- **Profile Management**: User profile creation and updates
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Google OAuth credentials (for Google sign-in)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd client
npm install
```

### 2. Supabase Configuration

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready (this can take a few minutes)

#### Configure Authentication
1. In your Supabase dashboard, go to **Authentication > Settings**
2. Configure the following settings:
   - **Enable email confirmations**: Toggle ON if you want users to confirm their email
   - **Site URL**: Set to `http://localhost:3000` for development
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`

#### Enable Google OAuth (Optional)
1. In Authentication > Providers, enable Google
2. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
   - Set authorized redirect URIs to: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret to Supabase Google provider settings

#### Get Supabase Keys
1. Go to **Settings > API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Environment Variables

Create a `.env.local` file in the client directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Add these for additional features
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ Important Notes:**
- Replace `your_supabase_project_url` with your actual Supabase project URL
- Replace `your_supabase_anon_key` with your actual Supabase anon key
- Never commit the `.env` file to version control
- For production, set these environment variables in your deployment platform

### 4. Database Schema (Automatic)

The authentication system uses Supabase Auth's built-in user table. User profile data is stored in the `auth.users` metadata field, so no additional database setup is required.

## 🚦 Running the Application

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 🔐 Authentication Features

### Sign Up/Login Page (`/auth`)
- Email and password authentication
- Google OAuth integration
- Client-side form validation
- Password strength requirements
- Email confirmation support
- Error handling with user-friendly messages

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- Automatic redirection for unauthenticated users
- Session-based protection via middleware

### Session Management
- Server-side session cookies
- Automatic session refresh
- Secure logout with session cleanup

## 🎨 User Interface

### Features
- Responsive design optimized for mobile and desktop
- Clean, modern interface with Tailwind CSS
- Form validation with real-time feedback
- Loading states and error messages
- Accessibility features

### Key Components
- `AuthPage` - Combined login/register form
- `Dashboard` - Protected user dashboard
- Protected route middleware
- Authentication utilities

## 🔧 Technical Architecture

### Authentication Flow
1. User submits credentials via form
2. Client calls Supabase Auth API
3. On success, session is established
4. Server-side cookies are set via API route
5. Middleware protects subsequent requests

### Error Handling
- Standardized error codes (`AUTH_ERRORS`)
- Specific error messages for different scenarios
- Email confirmation resend functionality
- User-friendly error display

### File Structure
```
client/src/
├── app/
│   ├── auth/
│   │   ├── page.tsx          # Authentication page
│   │   └── callback/
│   │       └── route.ts      # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx          # Protected dashboard
│   └── api/
│       └── auth/
│           ├── set-cookie/   # Session management
│           └── signout/      # Logout handling
├── utils/
│   └── auth.ts               # Authentication utilities
├── types/
│   └── auth.ts               # TypeScript types
├── lib/
│   └── supabase.ts           # Supabase client config
└── middleware.ts             # Route protection
```

## 🧪 Testing

### Current Status
- ✅ Authentication utilities implemented
- ✅ Protected routes working
- ✅ Session management functional
- ❌ Unit tests for form validation (not implemented)
- ❌ Integration tests for auth flow (not implemented)

### Adding Tests
To fulfill the testing requirements, you can add:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Create test files
touch src/utils/__tests__/auth.test.ts
touch src/app/auth/__tests__/page.test.tsx
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update Supabase redirect URLs to include your production domain

### Other Platforms
- Ensure environment variables are set
- Update Supabase configuration for production URLs
- Configure proper redirect URLs in Supabase dashboard

## 🐛 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Ensure `.env.local` file exists and contains correct values
- Restart development server after adding environment variables

**Google OAuth not working**
- Verify Google OAuth is enabled in Supabase
- Check that redirect URLs match exactly
- Ensure Google Cloud Console credentials are correct

**Email confirmation not working**
- Check if email confirmation is enabled in Supabase
- Verify email templates are configured
- Check spam folder for confirmation emails

**Session not persisting**
- Ensure middleware is configured correctly
- Check that cookies are being set properly
- Verify Supabase client configuration

### Getting Help
- Check Supabase documentation: https://supabase.com/docs
- Review Next.js authentication patterns
- Check browser network tab for API errors

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
