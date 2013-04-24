(function() {


// Notifications based on $.bootstrapGrowl()
//   mrt add bootstrap-growl
//

Notify = {
  options: {
    ele: 'body', // which element to append to
    type: 'info', // (null, 'info', 'error', 'success')
    offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
    align: 'right', // ('left', 'right', or 'center')
    width: 250, // (integer, or 'auto')
    delay: 4000,
    allow_dismiss: true,
    stackup_spacing: 10 // spacing between consecutively stacked growls.
  },
  optionize: function(options) {
    if (_.isObject(options)) {
      return _.extend(this.options, options);
    }
    return this.options;
  },
  alert: function(message, options) {
    $.bootstrapGrowl(message, _.extend(this.optionize(options), {type: 'alert'}));
  },
  info: function(message, options) {
    $.bootstrapGrowl(message, _.extend(this.optionize(options), {type: 'info'}));
  },
  error: function(message, options) {
    $.bootstrapGrowl(message, _.extend(this.optionize(options), {type: 'error'}));
  },
  success: function(message, options) {
    $.bootstrapGrowl(message, _.extend(this.optionize(options), {type: 'success'}));
  },
  // clear all existing notificiations
  clear: function() {
    $('.bootstrap-growl').remove();
  }
}


}());

