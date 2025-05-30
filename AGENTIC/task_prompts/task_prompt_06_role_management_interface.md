# Augment-Optimized Task: Role Management Interface

## Project Context
**Technology Stack**: Rails 8.3 + Hotwire, Pundit authorization, Custom CSS  
**Current Issue**: Admins can view users and permissions but cannot edit roles or manage user access  
**User Roles**: System Admin, Organization Admin, Team Admin, Regular User, Freelancer  
**Authorization**: Pundit-based role management with hierarchical permissions  

## Task Overview
Implement comprehensive role management interface allowing System Admins, Organization Admins, and Team Admins to view, edit, and manage user roles and permissions within their authorized scope.

## Augment Agent Optimization Framework

### Phase 1: Current Authorization Structure Analysis
**Use codebase-retrieval to understand existing patterns:**
- "user roles, Pundit policies, authorization, role management"
- "user controller, user views, permission display, role assignment"
- "organization admin, team admin, system admin capabilities"
- "user model, role enum, permission structure, access control"

**Analyze current role hierarchy:**
- System Admin: Full access across all organizations
- Organization Admin: Manage users within their organization
- Team Admin: Manage users within their teams
- Role assignment and permission boundaries

**Use view tool to examine:**
- Current user listing and detail views
- Existing Pundit policies for user management
- User model role definitions and validations
- Authorization patterns in controllers

### Phase 2: Role Management Interface Design
**Design hierarchical role management system:**

**System Admin Capabilities:**
- View and edit all users across all organizations
- Assign any role to any user
- Create and manage organization admins
- Impersonate users for troubleshooting

**Organization Admin Capabilities:**
- View and edit users within their organization
- Assign roles: Team Admin, Regular User, Freelancer
- Cannot assign Organization Admin or System Admin roles
- Manage team assignments within organization

**Team Admin Capabilities:**
- View and edit users within their teams
- Assign Regular User role only
- Cannot promote users to admin roles
- Manage team membership

### Phase 3: User Management Controller Enhancement
**Enhance UsersController with role management:**
```ruby
class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  
  def index
    @users = policy_scope(User).includes(:organization, :teams)
  end
  
  def edit
    authorize @user, :update_role?
  end
  
  def update
    authorize @user, :update_role?
    if @user.update(user_params)
      redirect_to @user, notice: 'User updated successfully.'
    else
      render :edit
    end
  end
end
```

### Phase 4: Enhanced Pundit Policies
**Update UserPolicy for role management:**
```ruby
class UserPolicy < ApplicationPolicy
  def update_role?
    case user.role
    when 'system_admin'
      true
    when 'organization_admin'
      record.organization == user.organization && 
      !record.system_admin? && !record.organization_admin?
    when 'team_admin'
      user.teams.any? { |team| team.users.include?(record) } &&
      record.user?
    else
      false
    end
  end
  
  def assignable_roles
    case user.role
    when 'system_admin'
      User.roles.keys
    when 'organization_admin'
      %w[team_admin user freelancer]
    when 'team_admin'
      %w[user]
    else
      []
    end
  end
end
```

### Phase 5: Role Management Views
**Create comprehensive role management interface:**

**User listing with role management:**
- Filterable user list by role and organization
- Inline role editing for quick changes
- Bulk role assignment capabilities
- User status and last activity indicators

**User detail/edit form:**
- Role selection dropdown with authorized options
- Organization and team assignment
- Permission preview showing what user can access
- Activity log and role change history

**Role assignment interface:**
- Visual role hierarchy display
- Permission matrix showing capabilities
- Confirmation dialogs for role changes
- Audit trail for role modifications

## Technical Implementation Details

### Role Selection Interface
**Dynamic role dropdown based on current user permissions:**
```erb
<%= form.select :role, 
    options_for_select(
      policy(@user).assignable_roles.map { |role| 
        [role.humanize, role] 
      }, 
      @user.role
    ), 
    {}, 
    { class: 'form-select' } %>
```

### Permission Preview Component
**Show user capabilities based on selected role:**
```erb
<div class="permission-preview">
  <h4>Permissions for <%= @user.role.humanize %></h4>
  <ul>
    <% if @user.can_manage_projects? %>
      <li>✓ Manage Projects</li>
    <% end %>
    <% if @user.can_manage_users? %>
      <li>✓ Manage Users</li>
    <% end %>
  </ul>
</div>
```

### Bulk Role Assignment
**Interface for managing multiple users:**
```ruby
def bulk_update
  authorize User, :bulk_update?
  
  params[:user_ids].each do |user_id|
    user = User.find(user_id)
    authorize user, :update_role?
    user.update(role: params[:new_role])
  end
  
  redirect_to users_path, notice: 'Users updated successfully.'
end
```

### Audit Trail Implementation
**Track role changes for security:**
```ruby
class RoleChange < ApplicationRecord
  belongs_to :user
  belongs_to :changed_by, class_name: 'User'
  
  validates :old_role, :new_role, presence: true
end

# In User model
after_update :log_role_change, if: :saved_change_to_role?

private

def log_role_change
  RoleChange.create!(
    user: self,
    changed_by: Current.user,
    old_role: role_before_last_save,
    new_role: role
  )
end
```

## User Experience Features

