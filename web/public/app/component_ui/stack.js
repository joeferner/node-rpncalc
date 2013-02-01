'use strict';

define(
  [
    'flight/lib/component',
    'app/rpncalcHelpers'
  ],

  function(defineComponent, rpncalcHelpers) {
    return defineComponent(stack);

    function stack() {
      var ejsOptions = {
        open: '[%',
        close: '%]'
      };
      var stackTemplate = ejs.compile(document.getElementById('stackTemplate').innerHTML, ejsOptions);

      this.defaultAttrs({
      });

      this.scrollStackToBottom = function() {
        var stackItemsContainerElem = document.getElementById('stackItemsContainer');
        stackItemsContainerElem.scrollTop = stackItemsContainerElem.scrollHeight;
      };

      this.onStackItemClick = function(item) {
        var m = item.attr('id').match(/^stackItem_(.*)$/);
        var idx = parseInt(m[1]);
        var stackItem = rpncalc.stack[idx];
        if (stackItem) {
          inputElem.value = stackItem.toString(rpncalc.numBase);
        }
      };

      this.update = function(ev, obj) {
        var rpncalc = obj.rpncalc;
        var self = this;
        self.$node.html(stackTemplate({
          rpncalc: rpncalc,
          helpers: {
            stackItemToString: function(stackItem) {
              if (!stackItem) {
                return '&nbsp;';
              }
              return stackItem.toString();
            }
          },
          stackItemsToDisplay: 50
        }));
        $('.stackItem').click(function() {
          self.onStackItemClick($(this));
        });
        self.scrollStackToBottom();
      };

      this.onWindowResize = function() {
        this.scrollStackToBottom();
      };

      this.after('initialize', function() {
        this.on(document, 'uiRpncalcChanged', this.update);
        this.on(window, 'resize', this.onWindowResize);
        rpncalcHelpers.update(this);
      });
    }
  }
);
