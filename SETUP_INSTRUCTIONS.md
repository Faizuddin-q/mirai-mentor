# Setup Instructions for Job Application Tracker

## Required Steps

1. **Stop the development server** (if running)
   - Press `Ctrl+C` in the terminal where `npm run dev` is running

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Create and run database migration**
   ```bash
   npx prisma migrate dev --name add_job_application_tracker
   ```

4. **Restart the development server**
   ```bash
   npm run dev
   ```

## What This Does

- Regenerates the Prisma client to include the new `Application` and `ApplicationStatusHistory` models
- Creates the database tables for job application tracking
- Updates your database schema

## Note

If you get a permission error during `prisma generate`, make sure:
- The dev server is completely stopped
- No other processes are using the Prisma client files
- Try closing and reopening your terminal/IDE if the issue persists

