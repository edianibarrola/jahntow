const missionsData = {
  "Asteroid Mining": {
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 3000,
    Experience: 75,
    Rank: 2,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Heading towards the asteroid belt for mining operations.",
    successMessage:
      "E.c.h.o.: Successfully mined precious resources from the asteroid, gaining 300 credits and 75 experience.",
    failureMessage:
      "E.c.h.o.: Mining operations were not successful. Better luck next time.",
  },
  "Space Salvage": {
    "Required Credits": 1500,
    "Required Energy": 15,
    Reward: 4500,
    Experience: 112,
    Rank: 4,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Scanning space debris for valuable salvage.",
    successMessage:
      "E.c.h.o.: Salvage successful. Recovered items translated to 450 credits and 112 experience.",
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
      "Basic Armor": 1,
    },
    startMessage:
      "E.c.h.o.: Setting coordinates to a rumored alien artifact location.",
    successMessage:
      "E.c.h.o.: Artifact retrieved successfully, granting you 660 credits and 165 experience.",
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
      "Basic Sword": 1,
    },
    startMessage:
      "E.c.h.o.: Initiating trading protocols with neighboring galactic entities.",
    successMessage:
      "E.c.h.o.: Trade successful. The profits earned you 900 credits and 225 experience.",
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
      "Basic Armor": 2,
    },
    startMessage:
      "E.c.h.o.: Preparing for a deep-space exploration mission to uncharted territories.",
    successMessage:
      "E.c.h.o.: Exploration successful. New regions charted and you earned 1200 credits and 300 experience.",
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
      "Basic Tech": 1,
      "Basic Armor": 2,
    },
    startMessage:
      "E.c.h.o.: Enrolling in the intergalactic starship racing event.",
    successMessage:
      "E.c.h.o.: You won the race! Credited 1560 credits and 390 experience for your performance.",
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
      "Basic Sword": 20,
    },
    startMessage:
      "E.c.h.o.: Picking up distress signals. Initiating rescue protocols.",
    successMessage:
      "E.c.h.o.: Rescue successful! You've been credited with 1950 credits and 487 experience.",
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
      "Basic Sword": 24,
      "Basic Armor": 20,
    },
    startMessage:
      "E.c.h.o.: Approaching the event horizon for black hole research.",
    successMessage:
      "E.c.h.o.: Data collected successfully. Your findings yielded 2400 credits and 600 experience.",
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
      "Basic Tech": 40,
      "Basic Armor": 50,
    },
    startMessage:
      "E.c.h.o.: Establishing communication channels for diplomatic discussions with alien civilizations.",
    successMessage:
      "E.c.h.o.: Diplomacy successful. Established friendly relations and earned 3000 credits and 750 experience.",
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
      "Basic Sword": 4,
      "Basic Armor": 2,
    },
    startMessage:
      "E.c.h.o.: Alert! Hostile forces detected. Preparing for defense.",
    successMessage:
      "E.c.h.o.: Galaxy successfully defended. Your bravery has earned you 3600 credits and 900 experience.",
    failureMessage:
      "E.c.h.o.: The galaxy defense was challenging. Some areas suffered damage.",
  },
  "Quantum Mechanics Mastery": {
    "Required Credits": 14500,
    "Required Energy": 130,
    Reward: 43500,
    Experience: 1087,
    Rank: 22,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Initiating deep dive into quantum mechanics.",
    successMessage:
      "E.c.h.o.: Successfully mastered quantum mechanics! Earned 4350 credits and 1087 experience.",
    failureMessage:
      "E.c.h.o.: Quantum Mechanics is perplexing. Couldn't completely grasp the concept.",
  },
  "Interstellar Exploration": {
    "Required Credits": 17500,
    "Required Energy": 150,
    Reward: 52500,
    Experience: 1312,
    Rank: 24,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Setting course for uncharted territories in the interstellar realm.",
    successMessage:
      "E.c.h.o.: Exploration successful! Discovered new systems and earned 5250 credits and 1312 experience.",
    failureMessage:
      "E.c.h.o.: The uncharted territories proved challenging. Exploration was not fully successful.",
  },
  "Temporal Anomaly Research": {
    "Required Credits": 21000,
    "Required Energy": 175,
    Reward: 63000,
    Experience: 1575,
    Rank: 26,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Detected a temporal anomaly. Commencing research.",
    successMessage:
      "E.c.h.o.: Successfully researched the temporal anomaly! Rewarded 6300 credits and 1575 experience.",
    failureMessage:
      "E.c.h.o.: The temporal anomaly was unstable. Research faced setbacks.",
  },
  "Galactic Archaeology": {
    "Required Credits": 25000,
    "Required Energy": 200,
    Reward: 75000,
    Experience: 1875,
    Rank: 28,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Embarking on a quest to uncover the mysteries of ancient galactic civilizations.",
    successMessage:
      "E.c.h.o.: Successful excavation! Unearthed artifacts worth 7500 credits and 1875 experience.",
    failureMessage:
      "E.c.h.o.: The ruins were labyrinthine and perplexing. Some artifacts remain elusive.",
  },

  "Universe Origins Study": {
    "Required Credits": 30000,
    "Required Energy": 230,
    Reward: 90000,
    Experience: 2250,
    Rank: 30,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Launching probe to research the origins of the universe.",
    successMessage:
      "E.c.h.o.: Significant discoveries made! Earned 9000 credits and 2250 experience.",
    failureMessage:
      "E.c.h.o.: The vastness of the universe is overwhelming. Some mysteries remain unsolved.",
  },
  "Exodimensional Expedition": {
    "Required Credits": 35000,
    "Required Energy": 260,
    Reward: 105000,
    Experience: 2625,
    Rank: 32,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Preparing to venture into exodimensions. Unknown challenges await.",
    successMessage:
      "E.c.h.o.: Successfully navigated the exodimensions! Secured 10500 credits and 2625 experience.",
    failureMessage:
      "E.c.h.o.: The exodimensions are unpredictable. Could not complete the mission.",
  },
  "Dark Matter Manipulation": {
    "Required Credits": 41000,
    "Required Energy": 290,
    Reward: 123000,
    Experience: 3075,
    Rank: 34,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Initiating procedures to manipulate dark matter.",
    successMessage:
      "E.c.h.o.: Dark matter manipulation successful! Acquired 12300 credits and 3075 experience.",
    failureMessage:
      "E.c.h.o.: Failed to control the elusive dark matter. Mission aborted.",
  },
  "Galactic Diplomacy": {
    "Required Credits": 48000,
    "Required Energy": 320,
    Reward: 144000,
    Experience: 3600,
    Rank: 36,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Engaging in diplomatic talks with advanced extraterrestrial civilizations.",
    successMessage:
      "E.c.h.o.: Diplomacy successful! Strengthened interstellar ties and earned 14400 credits and 3600 experience.",
    failureMessage:
      "E.c.h.o.: Diplomatic talks were challenging. Not all objectives achieved.",
  },
  "Void Phenomenon Analysis": {
    "Required Credits": 56000,
    "Required Energy": 350,
    Reward: 168000,
    Experience: 4200,
    Rank: 38,
    requiredEquipment: {},
    startMessage: "E.c.h.o.: Commencing analysis of mysterious void phenomena.",
    successMessage:
      "E.c.h.o.: Analysis complete! Deciphered void secrets and obtained 16800 credits and 4200 experience.",
    failureMessage:
      "E.c.h.o.: The void remains enigmatic. Analysis was inconclusive.",
  },

  "Cosmic Nexus Activation": {
    "Required Credits": 65000,
    "Required Energy": 385,
    Reward: 195000,
    Experience: 4875,
    Rank: 40,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Initiating protocols to activate the cosmic nexus.",
    successMessage:
      "E.c.h.o.: Cosmic Nexus activated! Gained 19500 credits and 4875 experience.",
    failureMessage:
      "E.c.h.o.: The cosmic nexus proved too complex. Activation failed.",
  },
  "Temporal Loop Investigation": {
    "Required Credits": 75000,
    "Required Energy": 420,
    Reward: 225000,
    Experience: 5625,
    Rank: 42,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Preparing to investigate disturbances in the temporal loop.",
    successMessage:
      "E.c.h.o.: Temporal loop stabilized! Retrieved 22500 credits and 5625 experience.",
    failureMessage:
      "E.c.h.o.: Time anomalies detected. Investigation proved challenging.",
  },
  "Nebular Storm Navigation": {
    "Required Credits": 86000,
    "Required Energy": 460,
    Reward: 258000,
    Experience: 6450,
    Rank: 44,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Initiating navigation through a tumultuous nebular storm.",
    successMessage:
      "E.c.h.o.: Successfully navigated the storm! Acquired 25800 credits and 6450 experience.",
    failureMessage:
      "E.c.h.o.: Nebular turbulence too intense. Navigation unsuccessful.",
  },
  "Celestial Artifact Retrieval": {
    "Required Credits": 98000,
    "Required Energy": 500,
    Reward: 294000,
    Experience: 7350,
    Rank: 46,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Mission is to retrieve a rare celestial artifact from an ancient site.",
    successMessage:
      "E.c.h.o.: Artifact secured! Obtained 29400 credits and 7350 experience.",
    failureMessage:
      "E.c.h.o.: Artifact retrieval mission faced unforeseen challenges.",
  },
  "Supernova Containment": {
    "Required Credits": 110000,
    "Required Energy": 550,
    Reward: 330000,
    Experience: 8250,
    Rank: 48,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Attempting to contain the imminent supernova and harness its energy.",
    successMessage:
      "E.c.h.o.: Supernova successfully contained! 33000 credits and 8250 experience gained.",
    failureMessage:
      "E.c.h.o.: Supernova containment measures failed. Energy release was catastrophic.",
  },
  "Black Hole Mapping": {
    "Required Credits": 124000,
    "Required Energy": 600,
    Reward: 372000,
    Experience: 9300,
    Rank: 50,
    requiredEquipment: {},
    startMessage:
      "E.c.h.o.: Launching probes to map the event horizon of a black hole.",
    successMessage:
      "E.c.h.o.: Successful mapping! Collected valuable data and 37200 credits along with 9300 experience.",
    failureMessage:
      "E.c.h.o.: Probes lost to the gravitational pull. Black hole mapping unsuccessful.",
  },
};
