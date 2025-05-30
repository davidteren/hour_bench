# Augment-Optimized Task: Freelancer Self-Registration & Project Management

## Project Context
**Technology Stack**: Rails 8.3 + built-in authentication, Pundit authorization, Hotwire  
**Current Limitation**: Freelancers must be added by existing users and cannot self-register or create projects  
**Business Logic**: Freelancers need automatic organization/team creation and project management capabilities  
**User Roles**: System Admin, Org Admin, Team Admin, Regular User, Freelancer  

## Task Overview
Enable freelancer self-registration with automatic organization and team creation, plus the ability to create and manage their own projects and clients, while maintaining the existing authorization structure.

## Augment Agent Optimization Framework

### Phase 1: Current Authentication & Authorization Analysis
**Use codebase-retrieval to understand existing patterns:**
- "authentication, registration, user creation, Rails 8 built-in auth"
- "freelancer role, user roles, Pundit policies, authorization patterns"
- "organization, team creation, user associations, role management"
- "project creation, client management, freelancer permissions"

**Analyze current user flow:**
- Registration process and user creation
- Role assignment and permission structure
- Organization and team creation patterns
- Project and client management authorization

**Use view tool to examine:**
- Current registration forms and controllers
- User model and role definitions
- Pundit policies for freelancers
- Organization and team creation logic

### Phase 2: Freelancer Registration Flow Design
**Design enhanced registration process:**
1. **Public Registration**: Allow freelancers to self-register
2. **Role Selection**: Add freelancer option to registration
3. **Business Information**: Collect business name and details
4. **Auto-Organization**: Create personal organization automatically
5. **Auto-Team**: Create default team under personal organization
6. **Project Capabilities**: Enable project and client creation

**Registration form enhancements:**
- Business name field (optional, defaults to user name)
- Freelancer-specific onboarding flow
- Terms and conditions for freelancer accounts
- Professional profile setup

### Phase 3: Automatic Organization & Team Creation
**Implement automatic setup for freelancers:**

**Organization creation logic:**
```ruby
# Auto-create organization for freelancer
def create_freelancer_organization
  organization = Organization.create!(
    name: business_name.presence || "#{name}'s Business",
    description: "Personal freelancer organization",
    organization_type: 'freelancer'
  )
end
```

**Team creation and assignment:**
```ruby
# Auto-create team and assign freelancer as admin
def setup_freelancer_team(organization)
  team = organization.teams.create!(
    name: "#{name}'s Team",
    description: "Default team for freelancer operations"
  )
  
  # Assign freelancer as team admin
  team.users << self
end
```

### Phase 4: Enhanced Freelancer Permissions
**Update Pundit policies for freelancer capabilities:**
- **Project Management**: Allow freelancers to create/manage projects in their organization
- **Client Management**: Enable client creation and management
- **Time Tracking**: Full access to time logging for their projects
- **Team Management**: Limited team admin rights within their organization

**Policy updates needed:**
```ruby
# ProjectPolicy enhancement
def create?
  user.system_admin? || 
  user.organization_admin? || 
  (user.freelancer? && record.organization == user.organization)
end
```

### Phase 5: Registration Controller & View Updates
**Enhance registration process:**
- Add role selection to registration form
- Implement freelancer-specific registration flow
- Create onboarding process for new freelancers
- Add business information collection

**Update authentication flow:**
- Modify registration controller to handle freelancer setup
- Implement automatic organization/team creation
- Add freelancer-specific welcome and onboarding
- Ensure proper role assignment and permissions

## Technical Implementation Details

### Registration Form Enhancements
**Add freelancer-specific fields:**
```erb
<%= form.select :role, options_for_select([
  ['Regular User', 'user'],
  ['Freelancer', 'freelancer']
]), { prompt: 'Select your role' } %>

<div id="freelancer-fields" style="display: none;">
  <%= form.text_field :business_name, placeholder: "Business Name (optional)" %>
  <%= form.text_area :business_description, placeholder: "Brief business description" %>
</div>
```

### User Model Enhancements
**Add freelancer-specific methods:**
```ruby
class User < ApplicationRecord
  enum role: { user: 0, freelancer: 1, team_admin: 2, organization_admin: 3, system_admin: 4 }
  
  after_create :setup_freelancer_organization, if: :freelancer?
  
  private
  
  def setup_freelancer_organization
    # Create organization and team automatically
  end
end
```

### Organization Model Updates
**Add organization types:**
```ruby
class Organization < ApplicationRecord
  enum organization_type: { 
    standard: 0, 
    freelancer: 1, 
    agency: 2, 
    enterprise: 3 
  }
end
```

### Enhanced Authorization Policies
**Update policies for freelancer capabilities:**
- ProjectPolicy: Allow project creation in own organization
- ClientPolicy: Enable client management for freelancers
- OrganizationPolicy: Limited admin rights for own organization
- TeamPolicy: Team management within own organization

## User Experience Enhancements

