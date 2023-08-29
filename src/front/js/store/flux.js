const items_data = {
  "Energy Cores": {
    "Alpha Core": { "Base Cost": 50, "Current Cost": 50, Rank: 1 },
    "Fusion Core": { "Base Cost": 700, "Current Cost": 500, Rank: 5 },
    "Omega Core": { "Base Cost": 30, "Current Cost": 30, Rank: 25 },
  },
  Nanomaterials: {
    NanoMesh: { "Base Cost": 100, "Current Cost": 100, Rank: 1 },
    HyperWeave: { "Base Cost": 1000, "Current Cost": 1000, Rank: 5 },
    "Quantum Fabric": { "Base Cost": 50000, "Current Cost": 50000, Rank: 30 },
  },
  "Cybernetic Implants": {
    NeuroLink: { "Base Cost": 200, "Current Cost": 200, Rank: 1 },
    SynthArm: { "Base Cost": 2500, "Current Cost": 2500, Rank: 10 },
    OmegaBrain: { "Base Cost": 100000, "Current Cost": 100000, Rank: 35 },
  },
  "Quantum Data Cubes": {
    "Data Shard": { "Base Cost": 300, "Current Cost": 300, Rank: 1 },
    "Quantum Node": { "Base Cost": 4000, "Current Cost": 4000, Rank: 15 },
    "Infinity Matrix": {
      "Base Cost": 500000,
      "Current Cost": 500000,
      Rank: 40,
    },
  },
  "Advanced Medicines": {
    BioPatch: { "Base Cost": 400, "Current Cost": 400, Rank: 1 },
    NanoSyringe: { "Base Cost": 8000, "Current Cost": 8000, Rank: 15 },
    RegenGen: { "Base Cost": 1000000, "Current Cost": 1000000, Rank: 45 },
  },
  "Quantum Encryption Keys": {
    Cryptex: { "Base Cost": 500, "Current Cost": 500, Rank: 1 },
    "Quantum Lock": { "Base Cost": 20000, "Current Cost": 20000, Rank: 20 },
    "Omega Seal": { "Base Cost": 5000000, "Current Cost": 5000000, Rank: 50 },
  },
};

const missionsData = {
  "Asteroid Mining": {
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 3000,
    Experience: 75,
    Rank: 1,
    requiredEquipment: {
      "Spectral Analyzer": 1,
    },
    "Health Effect": 10,
    startMessage:
      "E.c.h.o.: Heading towards the asteroid belt for mining operations.",
    successMessage:
      "E.c.h.o.: Successfully mined precious resources from the asteroid, gaining 3000 credits and 75 experience.",
    failureMessage:
      "E.c.h.o.: Mining operations were not successful. Better luck next time.",
  },
  "Space Salvage": {
    "Required Credits": 1500,
    "Required Energy": 15,
    Reward: 4500,
    Experience: 112,
    Rank: 3,
    requiredEquipment: {
      "Environmental Suit": 1,
    },
    "Health Effect": 12,
    startMessage: "E.c.h.o.: Scanning space debris for valuable salvage.",
    successMessage:
      "E.c.h.o.: Salvage successful. Recovered items translated to 4500 credits and 112 experience.",
    failureMessage:
      "E.c.h.o.: Salvage mission was unsuccessful. Nothing of value found.",
  },
  "Alien Artifact Retrieval": {
    "Required Credits": 2200,
    "Required Energy": 22,
    Reward: 6600,
    Experience: 165,
    Rank: 6,
    requiredEquipment: {
      "Alien Skin Armor": 1,
    },
    "Health Effect": 14,
    startMessage:
      "E.c.h.o.: Setting coordinates to a rumored alien artifact location.",
    successMessage:
      "E.c.h.o.: Artifact retrieved successfully, granting you 6600 credits and 165 experience.",
    failureMessage:
      "E.c.h.o.: The mission to retrieve the alien artifact failed. It seems we were not the only ones after it.",
  },
  "Galactic Trading": {
    "Required Credits": 3000,
    "Required Energy": 30,
    Reward: 9000,
    Experience: 225,
    Rank: 8,
    requiredEquipment: {
      "Hover Board": 1,
      "Spectral Analyzer": 1,
    },
    "Health Effect": 16,
    startMessage:
      "E.c.h.o.: Initiating trading protocols with neighboring galactic entities.",
    successMessage:
      "E.c.h.o.: Trade successful. The profits earned you 9000 credits and 225 experience.",
    failureMessage:
      "E.c.h.o.: The trade negotiation failed. No profits this time.",
  },
  "Deep Space Exploration": {
    "Required Credits": 4000,
    "Required Energy": 40,
    Reward: 12000,
    Experience: 300,
    Rank: 10,
    requiredEquipment: {
      "Basic Ship": 2,
    },
    "Health Effect": 18,
    startMessage:
      "E.c.h.o.: Preparing for a deep-space exploration mission to uncharted territories.",
    successMessage:
      "E.c.h.o.: Exploration successful. New regions charted and you earned 12000 credits and 300 experience.",
    failureMessage:
      "E.c.h.o.: The exploration mission faced unforeseen challenges. No new data collected.",
  },

  "Starship Racing": {
    "Required Credits": 5200,
    "Required Energy": 50,
    Reward: 15600,
    Experience: 390,
    Rank: 12,
    requiredEquipment: {
      "Star Ship": 1,
      "Environmental Suit": 1,
    },
    "Health Effect": 20,
    startMessage:
      "E.c.h.o.: Enrolling in the intergalactic starship racing event.",
    successMessage:
      "E.c.h.o.: You won the race! Credited 15600 credits and 390 experience for your performance.",
    failureMessage:
      "E.c.h.o.: It was a tough race. Didn't make it to the top this time.",
  },
  "Rescue Operation": {
    "Required Credits": 6500,
    "Required Energy": 60,
    Reward: 19500,
    Experience: 487,
    Rank: 14,
    requiredEquipment: {
      "Scout Drone": 2,
      "Environmental Suit": 2,
      "Oxygen Rebreather": 2,
    },
    "Health Effect": 22,
    startMessage:
      "E.c.h.o.: Picking up distress signals. Initiating rescue protocols.",
    successMessage:
      "E.c.h.o.: Rescue successful! You've been credited with 19500 credits and 487 experience.",
    failureMessage:
      "E.c.h.o.: The rescue operation faced challenges. Not everyone made it back.",
  },
  "Black Hole Research": {
    "Required Credits": 8000,
    "Required Energy": 75,
    Reward: 24000,
    Experience: 600,
    Rank: 16,
    requiredEquipment: {
      "Star Ship": 10,
      "Spectral Analyzer": 10,
    },
    "Health Effect": 24,
    startMessage:
      "E.c.h.o.: Approaching the event horizon for black hole research.",
    successMessage:
      "E.c.h.o.: Data collected successfully. Your findings yielded 24000 credits and 600 experience.",
    failureMessage:
      "E.c.h.o.: The black hole's gravity was stronger than anticipated. Research was compromised.",
  },
  "Celestial Diplomacy": {
    "Required Credits": 10000,
    "Required Energy": 90,
    Reward: 30000,
    Experience: 750,
    Rank: 18,
    requiredEquipment: {
      "Holo Clone": 10,
      "Invisi Veil": 20,
    },
    "Health Effect": 26,
    startMessage:
      "E.c.h.o.: Establishing communication channels for diplomatic discussions with alien civilizations.",
    successMessage:
      "E.c.h.o.: Diplomacy successful. Established friendly relations and earned 30000 credits and 750 experience.",
    failureMessage:
      "E.c.h.o.: The diplomatic mission did not go as planned. The aliens were not receptive.",
  },

  "Galaxy Defense": {
    "Required Credits": 12000,
    "Required Energy": 110,
    Reward: 36000,
    Experience: 900,
    Rank: 20,
    requiredEquipment: {
      "Cyber Armor": 4,
      "Interdimensional Cruiser": 2,
    },
    "Health Effect": 28,
    startMessage:
      "E.c.h.o.: Alert! Hostile forces detected. Preparing for defense.",
    successMessage:
      "E.c.h.o.: Galaxy successfully defended. Your bravery has earned you 36000 credits and 900 experience.",
    failureMessage:
      "E.c.h.o.: The galaxy defense was challenging. Some areas suffered damage.",
  },
  "Quantum Mechanics Mastery": {
    "Required Credits": 14500,
    "Required Energy": 130,
    Reward: 43500,
    Experience: 1087,
    Rank: 22,
    requiredEquipment: {
      "Teleporter Beacon": 10,
    },
    "Health Effect": 30,
    startMessage: "E.c.h.o.: Initiating deep dive into quantum mechanics.",
    successMessage:
      "E.c.h.o.: Successfully mastered quantum mechanics! Earned 43500 credits and 1087 experience.",
    failureMessage:
      "E.c.h.o.: Quantum Mechanics is perplexing. Couldn't completely grasp the concept.",
  },
  "Interstellar Exploration": {
    "Required Credits": 17500,
    "Required Energy": 150,
    Reward: 52500,
    Experience: 1312,
    Rank: 24,
    requiredEquipment: {
      "Cyber Armor": 4,
      "Porta Lab": 5,
      "Plasma Blade": 2,
    },
    "Health Effect": 32,
    startMessage:
      "E.c.h.o.: Setting course for uncharted territories in the interstellar realm.",
    successMessage:
      "E.c.h.o.: Exploration successful! Discovered new systems and earned 52500 credits and 1312 experience.",
    failureMessage:
      "E.c.h.o.: The uncharted territories proved challenging. Exploration was not fully successful.",
  },
  "Temporal Anomaly Research": {
    "Required Credits": 21000,
    "Required Energy": 175,
    Reward: 63000,
    Experience: 1575,
    Rank: 26,
    requiredEquipment: {
      "Porta Lab": 4,
      "Terrain Scanner": 5,
    },
    "Health Effect": 34,
    startMessage: "E.c.h.o.: Detected a temporal anomaly. Commencing research.",
    successMessage:
      "E.c.h.o.: Successfully researched the temporal anomaly! Rewarded 63000 credits and 1575 experience.",
    failureMessage:
      "E.c.h.o.: The temporal anomaly was unstable. Research faced setbacks.",
  },
  "Galactic Archaeology": {
    "Required Credits": 25000,
    "Required Energy": 200,
    Reward: 75000,
    Experience: 1875,
    Rank: 28,
    requiredEquipment: {
      "Porta Lab": 4,
      "Terrain Scanner": 5,
      "Bio Collector": 10,
    },
    "Health Effect": 36,
    startMessage:
      "E.c.h.o.: Embarking on a quest to uncover the mysteries of ancient galactic civilizations.",
    successMessage:
      "E.c.h.o.: Successful excavation! Unearthed artifacts worth 75000 credits and 1875 experience.",
    failureMessage:
      "E.c.h.o.: The ruins were labyrinthine and perplexing. Some artifacts remain elusive.",
  },

  "Universe Origins Study": {
    "Required Credits": 30000,
    "Required Energy": 230,
    Reward: 90000,
    Experience: 2250,
    Rank: 30,
    requiredEquipment: {
      "Cyber Armor": 4,
      "Plasma Blade": 5,
      "Interdimensional Cruiser": 5,
    },
    "Health Effect": 38,
    startMessage:
      "E.c.h.o.: Launching probe to research the origins of the universe.",
    successMessage:
      "E.c.h.o.: Significant discoveries made! Earned 90000 credits and 2250 experience.",
    failureMessage:
      "E.c.h.o.: The vastness of the universe is overwhelming. Some mysteries remain unsolved.",
  },
  "Exodimensional Expedition": {
    "Required Credits": 35000,
    "Required Energy": 260,
    Reward: 105000,
    Experience: 2625,
    Rank: 32,
    requiredEquipment: {
      "Invisi Veil": 4,
      "Teleporter Beacon": 5,
      "Terrain Scanner": 2,
    },
    "Health Effect": 40,
    startMessage:
      "E.c.h.o.: Preparing to venture into exodimensions. Unknown challenges await.",
    successMessage:
      "E.c.h.o.: Successfully navigated the exodimensions! Secured 105000 credits and 2625 experience.",
    failureMessage:
      "E.c.h.o.: The exodimensions are unpredictable. Could not complete the mission.",
  },
  "Dark Matter Manipulation": {
    "Required Credits": 41000,
    "Required Energy": 290,
    Reward: 123000,
    Experience: 3075,
    Rank: 34,
    requiredEquipment: {
      "Teleporter Beacon": 40,
      "Interdimensional Cruiser": 5,
      "Porta Lab": 3,
    },
    "Health Effect": 42,
    startMessage: "E.c.h.o.: Initiating procedures to manipulate dark matter.",
    successMessage:
      "E.c.h.o.: Dark matter manipulation successful! Acquired 123000 credits and 3075 experience.",
    failureMessage:
      "E.c.h.o.: Failed to control the elusive dark matter. Mission aborted.",
  },
  "Galactic Diplomacy": {
    "Required Credits": 48000,
    "Required Energy": 320,
    Reward: 144000,
    Experience: 3600,
    Rank: 36,
    requiredEquipment: {
      "Invisi Veil": 50,
    },
    "Health Effect": 44,
    startMessage:
      "E.c.h.o.: Engaging in diplomatic talks with advanced extraterrestrial civilizations.",
    successMessage:
      "E.c.h.o.: Diplomacy successful! Strengthened interstellar ties and earned 144000 credits and 3600 experience.",
    failureMessage:
      "E.c.h.o.: Diplomatic talks were challenging. Not all objectives achieved.",
  },
  "Void Phenomenon Analysis": {
    "Required Credits": 56000,
    "Required Energy": 350,
    Reward: 168000,
    Experience: 4200,
    Rank: 38,
    requiredEquipment: {
      "Porta Lab": 40,
      "Cyber Armor": 3,
      "Teleporter Beacon": 5,
    },
    "Health Effect": 46,
    startMessage: "E.c.h.o.: Commencing analysis of mysterious void phenomena.",
    successMessage:
      "E.c.h.o.: Analysis complete! Deciphered void secrets and obtained 168000 credits and 4200 experience.",
    failureMessage:
      "E.c.h.o.: The void remains enigmatic. Analysis was inconclusive.",
  },

  "Cosmic Nexus Activation": {
    "Required Credits": 65000,
    "Required Energy": 385,
    Reward: 195000,
    Experience: 4875,
    Rank: 40,
    requiredEquipment: {
      "Teleporter Beacon": 4,
      "Bio Collector": 50,
      "Cyber Armor": 4,
    },
    "Health Effect": 48,
    startMessage:
      "E.c.h.o.: Initiating protocols to activate the cosmic nexus.",
    successMessage:
      "E.c.h.o.: Cosmic Nexus activated! Gained 195000 credits and 4875 experience.",
    failureMessage:
      "E.c.h.o.: The cosmic nexus proved too complex. Activation failed.",
  },
  "Temporal Loop Investigation": {
    "Required Credits": 75000,
    "Required Energy": 420,
    Reward: 225000,
    Experience: 5625,
    Rank: 42,
    requiredEquipment: {
      "Hover Board": 40,
      "Invisi Veil": 50,
      "Alien Skin Armor": 20,
      "Basic Ship": 10,
    },
    "Health Effect": 50,
    startMessage:
      "E.c.h.o.: Preparing to investigate disturbances in the temporal loop.",
    successMessage:
      "E.c.h.o.: Temporal loop stabilized! Retrieved 225000 credits and 5625 experience.",
    failureMessage:
      "E.c.h.o.: Time anomalies detected. Investigation proved challenging.",
  },
  "Nebular Storm Navigation": {
    "Required Credits": 86000,
    "Required Energy": 460,
    Reward: 258000,
    Experience: 6450,
    Rank: 44,
    requiredEquipment: {
      "Jet Pack": 40,
      "Steel Machete": 50,
      "Basic Ship": 10,
      "Oxygen Rebreather": 10,
    },
    "Health Effect": 52,
    startMessage:
      "E.c.h.o.: Initiating navigation through a tumultuous nebular storm.",
    successMessage:
      "E.c.h.o.: Successfully navigated the storm! Acquired 258000 credits and 6450 experience.",
    failureMessage:
      "E.c.h.o.: Nebular turbulence too intense. Navigation unsuccessful.",
  },
  "Celestial Artifact Retrieval": {
    "Required Credits": 98000,
    "Required Energy": 500,
    Reward: 294000,
    Experience: 7350,
    Rank: 46,
    requiredEquipment: {
      "Hover Board": 4,
      "Jet Pack": 5,
      "Plasma Blade": 12,
      "Environmental Suit": 10,
    },
    "Health Effect": 54,
    startMessage:
      "E.c.h.o.: Mission is to retrieve a rare celestial artifact from an ancient site.",
    successMessage:
      "E.c.h.o.: Artifact secured! Obtained 294000 credits and 7350 experience.",
    failureMessage:
      "E.c.h.o.: Artifact retrieval mission faced unforeseen challenges.",
  },
  "Supernova Containment": {
    "Required Credits": 110000,
    "Required Energy": 550,
    Reward: 330000,
    Experience: 8250,
    Rank: 48,
    requiredEquipment: {
      "Cyber Armor": 6,
      "Interdimensional Cruiser": 5,
      "Teleporter Beacon": 10,
      "Spectral Analyzer": 10,
    },
    "Health Effect": 56,
    startMessage:
      "E.c.h.o.: Attempting to contain the imminent supernova and harness its energy.",
    successMessage:
      "E.c.h.o.: Supernova successfully contained! 330000 credits and 8250 experience gained.",
    failureMessage:
      "E.c.h.o.: Supernova containment measures failed. Energy release was catastrophic.",
  },
  "Black Hole Mapping": {
    "Required Credits": 124000,
    "Required Energy": 600,
    Reward: 372000,
    Experience: 9300,
    Rank: 50,
    requiredEquipment: {
      "Interdimensional Cruiser": 5,
      "Teleporter Beacon": 10,
      "Spectral Analyzer": 10,
      "Scout Drone": 10,
      "Bio Collector": 5,
      "Cyber Armor": 10,
    },
    "Health Effect": 58,
    startMessage:
      "E.c.h.o.: Launching probes to map the event horizon of a black hole.",
    successMessage:
      "E.c.h.o.: Successful mapping! Collected valuable data and 372000 credits along with 9300 experience.",
    failureMessage:
      "E.c.h.o.: Probes lost to the gravitational pull. Black hole mapping unsuccessful.",
  },
};

