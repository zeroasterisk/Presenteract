// Session helpers
//
// {{#if sessionEquals 'foo' 'bar'}}  //where foo is session key containing a value and bar is test value
// {{getSession 'foo'}} //returns session keys value
//
//
(function () {
  if (typeof Handlebars !== 'undefined') {

    Handlebars.registerHelper('user', function () {
      return Meteor.user();
    });

    Handlebars.registerHelper('getSession', function (key) {
      return Session.get(key);
    });

    Handlebars.registerHelper('sessionEquals', function (key, value) {
      var myValue = Session.get(key); //Workaround Issue #617
      if (typeof(myValue) === 'boolean') {
        //Workaround Issue #617
        return Session.equals(key, (value == 'true'));
      }
      return Session.equals(key, (myValue === +myValue)?+value:value); //Workaround Issue #617
      //return Session.equals(key, value); //When Issue #617 is resolved
    });

    Handlebars.registerHelper('findOne', function (collection, query, options) {
      //console.log('findOne: '+collection + '  '+query);
      var myCollection = eval(collection);
      if (myCollection instanceof Meteor.Collection) {
        var myQuery = JSON.parse(query);
        var myOptions = (options instanceof Object)?undefined: JSON.parse(options);
        //console.log(myCollection.findOne(myQuery));
        if (myQuery instanceof Object) {
          return myCollection.findOne(myQuery, myOptions);
        }
        console.log('{{findOne}} query error: '+query);
        throw new Error('Handlebar helper findOne: "'+collection+'" error in query:'+query+' (remember {"_id":1})');
      } else {
        throw new Error('Handlebar helper findOne: "'+collection+'" not found');
      }
      return [];
    });

    Handlebars.registerHelper('find', function (collection, query, options) {
      //console.log('find: '+collection + '  '+query+'  '+(options instanceof Object));
      var myCollection = eval(collection);
      if (myCollection instanceof Meteor.Collection) {
        var myQuery = JSON.parse(query);
        var myOptions = (options instanceof Object)?undefined: JSON.parse(options);
        //console.log(myCollection.find(myQuery));
        if (myQuery instanceof Object) {
          return myCollection.find(myQuery, myOptions);
        }
        console.log('{{find}} query error: '+query);
        throw new Error('Handlebar helper find: "'+collection+'" error in query:'+query+' (remember {"_id":1})');
      } else {
        throw new Error('Handlebar helper find: "'+collection+'" not found');
      }
      return [];
    });

    Handlebars.registerHelper("foreach",function(arr,options) {
      if (options.inverse && !arr.length) {
        return options.inverse(this);
      }
      return arr.map(function(item,index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last  = index === arr.length-1;
        return options.fn(item);
      }).join('');
    });
  }
}());
