/**
 * Holds the iv file loading function and some helper variables.
 */
SceneLoader = new function() {
  var self = this;

  // To be passed as a attribute to the shader, to be used in edge detection.
  // Always the same, so shared between all geometries.
  var vertexNumber = new Float32Array(810000);
  for (var i = 0, lenI = vertexNumber.length; i < lenI; i++) {
    vertexNumber[i] = i % 3;
  }

  /**
   * Loads an iv file asychronously, puts it into a number of
   *   THREE.BufferGeometry, and performs a callback when it's done.
   * @param {string} filename Location of the file.
   * @param {function(THREE.BufferGeometry)} onloadFunction Callback to perform
   *   on the loaded BufferGeometries.
   */
  self.loadIVFile = function(using, onloadFunction) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        var data = new Uint8Array(request.response);

        var num_models = new Uint32Array(data.buffer.slice(0,4))[0];

        // Load only some chunks in file if specified
        var chunks;
        if ('chunks' in using) {
          chunks = using.chunks;
        } else {
          chunks = Array.apply(null, {length: num_models}).map(Number.call, Number);
        }

        // Load only some triangles in chunk if specified
        var chunk_tri_bounds;
        if ('tris' in using) {
          chunk_tri_bounds = _.map(using.tris, function(t) {
            return (t == null) ? [null, null] : t;
          });
        } else {
          chunk_tri_bounds = _.map(chunks, function(c) { return [null, null]; });
        }

        _.each(_.zip(chunks, chunk_tri_bounds), function(chunk_info) {
          var i = chunk_info[0];
          var tri_range = chunk_info[1];

          var model = new THREE.BufferGeometry();

          var modeldata = new Uint32Array(data.buffer.slice(16 * (i + 1), 16 * (i + 1) + 16));
          var tris_offset  = modeldata[0];
          // modeldata[1] is number of vertex indices.
          var num_tris     = modeldata[1] / 3;
          var verts_offset = modeldata[2];
          var num_verts    = modeldata[3];

          var verts = new Float32Array(data.buffer.slice(verts_offset, verts_offset + num_verts * 12));
          var tris = new Uint16Array(data.buffer.slice(tris_offset, tris_offset + num_tris * 6));

          var start = tri_range[0] || 0;
          var end = tri_range[1] || num_tris;
          var positions = new Float32Array((end - start) * 9);

          // Explode vertices, as we want non-shared attributes for normals
          // and for vertex numbering.
          for (var j = start; j < end; j++) {
            positions[9 * (j - start) + 0] = verts[3 * tris[3 * j + 0] + 0];
            positions[9 * (j - start) + 1] = verts[3 * tris[3 * j + 0] + 1];
            positions[9 * (j - start) + 2] = verts[3 * tris[3 * j + 0] + 2];
            positions[9 * (j - start) + 3] = verts[3 * tris[3 * j + 1] + 0];
            positions[9 * (j - start) + 4] = verts[3 * tris[3 * j + 1] + 1];
            positions[9 * (j - start) + 5] = verts[3 * tris[3 * j + 1] + 2];
            positions[9 * (j - start) + 6] = verts[3 * tris[3 * j + 2] + 0];
            positions[9 * (j - start) + 7] = verts[3 * tris[3 * j + 2] + 1];
            positions[9 * (j - start) + 8] = verts[3 * tris[3 * j + 2] + 2];
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
          onloadFunction(model);
        });
      }
    };

    request.open('GET', using.filename, true);
    request.responseType = 'arraybuffer'
    request.send();
  }
}
