# HourBench - Project Management App - AI Assistant Reference

## Purpose
Experimental application with intentional performance issues, anti-patterns & bugs for:
- Performance monitoring/optimization learning
- Applicant code task assessment
- LLM evaluation and testing
- Agentic coding agent assessment

**NOT production-ready** 
- Focus on demonstration and learning.
- Note the [rails_performance_and_error_examples_.md](rails_performance_and_error_examples_.md)


## Development Guidelines
- TDD with minitest in `test/`
- Playwright E2E tests in `tests/`
- Always run the app using `bin/dev`
- Use Playwright when developing UI - check console errors, page errors, request failures, visual validation,
  screenshots for visual analysis `script/playwright` persist scripts for reuse
- Feature branches → specific problem branches (performance, security, bugs, etc.)
- Never merge to main
- Frequent commits

## Branching Strategy

### Snapshot Branches for Testing & Comparison
We maintain systematic snapshot branches to preserve project states for:
- **LLM Testing**: Evaluate agentic coding tools against known baselines
- **Performance Benchmarking**: Measure optimization improvements
- **Educational Purposes**: Demonstrate Rails anti-patterns and fixes
- **Regression Testing**: Ensure changes don't break existing functionality

### Naming Convention
**Format**: `snapshot/{YYYY-MM-DD}/{milestone-type}-{brief-description}`

**Milestone Types**:
- `baseline`: Initial state or major milestone baseline
- `pre-optimization`: State before performance optimization work
- `pre-refactor`: State before major refactoring
- `pre-feature`: State before implementing major features
- `post-fix`: State after fixing major issues (for comparison)

**Examples**:
- `snapshot/2025-01-15/baseline-with-known-issues`
- `snapshot/2025-01-20/pre-optimization-n-plus-one-queries`
- `snapshot/2025-01-25/pre-refactor-dashboard-analytics`

### Documentation
- **CHANGELOG.md**: Major changes, milestones, and snapshot creation events
- **BRANCH_LOG.md**: Detailed tracking of all snapshot branches and their purposes
- Each snapshot documents: purpose, preserved state, known issues, use cases, testing instructions

## Tech Stack

### Core Framework
```
Rails 8.3 + built-in authentication
Hotwire (Turbo + Stimulus)
Custom CSS (no Tailwind/external frameworks)
JavaScript via Importmaps + CDNs
SQLite (development)
```

### Rails 8 Features
```
Solid Cache, Solid Queue, Solid Cable
AppSignal (performance monitoring)
```

### Pending Implementation
```
Playwright (E2E testing)
ActiveStorage (file uploads)
ActionText (rich text)
```

### Testing Strategy
```
Rails Fixtures + Faker (not FactoryBot)
Large fake datasets for performance testing
```

## Domain Model

### User Roles & Permissions
```
System Admin    → Full access + impersonation
Organization Admin → Org-level management
Team Admin      → Team-level management
Regular User    → Assigned projects only
Freelancer      → Personal projects/clients
```

### Core Models (All ✅ Complete)
```ruby
# app/models/
Organization  # name, description
Team         # name, description, organization_id
User         # email, name, role(enum)
Client       # name, email, phone, company, status(enum)
Project      # name, description, status(enum), hourly_rate, budget
Issue        # title, description, status(enum), priority(enum)
TimeLog      # start_time, end_time, duration_minutes, description, billable
Document     # title, description, document_type, version
Address      # polymorphic: Client, Organization
```

### Authorization
```ruby
# Pundit-based (app/policies/)
# Role-based access control implemented
# User impersonation for admins
```

## Performance Issues (Intentional ✅)

### N+1 Queries
```ruby
# Time entries without eager loading
# Project listings without preloading clients
# Dashboard metrics with separate queries per org
```

### Database Issues
```ruby
# Missing indexes on foreign keys
# Inefficient joins in reporting queries
# Unoptimized dashboard aggregations
```

