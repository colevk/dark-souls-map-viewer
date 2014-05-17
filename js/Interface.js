Interface = function (scene, camera, meshes, material, config) {
  var self = this;

  self.setupInterface = function () {
    $('#ds2').toggle();

    for (var i = 0; i < 2; i++) {
      var names = [config.ds1, config.ds2][i];
      var state = [config.ds1State, config.ds2State][i];
      var game = ['ds1', 'ds2'][i];

      for (var j = 0; j < names.length; j++) {
        var checkbox = $('<input type="checkbox">');
        checkbox.attr('name', game);
        checkbox.attr('value', j);
        if (state[j]) {
          checkbox.attr('checked', '');
        }

        checkbox.change((function (gameNumber, fileNumber) {
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

  self.toggleBackfaceCulling = function () {
    if (material.side === THREE.DoubleSide) {
      material.side = THREE.FrontSide;
    } else {
      material.side = THREE.DoubleSide;
    }
  }

  self.toggleWrapAround = function () {
    material.uniforms.wrapAround.value = !material.uniforms.wrapAround.value;
  }

  self.toggleNormalShading = function () {
    material.uniforms.normalShading.value = !material.uniforms.normalShading.value;
  }

  self.toggleEdgeHighlighting = function () {
    material.uniforms.edgeHighlight.value = !material.uniforms.edgeHighlight.value;
  }

  self.setEdgeColor = function (color) {
    var tmpColor = new THREE.Color(color);
    material.uniforms.edgeColor.value = new THREE.Vector3(tmpColor.r, tmpColor.g, tmpColor.b);
  }

  self.setLightColor = function (color) {
    config.light.color = new THREE.Color(color);
  }

  self.resetCamera = function () {
    camera.position = Config.defaultCameraPosition();
    camera.lookAt(Config.defaultCameraLookAt());
  }

  self.swapGames = function (currentGame) {
    $('.file-list').hide();
    $('#' + currentGame).show();

    var toAdd = [];
    $('input[name=' + currentGame + ']:checked').map(function () {
      toAdd.push(parseInt($(this).val()));
    });
    for (var i = 0; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh.game === currentGame && toAdd.indexOf(mesh.fileNumber) >= 0) {
        scene.add(mesh);
      } else {
        scene.remove(mesh);
      }
    }
  }

  self.addRemove = function (game, fileNumber, shouldAdd) {
    for (var i = 0; i < meshes.length; i++) {
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