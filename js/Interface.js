Interface = new function () {
  var self = this;

  self.setupInterface = function () {
    $('#ds2').toggle();

    ds1State = Config.ds1State;
    ds2State = Config.ds2State;

    for (var i = 0; i < Config.ds1.length; i++) {
      var checked = ds1State[i] ? ' checked' : '';
      var elem = $('<label><input type="checkbox" name="ds1" value="' +
                  i + '"' + checked +'><span>' + Config.ds1[i] +
                  '</span><br></label>')

      $('#ds1').append(elem);
    }

    for (var i = 0; i < Config.ds2.length; i++) {
      var checked = ds2State[i] ? ' checked' : '';
      var elem = $('<label><input type="checkbox" name="ds2" value="' +
                  i + '"' + checked +'><span>' + Config.ds2[i] +
                  '</span><br></label>')

      $('#ds2').append(elem);
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

    currentGame = (currentGame === 'ds1') ? 'ds2' : 'ds1';
    var newState = (currentGame === 'ds1') ? ds1State : ds2State

    for (var i = 0; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh.game !== currentGame) {
        scene.remove(mesh);
      } else if (newState[mesh.fileNumber]) {
        scene.add(mesh);
      }
    }
  }

  self.addRemove = function () {
    var newState = [];
    var oldState = (currentGame === 'ds1') ? ds1State : ds2State;
    $('input[name=' + currentGame +']:checked').each(function () {
      newState[parseInt(this.value)] = true;
    });
    var toAdd = [];
    var toRemove = [];
    for (var i = 0; i < oldState.length; i++) {
      if (newState[i] === undefined) { newState[i] = false; }
      if (newState[i] && ! oldState[i]) {
        toAdd.push(i);
        oldState[i] = true;
      } else if (! newState[i] && oldState[i]) {
        toRemove.push(i);
        oldState[i] = false;
      }
    }

    for (var i = 0; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh.game === currentGame) {
        if (toAdd.indexOf(mesh.fileNumber) >= 0) {
          scene.add(mesh);
        } else if (toRemove.indexOf(mesh.fileNumber) >= 0) {
          scene.remove(mesh);
        }
      }
    }
  }
}