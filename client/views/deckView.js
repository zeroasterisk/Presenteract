Template.deckView.events({
  // <event> <selector for event trigger>
  'click .setSlide': function(event) {
    // this takes the <event> and looks up the "closest" <a>
    //   since we could click on the <a> or on an <i> inside it
    //     then we get the "data-id" property from it
    var slideIdToSet = _(event).eventGetA().data('id');
    // now, we do a basic update call on the Decks collection
    Decks.update(
      // what do we want to update?  the current deck
      { _id: Session.get('deckId') },
      // what do we want to set?  just the "slideId" field
      { $set: { slideId: slideIdToSet } }
      );
    // What about security?  Isn't this running on the client?
    //   yes indeed, that's handled in models/decks.js
    //     Decks.allow({update: ... "only if you are the owner"
    return false;
  }
});
// implemented as "helpers"
Template.deckView.helpers({
  'deck': function() {
    return Decks.findOne(Session.get('deckId'));
  },
  'slidesCount': function() {
    return Slides.find({deckId: Session.get('deckId')}).count();
  },
  'slides': function() {
    return Slides.forDeck(Session.get('deckId'));
  },
  'slide': function() {
    var deck = Decks.findOne(Session.get('deckId'));
    if (! (_.isString(deck.slideId) && deck.slideId.length)) {
      return Slides.findOne({deckId: Session.get('deckId')}, { sort: { order: 1 } });
    }
    return Slides.findOne(deck.slideId);
  },
  'currentSlideInt': function() {
    return Decks.slideIndex(Session.get('deckId'));
  }
});


// implemented as directly callable methods on the template
//   useful for self-referencing
Template.deckView.prevSlideId = function() {
  var currentIndex = Decks.slideIndex(Session.get('deckId'));
  if (currentIndex < 2) {
    return '';
  }
  var slides = Slides.forDeck(Session.get('deckId'));
  return slides[(currentIndex - 2)]._id;
};
Template.deckView.nextSlideId = function() {
  var currentIndex = Decks.slideIndex(Session.get('deckId'));
  var slides = Slides.forDeck(Session.get('deckId'));
  if (currentIndex >= slides.length) {
    return '';
  }
  return slides[currentIndex]._id;
};
Template.deckView.isOwner = function() {
  var deck = Decks.findOne(Session.get('deckId'));
  return (deck.owner == Meteor.userId())
};
// stand alone callable version of setSlide event
//   can be triggered via keyboard nav
//   only works if .setSlideNext is visible & has data('id')
Template.deckView.setSlideNext = function() {
  if (!$(".setSlideNext").is(":visible")) {
    return false;
  }
  var slideIdToSet = $('.setSlideNext').data('id');
  Decks.update(
      { _id: Session.get('deckId') },
      { $set: { slideId: slideIdToSet } }
      );
}
// stand alone callable version of setSlide event
//   can be triggered via keyboard nav
//   only works if .setSlidePrev is visible & has data('id')
Template.deckView.setSlidePrev = function() {
  if (!$(".setSlidePrev").is(":visible")) {
    return false;
  }
  var slideIdToSet = $('.setSlidePrev').data('id');
  Decks.update(
      { _id: Session.get('deckId') },
      { $set: { slideId: slideIdToSet } }
      );
}
// initialize the keyboard nav setup for Mousetrap
Template.deckView.setupKeyboardNav = function() {
  if (this.keyboardNav) {
    return true;
  }
  this.keyboardNav = true;
  Mousetrap.bind('right', Template.deckView.setSlideNext);
  Mousetrap.bind('space', Template.deckView.setSlideNext);
  Mousetrap.bind('left', Template.deckView.setSlidePrev);
};
// when this template is rendered (or re-rendered)
Template.deckView.rendered = function() {
  // ensure the keyboard nav is setup
  Template.deckView.setupKeyboardNav();
  // ensure the keyboard is not paused (see Router, where it's paused on other pages)
  Mousetrap.unpause();
}
