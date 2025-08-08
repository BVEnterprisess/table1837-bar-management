# Table 1837 Bar Management System

A comprehensive bar management system built with Next.js, Supabase, and TypeScript. Features include role-based authentication, real-time inventory management, OCR menu updates, voice recognition, and a complete database of 100 professional cocktail recipes.

## Features

- **🍸 100 Professional Cocktails** - Complete recipe database with instructions, ingredients, and measurements
- **👥 Role-Based Authentication** - Admin, Staff, and Viewer access levels
- **📱 Real-Time Inventory** - Voice recognition for quick updates
- **📄 OCR Menu Updates** - Upload photos to automatically update menus
- **⚡ Performance Optimized** - React Query caching, virtual scrolling, IndexedDB offline storage
- **🎨 Beautiful UI** - Preserved original design with glass panels and animations
- **📊 Real-Time Updates** - Live sync across all devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **Caching**: React Query, IndexedDB
- **Deployment**: Vercel with CI/CD

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/BVEnterprisess/table1837-bar-management.git
   cd table1837-bar-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Import cocktails from `database/cocktails.sql`

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase URL and keys
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Database Schema

The system uses a comprehensive PostgreSQL schema with:

- **Users & Roles** - Authentication and permission management
- **Cocktails & Ingredients** - Recipe database with relationships
- **Inventory Management** - Real-time stock tracking
- **Wine Collection** - Categorized wine database
- **86'd Items** - Out-of-stock tracking
- **Checklists** - Daily operation tasks

## Deployment

The app is configured for one-click deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main

## Performance Features

- **Database Optimization** - 15+ strategic indexes and materialized views
- **Client Caching** - React Query with aggressive caching strategies
- **Real-time Efficiency** - Optimized Supabase subscriptions
- **Offline Support** - Service worker with IndexedDB storage
- **Virtual Scrolling** - Handle 500+ items without performance impact

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, please open a GitHub issue or contact the development team.