const propertiesData = {
  "Energy Labs": {
    "Fusion Facility": {
      "Base Cost": 2000,
      "Current Cost": 2000,
      "Item Generated": "Alpha Core",
      "Generation Rate": 1,
      Rank: 4,
    },
    "Quantum Lab": {
      "Base Cost": 4000,
      "Current Cost": 4000,
      "Item Generated": "Fusion Core",
      "Generation Rate": 1,
      Rank: 8,
    },
    "Omega Factory": {
      "Base Cost": 8000,
      "Current Cost": 8000,
      "Item Generated": "Omega Core",
      "Generation Rate": 1,
      Rank: 28,
    },
    "Fusion Supercollider": {
      "Base Cost": 16000,
      "Current Cost": 16000,
      "Item Generated": "Alpha Core",
      "Generation Rate": 1,
      Rank: 20,
    },
    "Quantum Superlab": {
      "Base Cost": 32000,
      "Current Cost": 32000,
      "Item Generated": "Fusion Core",
      "Generation Rate": 1,
      Rank: 20,
    },
    "Omega MegaFactory": {
      "Base Cost": 64000,
      "Current Cost": 64000,
      "Item Generated": "Omega Core",
      "Generation Rate": 1,
      Rank: 30,
    },
  },
  "Nano Production Sites": {
    "NanoMesh Plant": {
      "Base Cost": 2500,
      "Current Cost": 2500,
      "Item Generated": "NanoMesh",
      "Generation Rate": 1,
      Rank: 4,
    },
    "HyperWeave Workshop": {
      "Base Cost": 5000,
      "Current Cost": 5000,
      "Item Generated": "HyperWeave",
      "Generation Rate": 1,
      Rank: 8,
    },
    "Quantum Fabric Loom": {
      "Base Cost": 10000,
      "Current Cost": 10000,
      "Item Generated": "Quantum Fabric",
      "Generation Rate": 1,
      Rank: 33,
    },
    "NanoMesh MegaPlant": {
      "Base Cost": 20000,
      "Current Cost": 20000,
      "Item Generated": "NanoMesh",
      "Generation Rate": 1,
      Rank: 10,
    },
    "HyperWeave MegaWorkshop": {
      "Base Cost": 40000,
      "Current Cost": 40000,
      "Item Generated": "HyperWeave",
      "Generation Rate": 1,
      Rank: 20,
    },
    "Quantum Fabric MegaLoom": {
      "Base Cost": 80000,
      "Current Cost": 80000,
      "Item Generated": "Quantum Fabric",
      "Generation Rate": 1,
      Rank: 30,
    },
  },
  "Cybernetic Clinics": {
    "NeuroLink Clinic": {
      "Base Cost": 3000,
      "Current Cost": 3000,
      "Item Generated": "NeuroLink",
      "Generation Rate": 1,
      Rank: 4,
    },
    "SynthArm Surgery": {
      "Base Cost": 6000,
      "Current Cost": 6000,
      "Item Generated": "SynthArm",
      "Generation Rate": 1,
      Rank: 8,
    },
    "OmegaBrain Center": {
      "Base Cost": 12000,
      "Current Cost": 12000,
      "Item Generated": "OmegaBrain",
      "Generation Rate": 1,
      Rank: 28,
    },
    "NeuroLink MegaClinic": {
      "Base Cost": 24000,
      "Current Cost": 24000,
      "Item Generated": "NeuroLink",
      "Generation Rate": 1,
      Rank: 15,
    },
    "SynthArm MegaSurgery": {
      "Base Cost": 48000,
      "Current Cost": 48000,
      "Item Generated": "SynthArm",
      "Generation Rate": 1,
      Rank: 20,
    },
    "OmegaBrain MegaCenter": {
      "Base Cost": 96000,
      "Current Cost": 96000,
      "Item Generated": "OmegaBrain",
      "Generation Rate": 1,
      Rank: 30,
    },
  },
  "Data Cube Manufactures": {
    "Data Shard Factory": {
      "Base Cost": 3500,
      "Current Cost": 3500,
      "Item Generated": "Data Shard",
      "Generation Rate": 1,
      Rank: 4,
    },
    "Quantum Node Works": {
      "Base Cost": 7000,
      "Current Cost": 7000,
      "Item Generated": "Quantum Node",
      "Generation Rate": 1,
      Rank: 8,
    },
    "Infinity Matrix Hub": {
      "Base Cost": 14000,
      "Current Cost": 14000,
      "Item Generated": "Infinity Matrix",
      "Generation Rate": 1,
      Rank: 28,
    },
    "Data Shard MegaFactory": {
      "Base Cost": 28000,
      "Current Cost": 28000,
      "Item Generated": "Data Shard",
      "Generation Rate": 1,
      Rank: 15,
    },
    "Quantum Node MegaWorks": {
      "Base Cost": 56000,
      "Current Cost": 56000,
      "Item Generated": "Quantum Node",
      "Generation Rate": 1,
      Rank: 25,
    },
    "Infinity Matrix MegaHub": {
      "Base Cost": 112000,
      "Current Cost": 112000,
      "Item Generated": "Infinity Matrix",
      "Generation Rate": 1,
      Rank: 35,
    },
  },
  "Medical Facilities": {
    "BioPatch Pharmacy": {
      "Base Cost": 4000,
      "Current Cost": 4000,
      "Item Generated": "BioPatch",
      "Generation Rate": 1,
      Rank: 4,
    },
    "NanoSyringe Clinic": {
      "Base Cost": 8000,
      "Current Cost": 8000,
      "Item Generated": "NanoSyringe",
      "Generation Rate": 1,
      Rank: 8,
    },
    "RegenGen Hospital": {
      "Base Cost": 16000,
      "Current Cost": 16000,
      "Item Generated": "RegenGen",
      "Generation Rate": 1,
      Rank: 28,
    },
    "BioPatch MegaPharmacy": {
      "Base Cost": 32000,
      "Current Cost": 32000,
      "Item Generated": "BioPatch",
      "Generation Rate": 1,
      Rank: 15,
    },
    "NanoSyringe MegaClinic": {
      "Base Cost": 64000,
      "Current Cost": 64000,
      "Item Generated": "NanoSyringe",
      "Generation Rate": 1,
      Rank: 25,
    },
    "RegenGen MegaHospital": {
      "Base Cost": 128000,
      "Current Cost": 128000,
      "Item Generated": "RegenGen",
      "Generation Rate": 1,
      Rank: 35,
    },
  },
  "Encryption Enterprises": {
    "Cryptex Workshop": {
      "Base Cost": 5000,
      "Current Cost": 5000,
      "Item Generated": "Cryptex",
      "Generation Rate": 1,
      Rank: 4,
    },
    "Quantum Lock Forge": {
      "Base Cost": 10000,
      "Current Cost": 10000,
      "Item Generated": "Quantum Lock",
      "Generation Rate": 1,
      Rank: 26,
    },
    "Omega Seal Center": {
      "Base Cost": 20000,
      "Current Cost": 20000,
      "Item Generated": "Omega Seal",
      "Generation Rate": 1,
      Rank: 28,
    },
    "Cryptex MegaWorkshop": {
      "Base Cost": 40000,
      "Current Cost": 40000,
      "Item Generated": "Cryptex",
      "Generation Rate": 1,
      Rank: 25,
    },
    "Quantum Lock MegaForge": {
      "Base Cost": 80000,
      "Current Cost": 80000,
      "Item Generated": "Quantum Lock",
      "Generation Rate": 1,
      Rank: 35,
    },
    "Omega Seal MegaCenter": {
      "Base Cost": 160000,
      "Current Cost": 160000,
      "Item Generated": "Omega Seal",
      "Generation Rate": 1,
      Rank: 40,
    },
  },
};

