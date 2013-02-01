'use strict';

$(function() {
  var templateHelpers = createTemplateHelpers();
  var keys = document.require('../../lib/keys');
  var RpnCalc = document.require('../../');
  var rpncalc = document.rpncalc = new RpnCalc();
  var stackElem = document.getElementById('stack');
  var statusBarElem = document.getElementById('statusBar');
  var errorElem = document.getElementById('error');
  var inputElem = null;
  var ejsOptions = {
    open: '[%',
    close: '%]'
  };
  var statusBarTemplate = ejs.compile(document.getElementById('statusBarTemplate').innerHTML, ejsOptions);
  var stackTemplate = ejs.compile(document.getElementById('stackTemplate').innerHTML, ejsOptions);
  update();
  setTimeout(onWindowResize, 100);
  setTimeout(loadState, 100);

  $('#buttons button').click(onButtonClick);
  $('body').keypress(onKeyPress);
  $('body').keydown(onKeyDown);
  $(window).resize(onWindowResize);

  window.document.clearState = function() {
    rpncalc.clear();
    update();
  };

  function loadState() {
    var state = window.rpncalcState;
    if (state) {
      state = JSON.parse(state);
      rpncalc.loadState(state);
      update();
    }
  }

  function onWindowResize() {
    scrollStackToBottom();
  }

  function update() {
    updateStatusBar();
    updateStack();
    onWindowResize();
  }

  function updateStack() {
    var stackInputValue = '';
    if (inputElem) {
      stackInputValue = $(inputElem).val();
    }
    stackElem.innerHTML = stackTemplate({
      rpncalc: rpncalc,
      helpers: templateHelpers,
      stackItemsToDisplay: 50,
      stackInputValue: stackInputValue
    });
    $('.stackItem').click(onStackItemClick);
    inputElem = document.getElementById('stackInput');
    inputElem.onblur = function() {
      setTimeout(function() {
        inputElem.focus();
      }, 100);
    };
    inputElem.focus();
    scrollStackToBottom();
  }

  function onStackItemClick() {
    var m = $(this).attr('id').match(/^stackItem_(.*)$/);
    var idx = parseInt(m[1]);
    var stackItem = rpncalc.stack[idx];
    if (stackItem) {
      inputElem.value = stackItem.toString(rpncalc.numBase);
    }
  }

  function scrollStackToBottom() {
    var stackItemsContainerElem = document.getElementById('stackItemsContainer');
    stackItemsContainerElem.scrollTop = stackItemsContainerElem.scrollHeight;
  }

  function updateStatusBar() {
    statusBarElem.innerHTML = statusBarTemplate({
      rpncalc: rpncalc,
      helpers: templateHelpers
    });
  }

  function onKeyPress(event) {
    try {
      switch (event.which) {
      case keys.PLUS:
      case keys.MINUS:
      case keys.ASTERISK:
      case keys.FORWARD_SLASH:
        event.preventDefault();
        pushInput();
        switch (event.which) {
        case keys.PLUS:
          rpncalc.plus();
          break;
        case keys.MINUS:
          rpncalc.subtract();
          break;
        case keys.ASTERISK:
          rpncalc.multiply();
          break;
        case keys.FORWARD_SLASH:
          rpncalc.divide();
          break;
        }
        update();
        break;
      default:
        console.log('onKeyPress', event.which);
      }
    } catch (e) {
      displayError(e);
    }
  }

  function onKeyDown(event) {
    clearError();
    try {
      switch (event.which) {
      case keys.BACKSPACE:
        if (getStackInputValue().length > 0) {
          // do nothing
        } else {
          rpncalc.drop();
          update();
        }
        break;

      case keys.ENTER:
        pushInput();
        break;

      default:
        console.log('onKeyDown', event.which);
      }
    } catch (e) {
      displayError(e);
    }
  }

  function createTemplateHelpers() {
    return {
      angleModeToString: function(angleMode) {
        switch (angleMode) {
        case 'rad':
          return 'Radians';
        case 'deg':
          return 'Degrees';
        default:
          return 'Unknown: ' + angleMode
        }
      },

      numBaseToString: function(numBase) {
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
      },

      stackItemToString: function(stackItem) {
        if (!stackItem) {
          return '&nbsp;';
        }
        return stackItem.toString(rpncalc.numBase);
      }
    };
  }
});

