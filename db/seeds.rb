# frozen_string_literal: true

require 'faker'

puts "🌱 Starting seed data creation..."

# Create system admin (no organization required)
system_admin = User.create!(
  name: "System Admin",
  email_address: "admin@hourbench.com",
  password: "password123",
  role: 0 # system_admin
)

puts "✅ Created system admin: #{system_admin.email_address}"

# Create specific test organizations
organizations_data = [
  { name: "TechSolutions Inc", description: "Leading technology consulting firm" },
  { name: "Creative Agency", description: "Full-service digital marketing agency" },
  { name: "StartupCorp", description: "Fast-growing startup company" }
]

organizations = []
organizations_data.each do |org_data|
  org = Organization.create!(
    name: org_data[:name],
    description: org_data[:description]
  )
  organizations << org

  # Create address for organization
  Address.create!(
    street: Faker::Address.street_address,
    city: Faker::Address.city,
    state: Faker::Address.state,
    zip_code: Faker::Address.zip_code,
    country: "USA",
    addressable: org
  )

  puts "✅ Created organization: #{org.name}"
end

# Create specific test teams and users for each organization
test_users_data = [
  # TechSolutions Inc (organizations[0])
  {
    org_index: 0,
    teams: [
      { name: "Development Team", description: "Software development team" },
      { name: "QA Team", description: "Quality assurance team" }
    ],
    users: [
      # Organization Admins
      { name: "Alice Johnson", email: "alice.johnson@techsolutions.com", role: 1, team_index: 0 },
      { name: "Bob Wilson", email: "bob.wilson@techsolutions.com", role: 1, team_index: 0 },
      { name: "Carol Davis", email: "carol.davis@techsolutions.com", role: 1, team_index: 1 },

      # Team Admins
      { name: "David Brown", email: "david.brown@techsolutions.com", role: 2, team_index: 0 },
      { name: "Eva Martinez", email: "eva.martinez@techsolutions.com", role: 2, team_index: 1 },
      { name: "Frank Miller", email: "frank.miller@techsolutions.com", role: 2, team_index: 0 },

      # Regular Users
      { name: "Grace Lee", email: "grace.lee@techsolutions.com", role: 3, team_index: 0 },
      { name: "Henry Taylor", email: "henry.taylor@techsolutions.com", role: 3, team_index: 0 },
      { name: "Ivy Chen", email: "ivy.chen@techsolutions.com", role: 3, team_index: 1 },
      { name: "Jack Smith", email: "jack.smith@techsolutions.com", role: 3, team_index: 1 }
    ]
  },

  # Creative Agency (organizations[1])
  {
    org_index: 1,
    teams: [
      { name: "Design Team", description: "Creative design team" },
      { name: "Marketing Team", description: "Digital marketing team" }
    ],
    users: [
      # Organization Admins
      { name: "Luna Rodriguez", email: "luna.rodriguez@creative.com", role: 1, team_index: 0 },
      { name: "Max Thompson", email: "max.thompson@creative.com", role: 1, team_index: 1 },
      { name: "Nina Patel", email: "nina.patel@creative.com", role: 1, team_index: 0 },

      # Team Admins
      { name: "Oscar Kim", email: "oscar.kim@creative.com", role: 2, team_index: 0 },
      { name: "Paula Garcia", email: "paula.garcia@creative.com", role: 2, team_index: 1 },
      { name: "Quinn Adams", email: "quinn.adams@creative.com", role: 2, team_index: 0 },

      # Regular Users
      { name: "Ruby White", email: "ruby.white@creative.com", role: 3, team_index: 0 },
      { name: "Sam Johnson", email: "sam.johnson@creative.com", role: 3, team_index: 1 },
      { name: "Tina Lopez", email: "tina.lopez@creative.com", role: 3, team_index: 0 },
      { name: "Uma Singh", email: "uma.singh@creative.com", role: 3, team_index: 1 }
    ]
  },

  # StartupCorp (organizations[2])
  {
    org_index: 2,
    teams: [
      { name: "Product Team", description: "Product development team" }
    ],
    users: [
      # Organization Admins
      { name: "Victor Chang", email: "victor.chang@startup.com", role: 1, team_index: 0 },
      { name: "Wendy Foster", email: "wendy.foster@startup.com", role: 1, team_index: 0 },

      # Team Admins
      { name: "Xavier Bell", email: "xavier.bell@startup.com", role: 2, team_index: 0 },
      { name: "Yuki Tanaka", email: "yuki.tanaka@startup.com", role: 2, team_index: 0 },

      # Regular Users
      { name: "Zoe Clark", email: "zoe.clark@startup.com", role: 3, team_index: 0 },
      { name: "Alex Rivera", email: "alex.rivera@startup.com", role: 3, team_index: 0 }
    ]
  }
]

