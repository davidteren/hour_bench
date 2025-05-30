# HourBench

A learning-focused project management application designed for performance optimization education and Rails development training.

## Overview

HourBench is a time-tracking and project management application built with Rails 8.3 and modern web technologies. Originally designed for legal teams and small businesses, it serves as an educational platform for learning performance optimization, monitoring, and Rails best practices.

**⚠️ Educational Purpose**: This application intentionally includes performance issues and anti-patterns for learning and assessment purposes. It is not production-ready.

## Features

### Core Functionality
- **Time Tracking**: Start/stop timers, manage time entries, and track billable hours
- **Project Management**: Complete CRUD operations for projects with issue tracking
- **Client Management**: Comprehensive client profiles with search and filtering
- **Team Collaboration**: Multi-organization support with role-based access control
- **Document Management**: File uploads and version control with ActiveStorage
- **User Administration**: Built-in authentication with admin impersonation capabilities

### Learning Features
- **Performance Monitoring**: Integrated AppSignal for error tracking and performance analysis
- **Intentional Issues**: N+1 queries, missing indexes, and other anti-patterns for educational purposes
- **Role-Based Access**: Pundit-powered authorization system with multiple user roles
- **Test Data**: Comprehensive seed data with realistic scenarios for testing

## Quick Start

### Prerequisites
- Ruby 3.4.1 or higher
- Rails 8.0.2 or higher
- SQLite 3
- Node.js (for Playwright testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hoursCRM
   ```

2. **Install dependencies**
   ```bash
   bundle install
   npm install
   ```

3. **Setup the database**
   ```bash
   rails db:create db:migrate db:seed
   ```

4. **Start the application**
   ```bash
   bin/dev
   ```

5. **Access the application**
   Open your browser to `http://localhost:3000`

### Test Users

The application includes pre-configured test users for different roles:

- **System Admin**: admin@hourbench.com
- **Organization Admin**: alice.johnson@techsolutions.com  
- **Team Admin**: david.brown@techsolutions.com
- **Regular User**: grace.lee@techsolutions.com
- **Freelancer**: blake.freeman@freelance.com

All test users use the password: `password123`

To enable quick login during development:
```bash
SHOW_TEST_CREDENTIALS=true bin/dev
```

## Technology Stack

### Core Framework
- **Rails 8.3**: Latest Rails with built-in authentication
- **Hotwire**: Turbo + Stimulus for reactive interfaces
- **Custom CSS**: Apple-inspired design system (no external frameworks)
- **Importmaps**: JavaScript via CDNs without build tools
- **SQLite**: Database for development and testing

### Rails 8 Features
- **Solid Cache**: Database-backed caching
- **Solid Queue**: Background job processing
- **Solid Cable**: WebSocket connections
- **Built-in Authentication**: No external auth gems required

### Monitoring & Testing
- **AppSignal**: Performance monitoring and error tracking
- **Playwright**: End-to-end testing framework
- **Minitest**: Unit and integration testing
- **Bullet**: N+1 query detection

## Development

### Development Setup

1. **Enable development features**
   ```bash
   SHOW_TEST_CREDENTIALS=true bin/dev
   ```

2. **Run tests**
   ```bash
   # Unit tests
   rails test
   
   # E2E tests
   npx playwright test
   ```

3. **Database operations**
   ```bash
   # Reset with fresh seed data
   rails db:reset db:seed
   
   # Run specific seeds
   rails db:seed
   ```

### Project Structure

The application follows standard Rails conventions with some educational enhancements:

- **Models**: Core business logic with intentional performance issues
- **Controllers**: RESTful design with Hotwire integration  
- **Views**: Minimal, Apple-inspired UI components
- **Policies**: Pundit-based authorization for role management
- **Tests**: Comprehensive test suite with Playwright for UI validation

### Performance Learning

This application includes intentional performance issues for educational purposes:

- **N+1 Queries**: Missing eager loading in various controllers
- **Missing Indexes**: Database queries without proper indexing
- **Inefficient Joins**: Complex queries that could be optimized
- **Memory Issues**: Areas prone to memory leaks and high allocation

These issues are monitored via AppSignal and documented in `docs/performance/`.

## Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes with frequent commits**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

3. **Test your changes**
   ```bash
   rails test
   npx playwright test
   ```

4. **Submit for review**
   Create a pull request with detailed description of changes

### Code Standards

- Follow Rails conventions and best practices
- Write tests for new functionality
- Use Playwright for UI validation
- Document performance implications
- Maintain the educational nature of intentional issues

## Documentation

- **Development Setup**: [docs/development/DEVELOPMENT_LOGIN.md](docs/development/DEVELOPMENT_LOGIN.md)
- **Performance Issues**: [docs/performance/rails_performance_and_error_examples_.md](docs/performance/rails_performance_and_error_examples_.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## License

This project is intended for educational purposes. Please refer to the license file for specific terms and conditions.

## Contact

For questions about this educational project, please refer to the documentation or create an issue in the repository.
