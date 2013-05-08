Template.decksMine.helpers({
  decks: function() {
    return Decks.find({ owner: Meteor.userId() });
  },
  createdNice: function() {
    return moment(this.created).fromNow();
  },
  slidesCount: function() {
    return Slides.find({ deckId: this._id }).count();
  }
});


