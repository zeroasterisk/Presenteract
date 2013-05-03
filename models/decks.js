Decks = new Meteor.Collection("decks");

if (Meteor.isServer) {
  Decks.allow({
    insert: function(userId, deck) {
      return false; // done with method
    },
    update: function (userId, deck, fields, modifier) {
      return (deck.owner === userId);
    },
    remove: function (userId, deck) {
      return (deck.owner === userId);
    }
  });
}

