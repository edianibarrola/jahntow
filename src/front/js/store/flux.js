const items_data = {
  "Energy Cores": {
    "Alpha Core": { "Base Cost": 50, "Current Cost": 50, Rank: 1 },
    "Fusion Core": { "Base Cost": 150, "Current Cost": 150, Rank: 2 },
    "Omega Core": { "Base Cost": 300, "Current Cost": 300, Rank: 3 },
  },
  Nanomaterials: {
    NanoMesh: { "Base Cost": 80, "Current Cost": 80, Rank: 1 },
    HyperWeave: { "Base Cost": 200, "Current Cost": 200, Rank: 2 },
    "Quantum Fabric": { "Base Cost": 400, "Current Cost": 400, Rank: 3 },
  },
  "Cybernetic Implants": {
    NeuroLink: { "Base Cost": 120, "Current Cost": 120, Rank: 1 },
    SynthArm: { "Base Cost": 250, "Current Cost": 250, Rank: 2 },
    OmegaBrain: { "Base Cost": 500, "Current Cost": 500, Rank: 3 },
  },
  "Quantum Data Cubes": {
    "Data Shard": { "Base Cost": 100, "Current Cost": 100, Rank: 1 },
    "Quantum Node": { "Base Cost": 300, "Current Cost": 300, Rank: 2 },
    "Infinity Matrix": { "Base Cost": 600, "Current Cost": 600, Rank: 3 },
  },
  "Advanced Medicines": {
    BioPatch: { "Base Cost": 90, "Current Cost": 90, Rank: 1 },
    NanoSyringe: { "Base Cost": 220, "Current Cost": 220, Rank: 2 },
    RegenGen: { "Base Cost": 450, "Current Cost": 450, Rank: 3 },
  },
  "Quantum Encryption Keys": {
    Cryptex: { "Base Cost": 70, "Current Cost": 70, Rank: 1 },
    "Quantum Lock": { "Base Cost": 180, "Current Cost": 180, Rank: 2 },
    "Omega Seal": { "Base Cost": 350, "Current Cost": 350, Rank: 3 },
  },
};

