Answers = new Meteor.Collection("answers");

if (Meteor.isServer) {
  Answers.allow({
    insert: function(userId, poll) {
      return false; // done with method
    },
    update: function (userId, answer, fields, modifier) {
      var poll = Polls.findOne(answer.pollId);
      if (!_.isObject(poll)) {
        return false;
      }
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    },
    remove: function (userId, answer) {
      var poll = Polls.findOne(answer.pollId);
      if (!_.isObject(poll)) {
        return false;
      }
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    }
  });
}


// this method is defined on both the client and the server
//   this is done to demonstrate that a method can "run" on the client
//   but the real work is done on the server, the client assumes it will
//   work the same on the server, but if not, it gets back the information
//   from the server and changes the client's (assumed) state
Meteor.methods({
  // answer a poll
  answer: function(data) {

    // validate:
    //   https://atmosphere.meteor.com/package/validation
    //   https://github.com/oortcloud/atmosphere/blob/master/app/server/methods.js#L17
    var errors = _.validate(data, [

      _.presenceOf   ('pollId'),
      _.lengthOf     ('pollId', { gte: 1, lte: 32 }),
      _.presenceOf   ('answerId'),
      _.lengthOf     ('answerId', { gte: 1, lte: 32 }),
      _.presenceOf   ('serverSessionId'),
      _.lengthOf     ('serverSessionId', { gte: 1, lte: 32 }),

      ]);

    var errorMessages = _.flatErrors(errors);

    if (errorMessages.length > 0) {
      throw new Meteor.Error(422, "Answer could not be saved", errorMessages);
    }

    // permissions

    var poll = Slides.findOne(data.pollId);
    if (!_.isObject(poll)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing poll');
      return false;
    }
    var deck = Decks.findOne(poll.deckId);
    if (!_.isObject(deck)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing deck');
      return false;
    }
    if (!deck.open) {
      throw new Meteor.Error(422, 'Can not answer poll, deck not open');
      return false;
    }
    var answer = Answers.findOne(data.answerId);
    if (!_.isObject(answer)) {
      throw new Meteor.Error(422, 'Can not answer poll, missing answer');
      return false;
    }

    if (Meteor.isServer) {
      var serverSession = ServerSessions.findOne(data.serverSessionId);
      if (!_.isObject(serverSession)) {
        throw new Meteor.Error(422, 'Can not answer poll, missing ServerSession');
        return false;
      }
    }

    // insert a created timetstamp (UTC, as string)
    data.created = moment().utc().format();

    // insert the user details
    data.userId = Meteor.userId();

    console.log("Inserting deck", deck);

    // TODO: test out adding nested documents (syntax)
    return Polls.update({_id: data.pollId}, { $set: { responses: data } });
  },
});
