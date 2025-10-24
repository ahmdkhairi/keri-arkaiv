# My CD Library

A full-stack personal CD library application built with React, TypeScript, Express, and MongoDB Atlas.

## Overview

My CD Library is a beautifully designed music collection manager that allows users to browse their personal CD collection, view detailed album information, and stream audio tracks. The application features a stunning visual interface inspired by premium music platforms like Spotify and Apple Music.

## Features

- **Welcome Screen**: Immersive hero image with "Enter Library" call-to-action
- **Album Grid**: Browse all albums with cover art, titles, artists, and years
- **Real-time Search**: Filter albums by title, artist, or genre
- **Album Details**: View comprehensive album information including:
  - High-quality cover artwork
  - Full track listings with durations
  - Album metadata (year, genre, record label)
  - About section with album description
- **Audio Player**: HTML5 audio player with playback controls
  - Play/pause, skip tracks
  - Progress bar with seek functionality
  - Volume control
  - Now playing display
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons

### Backend
- Node.js with Express
- TypeScript
- MongoDB Atlas (cloud database)
- Mongoose ODM

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   │   ├── welcome.tsx      # Landing page
│   │   │   └── library.tsx      # Album grid view
│   │   ├── components/  # Reusable components
│   │   │   ├── album-card.tsx
│   │   │   ├── album-detail-modal.tsx
│   │   │   ├── album-skeleton.tsx
│   │   │   └── audio-player.tsx
│   │   └── App.tsx      # Main app router
├── server/              # Backend Express application
│   ├── models/          # Mongoose models
│   │   └── Album.ts
│   ├── db.ts           # MongoDB connection
│   ├── seed.ts         # Database seeding
│   ├── routes.ts       # API routes
│   └── index.ts        # Server entry point
├── shared/             # Shared types and schemas
│   └── schema.ts       # TypeScript interfaces and Zod schemas
└── design_guidelines.md # Design system documentation
```

## API Endpoints

- `GET /api/albums` - Retrieve all albums
- `GET /api/albums/:id` - Get specific album with track details
- `GET /api/tracks/:albumId/:trackIndex/stream` - Stream audio track

## Database

The application uses MongoDB Atlas (free tier) for data persistence. The database is automatically seeded with 3 classic albums:

1. **Nirvana - Nevermind** (1991, Grunge)
2. **Pink Floyd - The Dark Side of the Moon** (1973, Progressive Rock)
3. **The Beatles - Abbey Road** (1969, Rock)

## Environment Variables

- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 5000)

## Design System

The application uses a carefully crafted design system with:
- Purple accent color scheme (270° hue)
- Inter font for body text
- Poppins font for headings
- Consistent spacing and typography scales
- Beautiful hover and active states
- Smooth transitions and animations

See `design_guidelines.md` for complete design specifications.

## Development

The application runs on a single port (5000) with both frontend and backend served together. Vite handles hot module replacement for fast development.

To add new albums, use the MongoDB Atlas dashboard or extend the seed.ts file.

## Future Enhancements

- Admin interface for adding/editing albums
- Playlist creation and management
- Favorites and rating system
- File upload for album covers and audio tracks
- Advanced search and filtering
- User authentication
- Social features (sharing, comments)

## Recent Changes

- Initial project setup (October 24, 2025)
- Implemented complete MVP with MongoDB Atlas integration
- Created beautiful, responsive UI with dark mode support
- Added audio playback functionality
- Database seeded with 3 classic albums
