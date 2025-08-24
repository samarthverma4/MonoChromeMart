# E-commerce Platform with AI Shopping Assistant

## Overview

This is a full-stack e-commerce platform built with React, Express, and PostgreSQL that features an AI-powered shopping assistant. The application allows customers to browse products, manage their cart, and interact with an AI assistant powered by Google's Gemini AI to help them find and select products through natural language conversations. The platform also includes an admin interface for product and order management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Single-page application using React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing with pages for home, admin, checkout, and 404
- **UI Framework**: Shadcn/ui component library with Radix UI primitives and Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express Server**: RESTful API server with TypeScript support
- **Monorepo Structure**: Shared schema and types between client and server via `shared/` directory
- **Development Setup**: TSX for TypeScript execution in development, ESBuild for production bundling
- **API Design**: RESTful endpoints for products, cart, orders, and AI chat functionality

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL as the primary database
- **Database Provider**: Neon serverless PostgreSQL for cloud deployment
- **Schema Management**: Centralized schema definitions in `shared/schema.ts` with Zod validation
- **Migration System**: Drizzle Kit for database schema migrations

### Key Data Models
- **Products**: Name, description, price, category, image URL, inventory tracking
- **Orders**: Customer information, items (JSON), status, timestamps
- **Cart Items**: Session-based cart with product references and quantities
- **Users**: Basic user management with username/password authentication

### AI Integration
- **Google Gemini AI**: Integrated via `@google/genai` for natural language product search and recommendations
- **Shopping Intent Analysis**: AI categorizes user messages into search, recommend, add to cart, get info, or general intents
- **Conversational Commerce**: Users can interact with products through natural language queries

### Session Management
- **Stateless Sessions**: Cart items tied to browser-generated session IDs stored in localStorage
- **No Authentication Required**: Guest checkout system for simplified user experience

### External Dependencies

#### AI Services
- **Google Gemini AI**: Powers the conversational shopping assistant for product search, recommendations, and natural language interactions

#### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL database for production deployments
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

#### UI & Styling
- **Shadcn/ui**: Pre-built accessible React components
- **Radix UI**: Headless UI primitives for complex interactive components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography

#### Development Tools
- **Vite**: Modern build tool with HMR and optimized bundling
- **TanStack Query**: Data fetching and caching library for API calls
- **Wouter**: Lightweight routing solution for React
- **TypeScript**: Static typing for both frontend and backend code