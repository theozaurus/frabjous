Frabjous [![Build status](https://secure.travis-ci.org/theozaurus/frabjous.png)](http://travis-ci.org/theozaurus/frabjous)
========

Frabjous aims to provide a layer of abstraction for Javascript that deals with managing an XMPP connection. It is designed to create and parse XMPP stanzas to turn them into objects like Messages, Users, MUC rooms, Pubsub Nodes. This is so programmers can get on with writing apps on top of these constructs, rather than getting bogged down in XML. [Ember](http://emberjs.com) is used to create this interface.

Just as XMPP standards for "extensible messaging and presence protocol", Frabjous allows additional models to be built, or existing ones expanded as new XEP's are created.

Tests
=====

All of the tests are written in [Jasmine](https://jasmine.github.io/). [Sprockets](https://github.com/sstephenson/sprockets) is used to describe dependencies between the files. To run the tests, you will first need to install [Ruby](http://ruby-lang.org) and [Bundler](http://gembundler.com/). Once you have this:

    $ bundle install
    $ rake jasmine
    
Open your browser to [http://localhost:8888](http://localhost:8888)

If you want to run the tests directly in the console just type:

    $ rake jasmine:ci
    /Users/theo/.rvm/rubies/ruby-1.9.3-p0/bin/ruby -S rspec spec/javascripts/support/jasmine_runner.rb --colour --format progress
    [2012-03-15 15:46:50] INFO  WEBrick 1.3.1
    [2012-03-15 15:46:50] INFO  ruby 1.9.3 (2011-10-30) [x86_64-darwin11.1.0]
    [2012-03-15 15:46:50] INFO  WEBrick::HTTPServer#start: pid=39919 port=63714
    Waiting for jasmine server on 63714...
    jasmine server started.
    Waiting for suite to finish in browser ...
    ..........................................
    
Or you can check the current status of master using [Travis](http://travis-ci.org/#!/theozaurus/frabjous)

