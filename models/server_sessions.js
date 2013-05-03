if (Meteor.isClient) {
  // https://gist.github.com/matteoagosti/2865146
  Meteor.subscribe(
    'server_sessions',
    amplify.store('session'), // Read from local storage / cookies
    function() {
      // The server returns only one record, so findOne will return that record
      serverSession = new Meteor.Collection('server_sessions').findOne();
      // Stores into client session all data contained in server session;
      // supports reactivity when server changes the serverSession
      Session.set('serverSession', serverSession);
      // Stores the server session id into local storage / cookies
      amplify.store('session', serverSession._id);
    }
  );
}
