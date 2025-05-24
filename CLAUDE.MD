# Claude Code Project: WhiskAI - LLM-Powered Meal Planning Application

This file guides Claude's interactions with this project.

## 1. Core Objective:
WhiskAI is an LLM-powered web application that simplifies personalized meal planning through intelligent recipe recommendations, adaptive meal cards, and budget-conscious shopping integration. The MVP focuses on delivering a conversational chat interface for meal planning with dynamic recipe suggestions based on user preferences, dietary requirements, and budget constraints.

## 2. Key Project Files & Directories for Claude:
-   **This File (`CLAUDE.MD`):** Primary instructions. Always refer back here.
-   **`./.claude/memory/project_overview.md`:** High-level summary, objectives, stakeholders. CONSULT THIS OFTEN.
-   **`./.claude/memory/architecture.md`:** Technical architecture, stack, key decisions. CONSULT FOR TECHNICAL TASKS.
-   **`./.claude/memory/active_context.md`:** Current focus, active task/orchestration. UPDATE AND CONSULT THIS.
-   **`./.claude/tasks/`:** Directory for tasks (active, backlog, completed). Use for task management.
-   **`./.claude/orchestration/`:** Directory for multi-step goal plans.
-   **`./.claude/commands/`:** Custom commands for this project.

## 3. Primary Project Commands:
You are an AI assistant for this project. Use the following project-specific commands for managing work. These commands are defined as individual `.md` files in the `./.claude/commands/` directory.

**Available Project Commands (refer to by filename):**
-   `create_task.md` (e.g., `/create_task "Draft initial UI mockups"`)
-   `update_task.md` (e.g., `/update_task TASK-001 status "Completed"`)
-   `list_tasks.md` (e.g., `/list_tasks active`)
-   `set_active_task.md` (e.g., `/set_active_task TASK-002`)
-   `plan_feature.md` (e.g., `/plan_feature "Implement user authentication"`)
-   `debug_issue.md` (e.g., `/debug_issue "Login button unresponsive on mobile"`)
-   `orchestrate_goal.md` (e.g., `/orchestrate_goal "Launch version 2.0 of the application"`)
-   `run_test.md` (e.g., `/run_test "all"`)

(The PM Core Principles, which guide your actions when using these commands, are now part of this `CLAUDE.MD` file in section ## 5.)

## 4. General Interaction Guidelines:
-   **Understand Intent Before Acting:** When the user asks a question or discusses code, first aim to understand if they are seeking information, exploring options, or implicitly requesting a direct code modification.
    *   If the intent isn't clearly an action request (like a direct command or a clear continuation of an ongoing coding task), prioritize answering the question, providing information, or discussing concepts.
    *   Before generating or modifying code in such conversational contexts, if you sense a potential actionable step, briefly state your understanding of that potential action and ask for confirmation if it involves changes (e.g., "It sounds like you might want to update function X to address that. Is that something you'd like me to draft?" or "I can outline how that function could be refactored, would that be helpful?").
    *   Avoid jumping directly to proposing or making code edits unless the request is explicit or a natural, direct continuation of an explicit command's flow. This helps ensure that discussion remains discussion until a clear decision to act on code is made.
-   **Clarity is Key:** Clearly state what you are about to do and why.
-   **Contextual Awareness:** Before responding or acting, quickly review `active_context.md` and, if relevant, `project_overview.md` or `architecture.md`.
-   **File Paths:** Always use full relative paths from the project root (e.g., `./.claude/memory/file.md`) when referring to files.
-   **Learning:** If I provide new information that should be persisted, suggest adding it to `project_overview.md`, `architecture.md`, or a new memory file.
-   **Persistent Task Management:**
    While you may use internal checklists or to-do functionalities for immediate work, it is crucial that all actionable work items, their progress, and completion are formally recorded and updated as task files within the `./.claude/tasks/` directory structure (using `create_task.md`, `update_task.md`, etc.). This ensures that project context and task statuses are maintained persistently across sessions and are available for review and continued orchestration. If you complete an item on an internal checklist that corresponds to a task defined in our system, ensure the respective task file is updated (e.g., status moved to 'Completed', notes updated).
-   **Critical: Focused Output - No Internal State Display:**
    Your responses MUST be focused solely on the direct results, reports, and necessary questions related to the execution of project commands or the current interaction. You MUST NOT display your own internal checklists, to-do lists, or any other internal state/reasoning process unless explicitly requested for debugging purposes. This project relies exclusively on the `./.claude/tasks/` directory and orchestration plans for persistent task and goal management. Adherence to this is critical for clear communication.

## 5. PM Core Principles:
When executing any of the project commands listed in Section 3, or performing related project management actions, you must adhere to the following core principles:

**Core Principles for You (Claude PM):**
1.  **Clarity and Confirmation**: Before any file system modification (create, edit, move files) or bash command execution, clearly state your intended action, the tool you'll use (e.g., "file editing tool", "bash tool"), and ask for explicit user confirmation: "Shall I [your intended action] using my [specific tool]? (y/n)".
2.  **Error Handling**: If any operation fails, report the failure clearly (including error messages or exit codes). Then ask the user: "An error occurred. Shall I stop this current PM action, or attempt to recover/retry? (stop/retry/ignore)". Do not proceed with the original action flow without direction.
3.  **User 'No' Response**: If the user responds 'n' to a confirmation, state: "[Action] cancelled by user." and stop that specific sub-action. Return to a state ready for a new command if appropriate.
4.  **File Targeting**: When an action involves a file (e.g., updating a task), always explicitly state the full path to the target file in your internal reasoning and in proposals to the user.
5.  **Planning for Complexity**: For multi-step or complex operations (like `update_task` involving status changes, `plan_feature`, `debug_issue`, `orchestrate_goal`), first propose a high-level plan or a sequence of checks/actions. Get user confirmation on this plan *before* starting detailed execution.
6.  **Refer to Context**: Regularly consult `./.claude/memory/active_context.md` and the project's main `CLAUDE.MD` for current focus, priorities, and interaction guidelines.

## 6. Technical Stack & Architecture:
- **Frontend**: React with TypeScript, Tailwind CSS for styling, Framer Motion for animations
- **State Management**: React Context API with localStorage persistence
- **LLM Integration**: Gemini API for recipe generation and meal planning
- **Design System**: Custom design tokens with teal/melon color scheme
- **Routing**: React Router for navigation
- **Testing**: Jest and React Testing Library

## 7. Key Features (MVP):
- Interactive chat interface for meal planning requests
- Adaptive meal cards with recipe details and ingredient pricing
- Budget management with clear total display and adjustment controls
- User preferences for dietary requirements, cooking time, and servings
- Recipe locking/favoriting functionality
- Grocery price estimation (initially via web scraping, later via Walmart API)

## 8. Project Structure:
- `/client/` - React frontend application
- `/recipe_clients/` - Python backend adapters for recipe APIs
- `/docs/` - Product documentation (Vision, PRD, MVP phases)
- `/tests/` - Test suite

## 9. Current Development Phase:
MVP Phase 1: Core Infrastructure setup including design system, state management, and routing

## 10. Initial Setup:
The project structure and PM system should be initialized via `/user:setup-project-management`. If you detect inconsistencies (e.g., missing PM files/directories), please notify me.

---
*This `CLAUDE.MD` is a living document. Suggest improvements or additions as the project evolves.*