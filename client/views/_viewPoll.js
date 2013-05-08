Template.viewPoll.events({
'click .takePoll': function(event) {
  Session.set('pollViewResults', '');
  return false;
}
});
Template.viewPoll.helpers({
  'pollOptions': function() {
    return PollOptions.find({pollId: this._id}, { sort: { id: 1 } });
  },
  'getCount': function() {
    return Answers.find({pollOptionId: this._id}).count();
  }
});
Template.viewPoll.rendered = function() {
  Template.viewPoll.doChart(this.data._id);
}
Template.viewPoll.doChart = function(pollId) {
    var pollOptions = PollOptions.find({pollId: pollId}, { sort: { id: 1 } }).fetch();
    var data = [];
    _.each(pollOptions, function(pollOption) {
      var node = {
        value: Answers.find({pollOptionId: pollOption._id}).count(),
        color: '#' + pollOption.color,
      };
      data.push(node);
    });
    // chartjs
    var options = {
      animationSteps: 60,
    };
    var ctx = $("#viewPollChart").get(0).getContext("2d");
    Template.viewPoll.chart = new Chart(ctx).Doughnut(data, options);
    console.log('doChart', pollId, pollOptions, data, ctx, options, Template.viewPoll.chart);
    return true;
}


