
define(['events'], function(events) {
    var pressed_keys = {};
    var special_keys = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN'
    };

    function set_key(event, status) {
        var code = event.keyCode;

        if(code in special_keys) {
            pressed_keys[special_keys[code]] = status;
        }
        else {
            pressed_keys[String.fromCharCode(code)] = status;
        }
    }

    events.bind('keydown', function(e) {
        set_key(e, true);
    });

    events.bind('keyup', function(e) {
        set_key(e, false);    
    });

    return {
        down: function(key) {
            return pressed_keys[key.toUpperCase()];
        }
    }
})
