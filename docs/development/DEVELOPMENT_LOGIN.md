# Development Login Helper

This document describes the development login helper feature that enables quick testing of user impersonation and role-based access control.

## Overview

The development login helper provides one-click login functionality for testing different user roles without manually entering credentials. This feature is only available in development environment when explicitly enabled.

## Features

### Database Seeds

The application now includes structured test data with predictable users across different roles:

- **System Admin**: Full system access
- **Organization Admins**: Manage their organization and all teams within it
- **Team Admins**: Manage their specific team
- **Regular Users**: Standard user access within their team
- **Freelancers**: Independent users without organization affiliation

### Quick Login Interface

When enabled, the login page displays a "Development Only - Quick Login" section with:

- Color-coded buttons for different roles
- Clear organization and team labels
- One-click login functionality
- Visual indicators for role hierarchy

## Setup

### 1. Create Test Data

Run the database seeds to create structured test users:

```bash
rails db:reset db:seed
```

This creates:
- 3 organizations (TechSolutions Inc, Creative Agency, StartupCorp)
- Multiple teams per organization
- 3-4 users per role level across organizations
- Realistic test data for clients, projects, and time logs

### 2. Enable Quick Login

Set the environment variable to show the quick login section:

```bash
SHOW_TEST_CREDENTIALS=true rails server
```

### 3. Access the Login Page

Visit `/session/new` to see the quick login section with all available test users.

## Test Users

All test users use the password: `password123`

### System Admin
- **admin@hourbench.com** - System Admin with full access

### Organization Admins
- **TechSolutions Inc:**
  - alice.johnson@techsolutions.com (Alice Johnson)
  - bob.wilson@techsolutions.com (Bob Wilson)
  - carol.davis@techsolutions.com (Carol Davis)

- **Creative Agency:**
  - luna.rodriguez@creative.com (Luna Rodriguez)
  - max.thompson@creative.com (Max Thompson)
  - nina.patel@creative.com (Nina Patel)

- **StartupCorp:**
  - victor.chang@startup.com (Victor Chang)
  - wendy.foster@startup.com (Wendy Foster)

### Team Admins
- **TechSolutions Inc:**
  - david.brown@techsolutions.com (David Brown - Development Team)
  - eva.martinez@techsolutions.com (Eva Martinez - QA Team)
  - frank.miller@techsolutions.com (Frank Miller - Development Team)

- **Creative Agency:**
  - oscar.kim@creative.com (Oscar Kim - Design Team)
  - paula.garcia@creative.com (Paula Garcia - Marketing Team)
  - quinn.adams@creative.com (Quinn Adams - Design Team)

- **StartupCorp:**
  - xavier.bell@startup.com (Xavier Bell - Product Team)
  - yuki.tanaka@startup.com (Yuki Tanaka - Product Team)

### Regular Users
- **TechSolutions Inc:**
  - grace.lee@techsolutions.com (Grace Lee - Development Team)
  - henry.taylor@techsolutions.com (Henry Taylor - Development Team)
  - ivy.chen@techsolutions.com (Ivy Chen - QA Team)
  - jack.smith@techsolutions.com (Jack Smith - QA Team)

- **Creative Agency:**
  - ruby.white@creative.com (Ruby White - Design Team)
  - sam.johnson@creative.com (Sam Johnson - Marketing Team)
  - tina.lopez@creative.com (Tina Lopez - Design Team)
  - uma.singh@creative.com (Uma Singh - Marketing Team)

- **StartupCorp:**
  - zoe.clark@startup.com (Zoe Clark - Product Team)
  - alex.rivera@startup.com (Alex Rivera - Product Team)

### Freelancers
- blake.freeman@freelance.com (Blake Freeman)
- casey.jordan@freelance.com (Casey Jordan)
- drew.morgan@freelance.com (Drew Morgan)

## Testing Scenarios

### Role-Based Access Control
1. Login as different roles to test permission boundaries
2. Verify organization admins can only see their organization's data
3. Test team admins can only manage their team members
4. Confirm regular users have appropriate limited access

### User Impersonation
1. Login as System Admin (admin@hours.com)
2. Navigate to Users section
3. Use the impersonate feature on any user
4. Verify the impersonation banner appears
5. Test that permissions are correctly applied during impersonation
6. Stop impersonation to return to original user

### Cross-Organization Testing
1. Login as users from different organizations
2. Verify data isolation between organizations
3. Test that users cannot access other organizations' data

## Playwright Testing

The Playwright authentication helpers have been updated to use the structured test data:

```javascript
// Available helper functions
await loginAsSystemAdmin(page);
await loginAsOrgAdmin(page, 'techsolutions'); // or 'creative', 'startup'
await loginAsTeamAdmin(page, 'techsolutions');
await loginAsUser(page, 'techsolutions');
await loginAsFreelancer(page);
```

## Security Notes

- This feature is **only available in development environment**
- The `SHOW_TEST_CREDENTIALS` environment variable must be explicitly set
- Quick login section will not appear in production
- All test users use the same password for convenience in testing

## Implementation Details

### Files Modified
- `db/seeds.rb` - Structured test data creation
- `app/views/sessions/new.html.erb` - Quick login interface
- `config/environments/development.rb` - Environment variable documentation
- `tests/playwright/helpers/auth.js` - Updated Playwright helpers

### Environment Variable Check
```erb
<% if Rails.env.development? && ENV['SHOW_TEST_CREDENTIALS'] == 'true' %>
  <!-- Quick login section -->
<% end %>
```

This ensures the feature is only available when explicitly enabled in development.
