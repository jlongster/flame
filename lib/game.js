
function vec_add(x, y) {
    return [x[0]+y[0], x[1]+y[1]];
}

require(['kernel', 'resources', 'scene', 'input', 'events', 'scene-controller', '../ext/domReady!'], function(kernel, resources, scene, input, events) {
    var canvas = document.getElementById('canvas');
    kernel.renderer = canvas.getContext('2d');

    resources.add_texture('grass', 'assets/grass.png');
    resources.add_texture('water', 'assets/water.png');
    resources.add_texture('stone', 'assets/stone.png');
    resources.add_texture('fire', 'assets/fire2.png');
    resources.add_texture('player-up', 'assets/player-up.png');
    resources.add_texture('player-down', 'assets/player-down.png');
    resources.add_texture('player-right', 'assets/player-right.png');
    resources.add_texture('player-left', 'assets/player-left.png');

    function lookup_tile(x, y) {
        return floor.tiles[y*floor.tile_x+x];
    }

    function set_tile(x, y, v) {
        if(x >= 0 && x < floor.tile_x &&
           y >= 0 && y < floor.tile_y) {
            floor.tiles[y*floor.tile_x+x] = v;
        }
    }

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
                    set_tile(x, y, 2);
                }
            }
        },

        render: function() {
            for(var i=0; i<this.tile_x; i++) {
                for(var j=0; j<this.tile_y; j++) {
                    var type = lookup_tile(i, j);
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
                    else if(type == 3) {
                        kernel.renderer.drawImage(resources.get_texture('fire'),
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
        var tile = lookup_tile(x, y);

        return tile == 1 || tile == 0;
    }

    scene.add('player', {
        pos: [50, 50],
        dir: 'right',
        texture: 'player-right',
        render: function() {
            kernel.renderer.drawImage(resources.get_texture(this.texture),
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

                this.texture = 'player-left';
                this.dir = 'left';
            }

            if(input.down('right')) {
                future = vec_add(this.pos, [5,0]);

                if(!intersects(vec_add(future, [16, 0])) &&
                   !intersects(vec_add(future, [16, 16]))) {
                    this.pos = future;
                }

                this.texture = 'player-right';
                this.dir = 'right';
            }

            if(input.down('up')) {
                future = vec_add(this.pos, [0,-5]);

                if(!intersects(future) &&
                   !intersects(vec_add(future, [16, 0]))) {
                    this.pos = future;
                }
            
                this.texture = 'player-up';
                this.dir = 'up';
            }

            if(input.down('down')) {
                future = vec_add(this.pos, [0,5]);

                if(!intersects(vec_add(future, [0, 16])) &&
                   !intersects(vec_add(future, [16, 16]))) {
                    this.pos = future;
                }

                this.texture = 'player-down';
                this.dir = 'down';
            }

            if(input.down('x')) {
                events.fire('flame', { player: this });
            }
        }
    });

    setInterval(function(e) {
        var affected_tiles = [];

        for(var x=0; x<floor.tile_x; x++) {
            for(var y=0; y<floor.tile_y; y++) {
                var tile = lookup_tile(x, y);

                if(tile == 3) {
                    affected_tiles.push([x+1, y]);
                    affected_tiles.push([x, y+1]);
                    affected_tiles.push([x-1, y]);
                    affected_tiles.push([x, y-1]);
                }
            }
        }

        for(var x=0; x<affected_tiles.length; x++) {
            var point = affected_tiles[x];
            var tile = lookup_tile(point[0], point[1]);
            if(tile == 0 || tile == 1) {
                set_tile(point[0], point[1], 3);
            }
        }
    }, 1000);
    
    events.bind('flame', function(e) {
        var player = e.player;
        var x = Math.floor(player.pos[0] / 32);
        var y = Math.floor(player.pos[1] / 32);

        if(player.dir == 'left') {
            x -= 1;
        }
        else if(player.dir == 'right') {
            x += 1;
        }
        else if(player.dir == 'up') {
            y -= 1;
        }
        else {
            y += 1;
        }

        var tile = lookup_tile(x, y);
        if(tile == 0 || tile == 1) {
            set_tile(x, y, 3);
        }
    });

    canvas.width = floor.tile_x * floor.tile_size;
    canvas.height = floor.tile_y * floor.tile_size;

    kernel.run();
});
