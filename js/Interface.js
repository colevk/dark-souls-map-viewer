Interface = new function () {
  var self = this;

  self.setupInterface = function () {
    $('#ds2').toggle();

    for (var i = 0; i < 2; i++) {
      var names = [Config.ds1, Config.ds2][i];
      var state = [Config.ds1State, Config.ds2State][i];
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
        label.append($('<span>' + names[j] + '</span>'));
        label.append($('<br>'));

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
    Config.light.color = new THREE.Color(color);
  }

  self.resetCamera = function () {
    camera.position = Config.defaultCameraPosition();
    camera.lookAt(Config.defaultCameraLookAt());
  }

  self.swapGames = function () {
    $('#ds1').toggle();
    $('#ds2').toggle();

    var toRemove = [];
    $('input[name=' + currentGame + ']:checked').each(function () {
      toRemove.push(parseInt($(this).val()));
    });
    for (var i = 0; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh.game === currentGame && toRemove.indexOf(mesh.fileNumber) >= 0) {
        scene.remove(mesh);
      }
    }

    currentGame = (currentGame === 'ds1') ? 'ds2' : 'ds1';

    var toAdd = [];
    $('input[name=' + currentGame + ']:checked').map(function () {
      toAdd.push(parseInt($(this).val()));
    });
    for (var i = 0; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh.game === currentGame && toAdd.indexOf(mesh.fileNumber) >= 0) {
        scene.add(mesh);
      }
    }
  }

  self.addRemove = function (game, fileNumber, shouldAdd) {
    var addRemoveFunc;
    if (shouldAdd) {
      addRemoveFunc = function (mesh) { scene.add(mesh); }
    } else {
      addRemoveFunc = function (mesh) { scene.remove(mesh); }
    }

    for (var i = 0; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh.game === game && mesh.fileNumber === fileNumber) {
        addRemoveFunc(mesh);
      }
    }
  }
}