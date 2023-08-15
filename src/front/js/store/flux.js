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
      "Generation Rate": 0.03,
      Rank: 4,
    },
    "Quantum Lab": {
      "Base Cost": 4000,
      "Current Cost": 4000,
      "Item Generated": "Fusion Core",
      "Generation Rate": 0.02,
      Rank: 8,
    },
    "Omega Factory": {
      "Base Cost": 8000,
      "Current Cost": 8000,
      "Item Generated": "Omega Core",
      "Generation Rate": 0.01,
      Rank: 28,
    },
    "Fusion Supercollider": {
      "Base Cost": 16000,
      "Current Cost": 16000,
      "Item Generated": "Alpha Core",
      "Generation Rate": 0.06,
      Rank: 20,
    },
    "Quantum Superlab": {
      "Base Cost": 32000,
      "Current Cost": 32000,
      "Item Generated": "Fusion Core",
      "Generation Rate": 0.04,
      Rank: 20,
    },
    "Omega MegaFactory": {
      "Base Cost": 64000,
      "Current Cost": 64000,
      "Item Generated": "Omega Core",
      "Generation Rate": 0.02,
      Rank: 30,
    },
  },
  "Nano Production Sites": {
    "NanoMesh Plant": {
      "Base Cost": 2500,
      "Current Cost": 2500,
      "Item Generated": "NanoMesh",
      "Generation Rate": 0.03,
      Rank: 4,
    },
    "HyperWeave Workshop": {
      "Base Cost": 5000,
      "Current Cost": 5000,
      "Item Generated": "HyperWeave",
      "Generation Rate": 0.02,
      Rank: 8,
    },
    "Quantum Fabric Loom": {
      "Base Cost": 10000,
      "Current Cost": 10000,
      "Item Generated": "Quantum Fabric",
      "Generation Rate": 0.01,
      Rank: 33,
    },
    "NanoMesh MegaPlant": {
      "Base Cost": 20000,
      "Current Cost": 20000,
      "Item Generated": "NanoMesh",
      "Generation Rate": 0.06,
      Rank: 10,
    },
    "HyperWeave MegaWorkshop": {
      "Base Cost": 40000,
      "Current Cost": 40000,
      "Item Generated": "HyperWeave",
      "Generation Rate": 0.04,
      Rank: 20,
    },
    "Quantum Fabric MegaLoom": {
      "Base Cost": 80000,
      "Current Cost": 80000,
      "Item Generated": "Quantum Fabric",
      "Generation Rate": 0.02,
      Rank: 30,
    },
  },
  "Cybernetic Clinics": {
    "NeuroLink Clinic": {
      "Base Cost": 3000,
      "Current Cost": 3000,
      "Item Generated": "NeuroLink",
      "Generation Rate": 0.03,
      Rank: 4,
    },
    "SynthArm Surgery": {
      "Base Cost": 6000,
      "Current Cost": 6000,
      "Item Generated": "SynthArm",
      "Generation Rate": 0.02,
      Rank: 8,
    },
    "OmegaBrain Center": {
      "Base Cost": 12000,
      "Current Cost": 12000,
      "Item Generated": "OmegaBrain",
      "Generation Rate": 0.01,
      Rank: 28,
    },
    "NeuroLink MegaClinic": {
      "Base Cost": 24000,
      "Current Cost": 24000,
      "Item Generated": "NeuroLink",
      "Generation Rate": 0.06,
      Rank: 15,
    },
    "SynthArm MegaSurgery": {
      "Base Cost": 48000,
      "Current Cost": 48000,
      "Item Generated": "SynthArm",
      "Generation Rate": 0.04,
      Rank: 20,
    },
    "OmegaBrain MegaCenter": {
      "Base Cost": 96000,
      "Current Cost": 96000,
      "Item Generated": "OmegaBrain",
      "Generation Rate": 0.02,
      Rank: 30,
    },
  },
  "Data Cube Manufactures": {
    "Data Shard Factory": {
      "Base Cost": 3500,
      "Current Cost": 3500,
      "Item Generated": "Data Shard",
      "Generation Rate": 0.03,
      Rank: 4,
    },
    "Quantum Node Works": {
      "Base Cost": 7000,
      "Current Cost": 7000,
      "Item Generated": "Quantum Node",
      "Generation Rate": 0.02,
      Rank: 8,
    },
    "Infinity Matrix Hub": {
      "Base Cost": 14000,
      "Current Cost": 14000,
      "Item Generated": "Infinity Matrix",
      "Generation Rate": 0.01,
      Rank: 28,
    },
    "Data Shard MegaFactory": {
      "Base Cost": 28000,
      "Current Cost": 28000,
      "Item Generated": "Data Shard",
      "Generation Rate": 0.06,
      Rank: 15,
    },
    "Quantum Node MegaWorks": {
      "Base Cost": 56000,
      "Current Cost": 56000,
      "Item Generated": "Quantum Node",
      "Generation Rate": 0.04,
      Rank: 25,
    },
    "Infinity Matrix MegaHub": {
      "Base Cost": 112000,
      "Current Cost": 112000,
      "Item Generated": "Infinity Matrix",
      "Generation Rate": 0.02,
      Rank: 35,
    },
  },
  "Medical Facilities": {
    "BioPatch Pharmacy": {
      "Base Cost": 4000,
      "Current Cost": 4000,
      "Item Generated": "BioPatch",
      "Generation Rate": 0.03,
      Rank: 4,
    },
    "NanoSyringe Clinic": {
      "Base Cost": 8000,
      "Current Cost": 8000,
      "Item Generated": "NanoSyringe",
      "Generation Rate": 0.02,
      Rank: 8,
    },
    "RegenGen Hospital": {
      "Base Cost": 16000,
      "Current Cost": 16000,
      "Item Generated": "RegenGen",
      "Generation Rate": 0.01,
      Rank: 28,
    },
    "BioPatch MegaPharmacy": {
      "Base Cost": 32000,
      "Current Cost": 32000,
      "Item Generated": "BioPatch",
      "Generation Rate": 0.06,
      Rank: 15,
    },
    "NanoSyringe MegaClinic": {
      "Base Cost": 64000,
      "Current Cost": 64000,
      "Item Generated": "NanoSyringe",
      "Generation Rate": 0.04,
      Rank: 25,
    },
    "RegenGen MegaHospital": {
      "Base Cost": 128000,
      "Current Cost": 128000,
      "Item Generated": "RegenGen",
      "Generation Rate": 0.02,
      Rank: 35,
    },
  },
  "Encryption Enterprises": {
    "Cryptex Workshop": {
      "Base Cost": 5000,
      "Current Cost": 5000,
      "Item Generated": "Cryptex",
      "Generation Rate": 0.03,
      Rank: 4,
    },
    "Quantum Lock Forge": {
      "Base Cost": 10000,
      "Current Cost": 10000,
      "Item Generated": "Quantum Lock",
      "Generation Rate": 0.02,
      Rank: 26,
    },
    "Omega Seal Center": {
      "Base Cost": 20000,
      "Current Cost": 20000,
      "Item Generated": "Omega Seal",
      "Generation Rate": 0.01,
      Rank: 28,
    },
    "Cryptex MegaWorkshop": {
      "Base Cost": 40000,
      "Current Cost": 40000,
      "Item Generated": "Cryptex",
      "Generation Rate": 0.06,
      Rank: 25,
    },
    "Quantum Lock MegaForge": {
      "Base Cost": 80000,
      "Current Cost": 80000,
      "Item Generated": "Quantum Lock",
      "Generation Rate": 0.04,
      Rank: 35,
    },
    "Omega Seal MegaCenter": {
      "Base Cost": 160000,
      "Current Cost": 160000,
      "Item Generated": "Omega Seal",
      "Generation Rate": 0.02,
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
  "Cultural Espionage": {
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
  "Energized Negotiations": {
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
  "Celestial Harmony": {
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

  "Temporal Labyrinth": {
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
  "Subterranean Reclamation": {
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
  "Astral Harmonics": {
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
  "Nebula Odyssey": {
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

  "Sonic Resonance": {
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
  "Crystal Core": {
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
  "Luminous Unison": {
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
  "Celestial Nexus": {
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

  "Eclipse Ritual": {
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
  "Flameforged Relics": {
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
  "Stellar Aegis": {
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
  "Celestial Confluence": {
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

  "Luminous Correlation": {
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
  "Ethereal Nexus": {
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
  "Harmonic Resonance": {
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
  "Astral Rhapsody": {
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

  "Celestial Echo": {
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
  "Nebula Synchrony": {
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
  "Ethereal Convergence": {
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
  "Cosmic Overture": {
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

  "Cosmic Confrontation - Part 1": {
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

  "Cosmic Confrontation - Part 2": {
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

  "Cosmic Confrontation - Part 3": {
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
};

const getState = ({ getStore, getActions, setStore }) => {
  const playerFromLocalStorage =
    JSON.parse(localStorage.getItem("player")) || {};
  playerFromLocalStorage.inventory = playerFromLocalStorage.inventory || {};

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
        localStorage.setItem("player", JSON.stringify(defaultPlayer));
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

        // Update the store
        setStore({
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
