Meteor.startup(function() {
  Deps.autorun(function() {
    if (Meteor.Router.page() != 'deckView') {
      return false;
    }
    var deck = Decks.findOne(Session.get('deckId'));
    if (! (_.isObject(deck) && _.isString(deck.slideId) && deck.slideId.length)) {
      console.log('autorun slideView - no slide', deck);
      return false;
    }
    console.log('autorun slideView - slide set', deck);
    return true;
  });
});
Template.slideView.events({
  'click .setSlide': function(event) {
    Decks.update({_id: this.deckId}, { $set: { slideId: this._id } });
    return false;
  }
});
Template.slideView.helpers({
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
  'poll': function() {
    return Polls.findOne({ slideId: this._id });
  },
  'pollTakeable': function() {
    var poll = Polls.findOne( this._id );
    if (! (_.isObject(poll) && _.has(poll, '_id'))) {
      return false;
    }
    var answerCount = Answers.find({ pollId: poll._id, serverSessionId: Meteor.getServerSessionId() }).count();
    if (answerCount > 0) {
      return false;
    }
    if (Session.get('pollViewResults') == 1) {
      return false;
    }
    return true;
  },
});

