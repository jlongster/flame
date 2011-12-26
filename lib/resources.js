
define(function() {

    var names = [];
    var assets = {};
    var loaded_callback = null;
    
    function add_texture(name, path) {
        names.push(name);

        var img = new Image();
        img.onload = function() {
            assets[name] = img;
            check_loaded();
            console.log(name, 'loaded');
        };
        img.src = path;
    }

    function get_texture(name) {
        return assets[name];
    }

    function check_loaded() {
        var ready = true;

        for(var n in names) {
            if(!assets[names[n]]) {
                ready = false;
            }
        }

        if(ready && loaded_callback) {
            loaded_callback();
        }
    }

    function on_loaded(callback) {
        // If any textures are waiting, set the callback, but if
        // nothing is waiting just call the callback immediately.
        if(names.length) {
            loaded_callback = callback;
        }
        else {
            callback();  
        }
    }

    return {
        add_texture: add_texture,
        get_texture: get_texture,
        on_loaded: on_loaded
    };
});