const missionsData = {
  "Asteroid Mining": {
    "Required Credits": 100,
    "Required Energy": 10,
    Reward: 200,
    Experience: 50,
    "Health Effect": 5,
    Rank: 1,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Heading towards the asteroid belt for mining operations.",
    successMessage:
      "E.c.h.o.: Successfully mined precious resources from the asteroid, gaining 200 credits and 50 experience.",
    failureMessage:
      "E.c.h.o.: Mining operations were not successful. Better luck next time.",
  },
  "Space Salvage": {
    "Required Credits": 150,
    "Required Energy": 15,
    Reward: 300,
    Experience: 75,
    "Health Effect": 7,
    Rank: 2,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Scanning space debris for valuable salvage.",
    successMessage:
      "E.c.h.o.: Salvage successful. Recovered items translated to 300 credits and 75 experience.",
    failureMessage:
      "E.c.h.o.: Salvage mission was unsuccessful. Nothing of value found.",
  },
  "Alien Artifact Retrieval": {
    "Required Credits": 220,
    "Required Energy": 22,
    Reward: 440,
    Experience: 110,
    "Health Effect": 11,
    Rank: 3,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Setting coordinates to a rumored alien artifact location.",
    successMessage:
      "E.c.h.o.: Artifact retrieved successfully, granting you 440 credits and 110 experience.",
    failureMessage:
      "E.c.h.o.: The mission to retrieve the alien artifact failed. It seems we were not the only ones after it.",
  },
  "Galactic Trading": {
    "Required Credits": 300,
    "Required Energy": 30,
    Reward: 600,
    Experience: 150,
    "Health Effect": 15,
    Rank: 4,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Initiating trading protocols with neighboring galactic entities.",
    successMessage:
      "E.c.h.o.: Trade successful. The profits earned you 600 credits and 150 experience.",
    failureMessage:
      "E.c.h.o.: The trade negotiation failed. No profits this time.",
  },
  "Deep Space Exploration": {
    "Required Credits": 400,
    "Required Energy": 40,
    Reward: 800,
    Experience: 200,
    "Health Effect": 20,
    Rank: 5,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Preparing for a deep-space exploration mission to uncharted territories.",
    successMessage:
      "E.c.h.o.: Exploration successful. New regions charted and you earned 800 credits and 200 experience.",
    failureMessage:
      "E.c.h.o.: The exploration mission faced unforeseen challenges. No new data collected.",
  },

  "Starship Racing": {
    "Required Credits": 520,
    "Required Energy": 50,
    Reward: 1040,
    Experience: 260,
    "Health Effect": 25,
    Rank: 6,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Enrolling in the intergalactic starship racing event.",
    successMessage:
      "E.c.h.o.: You won the race! Credited 1040 credits and 260 experience for your performance.",
    failureMessage:
      "E.c.h.o.: It was a tough race. Didn't make it to the top this time.",
  },
  "Rescue Operation": {
    "Required Credits": 650,
    "Required Energy": 60,
    Reward: 1300,
    Experience: 325,
    "Health Effect": 30,
    Rank: 7,
    requiredEquipment: {
      "Basic Sword": 1,
    },
    startMessage:
      "E.c.h.o.: Picking up distress signals. Initiating rescue protocols.",
    successMessage:
      "E.c.h.o.: Rescue successful! You've been credited with 1300 credits and 325 experience.",
    failureMessage:
      "E.c.h.o.: The rescue operation faced challenges. Not everyone made it back.",
  },
  "Black Hole Research": {
    "Required Credits": 800,
    "Required Energy": 75,
    Reward: 1600,
    Experience: 400,
    "Health Effect": 38,
    Rank: 8,
    requiredEquipment: {
      "Basic Sword": 1,
      "Basic Armor": 2,
    },
    startMessage:
      "E.c.h.o.: Approaching the event horizon for black hole research.",
    successMessage:
      "E.c.h.o.: Data collected successfully. Your findings yielded 1600 credits and 400 experience.",
    failureMessage:
      "E.c.h.o.: The black hole's gravity was stronger than anticipated. Research was compromised.",
  },
  "Celestial Diplomacy": {
    "Required Credits": 1000,
    "Required Energy": 90,
    Reward: 2000,
    Experience: 500,
    "Health Effect": 45,
    Rank: 9,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Establishing communication channels for diplomatic discussions with alien civilizations.",
    successMessage:
      "E.c.h.o.: Diplomacy successful. Established friendly relations and earned 2000 credits and 500 experience.",
    failureMessage:
      "E.c.h.o.: The diplomatic mission did not go as planned. The aliens were not receptive.",
  },
  "Galaxy Defense": {
    "Required Credits": 1200,
    "Required Energy": 110,
    Reward: 2400,
    Experience: 600,
    "Health Effect": 55,
    Rank: 10,
    requiredEquipment: {
      "Basic Sword": 4,
      "Basic Armor": 2,
    },
    startMessage:
      "E.c.h.o.: Alert! Hostile forces detected. Preparing for defense.",
    successMessage:
      "E.c.h.o.: Galaxy successfully defended. Your bravery has earned you 2400 credits and 600 experience.",
    failureMessage:
      "E.c.h.o.: The galaxy defense was challenging. Some areas suffered damage.",
  },

  "Quantum Mechanics Mastery": {
    "Required Credits": 1450,
    "Required Energy": 130,
    Reward: 2900,
    Experience: 725,
    "Health Effect": 65,
    Rank: 11,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Initiating deep dive into quantum mechanics.",
    successMessage:
      "E.c.h.o.: Successfully mastered quantum mechanics! Earned 2900 credits and 725 experience.",
    failureMessage:
      "E.c.h.o.: Quantum Mechanics is perplexing. Couldn't completely grasp the concept.",
  },
  "Interstellar Exploration": {
    "Required Credits": 1750,
    "Required Energy": 150,
    Reward: 3500,
    Experience: 875,
    "Health Effect": 75,
    Rank: 12,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Setting course for uncharted territories in the interstellar realm.",
    successMessage:
      "E.c.h.o.: Exploration successful! Discovered new systems and earned 3500 credits and 875 experience.",
    failureMessage:
      "E.c.h.o.: The uncharted territories proved challenging. Exploration was not fully successful.",
  },
  "Temporal Anomaly Research": {
    "Required Credits": 2100,
    "Required Energy": 175,
    Reward: 4200,
    Experience: 1050,
    "Health Effect": 87,
    Rank: 13,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Detected a temporal anomaly. Commencing research.",
    successMessage:
      "E.c.h.o.: Successfully researched the temporal anomaly! Rewarded 4200 credits and 1050 experience.",
    failureMessage:
      "E.c.h.o.: The temporal anomaly was unstable. Research faced setbacks.",
  },
  "Galactic Archaeology": {
    "Required Credits": 2500,
    "Required Energy": 200,
    Reward: 5000,
    Experience: 1250,
    "Health Effect": 100,
    Rank: 14,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Embarking on a quest to uncover the mysteries of ancient galactic civilizations.",
    successMessage:
      "E.c.h.o.: Successful excavation! Unearthed artifacts worth 5000 credits and 1250 experience.",
    failureMessage:
      "E.c.h.o.: The ruins were labyrinthine and perplexing. Some artifacts remain elusive.",
  },
  "Universe Origins Study": {
    "Required Credits": 3000,
    "Required Energy": 230,
    Reward: 6000,
    Experience: 1500,
    "Health Effect": 115,
    Rank: 15,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Launching probe to research the origins of the universe.",
    successMessage:
      "E.c.h.o.: Significant discoveries made! Earned 6000 credits and 1500 experience.",
    failureMessage:
      "E.c.h.o.: The vastness of the universe is overwhelming. Some mysteries remain unsolved.",
  },

  "Exodimensional Expedition": {
    "Required Credits": 3500,
    "Required Energy": 260,
    Reward: 7000,
    Experience: 1750,
    "Health Effect": 130,
    Rank: 16,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Preparing to venture into exodimensions. Unknown challenges await.",
    successMessage:
      "E.c.h.o.: Successfully navigated the exodimensions! Secured 7000 credits and 1750 experience.",
    failureMessage:
      "E.c.h.o.: The exodimensions are unpredictable. Could not complete the mission.",
  },
  "Dark Matter Manipulation": {
    "Required Credits": 4100,
    "Required Energy": 290,
    Reward: 8200,
    Experience: 2050,
    "Health Effect": 145,
    Rank: 17,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Initiating procedures to manipulate dark matter.",
    successMessage:
      "E.c.h.o.: Dark matter manipulation successful! Acquired 8200 credits and 2050 experience.",
    failureMessage:
      "E.c.h.o.: Failed to control the elusive dark matter. Mission aborted.",
  },
  "Galactic Diplomacy": {
    "Required Credits": 4800,
    "Required Energy": 320,
    Reward: 9600,
    Experience: 2400,
    "Health Effect": 160,
    Rank: 18,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Engaging in diplomatic talks with advanced extraterrestrial civilizations.",
    successMessage:
      "E.c.h.o.: Diplomacy successful! Strengthened interstellar ties and earned 9600 credits and 2400 experience.",
    failureMessage:
      "E.c.h.o.: Diplomatic talks were challenging. Not all objectives achieved.",
  },
  "Void Phenomenon Analysis": {
    "Required Credits": 5600,
    "Required Energy": 350,
    Reward: 11200,
    Experience: 2800,
    "Health Effect": 175,
    Rank: 19,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Commencing analysis of mysterious void phenomena.",
    successMessage:
      "E.c.h.o.: Analysis complete! Deciphered void secrets and obtained 11200 credits and 2800 experience.",
    failureMessage:
      "E.c.h.o.: The void remains enigmatic. Analysis was inconclusive.",
  },
  "Cosmic Nexus Activation": {
    "Required Credits": 6500,
    "Required Energy": 385,
    Reward: 13000,
    Experience: 3250,
    "Health Effect": 192,
    Rank: 20,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Initiating protocols to activate the cosmic nexus.",
    successMessage:
      "E.c.h.o.: Cosmic Nexus activated! Gained 13000 credits and 3250 experience.",
    failureMessage:
      "E.c.h.o.: The cosmic nexus proved too complex. Activation failed.",
  },

  "Temporal Loop Investigation": {
    "Required Credits": 7500,
    "Required Energy": 420,
    Reward: 15000,
    Experience: 3750,
    "Health Effect": 210,
    Rank: 21,
    requiredEquipment: {
      "Advanced Sword": 4,
      "Advanced Armor": 2,
      "Advanced Tech": 1,
    },
    startMessage:
      "E.c.h.o.: Preparing to investigate disturbances in the temporal loop.",
    successMessage:
      "E.c.h.o.: Temporal loop stabilized! Retrieved 15000 credits and 3750 experience.",
    failureMessage:
      "E.c.h.o.: Time anomalies detected. Investigation proved challenging.",
  },
  "Nebular Storm Navigation": {
    "Required Credits": 8600,
    "Required Energy": 460,
    Reward: 17200,
    Experience: 4300,
    "Health Effect": 230,
    Rank: 22,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Initiating navigation through a tumultuous nebular storm.",
    successMessage:
      "E.c.h.o.: Successfully navigated the storm! Acquired 17200 credits and 4300 experience.",
    failureMessage:
      "E.c.h.o.: Nebular turbulence too intense. Navigation unsuccessful.",
  },
  "Celestial Artifact Retrieval": {
    "Required Credits": 9800,
    "Required Energy": 500,
    Reward: 19600,
    Experience: 4900,
    "Health Effect": 250,
    Rank: 23,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Mission is to retrieve a rare celestial artifact from an ancient site.",
    successMessage:
      "E.c.h.o.: Artifact secured! Obtained 19600 credits and 4900 experience.",
    failureMessage:
      "E.c.h.o.: Artifact retrieval mission faced unforeseen challenges.",
  },
  "Supernova Containment": {
    "Required Credits": 11000,
    "Required Energy": 550,
    Reward: 22000,
    Experience: 5500,
    "Health Effect": 275,
    Rank: 24,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Attempting to contain the imminent supernova and harness its energy.",
    successMessage:
      "E.c.h.o.: Supernova successfully contained! 22000 credits and 5500 experience gained.",
    failureMessage:
      "E.c.h.o.: Supernova containment measures failed. Energy release was catastrophic.",
  },
  "Black Hole Mapping": {
    "Required Credits": 12400,
    "Required Energy": 600,
    Reward: 24800,
    Experience: 6200,
    "Health Effect": 300,
    Rank: 25,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Launching probes to map the event horizon of a black hole.",
    successMessage:
      "E.c.h.o.: Successful mapping! Collected valuable data and 24800 credits along with 6200 experience.",
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
      Rank: 1,
    },
    "Quantum Lab": {
      "Base Cost": 4000,
      "Current Cost": 4000,
      "Item Generated": "Fusion Core",
      "Generation Rate": 0.02,
      Rank: 7,
    },
    "Omega Factory": {
      "Base Cost": 8000,
      "Current Cost": 8000,
      "Item Generated": "Omega Core",
      "Generation Rate": 0.01,
      Rank: 13,
    },
    "Fusion Supercollider": {
      "Base Cost": 16000,
      "Current Cost": 16000,
      "Item Generated": "Alpha Core",
      "Generation Rate": 0.06,
      Rank: 19,
    },
    "Quantum Superlab": {
      "Base Cost": 32000,
      "Current Cost": 32000,
      "Item Generated": "Fusion Core",
      "Generation Rate": 0.04,
      Rank: 25,
    },
    "Omega MegaFactory": {
      "Base Cost": 64000,
      "Current Cost": 64000,
      "Item Generated": "Omega Core",
      "Generation Rate": 0.02,
      Rank: 31,
    },
  },
  "Nano Production Sites": {
    "NanoMesh Plant": {
      "Base Cost": 2500,
      "Current Cost": 2500,
      "Item Generated": "NanoMesh",
      "Generation Rate": 0.03,
      Rank: 2,
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
      Rank: 14,
    },
    "NanoMesh MegaPlant": {
      "Base Cost": 20000,
      "Current Cost": 20000,
      "Item Generated": "NanoMesh",
      "Generation Rate": 0.06,
      Rank: 20,
    },
    "HyperWeave MegaWorkshop": {
      "Base Cost": 40000,
      "Current Cost": 40000,
      "Item Generated": "HyperWeave",
      "Generation Rate": 0.04,
      Rank: 26,
    },
    "Quantum Fabric MegaLoom": {
      "Base Cost": 80000,
      "Current Cost": 80000,
      "Item Generated": "Quantum Fabric",
      "Generation Rate": 0.02,
      Rank: 32,
    },
  },
  "Cybernetic Clinics": {
    "NeuroLink Clinic": {
      "Base Cost": 3000,
      "Current Cost": 3000,
      "Item Generated": "NeuroLink",
      "Generation Rate": 0.03,
      Rank: 3,
    },
    "SynthArm Surgery": {
      "Base Cost": 6000,
      "Current Cost": 6000,
      "Item Generated": "SynthArm",
      "Generation Rate": 0.02,
      Rank: 9,
    },
    "OmegaBrain Center": {
      "Base Cost": 12000,
      "Current Cost": 12000,
      "Item Generated": "OmegaBrain",
      "Generation Rate": 0.01,
      Rank: 15,
    },
    "NeuroLink MegaClinic": {
      "Base Cost": 24000,
      "Current Cost": 24000,
      "Item Generated": "NeuroLink",
      "Generation Rate": 0.06,
      Rank: 21,
    },
    "SynthArm MegaSurgery": {
      "Base Cost": 48000,
      "Current Cost": 48000,
      "Item Generated": "SynthArm",
      "Generation Rate": 0.04,
      Rank: 27,
    },
    "OmegaBrain MegaCenter": {
      "Base Cost": 96000,
      "Current Cost": 96000,
      "Item Generated": "OmegaBrain",
      "Generation Rate": 0.02,
      Rank: 33,
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
      Rank: 10,
    },
    "Infinity Matrix Hub": {
      "Base Cost": 14000,
      "Current Cost": 14000,
      "Item Generated": "Infinity Matrix",
      "Generation Rate": 0.01,
      Rank: 16,
    },
    "Data Shard MegaFactory": {
      "Base Cost": 28000,
      "Current Cost": 28000,
      "Item Generated": "Data Shard",
      "Generation Rate": 0.06,
      Rank: 22,
    },
    "Quantum Node MegaWorks": {
      "Base Cost": 56000,
      "Current Cost": 56000,
      "Item Generated": "Quantum Node",
      "Generation Rate": 0.04,
      Rank: 28,
    },
    "Infinity Matrix MegaHub": {
      "Base Cost": 112000,
      "Current Cost": 112000,
      "Item Generated": "Infinity Matrix",
      "Generation Rate": 0.02,
      Rank: 34,
    },
  },
  "Medical Facilities": {
    "BioPatch Pharmacy": {
      "Base Cost": 4000,
      "Current Cost": 4000,
      "Item Generated": "BioPatch",
      "Generation Rate": 0.03,
      Rank: 5,
    },
    "NanoSyringe Clinic": {
      "Base Cost": 8000,
      "Current Cost": 8000,
      "Item Generated": "NanoSyringe",
      "Generation Rate": 0.02,
      Rank: 11,
    },
    "RegenGen Hospital": {
      "Base Cost": 16000,
      "Current Cost": 16000,
      "Item Generated": "RegenGen",
      "Generation Rate": 0.01,
      Rank: 17,
    },
    "BioPatch MegaPharmacy": {
      "Base Cost": 32000,
      "Current Cost": 32000,
      "Item Generated": "BioPatch",
      "Generation Rate": 0.06,
      Rank: 23,
    },
    "NanoSyringe MegaClinic": {
      "Base Cost": 64000,
      "Current Cost": 64000,
      "Item Generated": "NanoSyringe",
      "Generation Rate": 0.04,
      Rank: 29,
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
      "Base Cost": 1500,
      "Current Cost": 1500,
      "Item Generated": "Cryptex",
      "Generation Rate": 0.03,
      Rank: 6,
    },
    "Quantum Lock Forge": {
      "Base Cost": 3000,
      "Current Cost": 3000,
      "Item Generated": "Quantum Lock",
      "Generation Rate": 0.02,
      Rank: 12,
    },
    "Omega Seal Center": {
      "Base Cost": 6000,
      "Current Cost": 6000,
      "Item Generated": "Omega Seal",
      "Generation Rate": 0.01,
      Rank: 18,
    },
    "Cryptex MegaWorkshop": {
      "Base Cost": 12000,
      "Current Cost": 12000,
      "Item Generated": "Cryptex",
      "Generation Rate": 0.06,
      Rank: 24,
    },
    "Quantum Lock MegaForge": {
      "Base Cost": 24000,
      "Current Cost": 24000,
      "Item Generated": "Quantum Lock",
      "Generation Rate": 0.04,
      Rank: 30,
    },
    "Omega Seal MegaCenter": {
      "Base Cost": 48000,
      "Current Cost": 48000,
      "Item Generated": "Omega Seal",
      "Generation Rate": 0.02,
      Rank: 36,
    },
  },
};

