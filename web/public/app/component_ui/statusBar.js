'use strict';

define(
  [
    'flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(statusBar);

    function statusBar() {
      this.defaultAttrs({
      });

      this.angleModeToString = function(angleMode) {
        switch (angleMode) {
        case 'rad':
          return 'Radians';
        case 'deg':
          return 'Degrees';
        default:
          return 'Unknown: ' + angleMode
        }
      };

      this.numBaseToString = function(numBase) {
        switch (numBase) {
        case 10:
          return 'Decimal';
        case 16:
          return 'Hexadecimal';
        case 8:
          return 'Octal';
        case 2:
          return 'Binary';
        default:
          return 'Base: ' + numBase
        }
      };

      this.update = function(ev, obj) {
        var rpncalc = obj.rpncalc;
        $('#angleMode').html(this.angleModeToString(rpncalc.angleMode));
        $('#numBase').html(this.numBaseToString(rpncalc.numBase));
      };

      this.after('initialize', function() {
        this.on(document, 'uiRpncalcChanged', this.update);
      });
    }
  }
);
