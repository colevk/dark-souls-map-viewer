function loadIVFile(filename, onloadFunction) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      var data = new Uint8Array(request.response);

      var num_models = new Uint32Array(data.buffer.slice(0,4))[0];

      for (var i = 0; i < num_models; i++) {
        var model = new THREE.Geometry();

        var modeldata = new Uint32Array(data.buffer.slice(16 * (i + 1), 16 * (i + 1) + 16));
        var tris_offset  = modeldata[0];
        var num_tris     = modeldata[1] / 3;
        var verts_offset = modeldata[2];
        var num_verts    = modeldata[3];

        var verts = new Float32Array(data.buffer.slice(verts_offset, verts_offset + num_verts * 12));
        for (var j = 0; j < num_verts; j++) {
          model.vertices.push(new THREE.Vector3(verts[3 * j], verts[3 * j + 1], verts[3 * j + 2]));
        }

        var tris = new Uint16Array(data.buffer.slice(tris_offset, tris_offset + num_tris * 6));
        for (var j = 0; j < num_tris; j++) {
          model.faces.push(new THREE.Face3(tris[3 * j], tris[3 * j + 1], tris[3 * j + 2]));
        }

        model.computeFaceNormals();
        model.computeVertexNormals();
        onloadFunction(THREE.BufferGeometryUtils.fromGeometry(model));
      }
    }
  };

  request.open('GET', filename, true);
  request.responseType = 'arraybuffer'
  request.send();
}
