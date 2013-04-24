// Meteor.method definitions


/* http://docs.meteor.com/#methods_header
 * Methods are remote functions that Meteor clients can invoke.
 *
 * These methods can be remotely executed from the client via:
 *   - Method.call('someMethod', arg1, argN, function callback(result){})
 *   - Method.apply('someMethod', [a1, aN], function callback(result){})
 */
Meteor.methods({

  // create a new deck
  deckNew: function(deck) {

    // validate:
    //   https://atmosphere.meteor.com/package/validation
    //   https://github.com/oortcloud/atmosphere/blob/master/app/server/methods.js#L17
    var errors = _.validate(deck, [

      // title
      _.presenceOf   ('title'),
      _.lengthOf     ('title', { gte: 4, lte: 64 }),

      // short
      _.presenceOf   ('short'),
      _.lengthOf     ('short', { gte: 4, lte: 512 }),

      // byline
      _.presenceOf   ('byline'),
      _.lengthOf     ('byline', { gte: 4, lte: 64 }),

      // Flags
      _.presenceOf   ('isFindable'),
      _.presenceOf   ('isAccountRequired'),
      _.presenceOf   ('isOpen')

      ]);

    var errorMessages = _.flatErrors(errors);

    if (errorMessages.length > 0) {
      throw new Meteor.Error(422, "Presentation could not be saved", errorMessages);
    }

    // insert a created timetstamp (UTC, as string)
    deck.created = moment().utc().format();

    // insert the user details
    deck.owner = Meteor.userId();

    console.log("Inserting deck", deck);

    return Decks.insert(deck);
  },

  // open a deck
  deckOpen: function(deckId) {
    return Decks.update(
        { _id: deckId, owner: Meteor.userId() },
        { $set: { isOpen: true } }
        );
  },

  // close a deck
  deckClose: function(deckId) {
    return Decks.update(
        { _id: deckId, owner: Meteor.userId() },
        { $set: { isOpen: false } }
        );
  },

  // create a new "blank" slide in deck
  newSlide: function(deckId) {
    var deck = Decks.findOne({ _id: deckId });
    if (deck.owner != Meteor.userId()) {
      Notify.error('Can not create slide');
      return false;
    }
    var count = Slides.find({ deckId: deckId }).count();
    return Slides.insert({
      deckId: deckId,
      created: moment().utc().format(),
      order: count,
      title: 'Slide #' + (count + 1),
      short: '',
      body: '',
      thumb: '',
      poll: [],
      responses: []
    });
  },




});
