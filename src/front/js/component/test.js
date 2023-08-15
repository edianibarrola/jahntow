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
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Cultural Espionage": {
    species: "Aelithians",
    "Required Credits": 800,
    "Required Energy": 8,
    Reward: 1800,
    Experience: 35,
    Rank: 3,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, delve into the shadows of Corporation activities. Infiltrate their base and unveil their plans against Aelithians.",
    successMessage:
      "ECHO: Jahntow, we've successfully gathered intelligence on Corporation activities. Rewarded 1800 credits and 35 experience.",
    failureMessage:
      "ECHO: Our attempt to infiltrate the Corporation base failed. We must refine our approach.",
    currentMissionWins: 0,
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
    currentMissionWins: 0,
    requiredMissionWins: 5,
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
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },

  "Temporal Labyrinth": {
    species: "Cepharians",
    "Required Credits": 700,
    "Required Energy": 7,
    Reward: 1500,
    Experience: 30,
    Rank: 2,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Cepharians face a temporal distortion crisis. Navigate the labyrinth of time to restore their reality's stability.",
    successMessage:
      "ECHO: The temporal distortion crisis has been resolved. You've earned 1500 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to stabilize Cepharian reality's timeline failed. We must safeguard their existence.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Subterranean Reclamation": {
    species: "Cepharians",
    "Required Credits": 900,
    "Required Energy": 9,
    Reward: 2000,
    Experience: 40,
    Rank: 4,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Descend into the Cepharian subterranean depths. Reclaim their ancient technology from Corporation's clutches.",
    successMessage:
      "ECHO: Ancient technology retrieved successfully. You've earned 2000 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to reclaim ancient technology faced obstacles. We must secure Cepharian legacy.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Astral Harmonics": {
    species: "Cepharians",
    "Required Credits": 1200,
    "Required Energy": 12,
    Reward: 2700,
    Experience: 50,
    Rank: 6,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Engage in an astral harmony ceremony with Cepharian leaders. Counter the Corporation's interference in their ethereal connection.",
    successMessage:
      "ECHO: Astral harmony achieved. Cepharian ethereal connection restored, earning you 2700 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore astral harmony faced opposition. We must preserve Cepharian spiritual unity.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Nebula Odyssey": {
    species: "Cepharians",
    "Required Credits": 1600,
    "Required Energy": 16,
    Reward: 3900,
    Experience: 75,
    Rank: 8,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on a cosmic journey through nebulas with the Cepharians. Foil the Corporation's attempt to manipulate celestial energies.",
    successMessage:
      "ECHO: Nebula journey completed successfully. Cepharian celestial energies secured, earning you 3900 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the nebulas faced challenges. We must ensure Cepharian cosmic balance.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },

  "Sonic Resonance": {
    species: "Velorans",
    "Required Credits": 800,
    "Required Energy": 8,
    Reward: 1700,
    Experience: 30,
    Rank: 2,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The harmonious frequencies of Veloran music are disrupted by Corporation interference. Restore their sonic resonance.",
    successMessage:
      "ECHO: Sonic resonance restored successfully. You've earned 1700 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to restore sonic resonance faced obstacles. We must ensure Veloran musical harmony.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Crystal Core": {
    species: "Velorans",
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 2200,
    Experience: 40,
    Rank: 4,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Corporation exploits Veloran crystal core energy sources. Engage in a high-stakes operation to safeguard their essence.",
    successMessage:
      "ECHO: Crystal core safeguarded successfully. You've earned 2200 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to safeguard the crystal core faced opposition. We must protect Veloran energy legacy.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Luminous Unison": {
    species: "Velorans",
    "Required Credits": 1300,
    "Required Energy": 13,
    Reward: 3000,
    Experience: 50,
    Rank: 6,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Join Veloran leaders in a luminous unison ceremony. Counter the Corporation's manipulation of their collective light.",
    successMessage:
      "ECHO: Luminous unison achieved. Veloran collective light restored, earning you 3000 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore luminous unison faced challenges. We must protect Veloran shared radiance.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Celestial Nexus": {
    species: "Velorans",
    "Required Credits": 1800,
    "Required Energy": 18,
    Reward: 4500,
    Experience: 75,
    Rank: 8,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on a celestial pilgrimage with the Velorans. Foil the Corporation's attempt to distort their connection to stars.",
    successMessage:
      "ECHO: Celestial pilgrimage completed successfully. Veloran stellar connection secured, earning you 4500 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the celestial pilgrimage faced challenges. We must ensure Veloran starry bonds.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },

  "Eclipse Ritual": {
    species: "Drakorians",
    "Required Credits": 900,
    "Required Energy": 9,
    Reward: 1900,
    Experience: 30,
    Rank: 2,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Drakorian Eclipse Ritual is threatened by the Corporation's intervention. Assist in ensuring their cosmic balance.",
    successMessage:
      "ECHO: Eclipse Ritual protected successfully. You've earned 1900 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to protect the Eclipse Ritual faced challenges. We must ensure Drakorian cosmic equilibrium.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Flameforged Relics": {
    species: "Drakorians",
    "Required Credits": 1100,
    "Required Energy": 11,
    Reward: 2400,
    Experience: 40,
    Rank: 4,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Retrieve the sacred Flameforged Relics from the Corporation's grasp. Rekindle the spirit of the Drakorian ancestors.",
    successMessage:
      "ECHO: Flameforged Relics reclaimed successfully. You've earned 2400 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to reclaim Flameforged Relics faced opposition. We must honor Drakorian ancestral heritage.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Stellar Aegis": {
    species: "Drakorians",
    "Required Credits": 1400,
    "Required Energy": 14,
    Reward: 3200,
    Experience: 50,
    Rank: 6,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Engage in the creation of the Stellar Aegis, a cosmic shield to ward off the Corporation's astral intrusion.",
    successMessage:
      "ECHO: Stellar Aegis successfully erected. Drakorian astral domain protected, earning you 3200 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to create the Stellar Aegis faced challenges. We must defend Drakorian astral sovereignty.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Celestial Confluence": {
    species: "Drakorians",
    "Required Credits": 1900,
    "Required Energy": 19,
    Reward: 4800,
    Experience: 75,
    Rank: 8,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Navigate the Celestial Confluence with the Drakorians. Counter the Corporation's manipulation of their cosmic connection.",
    successMessage:
      "ECHO: Celestial Confluence completed successfully. Drakorian cosmic connection reinforced, earning you 4800 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the Celestial Confluence faced challenges. We must ensure Drakorian celestial ties.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Luminous Correlation": {
    species: "Thelorians",
    "Required Credits": 1000,
    "Required Energy": 10,
    Reward: 2100,
    Experience: 30,
    Rank: 2,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The harmonic light patterns of the Thelorian realm are being disrupted. Restore their luminous correlation.",
    successMessage:
      "ECHO: Luminous correlation restored successfully. You've earned 2100 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to restore luminous correlation faced obstacles. We must ensure Thelorian radiant unity.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Ethereal Nexus": {
    species: "Thelorians",
    "Required Credits": 1200,
    "Required Energy": 12,
    Reward: 2700,
    Experience: 40,
    Rank: 4,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Corporation seeks to exploit Thelorian ethereal nexus for power. Protect their interdimensional heritage.",
    successMessage:
      "ECHO: Ethereal nexus protected successfully. You've earned 2700 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to protect the ethereal nexus faced opposition. We must secure Thelorian multidimensional legacy.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Harmonic Resonance": {
    species: "Thelorians",
    "Required Credits": 1500,
    "Required Energy": 15,
    Reward: 3500,
    Experience: 50,
    Rank: 6,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Join Thelorian leaders in a harmonic resonance ceremony. Counter the Corporation's disruption of their cosmic connection.",
    successMessage:
      "ECHO: Harmonic resonance achieved. Thelorian cosmic connection restored, earning you 3500 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore harmonic resonance faced challenges. We must protect Thelorian celestial bonds.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Astral Rhapsody": {
    species: "Thelorians",
    "Required Credits": 2000,
    "Required Energy": 20,
    Reward: 5400,
    Experience: 75,
    Rank: 8,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on an astral rhapsody through cosmic harmonies with the Thelorians. Prevent the Corporation's cosmic disharmony.",
    successMessage:
      "ECHO: Astral rhapsody completed successfully. Thelorian cosmic melodies protected, earning you 5400 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the astral rhapsody faced challenges. We must ensure Thelorian cosmic harmony.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },

  "Celestial Echo": {
    species: "Zeraphans",
    "Required Credits": 1100,
    "Required Energy": 11,
    Reward: 2300,
    Experience: 30,
    Rank: 2,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The ethereal echoes of the Zeraphan realm are fading. Revive their celestial harmonies for eternal existence.",
    successMessage:
      "ECHO: Celestial echoes revived successfully. You've earned 2300 credits and 30 experience.",
    failureMessage:
      "ECHO: Our attempt to revive celestial echoes faced obstacles. We must ensure Zeraphan ethereal vitality.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Nebula Synchrony": {
    species: "Zeraphans",
    "Required Credits": 1300,
    "Required Energy": 13,
    Reward: 2900,
    Experience: 40,
    Rank: 4,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The Zeraphan nebulae are being disrupted by the Corporation's intrusion. Achieve nebula synchrony to maintain cosmic order.",
    successMessage:
      "ECHO: Nebula synchrony achieved successfully. You've earned 2900 credits and 40 experience.",
    failureMessage:
      "ECHO: Our attempt to achieve nebula synchrony faced opposition. We must preserve Zeraphan cosmic balance.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Ethereal Convergence": {
    species: "Zeraphans",
    "Required Credits": 1600,
    "Required Energy": 16,
    Reward: 3800,
    Experience: 50,
    Rank: 6,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Join the Zeraphan council in an ethereal convergence ceremony. Counter the Corporation's disruption of their cosmic bond.",
    successMessage:
      "ECHO: Ethereal convergence achieved. Zeraphan cosmic bond restored, earning you 3800 credits and 50 experience.",
    failureMessage:
      "ECHO: Our attempt to restore ethereal convergence faced challenges. We must protect Zeraphan cosmic unity.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },
  "Cosmic Overture": {
    species: "Zeraphans",
    "Required Credits": 2200,
    "Required Energy": 22,
    Reward: 6000,
    Experience: 75,
    Rank: 8,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Embark on a cosmic overture with the Zeraphans. Foil the Corporation's attempt to disrupt their cosmic symphony.",
    successMessage:
      "ECHO: Cosmic overture completed successfully. Zeraphan cosmic symphony safeguarded, earning you 6000 credits and 75 experience.",
    failureMessage:
      "ECHO: Our attempt to navigate the cosmic overture faced challenges. We must ensure Zeraphan cosmic harmony.",
    currentMissionWins: 0,
    requiredMissionWins: 5,
  },

  "Cosmic Confrontation - Part 1": {
    "Required Credits": 3000,
    "Required Energy": 30,
    Reward: 5000,
    Experience: 100,
    Rank: 10,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: The time has come, Jahntow. Begin the united alliance's cosmic confrontation against the Space Corporation. This is the first step towards liberation.",
    successMessage:
      "ECHO: Part 1 of the cosmic confrontation completed successfully. Your alliance advances, earning you 5000 credits and 100 experience. The fight gains momentum.",
    failureMessage:
      "ECHO: Our attempt to begin the cosmic confrontation faced resistance. The fight is not over; we'll keep pushing forward.",
    currentMissionWins: 0,
    requiredMissionWins: 8,
  },

  "Cosmic Confrontation - Part 2": {
    "Required Credits": 4000,
    "Required Energy": 40,
    Reward: 7500,
    Experience: 125,
    Rank: 10,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Continue the cosmic confrontation, Jahntow. This is the second part of the united alliance's struggle. Together, we'll break the Corporation's grasp.",
    successMessage:
      "ECHO: Part 2 of the cosmic confrontation completed successfully. Your alliance grows stronger, earning you 7500 credits and 125 experience. The path to victory is clear.",
    failureMessage:
      "ECHO: Our attempt to advance the cosmic confrontation faced challenges. The united alliance remains resolute; we'll overcome.",
    currentMissionWins: 0,
    requiredMissionWins: 8,
  },

  "Cosmic Confrontation - Part 3": {
    "Required Credits": 5000,
    "Required Energy": 50,
    Reward: 10000,
    Experience: 150,
    Rank: 10,
    requiredEquipment: {},
    "Health Effect": 0,
    startMessage:
      "ECHO: Jahntow, this is the final push. Lead the united alien alliance in the ultimate cosmic confrontation against the Space Corporation. The time for liberation is now.",
    successMessage:
      "ECHO: The cosmic confrontation is victorious. The united alien alliance triumphs, earning you 10000 credits and 150 experience. The cosmos is free once more.",
    failureMessage:
      "ECHO: Our attempt at the final cosmic confrontation faced tremendous adversity. But remember, the spirit of unity endures.",
    currentMissionWins: 0,
    requiredMissionWins: 9,
  },
};
