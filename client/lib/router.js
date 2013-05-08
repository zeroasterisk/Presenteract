(function() {

  deckView = function(deckId, slideId) {
    if (! (_.isString(deckId) && deckId.length)) {
      return 'decks';
    }
    Session.set('deckId', deckId);
    if (! (_.isString(slideId) && slideId.length)) {
      // no slide provided, default to first
      var firstSlide = Slides.find({deckId: deckId}, {sort: { order:  1 } }).fetch()[0];
      if (!_.isObject(firstSlide)) {
        Notify.alert('Deck has no slides');
        return 'decks';
      }
      slideId = firstSlide._id;
    }
    Session.set('slideId', slideId);
    return 'deckView';
  };

  deckEdit = function(deckId) {
    if (! (_.isString(deckId) && deckId.length)) {
      return 'decks';
    }
    var deck = Decks.findOne({ _id: deckId});
    if (! (_.isObject(deck) && deck.owner == Meteor.userId())) {
      Notify.alert('Access denied, you are not the owner');
      return 'decks';
    }
    Session.set('deckId', deckId);
    return 'deckEdit';
  };

  deckEditSlide = function(deckId, slideId) {
    if (! (_.isString(deckId) && deckId.length)) {
      return 'decks';
    }
    Session.set('deckId', deckId);
    if (! (_.isString(slideId) && slideId.length)) {
      return 'deckEdit';
    }
    Session.set('slideId', slideId);
    return 'deckEditSlide';
  };

  Meteor.Router.add({
    '/': 'home',
    '/about': 'about',
    '/decks': 'decks',
    '/decksMine': 'decksMine',
    '/deck/:deckId': deckView,
    '/deck/:deckId/:slideId': deckView,
    '/deckNew': 'deckNew',
    '/deckEdit/:deckId': deckEdit,
    '/deckEditSlide/:deckId/:slideId': deckEditSlide,
  });

  Meteor.Router.filters({

    requireLogin: function(page) {
      if (Meteor.loggingIn()) {
        return 'loading';
      } else if (Meteor.user()) {
        return page;
      }
      return 'user_signin';
    },

    // require the collections
    requireDecks: function(page) {
      if (Session.get('DecksLoaded')) {
        return page;
      }
      return 'loading';
    },

    // require the collections
    requireSlides: function(page) {
      if (Session.get('SlidesLoaded')) {
        return page;
      }
      return 'loading';
    }

  });

  Meteor.Router.filter('requireDecks', {only: ['decks', 'deck', 'deckEdit']});
  Meteor.Router.filter('requireSlides', {only: ['deck', 'deckEdit']});

  Meteor.startup(function() {
    Meteor.autorun(function() {
      // grab the current page from the router, so this re-runs every time it changes
      Meteor.Router.page();
      if (Meteor.Router.page() === "loading") {
        console.log('------ LOADING ------');
        return;
      }
      console.log('------ '+Meteor.Router.page()+' ------');
      Session.set('page', Meteor.Router.page());
      Session.set('requestTimestamp', new Date());
      // currentScroll stores the position of the user in the page
      Session.set('currentScroll', null);
      document.title = Meteor.Router.page();
      $('body').css('min-height','0');
      // always hide the modal-backdrop on navigation (back)
      $('.modal-backdrop').hide('fast');
      // log this request
      analyticsRequest();
      // if there are any pending events, log them too
      if (eventBuffer = Session.get('eventBuffer')) {
        _.each(eventBuffer, function(e){
          console.log('in buffer: ', e);
          trackEvent(e.event, e.properties);
        });
      } else {
        Notify.clear();
        console.log('------ Loaded --------');
      }
    });
  });
}());

