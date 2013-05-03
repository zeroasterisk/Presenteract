Template.editPoll.helpers({
  'answers': function() {
    return PollOptions.find({ pollId: this._id }, { sort: { id: 1 } });
  }
});
Template.editPoll.events({
  'click .removePoll': function(event) {
    if (confirm('Are you sure you want to remove this Poll & all votes?')) {
      Meteor.call('delPoll', this._id, function(err, result) {
        if (_.isString(err) && err.length) {
          Notify.error(err);
          return false;
        }
        Notify.success('Deleted Poll');
      });
    }
    return false;
  },
  'click .removePollOption': function(event) {
    if (confirm('Are you sure you want to remove this Poll Option & all of it\'s votes?')) {
      Meteor.call('delPollOption', this._id, function(err, result) {
        if (_.isString(err) && err.length) {
          Notify.error(err);
          return false;
        }
        Notify.success('Deleted Poll');
      });
    }
    return false;
  },
  'click .addPollOption': function(event) {
    Meteor.call('newPollOption', this._id, function(err, result) {
      if (_.isString(err) && err.length) {
        Notify.error(err);
        return false;
      }
      Notify.success('Added Poll Option');
    });
    return false;
  }

});
Template.editPoll.rendered = function() {
  $('[data-type].poll').editable({
    url: function(params) {
      data = {};
      data[params.name] = params.value;
      console.log('url poll', params, data, this);
      updated = Polls.update(params.pk, { $set: data});
      console.log('updated', updated);
      return true;
    }
  });
  $('[data-type].option_id').editable({
    source: PollOptions.ids,
    url: function(params) {
      data = {};
      data[params.name] = params.value;
      console.log('url answer', params, data, this);
      updated = PollOptions.update(params.pk, { $set: data});
      console.log('updated', updated);
      return true;
    }
  });
  $('[data-type].option_text').editable({
    url: function(params) {
      data = {};
      data[params.name] = params.value;
      console.log('url answer', params, data, this);
      updated = PollOptions.update(params.pk, { $set: data});
      console.log('updated', updated);
      return true;
    }
  });
};

