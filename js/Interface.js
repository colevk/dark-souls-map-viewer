/**
 * Create functions to bind to the web interface.
 * @constructor
 * @param {THREE.Scene} scene The scene to render.
 * @param {THREE.Camera} camera The camera.
 * @param {Array.<THREE.Mesh>} meshes All possible meshes to display.
 * @param {BigShaderMaterial} material The shader material.
 * @param {THREE.DirectionalLight} light The scene's light source.
 * @param {Config} config Config data containing filenames and which files
 *   should be displayed.
 */
function Interface(scene, camera, meshes, material, light, config) {
  var self = this;

  /**
   * Creates input boxes and hidable divs based on the filenames in config.
   */
  self.setupInterface = function() {
    $('#ds2').toggle();

    for (var i = 0; i < 2; i++) {
      var info = [config.ds1, config.ds2][i];
      var game = ['ds1', 'ds2'][i];

      for (var j = 0, lenJ = info.length; j < lenJ; j++) {
        var checkbox = $('<input type="checkbox">');
        checkbox.attr('name', game);
        checkbox.attr('value', j);
        if (info[j].visible) {
          checkbox.attr('checked', '');
        }

        checkbox.change((function(gameNumber, fileNumber) {
          return function () {
            self.addRemove(gameNumber, fileNumber, $(this).is(':checked'));
          }
        })(game, j));

        var label = $('<label>');
        label.append(checkbox);
        label.append($('<span> ' + info[j].name + '</span>'));
        label.append($('<br>'));

        $('#' + game).append(label);
      }
    }

    $('#light-x').val(light.position.x);
    $('#light-y').val(light.position.y);
    $('#light-z').val(light.position.z);

    $('#edgeColor').val('#' + material.uniforms.edgeColor.value.getHexString());
    $('#lightColor').val('#' + config.light.color.getHexString());

    if (material.uniforms.normalShading.value) {
      $('#normalShading').attr('checked', '');
    }

    if (material.uniforms.edgeHighlight.value) {
      $('#edgeHighlight').attr('checked', '');
    }

    if (material.uniforms.edgeAttenuation.value) {
      $('#edgeAttenuation').attr('checked', '');
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
    material.uniforms.normalShading.value =
      !material.uniforms.normalShading.value;
  }

  /**
   * Toggle displaying triangle edges.
   */
  self.toggleEdgeHighlighting = function() {
    material.uniforms.edgeHighlight.value =
      !material.uniforms.edgeHighlight.value;
  }

  /**
   * Toggle attenuating edge highlighting with distance.
   */
  self.toggleEdgeAttenuation = function() {
    material.uniforms.edgeAttenuation.value =
      !material.uniforms.edgeAttenuation.value;
  }

  /**
   * Set triangle edge color.
   * @param {string} color A css color string.
   */
  self.setEdgeColor = function(color) {
    material.uniforms.edgeColor.value = new THREE.Color(color);
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
    camera.position.copy(Config.defaultCameraPosition());
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

  /**
   * Set the position of the scene light. If a null is provided, value is
   *   unchanged.
   * @param {number} x X position of the light. Can be null.
   * @param {number} y Y position of the light. Can be null.
   * @param {number} z Z position of the light. Can be null.
   */
  self.setLightPos = function(x, y, z) {
    x = x || light.position.x;
    y = y || light.position.y;
    z = z || light.position.z;
    light.position.set(x, y, z);
  }
}