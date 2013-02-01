'use strict';

define(
  [
    'flight/lib/component',
    'app/rpncalcFunctions'
  ],

  function(defineComponent, rpncalcFunctions) {
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
            self.trigger('uiStackChanged');
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
            return cmd.name == key;
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
                  commandName: cmd.name,
                  time: Date.now()
                },
                function() {
                  console.log('rpncalc execute succeeded');
                  return self.trigger('uiStackChanged');
                })
                .fail(function() {
                  var json = JSON.parse(jqxhr.responseText);
                  console.log('rpncalc execute failed:', json.message);
                  return self.trigger('uiError', { message: json.message });
                });
              return 0;
            });
          } else {
            self.trigger('uiError', { message: 'Unhandled key: ' + key });
          }
          break;
        }
      };

      this.buttonClick = function(ev, data) {
        var key = data.fn.toLowerCase();
        this.execute(key);
      };

      this.after('initialize', function() {
        this.on(document, 'uiButtonClicked', this.buttonClick);
      });
    }
  }
);