const healthRecoveryItems = {
  Health: {
    "HealPulse Emitter": {
      Cost: 2000,
      "Health Gain": 25,
      "Energy Gain": 0,
      Rank: 1,
      Cooldown: 25,
    },
    "VitalWave Device": {
      Cost: 6000,
      "Health Gain": 50,
      "Energy Gain": 0,
      Rank: 10,
      Cooldown: 50,
    },
    "Phoenix Resurrect Kit": {
      Cost: 10000,
      "Health Gain": 100,
      "Energy Gain": 0,
      Rank: 15,
      Cooldown: 150,
    },
  },

  Energy: {
    "EnergyStim Injector": {
      Cost: 5000,
      "Health Gain": 0,
      "Energy Gain": 25,
      Rank: 1,
      Cooldown: 25,
    },
    "PowerPulse Capsule": {
      Cost: 8000,
      "Health Gain": 0,
      "Energy Gain": 50,
      Rank: 10,
      Cooldown: 50,
    },
    "Quantum Energy Kit": {
      Cost: 14000,
      "Health Gain": 0,
      "Energy Gain": 100,
      Rank: 15,
      Cooldown: 150,
    },
  },
  Combo: {
    "NanoMed Injector": {
      Cost: 6000,
      "Health Gain": 20,
      "Energy Gain": 20,
      Rank: 5,
      Cooldown: 30,
    },
    "RegenBoost Capsule": {
      Cost: 15000,
      "Health Gain": 45,
      "Energy Gain": 45,
      Rank: 10,
      Cooldown: 60,
    },
    "Omega Recovery Kit": {
      Cost: 22000,
      "Health Gain": 95,
      "Energy Gain": 95,
      Rank: 20,
      Cooldown: 100,
    },
  },
};
const equipmentItems = {
  Research: {
    "Spectral Analyzer": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Bio Collector": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Porta Lab": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Weapons: {
    "Steel Machete": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Laser Sword": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Plasma Blade": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Armor: {
    "Alien Skin Armor": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Metalloid Armor": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Cyber Armor": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Tech: {
    "Scout Drone": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Holo Clone": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Invisi Veil": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Transports: {
    "Hover Board": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Jet Pack": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Teleporter Beacon": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Exploration: {
    "Environmental Suit": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Oxygen Rebreather": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Terrain Scanner": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Ships: {
    "Basic Ship": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Star Ship": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Interdimensional Cruiser": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
  Story: {
    "Alien Ally": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Alien Squad": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Alien Army": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 20,
    },
  },
};

const storyMissionsData = {
  "Rogue Drone Takedown": {
    species: "Aelithians",
    "Required Credits": 600,
    "Required Energy": 6,
    Reward: 1300,
    Experience: 25,
    Rank: 1,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Elevate your vigilance, Jahntow. Rogue drones sent by the Corporation threaten the harmony of Aelithian space.",
    successMessage:
      "ECHO: Drones eliminated successfully. You've earned 1300 credits and 25 experience.",
    failureMessage:
      "ECHO: Our attempt to neutralize the rogue drones failed. We must ensure Aelithian safety.",

    requiredMissionWins: 0,
  },
  "Protect the Caravans": {
    species: "Aelithians",
    "Required Credits": 800,
    "Required Energy": 8,
    Reward: 1800,
    Experience: 35,
    Rank: 3,
    requiredEquipment: {
      "Alien Ally": 1,
    },
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, delve into the shadows of Corporation activities. Infiltrate their base and unveil their plans against Aelithians.",
    successMessage:
      "ECHO: Jahntow, we've successfully gathered intelligence on Corporation activities. Rewarded 1800 credits and 35 experience.",
    failureMessage:
      "ECHO: Our attempt to infiltrate the Corporation base failed. We must refine our approach.",

    requiredMissionWins: 5,
  },
  "Free Oases": {
    species: "Aelithians",
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 2300,
    Experience: 45,
    Rank: 5,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Corporation seeks to disrupt Aelithian energy trade. Engage in negotiations to preserve your species' vitality.",
    successMessage:
      "ECHO: Negotiations were successful. Aelithian energy trade remains strong, earning you 2300 credits and 45 experience.",
    failureMessage:
      "ECHO: Our negotiation attempts faltered. We must ensure the energy trade's stability.",

    requiredMissionWins: 10,
  },
  "Repel Invasions": {
    species: "Aelithians",
    "Required Credits": 1400,
    "Required Energy": 14,
    Reward: 3300,
    Experience: 65,
    Rank: 7,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Unite with Aelithian leaders in a celestial ritual. Counter the Corporation's efforts to disrupt your cosmic harmony.",
    successMessage:
      "ECHO: The celestial ritual was a success. Aelithian cosmic harmony remains intact, earning you 3300 credits and 65 experience.",
    failureMessage:
      "ECHO: Our attempt to maintain cosmic harmony faced opposition. We must continue safeguarding Aelithian traditions.",

    requiredMissionWins: 15,
  },

  "Fortify Temples": {
    species: "Cepharians",
    "Required Credits": 700,
    "Required Energy": 7,
    Reward: 1500,
    Experience: 30,
    Rank: 9,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Cepharians face a temporal distortion crisis. Navigate the labyrinth of time to restore their reality's stability.",
    successMessage:
      "ECHO: The temporal distortion crisis has been resolved. You've earned 1500 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to stabilize Cepharian reality's timeline failed. We must safeguard their existence.",

    requiredMissionWins: 20,
  },
  "Lead Sandstorm Offensives": {
    species: "Cepharians",
    "Required Credits": 900,
    "Required Energy": 9,
    Reward: 2000,
    Experience: 40,
    Rank: 11,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Descend into the Cepharian subterranean depths. Reclaim their ancient technology from Corporation's clutches.",
    successMessage:
      "ECHO: Ancient technology retrieved successfully. You've earned 2000 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to reclaim ancient technology faced obstacles. We must secure Cepharian legacy.",

    requiredMissionWins: 25,
  },
  "Infiltrate Vortex Camps": {
    species: "Cepharians",
    "Required Credits": 1200,
    "Required Energy": 12,
    Reward: 2700,
    Experience: 50,
    Rank: 13,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Engage in an astral harmony ceremony with Cepharian leaders. Counter the Corporation's interference in their ethereal connection.",
    successMessage:
      "ECHO: Astral harmony achieved. Cepharian ethereal connection restored, earning you 2700 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore astral harmony faced opposition. We must preserve Cepharian spiritual unity.",

    requiredMissionWins: 30,
  },
  "Sabotage Supply Lines": {
    species: "Cepharians",
    "Required Credits": 1600,
    "Required Energy": 16,
    Reward: 3900,
    Experience: 75,
    Rank: 15,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on a cosmic journey through nebulas with the Cepharians. Foil the Corporation's attempt to manipulate celestial energies.",
    successMessage:
      "ECHO: Nebula journey completed successfully. Cepharian celestial energies secured, earning you 3900 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the nebulas faced challenges. We must ensure Cepharian cosmic balance.",

    requiredMissionWins: 35,
  },

  "Persuade Mercenaries to Defect": {
    species: "Velorans",
    "Required Credits": 800,
    "Required Energy": 8,
    Reward: 1700,
    Experience: 30,
    Rank: 17,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The harmonious frequencies of Veloran music are disrupted by Corporation interference. Restore their sonic resonance.",
    successMessage:
      "ECHO: Sonic resonance restored successfully. You've earned 1700 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to restore sonic resonance faced obstacles. We must ensure Veloran musical harmony.",

    requiredMissionWins: 40,
  },
  "Hack Vortex Terraforming Tech": {
    species: "Velorans",
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 2200,
    Experience: 40,
    Rank: 19,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Corporation exploits Veloran crystal core energy sources. Engage in a high-stakes operation to safeguard their essence.",
    successMessage:
      "ECHO: Crystal core safeguarded successfully. You've earned 2200 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to safeguard the crystal core faced opposition. We must protect Veloran energy legacy.",

    requiredMissionWins: 45,
  },
  "Lead Stampede Assaults": {
    species: "Velorans",
    "Required Credits": 1300,
    "Required Energy": 13,
    Reward: 3000,
    Experience: 50,
    Rank: 21,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Join Veloran leaders in a luminous unison ceremony. Counter the Corporation's manipulation of their collective light.",
    successMessage:
      "ECHO: Luminous unison achieved. Veloran collective light restored, earning you 3000 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore luminous unison faced challenges. We must protect Veloran shared radiance.",

    requiredMissionWins: 50,
  },
  "Defend Sacred Groves": {
    species: "Velorans",
    "Required Credits": 1800,
    "Required Energy": 18,
    Reward: 4500,
    Experience: 75,
    Rank: 23,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on a celestial pilgrimage with the Velorans. Foil the Corporation's attempt to distort their connection to stars.",
    successMessage:
      "ECHO: Celestial pilgrimage completed successfully. Veloran stellar connection secured, earning you 4500 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the celestial pilgrimage faced challenges. We must ensure Veloran starry bonds.",

    requiredMissionWins: 55,
  },

  "Infiltrate Lumber Facility": {
    species: "Drakorians",
    "Required Credits": 900,
    "Required Energy": 9,
    Reward: 1900,
    Experience: 30,
    Rank: 25,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Drakorian Eclipse Ritual is threatened by the Corporation's intervention. Assist in ensuring their cosmic balance.",
    successMessage:
      "ECHO: Eclipse Ritual protected successfully. You've earned 1900 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to protect the Eclipse Ritual faced challenges. We must ensure Drakorian cosmic equilibrium.",

    requiredMissionWins: 60,
  },
  "Join Xiaojian Rebels": {
    species: "Drakorians",
    "Required Credits": 1100,
    "Required Energy": 11,
    Reward: 2400,
    Experience: 40,
    Rank: 27,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Retrieve the sacred Flameforged Relics from the Corporation's grasp. Rekindle the spirit of the Drakorian ancestors.",
    successMessage:
      "ECHO: Flameforged Relics reclaimed successfully. You've earned 2400 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to reclaim Flameforged Relics faced opposition. We must honor Drakorian ancestral heritage.",

    requiredMissionWins: 65,
  },
  "Rescue Caged Pandalings": {
    species: "Drakorians",
    "Required Credits": 1400,
    "Required Energy": 14,
    Reward: 3200,
    Experience: 50,
    Rank: 29,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Engage in the creation of the Stellar Aegis, a cosmic shield to ward off the Corporation's astral intrusion.",
    successMessage:
      "ECHO: Stellar Aegis successfully erected. Drakorian astral domain protected, earning you 3200 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to create the Stellar Aegis faced challenges. We must defend Drakorian astral sovereignty.",

    requiredMissionWins: 70,
  },
  "Dragonbone Bombing Run": {
    species: "Drakorians",
    "Required Credits": 1900,
    "Required Energy": 19,
    Reward: 4800,
    Experience: 75,
    Rank: 31,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Navigate the Celestial Confluence with the Drakorians. Counter the Corporation's manipulation of their cosmic connection.",
    successMessage:
      "ECHO: Celestial Confluence completed successfully. Drakorian cosmic connection reinforced, earning you 4800 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the Celestial Confluence faced challenges. We must ensure Drakorian celestial ties.",

    requiredMissionWins: 75,
  },

  "Defection and Tragedy": {
    species: "Thelorians",
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 2100,
    Experience: 30,
    Rank: 33,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The harmonic light patterns of the Thelorian realm are being disrupted. Restore their luminous correlation.",
    successMessage:
      "ECHO: Luminous correlation restored successfully. You've earned 2100 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to restore luminous correlation faced obstacles. We must ensure Thelorian radiant unity.",

    requiredMissionWins: 80,
  },
  "Final Stand in Ancient Tree City": {
    species: "Thelorians",
    "Required Credits": 1200,
    "Required Energy": 12,
    Reward: 2700,
    Experience: 40,
    Rank: 35,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Corporation seeks to exploit Thelorian ethereal nexus for power. Protect their interdimensional heritage.",
    successMessage:
      "ECHO: Ethereal nexus protected successfully. You've earned 2700 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to protect the ethereal nexus faced opposition. We must secure Thelorian multidimensional legacy.",

    requiredMissionWins: 85,
  },
  "Scout Vortex Mines": {
    species: "Thelorians",
    "Required Credits": 1500,
    "Required Energy": 15,
    Reward: 3500,
    Experience: 50,
    Rank: 37,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Join Thelorian leaders in a harmonic resonance ceremony. Counter the Corporation's disruption of their cosmic connection.",
    successMessage:
      "ECHO: Harmonic resonance achieved. Thelorian cosmic connection restored, earning you 3500 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore harmonic resonance faced challenges. We must protect Thelorian celestial bonds.",

    requiredMissionWins: 90,
  },
  "Collapse Mining Tunnels": {
    species: "Thelorians",
    "Required Credits": 2000,
    "Required Energy": 20,
    Reward: 5400,
    Experience: 75,
    Rank: 39,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on an astral rhapsody through cosmic harmonies with the Thelorians. Prevent the Corporation's cosmic disharmony.",
    successMessage:
      "ECHO: Astral rhapsody completed successfully. Thelorian cosmic melodies protected, earning you 5400 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the astral rhapsody faced challenges. We must ensure Thelorian cosmic harmony.",

    requiredMissionWins: 95,
  },

  "Use Yeti Allies for Spying": {
    species: "Zeraphans",
    "Required Credits": 1100,
    "Required Energy": 11,
    Reward: 2300,
    Experience: 30,
    Rank: 41,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The ethereal echoes of the Zeraphan realm are fading. Revive their celestial harmonies for eternal existence.",
    successMessage:
      "ECHO: Celestial echoes revived successfully. You've earned 2300 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to revive celestial echoes faced obstacles. We must ensure Zeraphan ethereal vitality.",

    requiredMissionWins: 100,
  },
  "Lead Mech Assaults": {
    species: "Zeraphans",
    "Required Credits": 1300,
    "Required Energy": 13,
    Reward: 2900,
    Experience: 40,
    Rank: 43,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Zeraphan nebulae are being disrupted by the Corporation's intrusion. Achieve nebula synchrony to maintain cosmic order.",
    successMessage:
      "ECHO: Nebula synchrony achieved successfully. You've earned 2900 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to achieve nebula synchrony faced opposition. We must preserve Zeraphan cosmic balance.",

    requiredMissionWins: 105,
  },
  "Persuade Titan Clans to Unite": {
    species: "Zeraphans",
    "Required Credits": 1600,
    "Required Energy": 16,
    Reward: 3800,
    Experience: 50,
    Rank: 45,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Join the Zeraphan council in an ethereal convergence ceremony. Counter the Corporation's disruption of their cosmic bond.",
    successMessage:
      "ECHO: Ethereal convergence achieved. Zeraphan cosmic bond restored, earning you 3800 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore ethereal convergence faced challenges. We must protect Zeraphan cosmic unity.",

    requiredMissionWins: 110,
  },
  "Defend Mountain Fortresses": {
    species: "Zeraphans",
    "Required Credits": 2200,
    "Required Energy": 22,
    Reward: 6000,
    Experience: 75,
    Rank: 47,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on a cosmic overture with the Zeraphans. Foil the Corporation's attempt to disrupt their cosmic symphony.",
    successMessage:
      "ECHO: Cosmic overture completed successfully. Zeraphan cosmic symphony safeguarded, earning you 6000 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the cosmic overture faced challenges. We must ensure Zeraphan cosmic harmony.",

    requiredMissionWins: 115,
  },

  "Infiltrate Logging Facilities": {
    "Required Credits": 3000,
    "Required Energy": 30,
    Reward: 5000,
    Experience: 100,
    Rank: 48,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The time has come, Jahntow. Begin the united alliance's cosmic confrontation against the Space Corporation. This is the first step towards liberation.",
    successMessage:
      "ECHO: Part 1 of the cosmic confrontation completed successfully. Your alliance advances, earning you 5000 credits and 100 experience. The fight gains momentum.",
    failureMessage:
      "ECHO: Our attempt to begin the cosmic confrontation faced resistance. The fight is not over; we'll keep pushing forward.",

    requiredMissionWins: 120,
  },

  "Ambush Vortex Forces": {
    "Required Credits": 4000,
    "Required Energy": 40,
    Reward: 7500,
    Experience: 125,
    Rank: 49,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Continue the cosmic confrontation, Jahntow. This is the second part of the united alliance's struggle. Together, we'll break the Corporation's grasp.",
    successMessage:
      "ECHO: Part 2 of the cosmic confrontation completed successfully. Your alliance grows stronger, earning you 7500 credits and 125 experience. The path to victory is clear.",
    failureMessage:
      "ECHO: Our attempt to advance the cosmic confrontation faced challenges. The united alliance remains resolute; we'll overcome.",

    requiredMissionWins: 125,
  },

  "Foil Vortex Trapping": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 130,
  },
  "Destroy Bioweapon Stockpiles": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 135,
  },
  "Learn Forest Regrowth Rituals": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 140,
  },
  "Defend the Heart of the Forest": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 145,
  },
  "Scout Vortex Facilities": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 150,
  },
  "Disrupt Executive Speeches": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 155,
  },
  "Make Vortex Mechs Malfunction": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 160,
  },
  "Create Illusions to Confuse Vortex": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 165,
  },
  "Lead Astral Projection Assaults": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 170,
  },
  "Final Psychic Showdown": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 175,
  },
  "Vortex Corp: Infiltration": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 180,
  },
  "Vortex Corp: Inside the Fortress": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 185,
  },
  "Vortex Corp: Betrayal": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 190,
  },
  "Vortex Corp: Disabling the Defenses": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 195,
  },
  "Vortex Corp: Confrontation with Xaezor": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 200,
  },
  "Victory and Aftermath:": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 50,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",

    requiredMissionWins: 205,
  },
};


