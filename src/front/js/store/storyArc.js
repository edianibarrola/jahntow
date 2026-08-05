// The story of the war for Zephyr, told one beat per story-mission win.
//
// VOICE (keep this consistent when editing): cinematic third person,
// present tense, concrete detail over summary, short lines of spoken
// dialogue where a character would actually speak. Beat 1 of a chapter
// sets the scene and the stakes; beats 2-4 escalate; beat 5 lands the
// chapter and reaches toward the next. Big chapters (act finales, the
// defection, the betrayal, Xaezor) run longer on purpose - the drama
// carries the extra words. E.C.H.O. speaks in clipped, precise fragments.
//
// CANON: the plot below is the author's - every event, death, defection
// and reveal happens exactly where it always did. This file renders it;
// it does not change it. Beats stay aligned one-per-win with
// STORY_WINS_PER_UNLOCK (see src/api/game_routes.py) - 5 beats per
// chapter, 42 chapters, one coda beat at win 210.

const storyMissionArc = {
  // ======================================================================
  // ACT I - XICTLIA. Desert, drones, and the first shots of the war.
  // ======================================================================
  "Mission 0": {
    Characters: ["echo"],
    Title: "Disable Spy Drones 1",
    Message:
      "The road to the Xictlian city runs straight into the sunset, and Jahntow has walked it a hundred times. Tonight something new hangs in the amber sky: a flock of drones, drifting in slow patient circles, watching. \"Not local,\" E.C.H.O. murmurs at his ear. \"Corporate signature. Bring one down - the Xictlians will want to see what watches them.\"",
    requiredMissionWins: 0,
  },
  "Mission 1": {
    Characters: ["zuark"],
    Title: "Disable Spy Drones 2",
    Message:
      "Zu'ark meets him at the gate the way she always has - arms crossed, grin first, questions after. The grin dies when he opens his hand and shows her the drone's cracked chip, still warm. She turns it over once and looks up at the empty sky as if it has already betrayed her. \"How many more?\" she asks. \"Then we go find out.\"",
    requiredMissionWins: 1,
  },
  "Mission 2": {
    Characters: ["zuark"],
    Title: "Disable Spy Drones 3",
    Message:
      "They clear the skies above the city by dusk - and by midnight the herders from the outer wells are pounding on the gate. A second flock, lower, bolder, following the water lines. Zu'ark strings her bow on the walk out. \"They're not scouting the city anymore,\" she says. \"They're mapping everything we need to live.\"",
    requiredMissionWins: 2,
  },
  "Mission 3": {
    Characters: ["echo", "zuark"],
    Title: "Disable Spy Drones 4",
    Message:
      "E.C.H.O. spreads the salvaged chips across a blanket like a fortune-teller's cards and reads their burned memories aloud: headings, altitudes, a return vector pointing somewhere out in the deep dunes. \"A carrier ship. Close. I need three more intact processors to fix its position.\" Zu'ark is already counting arrows. \"Then stop talking,\" she says, \"and start pointing.\"",
    requiredMissionWins: 3,
  },
  "Mission 4": {
    Characters: ["echo", "zuark"],
    Title: "Disable Spy Drones 5",
    Message:
      "The drop-ship squats in a hollow between dunes, drinking sunlight through black panels, birthing drones in sets of three. Jahntow leads twenty Xictlian warriors down the slip-face in the grey hour before dawn. It is over quickly. Standing in the wreckage, E.C.H.O. reads the hull stencil aloud - VORTEX CORPORATION - and for a long moment nobody in the hollow speaks.",
    requiredMissionWins: 4,
  },
  "Mission 5": {
    Characters: ["veran"],
    Title: "Protect Caravans 1",
    Message:
      "Veran rides in from the salt road at a gallop, and Zu'ark's brother has never galloped for anything. He found a caravan an hour out - twelve wagons burned to their axles, the water casks holed and left to drain into the sand. Not raided. Nothing was taken. \"Somebody wanted it destroyed,\" he says, \"and wanted us to find it.\"",
    requiredMissionWins: 5,
  },
  "Mission 6": {
    Characters: ["veran", "echo"],
    Title: "Protect Caravans 2",
    Message:
      "E.C.H.O. walks the wreck line, cataloguing scorch angles with a surgeon's calm. \"Energy weapons. Military grade. Vortex issue.\" The word lands on the gathered drivers like a stone in still water. Three more caravans are due on the road before nightfall, loaded with grain and children. Jahntow takes the overlook with a borrowed rifle and waits.",
    requiredMissionWins: 6,
  },
  "Mission 7": {
    Characters: ["zuark"],
    Title: "Protect Caravans 3",
    Message:
      "Zu'ark's signal fire rises from the southern path - one plume, then two. Caravan safe, enemy sighted. When Jahntow reaches her she is crouched below the ridgeline, watching a Vortex column crawl between the dunes with their lights doused. \"They think they're the hunters,\" she whispers, passing him the glass. \"Let's disappoint them.\"",
    requiredMissionWins: 7,
  },
  "Mission 8": {
    Characters: ["echo", "zuark"],
    Title: "Protect Caravans 4",
    Message:
      "The ambush breaks the Vortex squad in the narrows before they can form a line. Afterward, E.C.H.O. sits among the sparking wreckage of their comms gear, drinking deep from unencrypted memory. Route tables. Supply schedules. Names. \"They have been watching the trade roads for months,\" it says quietly. \"Take me back to the City. The elders need to hear all of it.\"",
    requiredMissionWins: 8,
  },
  "Mission 9": {
    Characters: ["echo", "veran", "zuark"],
    Title: "Protect Caravans 5",
    Message:
      "In the council hall the recovered data paints its ugly picture: tracker beacons seeded along every trade route, patient as buried seeds, reporting every wagon and water run to an unseen master. The elders look to Jahntow - the outsider the desert raised. He takes forty warriors and rides the whole map, digging Vortex's eyes out of Xictlian sand one beacon at a time.",
    requiredMissionWins: 9,
  },
  "Mission 10": {
    Characters: ["echo"],
    Title: "Free Oases 1",
    Message:
      "Vortex stops hiding on a market morning. Armored crawlers ring the desert oases before midday, and by dusk a corporate voice is selling the Xictlians their own water by the cup. In the City, the wells run shorter every hour. Jahntow and Zu'ark ride out at dawn toward the first occupied spring, and half the warriors of the City ride with them.",
    requiredMissionWins: 10,
  },
  "Mission 11": {
    Characters: ["echo", "zuark"],
    Title: "Free Oases 2",
    Message:
      "The first oasis falls back into Xictlian hands before the sun clears the dunes. Word travels the desert faster than any drone: they can be beaten. By evening, thirsty families line the road with empty skins and full songs, and Vortex pulls its crawlers back to the deeper wells - where the water is sweetest, and the ground easiest to hold.",
    requiredMissionWins: 11,
  },
  "Mission 12": {
    Characters: ["echo", "zuark"],
    Title: "Free Oases 3",
    Message:
      "At the second spring, Vortex chooses spite over surrender: a slick of grey toxin blooms across the water as their crawlers withdraw. Children watch the pool their grandmothers swam in turn the color of a dead sky. E.C.H.O. synthesizes a purifier from salvaged drone cells while Zu'ark's warriors hold the shoreline, and drop by drop, the spring comes back to life.",
    requiredMissionWins: 12,
  },
  "Mission 13": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Free Oases 4",
    Message:
      "Veran arrives with outriders from three far settlements - strangers a month ago, kin now. Above them the sky goes bronze, then brown; a sandstorm rolling in off the deep desert like a closing door. Zu'ark tightens her scarf until only her eyes show. \"Vortex builds walls,\" she shouts over the wind, \"the desert eats walls.\" They storm the third oasis inside the storm itself.",
    requiredMissionWins: 13,
  },
  "Mission 14": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Free Oases 5",
    Message:
      "One great oasis remains: the City's own lifeline, the deep blue eye the whole desert drinks from. Vortex has ringed it in wire and gun towers, betting everything that thirst breaks people faster than courage mends them. They bet wrong. When the wire comes down and the water runs free, Jahntow understands that this is no longer a dispute. It is a war.",
    requiredMissionWins: 14,
  },
  "Mission 15": {
    Characters: ["echo", "zuark"],
    Title: "Repel Invasions 1",
    Message:
      "Vortex answers its humiliation the corporate way: overwhelming force, delivered on schedule. Dropships darken the northern horizon and disgorge armored columns aimed straight at the City's water and grain. Jahntow and Zu'ark anchor the line at the caravan gate. \"They fight for a paycheck,\" she tells the warriors around her. \"You fight for everything. Act like it.\"",
    requiredMissionWins: 15,
  },
  "Mission 16": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Repel Invasions 2",
    Message:
      "The first assault breaks and rolls back like a spent wave, leaving smoking wrecks half-buried in the dunes. Nobody celebrates. Through the glass, Veran watches the survivors regroup around fresh dropships with mechanical patience. \"They're not retreating,\" he says. \"They're reloading.\" The City spends the night deepening trenches by torchlight.",
    requiredMissionWins: 16,
  },
  "Mission 17": {
    Characters: ["echo", "zuark"],
    Title: "Repel Invasions 3",
    Message:
      "The second wave comes at noon, out of the sun, behind a curtain of shrieking shells. E.C.H.O. rides Jahntow's shoulder, calling vectors a half-second before the rounds land - left, DOWN, forward now - and the line bends around its predictions like reeds around a stone. Bends. Holds. When the dust settles, the wall is scorched but standing, and so is everyone on it.",
    requiredMissionWins: 17,
  },
  "Mission 18": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Repel Invasions 4",
    Message:
      "Then come the professionals: Vortex shock troops in matte-black plate that drinks the desert light, moving in silences where the mercenaries had shouted. They take a trench in four minutes. It costs the Xictlians an hour and blood to take it back. That night Zu'ark sits sharpening a blade that is already sharp. \"One more wave,\" she says. \"I can feel it. One more.\"",
    requiredMissionWins: 18,
  },
  "Mission 19": {
    Characters: ["echo", "zuark"],
    Title: "Repel Invasions 5",
    Message:
      "It comes at dawn - everything Vortex has left, thrown at the gate in one furious spend. For an hour the world is noise and sand and the drumbeat of E.C.H.O.'s warnings. Then, all at once, quiet. The columns are wrecked, the dropships fled, and the desert horizon is empty for the first time in weeks. The City roars. Jahntow watches the north, and does not.",
    requiredMissionWins: 19,
  },
  "Mission 20": {
    Characters: ["echo", "zuark"],
    Title: "Fortify Temples 1",
    Message:
      "The elders bring Jahntow to the temples at night, lamps low out of respect: sandstone vaults older than any map, walls layered with ten thousand years of painted memory. This is what Vortex's surveyors have been circling - not water, heritage. Ground that makes a people a people. \"Stone can be defended,\" Zu'ark says, laying her palm flat against the oldest wall. \"So we defend it.\"",
    requiredMissionWins: 20,
  },
  "Mission 21": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Fortify Temples 2",
    Message:
      "The first temple disappears behind earthworks and salvaged Vortex armor plate - corporate steel repurposed to guard the very walls it came to erase, which pleases Zu'ark enormously. Veran drills the young warriors in the courtyard until their spear-work stops being a dance and starts being a promise. One sanctuary secured. Four to go, and the far ones are exposed.",
    requiredMissionWins: 21,
  },
  "Mission 22": {
    Characters: ["echo", "zuark"],
    Title: "Fortify Temples 3",
    Message:
      "E.C.H.O. skims a Vortex transmission out of the night air: a survey team tasked to the shrine at Red Hollow, arrival at dawn, demolition assessment attached. The words demolition assessment sit in Jahntow's chest like a coal. They ride through the dark and are waiting inside the shrine's shadow when the surveyors' lights crest the ridge.",
    requiredMissionWins: 22,
  },
  "Mission 23": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Fortify Temples 4",
    Message:
      "Four temples wear their new armor. The fifth is the problem child - half-swallowed by a dune sea, approachable from every direction and defensible from none. Veran solves it the desert way: he doesn't fortify the temple, he fortifies the sand, sowing the approaches with warning bells and spike pits until the ground itself stands sentry. \"Now everything is ready,\" he says. \"Let them test it.\"",
    requiredMissionWins: 23,
  },
  "Mission 24": {
    Characters: ["echo", "zuark"],
    Title: "Fortify Temples 5",
    Message:
      "Vortex tests it. A night raid on the dune temple meets the bells, the pits, the murder-holes, and forty warriors who were pretending to sleep. It is less a battle than a lesson. In the morning the elders walk the untouched halls in silence, and the oldest of them stops before Jahntow. \"The desert took you in as a boy,\" she says. \"Today it calls you son.\"",
    requiredMissionWins: 24,
  },
  "Mission 25": {
    Characters: ["echo", "zuark"],
    Title: "Lead Sandstorm Offensives 1",
    Message:
      "Defense has held. Now the desert goes on the attack - and it brings its oldest weapon. The great storms that Vortex's manuals call impassable weather, the Xictlians call roads. Jahntow and Zu'ark lead a raiding column into the boiling brown wall, wrapped and goggled, navigating by E.C.H.O.'s pulse and by songs older than compasses. Somewhere ahead, an outpost's lights burn blind.",
    requiredMissionWins: 25,
  },
  "Mission 26": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Lead Sandstorm Offensives 2",
    Message:
      "The first outpost never hears them coming - the storm eats their footsteps, their shadows, the sound of the fence coming down. Vortex sentries firing at ghosts hit only weather. When the wind moves on, the outpost is a stripped shell and the raiders are gone with its generators, its guns, and its garrison flag, which Veran wears as a scarf for the ride home.",
    requiredMissionWins: 26,
  },
  "Mission 27": {
    Characters: ["echo", "zuark"],
    Title: "Lead Sandstorm Offensives 3",
    Message:
      "E.C.H.O. learns to read the sky like the elders do, and starts issuing forecasts that smell faintly of prophecy: \"A storm is forming over the salt flats. Large. Slow. Ours.\" They ride inside its leading edge for a day and a night, and take the second outpost with the sand still singing against its walls. Zu'ark calls it the storm-road. The name sticks.",
    requiredMissionWins: 27,
  },
  "Mission 28": {
    Characters: ["echo", "zuark", "veran"],
    Title: "Lead Sandstorm Offensives 4",
    Message:
      "Vortex adapts - seismic sensors, tethered sentry pods, floodlights on storm-proof masts. The third outpost is expecting weather with warriors inside it, and the fight in the howling dark is close and ugly. They take it anyway. Riding home, Veran shouts across the wind: \"They're learning!\" Zu'ark, unbothered: \"Then we'll teach faster.\"",
    requiredMissionWins: 28,
  },
  "Mission 29": {
    Characters: ["echo", "zuark"],
    Title: "Lead Sandstorm Offensives 5",
    Message:
      "The last outpost is the anchor of Vortex's whole desert operation - fuel, munitions, command. It falls inside the greatest storm of the season, and its burning is visible through the sand as a dull orange heartbeat. On a dune above it, Zu'ark pulls her scarf down and grins at Jahntow. \"The desert is clean,\" she says. \"So why do you look like it isn't over?\" He's watching the sky beyond the storm. \"Because they came from somewhere,\" he says. \"And there are other tribes on Zephyr.\"",
    requiredMissionWins: 29,
  },
  // ======================================================================
  // ACT II - LUXOR. A new land, a new ally, and the war goes covert.
  // ======================================================================
  "Mission 30": {
    Characters: ["echo", "axenthon"],
    Title: "Infiltrate Vortex Camps 1",
    Message:
      "Word of the desert victory crosses the mountains before Jahntow does. In the golden lowlands of Luxor he is met not by elders but by a single lean figure on a ridge: Axenthon, who has been fighting Vortex here alone with patience and a long knife. \"They don't build fences in Luxor,\" he says by way of greeting. \"They build camps. I know where. Come see what your desert war bought us - they moved half their strength here.\"",
    requiredMissionWins: 30,
  },
  "Mission 31": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Infiltrate Vortex Camps 2",
    Message:
      "The first camp swallows them at dusk - two more shadows among the supply crates. Axenthon moves like a man walking through his own house, lifting duty rosters and shipment manifests while E.C.H.O. drinks quietly from an unattended terminal. They are gone before the watch changes. Somewhere behind them, a quartermaster will spend a week wondering where his week went.",
    requiredMissionWins: 31,
  },
  "Mission 32": {
    Characters: ["echo", "axenthon"],
    Title: "Infiltrate Vortex Camps 3",
    Message:
      "The second camp is warier - doubled patrols, rotating door codes, a commander who reads the same reports E.C.H.O. steals. Axenthon takes it as a compliment. He leads Jahntow in through the latrine trench, which he narrates with great dignity, and out through the officers' mess with a case of encrypted drives. \"Fear,\" he observes, \"makes them thorough. It does not make them clever.\"",
    requiredMissionWins: 32,
  },
  "Mission 33": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Infiltrate Vortex Camps 4",
    Message:
      "Camp by camp, the picture assembles on E.C.H.O.'s map like a wound being uncovered: Luxor is not an occupation, it is a staging ground. Depots feeding depots, all of it flowing toward something farther east that the manifests only call THE PROJECT. One camp remains unmapped - the largest, dug into the hills where the sacred river bends.",
    requiredMissionWins: 33,
  },
  "Mission 34": {
    Characters: ["echo", "axenthon"],
    Title: "Infiltrate Vortex Camps 5",
    Message:
      "The river camp is a fortress pretending to be a warehouse. They go in under a moonless sky, and what E.C.H.O. finds in its command vault is worth every held breath: the full Luxor garrison ledger - every camp, every convoy, every payroll. Axenthon studies the stolen map on the ride out, and for the first time since Jahntow met him, he smiles. \"Now,\" he says, \"we stop watching and start breaking.\"",
    requiredMissionWins: 34,
  },
  "Mission 35": {
    Characters: ["echo", "axenthon"],
    Title: "Sabotage Supply Lines 1",
    Message:
      "An army is a stomach with guns attached - Axenthon's words, delivered while wiring a demolition charge under a bridge with a craftsman's tenderness. The first Vortex convoy arrives on schedule, because Vortex is always on schedule, and leaves as a line of burning axles in a river ford. Nothing is looted. Everything is lost. The stomach begins, quietly, to growl.",
    requiredMissionWins: 35,
  },
  "Mission 36": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Sabotage Supply Lines 2",
    Message:
      "The second line dies of a thousand small wounds: rerouted waybills, fuel drums cut with river water, a depot crane that drops every third crate. E.C.H.O. forges Vortex paperwork so flawless that two convoys spend a day delivering ammunition to each other. Veran, watching trucks circle, wipes his eyes. \"In the desert we just burned things. This is art.\"",
    requiredMissionWins: 36,
  },
  "Mission 37": {
    Characters: ["echo", "axenthon"],
    Title: "Sabotage Supply Lines 3",
    Message:
      "Vortex answers with escorts - gun-trucks bracketing every convoy, drones stitched overhead. The free lunch is over; now it is work. Axenthon maps the escort rotations for three days, finds the single hour when the schedules breathe, and they hit the fuel column inside it. The pillar of oily smoke can be seen from the sacred groves, where Luxorians watch, and begin to hope.",
    requiredMissionWins: 37,
  },
  "Mission 38": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Sabotage Supply Lines 4",
    Message:
      "Starving camps make desperate choices. Vortex consolidates everything onto one great artery - the trunk road east, armored end to end, THE PROJECT's umbilical cord. \"One road,\" Axenthon murmurs over the map, tapping the narrow gorge where it crosses the highlands, \"is one throat.\" They spend two nights placing charges. The third night, they wait.",
    requiredMissionWins: 38,
  },
  "Mission 39": {
    Characters: ["echo", "axenthon"],
    Title: "Sabotage Supply Lines 5",
    Message:
      "The gorge comes down on the trunk road with a sound like the planet clearing its throat, and Vortex's eastern supply line ceases to exist as a concept. In the silence after, E.C.H.O. intercepts the garrison's panicked traffic: pay shipments delayed. Rations halved. And threaded through the panic, a word repeated by frightened corporate voices - mercenaries asking each other why they're still here.",
    requiredMissionWins: 39,
  },
  "Mission 40": {
    Characters: ["echo", "axenthon"],
    Title: "Persuade Mercenaries to Defect 1",
    Message:
      "The first parley is Axenthon's idea and nearly his funeral. A mercenary company - unpaid for a month, unfed for a week - agrees to talk in a burned granary with guns on the table. Jahntow walks in without one. \"Vortex pays you to die for a supply line we already cut,\" he says. \"I'm offering the other thing.\" The captain studies him a long time. \"Which is?\" \"A side you can tell your children about.\"",
    requiredMissionWins: 40,
  },
  "Mission 41": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Persuade Mercenaries to Defect 2",
    Message:
      "The granary company walks off the Vortex payroll at dawn - forty veterans with their armor and their spite. Word moves through the mercenary camps in the invisible way soldiers' news always moves. Within days, quiet men find excuses to be near Xictlian patrols, asking careful questions. Veran collects them like a man gathering stray dogs who were never really wild.",
    requiredMissionWins: 41,
  },
  "Mission 42": {
    Characters: ["echo", "axenthon"],
    Title: "Persuade Mercenaries to Defect 3",
    Message:
      "Vortex counterbids - triple pay, signing bonuses, amnesty, all of it printed on crisp corporate letterhead and none of it backed by a supply line. E.C.H.O. makes sure every camp also receives the internal memo it stole the same morning: the one where a Vortex director prices mercenary lives at less than the fuel to retrieve their bodies. The letterhead loses.",
    requiredMissionWins: 42,
  },
  "Mission 43": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Persuade Mercenaries to Defect 4",
    Message:
      "By the new moon, whole companies are crossing over with their kit and their grudges, until only one hold-out remains: the Iron Veil, oldest and proudest of the free companies, whose contract is their religion. Their commander sends back every envoy with the same answer. A deal is a deal. Axenthon turns the problem over for a day, then says: \"Then we make Vortex break the deal.\"",
    requiredMissionWins: 43,
  },
  "Mission 44": {
    Characters: ["echo", "axenthon"],
    Title: "Persuade Mercenaries to Defect 5",
    Message:
      "E.C.H.O. lets the Iron Veil intercept genuine Vortex orders: their company assigned as rearguard - unsupported, unpaid, expendable - for a withdrawal already underway. A deal is a deal, and Vortex broke it first. At sunset the Iron Veil's standard comes down the hill under a white flag, and their commander offers Jahntow the only thing he's ever given anyone: his word. Vortex's hired strength in Luxor is gone.",
    requiredMissionWins: 44,
  },
  "Mission 45": {
    Characters: ["echo", "axenthon"],
    Title: "Hack Vortex Terraforming Tech 1",
    Message:
      "With the soldiers gone, Luxor can finally see what they were guarding. THE PROJECT stands revealed in the eastern valleys: terraforming spires tall as thunderheads, chewing the golden land into grey corporate standard - soil burned sterile, rivers straightened, the air around them tasting of hot metal. \"They're not conquering Zephyr,\" Axenthon says quietly. \"They're replacing it.\"",
    requiredMissionWins: 45,
  },
  "Mission 46": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Hack Vortex Terraforming Tech 2",
    Message:
      "The first spire dies from the inside. E.C.H.O. slips into its control lattice through a maintenance port and quietly teaches the machine to disagree with itself - calibration drifting, feedback loops souring, until the great engines grind to a confused halt. Vortex engineers swarm it for days. There is nothing to find. The sabotage is indistinguishable from despair.",
    requiredMissionWins: 46,
  },
  "Mission 47": {
    Characters: ["echo", "axenthon"],
    Title: "Hack Vortex Terraforming Tech 3",
    Message:
      "Vortex airgaps the second spire - new codes, isolated systems, technicians vetted twice. So Jahntow carries E.C.H.O. in on his shoulder through a storm drain, past four patrols, to press a bare data-spike against the core trunk line. \"Contact,\" E.C.H.O. whispers, and for eleven seconds the most secure system in Luxor holds its breath. Then the spire begins, gently, to die.",
    requiredMissionWins: 47,
  },
  "Mission 48": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Hack Vortex Terraforming Tech 4",
    Message:
      "Spire by spire the grey tide stalls, and in the wounded valleys something extraordinary happens: green. Thin, stubborn, unauthorized green, pushing up through sterilized soil that Vortex certified dead. Luxorians walk out to the ruined land just to touch it. Veran watches an old woman plant a seedling in the shadow of a dead spire and has nothing sarcastic to say at all.",
    requiredMissionWins: 48,
  },
  "Mission 49": {
    Characters: ["echo", "axenthon"],
    Title: "Hack Vortex Terraforming Tech 5",
    Message:
      "The master spire - the PROJECT's brain - resists for a night and a day, its architecture woven from paranoia. E.C.H.O. goes deeper into a hostile system than it has ever gone, goes quiet for three minutes that Jahntow will not forgive it for, and returns with the kill-phrase. The great engines stop. Across Luxor, every surviving spire powers down in a slow wave, like a fever breaking.",
    requiredMissionWins: 49,
  },
  "Mission 50": {
    Characters: ["echo", "axenthon"],
    Title: "Lead Stampede Assaults 1",
    Message:
      "The Titanths come down from the high plains on their own - drawn, the Luxorian herders say, by the smell of green returning. Grey-hided, house-high, gentle until given a reason. Vortex gave them years of reasons. Axenthon walks Jahntow among the herd at dawn, and the oldest bull lowers its head to study him with an eye like a dark well. \"They know who broke the spires,\" Axenthon says. \"They're offering.\"",
    requiredMissionWins: 50,
  },
  "Mission 51": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Lead Stampede Assaults 2",
    Message:
      "The first stampede hits the eastern outpost like weather with intent. Wire, wall, watchtower - the herd goes through all three without changing stride, and the garrison's discipline dissolves into athletics. Behind the thunder come the riders, taking the armory almost politely. Veran, breathless: \"We could have used these in the desert!\" Axenthon: \"They wouldn't have fit in the storm.\"",
    requiredMissionWins: 51,
  },
  "Mission 52": {
    Characters: ["echo", "axenthon"],
    Title: "Lead Stampede Assaults 3",
    Message:
      "Vortex digs in - trench lines, sonic fences, shock pylons tuned to turn the herds. It works once, and the sight of a Titanth in pain does something cold to every Luxorian watching. It does not work twice: E.C.H.O. finds the pylons' frequency and inverts it, and the fence meant to break the stampede instead sings it forward. The trench line does not slow the herd so much as texture it.",
    requiredMissionWins: 52,
  },
  "Mission 53": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Lead Stampede Assaults 4",
    Message:
      "Three outposts down, and the herd has learned the work - flowing around Jahntow's signals like a grey river finding its banks. One garrison remains, and it is the one that matters: the fortified depot on the high road, last knot of Vortex logistics between Luxor and the east. Its commander radios for reinforcement and receives, courtesy of E.C.H.O., a recording of wind.",
    requiredMissionWins: 53,
  },
  "Mission 54": {
    Characters: ["echo", "axenthon"],
    Title: "Lead Stampede Assaults 5",
    Message:
      "The high road depot falls at first light beneath a thousand tons of moving grey, and Vortex's grip on Luxor breaks with it. In the quiet after, the oldest bull walks to where Jahntow stands, breathes once against his chest hard enough to stagger him, and turns back toward the plains. Axenthon watches the herd go. \"Paid in full,\" he translates.",
    requiredMissionWins: 54,
  },
  "Mission 55": {
    Characters: ["echo", "axenthon"],
    Title: "Defend Sacred Groves 1",
    Message:
      "Beaten in the field, Vortex reaches for the thing that cannot be rebuilt. The sacred groves - Luxor's living scripture, every tree a generation's memory - appear on intercepted target lists with a single annotation: MORALE OBJECTIVE. Axenthon reads the phrase twice, and his voice comes out flat and dangerous. \"They mean to burn our reason to fight, then offer peace to the ashes.\"",
    requiredMissionWins: 55,
  },
  "Mission 56": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Defend Sacred Groves 2",
    Message:
      "The first grove holds - Xictlian outriders, defected mercenaries and Luxorian wardens fighting shoulder to shoulder under branches older than any of their nations. It is the first time the whole patchwork alliance bleeds together, and it changes them. Around the night fires afterward, nobody sits with their own kind. There are no own kinds anymore.",
    requiredMissionWins: 56,
  },
  "Mission 57": {
    Characters: ["echo", "axenthon"],
    Title: "Defend Sacred Groves 3",
    Message:
      "Vortex commits its shock troops - the black-armored professionals from the desert campaign, marching this time with incendiary kit. They reach the second grove's edge, close enough for the wardens on the wall to smell the accelerant. No closer. The Iron Veil holds the breach for an hour that becomes a company legend, and the captain who once demanded contract terms asks only, afterward, whether the trees are safe.",
    requiredMissionWins: 57,
  },
  "Mission 58": {
    Characters: ["echo", "axenthon", "veran"],
    Title: "Defend Sacred Groves 4",
    Message:
      "One by one the groves are ringed in allied steel until a single sanctuary remains exposed: the First Grove, root of all the others, where Luxor buries its dead in the roots and reads its future in the canopy. Vortex masses everything it has left in the lowlands - and makes no secret of it. \"They want us to watch it coming,\" Veran says. Axenthon nods slowly. \"Then let's be worth watching.\"",
    requiredMissionWins: 58,
  },
  "Mission 59": {
    Characters: ["echo", "axenthon"],
    Title: "Defend Sacred Groves 5",
    Message:
      "The battle for the First Grove lasts from dark to dark, and when it ends, the canopy still stands - scorched at the edges, alive at the heart, sheltering the exhausted army sleeping beneath it. Axenthon finds Jahntow at the tree line, watching the eastern stars. \"Luxor is free. You could rest.\" Jahntow shakes his head; E.C.H.O. has been translating intercepts all night. \"The lumber convoys run east,\" he says. \"Toward Xiaojia. It's already happening there.\"",
    requiredMissionWins: 59,
  },
  // ======================================================================
  // ACT III - XIAOJIA. Forests, rebels, and the woman with a Vortex past.
  // ======================================================================
  "Mission 60": {
    Characters: ["jahntow", "elderBinru"],
    Title: "Infiltrate Lumber Facility 1",
    Message:
      "Xiaojia announces itself by smell: cut sap and machine smoke where there should be rain and green. Elder Binru receives Jahntow beneath a tree wider than a house, and speaks so softly the leaves lean in. \"They take a thousand years of forest a day. Words have not stopped them. Perhaps proof will shame the sky into it.\" He wants the lumber ledgers - and he knows a quiet way in.",
    requiredMissionWins: 60,
  },
  "Mission 61": {
    Characters: ["jahntow", "elderBinru"],
    Title: "Infiltrate Lumber Facility 2",
    Message:
      "The old man moves through the facility like smoke through lattice - every camera's blind arc, every guard's bad habit, learned from a season of patient watching. In the records office, Jahntow copies manifests while Binru reads the shipping labels and goes very still. \"These trunks are not lumber to them,\" he whispers. \"Look. Heartwood, thousand-year grade. They are harvesting our elders.\"",
    requiredMissionWins: 61,
  },
  "Mission 62": {
    Characters: ["jahntow", "elderBinru"],
    Title: "Infiltrate Lumber Facility 3",
    Message:
      "The second site has learned from Luxor's ghosts: rotating patrols, sensor trees, dogs that hunt by heat. Binru studies the new defenses without alarm, the way a man studies weather. \"They armor themselves against armies,\" he says, leading Jahntow in through the log flume with the evening's timber. \"We are not an army. We are two wet men in a river of trees.\"",
    requiredMissionWins: 62,
  },
  "Mission 63": {
    Characters: ["jahntow", "elderBinru"],
    Title: "Infiltrate Lumber Facility 4",
    Message:
      "Site by site the evidence stacks: quotas signed by Vortex directors, survey maps with the sacred groves circled in red, a projection titled XIAOJIA - FULL EXTRACTION with a completion date two seasons out. One facility remains - the central mill, where the ledgers meet the money. Binru looks at the red circles for a long time. \"Shame the sky,\" he repeats softly. \"Or burn it clean.\"",
    requiredMissionWins: 63,
  },
  "Mission 64": {
    Characters: ["jahntow", "elderBinru"],
    Title: "Infiltrate Lumber Facility 5",
    Message:
      "The central mill gives up everything - contracts, payoffs, the whole machinery of the forest's death in triplicate. On the walk out, alarms finally find them, and their escape is covered by strangers: masked figures dropping from the canopy, moving with trained precision, gone as fast as they came. Binru smiles at Jahntow's expression. \"The forest has other children,\" he says. \"Rebels. I think it is time you met their leader.\"",
    requiredMissionWins: 64,
  },
  "Mission 65": {
    Characters: ["jahntow", "ava"],
    Title: "Join Xiaojian Rebels 1",
    Message:
      "The rebel camp hangs in the canopy like a secret, and its leader meets Jahntow on a rope bridge with a knife she doesn't bother hiding. Ava. Sharp-eyed, unsmiling, younger than her reputation. She has heard of the desert war; he has heard of hers. What nobody mentions is the way she wears her Vortex-pattern armor with the insignia burned off, or how precisely she knows tonight's patrol routes. \"The lumber equipment,\" she says. \"We break it. Coming?\"",
    requiredMissionWins: 65,
  },
  "Mission 66": {
    Characters: ["jahntow", "ava"],
    Title: "Join Xiaojian Rebels 2",
    Message:
      "The first harvester dies at midnight, its cutting arrays fused into sculpture. Ava works Vortex machinery like she assembled it - straight to the maintenance panel, straight to the one coupling that cannot be replaced locally. Jahntow watches her hands and says nothing. On the climb out she catches him watching. \"Ask,\" she says. He doesn't. Something in her shoulders eases a fraction.",
    requiredMissionWins: 66,
  },
  "Mission 67": {
    Characters: ["jahntow", "ava"],
    Title: "Join Xiaojian Rebels 3",
    Message:
      "Vortex floods the sector with security, and the sabotage runs turn from craft into gauntlet. Pinned under a logging platform while search lights sweep, Ava finally answers the unasked question, flat and quick: \"I was one of them. Junior officer. I filed a report about what the extraction quota would do to this forest, and my commanding officer corrected the math until it stopped being true. So I left.\" The lights pass. \"My father is still inside.\"",
    requiredMissionWins: 67,
  },
  "Mission 68": {
    Characters: ["jahntow", "ava"],
    Title: "Join Xiaojian Rebels 4",
    Message:
      "They work through the equipment yards in silence and rhythm, two people who have stopped needing to speak to coordinate. Between charges, in the dark, the rest of it comes out: her mother dead in a corporate relocation nobody recorded; her father, Director Zerrok, feeding the rebels intelligence from inside at a risk she cannot think about. \"Everyone in this forest trusts me except me,\" she says. Jahntow sets the last charge. \"Then borrow mine.\"",
    requiredMissionWins: 68,
  },
  "Mission 69": {
    Characters: ["jahntow", "ava"],
    Title: "Join Xiaojian Rebels 5",
    Message:
      "The final equipment cache burns on a ridgeline for the whole valley to see - every harvester, every hauler, a season of Vortex logistics gone to light and ash. Below, the extraction zones stand silent for the first time in years. Ava watches the fire with an expression Jahntow hasn't seen on her before. It takes him a moment to name it: hope, worn carefully, like something that might still be taken back.",
    requiredMissionWins: 69,
  },
  "Mission 70": {
    Characters: ["jahntow", "ava"],
    Title: "Rescue Caged Pandalings 1",
    Message:
      "The intelligence comes from her father, coded into a lumber invoice: Vortex has been trapping Pandalings - the forest's small black-and-white keepers, sacred to every Xiaojian hearth - and caging them for offworld collectors. The camp receives the news in a silence worse than shouting. Ava reads the manifest twice, jaw tight. \"There are forty-one of them,\" she says. \"We are getting forty-one back.\"",
    requiredMissionWins: 70,
  },
  "Mission 71": {
    Characters: ["jahntow", "ava"],
    Title: "Rescue Caged Pandalings 2",
    Message:
      "The first encampment yields nine cages, and Jahntow learns two things by torchlight. That a Pandaling, freed, will press its forehead to its rescuer's before vanishing upward into the dark - and that Ava, who has not softened for anything in the months he's known her, kneels to receive each small blessing with her eyes closed. Nine home. Thirty-two to go.",
    requiredMissionWins: 71,
  },
  "Mission 72": {
    Characters: ["jahntow", "ava"],
    Title: "Rescue Caged Pandalings 3",
    Message:
      "Vortex learns what the raids are after and turns the remaining cages into bait - doubled guards, tripwires, kill-zones sighted on the cage doors. It becomes the most dangerous work either of them has done, and neither suggests stopping. Working a lock under fire, shoulder to shoulder, Ava laughs once - startled out of her by something Jahntow mutters - and the sound is so unguarded that they both pretend it didn't happen.",
    requiredMissionWins: 72,
  },
  "Mission 73": {
    Characters: ["jahntow", "ava"],
    Title: "Rescue Caged Pandalings 4",
    Message:
      "Thirty-eight home. The last three are held at a fortified depot as bait too obvious to be anything else, and they go in anyway, on a night with no moon at all. It goes wrong at the fence, then right at the last moment, the way their luck has learned to run. Climbing out with a Pandaling asleep inside his jacket, Jahntow realizes he trusts the woman on the rope beside him with his life. Realizes he has for a while.",
    requiredMissionWins: 73,
  },
  "Mission 74": {
    Characters: ["jahntow", "ava"],
    Title: "Rescue Caged Pandalings 5",
    Message:
      "The forty-first Pandaling goes up into the canopy at dawn, and the whole camp watches it climb. Elder Binru arrives with the sunrise and names Ava forest-daughter before the assembled rebels - the first ex-Vortex anything the Xiaojians have ever honored. She receives it steadily until the old man adds, softly, \"Whatever roots you came from, you have grown true.\" Then she looks at the ground for a long time. Jahntow pretends not to see.",
    requiredMissionWins: 74,
  },
  "Mission 75": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Dragonbone Bombing Run 1",
    Message:
      "Master Zhenwu descends from the high monastery with a weapon out of legend: gliders framed in dragonbone, silent as owl wings, older than Vortex's whole civilization. Above the forest, corporate airships have begun seeding defoliant with bureaucratic thoroughness. \"They believe the sky is theirs because they are in it,\" Zhenwu says, running a hand along a bone spar. \"The sky has older tenants.\"",
    requiredMissionWins: 75,
  },
  "Mission 76": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Dragonbone Bombing Run 2",
    Message:
      "The first run teaches Jahntow what silence means as a weapon. The gliders slip out of the clouds onto the airship's spine before a single alarm wakes, and the charges do the rest. Watching the wreck settle into the canopy's arms, Zhenwu is already reading the wind for the return leg. \"Breathe,\" he advises. \"You held that entire attack in your chest.\"",
    requiredMissionWins: 76,
  },
  "Mission 77": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Dragonbone Bombing Run 3",
    Message:
      "Vortex strings the sky with teeth - flak pods, sensor balloons, interceptor drones patrolling in grids. The second airship has to be taken through all of it, in a storm, at night. Zhenwu flies the gauntlet like water finding a path downhill and Jahntow follows his wing-lights on faith. Afterward, hands finally shaking, he asks how long Zhenwu trained for flying like that. \"Tonight?\" the old master says. \"Sixty years.\"",
    requiredMissionWins: 77,
  },
  "Mission 78": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Dragonbone Bombing Run 4",
    Message:
      "Three airships down, and the defoliant runs stop - the remaining fleet huddles over the central extraction zone under every gun Vortex owns. The rebels celebrate. Zhenwu does not. He stands at the monastery's edge, watching the last great airship, the carrier Meridian's Wake, turn slow circles above the wounded forest. \"One more flight,\" he says quietly. \"The hardest one. Rest tonight.\"",
    requiredMissionWins: 78,
  },
  "Mission 79": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Dragonbone Bombing Run 5",
    Message:
      "They take the carrier at dawn, out of the sun, the whole dragonbone wing flying as one creature. It is the longest four minutes of the war so far, and it ends with the pride of Vortex's air fleet folding into the valley like a felled tree, and silence - true silence, birdsong silence - over Xiaojia for the first time in a year. On the flight home, for one deliberate moment, Zhenwu flies upside down.",
    requiredMissionWins: 79,
  },
  "Mission 80": {
    Characters: ["jahntow", "ava"],
    Title: "Defection and Tragedy 1",
    Message:
      "The message from inside is three words in her father's private cipher: IT IS TIME. Vortex has ordered loyalty screenings; every wavering mercenary in the Xiaojian camps will be found and made an example of within the week. Ava lays the decoded strip on the table before Jahntow and the plan beneath it - one last walk into the camps wearing her old rank, to bring out everyone worth saving. \"I swore I'd never wear their colors again,\" she says. \"Once more. For this.\"",
    requiredMissionWins: 80,
  },
  "Mission 81": {
    Characters: ["jahntow", "ava", "zerrok"],
    Title: "Defection and Tragedy 2",
    Message:
      "She walks the wire at dusk in a dead woman's uniform, and the gate opens to her father's forged orders. Director Zerrok meets Jahntow's eyes across the compound for only a moment - a silver-haired man carrying twenty years of quiet treason with a bureaucrat's stoop - then turns back to stalling Vortex command with paperwork and poise. The first squad follows Ava out through the storm drains before the moon is up. It is working. It is actually working.",
    requiredMissionWins: 81,
  },
  "Mission 82": {
    Characters: ["jahntow", "ava", "zerrok"],
    Title: "Defection and Tragedy 3",
    Message:
      "It stops working at midnight. A commissar re-runs the morning's orders against central records and finds forgeries with Zerrok's authorization strings on every one. Alarms turn the camp to daylight. The price on father and daughter goes out on every channel at once, and the quiet extraction becomes a running firefight through tent lines and floodlit mud - Ava herding the last defectors toward the wire while Jahntow burns cover charges behind them.",
    requiredMissionWins: 82,
  },
  "Mission 83": {
    Characters: ["jahntow", "ava", "zerrok"],
    Title: "Defection and Tragedy 4",
    Message:
      "They are cornered at the fence line, gun-trucks converging, when Jahntow brings the skiff down through the floodlights with the throttle wired open. Zerrok is the last aboard, hauled over the rail by his daughter as the fence erupts behind them - and from the climbing skiff they watch the safehouse that sheltered a hundred defectors take a missile meant for the runway. Everything Zerrok built inside Vortex, every year of cover: burning below. Ava grips the rail and does not look away. Neither does he.",
    requiredMissionWins: 83,
  },
  "Mission 84": {
    Characters: ["jahntow", "ava", "zerrok"],
    Title: "Defection and Tragedy 5",
    Message:
      "By morning the camp is ash and the ledger is stark: the mercenaries are free, the network is blown, and the two people who spent it all sit apart from the celebrating rebels, having lost every life they'd built except each other. Jahntow brings them tea because he cannot think what else to bring. Zerrok studies him with tired, careful eyes. \"She trusts you,\" he says at last, as if concluding a long report. \"That is not a thing she does.\" Behind them the forest sings. Ahead, somewhere east, Vortex is regrouping.",
    requiredMissionWins: 84,
  },
  "Mission 85": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Final Stand in Ancient Tree City 1",
    Message:
      "Vortex's answer to losing its camps, its fleet and its officers is the oldest answer: annihilation. Everything the corporation still commands in Xiaojia converges on the ancient tree city - the living capital, ten thousand homes grown into a single vast crown. Master Zhenwu stands on the highest branch-road, watching the columns assemble below, and sounds the horn that has not been sounded in three generations. From every direction, the forest answers.",
    requiredMissionWins: 85,
  },
  "Mission 86": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Final Stand in Ancient Tree City 2",
    Message:
      "The first assault comes up the root-gates and dies there, against rebels and monks and desert outriders and defected mercenaries fighting from ramparts of living wood. The city itself fights back - bridges withdrawing, thorn walls closing - guided by Zhenwu's whispered requests, as if he were asking favors of an old friend. \"She has stood eight hundred years,\" he says of the city. \"She does not intend to stop this week.\"",
    requiredMissionWins: 86,
  },
  "Mission 87": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Final Stand in Ancient Tree City 3",
    Message:
      "The elites come at dusk - black-armored veterans with tree-cutter charges, aiming not at the defenders but at the trunk itself. For an hour it is close-quarters madness in the branch-roads, the worst fighting of the campaign, and it turns on a hundred small braveries: Binru's scouts springing traps, Ava's mercenaries holding a bridge that should have fallen, Zhenwu moving through the fight like weather. The charges never reach the heartwood.",
    requiredMissionWins: 87,
  },
  "Mission 88": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Final Stand in Ancient Tree City 4",
    Message:
      "Wave after wave breaks against the tree city until the columns below stop looking like an army and start looking like a mistake. In a lull, Zhenwu finds Jahntow binding a shoulder wound and sits beside him companionably, as if they were watching a festival. \"One more push in them,\" he judges. \"Their commander will spend everything - his masters are watching, and Vortex forgives losses but never failure.\" He offers Jahntow a dried plum. \"Eat. Endings need strength.\"",
    requiredMissionWins: 88,
  },
  "Mission 89": {
    Characters: ["jahntow", "masterZhenwu"],
    Title: "Final Stand in Ancient Tree City 5",
    Message:
      "The last assault throws everything at the root-gates in the grey before dawn, and the united defenders of three nations meet it as one people. When the sun clears the canopy, the columns are broken, the survivors are streaming east, and the ancient tree city stands - scarred, singing, unconquered. In the celebration, Zhenwu presses something into Jahntow's hand: a seed, warm as a coal. \"From her crown,\" he says. \"For whatever you must grow next. The east, I think, will be stone and snow.\"",
    requiredMissionWins: 89,
  },
  // ======================================================================
  // ACT IV - THE TITAN RANGES. Stone, snow, mechs, and stubborn clans.
  // ======================================================================
  "Mission 90": {
    Characters: ["jahntow", "kazon"],
    Title: "Scout Vortex Mines 1",
    Message:
      "The Titan ranges rise out of Xiaojia's eastern mists like the planet baring its teeth, and the mountains are bleeding: ore-scars gouged down whole faces, glacier melt running grey with tailings. Kazon finds Jahntow on the high trail - a Titan warrior built like the country he defends, wearing a Vortex sensor mast as a walking staff. \"You're the one who burns their maps,\" he rumbles. \"Good. Come draw some new ones.\"",
    requiredMissionWins: 90,
  },
  "Mission 91": {
    Characters: ["jahntow", "kazon"],
    Title: "Scout Vortex Mines 2",
    Message:
      "The first mine is bigger than any Vortex site Jahntow has scouted - haul roads wide as rivers, machines that eat cliff faces whole. They map it from a wind-scoured ledge through a long freezing day, and the manifest E.C.H.O. assembles reads strangely: not ore for sale. Refined exotics, crated for transport east, tagged with the same word from the Luxor ledgers. PROJECT. Kazon spits downwind. \"Whatever they're building,\" he says, \"my mountains are the quarry.\"",
    requiredMissionWins: 91,
  },
  "Mission 92": {
    Characters: ["jahntow", "kazon"],
    Title: "Scout Vortex Mines 3",
    Message:
      "Vortex has learned to fear quiet observers, and the upper sites bristle with counter-recon - seismic tripwires, thermal sweeps, patrols with mountain-trained dogs. Kazon reads the defenses with professional appreciation, then leads Jahntow over a knife ridge in a whiteout, navigating by the taste of the wind. \"They watch the paths,\" he explains, breath frosting. \"Titans do not need paths.\"",
    requiredMissionWins: 92,
  },
  "Mission 93": {
    Characters: ["jahntow", "kazon"],
    Title: "Scout Vortex Mines 4",
    Message:
      "Site by site the survey fills in, and with it a grimmer map: the mines are linked underground, a lattice of haul tunnels threading the whole range like woodworm. Collapse the right junctions and the network dies; miss, and Vortex re-routes in a day. The last unmapped site guards the master junction. It is also, Kazon notes with something like pride, the most defended hole on the planet.",
    requiredMissionWins: 93,
  },
  "Mission 94": {
    Characters: ["jahntow", "kazon"],
    Title: "Scout Vortex Mines 5",
    Message:
      "They map the master junction from inside a Vortex ore hauler, buried in crushed rock with a survey rig, riding the whole lattice end to end through a day of dust and thunder. When they climb out, filthy and half-deaf, E.C.H.O. holds a complete schematic of Vortex's underground empire. Kazon studies it by firelight, then lays one huge finger on seven junctions in turn. \"Here,\" he says. \"The mountain has been patient long enough.\"",
    requiredMissionWins: 94,
  },
  "Mission 95": {
    Characters: ["jahntow", "kazon"],
    Title: "Collapse Mining Tunnels 1",
    Message:
      "The first junction goes down at shift change, when the tunnels stand empty - Kazon is exact about this, and will not be argued with. \"The miners are conscripts and debtors,\" he says, setting charges against the rock with surprising gentleness. \"The mountain wants its shape back, not their bones.\" The collapse rolls through the deep like distant drums, and a third of the lattice goes dark.",
    requiredMissionWins: 95,
  },
  "Mission 96": {
    Characters: ["jahntow", "kazon"],
    Title: "Collapse Mining Tunnels 2",
    Message:
      "The second junction is trickier - live rock, bad air, a Vortex engineering crew racing to shore what the first collapse loosened. They work in the dark between patrol sweeps, Jahntow placing charges to E.C.H.O.'s millimeter guidance while Kazon holds the gallery mouth. The mountain takes the junction back with a roar, and somewhere far above, haul machinery grinds to a stop and stays stopped.",
    requiredMissionWins: 96,
  },
  "Mission 97": {
    Characters: ["jahntow", "kazon"],
    Title: "Collapse Mining Tunnels 3",
    Message:
      "Vortex pours steel into the surviving tunnels - blast doors, pressure braces, garrisons underground. The third junction has to be taken before it can be dropped, fought for in corridors where every shot is thunder. When the charges finally sing and the dust washes over them in the refuge bay, Kazon laughs for the first time since Jahntow met him - a sound like rockfall, entirely without malice. \"Stubborn!\" he roars at the sealed tunnel. \"I respect it! Still my mountain!\"",
    requiredMissionWins: 97,
  },
  "Mission 98": {
    Characters: ["jahntow", "kazon"],
    Title: "Collapse Mining Tunnels 4",
    Message:
      "Six junctions down. The lattice is a ruin of dead ends, the eastbound ore trains have stopped, and Vortex knows exactly where the seventh charge must fall - the master junction, which they have turned into an underground fortress. Kazon studies the approach for a night and a day. \"Through the front door, then,\" he concludes. Jahntow waits for the rest of the plan. There is no rest of the plan.",
    requiredMissionWins: 98,
  },
  "Mission 99": {
    Characters: ["jahntow", "kazon"],
    Title: "Collapse Mining Tunnels 5",
    Message:
      "The battle for the master junction is fought a kilometer under the range, and won by twenty warriors and one perfectly placed silence - E.C.H.O. killing the fortress lights at the moment Kazon's charge reached the gate. The final collapse is felt in villages three valleys away, a long shudder and then stillness. Above ground, for the first time in a decade, the glacier rivers run clear. The extraction heart of Vortex's PROJECT has stopped beating.",
    requiredMissionWins: 99,
  },
  "Mission 100": {
    Characters: ["jahntow", "kazon"],
    Title: "Use Yeti Allies for Spying 1",
    Message:
      "The Yetis come down to the fires on the third night after the mines fall - vast, white-pelted, silent as snowfall, older neighbors to the Titans than any treaty remembers. The eldest studies Jahntow for a long unblinking minute, then sets before him a Vortex helmet, crushed like an eggshell. Kazon translates the gesture with satisfaction: \"They've been watching the watchers all along. They're offering to share.\"",
    requiredMissionWins: 100,
  },
  "Mission 101": {
    Characters: ["jahntow", "kazon"],
    Title: "Use Yeti Allies for Spying 2",
    Message:
      "The Yetis turn out to be the finest intelligence service on Zephyr: invisible in the snowfields, patient as geology, able to sit an arm's length from a sentry post for a day without being seen. The first haul of intel arrives as a Yeti simply walking into camp with a Vortex courier case and the faintly embarrassed air of someone returning a borrowed tool. Inside: garrison rosters for the entire eastern range.",
    requiredMissionWins: 101,
  },
  "Mission 102": {
    Characters: ["jahntow", "kazon"],
    Title: "Use Yeti Allies for Spying 3",
    Message:
      "Vortex grows suspicious - too many convoys re-routed a day before ambushes, too many codes dead on arrival. Patrols start shooting at snowdrifts, seeding the passes with motion mines, offering bounties on \"anomalous fauna.\" The Yetis' response is to relocate an entire minefield, overnight, onto Vortex's own supply road. Kazon has to sit down when he hears. \"I have loved them my whole life,\" he wheezes, \"and I did not know they were funny.\"",
    requiredMissionWins: 102,
  },
  "Mission 103": {
    Characters: ["jahntow", "kazon"],
    Title: "Use Yeti Allies for Spying 4",
    Message:
      "The intelligence picture sharpens toward a single prize: Vortex's eastern command uplink, the antenna farm that carries every order between the mountain garrisons and whatever sits at the top of the corporation. Its access codes travel with one courier, on one schedule, over one high pass. The Yetis know the pass. The eldest draws the route in the snow with one claw, and adds - deliberately, with a glance at Kazon - a small circle around the best spot for an ambush.",
    requiredMissionWins: 103,
  },
  "Mission 104": {
    Characters: ["jahntow", "kazon"],
    Title: "Use Yeti Allies for Spying 5",
    Message:
      "The courier ambush takes nine seconds and harms no one but a satchel lock. By nightfall E.C.H.O. is inside the eastern uplink, reading Vortex's command traffic as it flows - and there, addressed from the corporate summit itself, it finds a name at last. XAEZOR, EXECUTIVE DIRECTOR, THE PROJECT. Attached: orders to accelerate. Jahntow reads the name twice. Something about it hums, like a wire in wind.",
    requiredMissionWins: 104,
  },
  "Mission 105": {
    Characters: ["jahntow", "kazon"],
    Title: "Lead Mech Assaults 1",
    Message:
      "In a mothballed Vortex depot the Titans find their answer to corporate armor: mining mechs, huge as siege towers, built to move mountains and perfectly willing to move fortifications instead. Kazon claims the largest, patting its scarred hull like a warhorse. \"They dug our range hollow with these,\" he says, hauling himself into the cockpit. \"Seems fair the range digs back.\"",
    requiredMissionWins: 105,
  },
  "Mission 106": {
    Characters: ["jahntow", "kazon"],
    Title: "Lead Mech Assaults 2",
    Message:
      "The first fortified position - a cliff bastion that shrugged off two Titan assaults - comes apart under the mech charge like a sandcastle under a wave. Drill arms open the walls; warriors do the rest. Watching the survivors flee down the switchbacks, Kazon works the controls with two fingers, delicately, and lays the bastion's gun tower across their retreat as a bridge. \"Go home,\" his loudhailer suggests. Mostly, they do.",
    requiredMissionWins: 106,
  },
  "Mission 107": {
    Characters: ["jahntow", "kazon"],
    Title: "Lead Mech Assaults 3",
    Message:
      "Vortex answers armor with armor: anti-mech teams, magnetic mines, and their own war machines - faster, newer, bristling. The battle in the Broken Col is the first fair fight of the mountain war, metal titans stalking each other through freezing fog while infantry swarms below. It is won not by tonnage but by ground: Kazon lures the corporate mechs onto a frozen tarn the Titans have known since childhood, and the ice votes for the home team.",
    requiredMissionWins: 107,
  },
  "Mission 108": {
    Characters: ["jahntow", "kazon"],
    Title: "Lead Mech Assaults 4",
    Message:
      "Position by position the eastern range comes free, until only the Gate remains - the fortress complex sealing the high pass, anchor of Vortex's whole mountain line. Its guns have stopped every approach for a generation of this war. Kazon walks the ridgeline opposite for an evening, silent, then points one huge hand at the glacier hanging above the fortress like a held breath. Jahntow follows the gesture. \"You cannot be serious.\" \"The mountain,\" Kazon says, \"is always serious.\"",
    requiredMissionWins: 108,
  },
  "Mission 109": {
    Characters: ["jahntow", "kazon"],
    Title: "Lead Mech Assaults 5",
    Message:
      "The mechs do not attack the Gate. They climb above it, drills singing into the glacier's anchor wall, and give the mountain permission. The avalanche takes the fortress's outer works, its gun line and its appetite for war in one white roar, and the garrison surrenders to the first Titans through the snow-smoke. Standing in the wreckage of Vortex's last stronghold in the range, Kazon breathes the cold like wine. \"Now,\" he says, \"comes the hard part. Now I must talk to my relatives.\"",
    requiredMissionWins: 109,
  },
  "Mission 110": {
    Characters: ["jahntow", "kazon"],
    Title: "Persuade Titan Clans to Unite 1",
    Message:
      "The Titan clans have feuded since before Vortex's founders were born - over passes, over pastures, over insults with their own genealogies. Now their war-leaders gather in the Circle of Cairns, eyeing each other like weather fronts, and Kazon puts the case plainly: unite, or be eaten valley by valley. The silence afterward has centuries in it. Then the eldest of the Stonebrow clan looks at Jahntow. \"The outsider fights for mountains not his own,\" she says. \"Why?\" And the talking, at last, begins.",
    requiredMissionWins: 110,
  },
  "Mission 111": {
    Characters: ["jahntow", "kazon"],
    Title: "Persuade Titan Clans to Unite 2",
    Message:
      "The Stonebrow come first - won not by speeches but by a debt repaid: Jahntow leads the recovery of their ancestral cairns from a Vortex survey zone, stone by stone, in weather that kills the unserious. When the last cairn stands re-stacked on its ridge, the Stonebrow matriarch clasps his forearm to the elbow, Titan-fashion. One clan in. Four to go, and each with a grudge of its own.",
    requiredMissionWins: 111,
  },
  "Mission 112": {
    Characters: ["jahntow", "kazon"],
    Title: "Persuade Titan Clans to Unite 3",
    Message:
      "Vortex, bleeding in the field, spends coin instead: envoys slipping into clan halls with chests of refined exotics and treaties promising each clan lordship over its neighbors. Two clans waver. E.C.H.O. answers with the corporation's own paper - extraction maps showing the wavering clans' valleys scheduled for FULL RECOVERY the season after the treaties would be signed. The chests are returned. One is returned through a wall.",
    requiredMissionWins: 112,
  },
  "Mission 113": {
    Characters: ["jahntow", "kazon"],
    Title: "Persuade Titan Clans to Unite 4",
    Message:
      "Four banners stand together in the Circle - all but the Farpeak, oldest clan and coldest grudge, whose price is one Kazon cannot pay: an apology for a wrong his grandfather did theirs, in words no living Titan has ever spoken aloud. The Circle waits. Kazon stands like stone for a long moment, then crosses the cairns and speaks the words - all of them, unflinching, in the old tongue. The Farpeak matriarch listens with her eyes closed. \"Sixty years,\" she says finally, \"we waited for one honest mouth.\"",
    requiredMissionWins: 113,
  },
  "Mission 114": {
    Characters: ["jahntow", "kazon"],
    Title: "Persuade Titan Clans to Unite 5",
    Message:
      "Five banners rise over the Circle of Cairns, knotted together at the staff - the first united Titan host since the age the songs come from. The war-leaders name Kazon first-among-equals by acclamation, which he accepts with the expression of a man handed a beautiful avalanche. His first act is to turn to Jahntow before the assembled clans. \"Brother of the range,\" he names him, and five thousand Titans make the mountains ring with it.",
    requiredMissionWins: 114,
  },
  "Mission 115": {
    Characters: ["jahntow", "kazon"],
    Title: "Defend Mountain Fortresses 1",
    Message:
      "Vortex's counterstroke comes with the first hard snow: a full invasion force climbing out of the eastern lowlands, armor and infantry and fresh mechs in corporate white, aimed at the fortress line the clans have just garrisoned together. From the Gate's rebuilt walls, Kazon watches the columns fill the valley like a grey flood. \"They spent a year teaching us to fight as one people,\" he says, sounding the great horns. \"Time to show them their work.\"",
    requiredMissionWins: 115,
  },
  "Mission 116": {
    Characters: ["jahntow", "kazon"],
    Title: "Defend Mountain Fortresses 2",
    Message:
      "The first assault shatters against the Titan gates - Stonebrow holding the wall, Farpeak archers on the heights, Yetis erasing the flanking parties so completely that Vortex's maps begin marking the side valleys DO NOT ENTER. When the horns sound the rally for the next wave, they are answered from five fortresses at once, ridge to ridge down the whole range, and the sound alone is worth a garrison.",
    requiredMissionWins: 116,
  },
  "Mission 117": {
    Characters: ["jahntow", "kazon"],
    Title: "Defend Mountain Fortresses 3",
    Message:
      "Then Vortex commits the mountain-breakers: siege mechs a class above anything yet seen, built for exactly this war, and the fortress walls shudder with every impact of their rams. The Gate loses its outer bastion in an afternoon. That night, Jahntow leads the mech lance out through the sally ports with lights doused, and the breakers learn that in Titan country, the dark between fortresses belongs to the defenders.",
    requiredMissionWins: 117,
  },
  "Mission 118": {
    Characters: ["jahntow", "kazon"],
    Title: "Defend Mountain Fortresses 4",
    Message:
      "The gates hold - barely, and at cost. In the valley below, Vortex masses for one final assault, stripping garrisons from three territories to do it, a last grey tide deep enough to drown the range. Kazon walks the walls in the waiting dark, stopping at every fire, learning the name of every warrior who will stand the morning. He ends beside Jahntow on the Gate itself. \"Whatever comes up that valley,\" he says quietly, \"it breaks here, or everything behind us burns.\"",
    requiredMissionWins: 118,
  },
  "Mission 119": {
    Characters: ["jahntow", "kazon"],
    Title: "Defend Mountain Fortresses 5",
    Message:
      "The final wave comes at dawn and the mountains themselves seem to take a side - five clans, the Yetis, the mech lance and the weather, all breaking the grey flood against the Gate through a day that the songs will argue over for a century. At dusk, Vortex's eastern army effectively ceases to exist. Kazon finds Jahntow on the wall, hands him something small: a link of chain from the fortress gate, worn smooth. \"So the lowlands remember,\" he rumbles, \"that the mountains held. Go. The jungle tribes are burning signal fires - Tuatha calls.\"",
    requiredMissionWins: 119,
  },
  // ======================================================================
  // ACT V - TUATHA. Jungle, wardcraft, and the first taste of dark magic.
  // ======================================================================
  "Mission 120": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Infiltrate Logging Facilities 1",
    Message:
      "Tuatha is green the way the ocean is wet - a jungle that swallows sound and sky - and Vortex is eating it with machines the size of villages. Jahntow's guide appears out of a tree's shadow as if the shadow had opinions: the Emerald Mage, robed in living moss, eyes the color of deep canopy. \"The forest asked for you by name,\" the Mage says, which should be impossible. \"Come. I will show you the wounds first. Then the surgeons.\"",
    requiredMissionWins: 120,
  },
  "Mission 121": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Infiltrate Logging Facilities 2",
    Message:
      "The first logging site infiltrates strangely: the Mage does not avoid the sensors so much as convince the jungle to stand between them and the lenses - vines drifting across cameras, insects swarming thermal pods on cue. Inside, Jahntow pulls schedules and shipping data while the Mage stands in the clear-cut, palms open, listening to something below hearing. On the walk out the Mage says only: \"The stumps are still screaming. Write faster.\"",
    requiredMissionWins: 121,
  },
  "Mission 122": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Infiltrate Logging Facilities 3",
    Message:
      "Vortex ups its guard - patrol drones above the canopy, chemical defoliant strips around every site to kill the Mage's green cover. It buys them nothing. The second facility's own timber yard grows overnight into a bridge over its sensor fence, roots politely dismantling the foundations as they pass. E.C.H.O. requests, formally, to be told how any of this works. \"Yes,\" the Mage agrees pleasantly, and says nothing further.",
    requiredMissionWins: 122,
  },
  "Mission 123": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Infiltrate Logging Facilities 4",
    Message:
      "The intelligence assembles into something worse than logging: the sites are not shipping lumber east, they are shipping specimens - crated flora, caged fauna, sealed samples marked BIOWEAPON FEEDSTOCK. The Mage reads the manifest once and the temperature under the canopy drops several degrees, without explanation, over roughly a mile. \"One site remains,\" the Mage says, in a voice like still water. \"Then we discuss what they owe.\"",
    requiredMissionWins: 123,
  },
  "Mission 124": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Infiltrate Logging Facilities 5",
    Message:
      "The final site is the depot where all of Tuatha's stolen green funnels east, and they walk its length unchallenged - the Mage's wards bending every eye, Jahntow copying the master ledgers whole. The last page is a routing order signed XAEZOR, and at the sight of the name the Mage goes still in a new way. \"The forest has dreamed this name,\" the Mage says slowly. \"It dreams him standing in ash, speaking to something older and worse. Your war and ours are one war, desert-son.\"",
    requiredMissionWins: 124,
  },
  "Mission 125": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Ambush Vortex Forces 1",
    Message:
      "The jungle goes to war the way it does everything: patiently, and then all at once. Vortex patrols that have walked the same trails for a year find the trails walking back - paths that circle, bridges that end mid-air, and at the center of every confusion, warriors of Tuatha rising out of the leaf-litter with the Mage's blessing on their spears. The first patrol is disarmed before it understands it is fighting.",
    requiredMissionWins: 125,
  },
  "Mission 126": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Ambush Vortex Forces 2",
    Message:
      "Jahntow learns Tuathan war-craft ambush by ambush: never fight where the enemy is strong, fight where the jungle makes him foolish. A convoy is taken at a ford the maps insist is shallow. A gun platform surrenders to warriors who seem to step out of the trees themselves - because, the Mage explains, they briefly did. \"The forest has doors,\" is the entire explanation offered. E.C.H.O. files it under 'unresolved.'",
    requiredMissionWins: 126,
  },
  "Mission 127": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Ambush Vortex Forces 3",
    Message:
      "Vortex stops sending patrols and starts sending hunters - counter-ambush teams in sensor-woven armor, burning their way forward in overlapping fire teams. They are good. The jungle is better, but the fights grow close and hot, and for the first time in Tuatha the alliance takes losses. That night the Mage sits long by the burial trees. \"I keep the count,\" the Mage says quietly when Jahntow joins the vigil. \"Every leaf of it. When we win, I will plant it.\"",
    requiredMissionWins: 127,
  },
  "Mission 128": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Ambush Vortex Forces 4",
    Message:
      "The hunters are broken the night the alliance turns their own doctrine against them: E.C.H.O. spoofing their sensor net into a phantom quarry, drawing every team into one valley - a valley the Mage has spent three days quietly waking. What happens there costs no allied lives and is never fully described afterward. The survivors emerge at dawn without weapons or the will to keep them, and Vortex's jungle offensive dies of nerves.",
    requiredMissionWins: 128,
  },
  "Mission 129": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Ambush Vortex Forces 5",
    Message:
      "The last combat patrol in free Tuatha lays down its arms at a river crossing without a shot, to warriors it never saw. Vortex's remaining strength pulls back into fortified enclaves around the trapping compounds and bioweapon works - besieged now in the land they came to strip. The Mage watches the withdrawal from the high canopy. \"Now their cruelty concentrates,\" the Mage says. \"The caged ones first, desert-son. The forest hears them at night.\"",
    requiredMissionWins: 129,
  },
  "Mission 130": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Foil Vortex Trapping 1",
    Message:
      "The trapping compounds are the jungle's open wound: pens and cages holding Tuatha's bright impossible creatures - moth-drakes with wings like windows, river cats that walk on lilies, singing roots in nutrient jars - all tagged for offworld buyers. The Mage walks the wire fence line once, slowly, and every animal inside falls silent and turns to watch. \"Tonight,\" the Mage promises them, in the common tongue, so the guards can hear it too.",
    requiredMissionWins: 130,
  },
  "Mission 131": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Foil Vortex Trapping 2",
    Message:
      "The first compound opens like a seed pod - locks rusted through in an hour by the Mage's patient green, gates lifted off their hinges by roots that were not there at sunset. Jahntow leads the freed creatures out along warded paths while the garrison chases alarms in circles. The moth-drakes go last, and one turns in the air above him, wings catching the moonlight, before following its kin into the dark canopy.",
    requiredMissionWins: 131,
  },
  "Mission 132": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Foil Vortex Trapping 3",
    Message:
      "Vortex's new traps are crueler - snares wired to shock grids, bait pens with pressure triggers, cages built of alloys the jungle cannot rust. For those, the alliance uses older tools: Jahntow's hands, E.C.H.O.'s eye for circuitry, and hard-won time bought by warriors feinting at the compound gates. Twice the work goes wrong by seconds. Twice the Mage bends probability like a green branch, and does not explain that either.",
    requiredMissionWins: 132,
  },
  "Mission 133": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Foil Vortex Trapping 4",
    Message:
      "The trapping operation collapses from the inside when its own handlers begin leaving gates unlatched - men and women who signed on to catch animals, not to hear a rainforest grieve every night through the wire. The Mage receives three defectors at the forest's edge and sets them to tending what they caged, which is either punishment or mercy and works as both. One compound remains: the deep pens, where Vortex keeps what it fears.",
    requiredMissionWins: 133,
  },
  "Mission 134": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Foil Vortex Trapping 5",
    Message:
      "In the deep pens they find the reason for the reinforced alloy: a canopy-lord - eldest of Tuatha's creatures, vast and patient and starving in a cage sized by accountants. Freeing it takes the whole night, every skill the alliance owns and, at the last, the Mage speaking to it alone in the oldest tongue. It leaves without haste, the jungle bowing around it. \"Remember this,\" the Mage tells Jahntow, watching it go. \"You will want to have been kind to it before the end.\"",
    requiredMissionWins: 134,
  },
  "Mission 135": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Destroy Bioweapon Stockpiles 1",
    Message:
      "The specimen crates were feedstock, and now the alliance finds the kitchen: a weapons works dug beneath a razed grove, where Vortex distills the jungle's own defenses into something patented and monstrous - blight strains keyed to Tuathan green, brewed in tanks and stacked in bunkers. The Mage looks at the stockpile manifests and, for the first time, looks afraid. \"This is not war on us,\" the Mage says. \"This is war on the idea of forests.\"",
    requiredMissionWins: 135,
  },
  "Mission 136": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Destroy Bioweapon Stockpiles 2",
    Message:
      "The first bunker cannot simply burn - blight spores ride smoke like sails - so it is killed carefully: E.C.H.O. walking Jahntow through the neutralizer sequence tank by tank while the Mage holds a windless bubble over the site, sweat standing on green skin, jaw locked. Four hours. When the last tank reads inert, the Mage exhales, sits down where standing had been happening, and accepts water without commentary.",
    requiredMissionWins: 136,
  },
  "Mission 137": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Destroy Bioweapon Stockpiles 3",
    Message:
      "Vortex garrisons the remaining stockpiles with its last jungle veterans and rings them in defoliated kill-zones where no ward can grow. The second bunker is taken by main force - Titan-forged breaching charges, Xictlian marksmen, Ava's mercenaries arrived from the west by fast skiff - the whole alliance's war-craft converging on Tuatha's behalf. The forest cannot enter the dead zone to help. It stands at the tree line, every branch utterly still, and watches its allies bleed for it.",
    requiredMissionWins: 137,
  },
  "Mission 138": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Destroy Bioweapon Stockpiles 4",
    Message:
      "Two bunkers dead. The third tries to leave - convoy crawlers loaded with blight tanks, running for an eastern airstrip under drone cover, Vortex cutting its losses and saving its weapon. The pursuit runs a day and a night through country that helps when it can. The convoy never reaches the strip. Afterward the Mage stands among the neutralized tanks in the roadway, looking east. \"They will try to fly the last of it out,\" the Mage says. \"The forest asks one more favor.\"",
    requiredMissionWins: 138,
  },
  "Mission 139": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Destroy Bioweapon Stockpiles 5",
    Message:
      "The final stockpile dies inside its own airfield, minutes before loading, in an operation timed to E.C.H.O.'s decryption of the flight schedule. When the last tank reads inert, something changes in the air of Tuatha - a held breath released, felt from the coast to the mountain foothills. The Mage marks the count of the fallen into a living tablet of bark, then turns to Jahntow with an expression that is finally, purely, gratitude. \"The forest owes,\" the Mage says. \"Come and be paid.\"",
    requiredMissionWins: 139,
  },
  "Mission 140": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Learn Forest Regrowth Rituals 1",
    Message:
      "Payment is teaching. In a grove where the light falls green and solid, the Mage begins instructing Jahntow in the regrowth rites - the slow song that coaxes ruined ground back to life. It is nothing like E.C.H.O.'s sciences and refuses to be either. \"You hold the memory of what grew,\" the Mage says, guiding his hands into the ash of a burned clearing, \"and you argue for it. Patiently. The ground wants convincing, not commanding.\" By dusk, under his palms: one pale unbearable shoot.",
    requiredMissionWins: 140,
  },
  "Mission 141": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Learn Forest Regrowth Rituals 2",
    Message:
      "They work the clear-cuts in widening rings - the Mage singing the deep parts, Jahntow carrying the rite's simpler verses, rebel volunteers hauling water and seed behind them. Ground that Vortex certified dead comes back argument by argument: first moss, then fern, then the fast pioneer trees rising like a held-back crowd. Xictlian outriders visiting from the west walk the new green in silence. Veran sends Zu'ark a single message: \"You need to see what he's learning out here.\"",
    requiredMissionWins: 141,
  },
  "Mission 142": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Learn Forest Regrowth Rituals 3",
    Message:
      "Then the rites begin to fail. Ground that should answer stays silent; new shoots blacken overnight in perfect circles. The Mage kneels in one dead ring for a long time, touches the soil, and recoils as if burned. \"Counter-working,\" the Mage says grimly. \"Dark craft, woven into machines. Vortex has bought itself a magician.\" Far to the east that night, for a moment, the horizon glows a color that is not fire. Jahntow thinks of the name that hums. Xaezor.",
    requiredMissionWins: 142,
  },
  "Mission 143": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Learn Forest Regrowth Rituals 4",
    Message:
      "The counter-working is fought the way the Mage fights everything: patiently, and with the whole jungle as an ally. Ward-stones grown from living crystal ring the healing zones; the rites are re-sung in doubled voice, teacher and student together, and the dark circles shrink season by forced season. It costs. The Mage grows visibly older that month and calls the price fair. \"Whoever he is,\" the Mage says of their unseen enemy, \"his craft is borrowed, and the debt behind it is monstrous. Remember that when you meet him.\"",
    requiredMissionWins: 143,
  },
  "Mission 144": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Learn Forest Regrowth Rituals 5",
    Message:
      "The last dead zone - the first clear-cut Vortex ever made in Tuatha, a wound so old the maps had accepted it - comes back to life on a morning of warm rain, Jahntow singing the rite's final verse alone at the Mage's insistence. Where the ash was, a young grove stands breathing. The Mage watches him in the green light with unreadable ancient eyes. \"Now you have made ground live,\" the Mage says. \"Whatever you must destroy before this ends - and it will be much - you will know what you are for.\"",
    requiredMissionWins: 144,
  },
  "Mission 145": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Defend the Heart of the Forest 1",
    Message:
      "Vortex's remnant in Tuatha gathers for a last act of spite with corporate logic behind it: kill the Heart. The sacred grove at the jungle's center - the first grove, the green from which all Tuatha grew - and every surviving Vortex asset now converges on it with incendiaries and blight-tipped shells. The Mage stands at the Heart's edge as the alliance digs in, and the great trees lean down around the small robed figure. \"They may not have this one,\" the Mage says simply. It is not a hope. It is a ruling.",
    requiredMissionWins: 145,
  },
  "Mission 146": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Defend the Heart of the Forest 2",
    Message:
      "The first column never reaches the outer wards - the jungle itself swallows it, path and purpose together, and what walks out walks out unarmed and weeping. But more columns are already cutting in on burned corridors where the forest cannot fight, and the alliance meets them steel to steel among the roots. Desert, mountain, forest and defector hold one line under the oldest branches on Zephyr. The line holds. The day is long.",
    requiredMissionWins: 146,
  },
  "Mission 147": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Defend the Heart of the Forest 3",
    Message:
      "Vortex burns its corridor to the grove's second ring, close enough that shell-smoke drifts grey between the sacred trunks. The Mage fights now - openly, terribly, the canopy weaving closed behind every allied retreat, roots taking gun platforms whole - and still gives ground, because the enemy has stopped caring what it spends. In a lull, breathing hard, the Mage grips Jahntow's arm. \"If the Heart burns, Tuatha fights on without a soul. Whatever it costs at the third ring - pay it.\"",
    requiredMissionWins: 147,
  },
  "Mission 148": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Defend the Heart of the Forest 4",
    Message:
      "At the third ring the alliance pays. The line bends around the great roots, breaks twice, is remade twice - the second time by the arrival of something vast moving through the canopy: the freed canopy-lord, come to collect its own debt, walking through Vortex armor like a landlord through cobwebs. By nightfall the outer rings have all held or been retaken, and one last enemy force - the largest - pushes for the Heart itself.",
    requiredMissionWins: 148,
  },
  "Mission 149": {
    Characters: ["jahntow", "emeraldMage"],
    Title: "Defend the Heart of the Forest 5",
    Message:
      "The last push dies within sight of the Heart's own light, caught between the alliance's final line and every living thing the jungle can lend, and when it is over, the silence under the great trees lasts a long, long time. Vortex is finished in Tuatha. The Mage stands before the first tree and formally presents Jahntow to it, as one presents kin. Then, quietly: \"The forest dreamed one thing more, desert-son. A city of glass to the east, full of sleeping minds. He is there. And the dream says: hurry.\"",
    requiredMissionWins: 149,
  },
  // ======================================================================
  // ACT VI - NAMARUPA. The glass city, the whispers, and a buried name.
  // ======================================================================
  "Mission 150": {
    Characters: ["jahntow", "zhalia"],
    Title: "Scout Vortex Facilities 1",
    Message:
      "Namarupa is a city of glass towers and bowed heads - the one tribe Vortex never invaded, because it never had to. Jahntow's contact meets him on a mag-rail platform wearing a gray commuter's coat and an expression of perfect corporate calm, which she drops the instant the cameras cycle. Zhalia: psychic, native, furious. \"Look at them,\" she murmurs of the silent crowds. \"My people aren't obedient. They're asleep. Something in this city is singing them under - help me find it.\"",
    requiredMissionWins: 150,
  },
  "Mission 151": {
    Characters: ["jahntow", "zhalia"],
    Title: "Scout Vortex Facilities 2",
    Message:
      "They walk the first facility in plain sight - Zhalia folding them inside a gentle nobody-here suggestion while E.C.H.O. drinks from the building's veins. Data centers, broadcast relays, and floors that appear on no blueprint. In a sealed archive index, E.C.H.O. brushes against a file older than the occupation itself: MERIDIAN INCIDENT - ACCESS: XAEZOR ONLY. Jahntow stops walking. He does not know why his chest has gone tight. The archive door is triple-sealed. Not tonight.",
    requiredMissionWins: 151,
  },
  "Mission 152": {
    Characters: ["jahntow", "zhalia"],
    Title: "Scout Vortex Facilities 3",
    Message:
      "The deeper surveys confirm Zhalia's fear and give it architecture: beneath the civic towers, Vortex has grown a psionic lattice - conduits threading the city like nerves, all flowing toward something buried at the center that the schematics call only THE AMPLIFIER. \"It's a voice,\" Zhalia says, pale, one palm against a humming conduit. \"One voice, whispering to two million sleeping minds. Calm. Comply. Consume. I've heard it my whole life and thought it was me.\"",
    requiredMissionWins: 152,
  },
  "Mission 153": {
    Characters: ["jahntow", "zhalia"],
    Title: "Scout Vortex Facilities 4",
    Message:
      "Vortex counterintelligence begins to circle - not guards but listeners, corporate psychics in gray, tasting the city's surface thoughts for the flavor of rebellion. Scouting under their attention is a new kind of warfare: Zhalia teaches Jahntow to think in boring circles, to wear a commuter's mind like a coat. Twice a listener's gaze drags across them and finds nothing worth waking for. The second time, Zhalia's hand in his does not tremble at all, which he understands is a performance for both of them.",
    requiredMissionWins: 153,
  },
  "Mission 154": {
    Characters: ["jahntow", "zhalia"],
    Title: "Scout Vortex Facilities 5",
    Message:
      "The final target maps the Amplifier itself - approach shafts, shield housings, the conduit chokepoints where the whisper could someday be cut. It is the deepest they have gone and the closest to the singing dark, and coming back up, Zhalia is silent until the night air. \"Every district hears a different verse,\" she says at last. \"Workers hear duty. Elders hear safety. Do you know what the children's towers hear?\" She looks at the glass skyline. \"Nothing. Silence. They're growing a generation with no inner voice at all. We start the uprising with words.\"",
    requiredMissionWins: 154,
  },
  "Mission 155": {
    Characters: ["jahntow", "zhalia"],
    Title: "Disrupt Executive Speeches 1",
    Message:
      "Vortex governs Namarupa from podiums: weekly executive addresses, carried to every screen, the Amplifier riding under the audio like a current under calm water. The first disruption is surgical - E.C.H.O. shears the psionic carrier off the broadcast mid-speech, and two million people hear an executive's bare voice for the first time. Hear the contempt in it. In the plazas, faces turn upward, frowning slightly, like sleepers bothered by a fly.",
    requiredMissionWins: 155,
  },
  "Mission 156": {
    Characters: ["jahntow", "zhalia"],
    Title: "Disrupt Executive Speeches 2",
    Message:
      "The second address, Zhalia takes further: as the carrier drops, she rides the open channel with a projection of her own - no command, no counter-whisper, only a single spoken question in a Namarupian accent: \"When did you last choose something?\" The words hang in two million minds for four seconds before Vortex cuts the feed. That night, across the city, an unusual number of people call in sick. Small thing. Enormous thing.",
    requiredMissionWins: 156,
  },
  "Mission 157": {
    Characters: ["jahntow", "zhalia"],
    Title: "Disrupt Executive Speeches 3",
    Message:
      "Vortex hardens the broadcast chain - new encryption, armored relay stations, gray listeners sweeping the crowds at every address. The third disruption has to be physical: Jahntow on a relay tower in a maintenance skin, swapping a signal module by hand while the speech plays forty meters below. The listeners taste the crowd, the rooftops, the wind. Boring circles, Zhalia's voice steadies him in memory, and the wrench keeps a commuter's rhythm.",
    requiredMissionWins: 157,
  },
  "Mission 158": {
    Characters: ["jahntow", "zhalia"],
    Title: "Disrupt Executive Speeches 4",
    Message:
      "The disrupted addresses are working double duty: every clean broadcast wakes more sleepers, and every countermeasure Vortex deploys maps another node of the psionic lattice for E.C.H.O.'s growing schematic. Zhalia recruits now among the woken - quiet cells in the worker districts, first dozens, then hundreds, people learning to guard their own minds like a new muscle. \"One more speech,\" she says. \"The Director of Namarupan Operations himself. Everyone will be listening. Let's make it true.\"",
    requiredMissionWins: 158,
  },
  "Mission 159": {
    Characters: ["jahntow", "zhalia"],
    Title: "Disrupt Executive Speeches 5",
    Message:
      "The Director's address dies on the podium in front of the whole city: carrier cut, teleprompter hijacked, and sixty seconds of E.C.H.O.'s finest curation playing on every screen - the Director's own internal memos, in his own voice-print, pricing Namarupian compliance per head. The plazas do not riot. They do something that frightens Vortex more: they quietly, in their thousands, turn their backs on the screens and walk away. The whisper has to shout now. Shouting can be heard.",
    requiredMissionWins: 159,
  },
  "Mission 160": {
    Characters: ["jahntow", "zhalia"],
    Title: "Make Vortex Mechs Malfunction 1",
    Message:
      "A waking city needs its jailers disarmed. Vortex's enforcement mechs stand at every plaza corner - gleaming civic guardians, the velvet over the fist - and Zhalia has wanted them gone since childhood. The first sabotage is a joint craft: E.C.H.O. inside the maintenance channel, Zhalia laying a psychic thumb on the operator's certainty at the crucial moment, Jahntow's hands on the hardware between them. The mech powers down mid-patrol, kneels in the plaza like a tired horse, and does not get up.",
    requiredMissionWins: 160,
  },
  "Mission 161": {
    Characters: ["jahntow", "zhalia"],
    Title: "Make Vortex Mechs Malfunction 2",
    Message:
      "They work the enforcement grid district by district, and give the failures personality on purpose: mechs that salute refuse pillars, mechs that patrol in perfect small circles, one that escorts an elderly woman's groceries home with terrible ceremony before shutting down on her doorstep. The city watches its fearsome guardians become street theater, and fear - Vortex's true infrastructure - develops cracks that no work order can close.",
    requiredMissionWins: 161,
  },
  "Mission 162": {
    Characters: ["jahntow", "zhalia"],
    Title: "Make Vortex Mechs Malfunction 3",
    Message:
      "Vortex flies in countermeasure teams and mechs with hardened cores, and the game turns serious - the new units patrol in pairs, firmware sealed, operators screened by gray listeners. The alliance's answer is patience: three weeks of E.C.H.O. studying the update pipeline itself, then one perfect poisoned patch, signed with Vortex's own keys, delivered by their own system. The hardened mechs accept it gratefully. Nothing happens at all - until it is needed to.",
    requiredMissionWins: 162,
  },
  "Mission 163": {
    Characters: ["jahntow", "zhalia"],
    Title: "Make Vortex Mechs Malfunction 4",
    Message:
      "The sleeper patch waits in almost every enforcement core in Namarupa now. The last set - the command mechs guarding the Amplifier district itself - update from an isolated network, and have to be poisoned by hand, one access panel at a time, under the heaviest security in the city. It takes four nights. On the last one, a gray listener stands an arm's length from Jahntow for nine full seconds, tasting. Boring circles. Commuter's mind. The listener moves on. Zhalia doesn't speak again until they're three districts away.",
    requiredMissionWins: 163,
  },
  "Mission 164": {
    Characters: ["jahntow", "zhalia"],
    Title: "Make Vortex Mechs Malfunction 5",
    Message:
      "The final test is the proof: a Vortex sweep ordered into a woken district to make arrests, forty mechs strong. Zhalia speaks one word into the alliance channel, E.C.H.O. wakes the sleeper patch, and forty enforcement mechs stop mid-stride, kneel in unison down the length of the boulevard, and power down with a sound like the city exhaling. The sweep teams stand suddenly alone amid a crowd that is no longer asleep and no longer afraid. They withdraw. Everyone sees it. Everyone.",
    requiredMissionWins: 164,
  },
  "Mission 165": {
    Characters: ["jahntow", "zhalia"],
    Title: "Create Illusions to Confuse Vortex 1",
    Message:
      "Zhalia's next weapon is her oldest gift turned outward: illusion - not to deceive her people, but to show them what Vortex hides. Above the central plaza, woven from projected light and lent psychic conviction, she hangs the corporation's first scandal for all to see: the buried survey footage of what the terraforming spires did to Luxor, played sky-high, undeniable, while E.C.H.O. seeds the source documents to every terminal in the city. Vortex's censors reach for the feed and find nothing to cut. The sky is not a channel.",
    requiredMissionWins: 165,
  },
  "Mission 166": {
    Characters: ["jahntow", "zhalia"],
    Title: "Create Illusions to Confuse Vortex 2",
    Message:
      "The second showing is ledgers: the Namarupan compliance budget, the per-head pricing, the executives' island accounts - Zhalia painting the numbers across the glass faces of the towers that earned them. The gray listeners try to convince the crowds they see nothing. It half-works on the sleeping. It does not work at all on the woken, and the woken now stand in every crowd, saying quietly to their neighbors: no, look. It's real. I checked. Look.",
    requiredMissionWins: 166,
  },
  "Mission 167": {
    Characters: ["jahntow", "zhalia"],
    Title: "Create Illusions to Confuse Vortex 3",
    Message:
      "Vortex deploys counter-projectors and a smear: the rebel psychic is hallucinating you, citizens, report the girl. For a day the sky over Namarupa is a war of light - Zhalia's evidence against corporate static. She wins it with a masterstroke of restraint: dropping every illusion at once and letting the city stand in plain, unaugmented silence before the documents themselves, printed and nailed to the doors of the courts. \"Their whole power is noise,\" she tells Jahntow, exhausted and shining. \"Quiet is ours.\"",
    requiredMissionWins: 167,
  },
  "Mission 168": {
    Characters: ["jahntow", "zhalia"],
    Title: "Create Illusions to Confuse Vortex 4",
    Message:
      "The scandals are cracking the pillar Vortex needs most - the collaborating civic class. Magistrates resign citing health. Utility directors discover conscience and side-channels to the resistance in the same week. Each defection is guarded by Zhalia's craft: faces veiled in projected anonymity until their families are safe. One arrives with a gift that stops the room - partial keys to the sealed archives. The MERIDIAN file glows in E.C.H.O.'s index, one seal lighter. Still locked. Closer.",
    requiredMissionWins: 168,
  },
  "Mission 169": {
    Characters: ["jahntow", "zhalia"],
    Title: "Create Illusions to Confuse Vortex 5",
    Message:
      "The last scandal is the one Zhalia has saved, and dreaded: proof of the Amplifier itself. She shows the city its own cage - the lattice under the streets, the verses sung into each district, the silence grown in the children's towers - and she shows it gently, because there is no gentle way to learn you have been dreaming someone else's dream. Namarupa weeps that night, all of it, openly, in the plazas. And then Namarupa gets angry. \"Now,\" Zhalia says, and her voice carries no doubt at all. \"Now the uprising.\"",
    requiredMissionWins: 169,
  },
  "Mission 170": {
    Characters: ["jahntow", "zhalia"],
    Title: "Lead Astral Projection Assaults 1",
    Message:
      "The uprising begins at shift-bell, in every district at once. The woken march in the streets; above them march Zhalia's projections - vast astral figures striding the skyline, the tribes' own heroes rendered in light, an army that cannot be shot. Under that cover the real work moves: alliance teams and Namarupan cells taking relay stations, armories, the gates. The sleeper mechs kneel wherever they stand. By nightfall the first district raises its own flag, hands shaking, on the roof of a Vortex precinct.",
    requiredMissionWins: 170,
  },
  "Mission 171": {
    Characters: ["jahntow", "zhalia"],
    Title: "Lead Astral Projection Assaults 2",
    Message:
      "The second and third districts come free in a day - the enforcement grid is a museum, the broadcast chain is captured, and every liberated block swells the march. Jahntow fights at street level with the mercenaries and the desert outriders, and above him Zhalia's projections do what projections do best: they make courage contagious. People who have never chosen anything are storming checkpoints behind a fifty-meter figure of light shaped like their grandmother's stories. Vortex holds two districts, the spaceport, and the Amplifier. It is not enough, and they know it.",
    requiredMissionWins: 171,
  },
  "Mission 172": {
    Characters: ["jahntow", "zhalia"],
    Title: "Lead Astral Projection Assaults 3",
    Message:
      "Vortex plays its gray card: psi-dampener squads flooding the contested streets, machines that drink projection and conviction alike. Zhalia's astral giants gutter like candles in wind; in the dampened blocks her voice in the alliance channel drops to a thread. The answer is Jahntow's kind of warfare - dampeners are hardware, and hardware has bearers, and bearers can be found. The squads are hunted through their own dead zones by fighters who never needed light to be brave. Push through. The giants rekindle street by street.",
    requiredMissionWins: 172,
  },
  "Mission 173": {
    Characters: ["jahntow", "zhalia"],
    Title: "Lead Astral Projection Assaults 4",
    Message:
      "The spaceport falls at dawn - the last Vortex evacuation lifting off half-loaded, executives shoving past their own staff for seats - and with it every district but one. The city rings the Amplifier now, a sea of the woken around one humming tower. Zhalia stands at the cordon's edge, looking at the thing that sang her people to sleep for a generation. Jahntow watches her shoulders set. \"My whole life it whispered to me,\" she says. \"Tomorrow it hears from us.\"",
    requiredMissionWins: 173,
  },
  "Mission 174": {
    Characters: ["jahntow", "zhalia"],
    Title: "Lead Astral Projection Assaults 5",
    Message:
      "The last district - the Amplifier's own - is taken with hardly a shot fired. Its garrison walks out and lays down arms; its staff open the gates from inside; the machines kneel. What remains is the tower itself and what lives at its root, still singing into the wire even now, seeking sleepers who are no longer there. Namarupa is free above ground. Below it, the whisper waits. Zhalia gathers her strength, and the alliance gathers with her - for the strangest battle of the war.",
    requiredMissionWins: 174,
  },
  "Mission 175": {
    Characters: ["jahntow", "zuark", "zhalia"],
    Title: "Final Psychic Showdown 1",
    Message:
      "They do not attack the Amplifier with charges - blight and fire taught Vortex to build against those. They attack it with what it fed on. Every psychic in the liberated city gathers in the great plaza at midnight, hands joined, the woken crowds kneeling in rings around them like a living battery, and Zu'ark - arrived from the west with the alliance vanguard - stands at Jahntow's back the way she has since the desert. Zhalia closes her eyes and guides two million waking minds down into the wire, toward the singing dark. \"Together,\" she says. \"It has never heard together.\"",
    requiredMissionWins: 175,
  },
  "Mission 176": {
    Characters: ["jahntow", "zuark", "zhalia"],
    Title: "Final Psychic Showdown 2",
    Message:
      "The combined projection hits the Amplifier's outer shield like a tide against a harbor wall, and the machine answers the only way it knows: manufactured dread, waves of it, every mind in the plaza suddenly certain that everyone they love is dying somewhere just out of reach. People scream without letting go of each other's hands. Not letting go is the battle. Zhalia's voice moves through the link like a lantern: It is not yours. It is not true. Hold. And two million minds, who have finally learned the difference between their own thoughts and the whisper's, hold.",
    requiredMissionWins: 176,
  },
  "Mission 177": {
    Characters: ["jahntow", "zuark", "zhalia"],
    Title: "Final Psychic Showdown 3",
    Message:
      "Inside the shield they meet the Amplifier's servants: Vortex counter-psychics, wired into the machine, striking at the link with trained precision - and Zu'ark anchors Jahntow's mind through the worst of it, an arm across his chest in the plaza, a stubborn desert light in the storm below. Then the strangest turn of the war: as the combined projection presses closer, the counter-psychics begin to falter - not defeated but waking, one by one, from conditioning laid so deep they never knew it was there. Zhalia catches each one as they surface. Some are weeping. One keeps repeating a stranger's name that E.C.H.O. quietly notes: it appears in the MERIDIAN file index. Deep-conditioning, the machine's records confirm, has been threaded through every tribe for a generation. Some sleepers never knew what they were.",
    requiredMissionWins: 177,
  },
  "Mission 178": {
    Characters: ["jahntow", "zuark", "zhalia"],
    Title: "Final Psychic Showdown 4",
    Message:
      "The amplifier's core lies exposed at last - a cold architecture of borrowed craft, half machine and half something the Emerald Mage would recognize - and as the united minds close around it, a presence steps into the link that is none of its servants. XAEZOR. His voice arrives like pressure, addressed to Jahntow alone, intimate as a hand on the shoulder: Enough. You have cost me a planet's patience. Name anything - wealth, worlds, the truth about the crash that made you - and it is yours. Turn back. For one terrible heartbeat the link goes quiet, waiting on Jahntow. \"You just offered to sell me my own past,\" he answers. \"Everything you have is stolen.\" And two million minds surge.",
    requiredMissionWins: 178,
  },
  "Mission 179": {
    Characters: ["jahntow", "zuark", "zhalia"],
    Title: "Final Psychic Showdown 5",
    Message:
      "The Amplifier shatters at dawn - not with an explosion but with a release, a generation of trapped whisper unwinding into the sky in a long fading sigh. In the plaza, two million people open their eyes at once. For the first time in living memory the air of Namarupa is clear of verses, and the silence is so whole, so clean, that nobody wants to be the first to break it. Zhalia finally does, laughing and crying together, arms around strangers. Zu'ark pulls Jahntow to his feet. Far to the east, past the city's glass, the Vortex fortress squats on the horizon - the last tower still humming. \"Him,\" she says. \"Now him.\"",
    requiredMissionWins: 179,
  },
  // ======================================================================
  // ACT VII - THE FORTRESS. Everything the war was for, in five chapters.
  // ======================================================================
  "Mission 180": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Infiltration 1",
    Message:
      "The fortress rises out of the eastern wastes like a verdict - black, windowless, drinking its valley dry. Around it, out of sight, the united tribes assemble the greatest host Zephyr has ever raised. But hosts cannot lower force fields, so the war comes down to a strike team on dragonbone gliders in the dark: Jahntow, Zu'ark, Ava - and, hunched between them with a lifetime of Vortex clearances in his head, Zerrok. Master Zhenwu checks each harness himself. \"The sky carried you to us once,\" he tells Jahntow quietly. \"Let it carry you to the answer.\"",
    requiredMissionWins: 180,
  },
  "Mission 181": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Infiltration 2",
    Message:
      "The approach is two hours of absolute silence above a sensor net that can hear a heartbeat, riding thermals Zhenwu mapped by starlight. The fortress grows until it is the whole horizon. They land on a maintenance ledge no schematic admits exists - Zerrok's first gift; he signed the order that hid it, twenty years ago, in a career of small preparations for a day he never believed would come. Ava squeezes her father's shoulder once. The team unclips, and the mountain of black metal above them hums like a sleeping throat.",
    requiredMissionWins: 181,
  },
  "Mission 182": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Infiltration 3",
    Message:
      "The first security layer is Vortex's finest - biometric gates, patrolling seekers, corridors that reconfigure on a randomized schedule. It parts before them like a curtain, because the man walking point built half of it. Zerrok moves through his old empire grey-faced and precise, spending secrets like a man emptying his pockets before a long journey. \"Left here. Camera sweeps in four. My codes are dead but my habits aren't - the night crews still shift-change early.\" Zu'ark watches him work, and reserves judgment like a held blade.",
    requiredMissionWins: 182,
  },
  "Mission 183": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Infiltration 4",
    Message:
      "Twice they meet patrols that cannot be avoided, and twice the team takes them down in seconds of savage quiet - Zu'ark's bowstring, Ava's knife-hand, bodies eased to the floor and alarms left dreaming. In a dead-zone alcove, waiting out a seeker sweep, Ava finds Jahntow's eyes in the dark. \"Whatever we find in here,\" she whispers - and doesn't finish it. She has been listening to the fortress's inner hum for an hour with a strange look, like someone hearing a song they'd forgotten they knew. \"Nothing,\" she says. \"Keep moving.\"",
    requiredMissionWins: 183,
  },
  "Mission 184": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Infiltration 5",
    Message:
      "By the deep hours they crouch at the inner perimeter's edge - past the last patrol ring, beneath the fortress's armored heart, closer than any enemy of Vortex has ever stood. Above them, floors of darkness; somewhere in it, the field generators, the garrison, and the man with Jahntow's past in a sealed file. E.C.H.O. maps the final approach in threads of light. Zerrok stares up into the black core and says, mostly to himself: \"He is here. I can feel the weight of him from here.\" Nobody asks how he knows. They should have.",
    requiredMissionWins: 184,
  },
  "Mission 185": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Inside the Fortress 1",
    Message:
      "The fortress interior is a corporation's soul made architecture: kilometer halls of humming servers, galleries of trophies from five conquered territories - a Titan clan banner, a dragonbone spar, a jar of Xictlian spring water with an inventory tag. The team moves through it like a slow knife. In the server halls, E.C.H.O. touches the fortress network for the first time and goes very quiet. \"The MERIDIAN file is here,\" it says at last. \"Master archive. Two seals left. Jahntow - it is flagged for his personal attention. It always has been.\"",
    requiredMissionWins: 185,
  },
  "Mission 186": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Inside the Fortress 2",
    Message:
      "They find the cells on the detention level: rebels, defectors, tribespeople taken in every campaign - and engineers who built the fortress and knew too much to release. The locks are Zerrok's own design, and open to their maker. Among the freed, a gaunt Namarupan grips Jahntow's arm with both hands: she helped lay the force-field conduits, and she can draw the control room from memory. The prisoners melt into the service levels to wait for the signal. The team climbs on, richer by a map and forty debts of gratitude.",
    requiredMissionWins: 186,
  },
  "Mission 187": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Inside the Fortress 3",
    Message:
      "The upper levels fight back. Automated traps stitched into the corridors - shear-fields, gas locks, floors that forget to exist - and between them, patrols of the black-armored elite who have chased the alliance across five lands. The skirmishes are brutal, close, and quick; Zu'ark takes a graze that paints her sleeve, and laughs at it, because desert luck holds. Ava fights strangely - flawlessly, but strangely, her head tilting now and then as if to a voice beneath the alarms. Zerrok watches his daughter with an expression Jahntow cannot read. It looks almost like grief arriving early.",
    requiredMissionWins: 187,
  },
  "Mission 188": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Inside the Fortress 4",
    Message:
      "The maze above the detention levels is the fortress's cruelest design - identical corridors re-keyed hourly, built to swallow intruders and feed them to the seekers. The freed engineer's memory-map defeats it, corner by counted corner, with E.C.H.O. keeping the count. In a maintenance gallery, the team pauses at a viewport: far below, dawn is touching the wastes, and the united host is moving into position - a shadow of thousands at the edge of the killing ground, waiting for fields that only this team can drop. Zu'ark breathes on the glass. \"Don't keep them waiting.\"",
    requiredMissionWins: 188,
  },
  "Mission 189": {
    Characters: ["jahntow", "zuark", "ava"],
    Title: "Inside the Fortress 5",
    Message:
      "They reach the fortress's central atrium as the alarms finally, inevitably, find their scent - a vertical cathedral of black steel, the control spire rising through its heart, the field generators thundering somewhere above. The last doors stand ahead. The team checks weapons in the shrieking red light, and for a moment - the last moment, though none of them knows it - all four stand together: the desert's daughter, the Director and his child, and the man the sky gave to Zephyr. \"For the tribes,\" Ava says. Her voice is steady. Her hand, on the door plate, is not.",
    requiredMissionWins: 189,
  },
  "Mission 190": {
    Characters: ["jahntow", "zuark", "ava", "zerrok"],
    Title: "Betrayal 1",
    Message:
      "The doors seal behind them - all of them, at once, with no alarm and no ambush, which is how Jahntow knows before he turns. Zerrok stands apart at the atrium console, entering command strings with terrible fluency, and when he lifts his head his eyes are wrong: focused and empty together, like windows with the rooms gone dark behind them. From every speaker at once, soft as a bedside voice, Xaezor: \"Thank you, Director. Twenty years of patience. Did none of you wonder why his defection cost him nothing I couldn't spare?\" Ava's whole body goes still. \"Father,\" she says. \"Father, look at me.\" He does not.",
    requiredMissionWins: 190,
  },
  "Mission 191": {
    Characters: ["jahntow", "zuark", "ava", "zerrok"],
    Title: "Betrayal 2",
    Message:
      "Zerrok moves for the master lockdown - the command that would seal the strike team in a tomb of black steel and hold the force fields up against the tribes forever - and Ava is the only one close enough. She does not draw on him. That is the unbearable thing: she steps between her father and the console with empty hands, the way she must have stood as a girl, and speaks to whatever of him is left behind the conditioning. \"You hid a ledge for twenty years. You saved forty-one Pandalings with an invoice. That was you. THIS is him. Papa. Fight it.\" And for one flickering instant - his hand stops.",
    requiredMissionWins: 191,
  },
  "Mission 192": {
    Characters: ["jahntow", "zuark", "ava", "zerrok"],
    Title: "Betrayal 3",
    Message:
      "The instant is a lie. Xaezor's voice drops a register - a single phrase in no tribe's tongue, the trigger under the trigger - and Zerrok's stopped hand finishes its motion in a way that no one, not even the machine wearing him, intends toward his daughter. The shot takes Ava below the heart. The sound the atrium makes afterward is Jahntow's own voice, and he never remembers making it. She goes down against the console she was guarding, one hand pressed to the wound, the other - even now, even now - reaching not for a weapon but for her father's sleeve.",
    requiredMissionWins: 192,
  },
  "Mission 193": {
    Characters: ["jahntow", "zuark", "ava", "zerrok"],
    Title: "Betrayal 4",
    Message:
      "What Ava does with her last strength becomes the story every tribe tells first. Bleeding out against the console, she pulls her father down to her by the collar - and speaks the counter-phrase. The one Zerrok built into his own conditioning twenty years ago and hid in the only place Vortex would never audit: his daughter's memory, folded into a lullaby. Zerrok's eyes come back on like a man surfacing from deep water, and what he surfaces into is this. His weapon falls. His knees follow. Ava holds his face in both hands. \"There you are,\" she manages, satisfied, as if she has merely found him late for dinner. \"There you are.\"",
    requiredMissionWins: 193,
  },
  "Mission 194": {
    Characters: ["jahntow", "zuark"],
    Title: "Betrayal 5",
    Message:
      "She dies in the red light with her father's hands in hers and the whole team kneeling around her, and her last words are orders, because she was always going to spend her final breath usefully: \"Fields down. Tribes in. Don't let the cage outlive me.\" Then, only to Jahntow, softer, the sentence she never finished in the alcove: \"Whatever you find in here - it doesn't get to keep you.\" Zu'ark closes Ava's eyes with a desert blessing. Zerrok does not move from his knees, and no one asks him to. The team rises. The fortress is going to fall now. It has made it personal.",
    requiredMissionWins: 194,
  },
  "Mission 195": {
    Characters: ["jahntow", "zuark"],
    Title: "Disabling the Defenses 1",
    Message:
      "Grief becomes procedure, because procedure is the only thing that holds. The freed engineer's map leads them up the spire toward the control room, through corridors emptying as the garrison masses at the walls against the visible host outside. Zu'ark walks point with an expression that has stopped being anger and become something geological. Behind them, under guard of the freed prisoners, Zerrok follows in restraints he asked for himself, speaking only once: \"The control room's dead-man protocols are mine. You will need me. After that, I stop asking anything of anyone.\"",
    requiredMissionWins: 195,
  },
  "Mission 196": {
    Characters: ["jahntow", "zuark"],
    Title: "Disabling the Defenses 2",
    Message:
      "The control room's last defenders are the fortress elite guard, and they do not yield an inch that is not paid for. The fight up the spire's final gallery is the hardest steel-on-steel of the entire war - and it is won by the whole war arriving at once: freed prisoners rising from the service levels, the sleeper-patched maintenance mechs kneeling at E.C.H.O.'s word to become barricades, and two fighters from a desert city who have not lost a corridor battle since the year the drones came. The doors give. The room is theirs.",
    requiredMissionWins: 196,
  },
  "Mission 197": {
    Characters: ["jahntow", "zuark", "echo"],
    Title: "Disabling the Defenses 3",
    Message:
      "E.C.H.O. pours itself into the fortress's nervous system with everything it has learned across five campaigns - spire codes from Luxor, lattice keys from Namarupa, twenty years of Zerrok's back doors surrendered in a flat, ruined voice. The automated turret grid dies ring by ring, the fortress going blind from the inside out. Deep in the intrusion, E.C.H.O. pauses on the master archive one last time. \"Jahntow. One seal remains on MERIDIAN. It will open from the inner sanctum. Where he is.\" \"Good,\" Jahntow says, and means several things.",
    requiredMissionWins: 197,
  },
  "Mission 198": {
    Characters: ["jahntow", "zuark"],
    Title: "Disabling the Defenses 4",
    Message:
      "The force fields come down at noon, and the sound reaches the control room twice: first the generators' dying whine falling away floor by floor - then, seconds later, rolling in through the fortress walls, the roar of the united tribes as the shimmer over the killing ground vanishes and the way opens. Five banners come off the wastes at a run - Xictlian outriders, Titan mechs, Luxorian wardens, the forest's warriors, Namarupa's woken - one host, one direction. Zu'ark watches from the spire viewport, and her smile has an edge the desert would recognize. \"Now knock,\" she says.",
    requiredMissionWins: 198,
  },
  "Mission 199": {
    Characters: ["jahntow", "zuark"],
    Title: "Disabling the Defenses 5",
    Message:
      "By dusk the fortress belongs to Zephyr - walls, halls, server cathedrals, all of it taken room by room by the united host while the last defenses die under E.C.H.O.'s patient hands. All but one place: the inner sanctum at the fortress's crown, sealed behind doors of black alloy that answer to a single biometric, humming with borrowed craft that makes the Emerald Mage's distant wards itch. The tribes ring it in silence. Jahntow stands before the doors with Zu'ark at his shoulder, and from beyond the alloy, unhurried, amused, a voice he has only heard inside his own mind: \"At last. Come in, orphan. The file is open.\"",
    requiredMissionWins: 199,
  },
  "Mission 200": {
    Characters: ["jahntow", "zuark", "xaezor"],
    Title: "Confrontation with Xaezor 1",
    Message:
      "The sanctum is a throne room pretending to be an office: one vast chamber at the fortress's crown, walls of living glass looking down on the conquered-unconquered world, and at its center, rising from a desk of black stone - Xaezor. Taller than his portraits, older than his voice, power braided around him like a second suit. Behind him, projected gently in the air, the MERIDIAN file stands open at last: a survey ship's manifest. A crew list. Two names bracketed together, and beneath them a third, smaller. A child's. \"You've read it by now,\" Xaezor says pleasantly. \"So let us talk like family.\"",
    requiredMissionWins: 200,
  },
  "Mission 201": {
    Characters: ["jahntow", "zuark", "xaezor"],
    Title: "Confrontation with Xaezor 2",
    Message:
      "He tells it like a quarterly report, which is the cruelest possible way. The survey ship Meridian, thirty years ago: independent contractors who found Zephyr first and filed it as a protected world - six sentient cultures, no extraction permitted. Xaezor, a rising director with a PROJECT to fund, made the filing disappear, and then made the ship disappear over the deep desert to keep it gone. \"Your parents were thorough people,\" he says. \"The crash was thorough too. The escape pod was - a rounding error.\" He spreads his hands. \"I orphaned you, and Zephyr raised you, and you grew into the invoice for everything I've built. I respect that. Now let me pay it and be done: name your price.\"",
    requiredMissionWins: 201,
  },
  "Mission 202": {
    Characters: ["jahntow", "zuark", "xaezor"],
    Title: "Confrontation with Xaezor 3",
    Message:
      "Jahntow's answer is the answer he gave two million minds in a plaza, and it needs no words this time. The battle that breaks across the sanctum is like nothing the war has shown: Xaezor fighting with the fortress itself - glass walls weaponized, gravity bent in pockets, seeker-drones birthing from the floor - and beneath the technology, the borrowed dark craft the Mage warned of, cold and vast and running up a debt with every use. Zu'ark and Jahntow fight as one creature, desert-fashion, and are driven back across the black stone floor all the same. \"I bought power from things you cannot pronounce,\" Xaezor observes, advancing. \"What did Zephyr ever give you?\"",
    requiredMissionWins: 202,
  },
  "Mission 203": {
    Characters: ["jahntow", "zuark", "xaezor"],
    Title: "Confrontation with Xaezor 4",
    Message:
      "Everything, is the answer, arriving all at once. The desert gave him patience, and patience finds the rhythm in Xaezor's storms. The mountains gave him ground, and ground is chosen: Zu'ark baits the dark craft into spending itself against a server column whose collapse E.C.H.O. has already computed. The forest gave him the rites, and when Xaezor's borrowed power gutters - the debt behind it arriving, as the Mage promised, monstrous and punctual - it is a man who learned to make dead ground live who recognizes the exact moment a thing begins to die. The glass walls go dark. The drones fall. For the first time, Xaezor retreats a step.",
    requiredMissionWins: 203,
  },
  "Mission 204": {
    Characters: ["jahntow", "zuark", "xaezor"],
    Title: "Confrontation with Xaezor 5",
    Message:
      "It ends without spectacle, which is somehow right. Xaezor - craft spent, fortress deaf to him, the invoice come due - makes one last lunge for the desk's hidden failsafe, and Zu'ark's arrow takes it out of his reach while Jahntow takes him to the floor of his own sanctum. The most powerful man on Zephyr is bound with a glider strap by the orphan of the Meridian, under the open file bearing his parents' names. Xaezor, pinned, studies Jahntow's face for a long moment and finds nothing for sale in it at all. \"Ah,\" he says finally, quietly - the sound of a man reading a figure that will not reconcile. Below, the tribes are singing.",
    requiredMissionWins: 204,
  },
  "Mission 205": {
    Characters: ["jahntow", "zuark"],
    Title: "Victory and Aftermath 1",
    Message:
      "The war ends the way the whisper ended: with quiet, then with everything at once. Vortex's remaining garrisons surrender planetwide within days - some to arriving war parties, most to their own conscripts simply walking out. In the fortress's shadow the tribes raise a camp that becomes a festival that becomes, without anyone deciding it, a capital: five banners and the woken city's lights, knotted together the way the Titans knot rope. Jahntow sleeps for two days. Zu'ark guards the door and tells everyone he is planning.",
    requiredMissionWins: 205,
  },
  "Mission 206": {
    Characters: ["jahntow", "zuark"],
    Title: "Victory and Aftermath 2",
    Message:
      "They try to make him a king, of course. Every tribe has a word for it and Jahntow refuses them all - gently, completely - until the elders settle on the only title he will answer to, the one the Xictlian matriarch gave him years ago at a temple gate: son of the desert. Hero of the tribes. He carries it the way he carries the losses that bought it - Ava's name is spoken at every fire, and he makes sure the true story travels with it: that the war was won by a daughter's love laid down twenty years deep, where no corporation could audit it.",
    requiredMissionWins: 206,
  },
  "Mission 207": {
    Characters: ["jahntow", "zuark"],
    Title: "Victory and Aftermath 3",
    Message:
      "The mourning is done the way each land does it. The desert speaks the names of its dead into a dawn wind. The mountains stack a cairn with a stone from every clan. The forest plants the Mage's kept count - a grove of them, one tree for every leaf of the tally. And in the tree city of Xiaojia, beside her mother at last, they bury Ava with a Pandaling keeping vigil on the branch above, which no one arranged and no one disturbs. Zerrok stands at the grave until the stars come out. What becomes of him, the tribes have already decided - and Jahntow's verdict travels with his name.",
    requiredMissionWins: 207,
  },
  "Mission 208": {
    Characters: ["jahntow", "zuark"],
    Title: "Victory and Aftermath 4",
    Message:
      "Then Zephyr does what Zephyr has always done best: it grows back. The spires come down and their alloy becomes bridges. The mine lattice is sealed with honors by Titan engineers, and the glacier rivers run clear into their second year. Namarupan children are taught, first thing, the difference between a thought and a whisper. And across every land Vortex burned, teams walk the dead ground singing the regrowth rites - taught now in five accents, from the notes of a desert-son who learned them in a jungle. The united tribes pledge it in the Circle of Cairns: this world, whole, held, never again for sale.",
    requiredMissionWins: 208,
  },
  "Mission 209": {
    Characters: ["jahntow", "zuark"],
    Title: "Victory and Aftermath 5",
    Message:
      "On the first anniversary they stand together on the fortress's crown - a museum now, its glass walls looking down on green - the whole strange family the war assembled: Zu'ark and Veran, Axenthon, Binru and Zhenwu, Kazon with all five clans' knots on his belt, the Emerald Mage older and satisfied, Zhalia with her city's freed voice behind her. E.C.H.O. archives the moment without being asked. The sun goes down on a world with one era ending in its light and another already growing, and Zu'ark leans on the rail beside Jahntow the way she did on a city gate, a war ago. \"Well, desert-son,\" she says. \"What shall we do with all this peace?\"",
    requiredMissionWins: 209,
  },
  "Mission 210": {
    Characters: ["jahntow", "zuark"],
    Title: "Peace Restored",
    Message:
      "Peace is restored to Zephyr - truly restored: wells unwatched, forests loud, mountains whole, minds their own. The story the tribes tell begins with a boy the sky gave to the desert, and it does not end here, because the best stories never quite do. But it rests here. You have carried it the whole way. Congratulations, champion of the united tribes - Zephyr remembers.",
    requiredMissionWins: 210,
  },
};

