/**
 * Configuration data for setting up the viewer.
 */
Config = new function () {
  // Dark Souls 1 filenames.
  this.ds1 = [
    {visible: true,  name: "Anor Londo"},
    {visible: true,  name: "Ash Lake"},
    {visible: true,  name: "Blighttown + Quelaag's Domain"},
    {visible: true,  name: "Catacombs"},
    {visible: true,  name: "Darkroot Garden + Basin"},
    {visible: true,  name: "Demon Ruins + Lost Izalith"},
    {visible: true,  name: "Depths"},
    {visible: true,  name: "Duke's Archive + Crystal Caves"},
    {visible: true,  name: "Firelink Shrine"},
    {visible: false, name: "Kiln of the First Flame"},
    {visible: true,  name: "New Londo Ruins + Valley of Drakes"},
    {visible: false, name: "Oolacile"},
    {visible: false, name: "Painted World of Ariamis"},
    {visible: true,  name: "Sen's Fortress"},
    {visible: true,  name: "Tomb of the Giants"},
    {visible: false, name: "Undead Asylum"},
    {visible: true,  name: "Undead Burg"},
  ];

  // Dark Souls 2 filenames.
  this.ds2 = [
    {visible: false, name: "Aldia's Keep"},
    {visible: false, name: "Brightstone Cove Tseldora + Lord's Private Chamber"},
    {visible: false, name: "Dark Chasm of Old"},
    {visible: false, name: "Doors of Pharros"},
    {visible: false, name: "Dragon Aerie & Dragon Shrine"},
    {visible: false, name: "Dragon Memories"},
    {visible: false, name: "Drangleic Castle + King's Passage + Throne of Want"},
    {visible: true,  name: "Forest of Fallen Giants"},
    {visible: true,  name: "Grave of Saints"},
    {visible: false, name: "Harvest Valley + Earthen Peak"},
    {visible: true,  name: "Heide's Tower of Flame + Cathedral of Blue"},
    {visible: true,  name: "Heide's Tower of Flame"},
    {visible: false, name: "Huntsman's Copse + Undead Purgatory"},
    {visible: false, name: "Iron Keep + Belfry Sol"},
    {visible: true,  name: "Majula (1)"},
    {visible: true,  name: "Majula (2)"},
    {visible: false, name: "Memory of Vammar, Orro, Jeigh"},
    {visible: true,  name: "No-man's Wharf"},
    {visible: true,  name: "Shaded Woods + Shrine of Winter"},
    {visible: false, name: "Shrine of Amana"},
    {visible: true,  name: "The Gutter + Black Gulch"},
    {visible: false, name: "The Lost Bastille + Sinner's Rise + Belfry Luna"},
    {visible: false, name: "Things Betwixt"},
    {visible: false, name: "Undead Crypt"},
  ];

  // Basic lighting.
  this.light = new THREE.DirectionalLight(0xffffff);
  this.light.position.set(1, 2, 3);

  // Default camera position for best view
  this.defaultCameraPosition = function () {
    return new THREE.Vector3(-20, 40, 0);
  }

  // Default camera direction for best view
  this.defaultCameraLookAt = function () {
    return new THREE.Vector3(-100, 0, 40);
  }
};