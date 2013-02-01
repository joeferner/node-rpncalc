'use strict';

define(
  [
    'app/component_ui/buttons',
    'app/component_ui/input',
    'app/component_ui/error',
    'app/component_ui/stack',
    'app/component_ui/statusBar'
  ],

  function(buttons, input, error, stack, statusBar) {

    function initialize() {
      buttons.attachTo('#buttons');
      input.attachTo('#input');
      error.attachTo('#error');
      stack.attachTo('#stack');
      statusBar.attachTo('#statusBar');
    }

    return initialize;
  }
);