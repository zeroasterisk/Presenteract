Template._editDeckBar.events({
  // open a deck, done on server, as a call example
  //   this relies on Meteor.methods() defined in server/methods.js
  'click .deckOpen': function(event) {
    var deckId = _(event).eventGetA().data('id');
    var deck = Decks.findOne({ _id: deckId});
    if (! (_.isObject(deck) && deck.owner == Meteor.userId())) {
      Notify.alert('Access denied, you are not the owner');
      return false;
    }
    Meteor.call('deckOpen', deckId);
      return false;
  },
  // close a deck, done on server, as a call example
  'click .deckClose': function(event) {
    var deckId = _(event).eventGetA().data('id');
    var deck = Decks.findOne({ _id: deckId});
    if (! (_.isObject(deck) && deck.owner == Meteor.userId())) {
      Notify.alert('Access denied, you are not the owner');
      return false;
    }
    Meteor.call('deckClose', deckId);
      return false;
  },
  // make findable, done on client->server, as an example
  //   this relies on Decks.allow defined in the models/decks.js
  'click .deckFindable': function(event) {
    var deckId = _(event).eventGetA().data('id');
    var deck = Decks.findOne({ _id: deckId});
    if (! (_.isObject(deck) && deck.owner == Meteor.userId())) {
      Notify.alert('Access denied, you are not the owner');
      return false;
    }
    Decks.update( { _id: deckId }, { $set: { isFindable: true } } );
    return false;
  },
  // make not-findable, done on client->server, as an example
  //   this relies on Decks.allow defined in the models/decks.js
  'click .deckHide': function(event) {
    var deckId = _(event).eventGetA().data('id');
    var deck = Decks.findOne({ _id: deckId});
    console.log('deckHide', event, deckId, deck, Meteor.userId());
    if (! (_.isObject(deck) && deck.owner == Meteor.userId())) {
      Notify.alert('Access denied, you are not the owner');
      return false;
    }
    Decks.update( { _id: deckId }, { $set: { isFindable: false } } );
    return false;
  },

});

Template._editDeckBar.helpers({
  decks: function() {
    return Decks.find({ owner: Meteor.userId() });
  },
  createdNice: function() {
    return moment(this.created).fromNow();
  },
  slidesCount: function() {
    Session.set('slideIdAlt', this._id);
    return Slides.find({ deckId: this._id }).count();
  }
});

Template._editDeckBar.rendered = function() {
  // setup which changes as slides re-render/change
  if (_.isObject(Template.decksMine.autorunner)) {
    Template._editDeckBar.autorunner.stop();
  }
  Template._editDeckBar.autorunner = Deps.autorun(function() {
    var mydecks = Decks.find({ owner: Meteor.userId() }).count();
    if (mydecks == 0) {
      return false;
    }
    // setup in-place
    $('.eip').each(function(i, el) {
      $(el).editable({
        value: $(el).html(),
        url: function(params) {
          var d = new $.Deferred;
          var deck = {};
          deck[params.name] = params.value;
          console.log('editable', params, deck, _.isObject(deck));
          var updated = Decks.update({ _id: params.pk }, { $set: deck });
          console.log('editable-done', updated);
          return d.resolve();
        }
      });
    });
  });
};


