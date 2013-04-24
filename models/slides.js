Slides = new Meteor.Collection("slides");

if (Meteor.isServer) {
  Slides.allow({
    insert: function(userId, slide) {
      return false; // done with method
    },
    update: function (userId, slide, fields, modifier) {
      var deck = Decks.findOne(slide.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    },
    remove: function (userId, slide) {
      var deck = Decks.findOne(slide.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    }
  });
}

// helpful methods for editing
// (allow will restrict functionality)

  // move slide up or down (switch order)
Slides.moveSlide = function(slideId, direction) {
  var slide = Slides.findOne(slideId);
  if (!_.isObject(slide)) {
    return false;
  }
  var deck = Decks.findOne({ _id: slide.deckId });
  if (deck.owner != Meteor.userId()) {
    Notify.error('Can not create slide');
    return false;
  }
  var initialOrder = slide.order;
  if (direction == 'up') {
    if (initialOrder < 1) {
      // at the top
      Notify.alert('Already at the top');
      return false;
    }
    // walk "up" by decreasing the order int
    var i = initialOrder - 1;
    while ( i >= 0 && !_.isObject(altSlide) ) {
      var altSlide = Slides.findOne({ deckId: deck._id, order: i });
      i--;
    }
  }
  if (direction == 'down') {
    var count = Slides.find({ deckId: deck._id }).count();
    if (initialOrder >= (count - 1)) {
      // at the bottom
      Notify.alert('Already at the bottom');
      return false;
    }
    // walk "down" by increasing the order int
    var i = initialOrder + 1;
    while ( i < count && !_.isObject(altSlide) ) {
      var altSlide = Slides.findOne({ deckId: deck._id, order: i });
      i++;
    }
  }
  if ( !_.isObject(altSlide) ) {
    // unable to find an altSlide to switch order with
    Notify.alert('Unable to move slide');
    return false;
  }
  // ok - toggle the order on each
  Slides.update(slide._id, { $set: { order: altSlide.order } });
  Slides.update(altSlide._id, { $set: { order: slide.order } });
  return true;
};
