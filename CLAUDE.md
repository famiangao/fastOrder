# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron application built with Vite + React + TypeScript for fast order processing. The application allows users to manage order information and SKU mappings through a desktop interface.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compilation, Vite build, and electron-builder)
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest
- `npm run pretest` - Build for testing
- `npm run fix` - Run electron-fix start

### Database
The application uses SQLite database located at `static/fastOrder.db`. Database operations should follow the layered architecture pattern described below.

## Architecture

### Layered Architecture Pattern
The application follows a strict 3-layer architecture that must be respected:

1. **Views Layer** (`src/views/`) - React components that handle UI
   - Can ONLY call functions from `src/ddl/` folder
   - Must NOT directly call `src/dal/` or SQL operations

2. **Domain Logic Layer** (`src/ddl/`) - Business logic and data transformation  
   - Calls functions from `src/dal/` folder
   - Handles data validation and business rules

3. **Data Access Layer** (`src/dal/`) - Direct database operations
   - Contains SQL queries and database interactions
   - Uses `src/utils/sqlManage.ts` and `src/utils/sqliteTool.ts`

### Key Files
- `src/App.tsx` - Main application with React Router setup
- `electron/main/index.ts` - Electron main process
- `src/dal/orderInfo.ts` - Order data access layer with SQL operations
- `src/dal/skuMapper.ts` - SKU mapping data access layer
- `src/utils/sqliteTool.ts` - SQLite database wrapper with Promise-based API
- `src/utils/sqlManage.ts` - Higher-level SQL management utilities

### Database Schema
- `orderInfo` table: id, orderId, address, skuId, skuMapperId, status
- `skuMapper` table: id, sku, url, disabled, skuName

### Technology Stack
- **Frontend**: React 18 + TypeScript + Ant Design
- **Build**: Vite + electron-builder
- **Database**: SQLite3 with custom wrapper
- **Testing**: Vitest + Playwright
- **Styling**: Tailwind CSS + Ant Design

## Development Guidelines

### Code Organization
- Use TypeScript path alias `@/` for `src/` imports
- Follow the layered architecture - never bypass layers
- Database operations must use the Promise-based API in `sqliteTool.ts`
- All new questions/issues should be logged to `.cursor/log/` with current date filename

### Excel Integration
The application supports Excel import/export functionality using the `node-xlsx` library. Template files are located in `src/assets/`.

### Component Structure
- Use Ant Design components for UI consistency  
- Implement proper loading states and error handling
- Follow the existing patterns in `src/views/orderInfo.tsx` and `src/views/skuMapper.tsx`

### Electron Integration
- Main process handles file operations and system integration
- Renderer process uses Node.js APIs directly (nodeIntegration: true)
- IPC communication for operations requiring main process access