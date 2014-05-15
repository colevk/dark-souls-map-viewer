Interface = new function () {
  this.setupInterface = function () {
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

  this.toggleBackfaceCulling = function () {
    if (material.side === THREE.DoubleSide) {
      material.side = THREE.FrontSide;
    } else {
      material.side = THREE.DoubleSide;
    }
  }

  this.toggleWrapAround = function () {
    material.uniforms.wrapAround.value = !material.uniforms.wrapAround.value;
  }

  this.toggleNormalShading = function () {
    material.uniforms.normalShading.value = !material.uniforms.normalShading.value;
  }

  this.toggleEdgeHighlighting = function () {
    material.uniforms.edgeHighlight.value = !material.uniforms.edgeHighlight.value;
  }

  this.setEdgeColor = function (color) {
    var tmpColor = new THREE.Color(color);
    material.uniforms.edgeColor.value = new THREE.Vector3(tmpColor.r, tmpColor.g, tmpColor.b);
  }
}