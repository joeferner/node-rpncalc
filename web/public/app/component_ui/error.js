'use strict';

define(
  [
    'flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(error);

    function error() {
      this.defaultAttrs({
      });

      this.clearErrors = function(ev, data) {
        this.$node.hide();
        this.$node.html('');
      };

      this.displayError = function(ev, data) {
        var self = this;
        // make sure we process this after any clearErrors whihc may be pending from other events
        setTimeout(function() {
          self.$node.html(data.message);
          self.$node.show();
        }, 10);
      };

      this.after('initialize', function() {
        this.on(document, 'uiButtonClicked', this.clearErrors);
        this.on(document, 'uiError', this.displayError);
      });
    }
  }
);
