config = (function () {
  var ds1 = {
    "ds1/Anor Londo.iv": true,
    "ds1/Ash Lake.iv": true,
    "ds1/Blighttown + Quelaag's Domain.iv": true,
    "ds1/Catacombs.iv": true,
    "ds1/Darkroot Garden + Basin.iv": true,
    "ds1/Demon Ruins + Lost Izalith.iv": true,
    "ds1/Depths.iv": true,
    "ds1/Duke's Archive + Crystal Caves.iv": true,
    "ds1/Firelink Shrine.iv": true,
    "ds1/Kiln of the First Flame.iv": false,
    "ds1/New Londo Ruins + Valley of Drakes.iv": true,
    "ds1/Oolacile.iv": false,
    "ds1/Painted World of Ariamis.iv": false,
    "ds1/Sen's Fortress.iv": true,
    "ds1/Tomb of the Giants.iv": true,
    "ds1/Undead Asylum.iv": false,
    "ds1/Undead Burg.iv": true,
  };

  var ds2 = {
    "ds2/Aldia's Keep.iv": false,
    "ds2/Brightstone Cove Tseldora + Lord's Private Chamber.iv": false,
    "ds2/Dark Chasm of Old.iv": false,
    "ds2/Doors of Pharros.iv": false,
    "ds2/Dragon Aerie & Dragon Shrine.iv": false,
    "ds2/Dragon Memories.iv": false,
    "ds2/Drangleic Castle + King's Passage + Throne of Want.iv": false,
    "ds2/Forest of Fallen Giants.iv": false,
    "ds2/Grave of Saints.iv": false,
    "ds2/Harvest Valley + Earthen Peak.iv": false,
    "ds2/Heide's Tower of Flame + Cathedral of Blue.iv": false,
    "ds2/Heide's Tower of Flame.iv": false,
    "ds2/Huntsman's Copse + Undead Purgatory.iv": false,
    "ds2/Iron Keep + Belfry Sol.iv": false,
    "ds2/Majula (1).iv": true,
    "ds2/Majula (2).iv": false,
    "ds2/Memory of Vammar, Orro, Jeigh.iv": false,
    "ds2/No-man's Wharf.iv": false,
    "ds2/Shaded Woods + Shrine of Winter.iv": false,
    "ds2/Shrine of Amana.iv": false,
    "ds2/The Gutter + Black Gulch.iv": false,
    "ds2/The Lost Bastille + Sinner's Rise + Belfry Luna.iv": false,
    "ds2/Things Betwixt.iv": false,
    "ds2/Undead Crypt.iv": false,
  };

  var current = ds1;

  var material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wrapAround: true,
  });

  var light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(1, 1, 1).normalize();

  var cameraPosition = new THREE.Vector3(150, 150, -100);

  return {
    ds1: ds1,
    ds2: ds2,
    current: current,
    material: material,
    lights: [light1],
    cameraPosition: cameraPosition,
  };
})();