const storyMissionArc = {
  "Mission 0": {
    Characters: ["echo"],
    Title: "Disable Spy Drones 1",
    Message:
      "Walking through to Xictilian city, ECHO notices a flock of Spy Drones overhead. Jahntow needs to disable one and show it to the Xictilians",

    requiredMissionWins: 0,
  },
  "Mission 1": {
    Characters: ["zuark"],
    Title: "Disable Spy Drones 2",
    Message:
      "Jahntow arrives to the city and is greated by his long time friend Zu-Ark. He informs her of the drones and shows her the chip he extracted from the one he took down. They agree to go out and see if there are any more still circling around.",

    requiredMissionWins: 1,
  },
  "Mission 2": {
    Characters: ["zuark"],
    Title: "Disable Spy Drones 3",
    Message:
      "After clearing the skies, a new batch of Spy Drones was reported by the locals. Jahntow and Zuark need to take care of these strays.",

    requiredMissionWins: 2,
  },
  "Mission 3": {
    Characters: ["echo", "zuark"],
    Title: "Disable Spy Drones 4",
    Message:
      "Jahntow and Zu'ark are almost able to track the location of the drop-ship. they need a few more electronics from the Spy Drones. Go take down more. ",

    requiredMissionWins: 3,
  },
  "Mission 4": {
    Characters: ["echo", "zuark", ],
    Title: "Disable Spy Drones 5",
    Message:
      "Jahntow and Zu'ark are able to pinpoint the location of the drone drop-ship. Lead a group of warriors to shut it down completely.",

    requiredMissionWins: 4,
  },

  "Mission 5": {
    Characters: ["veran"],
    Title: "Protect Caravans 1",
    Message:
      "The Spy Drones have been dealt with. Veran, the brother of Zu'Ark came across a destroyed caravan. go investigate with him.",

    requiredMissionWins: 5,
  },

  "Mission 6": {
    Characters: ["veran", "echo"],
    Title: "Protect Caravans 2",
    Message:
      "ECHO analyzes the damaged caravan. Vortex Corp weapons are at fault. Watch over the Road for the other caravans.",

    requiredMissionWins: 6,
  },

  "Mission 7": {
    Characters: ["zuark"],
    Title: "Protect Caravans 3",
    Message:
      "Zu'Ark has protected a caravan on a different path, she said vortex are heading this way. Prepare for a battle.",

    requiredMissionWins: 7,
  },

  "Mission 8": {
    Characters: ["echo", "zuark"],
    Title: "Protect Caravans 4",
    Message:
      "You succesfully take down the Vortex Squad. ECHO has collected more information from their damaged tech. Take it back to the City.",

    requiredMissionWins: 8,
  },

  "Mission 9": {
    Characters: ["echo", "veran", "zuark"],
    Title: "Protect Caravans 5",
    Message:
      "The City learns that the trade routes are compromised by hidden Vortex Trackers. with the recovered information, they have the locations. Lead a warrior group to disable them and secure the trade routes.",

    requiredMissionWins: 9,
  },

  "Mission 10": {
    Characters: ["echo"],
    Title: "Free Oases 1",
    Message:
      "Jahntow and Zu'ark liberate captured oases, which are crucial water sources for the Xictlians.",

    requiredMissionWins: 10,
  },

  "Mission 11": {
    Characters: ["echo", "zuark"],
    Title: "Free Oases 2",
    Message:
      "Jahntow and Zu'ark liberate captured oases, which are crucial water sources for the Xictlians.",

    requiredMissionWins: 11,
  },

  "Mission 12": {
    Characters: ["echo", "zuark"],
    Title: "Free Oases 3",
    Message:
      "Jahntow and Zu'ark liberate captured oases, which are crucial water sources for the Xictlians.",

    requiredMissionWins: 12,
  },

  "Mission 13": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Free Oases 4",
    Message:
      "Jahntow and Zu'ark liberate captured oases, which are crucial water sources for the Xictlians.",

    requiredMissionWins: 13,
  },
  "Mission 14": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Free Oases 5",
    Message:
      "Jahntow and Zu'ark liberate captured oases, which are crucial water sources for the Xictlians.",

    requiredMissionWins: 14,
  },


// Repel Invasions Missions (1-5)
"Mission 15": {
  Characters: ["echo", "zuark"],
  Title: "Repel Invasions 1",
  Message: "Jahntow and Zu'ark lead Xictlian warriors in repelling Vortex invasions, pushing them back from key strategic points.",
  requiredMissionWins: 15,
},
"Mission 16": {
  Characters: ["echo", "zuark", "veran"],
  Title: "Repel Invasions 2",
  Message: "The Vortex forces are regrouping for another attack. Prepare the defenses.",
  requiredMissionWins: 16,
},
"Mission 17": {
  Characters: ["echo", "zuark"],
  Title: "Repel Invasions 3",
  Message: "Another wave of Vortex forces is approaching. Get ready for battle.",
  requiredMissionWins: 17,
},
"Mission 18": {
  Characters: ["echo", "zuark", "veran"],
  Title: "Repel Invasions 4",
  Message: "The defenses are holding, but Vortex is sending in their elite troops. Brace yourselves.",
  requiredMissionWins: 18,
},
"Mission 19": {
  Characters: ["echo", "zuark"],
  Title: "Repel Invasions 5",
  Message: "This is the final wave of Vortex invaders. Give it everything you've got!",
  requiredMissionWins: 19,
},
// Fortify Temples Missions (1-5)
"Mission 20": {
  Characters: ["echo", "zuark"],
  Title: "Fortify Temples 1",
  Message: "Jahntow and Zu'ark oversee the fortification of sacred Xictlian temples, ensuring they remain safe from Vortex's grasp.",
  requiredMissionWins: 20,
},
"Mission 21": {
  Characters: ["echo", "zuark", "veran"],
  Title: "Fortify Temples 2",
  Message: "The first temple is secure. Move on to the next one.",
  requiredMissionWins: 21,
},
"Mission 22": {
  Characters: ["echo", "zuark"],
  Title: "Fortify Temples 3",
  Message: "Vortex is planning to attack another temple. Get there before they do.",
  requiredMissionWins: 22,
},
"Mission 23": {
  Characters: ["echo", "zuark", "veran"],
  Title: "Fortify Temples 4",
  Message: "The fortifications are almost complete. Make sure everything is ready for the final defense.",
  requiredMissionWins: 23,
},
"Mission 24": {
  Characters: ["echo", "zuark"],
  Title: "Fortify Temples 5",
  Message: "All temples are fortified. Prepare for a possible Vortex attack to test the new defenses.",
  requiredMissionWins: 24,
},
// Lead Sandstorm Offensives Missions (1-5)
"Mission 25": {
  Characters: ["echo", "zuark"],
  Title: "Lead Sandstorm Offensives 1",
  Message: "Using the desert's natural sandstorms as cover, Jahntow and Zu'ark lead surprise attacks on Vortex outposts.",
  requiredMissionWins: 25,
},
"Mission 26": {
  Characters: ["echo", "zuark", "veran"],
  Title: "Lead Sandstorm Offensives 2",
  Message: "The first outpost is down. Prepare for the next attack.",
  requiredMissionWins: 26,
},
"Mission 27": {
  Characters: ["echo", "zuark"],
  Title: "Lead Sandstorm Offensives 3",
  Message: "Another sandstorm is forming. Use it to your advantage and take down the next outpost.",
  requiredMissionWins: 27,
},
"Mission 28": {
  Characters: ["echo", "zuark", "veran"],
  Title: "Lead Sandstorm Offensives 4",
  Message: "The Vortex forces are catching on to your tactics. Be prepared for stronger resistance.",
  requiredMissionWins: 28,
},
"Mission 29": {
  Characters: ["echo", "zuark"],
  Title: "Lead Sandstorm Offensives 5",
  Message: "This is the final outpost. Take it down to cripple Vortex's operations in the region.",
  requiredMissionWins: 29,
},
    
