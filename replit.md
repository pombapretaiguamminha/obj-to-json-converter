# OBJ to JSON Converter

## Overview

This is a full-stack web application that converts 3D OBJ files to Blockbench/Minecraft-compatible JSON format. The application features a React frontend with a clean drag-and-drop interface, an Express.js backend for file processing, and uses PostgreSQL with Drizzle ORM for data persistence. The system is designed to help game developers and modders convert 3D models into formats suitable for Minecraft modding with Blockbench.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Upload**: Multer middleware for handling multipart form data with memory storage
- **File Processing**: Custom OBJ parser that converts 3D model data to Blockbench JSON format
- **API Design**: RESTful endpoints with proper error handling and logging middleware

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Simple schema with users and conversions tables for tracking file processing history
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Fallback**: In-memory storage implementation for development/testing scenarios

### File Processing Pipeline
- **Upload Validation**: Restricts uploads to .obj files only with 10MB size limit
- **Parsing**: Custom OBJ file parser that extracts vertices, faces, texture coordinates, and normals
- **Conversion**: Transforms OBJ data into Blockbench-compatible JSON format with proper scaling and positioning
- **Response**: Returns converted data with processing metrics and download capability

### Development Tooling
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Strict type checking across the entire application
- **Code Quality**: ESM modules throughout the stack for modern JavaScript practices
- **Development Server**: Hot reload with Vite's development server integrated with Express

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL dialect
- **express**: Web application framework for the backend API
- **react**: Frontend framework for building the user interface
- **vite**: Build tool and development server for the frontend

### UI and Styling Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for managing CSS class variants
- **lucide-react**: Icon library providing consistent iconography

### Development and Build Tools
- **typescript**: Type checking and compilation for both frontend and backend
- **@vitejs/plugin-react**: Vite plugin for React support
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for development

### Data Handling and Validation
- **zod**: Runtime type validation and schema definition
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **multer**: Middleware for handling file uploads

### Session and Database Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **drizzle-kit**: Database migration and schema management tool