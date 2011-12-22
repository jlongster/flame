
var program = {
  ctx: null,

  translate: [0, 0],
  assets: {},

  tiles: [],
  tile_x: 25,
  tile_y: 15,
  tile_size: 32,

  player_pos: [50, 50]
};

program.width = program.tile_x * program.tile_size;
program.height = program.tile_y * program.tile_size;

require(['input', 'util', '../ext/domReady!'], function(input) {
  var canvas = document.getElementById('canvas');
  canvas.width = program.width;
  canvas.height = program.height;

  program.ctx = canvas.getContext('2d');

  var textures = ['grass', 'water', 'stone', 'player'];

  for(var t=0; t<textures.length; t++) {
    var texture = textures[t];

    var img = new Image();
    img.onload = (function(texture, img) {
      program.assets[texture] = img;
      try_run();
    })(texture, img);
    img.src = 'assets/' + texture + '.png';
  }
  
  function try_run() {
    var ready = true;

    for(var t=0; t<textures.length; t++) {
      var texture = textures[t];
      if(!program.assets[texture]) {
        ready = false;
      }
    }
    
    if(ready) {
      init();
      requestAnimFrame(heartbeat);
    }
  }


  function init() {
    for(var i=0; i<program.tile_x*program.tile_y; i++) {
      program.tiles[i] = Math.floor(Math.random()*30)%3;
    }

    for(var x=0; x<8; x++) {
      for(var y=0; y<8; y++) {
        program.tiles[y*program.tile_x+x] = 2;
      }
    }
  }

  function clear() {
    program.ctx.fillStyle = '#FFFFFF';
    program.ctx.fillRect(-10, -10, program.width+20, program.height+20);
  }

  function render() {
    for(var i=0; i<program.tile_x; i++) {
      for(var j=0; j<program.tile_y; j++) {
        var type = program.tiles[j*program.tile_x+i];
        if(type == 0)
          program.ctx.drawImage(program.assets['grass'], i*32, j*32);
        else if(type == 1)
          program.ctx.drawImage(program.assets['water'], i*32, j*32);
        else if(type == 2)
          program.ctx.drawImage(program.assets['stone'], i*32, j*32);
      }
    }

    program.ctx.drawImage(program.assets['player'],
                          program.player_pos[0] - 16,
                          program.player_pos[1] - 16);
  }

  function update(e) {
    function vec_add(x, y) {
      return [x[0]+y[0], x[1]+y[1]];
    }

    function intersects(point) {
      point = vec_add(point, [-8,-8]);
      var x = Math.floor(point[0] / 32);
      var y = Math.floor(point[1] / 32);
      var tile = program.tiles[y*program.tile_x+x];

      return tile == 1 || tile == 0;
    }

    if(input.down('left')) {
      future = vec_add(program.player_pos, [-5,0])

      if(!intersects(future) &&
         !intersects(vec_add(future, [0, 16]))) {
        program.player_pos = future;
      }
    }

    if(input.down('right')) {
      future = vec_add(program.player_pos, [5,0]);

      if(!intersects(vec_add(future, [16, 0])) &&
         !intersects(vec_add(future, [16, 16]))) {
        program.player_pos = future;
      }
    }

    if(input.down('up')) {
      future = vec_add(program.player_pos, [0,-5]);

      if(!intersects(future) &&
         !intersects(vec_add(future, [16, 0]))) {
        program.player_pos = future;
      }
    }

    if(input.down('down')) {
      future = vec_add(program.player_pos, [0,5]);

      if(!intersects(vec_add(future, [0, 16])) &&
         !intersects(vec_add(future, [16, 16]))) {
        program.player_pos = future;
      }
    }
  }
  
  function heartbeat() {
    program.ctx.setTransform(1, 0, 0, 1, 0, 0);
    clear();
    update();
    program.ctx.translate(program.translate[0], program.translate[1]);
    render();

    requestAnimFrame(heartbeat);
  }

});