// Luxorians Missions
// Infiltrate Vortex Camps (1-5)
"Mission 30": {
  Characters: ["echo", "axenthon"],
  Title: "Infiltrate Vortex Camps 1",
  Message: "Jahntow and Axenthon covertly enter a Vortex camp to gather intelligence and sabotage their operations.",
  requiredMissionWins: 30,
},
"Mission 31": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Infiltrate Vortex Camps 2",
  Message: "The first camp has been infiltrated. Move on to the next one for further intelligence gathering.",
  requiredMissionWins: 31,
},
"Mission 32": {
  Characters: ["echo", "axenthon"],
  Title: "Infiltrate Vortex Camps 3",
  Message: "Vortex has increased their security measures. Be extra cautious while infiltrating the next camp.",
  requiredMissionWins: 32,
},
"Mission 33": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Infiltrate Vortex Camps 4",
  Message: "Almost all the camps have been infiltrated. Just one more to go.",
  requiredMissionWins: 33,
},
"Mission 34": {
  Characters: ["echo", "axenthon"],
  Title: "Infiltrate Vortex Camps 5",
  Message: "This is the final camp. Gather all the intelligence you can and sabotage their key operations.",
  requiredMissionWins: 34,
},
// Sabotage Supply Lines (1-5)
"Mission 35": {
  Characters: ["echo", "axenthon"],
  Title: "Sabotage Supply Lines 1",
  Message: "Jahntow and Axenthon disrupt Vortex's supply chains, causing logistical chaos and weakening their forces.",
  requiredMissionWins: 35,
},
"Mission 36": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Sabotage Supply Lines 2",
  Message: "The first supply line has been sabotaged. Move on to the next one.",
  requiredMissionWins: 36,
},
"Mission 37": {
  Characters: ["echo", "axenthon"],
  Title: "Sabotage Supply Lines 3",
  Message: "Vortex is increasing security around their supply lines. Be prepared for stronger resistance.",
  requiredMissionWins: 37,
},
"Mission 38": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Sabotage Supply Lines 4",
  Message: "Almost all the supply lines have been sabotaged. Just one more to go.",
  requiredMissionWins: 38,
},
"Mission 39": {
  Characters: ["echo", "axenthon"],
  Title: "Sabotage Supply Lines 5",
  Message: "This is the final supply line. Make sure it is completely disrupted to cripple Vortex's operations.",
  requiredMissionWins: 39,
},
// Persuade Mercenaries to Defect (1-5)
"Mission 40": {
  Characters: ["echo", "axenthon"],
  Title: "Persuade Mercenaries to Defect 1",
  Message: "Jahntow and Axenthon approach mercenaries hired by Vortex, convincing them to switch sides.",
  requiredMissionWins: 40,
},
"Mission 41": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Persuade Mercenaries to Defect 2",
  Message: "The first group of mercenaries has defected. Move on to the next group.",
  requiredMissionWins: 41,
},
"Mission 42": {
  Characters: ["echo", "axenthon"],
  Title: "Persuade Mercenaries to Defect 3",
  Message: "Vortex is offering higher bounties to keep the mercenaries. Counter their offers.",
  requiredMissionWins: 42,
},
"Mission 43": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Persuade Mercenaries to Defect 4",
  Message: "Almost all the mercenaries have been persuaded. Just one more group to go.",
  requiredMissionWins: 43,
},
"Mission 44": {
  Characters: ["echo", "axenthon"],
  Title: "Persuade Mercenaries to Defect 5",
  Message: "This is the final group of mercenaries. Convince them to join your cause and weaken Vortex's manpower.",
  requiredMissionWins: 44,
},
// Hack Vortex Terraforming Tech (1-5)
"Mission 45": {
  Characters: ["echo", "axenthon"],
  Title: "Hack Vortex Terraforming Tech 1",
  Message: "Jahntow and Axenthon infiltrate Vortex facilities to hack and disable their terraforming technology, preventing further environmental damage.",
  requiredMissionWins: 45,
},
"Mission 46": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Hack Vortex Terraforming Tech 2",
  Message: "The first facility has been hacked. Move on to the next one.",
  requiredMissionWins: 46,
},
"Mission 47": {
  Characters: ["echo", "axenthon"],
  Title: "Hack Vortex Terraforming Tech 3",
  Message: "Vortex has upgraded their security protocols. Be extra cautious while hacking the next facility.",
  requiredMissionWins: 47,
},
"Mission 48": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Hack Vortex Terraforming Tech 4",
  Message: "Almost all the facilities have been hacked. Just one more to go.",
  requiredMissionWins: 48,
},
"Mission 49": {
  Characters: ["echo", "axenthon"],
  Title: "Hack Vortex Terraforming Tech 5",
  Message: "This is the final facility. Disable all their terraforming technology to halt Vortex's environmental damage.",
  requiredMissionWins: 49,
},
// Lead Stampede Assaults (1-5)
"Mission 50": {
  Characters: ["echo", "axenthon"],
  Title: "Lead Stampede Assaults 1",
  Message: "Using the native Titanths, Jahntow and Axenthon lead stampede charges against Vortex outposts.",
  requiredMissionWins: 50,
},
"Mission 51": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Lead Stampede Assaults 2",
  Message: "The first outpost has been taken down. Prepare the Titanths for the next charge.",
  requiredMissionWins: 51,
},
"Mission 52": {
  Characters: ["echo", "axenthon"],
  Title: "Lead Stampede Assaults 3",
  Message: "Vortex is setting up defenses to counter the stampedes. Be prepared for stronger resistance.",
  requiredMissionWins: 52,
},
"Mission 53": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Lead Stampede Assaults 4",
  Message: "Almost all the outposts have been taken down. Just one more to go.",
  requiredMissionWins: 53,
},
"Mission 54": {
  Characters: ["echo", "axenthon"],
  Title: "Lead Stampede Assaults 5",
  Message: "This is the final outpost. Lead the Titanths in a decisive charge to cripple Vortex's operations in the region.",
  requiredMissionWins: 54,
},
// Defend Sacred Groves (1-5)
"Mission 55": {
  Characters: ["echo", "axenthon"],
  Title: "Defend Sacred Groves 1",
  Message: "Jahntow and Axenthon rally Luxorian forces to defend sacred groves from Vortex's advances, ensuring the preservation of their cultural heritage.",
  requiredMissionWins: 55,
},
"Mission 56": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Defend Sacred Groves 2",
  Message: "The first grove is secure. Move on to the next one.",
  requiredMissionWins: 56,
},
"Mission 57": {
  Characters: ["echo", "axenthon"],
  Title: "Defend Sacred Groves 3",
  Message: "Vortex is sending in their elite troops to capture the groves. Brace yourselves.",
  requiredMissionWins: 57,
},
"Mission 58": {
  Characters: ["echo", "axenthon", "veran"],
  Title: "Defend Sacred Groves 4",
  Message: "Almost all the groves are secure. Just one more to go.",
  requiredMissionWins: 58,
},
"Mission 59": {
  Characters: ["echo", "axenthon"],
  Title: "Defend Sacred Groves 5",
  Message: "This is the final grove. Defend it at all costs to preserve Luxorian heritage.",
  requiredMissionWins: 59,
},

// Xiaojians Missions
// Infiltrate Lumber Facility (1-5)
"Mission 60": {
  Characters: ["jahntow", "elderBinru"],
  Title: "Infiltrate Lumber Facility 1",
  Message: "Jahntow and Elder Binru sneak into the lumber facility to gather crucial data on Vortex's deforestation activities.",
  requiredMissionWins: 60,
},
"Mission 61": {
  Characters: ["jahntow", "elderBinru"],
  Title: "Infiltrate Lumber Facility 2",
  Message: "The first facility has been infiltrated. Move on to the next one for further data collection.",
  requiredMissionWins: 61,
},
"Mission 62": {
  Characters: ["jahntow", "elderBinru"],
  Title: "Infiltrate Lumber Facility 3",
  Message: "Vortex has increased their security measures. Be extra cautious while infiltrating the next facility.",
  requiredMissionWins: 62,
},
"Mission 63": {
  Characters: ["jahntow", "elderBinru"],
  Title: "Infiltrate Lumber Facility 4",
  Message: "Almost all the facilities have been infiltrated. Just one more to go.",
  requiredMissionWins: 63,
},
"Mission 64": {
  Characters: ["jahntow", "elderBinru"],
  Title: "Infiltrate Lumber Facility 5",
  Message: "This is the final facility. Gather all the data you can to expose Vortex's deforestation activities.",
  requiredMissionWins: 64,
},
// Join Xiaojian Rebels (1-5)
"Mission 65": {
  Characters: ["jahntow", "ava"],
  Title: "Join Xiaojian Rebels 1",
  Message: "Jahntow collaborates with Ava and the Xiaojian rebels to sabotage Vortex's lumber equipment, hindering their deforestation efforts.",
  requiredMissionWins: 65,
},
"Mission 66": {
  Characters: ["jahntow", "ava"],
  Title: "Join Xiaojian Rebels 2",
  Message: "The first set of equipment has been sabotaged. Move on to the next set.",
  requiredMissionWins: 66,
},
"Mission 67": {
  Characters: ["jahntow", "ava"],
  Title: "Join Xiaojian Rebels 3",
  Message: "Vortex is increasing security around their equipment. Be prepared for stronger resistance.",
  requiredMissionWins: 67,
},
"Mission 68": {
  Characters: ["jahntow", "ava"],
  Title: "Join Xiaojian Rebels 4",
  Message: "Almost all the equipment has been sabotaged. Just one more set to go.",
  requiredMissionWins: 68,
},
"Mission 69": {
  Characters: ["jahntow", "ava"],
  Title: "Join Xiaojian Rebels 5",
  Message: "This is the final set of equipment. Sabotage it to cripple Vortex's deforestation efforts.",
  requiredMissionWins: 69,
},
// Rescue Caged Pandalings (1-5)
"Mission 70": {
  Characters: ["jahntow", "ava"],
  Title: "Rescue Caged Pandalings 1",
  Message: "Jahntow and Ava embark on a mission to free the captured Pandalings from Vortex's encampment, strengthening their bond in the process.",
  requiredMissionWins: 70,
},
"Mission 71": {
  Characters: ["jahntow", "ava"],
  Title: "Rescue Caged Pandalings 2",
  Message: "The first group of Pandalings has been rescued. Move on to the next encampment.",
  requiredMissionWins: 71,
},
"Mission 72": {
  Characters: ["jahntow", "ava"],
  Title: "Rescue Caged Pandalings 3",
  Message: "Vortex is tightening security around the cages. Be prepared for stronger resistance.",
  requiredMissionWins: 72,
},
"Mission 73": {
  Characters: ["jahntow", "ava"],
  Title: "Rescue Caged Pandalings 4",
  Message: "Almost all the Pandalings have been rescued. Just one more encampment to go.",
  requiredMissionWins: 73,
},
"Mission 74": {
  Characters: ["jahntow", "ava"],
  Title: "Rescue Caged Pandalings 5",
  Message: "This is the final encampment. Free all the Pandalings to weaken Vortex's hold on the region.",
  requiredMissionWins: 74,
},
// Dragonbone Bombing Run (1-5)
"Mission 75": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Dragonbone Bombing Run 1",
  Message: "Under the guidance of Master Zhenwu, Jahntow and his allies execute a daring dragonbone bombing run, targeting Vortex's airships.",
  requiredMissionWins: 75,
},
"Mission 76": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Dragonbone Bombing Run 2",
  Message: "The first airship has been taken down. Prepare for the next bombing run.",
  requiredMissionWins: 76,
},
"Mission 77": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Dragonbone Bombing Run 3",
  Message: "Vortex is deploying anti-aircraft measures. Be prepared for stronger resistance.",
  requiredMissionWins: 77,
},
"Mission 78": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Dragonbone Bombing Run 4",
  Message: "Almost all the airships have been taken down. Just one more to go.",
  requiredMissionWins: 78,
},
"Mission 79": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Dragonbone Bombing Run 5",
  Message: "This is the final airship. Take it down to cripple Vortex's aerial capabilities in the region.",
  requiredMissionWins: 79,
},
// Defection and Tragedy (1-5)
"Mission 80": {
  Characters: ["jahntow", "ava"],
  Title: "Defection and Tragedy 1",
  Message: "Ava takes the lead in convincing more Vortex mercenaries to defect. However, the mission takes a tragic turn when she and her father, Zerrok, are killed by Vortex.",
  requiredMissionWins: 80,
},
"Mission 81": {
  Characters: ["jahntow", "ava"],
  Title: "Defection and Tragedy 2",
  Message: "The first group of mercenaries has defected. Move on to the next group.",
  requiredMissionWins: 81,
},
"Mission 82": {
  Characters: ["jahntow", "ava"],
  Title: "Defection and Tragedy 3",
  Message: "Vortex is offering higher bounties to keep the mercenaries. Counter their offers.",
  requiredMissionWins: 82,
},
"Mission 83": {
  Characters: ["jahntow", "ava"],
  Title: "Defection and Tragedy 4",
  Message: "Almost all the mercenaries have been persuaded. Just one more group to go.",
  requiredMissionWins: 83,
},
"Mission 84": {
  Characters: ["jahntow", "ava"],
  Title: "Defection and Tragedy 5",
  Message: "This is the final group of mercenaries. Convince them to join your cause and weaken Vortex's manpower.",
  requiredMissionWins: 84,
},
    
// Final Stand in Ancient Tree City (1-5)
"Mission 85": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Final Stand in Ancient Tree City 1",
  Message: "In a climactic battle, Jahntow, Master Zhenwu, and the Xiaojian warriors defend the ancient tree city against Vortex.",
  requiredMissionWins: 85,
},
"Mission 86": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Final Stand in Ancient Tree City 2",
  Message: "The first wave of Vortex forces has been repelled. Prepare for the next wave.",
  requiredMissionWins: 86,
},
"Mission 87": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Final Stand in Ancient Tree City 3",
  Message: "Vortex is deploying their elite troops. Be prepared for stronger resistance.",
  requiredMissionWins: 87,
},
"Mission 88": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Final Stand in Ancient Tree City 4",
  Message: "Almost all the waves have been repelled. Just one more to go.",
  requiredMissionWins: 88,
},
"Mission 89": {
  Characters: ["jahntow", "masterZhenwu"],
  Title: "Final Stand in Ancient Tree City 5",
  Message: "This is the final wave. Defend the ancient tree city at all costs to preserve Xiaojian heritage.",
  requiredMissionWins: 89,
},