// ==========================================================================
// CHARACTER DOSSIERS - shown when a portrait is tapped in the story tab.
// Spoiler-safe by design: each bio only says what a player would know by
// the character's first appearance (firstWin gates when the dossier
// unlocks). The big reveals stay in the beats where they belong.
// ==========================================================================

const CHARACTER_LORE = {
  jahntow: {
    name: "Jahntow",
    epithet: "Son of the Desert",
    faction: "All tribes",
    firstWin: 0,
    bio:
      "The sky gave him to Zephyr in a burning escape pod and the desert did the rest. Raised in the wastes outside the Xictlian city, he grew up belonging to no tribe and welcome at most fires - which turns out to be exactly what a divided world needs. He does not give speeches. He shows up, and keeps showing up, until showing up has a name.",
  },
  echo: {
    name: "E.C.H.O.",
    epithet: "The voice in his ear",
    faction: "The escape pod",
    firstWin: 0,
    bio:
      "The emergency intelligence that flew Jahntow's pod down is the only thing that survived the crash with him. Two decades of self-patching have left it dry as vacuum and loyal as gravity. It plans the operations, reads the manifests, counts the odds - and never, ever says them out loud unless asked.",
  },
  zuark: {
    name: "Zu'ark",
    epithet: "First friend, first blade",
    faction: "Xictlians",
    firstWin: 1,
    bio:
      "Outrider of the Xictlian city and the first person on Zephyr who decided the sky-orphan was hers to look after. Grin first, questions after, bow always strung. She has followed Jahntow from the desert wells to the edge of the map, and if the war has a beginning, it is the moment she looked at a cracked drone chip and asked how many more.",
  },
  veran: {
    name: "Veran",
    epithet: "The rider on the salt road",
    faction: "Xictlians",
    firstWin: 5,
    bio:
      "Zu'ark's brother, and the calmer half of the family - a caravan-runner who knows every well, cistern and smuggler's cut in the wastes. He measures danger by whether it is worth galloping for. The day he galloped into the city with news of the burned caravan, the desert war stopped being a rumor.",
  },
  axenthon: {
    name: "Axenthon",
    epithet: "The patient knife of Luxor",
    faction: "Luxorians",
    firstWin: 30,
    bio:
      "By the time Jahntow crossed the mountains, Axenthon had been fighting Vortex in the golden lowlands for years - alone, unhurried, and entirely unregistered in any corporate database. He fights the way he talks: rarely, precisely, and only when it counts. Luxor has no army. It has him.",
  },
  elderBinru: {
    name: "Elder Binru",
    epithet: "The one who watched",
    faction: "Xiaojians",
    firstWin: 60,
    bio:
      "The eldest voice of the forest tribe speaks so softly the leaves lean in - and spent a season memorizing every camera's blind arc and every guard's bad habit before anyone thought to ask him for help. Binru believes proof moves the world where anger cannot. He is usually right, which is the most dangerous thing about him.",
  },
  ava: {
    name: "Ava",
    epithet: "The rebel in the canopy",
    faction: "Xiaojians",
    firstWin: 65,
    bio:
      "Leader of the canopy rebels: sharp-eyed, unsmiling, younger than her reputation and harder than her years. She wears her Vortex past openly, like a scar she refuses to hide, and trusts exactly as far as she can verify. Her fighters would follow her off the edge of the map - mostly because she would already be there, holding the rope.",
  },
  masterZhenwu: {
    name: "Master Zhenwu",
    epithet: "Keeper of the dragonbone wings",
    faction: "Xiaojians",
    firstWin: 75,
    bio:
      "Master of the high monastery and keeper of weapons older than Vortex's whole civilization - gliders framed in dragonbone, silent as owl wings. Zhenwu descends from the peaks only when the sky itself needs defending. He bows to very few things. The forest is one. What Jahntow becomes is, eventually, another.",
  },
  zerrok: {
    name: "Zerrok",
    epithet: "The commander who walked out",
    faction: "Vortex - defected",
    firstWin: 81,
    bio:
      "A high commander of Vortex who did the one thing the corporation has no procedure for: he stopped. His defection cost him everything a company man owns and bought the tribes their first look inside the machine. Some around the fires never stopped watching him. Twenty years inside a thing leaves marks - and not all marks are visible.",
  },
  kazon: {
    name: "Kazon",
    epithet: "The mountain that walks",
    faction: "Titans",
    firstWin: 90,
    bio:
      "A Titan warrior built like the country he defends, first met wearing a Vortex tracker's snapped collar as a trophy. Kazon speaks for the mountain clans the way an avalanche speaks for the mountain - infrequently, decisively, and with lasting effect. He rates people by what they do about the bleeding ranges. Jahntow, he decided early, does enough.",
  },
  emeraldMage: {
    name: "The Emerald Mage",
    epithet: "The forest's answer",
    faction: "Tuathans",
    firstWin: 120,
    bio:
      "Robed in living moss, eyes the color of deep canopy, the Mage appears out of tree-shadow as if the shadow had opinions - and it usually does. The order the Mage serves has tended Tuatha's jungle since before names were written down. The forest does not follow the Mage. It is more accurate to say they have an understanding.",
  },
  zhalia: {
    name: "Zhalia",
    epithet: "The mind Vortex missed",
    faction: "Namarupians",
    firstWin: 150,
    bio:
      "A psychic of Namarupa, the city of bowed heads, hiding in plain sight behind a commuter's coat and perfect corporate calm. Zhalia spent years pretending to be exactly as suppressed as her neighbors while mapping the machine that suppressed them. When her city finally woke, it was because she had already drawn it a map of the morning after.",
  },
  xaezor: {
    name: "Xaezor",
    epithet: "The man at the black desk",
    faction: "Vortex Corporation",
    firstWin: 200,
    bio:
      "Chief executive, warlord, and sole proprietor of the war for Zephyr. Taller than his portraits, older than his voice, with power braided around him that no balance sheet explains. Every burned caravan, every silenced mind, every scar on every land signs its work with his name - and he has never once considered it a crime. Ambition, he would call it. Vision.",
  },
};

