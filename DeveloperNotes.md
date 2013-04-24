Install MeteorJS
--------------

    curl https://install.meteor.com | /bin/sh

On OSX or Linux, yeah... that's it...

On Windows?  Sorry guy, you're stuck in a VM for now


Create a new MeteorJS Project
--------------

    $ mrt create <projectname>
    $ cd <projectname>

Fire up Meteor... you know you want to

    $ mrt

Now browse to (http://localhost:3000/)[http://localhost:3000/]

yup.. hello world is all ready to go...


Add some "Smart Packages"
--------------

Look and see the official list from the CLI

    $ mrt list

Start on the "right foot" and remove the "insecure" and "autopublish" packages

    $ mrt remove insecure
    $ mrt remove autopublish

> Meteor also has a special "insecure mode" for quickly prototyping new applications. In insecure mode, if you haven't set up any allow or deny rules on a collection, then all users have full write access to the collection. This is the only effect of insecure mode. If you call allow or deny at all on a collection, even Posts.allow({}), then access is checked just like normal on that collection. New Meteor projects start in insecure mode by default. To turn it off just run $ meteor remove insecure.

And lets add some offical "packages", special sauce made easy

    $ mrt add jquery
    $ mrt add jquery-history
    $ mrt add d3
    $ mrt add less
    $ mrt add appcache
    $ mrt add underscore
    $ mrt add accounts-base
    $ mrt add accounts-google
    $ mrt add accounts-facebook
    $ mrt add accounts-twitter
    $ mrt add accounts-meetup
    $ mrt add accounts-ui
    $ mrt add bootstrap

And a few unofficial "packages" too, from [Atmosphere](https://atmosphere.meteor.com/) - you know, where meteors end up, yuk yuk

    $ mrt add router
    $ mrt add chartjs
    $ mrt add bootstrap-wysiwyg
    $ mrt add tour


Now lets re-organize our code
---------------

Taking suggestions from (the unofficial FAQ)[https://github.com/oortcloud/unofficial-meteor-faq#where-should-i-put-my-files] we can re-organize our files into a more comprehensive structure...

MeteorJS will work with the files in any organizational method... but it helps to give context to what you're working with, if they live in some sort of configuration.

    $ rm *.css
    $ rm *.html
    $ rm *.js
    $ mkdir -p client/views
    $ mkdir client/lib
    $ mkdir server
    $ mkdir public
    $ mkdir models
    $ mkdir lib
    $ echo 'Decks = new Meteor.Collection("decks");' > models/decks.js
    $ echo 'Slides = new Meteor.Collection("slides");' > models/slides.js
    $ touch server/methods.js
    $ touch server/publish.js
    $ touch client/subscribe.js
    $ touch client/app.js
    $ touch client/index.html
    $ touch client/index.js
    $ touch client/lib/router.js
    $ touch client/views/home.html
    $ touch client/views/home.js
    $ touch client/views/decks.html
    $ touch client/views/decks.js
    $ touch client/views/deckNew.html
    $ touch client/views/deckNew.js
    $ touch client/views/deckView.html
    $ touch client/views/deckView.js
    $ touch client/views/_slide.html
    $ touch client/views/_slide.js
    $ touch client/views/_poll.html
    $ touch client/views/_poll.js


Start Developing
----------------

    client/index.html

Setup the basic page layout, content to be supplied by other templates, coordinated via the router.

Note the seperate templates for header and footer aren't needed, but are nice to segment code.

Note the special `{{loginButtons}}` code?  That's our Automatic login functionality for Accounts.


