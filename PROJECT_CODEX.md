# Project Codex Notes

## Overview
- Root layout configures global fonts, SEO, and wraps pages with navigation, footer, toaster, and PWA utilities (`src/app/layout.tsx`).
- Navigation and footer surface marketing routes and theme toggling (`src/components/layout/Navigation.tsx`, `src/components/shared/footer.tsx`).
- Landing page delivers SaaS-style hero, feature highlights, and testimonials built from shared layout primitives (`src/app/page.tsx`).
- Feature index groups capabilities with icon cards and breadcrumbs for deeper marketing content (`src/app/features/page.tsx`).

## Domain Highlights
- SMART goals workspace offers list/card views with filtering, sorting, and progress tracking on mock data (`src/app/goals/page.tsx`).
- `SmartScoreBadge` visualizes SMART goal quality via breakdowns and suggestions (`src/components/SmartScoreBadge/SmartScoreBadge.tsx`).
- Mock goals API emulates CRUD, pagination, and bulk actions (`src/lib/api/goals.ts`).
- Zustand store exports centralize goal, selection, and wizard state plus debugging helpers (`src/lib/state/index.ts`).

## Supporting Infrastructure
- Base API client adds retries, auth headers, caching, and interceptors (`src/lib/api/client.ts`).
- Utility helpers cover Tailwind class merging, formatting, validation, and text transforms (`src/lib/utils.ts`).
- PWA components manage install prompts, offline status, and service worker updates (`src/components/pwa/InstallPrompt.tsx`, `src/components/pwa/PWAStatus.tsx`).
- Middleware enforces CSP and security headers; dashboard and auth layouts support app sections beyond marketing (`src/middleware.ts`, `src/components/layout/DashboardLayout.tsx`, `src/app/(auth)/layout.tsx`).
