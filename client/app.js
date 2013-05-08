// subscriptions, basic Meteor.startup code.

Session.set('DecksLoaded', false);
Meteor.subscribe('decksPublic', function() {
  // collection loaded
  Session.set('DecksLoaded', true);
});

Session.set('SlidesLoaded', false);
Deps.autorun(function () {

  Meteor.subscribe('deckSelected', Session.get('deckId'), function() {
    Session.set('SlidesLoaded', true);
  });

  Meteor.subscribe('decksForUser', Meteor.userId(), function() {
  });

  Meteor.subscribe('pollsForSlide', Session.get('slideId'), function() {
    Session.set('PollsLoaded', true);
  });
});


