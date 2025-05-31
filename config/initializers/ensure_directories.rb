# Ensure necessary directories exist for SQLite in production
Rails.application.config.after_initialize do
  if Rails.env.production?
    # Make sure DB directory exists
    FileUtils.mkdir_p(Rails.root.join('db'))
    
    # Make sure storage directories exist
    FileUtils.mkdir_p(Rails.root.join('storage'))
    
    # Make sure tmp directories exist
    FileUtils.mkdir_p(Rails.root.join('tmp', 'pids'))
    FileUtils.mkdir_p(Rails.root.join('tmp', 'cache'))
    FileUtils.mkdir_p(Rails.root.join('tmp', 'sockets'))
    
    # Set proper permissions
    FileUtils.chmod_R(0755, Rails.root.join('db'))
    FileUtils.chmod_R(0755, Rails.root.join('storage'))
    FileUtils.chmod_R(0755, Rails.root.join('tmp'))
    
    Rails.logger.info "Directory structure initialized for production environment"
  end
end
