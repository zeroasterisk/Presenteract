Template.deckEditSlide.rendered = function() {
  /*
  $('#editor').editable({
    url : function(params) {
      $('#body').val(params.value);
    }
  });
  $(document).on('click', '.editSlideContent', function() {
  $('#editor').editable('toggle');

  });
  */

};
Template.deckEditSlide.events({
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
Template.deckEditSlide.slide = function() {
  return Slides.findOne(Session.get('slideId'));
}
