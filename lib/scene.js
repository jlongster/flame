
define(['events'], function(events) {

  // Our scene is a simple list for now
  var objects = [];

  function add(name, obj) {
      obj.name = name;
      objects.push(obj);
  }

  function iter(func) {
    var l = objects.length;
    for(var i=0; i<l; i++) {
      func(objects[i]);
    }
  }

  return {
    add: add,
    iter: iter
  }
});
