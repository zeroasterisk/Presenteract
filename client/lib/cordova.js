// PhoneGap 2.6 + MeteorJS
// ------------------------------------
// this is a means of keeping track of what version of cordova to load
// and what the device status is at any given moment (tracked in Session)
// and finally, how that device status should trigger a Meteor.reconnect()
// ------------------------------------
// setup appStatus
//   loading, online, offline, pause
Session.set('appStatus', 'loading');
// did we load cordova?
Session.set('cordovaReady', false);
// are we going to wait around on cordova?
Session.set('cordovaLoaded', false);
// cordovaStatus
//   aborted, ready, paused, resumed, offline, online
Session.set('cordovaStatus', 'loading');

deviceBase = 'other';

if (navigator.userAgent.match(/(iPad|iPhone|iOS)/gi) != null) {
  deviceBase = 'ios';
} else if (navigator.userAgent.match(/(Android)/gi) != null) {
  deviceBase = 'android';
}

if (deviceBase == 'other') {
  Session.set('cordovaStatus', 'aborted');
  Session.set('cordovaLoaded', true);
} else {
  var cordovaPath = '/cordova-2.7.0-' + deviceBase + '.js';
  $.getScript(cordovaPath, function() {
    // http://docs.phonegap.com/en/2.7.0/cordova_events_events.md.html#Events
    document.addEventListener("deviceready", function() {
      Session.set('cordovaReady', true);
      Session.set('cordovaLoaded', true);
      Session.set('cordovaStatus', 'ready');
    });
    document.addEventListener("pause", function() {
      Session.set('cordovaStatus', 'paused');
    });
    document.addEventListener("resume", function() {
      Session.set('cordovaStatus', 'resumed');
    });
    document.addEventListener("offline", function() {
      Session.set('cordovaStatus', 'offline');
    });
    document.addEventListener("online", function() {
      Session.set('cordovaStatus', 'online');
    });
  });
}

Deps.autorun(function () {
  cordovaStatus = Session.get('cordovaStatus');
  if (cordovaStatus == 'offline' || cordovaStatus == 'paused' || cordovaStatus == 'resumed') {
    // in any of these states, we "may" have lost our connectivity to Meteor
    //   if we have not, and we "are" connected, than this command has no effect
    //      http://docs.meteor.com/#meteor_reconnect
    Meteor.reconnect();
  }
});

