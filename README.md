# Eco Voyage AI 🌱✈️

Eco Voyage AI is an AI-powered eco-travel recommendation platform designed to help users discover sustainable travel destinations, compare eco-scores, and make environmentally conscious travel decisions.

## Intern Information

- Name: Akshat Tripathi
- Intern ID: 26100440
- Internship: AI Full Stack Web Development Internship
- Organization: TBI-GEU

---

## Project Overview

The platform focuses on promoting sustainable tourism by providing eco-friendly travel recommendations and destination insights.

Key features include:

- Eco-friendly destination recommendations
- Sustainability score visualization
- Travel dashboard
- Responsive user interface
- Dark/Light mode support
- Reusable UI component library

---

## Week 3 Deliverables

### 1. Component Library

Implemented reusable UI components inside:

```text
components/ui/
```

Components developed:

- Button
- Input
- Modal
- Toast
- Loader
- ThemeToggle

An index file is also included for centralized exports.

### 2. Component Showcase

A dedicated component showcase page demonstrates all reusable components.

Route:

```text
/components-demo
```

Features demonstrated:

- Button variants
- Input fields
- Modal popup
- Toast notifications
- Loader animation
- Theme switching

### 3. Responsive Dashboard

Created a responsive dashboard supporting:

| Device | Width |
|----------|----------|
| Mobile | 375px |
| Tablet | 768px |
| Desktop | 1440px |

Dashboard includes:

- Eco Score card
- Recommended Trips card
- Carbon Saved card
- Recommended Destinations section
- Recent Trips section

### 4. Dark / Light Mode

Implemented a theme switching feature using the reusable ThemeToggle component.

Features:

- Dark Mode
- Light Mode
- Persistent theme preference
- Smooth transitions

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Tools

- Figma
- GitHub
- VS Code

---

## Project Structure

```text
src/
│
├── app/
│   ├── dashboard/
│   └── components-demo/
│
├── components/
│   ├── DashboardCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── Loader.tsx
│       ├── ThemeToggle.tsx
│       └── index.ts
│
└── styles/
```

---

## Screenshots

The project includes:

- Desktop Dashboard View
- Tablet Dashboard View
- Mobile Dashboard View
- Dark Mode Demo
- Light Mode Demo

---

## Future Enhancements

- AI-based personalized travel recommendations
- Carbon footprint estimation
- User authentication
- Destination comparison engine
- Travel itinerary generation

---

## Repository

GitHub Repository:

https://github.com/AkshatTrip2405/eco-voyage-ai

---

## Database Setup

**Database Choice & Why:**
For this project, I chose **PostgreSQL** (hosted on Supabase) as the database. I selected it because a relational database perfectly fits the structured nature of our destination and user data. It also integrates seamlessly with our Python/FastAPI backend using SQLAlchemy.

**Schema Diagram:**
The database schema includes tables for Users, Destinations, and Reviews. *(See the `W5_SchemaDiagram_26100440.pdf` file included in the submission for the full visual diagram).*

**How to Set Up the Database:**
1. Clone this repository to your local machine.
2. Navigate to the `backend` folder.
3. Create a `.env` file based on the provided `.env.example` file.
4. Add your live PostgreSQL connection string to the `DATABASE_URL` variable in the `.env` file.
5. Run the FastAPI server, and the tables will be created automatically.

## Author

Akshat Tripathi  
Intern ID: 26100440
