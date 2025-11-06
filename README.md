# Website Bootstrap

A full-stack website bootstrap project with Strapi CMS backend and modern frontend setup.

## Project Structure

```
├── backend/                 # Strapi CMS Backend
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   │   ├── article/    # Article content type
│   │   │   ├── author/     # Author content type
│   │   │   ├── category/   # Category content type
│   │   │   └── global/     # Global settings
│   │   └── components/     # Shared components
│   │       └── shared/     # Reusable content components
│   ├── config/             # Strapi configuration
│   ├── data/              # Sample data and uploads
│   └── database/          # Database migrations
└── package.json           # Root package.json for frontend

```

## Backend (Strapi CMS)

### Content Types

- **Article**: Blog posts and articles with rich content
- **Author**: Author profiles and information
- **Category**: Content categorization
- **Global**: Site-wide settings and configurations

### Shared Components

- **Media**: Image and media handling
- **Quote**: Quote blocks for content
- **Rich Text**: Rich text editor content
- **SEO**: SEO metadata components
- **Slider**: Image/content sliders
- **Video Embed**: Embedded video content

### Features

- TypeScript support
- RESTful API endpoints
- Media upload handling
- Extensible content structure
- Development and production configurations

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run develop
   ```

4. Open your browser and go to `http://localhost:1337/admin` to access the Strapi admin panel.

### Frontend Setup

1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

Create a `.env` file in the backend directory with your environment-specific settings:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

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