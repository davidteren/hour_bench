# Augment-Optimized Task: Organization & Project Types Implementation

## Project Context
**Technology Stack**: Rails 8.3 + Hotwire, Custom CSS, SQLite, Pundit authorization  
**Current State**: Organizations and projects lack industry categorization and type classification  
**Business Need**: Industry-specific organization types and project categorization for better analytics and filtering  
**Data Enhancement**: Leverage Faker's construction and industry data for realistic categorization  

## Task Overview
Implement comprehensive organization types (design agency, construction, catering, etc.) and project types (graphic design, construction, catering) with industry-specific categorization, enhanced filtering, and improved data seeding using Faker's industry-specific generators.

## Augment Agent Optimization Framework

### Phase 1: Current Data Model & Industry Analysis
**Use codebase-retrieval to understand existing patterns:**
- "organization model, project model, enum definitions, categorization"
- "Faker data generation, seeding patterns, industry categories"
- "filtering, search functionality, dropdown selections, form inputs"
- "dashboard analytics, reporting by category, organization grouping"

**Analyze current structure:**
- Organization model fields and associations
- Project model structure and categorization
- Existing enum patterns and validation
- Current seeding and Faker usage patterns

**Use view tool to examine:**
- Organization and project forms and views
- Current filtering and search implementations
- Dashboard and reporting views
- Existing Faker configuration in seeds.rb

### Phase 2: Industry Type System Design
**Design comprehensive categorization system:**

**Organization Types (Primary & Secondary):**
- **Technology**: Software Development, Web Design, IT Consulting
- **Construction**: General Contracting, Electrical, Plumbing, HVAC
- **Creative**: Graphic Design, Marketing Agency, Photography, Video Production
- **Professional Services**: Legal, Accounting, Consulting, Real Estate
- **Hospitality**: Catering, Event Planning, Restaurant, Hotel Management
- **Healthcare**: Medical Practice, Dental, Veterinary, Wellness
- **Education**: Training, Tutoring, Corporate Education
- **Manufacturing**: Product Design, Industrial, Quality Control

**Project Types by Industry:**
- **Technology**: Web Development, Mobile App, API Integration, System Migration
- **Construction**: Residential Build, Commercial Renovation, Infrastructure, Inspection
- **Creative**: Brand Identity, Website Design, Print Materials, Video Campaign
- **Professional**: Legal Case, Tax Preparation, Business Consulting, Property Management

### Phase 3: Enhanced Data Model Implementation
**Add industry categorization to models:**

**Organization model enhancements:**
```ruby
class Organization < ApplicationRecord
  enum primary_type: {
    technology: 0, construction: 1, creative: 2, 
    professional_services: 3, hospitality: 4, healthcare: 5,
    education: 6, manufacturing: 7, other: 8
  }
  
  # Allow multiple secondary types
  has_many :organization_secondary_types, dependent: :destroy
  has_many :secondary_types, through: :organization_secondary_types
  
  validates :primary_type, presence: true
  
  scope :by_industry, ->(type) { where(primary_type: type) }
  scope :with_secondary_type, ->(type) { joins(:secondary_types).where(secondary_types: { name: type }) }
end
```

**Project model enhancements:**
```ruby
class Project < ApplicationRecord
  enum project_type: {
    # Technology
    web_development: 0, mobile_app: 1, api_integration: 2,
    # Construction  
    residential_build: 10, commercial_renovation: 11, infrastructure: 12,
    # Creative
    brand_identity: 20, website_design: 21, print_materials: 22,
    # Professional Services
    legal_case: 30, tax_preparation: 31, business_consulting: 32,
    # General
    other: 99
  }
  
  validates :project_type, presence: true
  
  scope :by_industry_type, ->(industry) { 
    joins(:organization).where(organizations: { primary_type: industry }) 
  }
  scope :by_project_type, ->(type) { where(project_type: type) }
end
```

### Phase 4: Enhanced Forms & User Interface
**Update organization and project forms:**

