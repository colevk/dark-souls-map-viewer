Config = new function () {
  this.ds1 = [
    "Anor Londo",
    "Ash Lake",
    "Blighttown + Quelaag's Domain",
    "Catacombs",
    "Darkroot Garden + Basin",
    "Demon Ruins + Lost Izalith",
    "Depths",
    "Duke's Archive + Crystal Caves",
    "Firelink Shrine",
    "Kiln of the First Flame",
    "New Londo Ruins + Valley of Drakes",
    "Oolacile",
    "Painted World of Ariamis",
    "Sen's Fortress",
    "Tomb of the Giants",
    "Undead Asylum",
    "Undead Burg",
  ];

  this.ds2 = [
    "Aldia's Keep",
    "Brightstone Cove Tseldora + Lord's Private Chamber",
    "Dark Chasm of Old",
    "Doors of Pharros",
    "Dragon Aerie & Dragon Shrine",
    "Dragon Memories",
    "Drangleic Castle + King's Passage + Throne of Want",
    "Forest of Fallen Giants",
    "Grave of Saints",
    "Harvest Valley + Earthen Peak",
    "Heide's Tower of Flame + Cathedral of Blue",
    "Heide's Tower of Flame",
    "Huntsman's Copse + Undead Purgatory",
    "Iron Keep + Belfry Sol",
    "Majula (1)",
    "Majula (2)",
    "Memory of Vammar, Orro, Jeigh",
    "No-man's Wharf",
    "Shaded Woods + Shrine of Winter",
    "Shrine of Amana",
    "The Gutter + Black Gulch",
    "The Lost Bastille + Sinner's Rise + Belfry Luna",
    "Things Betwixt",
    "Undead Crypt",
  ];

  this.light = new THREE.DirectionalLight(0xffffff);
  this.light.position.set(1, 0, 0).normalize();
};