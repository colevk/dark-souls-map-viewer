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
    "ds1/Kiln of the First Flame.iv": true,
    "ds1/New Londo Ruins + Valley of Drakes.iv": true,
    "ds1/Oolacile.iv": true,
    "ds1/Painted World of Ariamis.iv": true,
    "ds1/Sen's Fortress.iv": true,
    "ds1/Tomb of the Giants.iv": true,
    "ds1/Undead Asylum.iv": true,
    "ds1/Undead Burg.iv": true,
  };

  var ds2 = {
    "ds2/Aldia's Keep.iv": true,
    "ds2/Brightstone Cove Tseldora + Lord's Private Chamber.iv": true,
    "ds2/Dark Chasm of Old.iv": true,
    "ds2/Doors of Pharros.iv": true,
    "ds2/Dragon Aerie & Dragon Shrine.iv": true,
    "ds2/Dragon Memories.iv": true,
    "ds2/Drangleic Castle + King's Passage + Throne of Want.iv": true,
    "ds2/Forest of Fallen Giants.iv": true,
    "ds2/Grave of Saints.iv": true,
    "ds2/Harvest Valley + Earthen Peak.iv": true,
    "ds2/Heide's Tower of Flame + Cathedral of Blue.iv": true,
    "ds2/Heide's Tower of Flame.iv": true,
    "ds2/Huntsman's Copse + Undead Purgatory.iv": true,
    "ds2/Iron Keep + Belfry Sol.iv": true,
    "ds2/Majula (1).iv": true,
    "ds2/Majula (2).iv": true,
    "ds2/Memory of Vammar, Orro, Jeigh.iv": true,
    "ds2/No-man's Wharf.iv": true,
    "ds2/Shaded Woods + Shrine of Winter.iv": true,
    "ds2/Shrine of Amana.iv": true,
    "ds2/The Gutter + Black Gulch.iv": true,
    "ds2/The Lost Bastille + Sinner's Rise + Belfry Luna.iv": true,
    "ds2/Things Betwixt.iv": true,
    "ds2/Undead Crypt.iv": true,
  };

  var current = ds1;

  var material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wrapAround: true,
  });

  var light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(1, 1, 1).normalize();

  return {
    ds1: ds1,
    ds2: ds2,
    current: current,
    material: material,
    lights: [light1],
  };
})();