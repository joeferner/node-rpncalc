'use strict';

define(
  [
    'app/component_ui/buttons',
    'app/component_ui/input',
    'app/component_ui/error'
  ],

  function(Buttons, Input, Error) {

    function initialize() {
      Buttons.attachTo('#buttons');
      Input.attachTo('#input');
      Error.attachTo('#error');
    }

    return initialize;
  }
);