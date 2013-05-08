/**
 * Shared, basic, low level helpers
 *   client+server
 */

_.mixin(_.string.exports());

_.mixin({

    flatErrors: function(errors) {
      return Array.prototype.concat.apply([], _.values(errors))
    },

    eventGetA: function(event) {
      if (event.target.tagName.toLowerCase() == 'a') {
        return $(event.target);
      }
      return $(event.target).closest('a,button');
    }

});

