Template.home.helpers({
  decks: function() {
    return Decks.find({ isFindable: true, isOpen: true }, { sort: { created: 1 } }).fetch();
  },
  createdNice: function() {
    return moment(this.created).fromNow();
  },
  // inside the phonegap presenteract app
  onApp: function() {
      return (Session.get('cordovaLoaded') && Session.get('cordovaStatus') != 'aborted');
  },
  // running in a browser on a compatible device, but not inside phonegap
  onDevice: function() {
    return (Session.get('cordovaStatus') != 'aborted');
  }
  // onBrowser() = not onApp and not onDevice
});

