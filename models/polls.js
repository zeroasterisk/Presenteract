Polls = new Meteor.Collection("polls");

if (Meteor.isServer) {
  Polls.allow({
    insert: function(userId, poll) {
      return false; // done with method
    },
    update: function (userId, poll, fields, modifier) {
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    },
    remove: function (userId, poll) {
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    }
  });
}