### Freelancer Onboarding Flow
1. **Registration**: Enhanced form with role selection
2. **Business Setup**: Optional business information
3. **Welcome**: Freelancer-specific welcome message
4. **Quick Start**: Guide to creating first project/client
5. **Dashboard**: Freelancer-optimized dashboard view

### Dashboard Customization
**Freelancer-specific dashboard features:**
- Personal project overview
- Client management shortcuts
- Time tracking summary
- Business performance metrics
- Quick actions for common tasks

## Validation & Testing Strategy

### Development Workflow Requirements
- **Branch Management**: Create feature branch `feature/freelancer-self-registration` before starting
- **Commit Strategy**: Make frequent commits with descriptive messages like "Add freelancer registration form" or "Implement automatic organization creation"
- **Application Startup**: Always use `bin/dev` to start the Rails application for testing
- **Branch Integration**: Merge completed feature branch into `develop` branch before starting next task

### Testing Strategy Requirements
**Comprehensive Registration Testing:**
- **Unit Tests**: Write Minitest tests for freelancer registration logic and organization creation
- **Integration Tests**: Test registration controller and authentication flow
- **Playwright UI Testing**: Validate complete freelancer registration and onboarding flow
  ```javascript
  // Example Playwright test for freelancer registration
  test('freelancer registration creates organization automatically', async ({ page }) => {
    await page.goto('/users/sign_up');
    await page.screenshot({ path: 'registration-form.png' });

    // Fill freelancer registration form
    await page.selectOption('select[name="user[role]"]', 'freelancer');
    await page.fill('input[name="user[name]"]', 'John Freelancer');
    await page.fill('input[name="user[email]"]', 'john@freelancer.com');
    await page.fill('input[name="user[business_name]"]', 'John\'s Design Studio');

    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'freelancer-dashboard.png' });

    // Verify organization was created
    await page.goto('/organizations');
    await page.screenshot({ path: 'freelancer-organization.png' });
  });
  ```

**UI Development with Playwright:**
- Test freelancer registration form and role selection
- Validate automatic organization and team creation
- Test freelancer dashboard and project management interface
- Verify authorization boundaries and permission restrictions
- Test responsive design for freelancer-specific features

### Use browser automation for comprehensive testing:
- **Registration Flow**: Test complete freelancer registration process
- **Organization Creation**: Verify automatic organization and team setup
- **Project Management**: Test project creation and management capabilities
- **Authorization**: Verify freelancer permissions and restrictions
- **Dashboard**: Test freelancer-specific dashboard functionality

### Use launch-process for testing:
- **Database migrations**: Always use `bin/dev` to test organization type additions
- **Role assignments**: Verify proper role and permission setup
- **Integration testing**: Test with existing user roles and permissions

## Security & Authorization Considerations

### Permission Boundaries
- **Scope Limitation**: Freelancers can only manage their own organization/team
- **Data Isolation**: Ensure freelancers cannot access other organizations' data
- **Role Escalation**: Prevent unauthorized role changes or privilege escalation
- **Audit Trail**: Track freelancer organization and project creation

### Data Privacy
- **Organization Isolation**: Strict boundaries between freelancer and other organizations
- **Client Data**: Ensure freelancer clients are private to their organization
- **Project Access**: Limit project visibility to freelancer's own projects

## Expected Deliverables

### 1. Enhanced Registration System
- Updated registration form with role selection
- Freelancer-specific registration flow
- Business information collection
- Automatic organization and team creation

### 2. Freelancer Authorization Framework
- Updated Pundit policies for freelancer capabilities
- Project and client management permissions
- Organization and team admin rights (limited scope)
- Time tracking and reporting access

### 3. User Experience Improvements
- Freelancer onboarding process
- Customized dashboard for freelancers
- Quick start guide and tutorials
- Business-focused navigation and features

### 4. Data Model Enhancements
- Organization types (freelancer, agency, etc.)
- User model updates for freelancer setup
- Automatic relationship creation
- Business information storage

## Augment-Specific Implementation Strategy

### Tool Usage Optimization
- **codebase-retrieval**: Essential for understanding current auth patterns and user flows
- **view tool**: Critical for examining registration forms, controllers, and policies
- **str-replace-editor**: Primary tool for updating models, controllers, views, and policies
- **browser automation**: For testing complete registration and onboarding flows
- **launch-process**: For running migrations and testing role-based functionality

### Code Presentation Standards
- Use `<augment_code_snippet path="..." mode="EXCERPT">` for all Ruby code examples
- Show before/after comparisons for policy and controller changes
- Provide file paths for all modified authentication and authorization files
- Keep code examples focused on specific freelancer enhancements

### Safety & Permission Requirements
- **Request permission**: Before modifying authentication system
- **Conservative approach**: Maintain existing user roles and permissions
- **Incremental testing**: Test freelancer features without affecting existing users
- **Validation required**: Comprehensive testing of authorization boundaries
- **Branch workflow**: Never work directly on main or develop branches

This Augment-optimized approach ensures systematic implementation of freelancer self-registration while maintaining security, proper authorization boundaries, and a smooth user experience for both new freelancers and existing users.