// ==========================================================================
// CHOICE CALLBACKS - the story remembers what you chose. Keyed by the win
// index of the beat each callback attaches to; the line renders as a short
// epilogue paragraph under that beat, picked by the option recorded in
// player.storyChoices. Attach points sit just after each choice unlocks -
// except the Tuathan one, which waits for the moment it will hurt.
// ==========================================================================

const CHOICE_CALLBACKS = {
  31: {
    choice: "xictlian-tribute",
    lines: {
      accept:
        "The tribute is already at work: the crates they hide among tonight were bought with Xictlian credits, and the forged manifests smell faintly of desert ink.",
      refuse:
        "Word of the refused tribute crossed the mountains ahead of them. Twice tonight, camp workers who owe Jahntow nothing look straight through the intruders and say nothing at all.",
    },
  },
  61: {
    choice: "luxorian-mercenaries",
    lines: {
      raiders:
        "Half the guard posts stand empty tonight - Vortex pulled security east to chase a free company that keeps eating its convoys. Ava's mercenaries, paying their first dividend.",
      guards:
        "News travels even under the canopy: the temples of Luxor stand guarded by Vortex's own deserters. \"Proof the machine's people can turn,\" Binru murmurs, and watches Jahntow differently after that.",
    },
  },
  91: {
    choice: "xiaojian-heartseed",
    lines: {
      armor:
        "Under his coat Jahntow wears the Heartseed's gift, and through the long freezing day on the ledge the living armor keeps his blood warm - the forest guarding him from a country away.",
      grove:
        "Zhenwu's message finds him on the high trail: the grove has closed over the Heartseed and put out new growth for the first time in a century. Kazon grunts approval. \"Roots first. Then teeth.\"",
    },
  },
  121: {
    choice: "titan-forge",
    lines: {
      blades:
        "A Titan-forged plasma blade rides at Jahntow's back tonight. The Mage eyes it once and nods. \"Mountain iron in forest shade. The lands are already fighting together.\"",
      refugees:
        "The column they passed at the jungle's edge walks armed now - Titan steel, Jahntow's doing - and for the first time the refugees look less like people fleeing and more like people returning.",
    },
  },
  193: {
    choice: "tuathan-rites",
    lines: {
      stockpile:
        "Jahntow tears through his kit for a Tuathan salve, and it is not enough - was never going to be enough. The stockpile bought the war a fortune. It cannot buy back one heartbeat.",
      rite:
        "Jahntow's hands are already moving through the regrowth rite the order taught him under the canopy - and the rite takes hold, and it is still not enough. It was made for forests. Some things fall too fast to grow back.",
    },
  },
  198: {
    choice: "namarupian-broadcast",
    lines: {
      broadcast:
        "The tribes came because of the heartbeat Zhalia gave them - every mind on Zephyr felt the amplifier die, and every tribe knew from that moment the fortress could bleed. Today they arrive already believing.",
      silent:
        "The war chest that armed those five banners was fattened by Vortex's own bounty offices - blood money claimed in a dust cloak, spent on the army now coming to collect the rest.",
    },
  },
  206: {
    choice: "zerrok-verdict",
    lines: {
      spare:
        "Zerrok serves his sentence in the open where everyone can see: rebuilding, plank by plank, the things he burned. Some days a Xiaojian child brings him water. Mercy, it turns out, travels further than fear ever did.",
      condemn:
        "Zerrok's seized accounts rebuilt three villages and stocked a winter's worth of clinics. The tribes still argue quietly about the verdict, and Jahntow lets them. Ava's name is not an argument. It is the reason.",
    },
  },
};

export { storyMissionArc, CHARACTER_LORE, CHOICE_CALLBACKS };
