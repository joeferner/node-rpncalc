'use strict';

define(
  [
    'flight/lib/component',
    'app/rpncalcFunctions',
    'app/keys',
    'app/rpncalcHelpers'
  ],

  function(defineComponent, rpncalcFunctions, keys, rpncalcHelpers) {
    return defineComponent(input);

    function input() {
      this.defaultAttrs({
      });

      this.getStackInputValue = function() {
        return this.$node.val().trim();
      };

      this.push = function(val, callback) {
        var self = this;
        console.log('pushing:', val);
        var jqxhr = $.post(
          '/rpncalc/push',
          {
            value: val
          },
          function() {
            self.$node.val('');
            rpncalcHelpers.update(self);
            return callback();
          })
          .fail(function() {
            var json = JSON.parse(jqxhr.responseText);
            return callback(new Error(json.message))
          });
      };

      this.pushInput = function(callback) {
        var self = this;
        var val = self.getStackInputValue();
        if (val.length > 0) {
          return self.push(val, callback);
        } else {
          return callback();
        }
      };

      this.execute = function(key) {
        var self = this;
        switch (key) {
        case 'enter':
          self.pushInput(function(err) {
            if (err) {
              return self.trigger('uiError', { message: err.message });
            }
            return 0;
          });
          break;

        case 'pi':
          self.pushInput(function(err) {
            if (err) {
              return self.trigger('uiError', { message: err.message });
            }
            return self.push(Math.PI, function(err) {
              if (err) {
                return self.trigger('uiError', { message: err.message });
              }
              return 0;
            });
          });
          break;

        case '+/-':
          if (self.getStackInputValue().length > 0) {
            if (self.$node.val()[0] == '-') {
              self.$node.val(self.$node.val().substr(1));
            } else {
              self.$node.val('-' + self.$node.val());
            }
          } else {
            return self.execute('neg');
          }
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '.':
          self.$node.val(self.$node.val() + key);
          break;

        default:
          var matchingCommands = rpncalcFunctions.commands.filter(function(cmd) {
            return cmd.name == key || cmd.fullName == key;
          });
          if (matchingCommands.length > 0) {
            var cmd = matchingCommands[0];
            console.log('found rpncalc match: ', cmd);
            self.pushInput(function(err) {
              if (err) {
                return self.trigger('uiError', { message: err.message });
              }
              var jqxhr = $.post(
                '/rpncalc/execute',
                {
                  commandName: cmd.fullName,
                  time: Date.now()
                },
                function() {
                  console.log('rpncalc execute succeeded');
                  return rpncalcHelpers.update(self);
                })
                .fail(function() {
                  var json = JSON.parse(jqxhr.responseText);
                  console.log('rpncalc execute failed:', json.message);
                  return self.trigger('uiError', { message: json.message });
                });
              return 0;
            });
          } else {
            self.trigger('uiError', { message: 'command ' + key + ' not found.'});
          }
          break;
        }
      };

      this.buttonClick = function(ev, data) {
        var key = data.fn.toLowerCase();
        this.execute(key);
      };

      this.keyPressed = function(ev, data) {
        var self = this;
        switch (ev.which) {
        case keys.PLUS:
        case keys.MINUS:
        case keys.ASTERISK:
        case keys.FORWARD_SLASH:
          ev.preventDefault();
          this.pushInput(function(err) {
            if (err) {
              return self.trigger('uiError', { message: err.message });
            }
            switch (ev.which) {
            case keys.PLUS:
              self.execute('plus');
              break;
            case keys.MINUS:
              self.execute('subtract');
              break;
            case keys.ASTERISK:
              self.execute('multiply');
              break;
            case keys.FORWARD_SLASH:
              self.execute('divide');
              break;
            }
          });
          break;
        default:
          console.log('onKeyPress', ev.which);
        }
      };

      this.keyDown = function(ev, data) {
        var self = this;
        switch (ev.which) {
        case keys.BACKSPACE:
          if (this.getStackInputValue().length > 0) {
            // do nothing
          } else {
            this.execute('drop');
          }
          break;

        case keys.ENTER:
          this.pushInput(function(err) {
            if (err) {
              return self.trigger('uiError', { message: err.message });
            }
            return 0;
          });
          break;

        default:
          console.log('onKeyDown', ev.which);
        }
      };

      this.onBlur = function() {
        var self = this;
        setTimeout(function() {
          self.$node.focus();
        }, 100);
      };

      this.after('initialize', function() {
        this.on(document, 'uiButtonClicked', this.buttonClick);
        this.on(document.body, 'keypress', this.keyPressed);
        this.on(document.body, 'keydown', this.keyDown);
        this.on('blur', this.onBlur);
        this.$node.focus();
      });
    }
  }
);
