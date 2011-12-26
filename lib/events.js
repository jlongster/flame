define(function() {
    return {
        bind: function(name, callback) {
            document.addEventListener(name, callback);
        },

        fire: function(name, props) {
            var ev = document.createEvent('Event');
            ev.initEvent(name, false, true);

            ev = _.extend(ev, props);
            document.dispatchEvent(ev);
        }
    }
});
