require "bundler"
Bundler.setup

load 'jasmine/tasks/jasmine.rake'


task :build do
  require "sprockets"
  environment = Sprockets::Environment.new
  environment.append_path 'src'
  environment.append_path 'vendor'
  environment["frabjous"].write_to("build/frabjous.js")
end