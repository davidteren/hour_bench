# Augment-Optimized Task Prompts

This directory contains enhanced task prompts specifically optimized for Augment Agent's capabilities and tooling. Each prompt leverages Augment's world-leading context engine, comprehensive tool suite, and behavioral patterns for optimal results.

## Generated Prompts

### Core Application Improvements

#### 1. **task_prompt_01_fix_project_readme.md**
**Transform Project Documentation**
- Convert development-focused README to user-friendly documentation
- Implement standard README structure and conventions
- Leverage codebase-retrieval for understanding current project structure
- Use browser automation for testing setup instructions

#### 2. **task_prompt_02_styling_refactoring.md**
**CSS Organization & Cleanup**
- Refactor inline styling into proper CSS classes
- Remove unused Tailwind classes across views
- Organize large application.css into modular files
- Maintain Apple-inspired design system integrity

#### 3. **task_prompt_03_friendly_url_slugs.md**
**Implement SEO-Friendly URLs**
- Replace integer IDs with human-readable slugs
- Enhance security by obfuscating enumerable IDs
- Implement without external gems using Rails built-in functionality
- Maintain backward compatibility and authorization

### User Management & Authentication

#### 4. **task_prompt_04_freelancer_self_registration.md**
**Freelancer Self-Registration System**
- Enable freelancer self-registration with automatic organization creation
- Implement project and client management capabilities for freelancers
- Maintain existing authorization structure with Pundit
- Create freelancer-specific onboarding and dashboard

#### 5. **task_prompt_06_role_management_interface.md**
**Comprehensive Role Management**
- Build admin interface for managing user roles and permissions
- Implement hierarchical role assignment (System/Org/Team Admins)
- Create audit trail for role changes and security
- Design intuitive role management dashboard

### Analytics & Reporting

#### 6. **task_prompt_05_reports_implementation.md**
**Complete Reporting System**
- Implement time tracking, project, and billing reports
- Create role-based report access and data scoping
- Add export functionality (CSV, PDF) with Chart.js visualizations
- Optimize performance with proper indexing and caching

#### 7. **task_prompt_07_background_jobs_dashboard_streaming.md**
**Real-Time Dashboard & Background Processing**
- Implement Solid Queue for background job processing
- Create real-time dashboard updates with Turbo Streams
- Add continuous data seeding for performance testing
- Improve user experience with streaming data updates

### Business Logic & Data Enhancement

#### 8. **task_prompt_08_organization_project_types.md**
**Industry-Specific Categorization**
- Implement organization types (design agency, construction, etc.)
- Add project types with industry-specific categorization
- Enhance data seeding with Faker's industry-specific generators
- Create advanced filtering and analytics by industry type

#### 9. **task_prompt_09_landing_page_development.md**
**Modern Landing Page with Dark/Light Mode**
- Create premium landing page showcasing application features
- Implement comprehensive dark/light mode theme system
- Design responsive layout with Apple-inspired aesthetics
- Add SEO optimization and performance enhancements

### Performance & Integration

#### 10. **task_prompt_10_api_metrics_external_services.md**
**API Integration & Performance Monitoring**
- Create external API consumption with intentional performance challenges
- Implement comprehensive caching strategies and monitoring
- Build mock external services with variable performance characteristics
- Add AppSignal integration for API metrics and optimization learning

## Augment Agent Optimization Features

### Context Engine Utilization
Each prompt includes specific instructions for:
- **codebase-retrieval queries**: Targeted searches for understanding existing patterns
- **Semantic code analysis**: Cross-language understanding and pattern recognition
- **Real-time indexing**: Leveraging current codebase state for accurate context

### Tool-Specific Instructions
Prompts specify optimal tool usage:
- **str-replace-editor**: Precise code modifications with mandatory context gathering
- **browser automation**: UI testing and validation workflows
- **launch-process**: Development server management and testing
- **view tool**: Targeted file examination with regex patterns

### Safety & Permission Framework
All prompts include:
- **Conservative editing approach**: Preserve existing functionality while improving
- **Permission requirements**: Explicit requests for potentially destructive actions
- **Validation protocols**: Comprehensive testing before deployment
- **Incremental implementation**: Step-by-step rollout with testing

### Code Presentation Standards
Consistent formatting requirements:
- **XML code snippets**: `<augment_code_snippet path="..." mode="EXCERPT">`
- **Clickable navigation**: File paths and context for easy code exploration
- **Focused examples**: Under 10 lines for optimal display
- **Before/after comparisons**: Clear transformation documentation

## Project Context Integration

### Technology Stack Awareness
- **Rails 8.3**: Built-in authentication, Solid Queue, Solid Cable
- **Hotwire**: Turbo Streams for real-time updates
- **Custom CSS**: Apple-inspired design system (no Tailwind)
- **Pundit**: Role-based authorization framework

### Performance Considerations
- **Intentional Issues**: Leverage existing N+1 queries and performance problems
- **AppSignal Integration**: Monitor performance improvements
- **Database Optimization**: Add indexes and optimize queries
- **Caching Strategy**: Implement appropriate caching layers

### Development Workflow
- **TDD Approach**: Minitest for unit tests, Playwright for E2E
- **Feature Branches**: Specific problem-focused branches
- **Frequent Commits**: Incremental development with regular commits
- **Never Merge to Main**: Maintain experimental nature

## Usage Instructions

### For Augment Agent
1. **Load Project Context**: Review PROJECT_SUMMARY.md for current state
2. **Select Appropriate Prompt**: Choose based on task requirements
3. **Follow Optimization Framework**: Use specified tool sequences
4. **Implement Safety Protocols**: Request permissions as outlined
5. **Validate Results**: Use testing strategies provided

### For Developers
1. **Understand Context**: Each prompt includes comprehensive project context
2. **Follow Implementation Phases**: Structured approach from analysis to validation
3. **Leverage Tool Capabilities**: Maximize Augment Agent's unique strengths
4. **Maintain Code Quality**: Follow established patterns and conventions

## Prompt Enhancement Methodology

### Based on Augment-Optimized Framework
- **Context Gathering Phase**: Comprehensive codebase understanding
- **Planning Phase**: Detailed implementation roadmap
- **Implementation Phase**: Tool-optimized development workflow
- **Validation Phase**: Comprehensive testing and verification

### Continuous Improvement
- **Feedback Integration**: Incorporate results from prompt usage
- **Tool Evolution**: Update prompts as Augment capabilities expand
- **Pattern Recognition**: Refine based on successful implementation patterns
- **Performance Optimization**: Enhance based on real-world usage data

## Future Enhancements

Additional prompts can be generated for:
- **Organization Types & Project Categories**: Industry-specific customization
- **Landing Page Development**: Public-facing marketing site
- **API Development**: REST API for external integrations
- **Advanced Analytics**: Real-time reporting with complex visualizations
- **Calendar Integration**: Monthly view with drag-and-drop functionality

Each new prompt will follow the same Augment-optimized framework, ensuring consistent quality and optimal tool utilization for superior development results.
