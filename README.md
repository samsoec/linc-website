# Website Bootstrap

A modern full-stack website project with Strapi v5 CMS backend and Next.js 15 frontend with TypeScript, featuring auto-generated types and internationalization support.

## Tech Stack

### Backend

- **Strapi v5.30.0** - Headless CMS
- **TypeScript** - Type-safe backend
- **MySQL** - Database

### Frontend

- **Next.js 16.1.1** - React framework with Turbopack
- **React 19** - Latest React version
- **TypeScript** - Full type safety
- **Tailwind CSS v3** - Utility-first CSS with `@apply` support
- **Prettier** - Code formatting with format-on-save

## Project Structure

```
├── backend/                      # Strapi v5 CMS Backend
│   ├── src/
│   │   ├── api/                 # Content Type APIs
│   │   │   ├── about/           # About page content type
│   │   │   ├── article/         # Blog articles
│   │   │   ├── author/          # Author profiles
│   │   │   ├── category/        # Content categories
│   │   │   ├── global/          # Global site settings
│   │   │   ├── lead-form-submission/  # Form submissions
│   │   │   ├── page/            # Dynamic pages
│   │   │   └── product-feature/ # Product features
│   │   └── components/          # Reusable Components
│   │       ├── elements/        # UI elements (features, testimonials, etc.)
│   │       ├── layout/          # Layout components (navbar, footer, logo)
│   │       ├── links/           # Link components (buttons, links)
│   │       ├── meta/            # Metadata components
│   │       ├── sections/        # Page sections (hero, pricing, etc.)
│   │       └── shared/          # Shared components (media, SEO, etc.)
│   ├── config/                  # Strapi configuration
│   ├── data/                    # Sample data and uploads
│   ├── database/                # Database migrations
│   └── scripts/                 # Utility scripts (seeding)
│
├── frontend/                     # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   └── [lang]/         # Internationalized routes
│   │   ├── components/          # React components
│   │   ├── types/
│   │   │   └── generated/      # Auto-generated types from Strapi
│   │   └── utils/              # Utility functions
│   ├── public/                  # Static assets
│   ├── scripts/
│   │   └── copyTypes.js        # Auto-generate types from Strapi schemas
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── postcss.config.mjs      # PostCSS configuration
│   └── i18n-config.ts          # i18n configuration
│
└── starter/                      # Starter data and assets
    ├── assets/                  # Initial assets
    ├── configuration/           # Configuration templates
    └── entities/                # Entity definitions

```

## Backend (Strapi v5 CMS)

### Content Types

#### Main Content

- **Article**: Blog posts with rich content, categories, and authors
- **Page**: Dynamic pages with flexible section-based layouts
- **About**: About page with customizable sections
- **Global**: Site-wide settings (navbar, footer, metadata, notification banner)

#### Supporting Types

- **Author**: Author profiles with avatar and bio
- **Category**: Content categorization system
- **Product Feature**: Product feature showcase
- **Lead Form Submission**: Contact form submissions

### Component Library

#### Elements

- Feature, Feature Column, Feature Row
- Testimonial, Plan
- Notification Banner, Logos, Footer Section

#### Layout

- Navbar, Footer, Logo

#### Links

- Button, Button Link, Link, Social Link

#### Meta

- Metadata (SEO)

#### Sections

- Hero, Features, Feature Rows Group, Feature Columns Group
- Heading, Bottom Actions
- Rich Text, Large Video, Lead Form
- Pricing, Testimonials Group

#### Shared

- Media, Quote, Rich Text, SEO, Slider, Video Embed

### Features

- **TypeScript Support**: Full type safety across backend
- **RESTful API**: Auto-generated API endpoints for all content types
- **JSON Schemas**: Content structure defined in JSON for easy parsing
- **Media Upload**: Robust media handling with multiple formats
- **Extensible Architecture**: Easy to add new content types and components
- **Admin Panel**: Intuitive content management interface

## Frontend Features

- **Auto-Generated Types**: TypeScript types automatically generated from Strapi JSON schemas
- **Type Sync Script**: `npm run types:sync` to regenerate types from backend
- **No Manual Type Maintenance**: Types stay in sync with backend schema changes
- **Direct Property Access**: Clean runtime types without `.attributes` wrapper
- **Internationalization**: Multi-language support with i18n configuration
- **Tailwind CSS v3**: Full support for `@apply` directive in CSS files
- **Format on Save**: Prettier automatically formats code on save
- **Modern React**: React 19 with Next.js App Router
- **Optimized Build**: Turbopack for fast development and builds

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MySQL database

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (create `.env` file):
   Type System

