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
{value: 'A', text: 'A', color: 'A4C400'},
{value: 'B', text: 'B', color: '60A917'},
{value: 'C', text: 'C', color: '008A00'},
{value: 'D', text: 'D', color: '00ABA9'},
{value: 'E', text: 'E', color: '1BA1E2'},
{value: 'F', text: 'F', color: '0050EF'},
{value: 'G', text: 'G', color: '6A00FF'},
{value: 'H', text: 'H', color: 'AA00FF'},
{value: 'I', text: 'I', color: 'F472D0'},
{value: 'J', text: 'J', color: 'D80073'},
{value: 'K', text: 'K', color: 'A20025'},
{value: 'L', text: 'L', color: 'E51400'},
{value: 'M', text: 'M', color: 'FA6800'},
{value: 'N', text: 'N', color: 'F0A30A'},
{value: 'O', text: 'O', color: 'E3C800'},
{value: 'P', text: 'P', color: '825A2C'},
{value: 'Q', text: 'Q', color: '6D8764'},
{value: 'R', text: 'R', color: '647687'},
{value: 'S', text: 'S', color: '76608A'},
{value: 'T', text: 'T', color: '87794E'},
  ];

