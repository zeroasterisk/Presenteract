// publish the currentUser (needed?)
Meteor.publish('currentUser', function() {
  return Meteor.users.find(this.userId);
});

// publish a limited set of publicly available decks
// TODO: limit further, limit fields, limit count
Meteor.publish('decksPublic', function() {
  return Decks.find({
    'isFindable': true,
    // TODO: filter by location
    // TODO: limit fields (limit scope)
  })
});

// Single deck + slides
Meteor.publish('deckSelected', function(deckId) {
  return [
    Decks.find({_id: deckId}),
    Slides.find({deckId: deckId})
  ];
});

// Multiple decks, based on the logged in userId
Meteor.publish('decksForUser', function(userId) {
  return Decks.find({owner: userId});
});



