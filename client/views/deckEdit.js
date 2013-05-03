Template.deckEdit.events({
  'click .newSlide': function(event) {
    Meteor.call('newSlide', Session.get('deckId'));
    return false;
  },
  'click .moveSlideUp': function(event) {
    Slides.moveSlide(this._id, 'up');
    return false;
  },
  'click .moveSlideDown': function(event) {
    Slides.moveSlide(this._id, 'down');
    return false;
  },
});
Template.deckEdit.helpers({
  deck: function() {
    return Decks.findOne({ _id: Session.get('deckId') });
  },
  slides: function() {
    return Slides.find({ deckId: Session.get('deckId') }, { sort: { order: 1 } });
  },
  slidesCount: function() {
    return Slides.find({ deckId: Session.get('deckId') }).count();
  }

});
Template.deckEdit.rendered = function() {
  // setup hover-edit-icons
  $(document).on('mouseenter.editIcon', '.slide-thumb', function(event) {
    $(this).find('.edit-icons').show('fast');
  });
  $(document).on('mouseleave.editIcon', '.slide-thumb', function(event) {
    $(this).find('.edit-icons').hide('fast');
  });
  // setup which changes as slides re-render/change
  Deps.autorun(function() {
    var slideCount = Slides.find({ deckId: Session.get('deckId') }).count();
    if (slideCount === 0) {
      return false;
    }
    // setup in-place
    $('.slide-eip').each(function(i, el) {
      $(el).editable({
        value: $(el).html(),
        url: function(params) {
          var d = new $.Deferred;
          var slide = {};
          slide[params.name] = params.value;
          console.log('editable', params, slide, _.isObject(slide));
          var updated = Slides.update({ _id: params.pk }, { $set: slide });
          console.log('editable-done', updated);
          return d.resolve();
        }
      });
    });
  });
};




// ------------------------------------
// edit slide thumb (used in slideEditing too)
// ------------------------------------

Template._editSlideThumb.helpers({
  withPoll: function() {
    var pollCount = Polls.find({ slideId: this._id }).count();
    return (pollCount > 0);
  },
  short: function() {
    return new Handlebars.SafeString(this.short);
  }
})
