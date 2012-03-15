Frabjous
========

Frabjous aims to provide a layer of abstraction for Javascript that deals with managing an XMPP connection. It is designed to create and parse XMPP stanzas to turn them into objects like Messages, Users, MUC rooms, Pubsub Nodes. This is so programmers can get on with writing apps on top of these constructs, rather than getting bogged down in XML. [Ember](http://emberjs.com) is used to create this interface.

Just as XMPP standards for "extensible messaging and presence protocol", Frabjous allows additional models to be built, or existing ones expanded as new XEP's are created.

Tests
=====

All of the tests are written in [Jasmine](http://pivotal.github.com/jasmine/). [Sprockets](https://github.com/sstephenson/sprockets) is used to describe dependencies between the files. To run the tests, you will first need to install [Ruby](http://ruby-lang.org) and [Bundler](http://gembundler.com/). Once you have this:

    $ bundle install
    $ rake jasmine
    
Open your browser to [http://localhost:8888](http://localhost:8888)