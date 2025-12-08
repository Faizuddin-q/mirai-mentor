# Mirai Mentor

An AI-powered career preparation platform that helps job seekers create professional resumes, generate personalized cover letters, practice mock interviews, and craft intelligent answers to questions asked in job application forms.

## Features

### 1. **Job Application Tracker**
- Log and track every job application in one place
- Comprehensive application details (company, role, location, job type, source)
- Status tracking with visual timeline (Wishlist → Applied → OA → Interview → Offer/Rejected)
- Priority levels (Low, Medium, High) for better organization
- Attach resumes from multiple sources:
  - Upload pdf from system
  - Link to internal resumes from your account
  - External links to documents
  - Paste text directly
- Markdown-supported notes editor for each application
- Filter applications by status, source, priority, and date range
- Status history tracking to see progression over time
- Quick actions to update status and manage applications

### 2. **Smart Answer Desk**
- AI-powered answer generation for questions asked in job application forms
- Personalized responses based on your profile, skills, and experience
- Special handling for "Why join this company?" questions
- Markdown editor with live preview
- AI enhancement to improve your answers
- Copy to clipboard functionality

### 3. **AI Cover Letter Generator**
- Generate personalized cover letters tailored to specific job applications
- Uses company information and job descriptions
- Multiple cover letter management
- Markdown-based editing and preview

### 4. **Resume Builder**
- Create professional resumes with structured sections
- AI-powered resume improvement suggestions
- Markdown-based resume editor
- Multiple resume management
- Export functionality

### 5. **Mock Interview & Quiz**
- AI-generated interview questions based on your profile
- Multiple choice quiz format
- Real-time scoring and performance tracking
- Detailed explanations for each question
- Performance analytics and charts
- Category-based assessments

### 6. **User Profile Management**
- Comprehensive user onboarding
- Store personal information, skills, and experience
- Industry and sub-industry selection
- Professional bio management
- Profile-based personalization across all features

### 7. **Dashboard & Analytics**
- View interview performance statistics
- Track resume and cover letter history
- Performance charts and visualizations

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Re-usable component library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **React Markdown** - Markdown rendering
- **MDEditor** - Markdown editor component
- **Recharts** - Chart library for analytics
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend & Database
- **Next.js Server Actions** - Server-side logic
- **Prisma** - ORM for database management
- **PostgreSQL** - Relational database

### Authentication
- **Clerk** - Authentication and user management

### AI & Services
- **Google Gemini API** - AI-powered content generation
- **UploadThing** - File upload service for resume PDFs

### Additional Tools
- **date-fns** - Date utility library
- **html2pdf.js** - PDF generation
- **next-themes** - Theme management

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account (for authentication)
- Google Gemini API key
- UploadThing account (for file uploads)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mirai-mentor-minor-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:

```env
DATABASE_URL=your_postgresql_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=your_gemini_api_key

# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_key
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
mirai-mentor-minor-project/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes (requires onboarding)
│   │   ├── smart-answer-desk/
│   │   ├── ai-cover-letter/
│   │   ├── resume/
│   │   ├── quiz/
│   │   ├── profile/
│   │   ├── explore/
│   │   └── applications/
│   ├── api/               # API routes
│   └── onboarding/        # Onboarding flow (separate from main to avoid redirect loops)
├── actions/               # Server actions
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
└── hooks/                 # Custom React hooks
```

## 🔐 Authentication Flow

1. Users sign up/sign in using Clerk
2. New users are redirected to onboarding
3. Onboarding collects user profile information
4. Profile data is used to personalize AI-generated content

## 🤖 AI Features

The platform leverages Google Gemini AI to:
- Generate answers for questions asked in job application forms
- Enhance and improve user-written content
- Create personalized cover letters
- Generate interview quiz questions
- Provide improvement suggestions for resumes

## 📄 License

This project is part of a minor project for academic purposes.

## 👥 Contributing

This is a minor project. For issues or suggestions, please contact the project maintainers.
