# Branch Log - Snapshot Branches

This document tracks all snapshot branches created for the HourBench project. These branches preserve specific states of the project for testing, comparison, and educational purposes.

## Naming Convention

**Format**: `snapshot/{YYYY-MM-DD}/{milestone-type}-{brief-description}`

### Milestone Types
- **baseline**: Initial state or major milestone baseline
- **pre-optimization**: State before performance optimization work
- **pre-refactor**: State before major refactoring
- **pre-feature**: State before implementing major features
- **post-fix**: State after fixing major issues (for comparison)
- **experimental**: Experimental states for testing

### Examples
- `snapshot/2025-01-15/baseline-with-known-issues`
- `snapshot/2025-01-20/pre-optimization-n-plus-one-queries`
- `snapshot/2025-01-25/pre-refactor-dashboard-analytics`
- `snapshot/2025-02-01/pre-feature-document-management`

## Snapshot Branches

### snapshot/2025-01-15/baseline-with-known-issues

**Created**: January 15, 2025
**From Branch**: main
**Commit**: 7d8d428 - "Add systematic branching strategy documentation"
**Project State**: ~70% complete

#### Purpose
Establish the initial baseline state of the HourBench project with all known issues and intentional performance anti-patterns preserved for future testing and comparison.

#### What This Branch Preserves

**Working Features**:
- ✅ Authentication & Authorization (Rails 8 + Pundit)
- ✅ Time Tracking (Timer + CRUD operations)
- ✅ Project Management (Full CRUD + Issue tracking)
- ✅ Client Management (Full CRUD + Search/Filters)
- ✅ AppSignal Integration (Performance monitoring)
- ✅ UI Design System (Apple-inspired custom CSS)

**Known Performance Issues** (Intentional for education):
- 🐛 N+1 Queries in multiple controllers and models
- 🐛 Missing database indexes on foreign keys
- 🐛 Inefficient joins in reporting queries
- 🐛 Unoptimized dashboard aggregations
- 🐛 Memory issues from missing eager loading

**Missing Features**:
- ❌ User Administration UI
- ❌ Document Management (ActiveStorage)
- ❌ Comprehensive Reporting & Billing
- ❌ Calendar View
- ❌ Complete E2E Testing Infrastructure
- ❌ Advanced Dashboard Analytics

#### Use Cases for This Branch

1. **LLM Testing & Evaluation**
   - Test agentic coding tools against known baseline
   - Evaluate LLM performance in identifying and fixing issues
   - Compare different AI approaches to optimization

2. **Performance Optimization Benchmarking**
   - Measure performance improvements after optimization work
   - A/B test different optimization strategies
   - Document performance gains with concrete before/after data

3. **Educational Demonstrations**
   - Show students/developers common Rails anti-patterns
   - Demonstrate proper performance monitoring setup
   - Illustrate the impact of N+1 queries and missing indexes

4. **Regression Testing**
   - Ensure optimizations don't break existing functionality
   - Validate that performance improvements are maintained
   - Test new features against stable baseline

#### How to Use This Branch

```bash
# Switch to the snapshot branch
git checkout snapshot/2025-01-15/baseline-with-known-issues

# Set up the environment
bundle install
rails db:create db:migrate db:seed

# Run the application
SHOW_TEST_CREDENTIALS=true bin/dev

# Run tests to verify state
rails test
npx playwright test

# Compare with current main branch
git diff main..snapshot/2025-01-15/baseline-with-known-issues
```

#### Key Files to Examine for Issues

**N+1 Query Examples**:
- `app/models/client.rb` (lines 18-27): Client total calculations
- `app/models/project.rb` (lines 41-50): Recent activity method
- `app/controllers/time_logs_controller.rb`: Missing eager loading

**Missing Indexes**:
- Check `db/schema.rb` for foreign key columns without indexes
- Look for frequently queried columns without proper indexing

**Error-Prone Areas**:
- Views with potential nil reference issues
- Billing calculations that could divide by zero
- Missing validations in models

#### Performance Monitoring

This branch includes AppSignal integration. When running the application:
- Monitor N+1 query alerts
- Check memory usage patterns
- Observe slow query notifications
- Track error rates and types

#### Testing Against This Branch

When testing optimization tools or approaches:

1. **Baseline Measurement**:
   ```bash
   # Run performance tests
   rails test:performance  # If available
   # Monitor AppSignal dashboard
   # Record page load times
   ```

2. **Apply Changes**:
   - Create new branch from this snapshot
   - Apply optimizations or fixes
   - Document changes made

3. **Compare Results**:
   - Measure performance improvements
   - Verify functionality still works
   - Document lessons learned

---

## Future Snapshot Branches

### Planned Snapshots

**snapshot/2025-01-20/pre-optimization-n-plus-one-queries**
- **Purpose**: Preserve state before fixing N+1 query issues
- **Focus**: Baseline for measuring query optimization impact

**snapshot/2025-01-25/pre-refactor-dashboard-analytics**
- **Purpose**: State before implementing dashboard analytics
- **Focus**: Baseline for measuring new feature impact

**snapshot/2025-02-01/pre-feature-document-management**
- **Purpose**: State before adding document management
- **Focus**: Baseline for measuring feature addition impact

### Guidelines for Creating New Snapshots

1. **Before Major Changes**: Always create a snapshot before significant optimization, refactoring, or feature work
2. **Document Purpose**: Clearly state what the snapshot preserves and why
3. **Update This Log**: Add entry with purpose, use cases, and testing instructions
4. **Tag Important Commits**: Use git tags for easy reference
5. **Test the Snapshot**: Verify the snapshot branch works correctly before documenting

### Maintenance

- Review snapshot branches quarterly
- Archive old snapshots that are no longer needed
- Keep documentation updated with new branches
- Ensure snapshot branches remain functional
