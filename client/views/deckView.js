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
    return Slides.find({deckId: Session.get('deckId')}, { sort: { order: 1 } }).fetch();
  },
  'slide': function() {
    var deck = Decks.findOne(Session.get('deckId'));
    if (! (_.isString(deck.slideId) && deck.slideId.length)) {
      return Slides.findOne({deckId: Session.get('deckId')}, { sort: { order: 1 } });
    }
    return Slides.findOne(deck.slideId);
  },
  'currentSlideInt': function() {
    var deck = Decks.findOne(Session.get('deckId'));
    if (! (_.isString(deck.slideId) && deck.slideId.length)) {
      return 1;
    }
    var slides = Slides.find(
        {deckId: Session.get('deckId')},
        { sort: { order: 1 }, fields: { _id: 1 }}
        ).fetch();
    for (var i = 0; i < slides.length; i++) {
      if (slides[i]._id == deck.slideId) {
        return i + 1;
      }
    }
    return 1;
  }
});
// implemented as directly callable methods on the template
//   useful for self-referencing
Template.deckView.prevSlideId = function() {
  var deck = Decks.findOne(Session.get('deckId'));
  if (! (_.isObject(deck) && _.has(deck, 'slideId') && _.isString(deck.slideId) && deck.slideId.length)) {
    return '';
  }
  var slides = Slides.find(
      {deckId: Session.get('deckId')},
      { sort: { order: 1 }, fields: { _id: 1 }}
      ).fetch();
  for (var i = 0; i < slides.length; i++) {
    if (slides[i]._id == deck.slideId) {
      if (i < 1) {
        return '';
      }
      return slides[(i - 1)]._id;
    }
  }
  return '';
};
Template.deckView.nextSlideId = function() {
  var deck = Decks.findOne(Session.get('deckId'));
  if (! (_.isObject(deck) && _.has(deck, 'slideId') && _.isString(deck.slideId) && deck.slideId.length)) {
    return '';
  }
  var slides = Slides.find(
      {deckId: Session.get('deckId')},
      { sort: { order: 1 }, fields: { _id: 1 }}
      ).fetch();
  for (var i = 0; i < slides.length; i++) {
    if (slides[i]._id == deck.slideId) {
      if ((i + 1) == slides.length) {
        return '';
      }
      return slides[(i + 1)]._id;
    }
  }
  return '';
};
Template.deckView.isOwner = function() {
  var deck = Decks.findOne(Session.get('deckId'));
  return (deck.owner == Meteor.userId())
};
// stand alone callable version of setSlide event
//   can be triggered via keyboard nav
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