const healthRecoveryItems = {
  Health: {
    "HealPulse Emitter": {
      Cost: 600,
      "Health Gain": 30,
      "Energy Gain": 0,
      Cooldown: 40,
    },
    "VitalWave Device": {
      Cost: 1000,
      "Health Gain": 60,
      "Energy Gain": 0,
      Cooldown: 80,
    },
    "Phoenix Resurrect Kit": {
      Cost: 1500,
      "Health Gain": 100,
      "Energy Gain": 0,
      Cooldown: 250,
    },
  },

  Energy: {
    "EnergyStim Injector": {
      Cost: 400,
      "Health Gain": 0,
      "Energy Gain": 15,
      Cooldown: 25,
    },
    "PowerPulse Capsule": {
      Cost: 700,
      "Health Gain": 0,
      "Energy Gain": 30,
      Cooldown: 50,
    },
    "Quantum Energy Kit": {
      Cost: 1100,
      "Health Gain": 0,
      "Energy Gain": 60,
      Cooldown: 150,
    },
  },
  Combo: {
    "NanoMed Injector": {
      Cost: 500,
      "Health Gain": 20,
      "Energy Gain": 10,
      Cooldown: 30,
    },
    "RegenBoost Capsule": {
      Cost: 800,
      "Health Gain": 40,
      "Energy Gain": 25,
      Cooldown: 60,
    },
    "Omega Recovery Kit": {
      Cost: 1200,
      "Health Gain": 80,
      "Energy Gain": 50,
      Cooldown: 200,
    },
  },
};
const equipmentItems = {
  Weapons: {
    "Basic Sword": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Advanced Sword": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 5,
    },
    "Power Sword": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 10,
    },
  },
  Armor: {
    "Basic Armor": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 1,
    },
    "Advanced Armor": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 10,
    },
    "Power Armor": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 25,
    },
  },
  Tech: {
    "Basic Tech": {
      "Base Cost": 50,
      "Current Cost": 50,
      "Required Level": 10,
    },
    "Advanced Tech": {
      "Base Cost": 150,
      "Current Cost": 150,
      "Required Level": 25,
    },
    "Power Tech": {
      "Base Cost": 500,
      "Current Cost": 500,
      "Required Level": 50,
    },
  },
};
const defaultPlayer = {
  name: "Jahntow",
  level: 1,
  experience: 0,
  health: 100,
  energy: 100,
  credits: 1000,
  equipment: {},
  inventory: {},
  properties: {},
  maxInventoryCount: 10,
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

  return {
    store: {
      url: process.env.BACKEND_URL,
      login_token: "",
      authToken: null,
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
    },
    actions: {
      updatePlayerInDatabase: (player) => {
        const store = getStore();

        if (!store.authToken) {
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
            Authorization: `Bearer ${store.authToken}`,
          },
        })
          .then((response) => {
            if (response.status !== 200) {
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

        // Reset the application state's authToken
        setStore({ player: defaultPlayer, authToken: null });
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
            setStore({ authToken: data.token, authError: null });

            // Fetch player data
            return fetch(process.env.BACKEND_URL + "/api/player", {
              method: "GET",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
            });
          })
          .then((resp) => {
            if (resp.status !== 200) {
              throw new Error("Failed to fetch player data");
            }
            return resp.json();
          })
          .then((playerData) => {
            setStore({ player: playerData });
            getActions().updatePlayerInDatabase(playerData);
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
          const updatedPlayer = {
            ...store.player,
            level: store.player.level + 1,
            experience: 0,
          };
          setStore({ ...store, player: updatedPlayer });
          updatePlayerInLocalStorage(updatedPlayer);
          getActions().updatePlayerInDatabase(updatedPlayer);
        }
      },
      startEnergyRegen: () => {
        const interval = setInterval(() => {
          const store = getStore();
          const updatedPlayer = {
            ...store.player,
            energy: store.player.energy + 1,
          };
          setStore({
            ...store,
            player: updatedPlayer,
          });
        }, 10 * 1000); // 20 seconds
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
