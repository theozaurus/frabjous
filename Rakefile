require "bundler"
Bundler.setup

require "jasmine"
require "jasmine-sprockets"

load 'jasmine/tasks/jasmine.rake'

task :default => "jasmine:ci"

task :build do
  require "sprockets"
  environment = Sprockets::Environment.new
  environment.append_path 'src'
  environment.append_path 'vendor'
  environment["frabjous"].write_to("build/frabjous.js")
end