/**
 * Configuration data for setting up the viewer.
 */
Config = new function () {
  // Dark Souls 1 file info.
  this.ds1 = [
    {visible: true, name: "Anor Londo"},
    {visible: true, name: "Ash Lake"},
    {visible: true, name: "Blighttown + Quelaag's Domain"},
    {visible: true, name: "Catacombs"},
    {visible: true, name: "Darkroot Garden + Basin"},
    {visible: true, name: "Demon Ruins + Lost Izalith"},
    {visible: true, name: "Depths"},
    {visible: true, name: "Duke's Archive + Crystal Caves"},
    {visible: true, name: "Firelink Shrine"},
    {visible: false, name: "Kiln of the First Flame"},
    {
      visible: true,
      name: "New Londo Ruins + Valley of Drakes",
      using: [{
        filename: "data/ds1/New Londo Ruins + Valley of Drakes.iv",
        // cut out the abyss because it interferes with Demon Ruins
        chunks: [0, 1, 2, 2, 3],
        tris: [null, null, [0, 10025], [10067, null], null]
      }]
    },
    {
      visible: false,
      name: "Oolacile",
      using: [{
        filename: "data/ds1/Oolacile.iv",
        // Don't include pvp arenas or the boxes used to block off elevators
        chunks: [0, 1, 2, 3, 4, 4, 5, 6, 6],
        tris: [[16022, null], null, null, null, [0, 13063], [18154, 51484],
               [8112, 21384], [3001, 27070], [27310, 29161]]
      }]
    },
    {
      visible: false,
      name: "Oolacile Arenas",
      using: [{
        filename: "data/ds1/Oolacile.iv",
        chunks: [0, 4, 4, 5, 5, 6],
        tris: [[0, 16022], [13063, 18154], [51484, null], [0, 8112],
               [21384, null], [0, 3001]]
      }]
    },
    {visible: false, name: "Painted World of Ariamis"},
    {visible: true, name: "Sen's Fortress"},
    {
      visible: false,
      name: "Tomb of the Giants",
      using: [{
        filename: "data/ds1/Tomb of the Giants.iv",
        // Remove invisible (in-game) pillars blocking view
        chunks: [0, 1],
        tris: [null, [0, 26393]]
      }]
    },
    {visible: false, name: "Undead Asylum"},
    {visible: true, name: "Undead Burg"},
  ];
  _.each(this.ds1, function(info) {
    if (!("using" in info)) {
      info.using = [{ filename: "data/ds1/" + info.name + ".iv"}]
    }
  })

  // Dark Souls 2 file info.
  this.ds2 = [
    {visible: false, name: "Aldia's Keep"},
    {
      visible: false,
      name: "Blue Sentinel Arenas",
      using: [{
        filename: "data/ds2/Heide's Tower of Flame + Cathedral of Blue.iv",
        chunks: [5, 6, 7, 8, 9],
        tris: [null, null, null, null, [0, 17343]]
      }]
    },
    {visible: false, name: "Brightstone Cove Tseldora + Lord's Private Chamber"},
    {
      visible: false,
      name: "Brotherhood of Blood Arenas",
      using: [{
        filename: "data/ds2/Huntsman's Copse + Undead Purgatory.iv",
        chunks: [4, 5, 6],
        tris: [null, null, [0, 25786]]
      }]
    },
    {visible: false, name: "Dark Chasm of Old"},
    {visible: false, name: "Doors of Pharros"},
    {visible: false, name: "Dragon Aerie + Dragon Shrine"},
    {visible: false, name: "Dragon Memories"},
    {visible: false, name: "Drangleic Castle + King's Passage + Throne of Want"},
    {visible: true, name: "Forest of Fallen Giants"},
    {visible: true, name: "Grave of Saints"},
    {
      visible: true,
      name: "Harvest Valley + Earthen Peak",
      using: [{
        // Get rid of weird floating area
        filename: "data/ds2/Harvest Valley + Earthen Peak.iv",
        chunks: [0, 1, 2, 3, 4],
        tris: [null, null, null, [974, null], null]
      }]
    },
    {
      visible: true,
      name: "Heide's Tower of Flame + Cathedral of Blue",
      using: [
        {
          // Don't include covenant arenas
          filename: "data/ds2/Heide's Tower of Flame + Cathedral of Blue.iv",
          chunks: [0, 1, 2, 3, 4, 9, 10],
          tris: [null, null, null, null, null, [17343, null], null]
        },
        {filename: "data/ds2/Heide's Tower of Flame.iv"}
      ]
    },
    {
      visible: true,
      name: "Huntsman's Copse + Undead Purgatory",
      using: [{
        filename: "data/ds2/Huntsman's Copse + Undead Purgatory.iv",
        // Don't include covenant arenas
        chunks: [0, 1, 2, 3, 6, 7],
        tris: [null, null, null, null, [25786, null], null]
      }]
    },
    {visible: true, name: "Iron Keep + Belfry Sol"},
    {
      visible: true,
      name: "Majula",
      using: [
        {filename: "data/ds2/Majula (1).iv"},
        {filename: "data/ds2/Majula (2).iv"}
      ]
    },
    {visible: false, name: "Memory of Vammar, Orro, Jeigh"},
    {visible: true,  name: "No-man's Wharf"},
    {visible: true,  name: "Shaded Woods + Shrine of Winter"},
    {visible: false, name: "Shrine of Amana"},
    {visible: true,  name: "The Gutter + Black Gulch"},
    {visible: false, name: "The Lost Bastille + Sinner's Rise + Belfry Luna"},
    {visible: false, name: "Things Betwixt"},
    {visible: false, name: "Undead Crypt"},
  ];
  _.each(this.ds2, function(info) {
    if (!("using" in info)) {
      info.using = [{ filename: "data/ds2/" + info.name + ".iv"}]
    }
  })

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