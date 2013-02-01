'use strict';

define(
  [
    'flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(buttons);

    function buttons() {
      this.defaultAttrs({
        buttonSelector: 'button'
      });

      this.buttonClick = function(ev, data) {
        var $item = $(data.el);
        var fn = $item.attr('fn') || $item.text();
        this.trigger('uiButtonClicked', {
          fn: fn
        });
      };

      this.after('initialize', function() {
        this.on('click', {
          buttonSelector: this.buttonClick
        });
      });
    }
  }
);
