
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

var input = {
  keys: []
};

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

  function check_intersect(point) {
    var x = Math.floor(point[0] / 32);
    var y = Math.floor(point[1] / 32);
    var tile = program.tiles[y*program.tile_x+x];

    return tile == 1 || tile == 0;
  }

  var dir = [0,0];

  var str = 'BEGIN ';
  for(var i=0; i<input.keys.length; i++) {
    str += i + ' ';
    var key = input.keys[i];
    var points;
    var local_dir;

    if(key == 'left') {
      local_dir = [-5,0];
      points = [program.player_pos,
                vec_add(program.player_pos, [0, 16])];
    }
    else if(key == 'right') {
      local_dir = [5,0];
      points = [vec_add(program.player_pos, [16, 0]),
                vec_add(program.player_pos, [16, 16])];
    }
    else if(key == 'up') {
      local_dir = [0,-5];
      points = [program.player_pos,
                vec_add(program.player_pos, [16, 0])];
    }
    else if(key == 'down') {
      local_dir = [0,5];
      points = [vec_add(program.player_pos, [0, 16]),
                vec_add(program.player_pos, [16, 16])];
    }

    var hit = false;
    for(var p in points) {
      if(check_intersect(vec_add(vec_add(points[p], local_dir),
                                 [-8, -8]))) {
        hit = true;
      }
    }

    if(!hit) {
      dir = vec_add(dir, local_dir);
    }
  }

  program.player_pos = vec_add(program.player_pos, dir);
}
     
function heartbeat() {
  program.ctx.setTransform(1, 0, 0, 1, 0, 0);
  clear();
  update();
  program.ctx.translate(program.translate[0], program.translate[1]);
  render();

  requestAnimFrame(heartbeat);
}

require(['../ext/domReady!', 'util'], function(d) {
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
});

document.addEventListener('keydown', function(e) {
  var code = e.keyCode;
  console.log(code);

  function add(name) {
    var i = input.keys.indexOf(name);
    if(i == -1) {
      input.keys.push(name);
    }
  }

  if(code == 37) {
    add('left');
  }
  else if(code == 39) {
    add('right');
  }
  else if(code == 38) {
    add('up');
  }
  else if(code == 40) {
    add('down');
  }
});

document.addEventListener('keyup', function(e) {
  var code = e.keyCode;

  function remove(name) {
    var i = input.keys.indexOf(name);
    input.keys.splice(i, 1);
  }

  if(code == 37) {
    remove('left');
  }
  else if(code == 39) {
    remove('right');
  }
  else if(code == 38) {
    remove('up');
  }
  else if(code == 40) {
    remove('down');
  }
});
