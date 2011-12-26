
define(['events', 'scene'], function(events, scene) {

    events.bind('init', function() {
        scene.iter(function(obj) {
            obj.init && obj.init.call(obj);
        });
    });

    events.bind('update', function() {
        scene.iter(function(obj) {
            obj.update && obj.update.call(obj);
        });
    });

    events.bind('prerender', function() {
        kernel.renderer.setTransform(1, 0, 0, 1, 0, 0);
        kernel.renderer.fillStyle = '#FFFFFF';
        kernel.renderer.fillRect(0, 0, program.width, program.height);
    });

    events.bind('render', function() {
        scene.iter(function(obj) {
            obj.render && obj.render.call(obj);
        });
    });
});
