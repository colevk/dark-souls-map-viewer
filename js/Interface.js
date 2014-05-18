/**
 * Create functions to bind to the web interface.
 * @constructor
 * @param {THREE.Scene} scene The scene to render.
 * @param {THREE.Camera} camera The camera.
 * @param {Array.<THREE.Mesh>} meshes All possible meshes to display.
 * @param {BigShaderMaterial} material The shader material.
 * @param {Config} config Config data containing filenames and which files
 *   should be displayed.
 */
function Interface(scene, camera, meshes, material, config) {
  var self = this;

  /**
   * Creates input boxes and hidable divs based on the filenames in config.
   */
  self.setupInterface = function() {
    $('#ds2').toggle();

    for (var i = 0; i < 2; i++) {
      var names = [config.ds1, config.ds2][i];
      var state = [config.ds1State, config.ds2State][i];
      var game = ['ds1', 'ds2'][i];

      for (var j = 0, lenJ = names.length; j < lenJ; j++) {
        var checkbox = $('<input type="checkbox">');
        checkbox.attr('name', game);
        checkbox.attr('value', j);
        if (state[j]) {
          checkbox.attr('checked', '');
        }

        checkbox.change((function(gameNumber, fileNumber) {
          return function () {
            self.addRemove(gameNumber, fileNumber, $(this).is(':checked'));
          }
        })(game, j));

        var label = $('<label>');
        label.append(checkbox);
        label.append($('<span> ' + names[j] + '</span>'));

        $('#' + game).append(label);
      }
    }

    if (material.uniforms.normalShading.value) {
      $('#normalShading').attr('checked', '');
    }

    if (material.uniforms.edgeHighlight.value) {
      $('#edgeHighlight').attr('checked', '');
    }

    if (material.side === THREE.FrontSide) {
      $('#backfaceCulling').attr('checked', '');
    }

    if (material.uniforms.wrapAround.value) {
      $('#wrapAround').attr('checked', '');
    }
  }

  /**
   * Toggle whether or not to show backfaces.
   */
  self.toggleBackfaceCulling = function() {
    if (material.side === THREE.DoubleSide) {
      material.side = THREE.FrontSide;
    } else {
      material.side = THREE.DoubleSide;
    }
  }

  /**
   * Toggle whether lighting should drop to 0 at 90 degrees from light or at
   * 180 degrees from light.
   */
  self.toggleWrapAround = function() {
    material.uniforms.wrapAround.value = !material.uniforms.wrapAround.value;
  }

  /**
   * Toggle displaying the surface normal in place of fragment color.
   */
  self.toggleNormalShading = function() {
    material.uniforms.normalShading.value = !material.uniforms.normalShading.value;
  }

  /**
   * Toggle displaying triangle edges.
   */
  self.toggleEdgeHighlighting = function() {
    material.uniforms.edgeHighlight.value = !material.uniforms.edgeHighlight.value;
  }

  /**
   * Set triangle edge color.
   * @param {string} color A css color string.
   */
  self.setEdgeColor = function(color) {
    var tmpColor = new THREE.Color(color);
    material.uniforms.edgeColor.value = new THREE.Vector3(tmpColor.r, tmpColor.g, tmpColor.b);
  }

  /**
   * Set light source color.
   * @param {string} color A css color string.
   */
  self.setLightColor = function(color) {
    config.light.color = new THREE.Color(color);
  }

  /**
   * Reset camera to its default position and orientation.
   */
  self.resetCamera = function() {
    camera.position = Config.defaultCameraPosition();
    camera.lookAt(Config.defaultCameraLookAt());
  }

  /**
   * Switch to displaying meshes and interface for a different game.
   * @param {string} newGame The identifier for the new game.
   */
  self.swapGames = function(newGame) {
    $('.file-list').hide();
    $('#' + newGame).show();

    var toAdd = [];
    $('input[name=' + newGame + ']:checked').map(function() {
      toAdd.push(parseInt($(this).val()));
    });
    for (var i = 0, lenI = meshes.length; i < lenI; i++) {
      var mesh = meshes[i];
      if (mesh.game === newGame && toAdd.indexOf(mesh.fileNumber) >= 0) {
        scene.add(mesh);
      } else {
        scene.remove(mesh);
      }
    }
  }

  /**
   * Add or remove specified meshes from or to the scene.
   * @param {string} game The identifier for the game the meshes belong to.
   * @param {number} fileNumber The file number the meshes are associated with.
   * @param {boolean} shouldAdd Whether the meshes should be added or removed.
   */
  self.addRemove = function(game, fileNumber, shouldAdd) {
    for (var i = 0, lenI = meshes.length; i < lenI; i++) {
      var mesh = meshes[i];
      if (mesh.game === game && mesh.fileNumber === fileNumber) {
        if (shouldAdd) {
          scene.add(mesh);
        } else {
          scene.remove(mesh);
        }
      }
    }
  }
}