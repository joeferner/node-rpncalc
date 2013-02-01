'use strict';

define({
  update: function(component) {
    var jqxhr = $.get(
      '/rpncalc',
      function(rpncalc) {
        component.trigger('uiRpncalcChanged', { rpncalc: rpncalc });
      })
      .fail(function() {
        var json = JSON.parse(jqxhr.responseText);
        console.log('stack update failed:', json.message);
        return component.trigger('uiError', { message: json.message });
      });
  }
});
