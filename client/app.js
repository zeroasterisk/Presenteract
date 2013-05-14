// subscriptions & basic Meteor.startup code.

// subscriptions to published collections
//   this is how we "get" data from the server to the client

// Start off by saying that we have not yet Loaded the Decks data
Session.set('DecksLoaded', false);
// call the "Meteor.subscribe()" method
//   pass in the name for the publish we setup
Meteor.subscribe('decksPublic', function() {
  // the collection data has loaded, update our Session
  //   this acts as a status, so we know if we have data ready
  Session.set('DecksLoaded', true);
});

// not yet loaded slides data
Session.set('SlidesLoaded', false);
// this is tricky...
//   we want to automaitcaly re-run the following code
//   when any of the dependancies are changed
Deps.autorun(function() {
  //
  // it's not totally clear,
  //   but Session.get('deckId') is a dependancy
  //   just because we are using it...
  // we do the same Meteor.subscribe() as above
  //   but this time, we pass in an argument...
  //   the server publish method also is setup with this argument
  //   so we can subscribe to all collections related to this deckId
  //   and if the Session deckId changes... we re-subsribe
  Meteor.subscribe('deckSelected', Session.get('deckId'), function() {
    // data loaded status
    Session.set('SlidesLoaded', true);
  });

  // Session.get('slideId') is another dependancy for autorun
  // we do the same Meteor.subscribe() as above
  Meteor.subscribe('pollsForSlide', Session.get('slideId'), function() {
    // data loaded status
    Session.set('PollsLoaded', true);
  });

  // Meteor.userId() is another dependancy
  // we do the same Meteor.subscribe() as above
  Meteor.subscribe('decksForUser', Meteor.userId(), function() {
    // nothing currently cares if decksForUser is loaded, so no session status
    // but we could trigger anything here, once it is loaded
  });

});

// any other clientside application startup code could go here

