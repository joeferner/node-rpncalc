'use strict';

define(
  [
    'flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(rpncalc);

    function rpncalc() {
      this.defaultAttrs({
      });

      this.buttonClick = function(ev, data) {
        var $item = $(data.el);
        var fn = $item.attr('fn') || $item.text();
        this.trigger('uiButtonClicked', {
          fn: fn
        });
      };

      this.after('initialize', function() {
        this.on('uiButtonClicked', this.buttonClick);
      });
    }
  }
);
