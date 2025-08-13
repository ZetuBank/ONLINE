# KISS - Keep It Simple & Stunning

## Overview

KISS is a modern, single-page application (SPA) showcasing a design philosophy centered around simplicity and elegance. The project demonstrates a clean, minimalist approach to web development with a focus on user experience, responsive design, and aesthetic appeal. It serves as a portfolio/showcase website featuring sections for home, about, services, portfolio, and contact information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA) Pattern**: The application uses a client-side routing approach with JavaScript to dynamically load content without page refreshes. The `KissApp` class manages navigation and page state through a simple router system that loads HTML content from the `/pages` directory.

**Component Structure**: 
- **Main Application Class** (`KissApp`): Centralized state management and navigation control
- **Dynamic Content Loading**: HTML fragments stored in separate files and loaded via JavaScript
- **Theme Management**: CSS custom properties with dark/light theme switching capability
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox layouts

**State Management**: Simple JavaScript class-based state management without external frameworks, maintaining current page state, loading states, and theme preferences in localStorage.

### Styling Architecture

**CSS Custom Properties System**: Comprehensive theming system using CSS variables for colors, spacing, and effects, enabling seamless dark/light mode switching.

**Design System Components**:
- Card-based layouts for content sections
- Gradient color schemes with primary, secondary, and accent colors
- Icon integration using Font Awesome
- Typography system using Inter font family
- Animation and transition systems for smooth interactions

### Asset Management

**Static Asset Approach**: All assets are served statically without build processes, making deployment simple and straightforward.

**Font and Icon Integration**: External CDN resources for Google Fonts (Inter) and Font Awesome icons.

## External Dependencies

**Font Awesome CDN** (v6.0.0): Provides comprehensive icon library for UI elements and visual indicators.

**Google Fonts API**: Supplies the Inter font family with multiple weights (300-700) for consistent typography across the application.

**HTTP Server Package**: Node.js development server dependency for local development and testing.

**No Database Dependencies**: The application is purely static with no backend data persistence requirements.

**No Authentication Systems**: Simple showcase website with no user management or authentication requirements.