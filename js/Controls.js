/**
 * Controls for browsers that support pointer lock. View moves with mouse.
 * @constructor
 * @param {THREE.Object3D} object The object to be moved by the controls.
 * @param {Element} domElement The element where the controls should be active.
 */
function Controls(object, domElement) {
  var self = this;

  self.enabled = false;

  self.object = object;
  self.object.rotation.order = "YZX";

  self.domElement = (domElement !== undefined) ? domElement : document;

  self.movementSpeed = 10;
  self.movementSpeedMultiplier = 1;
  self.rollSpeed = 2;

  self.tmpQuaternion = new THREE.Quaternion();

  self.moveState = {
    up: 0, down: 0,
    left: 0, right: 0,
    forward: 0, back: 0,
    pitchUp: 0, pitchDown: 0,
    yawLeft: 0, yawRight: 0
  };

  self.moveVector = new THREE.Vector3(0, 0, 0);
  self.rotationVector = new THREE.Vector3(0, 0, 0);

  var PI_2 = Math.PI / 2;

  /**
   * Convenience function to clamp a number into a range.
   * @param {number} num
   * @param {number} min
   * @param {number} max
   */
  var clamp = function(num, min, max) {
    return num < min ? min : (num > max ? max : num);
  }

  /**
   * Handles key down events and updates the movement state and vector.
   * @param {object} event The keydown event.
   */
  self.keydown = function(event) {
    if (event.altKey || self.enabled === false) return;

    switch (event.keyCode) {
      case 16: /* shift */ self.movementSpeedMultiplier = 10; break;

      case 87: /*W*/ self.moveState.forward = 1; break;
      case 83: /*S*/ self.moveState.back = 1; break;

      case 65: /*A*/ self.moveState.left = 1; break;
      case 68: /*D*/ self.moveState.right = 1; break;

      case 69: /*E*/ self.moveState.up = 1; break;
      case 81: /*Q*/ self.moveState.down = 1; break;
    }

    self.updateMovementVector();
  };

  /**
   * Handles key down events and resets the movement state and vector.
   * @param {object} event the keyup event.
   */
  self.keyup = function(event) {
    if (self.enabled === false) return;

    switch(event.keyCode) {
      case 16: /* shift */ self.movementSpeedMultiplier = 1; break;

      case 87: /*W*/ self.moveState.forward = 0; break;
      case 83: /*S*/ self.moveState.back = 0; break;

      case 65: /*A*/ self.moveState.left = 0; break;
      case 68: /*D*/ self.moveState.right = 0; break;

      case 69: /*E*/ self.moveState.up = 0; break;
      case 81: /*Q*/ self.moveState.down = 0; break;
    }

    self.updateMovementVector();
  };

  /**
   * Handle the movemouse event by rotating the view directly.
   * @param {object} event The mousemove event.
   */
  self.mousemove = function(event) {
    if (self.enabled === false) return;

    var movementX = event.movementX || 0;
    var movementY = event.movementY || 0;

    self.moveState.yawLeft = -movementX * 0.07;
    self.moveState.pitchDown = movementY * 0.07;

    self.updateRotationVector();
  };

  /**
   * Updates the movement vector based on the current move state.
   */
  self.updateMovementVector = function() {
    self.moveVector.x = -self.moveState.left + self.moveState.right;
    self.moveVector.y = -self.moveState.down + self.moveState.up;
    self.moveVector.z = -self.moveState.forward + self.moveState.back;
  };

  /**
   * Updates the rotation vector based on the current move state.
   */
  self.updateRotationVector = function() {
    self.rotationVector.x = -self.moveState.pitchDown + self.moveState.pitchUp;
    self.rotationVector.y = -self.moveState.yawRight + self.moveState.yawLeft;
  };

  /**
   * Make view slow to a halt in absence of mouse movement.
   * @param {number} delta The time since the last update.
   */
  self.adjust = function(delta) {
    self.moveState.yawLeft *= Math.pow(0.8, delta * 60);
    self.moveState.pitchDown *= Math.pow(0.8, delta * 60);
    self.updateRotationVector();
  }

  /**
   * Update the object's position and rotation based on the movement and
   *   rotation vectors and on how much time has passed.
   * @param {number} delta The time since the last update.
   */
  self.update = function(delta) {
    var moveMult = delta * self.movementSpeed * self.movementSpeedMultiplier;
    var rotMult = delta * self.rollSpeed;

    self.object.translateX(self.moveVector.x * moveMult);
    self.object.translateY(self.moveVector.y * moveMult);
    self.object.translateZ(self.moveVector.z * moveMult);

    self.tmpQuaternion.set(self.rotationVector.x * rotMult,
                           self.rotationVector.y * rotMult,
                           self.rotationVector.z * rotMult,
                           1).normalize();
    self.object.quaternion.multiply(self.tmpQuaternion);

    // Expose the rotation vector for convenience.
    self.object.rotation.setFromQuaternion(self.object.quaternion, self.object.rotation.order);

    // Keep view level.
    self.object.rotation.z = 0;

    // Don't rotate beyond vertical.
    self.object.rotation.x = clamp(self.object.rotation.x, -PI_2, PI_2);

    // Perform any other adjustments
    self.adjust(delta);
  };

  // Bind handlers to events.
  window.addEventListener('mousemove', self.mousemove, false);
  window.addEventListener('keydown', self.keydown, false);
  window.addEventListener('keyup', self.keyup, false);

};
