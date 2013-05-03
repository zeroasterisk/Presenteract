Template.deckEditSlide.rendered = function() {
  $('[data-type]').each(function(i, el) {
    $(el).editable({
      pk: Session.get('slideId'),
      value: $(el).html(),
      url: function(params) {
        data = {};
        data[params.name] = params.value;
        console.log('url', params, data);
        updated = Slides.update(params.pk, { $set: data});
        console.log('updated', updated);
        return true;
      }
    });
  });
};
Template.deckEditSlide.events({
  'click .addPoll': function(event) {
    Meteor.call('newPoll', this._id, function(err, result) {
      if (_.isString(err) && err.length) {
        Notify.error(err);
        return false;
      }
      Notify.success('New Poll ID ' + result);
    });
    return false;
  },
  'click .deleteSlide': function(event) {
    Session.set('slideId', this._id);
    Session.set('confirmSlideDeletion', true);
    return false;
  },
  'submit form': function(event) {
    event.stopPropagation();
    Slides.update(Session.get('slideId'), { $set: {
      title: $('input[name="title"]').val(),
      short: $('textarea[name="short"]').val(),
      body: $('textarea[name="body"]').val(),
    }}, null, function(err) {
      if (_.isString(err) && err.length) {
        Notify.alert('Unable to save, ' + err);
        return false;
      }
      Notify.success('Saved');
      return true;
    });
    return false;
  }
});
Template.deckEditSlide.poll = function() {
  return Polls.findOne({slideId: Session.get('slideId')});
}
Template.deckEditSlide.slide = function() {
  return Slides.findOne(Session.get('slideId'));
}
Template.deckEditSlide.slideLeft = function() {
  var slides = Slides.find({ deckId: Session.get('deckId') }, { sort: { order: 1 } }).fetch();
  var slideId = Session.get('slideId');
  for (var i=0; i < slides.length; i++) {
    if (slides[i]._id == slideId && i > 0) {
      return slides[ i - 1 ];
    }
  }
  return false;
}
Template.deckEditSlide.slideRight = function() {
  var slides = Slides.find({ deckId: Session.get('deckId') }, { sort: { order: 1 } }).fetch();
  var slideId = Session.get('slideId');
  for (var i=0; i < slides.length; i++) {
    if (slides[i]._id == slideId && i < slides.length - 1) {
      return slides[ i + 1 ];
    }
  }
  return false;
}

// ------------------------------------
// confirmSlideDeletion Modal
// ------------------------------------

Template.confirmSlideDeletion.rendered = function() {
  var slideId = Session.get('slideId');
  if (! (_.isString(slideId) && slideId.length)) {
    Session.set('confirmSlideDeletion', '');
    Template.confirmSlideDeletion.closer();
  }
  window.location.hash = 'confirmSlideDeletion';
  $('.confirmSlideDeletion').modal('show');
  $('.confirmSlideDeletion').on('hidden', function() {
    window.location.hash = '';
    Session.set('confirmSlideDeletion', '');
  });
};
Template.confirmSlideDeletion.closer = function() {
  $('.confirmSlideDeletion').modal('hide');
  $('.modal-backdrop').hide('fast');
};
Template.confirmSlideDeletion.events({
  'click .cancel': function(event) {
    Template.confirmSlideDeletion.closer();
    event.preventDefault();
    return false;
  }
});
Template.confirmSlideDeletion.slide = function() {
  return Slides.findOne(Session.get('slideId'));
};


