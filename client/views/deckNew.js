Template.deckNew.events({
  'submit form': function(event) {
    Meteor.call('deckNew', {
      title: $('#deckNew input[name="title"]').val(),
      short: $('#deckNew textarea[name="short"]').val(),
      byline: $('#deckNew input[name="byline"]').val(),
      isFindable: $('#deckNew input[name="isFindable"]').is(':checked'),
      isAccountRequired: $('#deckNew input[name="isAccountRequired"]').is(':checked'),
      isOpen: false, // not currently starting
    }, function(err, result) {
      if (err) {
        // TODO: nice this up
        alert('Unable to create new Presenation ' + err);
        return false;
      }
      console.log('Created new Presenation', result);
      Meteor.Router.to('/deckEdit/' + result);
    });
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
});