This project features an **automatic type generation system** that keeps frontend types in sync with backend schemas:

### How It Works

1. **Backend**: Content types are defined in JSON schema files

   - Located in `backend/src/api/*/content-types/*/schema.json`
   - Components in `backend/src/components/*/*.json`

2. **Type Generation**: Run `npm run types:sync` in frontend

   - Parses JSON schemas from backend
   - Generates TypeScript interfaces with proper types
   - Handles relations, enums, dynamic zones, components
   - Creates union types for page sections and article blocks
   - Includes `StrapiResponse` and `StrapiListResponse` types

3. **Frontend**: Import generated types from `@/types/generated`
   ```typescript
   import type { Article, Page, Global } from "@/types/generated";
   ```

### Type Features

- ✅ All Strapi field types (string, number, boolean, media, etc.)
- ✅ Relations (oneToOne, oneToMany, manyToOne, manyToMany)
- ✅ Components and repeatable components
- ✅ Dynamic zones with union types
- ✅ Enumeration values
- ✅ Optional/required field handling
- ✅ No manual `.attributes` wrapper needed
- ✅ Hyphenated content type names supported

## API Usage

Once Strapi is running, access the API at `http://localhost:1337/api`:

### Endpoints

- **Articles**: `GET /api/articles?populate=*`
- **Pages**: `GET /api/pages?populate=deep`
- **Authors**: `GET /api/authors?populate=*`
- **Categories**: `GET /api/categories`
- **Global**: `GET /api/global?populate=deep`

### Example API Call

````typescript
import type { StrapiResponse, Article } from '@/types/generated';

const response = await fetch(
  'http://localhost:1337/api/articles?populate=*'
);
const data: StrapiResponse<Article[]> = await response.json();
``n` and create your first admin user

6. (Optional) Seed with example data:
   ```bash
   npm run seed:example
````

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (create `.env.local` file):

   ```env
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
   ```

4. Generate TypeScript types from Strapi:
   ```bash
   Available Scripts
   ```

### Backend (`backend/`)

```bash
npm run develop      # Start dev server with admin panel auto-reload
npm run dev         # Alias for develop
npm run build       # Build admin panel for production
npm run start       # Start production server
npm run seed:example # Seed database with example data
```

### Frontend (`frontend/`)

```bash
npm run dev         # Start Next.js dev server (Turbopack)
npm run build       # Build for production
npm run start       # Start production server
npm run types:sync  # Generate TypeScript types from Strapi
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
npm run lint        # Run ESLint
```

## Development Workflow

1. **Start Backend**: `cd backend && npm run develop`
2. **Create Content Types**: Use Strapi admin panel or edit JSON schemas
3. **Generate Types**: `cd frontend && npm run types:sync`
4. **Start Frontend**: `npm run dev`
5. **Code**: Frontend types auto-complete based on backend schemas! 🎉

### Making Schema Changes

When you modify content types in Strapi:

1. Save changes in Strapi admin panel (or edit JSON files)
2. Run `npm run types:sync` in frontend
3. TypeScript will immediately recognize the new structure
4. No manual type updates needed!

## Styling with Tailwind

This project uses **Tailwind CSS v3** which supports the `@apply` directive:

```css
.my-button {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
```

Prettier automatically formats your code on save in VS Code.

## Deployment

### Backend Deployment

Deploy Strapi v5 to:

- **Railway** (recommended)
- **Heroku**
- **DigitalOcean**
- **AWS**
- Any Node.js hosting with MySQL

### Frontend Deployment

Deploy Next.js to:

- **Vercel** (recommended)
- **Netlify**
- Any platform supporting Next.js

### Environment Variables

Remember to set all environment variables in your hosting platform's dashboard.

## Development URLs

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:1337/api`
- **Strapi Admin**: `http://localhost:1337/admin

## API Usage

Once Strapi is running, you can access the API endpoints:

- Articles: `GET /api/articles`
- Authors: `GET /api/authors`
- Categories: `GET /api/categories`
- Global settings: `GET /api/global`

## Deployment

### Backend Deployment

The Strapi backend can be deployed to various platforms:

- Heroku
- Vercel
- Railway
- DigitalOcean
- AWS

### Frontend Deployment

The frontend can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Development

- Backend runs on `http://localhost:1337`
- Admin panel available at `http://localhost:1337/admin`
- API endpoints available at `http://localhost:1337/api`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
