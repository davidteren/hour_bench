# Augment-Optimized Task: Implement Friendly URL Slugs

## Project Context
**Technology Stack**: Rails 8.3 + Hotwire, Pundit authorization, SQLite  
**Current Issue**: URLs expose integer IDs for organizations, clients, projects, and users  
**Security Concern**: User and client IDs are easily enumerable and not user-friendly  
**Constraint**: Implement without external gems, using Rails built-in functionality  

## Task Overview
Implement friendly URL slugs for organizations, clients, projects, and users to replace integer IDs with human-readable, SEO-friendly URLs while maintaining security and performance.

## Augment Agent Optimization Framework

### Phase 1: Current URL Structure Analysis
**Use codebase-retrieval to understand existing routing patterns:**
- "routes, URL patterns, params, resource routing, nested routes"
- "organization, client, project, user controllers and views"
- "authorization, Pundit policies, access control patterns"
- "ActiveRecord models, associations, URL generation"

**Analyze current URL patterns:**
- `/organizations/123` → `/organizations/tech-solutions-inc`
- `/clients/456` → `/clients/acme-corporation`
- `/projects/789` → `/projects/website-redesign-2024`
- `/users/101` → `/users/john-doe` (admin contexts only)

**Use view tool to examine:**
- Current routing configuration (config/routes.rb)
- Controller parameter handling patterns
- Model finder methods and associations
- View link generation patterns

### Phase 2: Slug Implementation Strategy
**Design slug generation approach:**
- **Organizations**: Company name → "tech-solutions-inc"
- **Clients**: Company name or full name → "acme-corporation"
- **Projects**: Project name + year → "website-redesign-2024"
- **Users**: Full name → "john-doe" (admin-only contexts)

**Technical implementation plan:**
1. Add slug columns to relevant models
2. Implement slug generation methods
3. Add slug uniqueness validation
4. Update model finders to use slugs
5. Modify routes to use slugs as parameters
6. Update controllers to find by slug
7. Maintain backward compatibility during transition

### Phase 3: Model Enhancement Implementation
**Use str-replace-editor to add slug functionality:**

**Add slug columns via migrations:**
```ruby
# Migration example structure
add_column :organizations, :slug, :string, null: false
add_index :organizations, :slug, unique: true
```

**Implement slug generation in models:**
```ruby
# Model enhancement pattern
before_validation :generate_slug, if: :should_generate_slug?
validates :slug, presence: true, uniqueness: true

private

def generate_slug
  base_slug = name.parameterize
  self.slug = ensure_unique_slug(base_slug)
end
```

### Phase 4: Routing & Controller Updates
**Update routes configuration:**
- Modify resource routes to use slug parameters
- Maintain RESTful conventions with friendly URLs
- Ensure nested routes work with slug parameters

**Update controller finders:**
- Replace `find(params[:id])` with `find_by!(slug: params[:id])`
- Maintain authorization patterns with Pundit policies
- Handle slug-based parameter passing in nested resources

### Phase 5: View & Link Updates
**Update link generation throughout views:**
- Replace `organization_path(org)` patterns to use slugs
- Update form submissions and AJAX requests
- Ensure Turbo/Hotwire compatibility with new URLs

**Maintain user experience:**
- Implement automatic redirects from old integer URLs
- Ensure search and filtering work with new URL structure
- Update breadcrumbs and navigation to use friendly URLs

## Technical Implementation Details

### Slug Generation Strategy
**Without external gems, using Rails built-in methods:**
```ruby
def generate_slug
  base = name.parameterize.truncate(50, omission: '')
  candidate = base
  counter = 1
  
  while self.class.exists?(slug: candidate)
    candidate = "#{base}-#{counter}"
    counter += 1
  end
  
  self.slug = candidate
end
```

### Model Implementation Pattern
**For each model requiring slugs:**
- Add slug column with unique index
- Implement slug generation with collision handling
- Add slug regeneration on name changes
- Maintain slug history for SEO (optional)

### Route Configuration Updates
```ruby
# Before: resources :organizations
# After: resources :organizations, param: :slug
```

### Controller Finder Updates
```ruby
# Before: @organization = Organization.find(params[:id])
# After: @organization = Organization.find_by!(slug: params[:id])
```

## Security & Performance Considerations

### Security Enhancements
- **ID obfuscation**: Remove enumerable integer IDs from URLs
- **Authorization preservation**: Ensure Pundit policies work with slug-based lookups
- **Access control**: Maintain existing permission structures

