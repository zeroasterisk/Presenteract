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
    var deck = Decks.findOne(deckId);
    if (!_.isObject(deck) || deck.owner != Meteor.userId()) {
      throw new Meteor.Error(422, 'Can not create slide');
      return false;
    }
    var count = Slides.find({ deckId: deckId }).count();
    return Slides.insert({
      deckId: deckId,
      created: moment().utc().format(),
      order: count,
      title: 'Slide #' + (count + 1),
      short: '',
      layout: 'a',
      header: '',
      body: '',
      thumb: '', //?
    });
  },

  // new poll
  newPoll: function(slideId) {
    var slide = Slides.findOne(slideId);
    if (!_.isObject(slide)) {
      throw new Meteor.Error(422, 'Can not create poll, missing slide');
      return false;
    }
    var deck = Decks.findOne(slide.deckId);
    if (!_.isObject(deck) || deck.owner != Meteor.userId()) {
      throw new Meteor.Error(422, 'Can not create slide, permissions on deck');
      return false;
    }
    var deckId = deck._id;
    var pollId = Polls.insert({
      slideId: slide._id,
      deckId: deckId,
      created: moment().utc().format(),
      title: 'Poll',
      type: 'radio',
      short: '',
    });
    if (! (_.isString(pollId) && pollId.length)) {
      throw new Meteor.Error(422, 'Unable to create slide, unknown failure');
    }
    PollOptions.insert( {id: 'A', text: 'option number one', pollId: pollId, deckId: deckId, color: 'A4C400'} );
    PollOptions.insert( {id: 'B', text: 'option number two', pollId: pollId, deckId: deckId, color: '60A917'} );
    PollOptions.insert( {id: 'C', text: 'option number three', pollId: pollId, deckId: deckId, color: '008A00'} );
    PollOptions.insert( {id: 'D', text: 'option number four', pollId: pollId, deckId: deckId, color: '00ABA9'} );
    return pollId;
  },

  newPollOption: function(pollId) {
    var poll = Polls.findOne(pollId);
    if (!_.isObject(poll)) {
      throw new Meteor.Error(422, 'Can not create pollOption, missing poll');
      return false;
    }
    var deck = Decks.findOne(poll.deckId);
    if (!_.isObject(deck) || deck.owner != Meteor.userId()) {
      throw new Meteor.Error(422, 'Can not create pollOption, permissions on deck');
      return false;
    }
    var deckId = deck._id;
    var pollOptionsCount = PollOptions.find({ pollId: pollId }).count();
    var id = PollOptions.ids[pollOptionsCount].value;
    console.log( {id: id, text: 'new option', pollId: pollId, deckId: deckId} );
    return PollOptions.insert( {id: id, text: 'new option', pollId: pollId, deckId: deckId} );
  },

  delPoll: function(pollId) {
    if (! (_.isString(pollId) && pollId.length)) {
      throw new Meteor.Error(422, 'Can no delete poll ' + pollId);
    }
    var poll = Polls.findOne(pollId);
    if (! (_.isObject(poll) && _.has(poll, 'deckId'))) {
      throw new Meteor.Error(422, 'Can no delete poll ' + pollId);
    }
    var deck = Decks.findOne(poll.deckId);
    if (!_.isObject(deck) || deck.owner != Meteor.userId()) {
      throw new Meteor.Error(422, 'Can not delete poll, permissions on deck');
      return false;
    }
    return Polls.remove({_id: pollId});
  },

  delPollOption: function(pollOptionId) {
    if (! (_.isString(pollOptionId) && pollOptionId.length)) {
      throw new Meteor.Error(422, 'Can no delete pollOption ' + pollOptionId);
    }
    var pollOption = PollOptions.findOne(pollOptionId);
    if (! (_.isObject(pollOption) && _.has(pollOption, 'deckId'))) {
      throw new Meteor.Error(422, 'Can no delete pollOption ' + pollOptionId);
    }
    var deck = Decks.findOne(pollOption.deckId);
    if (!_.isObject(deck) || deck.owner != Meteor.userId()) {
      throw new Meteor.Error(422, 'Can not delete pollOption, permissions on deck');
      return false;
    }
    return PollOptions.remove({_id: pollOptionId});
  },



  // this method is defined on both the client and the server
  //   this is done to demonstrate that a method can "run" on the client
  //   but the real work is done on the server, the client assumes it will
  //   work the same on the server, but if not, it gets back the information
  //   from the server and changes the client's (assumed) state
  // answer a poll
  answer: function(data) {

    // validate:
    //   https://atmosphere.meteor.com/package/validation
    //   https://github.com/oortcloud/atmosphere/blob/master/app/server/methods.js#L17
    var errors = _.validate(data, [

      _.presenceOf   ('pollId'),
      _.lengthOf     ('pollId', { gte: 1, lte: 32 }),
      _.presenceOf   ('deckId'),
      _.lengthOf     ('deckId', { gte: 1, lte: 32 }),
      _.presenceOf   ('pollOptionId'),
      _.lengthOf     ('pollOptionId', { gte: 1, lte: 32 }),
      _.presenceOf   ('serverSessionId'),
      _.lengthOf     ('serverSessionId', { gte: 1, lte: 32 }),

      ]);

    var errorMessages = _.flatErrors(errors);

    console.log('answer', data, errors);

    if (errorMessages.length > 0) {
      throw new Meteor.Error(422, "Answer could not be saved", errorMessages);
    }

    // permissions
    var poll = Polls.findOne(data.pollId);
    if (!_.isObject(poll)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing poll');
    }
    var deck = Decks.findOne(poll.deckId);
    if (!_.isObject(deck)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing deck');
    }
    if (!deck.isOpen) {
      throw new Meteor.Error(422, 'Can not answer poll, deck not open');
    }
    var pollOption = PollOptions.findOne(data.pollOptionId);
    if (!_.isObject(pollOption)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing pollOption');
    }
    var serverSession = ServerSessions.findOne(data.serverSessionId);
    if (!_.isObject(serverSession)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing ServerSession');
    }
    var existingAnswer = Answers.findOne({
      deckId: deck._id,
      pollId: poll._id,
      serverSessionId: serverSession._id,
    });
    if (_.isObject(existingAnswer)) {
      console.log("Update answer", data, existingAnswer);
      return Answers.update(existingAnswer._id, {
        pollOptionId: pollOption._id,
             userId: Meteor.userId(),
             modified: moment().utc().format(),
      });
    }
    console.log("Inserting answer", data);
    return Answers.insert({
      deckId: deck._id,
      pollId: poll._id,
      pollOptionId: pollOption._id,
      serverSessionId: serverSession._id,
      userId: Meteor.userId(),
      created: moment().utc().format(),
    });
  },
});