// Titans Missions
// Scout Vortex Mines (1-5)
"Mission 90": {
  Characters: ["jahntow", "kazon"],
  Title: "Scout Vortex Mines 1",
  Message: "Jahntow and Kazon conduct reconnaissance on Vortex's mining sites, gathering intel for future operations.",
  requiredMissionWins: 90,
},
"Mission 91": {
  Characters: ["jahntow", "kazon"],
  Title: "Scout Vortex Mines 2",
  Message: "The first mining site has been scouted. Move on to the next site for further intel gathering.",
  requiredMissionWins: 91,
},
"Mission 92": {
  Characters: ["jahntow", "kazon"],
  Title: "Scout Vortex Mines 3",
  Message: "Vortex is increasing security around their mining sites. Be prepared for stronger resistance.",
  requiredMissionWins: 92,
},
"Mission 93": {
  Characters: ["jahntow", "kazon"],
  Title: "Scout Vortex Mines 4",
  Message: "Almost all the mining sites have been scouted. Just one more to go.",
  requiredMissionWins: 93,
},
"Mission 94": {
  Characters: ["jahntow", "kazon"],
  Title: "Scout Vortex Mines 5",
  Message: "This is the final mining site. Gather all the intel you can to prepare for future operations against Vortex.",
  requiredMissionWins: 94,
},

// Collapse Mining Tunnels (1-5)
"Mission 95": {
  Characters: ["jahntow", "kazon"],
  Title: "Collapse Mining Tunnels 1",
  Message: "Jahntow and Kazon orchestrate the collapse of key mining tunnels, hindering Vortex's resource extraction.",
  requiredMissionWins: 95,
},
"Mission 96": {
  Characters: ["jahntow", "kazon"],
  Title: "Collapse Mining Tunnels 2",
  Message: "The first tunnel has been collapsed. Move on to the next one.",
  requiredMissionWins: 96,
},
"Mission 97": {
  Characters: ["jahntow", "kazon"],
  Title: "Collapse Mining Tunnels 3",
  Message: "Vortex is reinforcing their tunnel structures. Be prepared for stronger resistance.",
  requiredMissionWins: 97,
},
"Mission 98": {
  Characters: ["jahntow", "kazon"],
  Title: "Collapse Mining Tunnels 4",
  Message: "Almost all the tunnels have been collapsed. Just one more to go.",
  requiredMissionWins: 98,
},
"Mission 99": {
  Characters: ["jahntow", "kazon"],
  Title: "Collapse Mining Tunnels 5",
  Message: "This is the final tunnel. Collapse it to severely hinder Vortex's resource extraction efforts.",
  requiredMissionWins: 99,
},

// Use Yeti Allies for Spying (1-5)
"Mission 100": {
  Characters: ["jahntow", "kazon"],
  Title: "Use Yeti Allies for Spying 1",
  Message: "Jahntow and Kazon enlist the help of native Yetis to spy on Vortex's activities, leveraging their natural stealth and familiarity with the terrain.",
  requiredMissionWins: 100,
},
"Mission 101": {
  Characters: ["jahntow", "kazon"],
  Title: "Use Yeti Allies for Spying 2",
  Message: "The first set of intel has been gathered. Move on to the next target.",
  requiredMissionWins: 101,
},
"Mission 102": {
  Characters: ["jahntow", "kazon"],
  Title: "Use Yeti Allies for Spying 3",
  Message: "Vortex is becoming suspicious of Yeti activity. Be prepared for stronger resistance.",
  requiredMissionWins: 102,
},
"Mission 103": {
  Characters: ["jahntow", "kazon"],
  Title: "Use Yeti Allies for Spying 4",
  Message: "Almost all the intel has been gathered. Just one more target to go.",
  requiredMissionWins: 103,
},
"Mission 104": {
  Characters: ["jahntow", "kazon"],
  Title: "Use Yeti Allies for Spying 5",
  Message: "This is the final target. Gather all the intel you can to prepare for future operations against Vortex.",
  requiredMissionWins: 104,
},

// Lead Mech Assaults (1-5)
"Mission 105": {
  Characters: ["jahntow", "kazon"],
  Title: "Lead Mech Assaults 1",
  Message: "Jahntow and Kazon lead assaults using Titan mechs, targeting Vortex's fortified positions in the mountains.",
  requiredMissionWins: 105,
},
"Mission 106": {
  Characters: ["jahntow", "kazon"],
  Title: "Lead Mech Assaults 2",
  Message: "The first fortified position has been taken down. Prepare the mechs for the next assault.",
  requiredMissionWins: 106,
},
"Mission 107": {
  Characters: ["jahntow", "kazon"],
  Title: "Lead Mech Assaults 3",
  Message: "Vortex is deploying anti-mech measures. Be prepared for stronger resistance.",
  requiredMissionWins: 107,
},
"Mission 108": {
  Characters: ["jahntow", "kazon"],
  Title: "Lead Mech Assaults 4",
  Message: "Almost all the fortified positions have been taken down. Just one more to go.",
  requiredMissionWins: 108,
},
"Mission 109": {
  Characters: ["jahntow", "kazon"],
  Title: "Lead Mech Assaults 5",
  Message: "This is the final fortified position. Take it down to cripple Vortex's defenses in the region.",
  requiredMissionWins: 109,
},

// Persuade Titan Clans to Unite (1-5)
"Mission 110": {
  Characters: ["jahntow", "kazon"],
  Title: "Persuade Titan Clans to Unite 1",
  Message: "Jahntow and Kazon work diplomatically to unite the various Titan clans, consolidating their strength against Vortex.",
  requiredMissionWins: 110,
},
"Mission 111": {
  Characters: ["jahntow", "kazon"],
  Title: "Persuade Titan Clans to Unite 2",
  Message: "The first clan has agreed to unite. Move on to the next clan.",
  requiredMissionWins: 111,
},
"Mission 112": {
  Characters: ["jahntow", "kazon"],
  Title: "Persuade Titan Clans to Unite 3",
  Message: "Vortex is offering bribes to keep the clans divided. Counter their offers.",
  requiredMissionWins: 112,
},
"Mission 113": {
  Characters: ["jahntow", "kazon"],
  Title: "Persuade Titan Clans to Unite 4",
  Message: "Almost all the clans have been united. Just one more to go.",
  requiredMissionWins: 113,
},
"Mission 114": {
  Characters: ["jahntow", "kazon"],
  Title: "Persuade Titan Clans to Unite 5",
  Message: "This is the final clan. Persuade them to join your cause and strengthen the united Titan front.",
  requiredMissionWins: 114,
},

// Defend Mountain Fortresses (1-5)
"Mission 115": {
  Characters: ["jahntow", "kazon"],
  Title: "Defend Mountain Fortresses 1",
  Message: "The climax sees Jahntow and Kazon rallying Titan forces to defend their mountain fortresses against a large-scale Vortex invasion.",
  requiredMissionWins: 115,
},
"Mission 116": {
  Characters: ["jahntow", "kazon"],
  Title: "Defend Mountain Fortresses 2",
  Message: "The first wave of Vortex forces has been repelled. Prepare for the next wave.",
  requiredMissionWins: 116,
},
"Mission 117": {
  Characters: ["jahntow", "kazon"],
  Title: "Defend Mountain Fortresses 3",
  Message: "Vortex is deploying their elite troops. Be prepared for stronger resistance.",
  requiredMissionWins: 117,
},
"Mission 118": {
  Characters: ["jahntow", "kazon"],
  Title: "Defend Mountain Fortresses 4",
  Message: "Almost all the waves have been repelled. Just one more to go.",
  requiredMissionWins: 118,
},
"Mission 119": {
  Characters: ["jahntow", "kazon"],
  Title: "Defend Mountain Fortresses 5",
  Message: "This is the final wave. Defend the mountain fortresses at all costs to preserve Titan heritage.",
  requiredMissionWins: 119,
},

// Tuathans Missions
// Infiltrate Logging Facilities (1-5)
"Mission 120": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Infiltrate Logging Facilities 1",
  Message: "Jahntow and the Emerald Mage covertly enter Vortex's logging sites to gather intelligence and sabotage their operations.",
  requiredMissionWins: 120,
},
"Mission 121": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Infiltrate Logging Facilities 2",
  Message: "The first logging site has been infiltrated. Move on to the next site for further intel gathering.",
  requiredMissionWins: 121,
},
"Mission 122": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Infiltrate Logging Facilities 3",
  Message: "Vortex is increasing security around their logging sites. Be prepared for stronger resistance.",
  requiredMissionWins: 122,
},
"Mission 123": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Infiltrate Logging Facilities 4",
  Message: "Almost all the logging sites have been infiltrated. Just one more to go.",
  requiredMissionWins: 123,
},
"Mission 124": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Infiltrate Logging Facilities 5",
  Message: "This is the final logging site. Gather all the intel you can to prepare for future operations against Vortex.",
  requiredMissionWins: 124,
},
// Ambush Vortex Forces (1-5)
"Mission 125": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Ambush Vortex Forces 1",
  Message: "Jahntow and the Emerald Mage set up ambushes in the dense jungle, using the environment to their advantage against Vortex patrols.",
  requiredMissionWins: 125,
},
"Mission 126": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Ambush Vortex Forces 2",
  Message: "The first patrol has been ambushed. Prepare for the next ambush.",
  requiredMissionWins: 126,
},
"Mission 127": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Ambush Vortex Forces 3",
  Message: "Vortex is becoming suspicious of the ambushes. Be prepared for stronger resistance.",
  requiredMissionWins: 127,
},
"Mission 128": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Ambush Vortex Forces 4",
  Message: "Almost all the patrols have been ambushed. Just one more to go.",
  requiredMissionWins: 128,
},
"Mission 129": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Ambush Vortex Forces 5",
  Message: "This is the final patrol. Ambush it to weaken Vortex's control over the jungle.",
  requiredMissionWins: 129,
},

// Foil Vortex Trapping (1-5)
"Mission 130": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Foil Vortex Trapping 1",
  Message: "Jahntow and the Emerald Mage disrupt Vortex's efforts to trap and exploit the jungle's magical creatures.",
  requiredMissionWins: 130,
},
"Mission 131": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Foil Vortex Trapping 2",
  Message: "The first set of traps has been dismantled. Move on to the next set.",
  requiredMissionWins: 131,
},
"Mission 132": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Foil Vortex Trapping 3",
  Message: "Vortex is deploying more advanced traps. Be prepared for stronger resistance.",
  requiredMissionWins: 132,
},
"Mission 133": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Foil Vortex Trapping 4",
  Message: "Almost all the traps have been dismantled. Just one more set to go.",
  requiredMissionWins: 133,
},
"Mission 134": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Foil Vortex Trapping 5",
  Message: "This is the final set of traps. Dismantle them to protect the jungle's magical creatures.",
  requiredMissionWins: 134,
},

// Destroy Bioweapon Stockpiles (1-5)
"Mission 135": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Destroy Bioweapon Stockpiles 1",
  Message: "Jahntow and the Emerald Mage locate and destroy Vortex's stockpiles of bioweapons, which threaten to devastate the jungle ecosystem.",
  requiredMissionWins: 135,
},
"Mission 136": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Destroy Bioweapon Stockpiles 2",
  Message: "The first stockpile has been destroyed. Move on to the next one.",
  requiredMissionWins: 136,
},
"Mission 137": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Destroy Bioweapon Stockpiles 3",
  Message: "Vortex is increasing security around their stockpiles. Be prepared for stronger resistance.",
  requiredMissionWins: 137,
},
"Mission 138": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Destroy Bioweapon Stockpiles 4",
  Message: "Almost all the stockpiles have been destroyed. Just one more to go.",
  requiredMissionWins: 138,
},
"Mission 139": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Destroy Bioweapon Stockpiles 5",
  Message: "This is the final stockpile. Destroy it to prevent Vortex from using bioweapons against the jungle.",
  requiredMissionWins: 139,
},

// Learn Forest Regrowth Rituals (1-5)
"Mission 140": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Learn Forest Regrowth Rituals 1",
  Message: "The Emerald Mage teaches Jahntow ancient rituals to accelerate the regrowth of deforested areas.",
  requiredMissionWins: 140,
},
"Mission 141": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Learn Forest Regrowth Rituals 2",
  Message: "The first area has been restored. Move on to the next deforested area.",
  requiredMissionWins: 141,
},
"Mission 142": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Learn Forest Regrowth Rituals 3",
  Message: "Vortex is attempting to counter the rituals with dark magic. Be prepared for stronger resistance.",
  requiredMissionWins: 142,
},
"Mission 143": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Learn Forest Regrowth Rituals 4",
  Message: "Almost all the deforested areas have been restored. Just one more to go.",
  requiredMissionWins: 143,
},
"Mission 144": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Learn Forest Regrowth Rituals 5",
  Message: "This is the final deforested area. Perform the ritual to restore it and strengthen the jungle.",
  requiredMissionWins: 144,
},

// Defend the Heart of the Forest (1-5)
"Mission 145": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Defend the Heart of the Forest 1",
  Message: "In the climax, Jahntow and the Emerald Mage lead the defense of a sacred grove, the heart of the Tuathan jungle, against a massive Vortex assault.",
  requiredMissionWins: 145,
},
"Mission 146": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Defend the Heart of the Forest 2",
  Message: "The first wave of Vortex forces has been repelled. Prepare for the next wave.",
  requiredMissionWins: 146,
},
"Mission 147": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Defend the Heart of the Forest 3",
  Message: "Vortex is deploying their elite troops. Be prepared for stronger resistance.",
  requiredMissionWins: 147,
},
"Mission 148": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Defend the Heart of the Forest 4",
  Message: "Almost all the waves have been repelled. Just one more to go.",
  requiredMissionWins: 148,
},
"Mission 149": {
  Characters: ["jahntow", "emeraldMage"],
  Title: "Defend the Heart of the Forest 5",
  Message: "This is the final wave. Defend the sacred grove at all costs to preserve Tuathan heritage.",
  requiredMissionWins: 149,
},

