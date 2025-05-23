# Phase 2: Core User Flow - Orchestration Plan

## Goal Definition
**Goal**: Implement the complete MVP core user flow including asset integration, landing page, onboarding, recipe integration, and budget management
**Duration**: 2-3 weeks
**Prerequisites**: Phase 1 (Core Infrastructure) ✅ COMPLETED

## Goal Scope
**In Scope**:
- Brand asset integration (WhiskAI logo, Curie avatar)
- Landing page with animations
- Multi-step onboarding flow
- Spoonacular recipe integration
- Recipe browsing and management
- Budget adjustment modal
- Testing at each stage

**Out of Scope**:
- User authentication (deferred to Phase 3)
- Social features
- Advanced meal planning algorithms
- Payment integration

## Major Phases

### Phase 2.0: Asset Integration
**Objective**: Integrate WhiskAI brand assets throughout the application
**Status**: Not Started
**Deliverables**:
- Assets copied to public/assets/
- WhiskAI logo in header
- Curie avatar component
- Curie integrated in chat interface
- Optimized image variants

**Actions**:
- CREATE_TASK: Set up public/assets directory and copy brand images ✅ COMPLETED
- CREATE_TASK: Replace header "W" placeholder with WhiskAI logo ✅ COMPLETED
- CREATE_TASK: Create reusable Curie avatar component ✅ COMPLETED
- CREATE_TASK: Integrate Curie avatar in chat interface ✅ COMPLETED
- CREATE_TASK: Optimize images for multiple resolutions
- USER_ACTION: Test visual consistency across all pages

### Phase 2.1: Landing Page
**Objective**: Create engaging landing page with Curie animations
**Status**: Not Started
**Deliverables**:
- Landing page component
- Curie entrance animations
- Feature preview cards
- Call-to-action buttons
- Smooth navigation to onboarding

**Actions**:
- CREATE_TASK: Design and implement landing page layout
- CREATE_TASK: Add Curie animations with Framer Motion
- CREATE_TASK: Create feature preview cards
- CREATE_TASK: Implement CTA buttons with routing
- USER_ACTION: Test landing page on mobile and desktop

### Phase 2.2: Onboarding Flow
**Objective**: Build multi-step user preference collection
**Status**: Not Started
**Deliverables**:
- Multi-step onboarding container
- DietaryPreferences step
- TimeAndServings step
- BudgetSetup step
- Progress indicators
- Data persistence to context

**Actions**:
- CREATE_TASK: Create onboarding container with step management
- CREATE_TASK: Implement DietaryPreferences component
- CREATE_TASK: Implement TimeAndServings component
- CREATE_TASK: Implement BudgetSetup component
- CREATE_TASK: Add progress indicators and animations
- CREATE_TASK: Connect onboarding to UserPreferences context
- USER_ACTION: Test complete onboarding flow and data persistence

### Phase 2.3: Recipe Integration
**Objective**: Connect Spoonacular API for real recipe data
**Status**: Not Started
**Deliverables**:
- Hybrid recipe service (Gemini + Spoonacular)
- RecipeCard component with images
- Recipe refresh functionality
- Loading and error states

**Actions**:
- CREATE_TASK: Create recipe service integrating Spoonacular client
- CREATE_TASK: Build RecipeCard component with real data
- CREATE_TASK: Implement recipe refresh functionality
- CREATE_TASK: Add comprehensive error handling
- CREATE_TASK: Create loading skeletons for recipe cards
- USER_ACTION: Test API integration and error scenarios

### Phase 2.4: Recipes Page
**Objective**: Create recipe browsing and management interface
**Status**: Not Started
**Deliverables**:
- Recipes grid layout
- Budget warnings
- Macro progress tracking
- Recipe locking/favoriting
- Filter and sort options

**Actions**:
- CREATE_TASK: Implement recipes page with grid layout
- CREATE_TASK: Add budget calculation and warnings
- CREATE_TASK: Create macro progress visualization
- CREATE_TASK: Implement recipe locking mechanism
- CREATE_TASK: Add filter and sort functionality
- USER_ACTION: Test recipe management features

### Phase 2.5: Budget Modal
**Objective**: Enable budget adjustment with conflict detection
**Status**: Not Started
**Deliverables**:
- Budget adjustment modal
- Conflict detection logic
- Real-time updates
- Clear user feedback

**Actions**:
- CREATE_TASK: Create budget modal component
- CREATE_TASK: Implement conflict detection algorithm
- CREATE_TASK: Add real-time budget recalculation
- CREATE_TASK: Create clear UI feedback for conflicts
- USER_ACTION: Test budget adjustments and edge cases

## Key Dependencies
- Phase 2.0 → No dependencies (can start immediately)
- Phase 2.1 → Requires Phase 2.0 (needs brand assets)
- Phase 2.2 → Requires Phase 2.1 (user flow from landing)
- Phase 2.3 → Requires Phase 2.2 (needs user preferences)
- Phase 2.4 → Requires Phase 2.3 (needs recipe data)
- Phase 2.5 → Requires Phase 2.4 (needs recipe context)

## Resource Needs Assessment
- **Development**: 2-3 weeks of focused development
- **Assets**: WhiskAI logo and Curie avatar (already available)
- **API Access**: Spoonacular API (client already implemented)
- **Testing**: Manual testing after each phase
- **Design**: May need additional mockups for landing page

## Critical Risks and Timeline Impacts
- **API Rate Limits**: Spoonacular API may have rate limits affecting testing
- **Asset Quality**: May need to optimize images for web performance
- **State Complexity**: Recipe state management may require refactoring
- **Mobile Responsiveness**: Each component needs thorough mobile testing
- **Performance**: Animation performance on lower-end devices

## Parallelization Opportunities
- Phase 2.0 and initial Phase 2.1 design can happen in parallel
- RecipeCard component (Phase 2.3) can be developed while finishing Phase 2.2
- Budget modal design (Phase 2.5) can start during Phase 2.4

## Testing Strategy
**After Each Phase**:
1. Run development server and verify functionality
2. Check TypeScript compilation (no errors)
3. Run linter (`npm run lint`)
4. Test on mobile viewport
5. Verify state persistence
6. Check browser console for errors

**Key Test Points**:
- Phase 2.0: Visual consistency check
- Phase 2.1: Animation performance
- Phase 2.2: Data flow to context
- Phase 2.3: API error handling
- Phase 2.4: State management under load
- Phase 2.5: Edge case handling

## Success Criteria
- All brand assets integrated consistently
- Smooth user flow from landing to recipe browsing
- Real recipe data displayed with images
- Budget tracking functional
- No TypeScript or linting errors
- Mobile responsive design
- Performance remains smooth with animations

## Next Steps
1. Begin Phase 2.0 by setting up assets directory
2. Copy brand images to proper location
3. Update Header component with WhiskAI logo
4. Test after each component update