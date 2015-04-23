var sidebar, canvas, renderer, clock, scene, camera, controls, material,
    meshes, light, iface;

/**
 * Create and set all global variables and controls
 */
function init() {
  sidebar = $('#sidebar');
  canvas = $('#canvas');

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(canvas.width(), canvas.height());
  canvas.append(renderer.domElement);

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  material = BigShaderMaterial;

  camera = new THREE.PerspectiveCamera(75, canvas.width() / canvas.height(), 0.1, 10000);

  // Reset aspect ratio when window is resized
  $(window).resize(function() {
    renderer.setSize(canvas.width(), canvas.height());
    camera.aspect = canvas.width() / canvas.height();
    camera.updateProjectionMatrix();
  })

  controls = new Controls(camera, renderer.domElement);

  var element = canvas.get()[0];

  // Enable controls only when pointer is locked.
  var pointerlockchange = function() {
    controls.enabled = (document.pointerLockElement === element)
  }

  // Hook pointer lock state change events
  document.addEventListener('pointerlockchange', pointerlockchange, false);

  canvas.click(function() {
    element.requestPointerLock();
  });

  // Pointer lock exit must be manual in Chrome Apps
  $(document).keyup(function(e) {
    if (e.which == 27) {
      document.exitPointerLock();
    }
  })

  camera.position.copy(Config.defaultCameraPosition());
  camera.lookAt(Config.defaultCameraLookAt());

  meshes = [];

  // Load Dark Souls 1 files into meshes, annotated with the game and file
  // that they are associated with.
  for (var i = 0, lenI = Config.ds1.length; i < lenI; i++) {
    (function(fileNumber) { // pass loop variable into scope
      function loadFunc(bufferGeometry) {
        var mesh = new THREE.Mesh(bufferGeometry, BigShaderMaterial);
        mesh.game = 'ds1';
        mesh.fileNumber = fileNumber;
        meshes.push(mesh);

        // Make default files visible.
        if (Config.ds1[fileNumber].visible) { scene.add(mesh); }
      };

      _.each(Config.ds1[fileNumber].using, function(using) {
        SceneLoader.loadIVFile(using, loadFunc)
      });
    })(i);
  }

  // Load Dark Souls 2 files into meshes, annotated with the game and file
  // that they are associated with.
  for (var i = 0, lenI = Config.ds2.length; i < lenI; i++) {
    (function(fileNumber) { // pass loop variable into scope
      function loadFunc(bufferGeometry) {
        var mesh = new THREE.Mesh(bufferGeometry, BigShaderMaterial);
        mesh.game = 'ds2';
        mesh.fileNumber = fileNumber;
        meshes.push(mesh);
      };

      _.each(Config.ds2[fileNumber].using, function(using) {
        SceneLoader.loadIVFile(using, loadFunc)
      });
    })(i);
  }

  light = Config.light;
  scene.add(light);
}

/**
 * Render the scene and update controls.
 */
function render() {
  requestAnimationFrame(render);

  controls.update(clock.getDelta());
  renderer.render(scene, camera);
};

$(document).ready(function() {
  init();
  iface = new Interface(scene, camera, meshes, material, light, Config);
  iface.setupInterface();
  render();

  new ResizeSensor($('#sidebar'), function() {
    canvas.css('margin-left', sidebar.css('width'));
    renderer.setSize(canvas.width(), canvas.height());
    camera.aspect = canvas.width() / canvas.height();
    camera.updateProjectionMatrix();
  });

  $('#normalShading').change(iface.toggleNormalShading);
  $('#edgeHighlight').change(iface.toggleEdgeHighlighting);
  $('#edgeAttenuation').change(iface.toggleEdgeAttenuation);
  $('#backfaceCulling').change(iface.toggleBackfaceCulling);
  $('#wrapAround').change(iface.toggleWrapAround);

  $('#edgeColor').change(function() { iface.setEdgeColor(this.value); });
  $('#lightColor').change(function() { iface.setLightColor(this.value); });

  $('#light-x').change(function() { iface.setLightPos(this.value, null, null); });
  $('#light-y').change(function() { iface.setLightPos(null, this.value, null); });
  $('#light-z').change(function() { iface.setLightPos(null, null, this.value); });

  $('#resetCamera').click(iface.resetCamera);
  $('#swapGames').change(function() { iface.swapGames(this.value); });
});