// Namarupians Missions
// Scout Vortex Facilities (1-5)
"Mission 150": {
  Characters: ["jahntow", "zhalia"],
  Title: "Scout Vortex Facilities 1",
  Message: "Jahntow and Zhalia conduct reconnaissance on key Vortex facilities within the city, gathering vital intel.",
  requiredMissionWins: 150,
},
"Mission 151": {
  Characters: ["jahntow", "zhalia"],
  Title: "Scout Vortex Facilities 2",
  Message: "The first facility has been scouted. Move on to the next one.",
  requiredMissionWins: 151,
},
"Mission 152": {
  Characters: ["jahntow", "zhalia"],
  Title: "Scout Vortex Facilities 3",
  Message: "Vortex is increasing security around their facilities. Be prepared for stronger resistance.",
  requiredMissionWins: 152,
},
"Mission 153": {
  Characters: ["jahntow", "zhalia"],
  Title: "Scout Vortex Facilities 4",
  Message: "Almost all the facilities have been scouted. Just one more to go.",
  requiredMissionWins: 153,
},
"Mission 154": {
  Characters: ["jahntow", "zhalia"],
  Title: "Scout Vortex Facilities 5",
  Message: "This is the final facility. Gather all the intel you can to prepare for future operations against Vortex.",
  requiredMissionWins: 154,
},

// Disrupt Executive Speeches (1-5)
"Mission 155": {
  Characters: ["jahntow", "zhalia"],
  Title: "Disrupt Executive Speeches 1",
  Message: "Jahntow and Zhalia sabotage public addresses by Vortex executives, sowing doubt and dissent among the populace.",
  requiredMissionWins: 155,
},
"Mission 156": {
  Characters: ["jahntow", "zhalia"],
  Title: "Disrupt Executive Speeches 2",
  Message: "The first speech has been disrupted. Move on to the next one.",
  requiredMissionWins: 156,
},
"Mission 157": {
  Characters: ["jahntow", "zhalia"],
  Title: "Disrupt Executive Speeches 3",
  Message: "Vortex is increasing security around their executives. Be prepared for stronger resistance.",
  requiredMissionWins: 157,
},
"Mission 158": {
  Characters: ["jahntow", "zhalia"],
  Title: "Disrupt Executive Speeches 4",
  Message: "Almost all the speeches have been disrupted. Just one more to go.",
  requiredMissionWins: 158,
},
"Mission 159": {
  Characters: ["jahntow", "zhalia"],
  Title: "Disrupt Executive Speeches 5",
  Message: "This is the final speech. Disrupt it to weaken Vortex's influence over the Namarupian populace.",
  requiredMissionWins: 159,
},

// Make Vortex Mechs Malfunction (1-5)
"Mission 160": {
  Characters: ["jahntow", "zhalia"],
  Title: "Make Vortex Mechs Malfunction 1",
  Message: "Jahntow and Zhalia use their technical expertise to make Vortex's mechs malfunction, turning the tide in several key battles.",
  requiredMissionWins: 160,
},
"Mission 161": {
  Characters: ["jahntow", "zhalia"],
  Title: "Make Vortex Mechs Malfunction 2",
  Message: "The first set of mechs has been sabotaged. Move on to the next set.",
  requiredMissionWins: 161,
},
"Mission 162": {
  Characters: ["jahntow", "zhalia"],
  Title: "Make Vortex Mechs Malfunction 3",
  Message: "Vortex is implementing countermeasures. Be prepared for stronger resistance.",
  requiredMissionWins: 162,
},
"Mission 163": {
  Characters: ["jahntow", "zhalia"],
  Title: "Make Vortex Mechs Malfunction 4",
  Message: "Almost all the mechs have been sabotaged. Just one more set to go.",
  requiredMissionWins: 163,
},
"Mission 164": {
  Characters: ["jahntow", "zhalia"],
  Title: "Make Vortex Mechs Malfunction 5",
  Message: "This is the final set of mechs. Sabotage them to cripple Vortex's military capabilities.",
  requiredMissionWins: 164,
},

// Expose Vortex Scandals (1-5)
"Mission 165": {
  Characters: ["jahntow", "zhalia"],
  Title: "Create Illusions to Confuse Vortex 1",
  Message: "Jahntow and Zhalia work to expose Vortex's unethical practices and scandals, weakening their public image.",
  requiredMissionWins: 165,
},
"Mission 166": {
  Characters: ["jahntow", "zhalia"],
  Title: "Create Illusions to Confuse Vortex 2",
  Message: "The first scandal has been exposed. Move on to the next one.",
  requiredMissionWins: 166,
},
"Mission 167": {
  Characters: ["jahntow", "zhalia"],
  Title: "Create Illusions to Confuse Vortex 3",
  Message: "Vortex is deploying countermeasures to suppress the scandals. Be prepared for stronger resistance.",
  requiredMissionWins: 167,
},
"Mission 168": {
  Characters: ["jahntow", "zhalia"],
  Title: "Create Illusions to Confuse Vortex 4",
  Message: "Almost all the scandals have been exposed. Just one more to go.",
  requiredMissionWins: 168,
},
"Mission 169": {
  Characters: ["jahntow", "zhalia"],
  Title: "Create Illusions to Confuse Vortex 5",
  Message: "This is the final scandal. Expose it to severely damage Vortex's reputation.",
  requiredMissionWins: 169,
},
// Lead Astral Projection Assaults (1-5)
"Mission 170": {
  Characters: ["jahntow", "zhalia"],
  Title: "Lead Astral Projection Assaults 1",
  Message: "In the climax, Jahntow and Zhalia lead an uprising against Vortex, rallying the Namarupian populace to reclaim their city.",
  requiredMissionWins: 170,
},
"Mission 171": {
  Characters: ["jahntow", "zhalia"],
  Title: "Lead Astral Projection Assaults 2",
  Message: "The first district has been liberated. Move on to the next one.",
  requiredMissionWins: 171,
},
"Mission 172": {
  Characters: ["jahntow", "zhalia"],
  Title: "Lead Astral Projection Assaults 3",
  Message: "Vortex is deploying their elite troops. Be prepared for stronger resistance.",
  requiredMissionWins: 172,
},
"Mission 173": {
  Characters: ["jahntow", "zhalia"],
  Title: "Lead Astral Projection Assaults 4",
  Message: "Almost all the districts have been liberated. Just one more to go.",
  requiredMissionWins: 173,
},
"Mission 174": {
  Characters: ["jahntow", "zhalia"],
  Title: "Lead Astral Projection Assaults 5",
  Message: "This is the final district. Liberate it to complete the uprising and free the Namarupian city from Vortex.",
  requiredMissionWins: 174,
},



// Final Psychic Showdown (1-5)
"Mission 175": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Final Psychic Showdown 1",
  Message: "The team begins their covert approach to the Vortex fortress using stealth gliders.",
  requiredMissionWins: 175,
},
"Mission 176": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Final Psychic Showdown 2",
  Message: "The team lands on a secluded ledge, avoiding Vortex detection systems.",
  requiredMissionWins: 176,
},
"Mission 177": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Final Psychic Showdown 3",
  Message: "The team successfully bypasses the first layer of Vortex security.",
  requiredMissionWins: 177,
},
"Mission 178": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Final Psychic Showdown 4",
  Message: "The team encounters and neutralizes Vortex patrols without raising alarms.",
  requiredMissionWins: 178,
},
"Mission 179": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Final Psychic Showdown 5",
  Message: "The team reaches the inner perimeter of the Vortex fortress, ready for the next phase.",
  requiredMissionWins: 179,
},

// Final Mission Against Vortex
// Infiltration (1-5)
"Mission 175": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Infiltration 1",
  Message: "The team begins their covert approach to the Vortex fortress using stealth gliders.",
  requiredMissionWins: 180,
},
"Mission 176": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Infiltration 2",
  Message: "The team lands on a secluded ledge, avoiding Vortex detection systems.",
  requiredMissionWins: 181,
},
"Mission 177": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Infiltration 3",
  Message: "The team successfully bypasses the first layer of Vortex security.",
  requiredMissionWins: 182,
},
"Mission 178": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Infiltration 4",
  Message: "The team encounters and neutralizes Vortex patrols without raising alarms.",
  requiredMissionWins: 183,
},
"Mission 179": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Infiltration 5",
  Message: "The team reaches the inner perimeter of the Vortex fortress, ready for the next phase.",
  requiredMissionWins: 184,
},
// Inside the Fortress (1-5)
"Mission 180": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Inside the Fortress 1",
  Message: "The team navigates the initial corridors of the Vortex fortress.",
  requiredMissionWins: 185,
},
"Mission 181": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Inside the Fortress 2",
  Message: "The team rescues prisoners and gains valuable intel about the fortress's layout.",
  requiredMissionWins: 186,
},
"Mission 182": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Inside the Fortress 3",
  Message: "The team avoids traps and engages in skirmishes with Vortex soldiers.",
  requiredMissionWins: 187,
},
"Mission 183": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Inside the Fortress 4",
  Message: "The team successfully navigates through a maze of corridors, getting closer to their objective.",
  requiredMissionWins: 188,
},
"Mission 184": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Inside the Fortress 5",
  Message: "The team reaches the central area of the fortress, preparing for the next phase of their mission.",
  requiredMissionWins: 189,
},
// Betrayal (1-5)
"Mission 185": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Betrayal 1",
  Message: "Director Zerrok, previously thought to be an ally, reveals his allegiance to Vortex.",
  requiredMissionWins: 190,
},
"Mission 186": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Betrayal 2",
  Message: "Zerrok attempts to sabotage the mission but is confronted by his daughter, Ava.",
  requiredMissionWins: 191,
},
"Mission 187": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Betrayal 3",
  Message: "In a tense standoff, Ava is fatally wounded.",
  requiredMissionWins: 192,
},
"Mission 188": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Betrayal 4",
  Message: "Despite her injuries, Ava manages to incapacitate her father.",
  requiredMissionWins: 193,
},
"Mission 189": {
  Characters: ["jahntow", "zuark"],
  Title: "Betrayal 5",
  Message: "The team regroups and continues their mission, vowing to honor Ava's sacrifice.",
  requiredMissionWins: 194,
},
// Disabling the Defenses (1-5)
"Mission 190": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Disabling the Defenses 1",
  Message: "Using the intel from the rescued prisoners, the team locates the fortress's main control room.",
  requiredMissionWins: 195,
},
"Mission 191": {
  Characters: ["jahntow", "zuark", "ava"],
  Title: "Disabling the Defenses 2",
  Message: "The team encounters resistance but manages to reach the control room.",
  requiredMissionWins: 196,
},
"Mission 192": {
  Characters: ["jahntow", "zuark"],
  Title: "Disabling the Defenses 3",
  Message: "Echo hacks into the system, disabling the automated turrets.",
  requiredMissionWins: 197,
},
"Mission 193": {
  Characters: ["jahntow", "zuark"],
  Title: "Disabling the Defenses 4",
  Message: "The force fields are lowered, allowing the united tribes of Zephyr to launch a full-scale assault.",
  requiredMissionWins: 198,
},
"Mission 194": {
  Characters: ["jahntow", "zuark"],
  Title: "Disabling the Defenses 5",
  Message: "The team successfully disables all of Vortex's defenses, setting the stage for the final confrontation.",
  requiredMissionWins: 199,
},

// Confrontation with Xaezor (1-5)
"Mission 195": {
  Characters: ["jahntow", "zuark"],
  Title: "Confrontation with Xaezor 1",
  Message: "Jahntow and Zu'ark confront Xaezor in the heart of the fortress.",
  requiredMissionWins: 200,
},
"Mission 196": {
  Characters: ["jahntow", "zuark"],
  Title: "Confrontation with Xaezor 2",
  Message: "Xaezor reveals that he orchestrated the crash that left Jahntow orphaned on Zephyr.",
  requiredMissionWins: 201,
},
"Mission 197": {
  Characters: ["jahntow", "zuark"],
  Title: "Confrontation with Xaezor 3",
  Message: "Jahntow and Zu'ark engage in a climactic battle with Xaezor.",
  requiredMissionWins: 202,
},
"Mission 198": {
  Characters: ["jahntow", "zuark"],
  Title: "Confrontation with Xaezor 4",
  Message: "Xaezor's control over Vortex technology and dark magic poses a formidable challenge.",
  requiredMissionWins: 203,
},
"Mission 199": {
  Characters: ["jahntow", "zuark"],
  Title: "Confrontation with Xaezor 5",
  Message: "Using a combination of combat skills and strategy, Jahntow and Zu'ark manage to defeat Xaezor.",
  requiredMissionWins: 204,
},
// Victory and Aftermath (1-5)
"Mission 200": {
  Characters: ["jahntow", "zuark"],
  Title: "Victory and Aftermath 1",
  Message: "With Xaezor defeated and the Vortex threat neutralized, the tribes of Zephyr celebrate their hard-fought victory.",
  requiredMissionWins: 205,
},
"Mission 201": {
  Characters: ["jahntow", "zuark"],
  Title: "Victory and Aftermath 2",
  Message: "Jahntow, despite the personal losses he suffered, is hailed as a hero by the united tribes.",
  requiredMissionWins: 206,
},
"Mission 202": {
  Characters: ["jahntow", "zuark"],
  Title: "Victory and Aftermath 3",
  Message: "The tribes of Zephyr honor the memory of those who fell during the conflict.",
  requiredMissionWins: 207,
},
"Mission 203": {
  Characters: ["jahntow", "zuark"],
  Title: "Victory and Aftermath 4",
  Message: "The united tribes pledge to rebuild their city and protect their planet from future threats.",
  requiredMissionWins: 208,
},
"Mission 204": {
  Characters: ["jahntow", "zuark"],
  Title: "Victory and Aftermath 5",
  Message: "As the sun sets on a new era, the tribes of Zephyr stand united, ready to face whatever challenges lie ahead.",
  requiredMissionWins: 209,
},

