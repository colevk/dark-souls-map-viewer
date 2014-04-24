function init() {
  
}

function loadIVFile(filename, onloadFunction) {
  var request = new XMLHttpRequest();
  
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      var data = new Uint8Array(request.response);

      var num_models = jspack.Unpack('<I', data)[0];

      for (var i = 0; i < num_models; i++) {
        var model = new THREE.Geometry();

        var modeldata = jspack.Unpack('<IIII', data, 16 * (i + 1));
        var tris_offset  = modeldata[0];
        var num_tris     = modeldata[1] / 3;
        var verts_offset = modeldata[2];
        var num_verts    = modeldata[3];

        for (var j = 0; j < num_verts; j++) {
          var vert = jspack.Unpack('<fff', data, verts_offset + (j * 12));
          model.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
        }

        for (var j = 0; j < num_tris; j++) {
          var tri = jspack.Unpack('<HHH', data, tris_offset + (j * 6));
          model.faces.push(new THREE.Face3(tri[0], tri[1], tri[2]));
        }

        model.computeFaceNormals();
        onloadFunction(THREE.BufferGeometryUtils.fromGeometry(model));
      }
    }
  };
  
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer'
  request.send();
}
