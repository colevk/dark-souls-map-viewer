var sidebar, canvas, renderer, clock, scene, camera, controls, material,
    meshes, light, iface;

/**
 * Create and set all global variables and controls
 */
function init() {
  sidebar = $('#sidebar');
  canvas = $('#canvas');

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvas.width(), canvas.height());
  canvas.append(renderer.domElement);

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  material = BigShaderMaterial;

  camera = new THREE.PerspectiveCamera( 75, canvas.width() / canvas.height(), 0.1, 10000 );

  // Reset aspect ratio when window is resized
  $(window).resize(function() {
    renderer.setSize(canvas.width(), canvas.height());
    camera.aspect = canvas.width() / canvas.height();
    camera.updateProjectionMatrix();
  })

  var havePointerLock = 'pointerLockElement' in document ||
                        'mozPointerLockElement' in document ||
                        'webkitPointerLockElement' in document;

  // Only use pointer lock controls if browser supports them
  if (havePointerLock) {
    controls = new PointerLockControls(camera, renderer.domElement);

    var element = canvas.get()[0];

    // Enable controls only when pointer is locked.
			var pointerlockchange = function() {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					controls.enabled = true;
				} else {
					controls.enabled = false;
				}
			}

			// Hook pointer lock state change events
			document.addEventListener('pointerlockchange', pointerlockchange, false);
			document.addEventListener('mozpointerlockchange', pointerlockchange, false);
			document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

			canvas.click(function() {
				element.requestPointerLock = element.requestPointerLock ||
                                   element.mozRequestPointerLock ||
                                   element.webkitRequestPointerLock;
				element.requestPointerLock();
			});
  } else {
    // Use backup controls
    controls = new NoPointerLockControls(camera, renderer.domElement);
  }

  camera.position = Config.defaultCameraPosition();
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
        if (Config.ds1State[fileNumber]) { scene.add(mesh); }
      };

      SceneLoader.loadIVFile('data/ds1/' + Config.ds1[i] + '.iv', loadFunc);
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

      SceneLoader.loadIVFile('data/ds2/' + Config.ds2[i] + '.iv', loadFunc);
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

/**
 * Determine if browser supports WebGL.
 */
function hasWebGL() {
  try {
    var canvas = document.createElement('canvas');
    return !! window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch(e) {
    return false;
  }
}

$(document).ready(function() {
  if (hasWebGL()) {
    // Run the program.
    init();
    iface = new Interface(scene, camera, meshes, material, light, Config);
    iface.setupInterface();
    render();
  } else {
    // Provide error message
    var element = document.createElement( 'div' );
    element.style.textAlign = 'center';
    element.style.padding = '1.5em';
    element.style['padding-top'] = '6.5em';
    element.style.width = '450px';
    element.style.margin = 'auto';

    element.innerHTML = window.WebGLRenderingContext ?
      'Your graphics card does not seem to support WebGL.' :
      'Your browser does not seem to support WebGL';

    canvas.appendChild(element);
  }

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

