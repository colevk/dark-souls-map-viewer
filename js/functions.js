var vertexNumber = new Float32Array(810000);
for (var i = 0; i < vertexNumber.length; i++) {
  vertexNumber[i] = i % 3;
}


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

        for (var j = 0; j < num_tris; j++) {
          positions[9 * j + 0] = verts[3 * tris[3 * j + 0] + 0];
          positions[9 * j + 1] = verts[3 * tris[3 * j + 0] + 1];
          positions[9 * j + 2] = verts[3 * tris[3 * j + 0] + 2];
          positions[9 * j + 3] = verts[3 * tris[3 * j + 1] + 0];
          positions[9 * j + 4] = verts[3 * tris[3 * j + 1] + 1];
          positions[9 * j + 5] = verts[3 * tris[3 * j + 1] + 2];
          positions[9 * j + 6] = verts[3 * tris[3 * j + 2] + 0];
          positions[9 * j + 7] = verts[3 * tris[3 * j + 2] + 1];
          positions[9 * j + 8] = verts[3 * tris[3 * j + 2] + 2];
        }

        model.attributes = {
          position: {
            itemSize: 3,
            array: positions
          },
          vertexNumber: {
            itemSize: 1,
            array: vertexNumber
          }
        };

        model.computeVertexNormals();
        onloadFunction(model, filename);
      }
    }
  };

  request.open('GET', filename, true);
  request.responseType = 'arraybuffer'
  request.send();
}
