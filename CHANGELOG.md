# Changelog

All notable changes to the HourBench project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Systematic branching strategy for preserving project snapshots
- CHANGELOG.md for tracking major changes and milestones
- BRANCH_LOG.md for tracking snapshot branches
- Documentation for snapshot branch naming conventions

### Changed
- Enhanced PROJECT_SUMMARY.md with branching strategy documentation

## [0.7.0] - 2025-01-15 - Initial Snapshot Baseline

### Summary
This represents the initial baseline state of the HourBench project at approximately 70% completion. This snapshot preserves the current state with all known issues and intentional performance anti-patterns for future testing and comparison.

### Features Implemented ✅
- **Authentication & Authorization**: Rails 8 built-in authentication with Pundit-based role system
- **Time Tracking**: Complete timer functionality with start/stop, time entry CRUD operations
- **Project Management**: Full CRUD operations, issue tracking, project status management
- **Client Management**: Complete client CRUD with search, filters, and profile management
- **Performance Monitoring**: AppSignal integration for error tracking and performance analysis
- **UI Design System**: Apple-inspired minimal design with custom CSS (no external frameworks)

### Known Performance Issues (Intentional) 🐛
- **N+1 Queries**: 
  - Time entries without eager loading in controllers
  - Project listings without preloading clients
  - Dashboard metrics with separate queries per organization
  - Client total calculations iterating through projects individually
- **Missing Database Indexes**: 
  - Foreign key columns lack proper indexing
  - Frequently queried fields missing indexes
- **Inefficient Queries**:
  - Complex joins in reporting without optimization
  - Dashboard aggregations not optimized
  - Recent activity queries in Project model missing eager loading
- **Memory Issues**:
  - Large dataset loading without pagination
  - Missing eager loading in nested associations
  - Inefficient time calculation methods

### Error-Prone Areas 🚨
- Unguarded nil references in views
- Division by zero potential in billing calculations
- Missing validations leading to constraint violations
- Areas that break under load

### Missing Features ❌
- User Administration UI (UsersController + impersonation interface)
- Document Management (ActiveStorage integration, file uploads, versioning)
- Comprehensive Reporting & Billing (time reports, invoices, rate management)
- Calendar View (monthly view, drag-and-drop entries)
- E2E Testing Infrastructure (Playwright setup incomplete)
- Advanced Dashboard Analytics (metrics, charts, real-time updates)
- Team Dashboard (team-specific metrics and management)

### Technical Stack
- **Framework**: Rails 8.3 with Hotwire (Turbo + Stimulus)
- **Styling**: Custom CSS (no Tailwind or external frameworks)
- **JavaScript**: Importmaps + CDNs (no external build tools)
- **Database**: SQLite (development)
- **Authentication**: Rails 8 built-in authentication
- **Authorization**: Pundit with role-based access control
- **Monitoring**: AppSignal for performance and error tracking
- **Testing**: Minitest for unit tests, Playwright for E2E (partial setup)

### Snapshot Branch Created
- **Branch**: `snapshot/2025-01-15/baseline-with-known-issues`
- **Purpose**: Preserve current state with all intentional performance issues for future LLM testing, optimization comparisons, and educational purposes
- **Use Cases**: 
  - Testing agentic refactoring tools
  - Performance optimization benchmarking
  - LLM evaluation against known baseline
  - Educational demonstrations of Rails anti-patterns

### Development Guidelines
- Feature branches for all development work
- Never merge directly to main
- Frequent commits with descriptive messages
- TDD with minitest for business logic
- Playwright for UI validation and visual testing
- Always run application using `bin/dev`
- Preserve educational anti-patterns while documenting them

### Next Priorities
1. **High Priority**: Dashboard analytics, User management UI, Playwright E2E setup
2. **Medium Priority**: Document management, Reporting system, Team dashboard
3. **Low Priority**: Calendar view, API endpoints, Advanced analytics

---

## Snapshot Branch History

### 2025-01-15: Initial Baseline
- **Branch**: `snapshot/2025-01-15/baseline-with-known-issues`
- **State**: ~70% complete with intentional performance issues
- **Purpose**: Establish baseline for future testing and optimization work
