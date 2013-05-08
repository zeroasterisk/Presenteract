Template.deckView.events({
  'click .setSlide': function(event) {
    var id = _(event).eventGetA().data('id');
    console.log('setSlide', id, Session.get('deckId'), event, _(event).eventGetA());
    Decks.update({ _id: Session.get('deckId') }, { $set: { slideId: id } });
    return false;
  }
});
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
  },
  'prevSlideId': function() {
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
  },
  'nextSlideId': function() {
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
  },
  'isOwner': function() {
    var deck = Decks.findOne(Session.get('deckId'));
    return (deck.owner == Meteor.userId())
  }
})
