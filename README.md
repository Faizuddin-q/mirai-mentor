# Mirai Mentor

An AI-powered career preparation platform that helps job seekers create professional resumes, generate personalized cover letters, practice mock interviews, and craft intelligent answers to questions asked in job application forms.

## 🚀 Features

### 1. **Smart Answer Desk**
- AI-powered answer generation for questions asked in job application forms
- Personalized responses based on your profile, skills, and experience
- Special handling for "Why join this company?" questions
- Markdown editor with live preview
- AI enhancement to improve your answers
- Copy to clipboard functionality

### 2. **AI Cover Letter Generator**
- Generate personalized cover letters tailored to specific job applications
- Uses company information and job descriptions
- Multiple cover letter management
- Markdown-based editing and preview

### 3. **Resume Builder**
- Create professional resumes with structured sections
- AI-powered resume improvement suggestions
- Markdown-based resume editor
- Multiple resume management
- Export functionality
- ATS (Applicant Tracking System) score tracking

### 4. **Mock Interview & Quiz**
- AI-generated interview questions based on your profile
- Multiple choice quiz format
- Real-time scoring and performance tracking
- Detailed explanations for each question
- Performance analytics and charts
- Category-based assessments (Technical, Behavioral, etc.)

### 5. **User Profile Management**
- Comprehensive user onboarding
- Store personal information, skills, and experience
- Industry and sub-industry selection
- Professional bio management
- Profile-based personalization across all features

### 6. **Dashboard & Analytics**
- View interview performance statistics
- Track resume and cover letter history
- Industry insights and trends
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
- **Google Gemini API** (gemini-2.5-flash) - AI-powered content generation
- **Inngest** - Background job processing

### Additional Tools
- **date-fns** - Date utility library
- **html2pdf.js** - PDF generation
- **next-themes** - Theme management

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account (for authentication)
- Google Gemini API key

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
│   ├── (main)/            # Main application routes
│   │   ├── smart-answer-desk/
│   │   ├── ai-cover-letter/
│   │   ├── resume/
│   │   ├── interview/
│   │   ├── profile/
│   │   └── explore/
│   ├── api/               # API routes
│   └── onboarding/        # Onboarding flow
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
