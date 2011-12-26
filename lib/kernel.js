
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

define(['events', 'resources'], function(events, resources) {
    var first_run = true;

    function run() {
        resources.on_loaded(heartbeat);
    }

    function heartbeat() {
        if(first_run) {
            events.fire('init');
            first_run = false;
        }

        events.fire('prerender');
        events.fire('update');
        events.fire('render');
        events.fire('postrender');

        requestAnimFrame(heartbeat);
    }

    function suspend() {
        // todo
    }

    function resume() {
        // todo
    }

    return {
        run: run,
        suspend: suspend,
        resume: resume
    }
});
