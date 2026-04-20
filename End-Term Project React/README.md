# Smart Travel Planner

A production-ready React web application to manage travel budgets, itineraries, and documents all in one place. Built as an end-term academic project demonstrating advanced React concepts.

## Problem Statement
Most travelers end up using multiple disconnected tools for budgeting, itinerary planning, and document tracking. **Smart Travel Planner** unifies these workflows into one clean, premium dark-themed system.

## Features
- **User Authentication**: Secure signup and login flow.
- **Dashboard Overview**: At-a-glance view of upcoming trips, total budget, and next trip highlight.
- **Trip Management (CRUD)**: Create and track all your travel plans.
- **Budget Planner**: Categorize expenses, set an estimated budget, and track actual spending in real-time.
- **Itinerary Planner**: Manage activities across your trip timeline with detailed notes, times, and locations.
- **Document Organizer**: Track the status (pending/ready) of important documents like passports, visas, and tickets.

## Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS (v4) + Framer Motion for elegant micro-animations
- **Forms & Validation**: React Hook Form + Zod
- **Backend / Database**: Supabase (Postgres, Auth, Row Level Security)
- **Icons & Utils**: Lucide React, date-fns, react-hot-toast

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Backend
This project relies on Supabase for data persistence and authentication.
1. Create a free project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the `schema.sql` file provided in the root of this project. This will set up the necessary tables and Row Level Security (RLS) policies.
3. Obtain your Project URL and Anon Key from **Project Settings > API**.

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```

## Architecture
The application is structured for scalability and maintainability:
- `src/components/`: Modular, reusable components (common, layout, feature-specific).
- `src/pages/`: Main route entries, heavily utilizing `React.lazy` and `Suspense` for performance.
- `src/context/`: Global state management (`AuthContext`).
- `src/hooks/`: Abstracted Supabase business logic into reusable hooks (`useTrips`, `useExpenses`, `useItinerary`, `useDocuments`).
- `src/routes/`: Route definitions including `ProtectedRoute` wrappers.
