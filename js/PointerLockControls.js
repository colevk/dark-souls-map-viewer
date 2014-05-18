PointerLockControls = function (object, domElement) {
  var self = this;

  self.enabled = false;

  self.object = object;
  self.object.rotation.order = "YZX";

  self.domElement = ( domElement !== undefined ) ? domElement : document;
  if ( domElement ) self.domElement.setAttribute( 'tabindex', -1 );

  // API

  self.movementSpeed = 10;
  self.movementSpeedMultiplier = 1;
  self.rollSpeed = 2;

  // internals

  self.tmpQuaternion = new THREE.Quaternion();

  self.mouseStatus = 0;

  self.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0 };
  self.moveVector = new THREE.Vector3( 0, 0, 0 );
  self.rotationVector = new THREE.Vector3( 0, 0, 0 );

  var PI_2 = Math.PI / 2;
  var clamp = function (num, min, max) {
    return num < min ? min : (num > max ? max : num);
  }

  self.keydown = function( event ) {

    if ( event.altKey || self.enabled === false) {
      return;
    }

    switch ( event.keyCode ) {

      case 16: /* shift */ self.movementSpeedMultiplier = 10; break;

      case 87: /*W*/ self.moveState.forward = 1; break;
      case 83: /*S*/ self.moveState.back = 1; break;

      case 65: /*A*/ self.moveState.left = 1; break;
      case 68: /*D*/ self.moveState.right = 1; break;

      case 82: /*R*/ self.moveState.up = 1; break;
      case 70: /*F*/ self.moveState.down = 1; break;

    }

    self.updateMovementVector();
    self.updateRotationVector();

  };

  self.keyup = function( event ) {

		if ( self.enabled === false ) return;

    switch( event.keyCode ) {

      case 16: /* shift */ self.movementSpeedMultiplier = 1; break;

      case 87: /*W*/ self.moveState.forward = 0; break;
      case 83: /*S*/ self.moveState.back = 0; break;

      case 65: /*A*/ self.moveState.left = 0; break;
      case 68: /*D*/ self.moveState.right = 0; break;

      case 82: /*R*/ self.moveState.up = 0; break;
      case 70: /*F*/ self.moveState.down = 0; break;

    }

    self.updateMovementVector();
    self.updateRotationVector();

  };

  self.mousemove = function ( event ) {

		if ( self.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		self.moveState.yawLeft = - movementX * 0.1;
		self.moveState.pitchDown = movementY * 0.1;

    self.updateRotationVector();

	};

  self.update = function( delta ) {

    var moveMult = delta * self.movementSpeed * self.movementSpeedMultiplier;
    var rotMult = delta * self.rollSpeed;

    self.object.translateX( self.moveVector.x * moveMult );
    self.object.translateY( self.moveVector.y * moveMult );
    self.object.translateZ( self.moveVector.z * moveMult );

    self.tmpQuaternion.set( self.rotationVector.x * rotMult, self.rotationVector.y * rotMult, self.rotationVector.z * rotMult, 1 ).normalize();
    self.object.quaternion.multiply( self.tmpQuaternion );

    // expose the rotation vector for convenience
    self.object.rotation.setFromQuaternion( self.object.quaternion, self.object.rotation.order );

    // keep view level
    self.object.rotation.z = 0;

    // Don't rotate beyond vertical
    self.object.rotation.x = clamp(self.object.rotation.x, - PI_2, PI_2);

    // View continues to rotate after mouse stops moving
		self.moveState.yawLeft *= 0.8;
		self.moveState.pitchDown *= 0.8;
    self.updateRotationVector();

  };

  self.updateMovementVector = function() {

    self.moveVector.x = ( -self.moveState.left    + self.moveState.right );
    self.moveVector.y = ( -self.moveState.down    + self.moveState.up );
    self.moveVector.z = ( -self.moveState.forward + self.moveState.back );

  };

  self.updateRotationVector = function() {

    self.rotationVector.x = ( -self.moveState.pitchDown + self.moveState.pitchUp );
    self.rotationVector.y = ( -self.moveState.yawRight  + self.moveState.yawLeft );

  };

  window.addEventListener( 'mousemove', self.mousemove, false );

  window.addEventListener( 'keydown', self.keydown, false );
  window.addEventListener( 'keyup', self.keyup, false );

  self.updateMovementVector();
  self.updateRotationVector();
};