### Error-Prone Code
```ruby
# Unguarded nil references in views
# Division by zero in billing calculations
# Missing validations → constraint violations
```

### Memory Issues
```ruby
# Large dataset loading without pagination
# Missing eager loading in nested associations
# Inefficient time calculation methods
```

## UI Design System ✅

### Styling
```css
/* Apple-inspired minimal design */
Background: #F9FAFB
Text: #1A1A1A
Accents: #4F46E5 (deep indigo)
Typography: Inter/SF Pro Display
Spacing: 24-40px padding, 2xl rounded corners
Icons: Lucide icons
Layout: Full-screen + top navigation + responsive
```

## Feature Status

### ✅ Complete
```
Time Tracking    → Start/stop timer, entry management
Project Management → CRUD, filters, search, issue tracking
Client Management → CRUD, search, filters, profiles
Authentication   → Rails 8 built-in + role-based auth
Authorization    → Pundit policies for all roles
```

### ⏳ Partial
```
Dashboards → Basic structure, missing metrics/charts
```

### ❌ Missing
```
Document Management → File uploads, preview, versioning
Reporting & Billing → Time reports, invoices, rate management
Calendar View → Monthly view, drag-and-drop entries
User Administration → Management UI, impersonation interface
Team Dashboard → Team-specific metrics and management
```

## File Structure

### Controllers
```ruby
# app/controllers/
application_controller.rb    # Base controller with auth
dashboard_controller.rb      # Role-based dashboards
time_logs_controller.rb     # Timer + time entry CRUD
projects_controller.rb      # Project management
clients_controller.rb       # Client management
sessions_controller.rb      # Authentication

# Missing:
# organizations_controller.rb, teams_controller.rb
# users_controller.rb, documents_controller.rb, reports_controller.rb
```

### Views
```erb
# app/views/
layouts/application.html.erb # Main layout with navigation
dashboard/                   # Role-based dashboard views
time_logs/                   # Timer interface + time entries
projects/                    # Project CRUD + issue tracking
clients/                     # Client management
sessions/                    # Login/logout
```

### Models & Policies
```ruby
# app/models/ - All core models complete
# app/policies/ - Pundit authorization for all models
```

### Database
```ruby
# db/
# All migrations complete
# Seeds with Faker data (db/seeds.rb)
# Intentional missing indexes for performance issues
```

## Development Setup

### Quick Start
```bash
# Clone and setup
bundle install
rails db:create db:migrate db:seed

# Run with test credentials enabled
SHOW_TEST_CREDENTIALS=true bin/dev

# Testing
rails test                    # Unit tests
npx playwright test          # E2E tests (when implemented)
```

### Test Users (password: password123)
```
System Admin: admin@hourbench.com
Org Admin: alice.johnson@techsolutions.com
Team Admin: david.brown@techsolutions.com
User: grace.lee@techsolutions.com
Freelancer: blake.freeman@freelance.com
```

## Priority Tasks

### High Priority
```
1. Dashboard Analytics → Add metrics/charts (Chart.js via importmap)
2. User Management → UsersController + impersonation UI
3. Testing → Playwright E2E test setup
```

### Medium Priority
```
1. Document Management → ActiveStorage integration
2. Reporting System → Time reports + export (CSV/PDF)
3. Team Dashboard → Team-specific metrics
```

### Low Priority
```
1. Calendar View → Monthly calendar + drag-and-drop
2. API Endpoints → REST API for integrations
3. Advanced Analytics → Real-time updates with Turbo Streams
```

## Current Status: ~70% Complete

### Working ✅
```
Authentication & Authorization (Pundit)
Time Tracking (Timer + CRUD)
Project Management (Full CRUD + Issues)
Client Management (Full CRUD + Search)
Performance Issues (Intentional N+1, missing indexes)
AppSignal Integration
```

### Missing ❌
```
User Administration UI
Document Management
Comprehensive Reporting
Calendar View
E2E Testing Infrastructure
Advanced Dashboard Analytics
```