### Role Management Dashboard
- **User Overview**: Total users by role and organization
- **Recent Changes**: Latest role assignments and modifications
- **Quick Actions**: Common role management tasks
- **Search & Filter**: Find users by name, role, organization, team

### Interactive Role Assignment
- **Drag & Drop**: Visual role assignment interface
- **Confirmation Dialogs**: Prevent accidental role changes
- **Permission Preview**: Show impact of role changes
- **Batch Operations**: Manage multiple users simultaneously

### Security Features
- **Role Change Confirmation**: Require confirmation for sensitive role changes
- **Audit Trail**: Complete history of role modifications
- **Session Validation**: Re-authenticate for critical role changes
- **Permission Warnings**: Alert when removing admin privileges

## Validation & Testing Strategy

### Development Workflow Requirements
- **Branch Management**: Create feature branch `feature/role-management-interface` before starting
- **Commit Strategy**: Make frequent commits with descriptive messages like "Add role assignment interface" or "Implement audit trail for role changes"
- **Application Startup**: Always use `bin/dev` to start the Rails application for testing
- **Branch Integration**: Merge completed feature branch into `develop` branch before starting next task

### Testing Strategy Requirements
**Comprehensive Role Management Testing:**
- **Unit Tests**: Write Minitest tests for role assignment logic and authorization policies
- **Integration Tests**: Test role management controllers and permission boundaries
- **Playwright UI Testing**: Validate role management interface and user workflows
  ```javascript
  // Example Playwright test for role management
  test('admin can assign roles within their authority', async ({ page }) => {
    await page.goto('/users');
    await page.screenshot({ path: 'users-listing.png' });

    // Test role assignment
    await page.click('a[href*="/users/1/edit"]');
    await page.selectOption('select[name="user[role]"]', 'team_admin');
    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'role-assignment-success.png' });

    // Test bulk role assignment
    await page.check('input[name="user_ids[]"][value="2"]');
    await page.check('input[name="user_ids[]"][value="3"]');
    await page.selectOption('select[name="bulk_role"]', 'user');
    await page.click('button[name="bulk_update"]');
    await page.screenshot({ path: 'bulk-role-assignment.png' });
  });
  ```

**UI Development with Playwright:**
- Test role assignment forms and dropdown functionality
- Validate permission boundaries and error handling
- Test bulk role assignment interface
- Verify audit trail and role change history
- Test responsive design for role management interface

### Use browser automation for comprehensive testing:
- **Role Assignment**: Test role changes for different admin types
- **Permission Boundaries**: Verify admins cannot exceed their authority
- **User Interface**: Test all role management interface elements
- **Bulk Operations**: Validate bulk role assignment functionality
- **Audit Trail**: Verify role change logging and history

### Use launch-process for testing:
- **Authorization Testing**: Always use `bin/dev` to verify Pundit policies work correctly
- **Database Integrity**: Test role change validations and constraints
- **Performance Testing**: Test with large numbers of users

## Security Considerations

### Authorization Boundaries
- **Strict Role Hierarchy**: Prevent privilege escalation
- **Organization Isolation**: Ensure admins cannot cross organization boundaries
- **Team Scope Limitation**: Team admins limited to their team members
- **Self-Assignment Prevention**: Users cannot change their own roles

### Audit & Compliance
- **Complete Audit Trail**: Log all role changes with timestamps
- **Change Attribution**: Track who made each role change
- **Permission Validation**: Verify user has authority before role changes
- **Data Integrity**: Ensure role changes don't break existing associations

## Expected Deliverables

### 1. Enhanced User Management System
- UsersController with role management capabilities
- Updated Pundit policies for hierarchical role management
- Role assignment and editing interfaces
- Bulk user management functionality

### 2. Role Management Interface
- User listing with role filtering and search
- Role editing forms with permission previews
- Bulk role assignment interface
- Role change confirmation dialogs

### 3. Security & Audit Features
- Complete audit trail for role changes
- Authorization boundary enforcement
- Role change validation and confirmation
- Security logging and monitoring

### 4. User Experience Enhancements
- Intuitive role management dashboard
- Visual permission hierarchy display
- Quick action shortcuts for common tasks
- Responsive design for mobile role management

## Augment-Specific Implementation Strategy

### Tool Usage Optimization
- **codebase-retrieval**: Essential for understanding current authorization patterns and user management
- **view tool**: Critical for examining existing user views and Pundit policies
- **str-replace-editor**: Primary tool for updating controllers, policies, and views
- **browser automation**: For testing role assignment workflows and permission boundaries
- **launch-process**: For testing authorization logic and database constraints

### Code Presentation Standards
- Use `<augment_code_snippet path="..." mode="EXCERPT">` for all Ruby code examples
- Show before/after comparisons for policy and controller changes
- Provide file paths for all user management related files
- Keep code examples focused on specific role management features

### Safety & Permission Requirements
- **Request permission**: Before modifying user roles or authorization system
- **Conservative approach**: Implement with strict authorization boundaries
- **Incremental testing**: Test role management with different admin levels
- **Validation required**: Comprehensive testing of permission boundaries and security
- **Branch workflow**: Never work directly on main or develop branches

This Augment-optimized approach ensures secure and comprehensive role management implementation while maintaining strict authorization boundaries and providing intuitive interfaces for different admin levels to manage users within their authorized scope.