**Organization form with type selection:**
```erb
<div class="form-group">
  <%= form.label :primary_type, "Primary Industry" %>
  <%= form.select :primary_type, 
      options_for_select(Organization.primary_types.map { |key, value| 
        [key.humanize, key] 
      }), 
      { prompt: 'Select Primary Industry' },
      { class: 'form-select', data: { action: 'change->organization#updateSecondaryOptions' } } %>
</div>

<div class="form-group">
  <%= form.label :secondary_type_ids, "Secondary Industries (Optional)" %>
  <%= form.collection_check_boxes :secondary_type_ids, SecondaryType.all, :id, :name do |b| %>
    <div class="form-check">
      <%= b.check_box(class: "form-check-input") %>
      <%= b.label(class: "form-check-label") %>
    </div>
  <% end %>
</div>
```

**Project form with industry-specific types:**
```erb
<div class="form-group">
  <%= form.label :project_type, "Project Type" %>
  <%= form.select :project_type,
      grouped_options_for_select(project_types_by_industry),
      { prompt: 'Select Project Type' },
      { class: 'form-select' } %>
</div>
```

### Phase 5: Enhanced Filtering & Search
**Implement industry-based filtering:**

**Organization filtering:**
```ruby
class OrganizationsController < ApplicationController
  def index
    @organizations = policy_scope(Organization)
    @organizations = @organizations.by_industry(params[:industry]) if params[:industry].present?
    @organizations = @organizations.with_secondary_type(params[:secondary_type]) if params[:secondary_type].present?
    @organizations = @organizations.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
  end
end
```

**Project filtering with industry context:**
```ruby
class ProjectsController < ApplicationController
  def index
    @projects = policy_scope(Project).includes(:organization, :client)
    @projects = @projects.by_industry_type(params[:industry]) if params[:industry].present?
    @projects = @projects.by_project_type(params[:project_type]) if params[:project_type].present?
    @projects = @projects.joins(:organization).where("projects.name ILIKE ? OR organizations.name ILIKE ?", 
                                                     "%#{params[:search]}%", "%#{params[:search]}%") if params[:search].present?
  end
end
```

### Phase 6: Enhanced Data Seeding with Industry-Specific Faker
**Leverage Faker's industry-specific generators:**

**Industry-aware organization seeding:**
```ruby
class IndustryOrganizationSeeder
  INDUSTRY_CONFIGS = {
    construction: {
      name_generator: -> { "#{Faker::Construction.subcontract_category} #{Faker::Company.suffix}" },
      description_generator: -> { "Specialized #{Faker::Construction.subcontract_category.downcase} services" },
      project_types: [:residential_build, :commercial_renovation, :infrastructure]
    },
    technology: {
      name_generator: -> { "#{Faker::Company.name} #{['Technologies', 'Solutions', 'Systems'].sample}" },
      description_generator: -> { Faker::Company.catch_phrase },
      project_types: [:web_development, :mobile_app, :api_integration]
    },
    creative: {
      name_generator: -> { "#{Faker::Company.name} #{['Creative', 'Design', 'Studio'].sample}" },
      description_generator: -> { "Creative #{Faker::Marketing.buzzwords} solutions" },
      project_types: [:brand_identity, :website_design, :print_materials]
    }
  }
  
  def create_industry_organization(industry_type)
    config = INDUSTRY_CONFIGS[industry_type.to_sym]
    
    org = Organization.create!(
      name: config[:name_generator].call,
      description: config[:description_generator].call,
      primary_type: industry_type
    )
    
    create_industry_projects(org, config[:project_types])
    org
  end
end
```

**Realistic project seeding:**
```ruby
class IndustryProjectSeeder
  def create_realistic_project(organization, project_type)
    project_name = generate_project_name(organization.primary_type, project_type)
    
    Project.create!(
      name: project_name,
      description: generate_project_description(organization.primary_type, project_type),
      project_type: project_type,
      organization: organization,
      client: organization.clients.sample || create_industry_client(organization),
      hourly_rate: calculate_industry_rate(organization.primary_type),
      budget: calculate_project_budget(project_type)
    )
  end
  
  private
  
  def generate_project_name(industry, project_type)
    case industry.to_sym
    when :construction
      "#{Faker::Address.street_name} #{project_type.humanize}"
    when :technology
      "#{Faker::App.name} #{project_type.humanize}"
    when :creative
      "#{Faker::Company.name} #{project_type.humanize}"
    else
      "#{Faker::Commerce.product_name} #{project_type.humanize}"
    end
  end
end
```

## Analytics & Reporting Enhancements

### Industry-Specific Dashboard Metrics
**Enhanced dashboard with industry breakdown:**
- Projects by industry type and status
- Revenue analysis by organization type
- Industry-specific performance metrics
- Comparative analytics across industries

