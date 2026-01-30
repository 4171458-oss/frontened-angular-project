# Change Log - Angular Modernization

## Template Syntax Modernization
- **Converted `*ngIf` to `@if` and `*ngFor` to `@for` in:**
  - `src/app/features/auth/pages/login-page/login-page.html`
  - `src/app/features/auth/pages/register-page/register-page.html`
  - `src/app/features/teams/pages/teams-page/teams-page.html`
  - `src/app/features/teams/components/team-list/team-list.html`
  - `src/app/features/teams/components/team-card/team-card.html`
  - `src/app/features/projects/pages/projects-page/projects-page.html`
  - `src/app/features/tasks/pages/task-board-page/task-board-page.html` (remaining parts)

## Dependency Injection (DI) Modernization
- **Refactored `constructor` injection to `inject()` in:**
  - `src/app/features/auth/services/auth.ts`
  - `src/app/features/teams/services/teams.ts`
  - `src/app/features/projects/services/projects.ts`
  - `src/app/features/auth/pages/login-page/login-page.ts`
  - `src/app/features/auth/pages/register-page/register-page.ts`

## Cleanup & Best Practices
- **Removed `console.log`, `console.error`:**
  - `login-page.ts`
  - `register-page.ts`
  - `projects-page.ts`
- **UX Improvements:**
  - Replaced `alert()` with specific error marking or suppressed properly in `projects-page.ts` and `task-board-page.ts`.
- **Naming Conventions:**
  - Fixed capitalization in `login-page.ts`: `AuthService` -> `authService`.
