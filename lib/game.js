
function vec_add(x, y) {
    return [x[0]+y[0], x[1]+y[1]];
}

require(['kernel', 'resources', 'scene', 'input', 'scene-controller', '../ext/domReady!'], function(kernel, resources, scene, input) {
    var canvas = document.getElementById('canvas');
    kernel.renderer = canvas.getContext('2d');

    resources.add_texture('grass', 'assets/grass.png');
    resources.add_texture('water', 'assets/water.png');
    resources.add_texture('stone', 'assets/stone.png');
    resources.add_texture('player', 'assets/player.png');

    var floor = {
        tiles: [],
        tile_x: 25,
        tile_y: 15,
        tile_size: 32,

        init: function() {
            for(var i=0; i<this.tile_x*this.tile_y; i++) {
                this.tiles[i] = Math.floor(Math.random()*3)%3;
            }

            for(var x=0; x<8; x++) {
                for(var y=0; y<8; y++) {
                    this.tiles[y*this.tile_x+x] = 2;
                }
            }
        },

        render: function() {
            for(var i=0; i<this.tile_x; i++) {
                for(var j=0; j<this.tile_y; j++) {
                    var type = this.tiles[j*this.tile_x+i];
                    if(type == 0) {
                        kernel.renderer.drawImage(resources.get_texture('grass'),
                                                  i*32, j*32);
                    }
                    else if(type == 1) {
                        kernel.renderer.drawImage(resources.get_texture('water'),
                                                  i*32, j*32);
                    }
                    else if(type == 2) {
                        kernel.renderer.drawImage(resources.get_texture('stone'),
                                                  i*32, j*32);
                    }
                }
            }
        }
    };

    scene.add('floor', floor);

    function intersects(point) {
        point = vec_add(point, [-8,-8]);
        var x = Math.floor(point[0] / 32);
        var y = Math.floor(point[1] / 32);
        var tile = floor.tiles[y*floor.tile_x+x];

        return tile == 1 || tile == 0;
    }

    scene.add('player', {
        pos: [50, 50],
        render: function() {
            kernel.renderer.drawImage(resources.get_texture('player'),
                                      this.pos[0] - 16,
                                      this.pos[1] - 16);
        },

        update: function() {
            var future;

            if(input.down('left')) {
                future = vec_add(this.pos, [-5,0])

                if(!intersects(future) &&
                   !intersects(vec_add(future, [0, 16]))) {
                    this.pos = future;
                }
            }

            if(input.down('right')) {
                future = vec_add(this.pos, [5,0]);

                if(!intersects(vec_add(future, [16, 0])) &&
                   !intersects(vec_add(future, [16, 16]))) {
                    this.pos = future;
                }
            }

            if(input.down('up')) {
                future = vec_add(this.pos, [0,-5]);

                if(!intersects(future) &&
                   !intersects(vec_add(future, [16, 0]))) {
                    this.pos = future;
                }
            }

            if(input.down('down')) {
                future = vec_add(this.pos, [0,5]);

                if(!intersects(vec_add(future, [0, 16])) &&
                   !intersects(vec_add(future, [16, 16]))) {
                    this.pos = future;
                }
            }
        }
    });

    canvas.width = floor.tile_x * floor.tile_size;
    canvas.height = floor.tile_y * floor.tile_size;

    kernel.run();
});
