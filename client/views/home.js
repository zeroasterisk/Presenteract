Template.home.helpers({
  decks: function() {
    return Decks.find({ isFindable: true, isOpen: true }, { sort: { created: 1 } });
  },
  createdNice: function() {
    return moment(this.created).fromNow();
  }
});