# Create teams and users based on the structured data
test_users_data.each do |org_data|
  org = organizations[org_data[:org_index]]

  # Create teams for this organization
  teams = []
  org_data[:teams].each do |team_data|
    team = Team.create!(
      name: team_data[:name],
      description: team_data[:description],
      organization: org
    )
    teams << team
    puts "  📁 Created team: #{team.name} for #{org.name}"
  end

  # Create users for this organization
  org_data[:users].each do |user_data|
    user = User.create!(
      name: user_data[:name],
      email_address: user_data[:email],
      password: "password123",
      role: user_data[:role],
      organization: org,
      team: teams[user_data[:team_index]]
    )
    role_name = user.role_name
    puts "  👤 Created #{role_name}: #{user.name} (#{user.email_address})"
  end
end

# Create freelancers (no organization)
freelancers_data = [
  { name: "Blake Freeman", email: "blake.freeman@freelance.com" },
  { name: "Casey Jordan", email: "casey.jordan@freelance.com" },
  { name: "Drew Morgan", email: "drew.morgan@freelance.com" }
]

freelancers_data.each do |freelancer_data|
  freelancer = User.create!(
    name: freelancer_data[:name],
    email_address: freelancer_data[:email],
    password: "password123",
    role: 4 # freelancer
  )
  puts "🆓 Created freelancer: #{freelancer.name} (#{freelancer.email_address})"
end

# Create clients and projects with intentional performance issues
organizations.each do |org|
  # Create 5-10 clients per organization
  clients = []
  rand(5..10).times do
    client = Client.create!(
      name: Faker::Company.name,
      email: Faker::Internet.email,
      phone: Faker::PhoneNumber.phone_number,
      company: Faker::Company.name,
      status: 0, # active
      organization: org
    )
    clients << client

    # Add address for client
    Address.create!(
      street: Faker::Address.street_address,
      city: Faker::Address.city,
      state: Faker::Address.state,
      zip_code: Faker::Address.zip_code,
      country: "USA",
      addressable: client
    )

    puts "  🏢 Created client: #{client.name}"
  end

  # Create projects for each client
  clients.each do |client|
    rand(1..4).times do
      project = Project.create!(
        name: Faker::App.name,
        description: Faker::Lorem.paragraph,
        status: rand(0..2), # active, completed, on_hold
        hourly_rate: rand(50..200),
        budget: rand(5000..50000),
        client: client
      )

      puts "    📋 Created project: #{project.name}"

      # Create issues for each project
      rand(2..8).times do
        issue = Issue.create!(
          title: Faker::Lorem.sentence(word_count: 3),
          description: Faker::Lorem.paragraph,
          status: 0, # open
          priority: rand(0..3),
          project: project
        )

        # Create documents for some issues
        if rand < 0.3
          Document.create!(
            title: Faker::File.file_name(dir: '', name: Faker::Lorem.word, ext: 'pdf'),
            description: Faker::Lorem.sentence,
            document_type: [ 'contract', 'invoice', 'report', 'memo' ].sample,
            version: "1.0",
            issue: issue
          )
        end
      end
    end
  end
end

# Create time logs with intentional performance issues
puts "⏰ Creating time logs..."

