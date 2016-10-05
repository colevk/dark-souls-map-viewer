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
            for (var k = 0; k < 9; k++) {
              positions[9 * (j - start) + k] = verts[3 * tris[3 * j + Math.floor(k / 3)] + k % 3]
            }
          }

          model.addAttribute('position', new THREE.BufferAttribute(positions, 3));
          model.addAttribute('vertexNumber', new THREE.BufferAttribute(vertexNumber, 1));

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
