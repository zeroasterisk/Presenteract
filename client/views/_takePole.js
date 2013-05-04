Template.takePoll.events({
  'focus input': function() {
    Template.takePoll.optionChosen();
  },
  'click input': function() {
    Template.takePoll.optionChosen();
  },
  'blur input': function() {
    Template.takePoll.optionChosen();
  },
  'click .viewResults': function(event) {
    Session.set('pollViewResults', true);
    return false;
  },
  'submit form': function(event) {
    var pollOptionId = $('input[name="takePoll"]:checked').val();
    var pollId = this._id;
    var deckId = this.deckId;
    Meteor.call('answer', {
      pollId: pollId,
      deckId: deckId,
      pollOptionId: pollOptionId,
      serverSessionId: Meteor.getServerSessionId()
    }, function(err, result) {
        if (_.isString(err) && err.length) {
          Notify.error(err);
          $('.anOptionSelected').attr('disabled', true);
          Meteor.setTimeout(function() { $('.anOptionSelected').attr('disabled', true); }, 1200);
          return false;
        }
        Notify.success('Submit');
    });
    return false;
  }
});
Template.takePoll.helpers({
  'pollOptions': function() {
    return PollOptions.find({pollId: this._id}, { sort: { id: 1 } });
  },
});
Template.takePoll.optionChosen = function() {
  var pollOption = $('input[name="takePoll"]:checked').val();
  if (! (_.isString(pollOption) && pollOption.length)) {
    $('.anOptionSelected').hide().attr('disabled', true);
    $('.noOptionSelected').show();
    return false;
  }
  $('.anOptionSelected').show().removeAttr('disabled');
  $('.noOptionSelected').hide();
};




