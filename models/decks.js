Decks = new Meteor.Collection("decks");

// This checks to ensure we are only able
// to "set" this allow on the server
if (Meteor.isServer) {
  // allow/deny rules on the collection
  // control what a client can do to it
  Decks.allow({
    // can a client do an insert?
    insert: function(userId, deck) {
      // nope... you've gotta use a "method call"
      //   server/methods.js -> Meteor.call('newDeck', data)
      return false;
    },
    // can a client do an update/edit?
    update: function (userId, deck, fields, modifier) {
      // this method is passed in the userId (part of accounts)
      // it is also passed in the full "deck" record from the collection
      // so we can compare, and only if "you are the owner" can you edit
      return (deck.owner === userId); // boolean
    },
    // can a client do a remove/delete?
    remove: function (userId, deck) {
      // same as update, only if owner
      return (deck.owner === userId); // boolean
    }
  });
}

// Sometimes we need to know what the numerical index is for the current slide
Decks.slideIndex = function(deckId, slideId) {
    var deck = Decks.findOne(deckId);
    if (! (_.isString(deck.slideId) && deck.slideId.length)) {
      // invalid deck, return 1
      return 1;
    }
    if (! (_.isString(slideId) && slideId.length)) {
      // no slideId passed in, use deck.slideId
      slideId = deck.slideId;
    }
    // get all slides
    var slides = Slides.find(
        { deckId: deck._id },
        { sort: { order: 1 }, fields: { _id: 1 }}
        ).fetch();
    // can't use for loops here
    //   http://stackoverflow.com/questions/15494390/metor-blade-template-throws-second-landmark-in-same-branch-exception-in-for-lo
    var i = 0, slideIndex = 1;
    _.each(slides, function(slide) {
      i++;
      if (slide._id == deck.slideId) {
        slideIndex = i;
      }
    });
    return slideIndex;
};
