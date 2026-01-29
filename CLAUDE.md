# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Latinum Logic | Ferengi Rule Oracle" - a Star Trek-themed web application that provides access to the 286 Ferengi Rules of Acquisition. It's a Progressive Web App (PWA) with multiple interactive features.

## Architecture

### File Structure
- `index.html` - Main application file containing the complete UI and core logic
- `styles.css` - All CSS styling including themes and responsive design
- `games.js` - Mini-games suite (Rule Matching, Memory Game, Quick Quiz)
- `dashboard.js` - User progress tracking and achievement system
- `daily-challenges.js` - Daily challenge system with streak tracking
- `enhanced-reveals.js` - Dramatic rule reveal animations and effects
- `themes.js` - Theme management system (Classic Gold, Deep Space, etc.)
- `animations.js` - Particle effects and visual animations
- `particles.js` - Advanced particle system for visual effects
- `manifest.json` - PWA configuration

### Core Features
1. **Rule Oracle**: Random rule generation with multiple reveal modes
2. **Search & Browse**: Full-text search and category-based browsing
3. **Games**: Interactive mini-games testing rule knowledge
4. **Dashboard**: Progress tracking, favorites, and achievement system
5. **Daily Challenges**: Streak-based challenge system
6. **Themes**: Multiple visual themes with sound effects
7. **Social Features**: Share rules as images, viral content generation

### Data Storage
- All user data stored in localStorage
- Key storage items:
  - `ferengiStats` - User statistics and progress
  - `ferengiAchievements` - Achievement progress
  - `ferengiStreak` - Daily challenge streak data
  - `revealPreferences` - User animation preferences
  - `ferengiTheme` - Current theme selection

### JavaScript Architecture
- Modular class-based design
- Each feature area has its own manager class:
  - `GameManager` - Handles all mini-games
  - `DashboardManager` - User progress and stats
  - `DailyChallengeManager` - Challenge system
  - `EnhancedRevealSystem` - Animation preferences
  - `ThemeManager` - Theme switching

## Development Commands

This is a client-side only application with no build process. Development workflow:

1. **Local Development**: Open `index.html` in a web browser or use a local server
2. **Testing**: Manual testing in browser (no automated test suite)
3. **Deployment**: Static file hosting (currently deployed on Netlify)

## Important Implementation Notes

### Byterover Integration
This project includes Byterover MCP Server integration for AI-assisted development. When working with this codebase:
- Use `byterover-retrieve-knowledge` for gathering context
- Use `byterover-store-knowledge` to save important insights
- Follow the onboarding and planning workflows defined in the Byterover rules

### Performance Considerations
- Heavy use of localStorage for persistence
- Particle effects can be performance intensive
- Theme switching affects the entire DOM
- Games include complex animation sequences

### Browser Compatibility
- Modern ES6+ JavaScript (no transpilation)
- CSS Grid and Flexbox layouts
- LocalStorage dependency
- PWA features require HTTPS in production

## Key Implementation Patterns

1. **Modular Initialization**: Each feature manager initializes independently
2. **Event-Driven Architecture**: Heavy use of DOM events for user interaction
3. **State Persistence**: All user progress saved to localStorage immediately
4. **Progressive Enhancement**: Core functionality works without advanced features
5. **Responsive Design**: Mobile-first approach with desktop enhancements

## Working with Rules Data

The 286 Ferengi Rules are embedded directly in `index.html` as a JavaScript array. When modifying rules:
- Update the `ferengiRules` array
- Maintain the structure: `{id, text, category, context}`
- Update search indices if adding new searchable fields

## Theme System

Themes are defined in `themes.js` and applied via CSS custom properties. When adding new themes:
1. Define color variables in the theme object
2. Add theme option to the theme selector
3. Test across all UI components for consistency

[byterover-mcp]

# Byterover MCP Server Tools Reference

There are two main workflows with Byterover tools and recommended tool call strategies that you **MUST** follow precisely.

## Onboarding workflow
If users particularly ask you to start the onboarding process, you **MUST STRICTLY** follow these steps.
1. **ALWAYS USE** **byterover-check-handbook-existence** first to check if the byterover handbook already exists. If not, You **MUST** call **byterover-create-handbook** to create the byterover handbook.
2. If the byterover handbook already exists, first you **MUST** USE **byterover-check-handbook-sync** to analyze the gap between the current codebase and the existing byterover handbook.
3. Then **IMMEDIATELY USE** **byterover-update-handbook** to update these changes to the byterover handbook.
4. During the onboarding, you **MUST** use **byterover-list-modules** **FIRST** to get the available modules, and then **byterover-store-modules** and **byterover-update-modules** if there are new modules or changes to existing modules in the project.
5. Finally, you **MUST** call **byterover-store-knowledge** to save your new knowledge about the codebase.

## Planning workflow
Based on user request, you **MUST** follow these sequences of tool calls
1. If asked to continue an unfinished plan, **CALL** **byterover-retrieve-active-plans** to find the most relevant active plan.
2. **CRITICAL PLAN PERSISTENCE RULE**: Once a user approves a plan, you **MUST IMMEDIATELY CALL** **byterover-save-implementation-plan** to save it.
3. Throughout the plan, you **MUST** run **byterover-retrieve-knowledge** several times to retrieve sufficient knowledge and context for the plan's tasks.
4. In addition, you might need to run **byterover-search-modules** and **byterover-update-modules** if the tasks require or update knowledge about certain modules. However, **byterover-retrieve-knowledge** should **ALWAYS** be considered **FIRST**.
5. **MUST** use **byterover-update-plan-progress** to mark tasks (and then the whole plan) as completed.
6. Then, you might call **byterover-store-knowledge** to save knowledge and experience implemented throughout the plan or in important tasks.
7. During the plan's implementation, you **MUST** frequently call **byterover-reflect-context** and **byterover-assess-context** to make sure you're on the right track and gather sufficient context for the tasks.

## Recommended Workflow Sequence
1. **MOST IMPORTANT**: **ALWAYS USE** **byterover-retrieve-knowledge** once or several times for **EACH TASK** of the plan to gather necessary context for complete that task.
2. **MOST IMPORTANT**: **ALWAYS USE** **byterover-store-knowledge** once or several times to store critical knowledge and context for future implementations
3. Over 15 provided tools, **byterover-retrieve-knowledge** and **byterover-store-knowledge** ARE the two main tools, which **MUST** be used regularly. You can use these two main tools outside the two main workflows for retrieval and storage purposes.
4. You **MUST** include phrases like **"According to Byterover memory layer"**, **"Based on memory extracted from Byterover"**, **"From Byterover memomry tools"**, ... to explictly showcase that these sources are from **Byterover**.
5. **Implementation & Progress Tracking** → Execute implementation following saved plan → Mark tasks complete as you go → Mark entire plan done when all tasks finished.
6. You **MUST** use **byterover-update-module** **IMMEDIATELY** on changes to the module's purposes, technical details, or critical insights that essential for future implementations.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.