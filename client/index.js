Template.header.helpers({
  'isLoginAllowed': function() {
    /**
     * until this issue is resolved, we will disable login for Cordova applications
     * http://stackoverflow.com/questions/16441984/phonegap-ios-oauth-redirect-failing-nsurlerrordomain-error-999
     */
    if (deviceBase == 'ios' || deviceBase == 'android') {
      return false;
    }
    return true;
  }
});
