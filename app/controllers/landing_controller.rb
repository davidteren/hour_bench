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
        title: "AI-Powered Time Tracking",
        description: "Revolutionary time tracking with machine learning insights and automatic project detection",
        icon: "clock",
        category: "management",
        usage: "96%",
        benefits: [
          "Automatic activity detection and categorization",
          "Smart project suggestions based on context",
          "Predictive time estimation for tasks",
          "Real-time productivity scoring"
        ],
        details: "Our AI-powered time tracking system learns from your work patterns to automatically detect and categorize activities. Features include smart timer controls, context-aware project suggestions, and predictive analytics that help you estimate task duration with unprecedented accuracy."
      },
      {
        title: "Intelligent Project Management",
        description: "Next-generation project orchestration with AI-driven insights and automated workflows",
        icon: "folder",
        category: "management",
        usage: "94%",
        benefits: [
          "AI-powered project health monitoring",
          "Automated risk detection and mitigation",
          "Smart resource allocation recommendations",
          "Predictive milestone tracking"
        ],
        details: "Transform your project management with AI-driven insights that predict bottlenecks, optimize resource allocation, and automatically adjust timelines based on team performance patterns and historical data."
      },
      {
        title: "Hyper-Collaborative Workflows",
        description: "Real-time collaboration platform with advanced team coordination and communication tools",
        icon: "users",
        category: "collaboration",
        usage: "98%",
        benefits: [
          "Real-time collaborative editing and commenting",
          "Advanced role-based access control",
          "Integrated video conferencing and screen sharing",
          "Smart notification and priority management"
        ],
        details: "Experience seamless team collaboration with real-time editing, intelligent notification systems, and integrated communication tools that keep your team synchronized and productive."
      },
      {
        title: "Performance Optimization Engine",
        description: "Advanced performance monitoring with real-time optimization suggestions and automated improvements",
        icon: "zap",
        category: "performance",
        usage: "92%",
        benefits: [
          "Real-time performance monitoring and alerts",
          "Automated optimization recommendations",
          "Database query analysis and improvement",
          "Memory usage optimization and leak detection"
        ],
        details: "Our performance engine continuously monitors your application, identifies bottlenecks, and provides actionable optimization recommendations with automated fixes for common performance issues."
      },
      {
        title: "Advanced Analytics Dashboard",
        description: "Comprehensive analytics platform with machine learning insights and predictive modeling",
        icon: "bar-chart-3",
        category: "performance",
        usage: "89%",
        benefits: [
          "Real-time performance metrics and KPIs",
          "Predictive analytics and trend forecasting",
          "Custom dashboard creation and sharing",
          "Automated report generation and distribution"
        ],
        details: "Gain deep insights into your team's performance with advanced analytics, predictive modeling, and customizable dashboards that help you make data-driven decisions."
      },
      {
        title: "Enterprise Client Portal",
        description: "Sophisticated client management system with integrated billing, communication, and project visibility",
        icon: "building",
        category: "management",
        usage: "91%",
        benefits: [
          "Branded client portals with custom domains",
          "Integrated billing and invoice management",
          "Real-time project visibility and updates",
          "Advanced client communication tools"
        ],
        details: "Provide your clients with a premium experience through branded portals, real-time project updates, integrated billing systems, and seamless communication channels."
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
