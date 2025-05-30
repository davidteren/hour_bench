# HourBench - Development Guide

This document contains detailed technical information for developers working on HourBench.

## Application Architecture

### Domain Model

The application is built around the following core models and associations:

- **Organization**: Top-level unit (e.g., design studio, law firm)
  - has many Teams, Users, and is associated with Projects through Clients
- **Team**: Nested under an Organization
  - has many Users
- **User**: Belongs to a Team
  - can track TimeEntries
- **Client**: Represents a client account
  - has many Projects, associated with one or more Organizations
- **Project**: Belongs to a Client, associated with one or more Organizations
  - has many Issues and TimeEntries
- **Issue**: A specific task or case within a Project
  - has many Documents, TimeEntries
- **TimeEntry**: Tracks hours for a User on an Issue
- **Document**: Belongs to an Issue
- **Address**: Polymorphic association for Clients or Organizations

### Authorization System

The application uses Pundit for role-based access control with the following roles:

- **System Admin**: Full system access, can impersonate any user
- **Organization Admin**: Manage their organization and all teams within it
- **Team Admin**: Manage their specific team
- **Regular User**: Standard user access within their team
- **Freelancer**: Independent user without organization affiliation

## Performance Anti-Patterns (Intentional)

This application intentionally includes performance issues for educational purposes:

### N+1 Queries
- Missing eager loading in various controllers
- Inefficient associations in views
- Unoptimized database queries

### Missing Indexes
- Database queries without proper indexing
- Slow lookups on frequently queried fields
- Unindexed foreign keys

### Error-Prone Areas
- Unguarded nil references
- Invalid logic in edge cases
- Areas that break under load

### Memory Issues
- Missing eager loading causing excessive queries
- Inefficient data structures
- Memory leaks in long-running processes

These issues are monitored via AppSignal and help demonstrate performance monitoring tools.

## UI/UX Design System

### Design Philosophy
The application uses a clean, ultra-minimal interface with a premium feel inspired by Apple's design language.

### Design Specifications

**Color Palette:**
- Background: `#F9FAFB`
- Text: `#1A1A1A`
- Accents: Deep indigo (`#4F46E5`) or forest green
- Dark mode support

**Typography:**
- Primary: Inter or SF Pro Display
- Headlines: 24–32px
- Clean labels and fine metadata
- Consistent hierarchy

**Spacing & Layout:**
- Padding: 24–40px
- Border radius: 2xl rounded corners
- Hover shadows for interactive elements
- Full-screen UI with top navigation and left sidebar

**Components:**
- Card-based layouts
- Clear visual hierarchy
- Collapsible/scrollable panes
- Status indicators and pills

### Screen Implementations

1. **Dashboard Overview**
   - Grid-based card layout with high-level metrics
   - Displays clients, hours, and issues summary

2. **Time Tracking List View**
   - Sortable table or card view
   - Status pills and filters
   - Real-time timer functionality

3. **Issue Detail**
   - Two-column layout: summary (left) + tabbed content (right)
   - Document attachments and time tracking

4. **Client Directory**
   - Grid or list view with search functionality
   - Avatar support and filter bar

5. **Client Profile**
   - Activity feed
   - Metadata blocks
   - Related projects overview

6. **Document Management**
   - File preview cards
   - Upload zones with drag-and-drop
   - Version tags and history

7. **Calendar View**
   - Monthly view with swipeable weeks
   - Color-coded time entries
   - Quick entry creation

8. **Time Tracking / Billing**
   - Timer toggle functionality
   - Project/Issue dropdowns
   - Clean invoice card design

9. **Client Portal (Read-Only)**
   - Locked fields for client viewing
   - Visual timelines
   - Downloadable documents

10. **Settings Page**
    - Grouped toggles
    - Permission settings
    - Minimal form UI

## Development Workflow

### Branch Strategy
- Feature branches for all development
- Descriptive branch naming (e.g., `feature/fix-n-plus-one-queries`)
- Never merge directly to main
- Frequent commits with descriptive messages

### Testing Strategy
- **Unit Tests**: Minitest for business logic
- **Integration Tests**: Controller and model integration
- **E2E Tests**: Playwright for UI validation
- **Performance Tests**: Monitor with AppSignal

### Code Standards
- Follow Rails conventions
- Use Rubocop for code style
- Maintain test coverage
- Document performance implications
- Preserve educational anti-patterns

## Technical Constraints

### Framework Limitations
- **No External JS Build Tools**: Use Importmaps and CDNs only
- **No External CSS Frameworks**: Custom CSS implementation
- **SQLite Only**: For development and testing
- **Rails 8 Features**: Leverage built-in authentication and Solid gems

### Monitoring Requirements
- **AppSignal Integration**: Performance and error monitoring
- **No Logging**: Focus on performance and alerts only
- **Seed Data**: Support large volumes for testing

### Deployment Considerations
- **Primarily Local**: Development-focused deployment
- **Docker Support**: Available via Kamal
- **Future Deployment**: May deploy to production later

## Educational Objectives

This application serves multiple educational purposes:

1. **Performance Optimization Learning**
   - Identify and fix N+1 queries
   - Optimize database queries
   - Implement proper indexing

2. **Monitoring and Alerting**
   - Learn AppSignal integration
   - Set up performance alerts
   - Monitor application health

3. **Rails Best Practices**
   - Modern Rails 8 features
   - Hotwire implementation
   - Authorization patterns

4. **Assessment and Evaluation**
   - Code review exercises
   - Performance improvement tasks
   - Bug fixing challenges

## Next Steps for Development

1. **Model Scaffolding**
   - Complete ActiveRecord models and migrations
   - Add representative attributes
   - Implement associations

2. **UI Implementation**
   - Build Hotwire-driven interfaces
   - Implement CRUD screens
   - Add time tracking interactions

3. **Data Population**
   - Create comprehensive seed data
   - Use Faker for realistic content
   - Support large data volumes

4. **Monitoring Setup**
   - Configure AppSignal hooks
   - Set up performance alerts
   - Document monitoring strategy

5. **Performance Issues**
   - Identify and annotate hotspots
   - Create educational examples
   - Document optimization opportunities

This development guide should be updated as the application evolves and new educational requirements are identified.
