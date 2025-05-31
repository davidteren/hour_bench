class LandingController < ApplicationController
  allow_unauthenticated_access
  layout 'landing'
  
  def index
    @features = landing_features
    @use_cases = landing_use_cases
    @tech_stack = tech_stack_highlights
    @demo_users = demo_user_credentials
  end
  
  def features
    @features = landing_features
  end
  
  def about
    @tech_stack = tech_stack_highlights
  end
  
  private
  
  def landing_features
    [
      {
        title: "Time Tracking",
        description: "Comprehensive time logging with project-based tracking and real-time timer functionality",
        icon: "clock",
        details: "Start/stop timers, track billable hours, and manage time entries across multiple projects"
      },
      {
        title: "Project Management", 
        description: "Full project lifecycle management with issue tracking and client collaboration",
        icon: "folder",
        details: "Create projects, manage issues, track progress, and collaborate with team members"
      },
      {
        title: "Team Collaboration",
        description: "Role-based access control and comprehensive team management features",
        icon: "users",
        details: "Organize teams, manage permissions, and enable seamless collaboration across projects"
      },
      {
        title: "Client Management",
        description: "Complete client relationship management with contact tracking and project history",
        icon: "building",
        details: "Manage client information, track project history, and maintain professional relationships"
      },
      {
        title: "Performance Monitoring",
        description: "Built-in AppSignal integration for real-time performance insights and optimization",
        icon: "activity",
        details: "Monitor application performance, identify bottlenecks, and optimize for better user experience"
      },
      {
        title: "Learning Platform",
        description: "Intentional performance issues and anti-patterns for educational purposes",
        icon: "book-open",
        details: "Explore N+1 queries, missing indexes, and other performance challenges in a safe environment"
      }
    ]
  end
  
  def landing_use_cases
    [
      {
        title: "For Developers",
        description: "Explore modern Rails 8 features and performance optimization techniques",
        icon: "code",
        benefits: [
          "Learn from intentional anti-patterns and optimization opportunities",
          "Hands-on experience with real-world performance challenges",
          "Modern Rails 8 features including Solid Queue, Cache, and Cable",
          "Comprehensive testing with Minitest and Playwright"
        ]
      },
      {
        title: "For Evaluators",
        description: "Assess coding skills with realistic project scenarios and challenges",
        icon: "search",
        benefits: [
          "Evaluate problem-solving approaches to performance issues",
          "Test knowledge of Rails best practices and optimization",
          "Real-world codebase with intentional issues to identify and fix",
          "Comprehensive test suite for validation"
        ]
      },
      {
        title: "For Students",
        description: "Learn project management concepts through practical application",
        icon: "graduation-cap",
        benefits: [
          "Understand performance implications of different coding approaches",
          "Gain experience with modern web development technologies",
          "Learn project management workflows and best practices",
          "Explore role-based authorization and security patterns"
        ]
      },
      {
        title: "For Business Users",
        description: "Professional time tracking and project management capabilities",
        icon: "briefcase",
        benefits: [
          "Track time across multiple projects and clients",
          "Generate reports and analyze productivity metrics",
          "Manage team members and project assignments",
          "Client relationship management and billing tracking"
        ]
      }
    ]
  end
  
  def tech_stack_highlights
    [
      {
        category: "Backend",
        technologies: [
          { name: "Rails 8.3", description: "Latest Rails with built-in authentication" },
          { name: "Solid Stack", description: "Solid Queue, Solid Cache, Solid Cable" },
          { name: "SQLite", description: "Lightweight database for development" },
          { name: "Pundit", description: "Authorization with role-based access control" }
        ]
      },
      {
        category: "Frontend",
        technologies: [
          { name: "Hotwire", description: "Turbo + Stimulus for modern interactions" },
          { name: "Custom CSS", description: "Apple-inspired design system" },
          { name: "Importmaps", description: "Modern JavaScript without bundling" },
          { name: "Lucide Icons", description: "Beautiful, customizable icons" }
        ]
      },
      {
        category: "Testing",
        technologies: [
          { name: "Minitest", description: "Comprehensive unit and integration tests" },
          { name: "Playwright", description: "End-to-end browser testing" },
          { name: "Fixtures + Faker", description: "Realistic test data generation" },
          { name: "Performance Testing", description: "Large datasets for optimization" }
        ]
      },
      {
        category: "Monitoring",
        technologies: [
          { name: "AppSignal", description: "Performance monitoring and error tracking" },
          { name: "Rails Performance", description: "Built-in performance insights" },
          { name: "Intentional Issues", description: "Educational performance challenges" },
          { name: "Optimization Learning", description: "Real-world improvement opportunities" }
        ]
      }
    ]
  end
  
  def demo_user_credentials
    [
      {
        role: "System Admin",
        email: "admin@hourbench.com",
        description: "Full access + impersonation capabilities"
      },
      {
        role: "Organization Admin", 
        email: "alice.johnson@techsolutions.com",
        description: "Organization-level management"
      },
      {
        role: "Team Admin",
        email: "david.brown@techsolutions.com", 
        description: "Team-level management"
      },
      {
        role: "Regular User",
        email: "grace.lee@techsolutions.com",
        description: "Assigned projects only"
      },
      {
        role: "Freelancer",
        email: "blake.freeman@freelance.com",
        description: "Personal projects and clients"
      }
    ]
  end
end
