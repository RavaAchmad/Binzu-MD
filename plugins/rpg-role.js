let handler = m => m

handler.before = function (m) {
  let user = global.db.data.users[m.sender]
  
  // Define the new role thresholds and names.
  const roles = [
    { level: 0, name: 'Warrior V' }, { level: 4, name: 'Warrior IV' }, { level: 8, name: 'Warrior III' }, { level: 12, name: 'Warrior II' }, { level: 16, name: 'Warrior I' },
    { level: 20, name: 'Paladin V' }, { level: 24, name: 'Paladin IV' }, { level: 28, name: 'Paladin III' }, { level: 32, name: 'Paladin II' }, { level: 36, name: 'Paladin I' },
    { level: 40, name: 'Sorcerer V' }, { level: 44, name: 'Sorcerer IV' }, { level: 48, name: 'Sorcerer III' }, { level: 52, name: 'Sorcerer II' }, { level: 56, name: 'Sorcerer I' },
    { level: 60, name: 'Ranger V' }, { level: 64, name: 'Ranger IV' }, { level: 68, name: 'Ranger III' }, { level: 72, name: 'Ranger II' }, { level: 76, name: 'Ranger I' },
    { level: 80, name: 'Mage V' }, { level: 84, name: 'Mage IV' }, { level: 88, name: 'Mage III' }, { level: 92, name: 'Mage II' }, { level: 96, name: 'Mage I' },
    { level: 100, name: 'Cleric V' }, { level: 104, name: 'Cleric IV' }, { level: 108, name: 'Cleric III' }, { level: 112, name: 'Cleric II' }, { level: 116, name: 'Cleric I' },
    { level: 120, name: 'Thief V' }, { level: 124, name: 'Thief IV' }, { level: 128, name: 'Thief III' }, { level: 132, name: 'Thief II' }, { level: 136, name: 'Thief I' },
    { level: 140, name: 'Assassin V' }, { level: 144, name: 'Assassin IV' }, { level: 148, name: 'Assassin III' }, { level: 152, name: 'Assassin II' }, { level: 156, name: 'Assassin I' },
    { level: 160, name: 'Monk V' }, { level: 164, name: 'Monk IV' }, { level: 168, name: 'Monk III' }, { level: 172, name: 'Monk II' }, { level: 176, name: 'Monk I' },
    { level: 180, name: 'Bard V' }, { level: 184, name: 'Bard IV' }, { level: 188, name: 'Bard III' }, { level: 192, name: 'Bard II' }, { level: 196, name: 'Bard I' },
    { level: 200, name: 'Necromancer V' }, { level: 204, name: 'Necromancer IV' }, { level: 208, name: 'Necromancer III' }, { level: 212, name: 'Necromancer II' }, { level: 216, name: 'Necromancer I' },
    { level: 220, name: 'Warlock V' }, { level: 224, name: 'Warlock IV' }, { level: 228, name: 'Warlock III' }, { level: 232, name: 'Warlock II' }, { level: 236, name: 'Warlock I' },
    { level: 240, name: 'Wizard V' }, { level: 244, name: 'Wizard IV' }, { level: 248, name: 'Wizard III' }, { level: 252, name: 'Wizard II' }, { level: 256, name: 'Wizard I' },
    { level: 260, name: 'Sage V' }, { level: 264, name: 'Sage IV' }, { level: 268, name: 'Sage III' }, { level: 272, name: 'Sage II' }, { level: 276, name: 'Sage I' },
    { level: 280, name: 'Priest V' }, { level: 284, name: 'Priest IV' }, { level: 288, name: 'Priest III' }, { level: 292, name: 'Priest II' }, { level: 296, name: 'Priest I' },
    { level: 300, name: 'Rogue V' }, { level: 304, name: 'Rogue IV' }, { level: 308, name: 'Rogue III' }, { level: 312, name: 'Rogue II' }, { level: 316, name: 'Rogue I' },
    { level: 320, name: 'Brawler V' }, { level: 324, name: 'Brawler IV' }, { level: 328, name: 'Brawler III' }, { level: 332, name: 'Brawler II' }, { level: 336, name: 'Brawler I' },
    { level: 340, name: 'Archer V' }, { level: 344, name: 'Archer IV' }, { level: 348, name: 'Archer III' }, { level: 352, name: 'Archer II' }, { level: 356, name: 'Archer I' },
    { level: 360, name: 'Sniper V' }, { level: 364, name: 'Sniper IV' }, { level: 368, name: 'Sniper III' }, { level: 372, name: 'Sniper II' }, { level: 376, name: 'Sniper I' },
    { level: 380, name: 'Ninja V' }, { level: 384, name: 'Ninja IV' }, { level: 388, name: 'Ninja III' }, { level: 392, name: 'Ninja II' }, { level: 396, name: 'Ninja I' },
    { level: 400, name: 'Samurai V' }, { level: 404, name: 'Samurai IV' }, { level: 408, name: 'Samurai III' }, { level: 412, name: 'Samurai II' }, { level: 416, name: 'Samurai I' },
    { level: 420, name: 'Berserker V' }, { level: 424, name: 'Berserker IV' }, { level: 428, name: 'Berserker III' }, { level: 432, name: 'Berserker II' }, { level: 436, name: 'Berserker I' },
    { level: 440, name: 'Legend V' }, { level: 444, name: 'Legend IV' }, { level: 448, name: 'Legend III' }, { level: 452, name: 'Legend II' }, { level: 456, name: 'Legend I' },
    { level: 460, name: 'Champion V' }, { level: 464, name: 'Champion IV' }, { level: 468, name: 'Champion III' }, { level: 472, name: 'Champion II' }, { level: 476, name: 'Champion I' },
    { level: 480, name: 'Grandmaster V' }, { level: 484, name: 'Grandmaster IV' }, { level: 488, name: 'Grandmaster III' }, { level: 492, name: 'Grandmaster II' }, { level: 496, name: 'Grandmaster I' },
    { level: 500, name: 'Elder V' }, { level: 504, name: 'Elder IV' }, { level: 508, name: 'Elder III' }, { level: 512, name: 'Elder II' }, { level: 516, name: 'Elder I' },
    { level: 520, name: 'Immortal V' }, { level: 524, name: 'Immortal IV' }, { level: 528, name: 'Immortal III' }, { level: 532, name: 'Immortal II' }, { level: 536, name: 'Immortal I' },
    { level: 540, name: 'Nephalem V' }, { level: 544, name: 'Nephalem IV' }, { level: 548, name: 'Nephalem III' }, { level: 552, name: 'Nephalem II' }, { level: 556, name: 'Nephalem I' },
    { level: 560, name: 'Eternal V' }, { level: 564, name: 'Eternal IV' }, { level: 568, name: 'Eternal III' }, { level: 572, name: 'Eternal II' }, { level: 576, name: 'Eternal I' },
    { level: 580, name: 'Neptune V' }, { level: 584, name: 'Neptune IV' }, { level: 588, name: 'Neptune III' }, { level: 592, name: 'Neptune II' }, { level: 596, name: 'Neptune I' },
    { level: 600, name: 'Pluto V' }, { level: 604, name: 'Pluto IV' }, { level: 608, name: 'Pluto III' }, { level: 612, name: 'Pluto II' }, { level: 616, name: 'Pluto I' },
    { level: 620, name: 'Eris V' }, { level: 624, name: 'Eris IV' }, { level: 628, name: 'Eris III' }, { level: 632, name: 'Eris II' }, { level: 636, name: 'Eris I' },
    { level: 640, name: 'Ascension V' }, { level: 644, name: 'Ascension IV' }, { level: 648, name: 'Ascension III' }, { level: 652, name: 'Ascension II' }, { level: 656, name: 'Ascension I' },
    { level: 660, name: 'Elysium V' }, { level: 664, name: 'Elysium IV' }, { level: 668, name: 'Elysium III' }, { level: 672, name: 'Elysium II' }, { level: 676, name: 'Elysium I' },
    { level: 680, name: 'Ether V' }, { level: 684, name: 'Ether IV' }, { level: 688, name: 'Ether III' }, { level: 692, name: 'Ether II' }, { level: 696, name: 'Ether I' },
    { level: 700, name: 'Gaea V' }, { level: 704, name: 'Gaea IV' }, { level: 708, name: 'Gaea III' }, { level: 712, name: 'Gaea II' }, { level: 716, name: 'Gaea I' },
    { level: 720, name: 'Hades V' }, { level: 724, name: 'Hades IV' }, { level: 728, name: 'Hades III' }, { level: 732, name: 'Hades II' }, { level: 736, name: 'Hades I' },
    { level: 740, name: 'Heimdall V' }, { level: 744, name: 'Heimdall IV' }, { level: 748, name: 'Heimdall III' }, { level: 752, name: 'Heimdall II' }, { level: 756, name: 'Heimdall I' },
    { level: 760, name: 'Hyperion V' }, { level: 764, name: 'Hyperion IV' }, { level: 768, name: 'Hyperion III' }, { level: 772, name: 'Hyperion II' }, { level: 776, name: 'Hyperion I' },
    { level: 780, name: 'Iris V' }, { level: 784, name: 'Iris IV' }, { level: 788, name: 'Iris III' }, { level: 792, name: 'Iris II' }, { level: 796, name: 'Iris I' },
    { level: 800, name: 'Jupiter V' }, { level: 804, name: 'Jupiter IV' }, { level: 808, name: 'Jupiter III' }, { level: 812, name: 'Jupiter II' }, { level: 816, name: 'Jupiter I' },
    { level: 820, name: 'Kronos V' }, { level: 824, name: 'Kronos IV' }, { level: 828, name: 'Kronos III' }, { level: 832, name: 'Kronos II' }, { level: 836, name: 'Kronos I' },
    { level: 840, name: 'Lilith V' }, { level: 844, name: 'Lilith IV' }, { level: 848, name: 'Lilith III' }, { level: 852, name: 'Lilith II' }, { level: 856, name: 'Lilith I' },
    { level: 860, name: 'Maelstrom V' }, { level: 864, name: 'Maelstrom IV' }, { level: 868, name: 'Maelstrom III' }, { level: 872, name: 'Maelstrom II' }, { level: 876, name: 'Maelstrom I' },
    { level: 880, name: 'Nova V' }, { level: 884, name: 'Nova IV' }, { level: 888, name: 'Nova III' }, { level: 892, name: 'Nova II' }, { level: 896, name: 'Nova I' },
    { level: 900, name: 'Odin V' }, { level: 904, name: 'Odin IV' }, { level: 908, name: 'Odin III' }, { level: 912, name: 'Odin II' }, { level: 916, name: 'Odin I' },
    { level: 920, name: 'Osiris V' }, { level: 924, name: 'Osiris IV' }, { level: 928, name: 'Osiris III' }, { level: 932, name: 'Osiris II' }, { level: 936, name: 'Osiris I' },
    { level: 940, name: 'Poseidon V' }, { level: 944, name: 'Poseidon IV' }, { level: 948, name: 'Poseidon III' }, { level: 952, name: 'Poseidon II' }, { level: 956, name: 'Poseidon I' },
    { level: 960, name: 'Ragnarok V' }, { level: 964, name: 'Ragnarok IV' }, { level: 968, name: 'Ragnarok III' }, { level: 972, name: 'Ragnarok II' }, { level: 976, name: 'Ragnarok I' },
    { level: 980, name: 'Saturn V' }, { level: 984, name: 'Saturn IV' }, { level: 988, name: 'Saturn III' }, { level: 992, name: 'Saturn II' }, { level: 996, name: 'Saturn I' },
    { level: 1000, name: 'Titan V' }, { level: 1004, name: 'Titan IV' }, { level: 1008, name: 'Titan III' }, { level: 1012, name: 'Titan II' }, { level: 1016, name: 'Titan I' },
    { level: 1020, name: 'Uranus V' }, { level: 1024, name: 'Uranus IV' }, { level: 1028, name: 'Uranus III' }, { level: 1032, name: 'Uranus II' }, { level: 1036, name: 'Uranus I' },
    { level: 1040, name: 'Venus V' }, { level: 1044, name: 'Venus IV' }, { level: 1048, name: 'Venus III' }, { level: 1052, name: 'Venus II' }, { level: 1056, name: 'Venus I' },
    { level: 1060, name: 'Zeus V' }, { level: 1064, name: 'Zeus IV' }, { level: 1068, name: 'Zeus III' }, { level: 1072, name: 'Zeus II' }, { level: 1076, name: 'Zeus I' }
  ]
  
  // Determine the appropriate role based on user.level.
  let role = roles[0].name
  for (const r of roles) {
    if (user.level >= r.level) role = r.name
    else break
  }
  user.role = role
  return true
}

export default handler
