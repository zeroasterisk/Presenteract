// publish the currentUser (needed?)
Meteor.publish('currentUser', function() {
  return Meteor.users.find(this.userId);
});

// publish a limited set of publicly available decks
// TODO: limit further, limit fields, limit count
Meteor.publish('decksPublic', function() {
  return Decks.find({
    'isFindable': true,
    'isOpen': true,
    // TODO: filter by location
    // TODO: limit fields (limit scope)
  })
});

// Single deck + slides
Meteor.publish('deckSelected', function(deckId) {
  return [
    Decks.find({_id: deckId}),
    Slides.find({deckId: deckId}),
    Polls.find({deckId: deckId}),
    PollOptions.find({deckId: deckId}),
    Answers.find({deckId: deckId})
  ];
});

// Multiple decks, based on the logged in userId
//   Also get all the slides for the decks which are found for the user
Meteor.publish('decksForUser', function(userId) {
  var decks = Decks.find({owner: userId}, {fields: {_id: 1}}).fetch();
  var deckIds = _.map(decks, function (deck) { return deck._id });
  return [
    Decks.find({owner: userId}),
    Slides.find({deckId: { $in: deckIds }})
  ];
});


