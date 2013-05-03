// https://gist.github.com/matteoagosti/2865146
// Do not have this in a model.js file, its scope should be server only
ServerSessions = new Meteor.Collection('server_sessions');

Meteor.publish('server_sessions', function(id) {
  var created = new Date().getTime();

  // If no id is passed we create a new session
  if(!id) {
    id = ServerSessions.insert({created: created});
  }

  // Load the session
  serverSession = ServerSessions.find(id);

  // If no session is loaded, creates a new one;
  // id no longer valid
  if(serverSession.count() === 0) {
    id = ServerSessions.insert({created: created});
    serverSession = ServerSessions.find(id);
  }

  return serverSession;
});

// protected method to update the session data
Meteor.methods({
  updateSession: function(data) {
    if (! (_.isObject(data) && _.has(data, '_id'))) {
      throw new Meteor.Error(500, 'Unable to updateSession, invalid input data');
    }
    return ServerSessions.update({_id: data._id}, data);
  }
});
