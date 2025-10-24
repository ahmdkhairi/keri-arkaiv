# Design Guidelines: My CD Library

## Design Approach
**Reference-Based Approach** drawing inspiration from premium music platforms (Spotify, Apple Music, Bandcamp) that emphasize album artwork and immersive browsing experiences. This application prioritizes visual impact while maintaining functional clarity for music collection management.

## Core Design Principles
1. **Album Art First**: Large, high-quality cover images as primary visual anchors
2. **Hierarchy Through Scale**: Use size differentiation to establish importance
3. **Breathing Room**: Generous spacing around album artwork and text
4. **Tactile Interactions**: Subtle elevation changes and smooth transitions

---

## Typography System

**Primary Font**: 'Inter' (Google Fonts) - clean, modern sans-serif
**Display Font**: 'Poppins' (Google Fonts) - bold headers and titles

**Scale**:
- Hero Title (Welcome): text-6xl md:text-7xl lg:text-8xl, font-bold
- Page Headings: text-4xl md:text-5xl, font-semibold
- Album Titles: text-xl md:text-2xl, font-semibold
- Album Details Headers: text-3xl, font-bold
- Artist Names: text-base md:text-lg, font-medium
- Body Text: text-sm md:text-base, font-normal
- Track Listings: text-sm, font-normal
- Metadata (year, duration): text-xs md:text-sm, opacity-75

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Micro spacing: p-2, gap-2 (between related elements)
- Component spacing: p-4, p-6, gap-4 (cards, buttons)
- Section spacing: p-8, py-12, py-16 (major sections)
- Page padding: px-4 md:px-8 lg:px-12 xl:px-16

**Container Strategy**:
- Welcome Screen: max-w-7xl mx-auto, full viewport height
- Album Grid: max-w-7xl mx-auto, px-4 md:px-8
- Detail Modal: max-w-5xl mx-auto

---

## Component Library

### 1. Welcome/Entry Screen
**Layout**: Full viewport centered content
- Logo/Title: Centered, massive typography (text-8xl)
- Tagline: Centered below title, text-xl, subtle opacity
- Enter Button: Large primary CTA (px-12 py-4, text-lg, rounded-full)
- Background: Full-bleed hero image of vinyl records/music collection with overlay for text readability
- Button on hero image: backdrop-blur-sm bg-white/10 border border-white/20

### 2. Album Grid View
**Header Section** (sticky top-0):
- Page Title "My CD Collection": text-5xl, font-bold, mb-8
- Search Bar: Large prominent input field
  - Width: w-full md:max-w-2xl
  - Height: h-14
  - Rounded: rounded-2xl
  - Icon: Search icon left-aligned (pl-12)
  - Placeholder: "Search by title, artist, or genre..."
  
**Grid Layout**:
- Mobile: grid-cols-2, gap-4
- Tablet: md:grid-cols-3, gap-6
- Desktop: lg:grid-cols-4 xl:grid-cols-5, gap-8
- Container: pb-24 (space for audio player)

**Album Card**:
- Aspect ratio: Square for cover (aspect-square)
- Cover Image: rounded-lg, w-full, h-full object-cover
- Hover Effect: scale-105 transform, subtle shadow increase
- Info Section: p-4
  - Album Title: text-xl, font-semibold, truncate
  - Artist: text-base, opacity-75
  - Year: text-sm, opacity-60
- Total card: cursor-pointer transition-all duration-300

### 3. Album Detail Modal/Page
**Modal Container**:
- Backdrop: backdrop-blur-md with dark overlay
- Content: max-w-5xl, rounded-3xl, overflow-hidden
- Close button: Absolute top-4 right-4, text-2xl, p-3, rounded-full

**Layout Structure** (2-column on desktop):
- Left Column (40%): 
  - Large album cover: aspect-square, rounded-2xl, w-full
  - Album metadata below: p-6
  
- Right Column (60%):
  - Album Title: text-4xl, font-bold, mb-2
  - Artist: text-2xl, mb-1
  - Year & Genre: text-sm, opacity-75, flex gap-4
  - Record Label: text-sm, mt-2
  