### Performance Optimization
- **Database indexing**: Add unique indexes on slug columns
- **Caching strategy**: Leverage Rails caching for slug lookups
- **Query optimization**: Ensure slug-based queries are efficient

### Backward Compatibility
- **Graceful migration**: Support both ID and slug lookups during transition
- **Redirect strategy**: Implement 301 redirects from old URLs
- **API compatibility**: Maintain API endpoints during migration

## Validation & Testing Strategy

### Development Workflow Requirements
- **Branch Management**: Create feature branch `feature/friendly-url-slugs` before starting
- **Commit Strategy**: Make frequent commits with descriptive messages like "Add slug column to organizations" or "Update controllers to use slug params"
- **Application Startup**: Always use `bin/dev` to start the Rails application for testing
- **Branch Integration**: Merge completed feature branch into `develop` branch before starting next task

### Testing Strategy Requirements
**Comprehensive URL Testing:**
- **Unit Tests**: Write Minitest tests for slug generation and validation methods
- **Integration Tests**: Test controller slug-based lookups and routing
- **Playwright UI Testing**: Validate URL navigation and user experience
  ```javascript
  // Example Playwright test for slug functionality
  test('friendly URLs work correctly', async ({ page }) => {
    await page.goto('/organizations/tech-solutions-inc');
    await page.screenshot({ path: 'organization-slug-page.png' });

    // Test navigation and links
    await page.click('a[href*="/projects/website-redesign-2024"]');
    await page.screenshot({ path: 'project-slug-navigation.png' });

    // Test form submissions with slugs
    await page.fill('input[name="search"]', 'acme');
    await page.press('input[name="search"]', 'Enter');
    await page.screenshot({ path: 'slug-search-results.png' });
  });
  ```

**UI Development with Playwright:**
- Test URL navigation and breadcrumb functionality
- Validate form submissions work with slug-based routing
- Test search and filtering with new URL structure
- Ensure authorization works correctly with slugs
- Test responsive design with friendly URLs

### Use browser automation for comprehensive testing:
- **URL navigation**: Test all major page navigation with new URLs
- **Form submissions**: Verify forms work with slug-based routing
- **Search functionality**: Ensure search and filtering maintain functionality
- **Authorization**: Test role-based access with new URL structure

### Use launch-process for testing:
- **Route testing**: Always use `bin/dev` to verify all routes resolve correctly
- **Database migration**: Test slug generation for existing data
- **Performance testing**: Measure impact on page load times

## Expected Deliverables

### 1. Enhanced Models with Slug Support
- Slug columns added to Organizations, Clients, Projects, Users
- Automatic slug generation with collision handling
- Validation and uniqueness constraints
- Slug regeneration on name changes

### 2. Updated Routing & Controllers
- Routes configured to use slug parameters
- Controllers updated to find by slug
- Maintained authorization and access control
- Backward compatibility for existing URLs

### 3. Refreshed Views & Navigation
- All links updated to use friendly URLs
- Form submissions working with slug-based routing
- Breadcrumbs and navigation using readable URLs
- Search and filtering compatibility

### 4. Migration & Data Strategy
- Database migrations for slug columns
- Data migration script for existing records
- Slug generation for all existing data
- Performance optimization with proper indexing

## Augment-Specific Implementation Strategy

### Tool Usage Optimization
- **codebase-retrieval**: Critical for understanding current routing, controller, and model patterns
- **view tool**: Essential for examining routes, controllers, and view files
- **str-replace-editor**: Primary tool for updating models, controllers, and views
- **launch-process**: For running migrations and testing route changes
- **browser automation**: For comprehensive URL and navigation testing

### Code Presentation Standards
- Use `<augment_code_snippet path="..." mode="EXCERPT">` for all Ruby code examples
- Show before/after comparisons for route and controller changes
- Provide file paths for all modified files
- Keep code examples focused on specific changes

### Safety & Permission Requirements
- **Request permission**: Before running database migrations
- **Conservative approach**: Implement with backward compatibility
- **Incremental testing**: Test each model's slug implementation separately
- **Validation required**: Comprehensive testing before deploying changes
- **Branch workflow**: Never work directly on main or develop branches

This Augment-optimized approach ensures systematic implementation of friendly URL slugs while maintaining the application's security, performance, and user experience, leveraging Augment Agent's context engine to understand existing patterns and implement changes safely.