User.where.not(role: 0).find_each do |user| # Skip system admin
  next if user.role == 4 && user.organization.nil? # Skip freelancers for now

  # Get projects for this user's organization
  projects = Project.joins(:client).where(clients: { organization: user.organization })

  # Create 10-50 time logs per user
  rand(10..50).times do
    project = projects.sample
    next unless project

    start_time = Faker::Time.between(from: 30.days.ago, to: Time.current)
    duration = rand(15..480) # 15 minutes to 8 hours

    time_log = TimeLog.create!(
      start_time: start_time,
      end_time: start_time + duration.minutes,
      duration_minutes: duration,
      description: Faker::Lorem.sentence,
      billable: [ true, false ].sample,
      hourly_rate: project.hourly_rate,
      user: user,
      project: project,
      issue: project.issues.sample
    )
  end

  puts "  ⏱️  Created time logs for: #{user.name}"
end

puts "🎉 Seed data creation completed!"
puts "📊 Summary:"
puts "  - Organizations: #{Organization.count}"
puts "  - Teams: #{Team.count}"
puts "  - Users: #{User.count}"
puts "  - Clients: #{Client.count}"
puts "  - Projects: #{Project.count}"
puts "  - Issues: #{Issue.count}"
puts "  - Time Logs: #{TimeLog.count}"
puts "  - Documents: #{Document.count}"
puts "  - Addresses: #{Address.count}"
puts ""
puts "🔑 Test User Login Credentials (password: password123):"
puts ""
puts "  🔧 System Admin:"
puts "    - admin@hourbench.com (System Admin)"
puts ""
puts "  🏢 Organization Admins:"
puts "    TechSolutions Inc:"
puts "      - alice.johnson@techsolutions.com (Alice Johnson)"
puts "      - bob.wilson@techsolutions.com (Bob Wilson)"
puts "      - carol.davis@techsolutions.com (Carol Davis)"
puts "    Creative Agency:"
puts "      - luna.rodriguez@creative.com (Luna Rodriguez)"
puts "      - max.thompson@creative.com (Max Thompson)"
puts "      - nina.patel@creative.com (Nina Patel)"
puts "    StartupCorp:"
puts "      - victor.chang@startup.com (Victor Chang)"
puts "      - wendy.foster@startup.com (Wendy Foster)"
puts ""
puts "  👥 Team Admins:"
puts "    TechSolutions Inc:"
puts "      - david.brown@techsolutions.com (David Brown - Development Team)"
puts "      - eva.martinez@techsolutions.com (Eva Martinez - QA Team)"
puts "      - frank.miller@techsolutions.com (Frank Miller - Development Team)"
puts "    Creative Agency:"
puts "      - oscar.kim@creative.com (Oscar Kim - Design Team)"
puts "      - paula.garcia@creative.com (Paula Garcia - Marketing Team)"
puts "      - quinn.adams@creative.com (Quinn Adams - Design Team)"
puts "    StartupCorp:"
puts "      - xavier.bell@startup.com (Xavier Bell - Product Team)"
puts "      - yuki.tanaka@startup.com (Yuki Tanaka - Product Team)"
puts ""
puts "  👤 Regular Users:"
puts "    TechSolutions Inc:"
puts "      - grace.lee@techsolutions.com (Grace Lee - Development Team)"
puts "      - henry.taylor@techsolutions.com (Henry Taylor - Development Team)"
puts "      - ivy.chen@techsolutions.com (Ivy Chen - QA Team)"
puts "      - jack.smith@techsolutions.com (Jack Smith - QA Team)"
puts "    Creative Agency:"
puts "      - ruby.white@creative.com (Ruby White - Design Team)"
puts "      - sam.johnson@creative.com (Sam Johnson - Marketing Team)"
puts "      - tina.lopez@creative.com (Tina Lopez - Design Team)"
puts "      - uma.singh@creative.com (Uma Singh - Marketing Team)"
puts "    StartupCorp:"
puts "      - zoe.clark@startup.com (Zoe Clark - Product Team)"
puts "      - alex.rivera@startup.com (Alex Rivera - Product Team)"
puts ""
puts "  🆓 Freelancers:"
puts "    - blake.freeman@freelance.com (Blake Freeman)"
puts "    - casey.jordan@freelance.com (Casey Jordan)"
puts "    - drew.morgan@freelance.com (Drew Morgan)"
puts ""
puts "💡 To enable quick login in development, set SHOW_TEST_CREDENTIALS=true"
