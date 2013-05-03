Template.deckView.events({
  'click .setSlide': function(event) {
    Decks.update({_id: this.deckId}, { $set: { slideId: this._id } });
    return false;
  }
});
Template.deckView.helpers({
  'deck': function() {
    return Decks.findOne(Session.get('deckId'));
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
})
