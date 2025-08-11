# CLAUDE.md

This file provides guidance to Claude Code when working with the Ambient project.

## Project Overview

Ambient is a zero-friction intention broadcasting system that transforms social coordination from a request-response obligation into an open declaration of availability. By generating shareable links that unfurl in existing messaging platforms, we eliminate the cognitive overhead of plan-making while preserving spontaneous human connection.

## Project Documentation Conventions (Important)

**Documentation Files:** All new documentation or task files must be saved under the `docs/` folder in this repository. For example:

- **Tasks & TODOs**: Save in `docs/{YYYY_MM_DD}/tasks/` (e.g., `docs/2025_01_11/tasks/FeatureImprovements.md`)
- **Requirements/Specs**: Save in `docs/{YYYY_MM_DD}/specs/` (e.g., `docs/2025_01_11/specs/UIEnhancements.md`)
- **Design Docs**: Save in `docs/{YYYY_MM_DD}/design/` (e.g., `docs/2025_01_11/design/MobileFirstApproach.md`)
- **Code Files**: Follow the Next.js 14 project structure in `src/`
- **Tests**: Put new test files under the `tests/` directory

> **Important:** When creating a new file, ensure the directory exists or create it. Never default to the root directory for these files.

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Language**: TypeScript
- **Deployment**: Render.com
- **State Management**: URL parameters as source of truth, localStorage for tracking

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Deploy (pushes to GitHub, Render auto-deploys)
git push origin main
```

## Current Project State

The Ambient app has been recently updated with:
- Mobile-first lowercase UI design
- Confirmation flow before creating links
- Smart time presets (now, in 30min, tonight, custom)
- LocalStorage tracking for created links
- No-pressure messaging explaining how the system works
- Consistent gradient styling and rounded corners

## Sub-Agent Integration

This project now includes Claude Sub-Agent Spec Workflow System agents for enhanced development capabilities:

### Available Agents

**Core Workflow Agents:**
- `spec-orchestrator` - Workflow coordination
- `spec-analyst` - Requirements analysis
- `spec-architect` - System design
- `spec-developer` - Code implementation
- `spec-tester` - Testing
- `spec-reviewer` - Code review
- `spec-validator` - Final validation

**Specialist Agents:**
- `senior-backend-architect` - Backend systems
- `senior-frontend-architect` - Frontend systems
- `ui-ux-master` - UI/UX design
- `refactor-agent` - Code quality improvement

### Usage Examples

```bash
# Complete workflow for new features
/agent-workflow "Add user authentication to Ambient"

# Individual agents for specific tasks
Use spec-developer: Implement dark mode toggle for the application
Use ui-ux-master: Improve mobile accessibility of the form components
Use refactor-agent: Optimize the intention encoding/decoding utilities

# High-quality enterprise development
/agent-workflow "Add analytics dashboard" --quality=95

# Quick prototype features
/agent-workflow "Add social sharing options" --quality=80
```

### Quality Standards for Ambient

- **Code Quality**: Maintain TypeScript strict mode, use meaningful variable names
- **Mobile-First**: All UI changes must work well on mobile devices
- **Accessibility**: Follow WCAG 2.1 AA guidelines
- **Performance**: Optimize for fast loading and minimal bundle size
- **Design Consistency**: Use existing gradient styling and rounded corners

## Project Philosophy

Key principles from the original PRD:
1. **Zero Authentication Threshold**: Every feature must work without signup
2. **Semantic Transformation**: Change requests into declarations
3. **Respect Existing Channels**: Enhance, don't replace, current messaging
4. **Progressive Disclosure**: Information reveals based on context/proximity
5. **Ambient, Not Alerting**: Create awareness without notification burden

The app should maintain its core philosophy of reducing friction in social coordination while being casual, lowercase, and pressure-free.