### Advanced Filtering Interface
**Multi-level filtering system:**
- Primary industry filter with secondary type refinement
- Project type filtering within industry context
- Combined search across organization and project types
- Saved filter preferences for users

## Validation & Testing Strategy

### Development Workflow Requirements
- **Branch Management**: Create feature branch `feature/organization-project-types` before starting
- **Commit Strategy**: Make frequent commits with descriptive messages like "Add organization industry types" or "Implement project type filtering"
- **Application Startup**: Always use `bin/dev` to start the Rails application for testing
- **Branch Integration**: Merge completed feature branch into `develop` branch before starting next task

### Testing Strategy Requirements
**Comprehensive Industry Type Testing:**
- **Unit Tests**: Write Minitest tests for industry type models and validation logic
- **Integration Tests**: Test filtering controllers and industry-specific queries
- **Playwright UI Testing**: Validate industry type forms and filtering interface
  ```javascript
  // Example Playwright test for industry types
  test('organization industry types work correctly', async ({ page }) => {
    await page.goto('/organizations/new');
    await page.screenshot({ path: 'organization-form.png' });

    // Test industry type selection
    await page.selectOption('select[name="organization[primary_type]"]', 'construction');
    await page.check('input[name="organization[secondary_type_ids][]"][value="1"]');
    await page.fill('input[name="organization[name]"]', 'ABC Construction');
    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'organization-created.png' });

    // Test filtering by industry
    await page.goto('/organizations');
    await page.selectOption('select[name="industry"]', 'construction');
    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'industry-filtered-results.png' });
  });
  ```

**UI Development with Playwright:**
- Test industry type selection forms and dropdowns
- Validate multi-level filtering interface
- Test project type categorization and filtering
- Verify industry-specific data seeding results
- Test responsive design for industry type interfaces

### Use browser automation for comprehensive testing:
- **Form Functionality**: Test industry type selection and validation
- **Filtering System**: Verify multi-level filtering works correctly
- **Data Seeding**: Test realistic data generation with industry types
- **Dashboard Analytics**: Validate industry-specific metrics display
- **Search Integration**: Test combined search across types and industries

### Use launch-process for testing:
- **Database Migrations**: Always use `bin/dev` to test enum additions and new associations
- **Seeding Performance**: Verify industry-specific seeding efficiency
- **Query Performance**: Test filtering and search query optimization

## Expected Deliverables

### 1. Enhanced Data Models
- Organization model with primary and secondary industry types
- Project model with industry-specific project types
- Supporting models for secondary type associations
- Database migrations with proper indexing

### 2. Improved User Interface
- Enhanced organization and project forms with type selection
- Multi-level filtering interface for listings
- Industry-specific project type dropdowns
- Visual industry indicators and badges

### 3. Advanced Data Seeding
- Industry-aware organization generation using Faker
- Realistic project creation with industry-appropriate names
- Industry-specific client and rate generation
- Balanced data distribution across industries

### 4. Analytics & Reporting
- Industry breakdown in dashboard metrics
- Enhanced filtering and search capabilities
- Industry-specific performance reports
- Comparative analytics across organization types

## Augment-Specific Implementation Strategy

### Tool Usage Optimization
- **codebase-retrieval**: Essential for understanding current model patterns and enum usage
- **view tool**: Critical for examining existing forms, filters, and seeding patterns
- **str-replace-editor**: Primary tool for updating models, controllers, and views
- **browser automation**: For testing form functionality and filtering systems
- **launch-process**: For testing migrations and seeding performance

### Code Presentation Standards
- Use `<augment_code_snippet path="..." mode="EXCERPT">` for all Ruby code examples
- Show before/after comparisons for model and form enhancements
- Provide file paths for all modified models and views
- Keep code examples focused on specific industry type features

### Safety & Permission Requirements
- **Request permission**: Before running database migrations for new enums
- **Conservative approach**: Implement with backward compatibility for existing data
- **Data validation**: Ensure existing organizations and projects get default types
- **Performance testing**: Validate new filtering doesn't impact query performance
- **Branch workflow**: Never work directly on main or develop branches

This Augment-optimized approach ensures systematic implementation of industry-specific organization and project types while maintaining data integrity, improving user experience, and providing realistic industry-appropriate data generation for testing and demonstration purposes.