**About Section**:
- Margin top: mt-8
- Heading "About": text-lg, font-semibold, mb-3
- Description: text-base, leading-relaxed, max 4 lines with "Read more" expansion
- Container: p-6, rounded-xl

**Track Listing**:
- Heading: text-xl, font-semibold, mb-4
- Track count & duration: text-sm, opacity-75, mb-4
- Track rows: Alternating subtle background (odd/even)
  - Each track: flex justify-between items-center, p-3, rounded-lg
  - Play button: w-10 h-10, rounded-full, mr-4
  - Track number: text-sm, w-8
  - Track title: flex-1, text-base
  - Duration: text-sm, opacity-75

### 4. Audio Player (Fixed Bottom)
**Container**: 
- Fixed bottom-0, w-full, h-20
- Backdrop-blur-xl effect
- Border top: thin subtle line
- px-4 md:px-8, py-4

**Layout**: 
- Grid structure: grid-cols-[1fr_2fr_1fr] (3 sections)
- Gap: gap-4 md:gap-8

**Left Section** (Now Playing):
- Album thumbnail: w-12 h-12, rounded
- Track info: flex-1, ml-3
  - Track title: text-sm, font-medium, truncate
  - Artist: text-xs, opacity-75

**Center Section** (Controls):
- Controls row: flex items-center justify-center gap-4
- Play/Pause: w-12 h-12, rounded-full (largest button)
- Skip buttons: w-10 h-10, rounded-full
- Progress bar below: w-full, h-1.5, rounded-full
- Time stamps: text-xs, opacity-75, mt-1

**Right Section** (Volume):
- Volume icon: w-5 h-5
- Volume slider: flex-1, ml-3
- Max width: max-w-xs

### 5. Search Bar Component
**Design**:
- Container: relative, w-full
- Input field:
  - Height: h-14
  - Padding: pl-14 pr-4 (space for icon)
  - Border: 2px solid, rounded-2xl
  - Focus: ring-4 ring-offset-2
  - Transition: all 200ms
- Search icon: absolute left-4, w-6 h-6
- Clear button: absolute right-4 (when typing)

---

## Images

### Hero Image (Welcome Screen)
**Description**: Warm, atmospheric photograph of vinyl records and CDs in a personal collection setting. Should evoke nostalgia and passion for physical music media. Suggested composition: Close-up of album spines on a shelf with soft natural lighting, or overhead shot of vinyl records spread on a wooden surface.

**Placement**: Full-screen background (w-screen h-screen object-cover) with gradient overlay for text legibility.

### Album Covers
**Description**: Official album artwork provided in the database. Display at highest quality available.

**Placement**: 
- Grid view: Square aspect ratio thumbnails
- Detail view: Large display (minimum 400x400px)

**Note**: No additional decorative images needed. Album artwork serves as primary visual content.

---

## Interaction Patterns

**Animations**: Minimal and purposeful
- Album card hover: Transform scale (0.3s ease)
- Modal enter/exit: Fade + scale (0.2s ease-out)
- Audio player slide up: Translate Y (0.3s ease)
- Button interactions: Scale + opacity shifts (0.15s)

**Transitions**:
- Navigation: Smooth page transitions
- Search filtering: Instant with subtle fade (0.2s)
- Track selection: Immediate feedback with ripple effect

**Accessibility**:
- Focus states: 4px ring with offset on all interactive elements
- Keyboard navigation: Full support with visible focus indicators
- ARIA labels: Complete labeling for screen readers
- Skip links: "Skip to main content" for header navigation

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (2-column grid, stacked modals)
- Tablet: 768px - 1024px (3-column grid)
- Desktop: > 1024px (4-5 column grid, side-by-side modal layout)

**Mobile Adaptations**:
- Modal becomes full-screen on mobile
- Audio player: Simplified controls (hide volume, smaller buttons)
- Album detail: Single column layout
- Search bar: Full width with larger touch targets (min-h-12)