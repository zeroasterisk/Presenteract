Answers = new Meteor.Collection("answers");

if (Meteor.isServer) {
  Answers.allow({
    insert: function(userId, poll) {
      return false; // done with method
    },
    update: function (userId, answer, fields, modifier) {
      var poll = Polls.findOne(answer.pollId);
      if (!_.isObject(poll)) {
        return false;
      }
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    },
    remove: function (userId, answer) {
      var poll = Polls.findOne(answer.pollId);
      if (!_.isObject(poll)) {
        return false;
      }
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    }
  });
}


