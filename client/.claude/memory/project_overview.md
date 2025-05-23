# WhiskAI Project Overview

## Project Name
WhiskAI - AI-Powered Meal Planning Assistant

## Vision
To make healthy, budget-conscious meal planning effortless and enjoyable through AI assistance. WhiskAI aims to be the smartest meal planning assistant that learns your preferences, respects your budget, and helps you eat better without the stress.

## Core Value Proposition
An AI-powered meal planning assistant that:
- Understands dietary preferences and restrictions
- Respects budget constraints while maximizing nutrition
- Generates weekly meal plans with real recipes
- Creates smart shopping lists
- Learns and adapts to user preferences over time

## Target Users
1. **Busy Professionals** (Primary)
   - 25-45 years old
   - Value convenience and health
   - Willing to pay for time-saving solutions

2. **Health-Conscious Individuals**
   - Track macros/calories
   - Have specific dietary goals
   - Need variety in meal plans

3. **Budget-Conscious Families**
   - Need to feed multiple people
   - Want nutritious meals on a budget
   - Appreciate batch cooking options

## Key Features
1. **AI Chat Interface** - Natural conversation with Curie (AI assistant)
2. **Smart Recipe Generation** - Personalized recipes using Gemini AI + Spoonacular
3. **Budget Optimization** - Stays within budget while maximizing nutrition
4. **Meal Planning** - Drag-and-drop weekly meal calendar
5. **Shopping Lists** - Aggregated, organized grocery lists
6. **Nutritional Tracking** - Automatic macro and calorie calculations

## Current State (May 2025)
- Basic chat interface with Gemini AI integration
- Spoonacular API client ready
- MVP phases documented but not implemented
- Ready for Phase 0: Foundation Cleanup

## Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (conversations), Spoonacular API (recipes)
- **State**: Context API (may migrate to Redux)
- **Routing**: React Router
- **Animations**: Framer Motion
- **API Layer**: TBD (Serverless functions or Express)

## Project Stakeholders
- **Product Owner**: Japhet
- **Development**: Claude (AI Assistant)
- **Users**: Beta testers (after Phase 4)

## Success Metrics
- User can complete full meal planning flow in < 5 minutes
- 80% of suggested recipes meet user preferences
- Shopping lists save 30+ minutes per week
- Budget tracking accuracy within 5%

## MVP Timeline
- Phase 0: Foundation Cleanup (1-2 days)
- Phase 1: Core Infrastructure (1-2 weeks)
- Phase 2: Core User Flow (2-3 weeks)
- Phase 3: Spoonacular Enhancement (1 week)
- Phase 4: Meal Planning (1-2 weeks)
- Total MVP: ~6-8 weeks

## Key Principles
1. **Always Shippable** - Every commit leaves the app working
2. **Progressive Enhancement** - Features appear only when complete
3. **User-Centric Design** - Curie provides friendly, helpful guidance
4. **Performance First** - Fast, responsive, works on all devices
5. **Privacy Conscious** - Minimal data collection, transparent practices