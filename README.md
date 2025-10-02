# REMORA - Flashcard Maker from Notes

## Overview
**REMORA** is a web application designed to help students efficiently retain and memorize information by automatically generating flashcards from text notes. Leveraging AI, the platform transforms lengthy notes into concise question-answer pairs, supporting learning techniques such as **spaced repetition** and **active recall**, which have been proven to improve long-term retention.

### Key Goals
- **Learning Efficiency:** Convert long notes into easily memorizable flashcards.
- **Interactive & Personal:** Provides an interactive quiz mode and user-specific storage for notes and flashcards.
- **Accessibility:** Simple, mobile-friendly interface suitable for busy students.
- **Local Focus:** Supports notes in both Bahasa Indonesia and English, with AI understanding local context.

---

## Page Structure

### Hero Page (`/`)
- **Tagline:** "Turn Your Notes into Smart Flashcards for Efficient Learning!"
- **Features:** 
  - CTA "Try Now" → redirects to `/upload`
  - "Login" → redirects to `/auth`
  - Illustration of books/flashcards

### Login/Signup Page (`/auth`)
- Login/signup form via email or Google OAuth
- Redirect to dashboard upon successful login

### Dashboard Page (`/dashboard`)
- List of user's notes and flashcards
- Button to create new flashcards
- Progress statistics

### Upload Notes Page (`/upload`)
- Textarea for notes input
- Generate flashcards via AI
- Preview before saving

### Quiz Mode Page (`/quiz/[flashcardId]`)
- Interactive flashcards with flip animation
- Buttons to mark "Understood" or "Not Understood"
- Summary of quiz results

### Profile Page (`/profile`)
- Edit name/email and language preferences
- Logout button

---

## Design & Visuals

### Color Palette
- **Primary:** Blue-gray (`#E6F0FA`, `#6B7280`) — calm and focused
- **Secondary:** Soft cream (`#F9FAFB`, `#D1D5DB`) — neutral, clean
- **Accent:** Sage green (`#A7C1A7`) — represents growth and calmness

**Reason:** The softer palette reduces visual strain for long-term use, especially at night.

### Typography
- **Primary Font:** Lora (serif, Google Fonts) — elegant and readable
- **Secondary Font:** Open Sans (sans-serif, Google Fonts) — for labels, buttons, small UI text
- **Sizing:** Body 16px, Heading1 28px, Heading2 20px, line-height 1.6

### Visual Elements
- **Icons:** Heroicons via Tailwind CSS
- **Illustrations:** Minimalistic, e.g., open book or flashcard outline
- **UI:** Card-based layout for flashcards and notes with rounded-xl borders and soft shadows
- **Layout:** Responsive, consistent spacing (`p-4`, `m-4`), top navbar with logo and navigation links

**Goal:** Create a calming study environment with easy readability and a minimalistic aesthetic.

---

## Technology Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS + Tailwind Animations
- Framer Motion
- Radix UI Components (Accordion, Dialog, Dropdown, Tooltip, etc.)
- Lucide-react Icons
- React Hook Form + Zod

### Backend
- Supabase (Authentication, Database)

### Utilities
- date-fns
- clsx
- lovable-tagger (development)
- tailwind-merge

### Dev Tools
- Vite + SWC Plugin for React
- TypeScript
- ESLint + Prettier
- PostCSS
- @tailwindcss/typography
