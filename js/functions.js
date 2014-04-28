function loadIVFile(filename, onloadFunction) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      var data = new Uint8Array(request.response);

      var num_models = new Uint32Array(data.buffer.slice(0,4))[0];

      for (var i = 0; i < num_models; i++) {
        var model = new THREE.BufferGeometry();

        var modeldata = new Uint32Array(data.buffer.slice(16 * (i + 1), 16 * (i + 1) + 16));
        var tris_offset  = modeldata[0];
        var num_tris     = modeldata[1] / 3;
        var verts_offset = modeldata[2];
        var num_verts    = modeldata[3];

        var verts = new Float32Array(data.buffer.slice(verts_offset, verts_offset + num_verts * 12));
        var tris = new Uint16Array(data.buffer.slice(tris_offset, tris_offset + num_tris * 6));

        var positions = new Float32Array(num_tris * 9);
        var normals = new Float32Array(num_tris * 9);

        // calculate normals and expand vertices
        for (var j = 0; j < num_tris; j++) {
          var v1 = tris[3 * j + 0],
              v2 = tris[3 * j + 1],
              v3 = tris[3 * j + 2];

          positions[9 * j + 0] = verts[3 * v1 + 0];
          positions[9 * j + 1] = verts[3 * v1 + 1];
          positions[9 * j + 2] = verts[3 * v1 + 2];

          positions[9 * j + 3] = verts[3 * v2 + 0];
          positions[9 * j + 4] = verts[3 * v2 + 1];
          positions[9 * j + 5] = verts[3 * v2 + 2];

          positions[9 * j + 6] = verts[3 * v3 + 0];
          positions[9 * j + 7] = verts[3 * v3 + 1];
          positions[9 * j + 8] = verts[3 * v3 + 2];

          var v1_x = verts[3 * v2 + 0] - verts[3 * v1 + 0],
              v1_y = verts[3 * v2 + 1] - verts[3 * v1 + 1],
              v1_z = verts[3 * v2 + 2] - verts[3 * v1 + 2];

          var v2_x = verts[3 * v3 + 0] - verts[3 * v2 + 0],
              v2_y = verts[3 * v3 + 1] - verts[3 * v2 + 1],
              v2_z = verts[3 * v3 + 2] - verts[3 * v2 + 2];

          normals[9 * j + 0] = normals[9 * j + 3] = normals[9 * j + 6] = v1_y * v2_z - v1_z * v2_y;
          normals[9 * j + 1] = normals[9 * j + 4] = normals[9 * j + 7] = v1_z * v2_x - v1_x * v2_z;
          normals[9 * j + 2] = normals[9 * j + 5] = normals[9 * j + 8] = v1_x * v2_y - v1_y * v2_x;
        }

        model.attributes = {
          position: {
            itemSize: 3,
            array: positions
          },
          normal: {
            itemSize: 3,
            array: normals
          }
        };

        model.normalizeNormals();
        onloadFunction(model);
      }
    }
  };

  request.open('GET', filename, true);
  request.responseType = 'arraybuffer'
  request.send();
}