"Mission 205": {
  Characters: ["jahntow", "zuark"],
  Title: "Peace Restored",
  Message: "You have restored peace to the planet. Congratulations.",
  requiredMissionWins: 210,
},



};
const charactersImages = {
  echo: "https://res.cloudinary.com/petrep/image/upload/v1692831347/echo_cwn4qu.png",
  zuark:
    "https://res.cloudinary.com/petrep/image/upload/v1692802930/zuark_razx6x.png",
  masterZhenwu:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/zhenwu_m81rlr.png",
  ava: "https://res.cloudinary.com/petrep/image/upload/v1692802929/ava_zm3nck.png",
  axenthon:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/axenthon_fssnf5.png",
  robot:
    "https://res.cloudinary.com/petrep/image/upload/v1692802926/robotdog_ohsubw.png",
  zhalia:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/zhalia_nimfel.png",
  veran:
    "https://res.cloudinary.com/petrep/image/upload/v1692804287/veran_nfkb74.png",
  sekhmet:
    "https://res.cloudinary.com/petrep/image/upload/v1692802925/sekhmet_vnaslu.png",
  elderBinru:
    "https://res.cloudinary.com/petrep/image/upload/v1692802927/binru_uzkwsp.png",
  kazon:
    "https://res.cloudinary.com/petrep/image/upload/v1692802923/kazon_vpiakd.png",
  zerrok:
    "https://res.cloudinary.com/petrep/image/upload/v1692802930/zerrok_rkw5d9.png",
  xaezor:
    "https://res.cloudinary.com/petrep/image/upload/v1692828125/xaezor_teppem.png",
};

const defaultPlayer = {
  name: "Jahntow",
  level: 1,
  experience: 0,
  health: 100,
  energy: 100,
  credits: 5000,
  equipment: {},
  inventory: {},
  properties: {},
  maxInventoryCount: 10,
  maxHealth: 100,
  maxEnergy: 100,
  storyWins: 0,
  item_prices: {},
};

const getState = ({ getStore, getActions, setStore }) => {
  const playerFromLocalStorage =
    JSON.parse(localStorage.getItem("player")) || {};
  playerFromLocalStorage.inventory = playerFromLocalStorage.inventory || {};
  playerFromLocalStorage.item_prices = playerFromLocalStorage.item_prices || {};

  const player = {
    ...defaultPlayer,
    ...playerFromLocalStorage,
  };

  const updatePlayerInLocalStorage = (player) => {
    try {
      localStorage.setItem("player", JSON.stringify(player));
    } catch (error) {
      console.error("Failed to save state in local storage", error);
      alert(
        "We are having trouble saving your game progress. This might be due to your browser's settings. If you're using incognito mode or have blocked cookies, please allow site data to be saved. Otherwise, your game progress might be lost."
      );
    }
  };

  const fetchPlayerData = (token) => {
    return fetch(process.env.BACKEND_URL + "/api/player", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          return null; // Invalid response, return null
        }
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
        return null; // Request failed, return null
      });
  };
  return {
    store: {
      url: process.env.BACKEND_URL,
      login_token: "",

      authError: null,
      defaultPlayer: defaultPlayer,

      player: player,
      itemsData: items_data,
      missionsData: { ...missionsData },
      propertiesData: propertiesData,
      notifications: [],
      transactions: [],
      healthRecoveryItems,
      equipmentItems: equipmentItems,
      storyMissionsData: storyMissionsData,
      charactersImages: charactersImages,
      storyMissionArc: storyMissionArc,
    },
    actions: {
      fetchPlayerData: fetchPlayerData,

      updatePlayerInDatabase: (player) => {
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error(
            "User is not authenticated, cannot update player data."
          );
          return Promise.reject(new Error("User is not authenticated."));
        }

        return fetch(process.env.BACKEND_URL + "/api/player", {
          method: "PUT",
          mode: "cors",
          body: JSON.stringify(player),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.status !== 200) {
              localStorage.removeItem("authToken"); // Remove the authToken from localStorage
              throw new Error("Failed to update player in database");
            }
          })
          .catch((error) =>
            console.error("Error updating player in database:", error)
          );
      },

      registerUser: (email, password, onSuccess) => {
        fetch(process.env.BACKEND_URL + "/api/register", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            if (resp.status !== 201) {
              // Notice the status change to 201
              throw new Error("register-error");
            }
            return resp.json();
          })
          .then((data) => {
            const token = data.token; // Extract the token from the response body
            if (!token) {
              throw new Error("Token not provided");
            }

            localStorage.setItem("authToken", token); // Store the token in localStorage

            // Use the token in any subsequent fetch you need.
            // For example, if you need player data right after registration:
            return fetch(process.env.BACKEND_URL + "/api/player", {
              method: "GET",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          })
          .then((resp) => {
            if (resp.status !== 200) {
              throw new Error("player-data-error");
            }
            return resp.json();
          })
          .then((playerData) => {
            setStore({ player: playerData });

            // If everything is successful and the callback exists, call it.
            if (onSuccess) onSuccess();
          })
          .catch((error) => {
            setStore({ authError: error, authToken: null });
          });
      },
      logout: () => {
        // Set the default player data in local storage
        localStorage.setItem("player", JSON.stringify(null));
        localStorage.removeItem("authToken"); // Remove the authToken from localStorage

        // Reset the application state's authToken
        setStore({
          player: defaultPlayer,
          itemsData: items_data,
          missionsData: { ...missionsData },
          propertiesData: propertiesData,
          notifications: [],
          transactions: [],
          healthRecoveryItems,
          equipmentItems: equipmentItems,
          storyMissionsData: storyMissionsData,
          charactersImages: charactersImages,
          storyMissionArc: storyMissionArc,
        });
      },
      loginUser: (email, password) => {
        fetch(process.env.BACKEND_URL + "/api/login", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            if (resp.status !== 200) {
              throw new Error("Login failed");
            }
            return resp.json();
          })
          .then((data) => {
            // Fetch player data first before storing token
            return fetch(process.env.BACKEND_URL + "/api/player", {
              method: "GET",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
            })
              .then((resp) => {
                if (resp.status !== 200) {
                  throw new Error("Failed to fetch player data");
                }
                return resp.json();
              })
              .then((playerData) => {
                // Token is stored only if the above fetch was successful
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("player", JSON.stringify(player));
                setStore({ authError: null, player: playerData });

                getActions().updatePlayerInDatabase(playerData);
              });
          })
          .catch((error) => {
            console.error("Error during login process:", error);
            setStore({ authToken: null, authError: error.message });
          });
      },

      updateInventory: () => {
        const store = getStore();
        const { player, propertiesData, itemsData } = store;

        const updatedInventory = { ...player.inventory };

        for (let category in propertiesData) {
          for (let propertyName in propertiesData[category]) {
            if (player.properties[propertyName]) {
              const property = propertiesData[category][propertyName];
              const generatedItem = property["Item Generated"];
              const quantity = player.properties[propertyName];

              // Fetch the item data
              const itemCategory = Object.keys(itemsData).find(
                (key) => itemsData[key][generatedItem]
              );

              const itemData = itemsData[itemCategory][generatedItem];

              if (itemData) {
                // Check if player's inventory for the item is less than 100 before adding new items
                const currentInventoryCount =
                  updatedInventory[generatedItem]?.quantity || 0;
                if (currentInventoryCount < player.maxInventoryCount) {
                  let newItems = quantity * property["Generation Rate"];
                  // If adding new items will exceed 100, adjust it to only add what will reach 100
                  if (
                    currentInventoryCount + newItems >
                    player.maxInventoryCount
                  ) {
                    newItems = player.maxInventoryCount - currentInventoryCount;
                  }
                  updatedInventory[generatedItem] = {
                    ...itemData,
                    quantity: currentInventoryCount + newItems,
                  };
                }
              }
            }
          }
        }

        const updatedPlayer = { ...player, inventory: updatedInventory };
        setStore({ ...store, player: updatedPlayer });
        updatePlayerInLocalStorage(updatedPlayer);
        getActions().updatePlayerInDatabase(updatedPlayer);
      },

      resetPlayer: () => {
        setStore({
          player: defaultPlayer,
          transactions: [],
          notifications: [],
        });
        updatePlayerInLocalStorage(defaultPlayer);
        getActions().updatePlayerInDatabase(defaultPlayer);
      },

      updatePlayerLevel: () => {
        const store = getStore();
        const experienceNeeded = store.player.level * 100; // You can adjust this formula as per your requirement
        if (store.player.experience >= experienceNeeded) {
          const newLevel = store.player.level + 1;

          const updatedPlayer = {
            ...store.player,
            level: newLevel,
            experience: 0,
            // health: store.player.health + newLevel * 100,
            // energy: store.player.energy + newLevel * 100,
            credits: store.player.credits + newLevel * 1000,
          };

          setStore({ ...store, player: updatedPlayer });
          updatePlayerInLocalStorage(updatedPlayer);
          getActions().updatePlayerInDatabase(updatedPlayer);
          alert(`Congratulations! You've leveled up to Level ${newLevel}!`);
        }
      },
      startEnergyRegen: () => {
        const interval = setInterval(() => {
          const store = getStore();

          // Calculate new energy value
          let newEnergy = store.player.energy + 1;

          // Check if newEnergy is greater than or equal to maxEnergy
          if (newEnergy >= store.player.maxEnergy) {
            newEnergy = store.player.maxEnergy;
          }

          const updatedPlayer = {
            ...store.player,
            energy: newEnergy,
          };

          setStore({
            ...store,
            player: updatedPlayer,
          });
        }, 10 * 1000); // 10 seconds

        return interval;
      },

      adjustPrices: () => {
        // Get the current store
        const store = getStore();
        const token = localStorage.getItem("authToken");

        // Create a new object with adjusted prices
        const adjustedItemsData = {};

        // Prepare an array for new notifications
        const newNotifications = [];

        // Iterate over each category
        for (let category in store.itemsData) {
          adjustedItemsData[category] = {};

          // Iterate over each item in the category
          for (let item in store.itemsData[category]) {
            // Get the base cost and current cost
            const baseCost = store.itemsData[category][item]["Base Cost"];
            let currentCost = store.itemsData[category][item]["Current Cost"];

            // Adjust the current cost by a random percentage (here, between -10% and +10%)
            const adjustmentFactor = 0.1; // 10%
            currentCost *= 1 + (Math.random() * 2 - 1) * adjustmentFactor;

            // If the current cost is too far from the base cost (here, more than 50% off), reset it
            if (Math.abs(currentCost - baseCost) / baseCost > 0.5) {
              currentCost = baseCost;
              const notification = `The price of ${item} has reverted to its base cost.`;
              newNotifications.push(notification);
            }

            // Add the item to the new data object
            adjustedItemsData[category][item] = {
              ...store.itemsData[category][item], // Copy all the existing properties
              "Current Cost": currentCost, // Update the current cost
            };
          }
        }

        // After adjusting all the prices, save them to the backend
        fetch(process.env.BACKEND_URL + "/api/player", {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, // Added Authorization header
          },
          body: JSON.stringify({
            item_prices: adjustedItemsData,
          }),
        })
          .then((response) => {
            if (response.status === 200) {
              // Added status check
              return response.json();
            } else {
              throw new Error("Error updating item prices");
            }
          })
          .then((data) => {
            // Handle the response if necessary
            // For example, you might want to update the frontend with the saved prices
          })
          .catch((error) => {
            console.error("Error saving adjusted prices:", error);
          });

        // Update the store
        setStore({
          player: {
            ...store.player,
            item_prices: adjustedItemsData,
          },
          itemsData: adjustedItemsData,
          notifications: [...newNotifications, ...store.notifications].slice(
            0,
            4
          ), // Keep only the 4 most recent notifications
        });
      },

      updateTransactions: (transaction) => {
        const store = getStore();

        // Adding new transaction to the beginning of the array
        const newTransactions = [transaction, ...store.transactions];

        // If the array's length is over 50, remove the oldest transactions
        if (newTransactions.length > 50) {
          newTransactions.length = 50;
        }

        setStore({ transactions: newTransactions });
      },

      updatePlayer: (player) => {
        setStore({ player });
        updatePlayerInLocalStorage(player);
        getActions().updatePlayerInDatabase(player);
      },
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      loadSomeData: () => {
        /**
					  fetch().then().then(data => setStore({ "foo": data.bar }))
				  */
      },
    },
  };
};

export default getState;
