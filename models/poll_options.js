PollOptions = new Meteor.Collection("poll_options");

if (Meteor.isServer) {
  PollOptions.allow({
    insert: function(userId, poll) {
      return false; // done with method
    },
    update: function (userId, poll_option, fields, modifier) {
      var poll = Polls.findOne(poll_option.pollId);
      if (!_.isObject(poll)) {
        return false;
      }
      var deck = Decks.findOne(poll.deckId);
      if (!_.isObject(deck)) {
        return false;
      }
      return (deck.owner === userId);
    },
    remove: function (userId, poll_option) {
      var poll = Polls.findOne(poll_option.pollId);
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
// helpful list of letter based options for options
PollOptions.ids = [
{value: 'A', text: 'A'},
{value: 'B', text: 'B'},
{value: 'C', text: 'C'},
{value: 'D', text: 'D'},
{value: 'E', text: 'E'},
{value: 'F', text: 'F'},
{value: 'G', text: 'G'},
{value: 'H', text: 'H'},
{value: 'I', text: 'I'},
{value: 'J', text: 'J'},
{value: 'K', text: 'K'},
{value: 'L', text: 'L'},
  ];

