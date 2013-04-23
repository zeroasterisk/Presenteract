Template.home.helpers({
  decks: function() {
    return Decks.find({ isFindable: true }, { sort: { isOpen: 1 } });
  },
  createdNice: function() {
    return moment(this.created).fromNow();
  }
});

