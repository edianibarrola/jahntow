"""
Server-side game data catalog: the single source of truth for item, mission,
property, and equipment definitions. Ported from the values that used to
live only in src/front/js/store/flux.js (items_data, missionsData,
propertiesData, equipmentItems, healthRecoveryItems, storyMissionsData).

The frontend fetches this via GET /api/game-data and never defines these
values itself anymore -- it just renders whatever the backend returns, so
every player always sees identical prices, mission rewards, and costs.

"Current Cost" fields from the original frontend data were dropped here:
item/property/equipment prices are no longer static per-catalog-entry
values duplicated into a per-player copy. Market item prices are computed
by the backend from "Base Cost" (see market.py); property and equipment
prices never fluctuated in the original game despite having a
"Current Cost" field, so they're just BASE_COST here.
"""

ITEMS = {'Energy Cores': {'Alpha Core': {'Base Cost': 50, 'Rank': 1},
                  'Fusion Core': {'Base Cost': 158, 'Rank': 5},
                  'Omega Core': {'Base Cost': 50000, 'Rank': 25}},
 'Nanomaterials': {'NanoMesh': {'Base Cost': 100, 'Rank': 1},
                   'HyperWeave': {'Base Cost': 259, 'Rank': 5},
                   'Quantum Fabric': {'Base Cost': 100000, 'Rank': 30}},
 'Cybernetic Implants': {'NeuroLink': {'Base Cost': 200, 'Rank': 1},
                         'SynthArm': {'Base Cost': 1245, 'Rank': 10},
                         'OmegaBrain': {'Base Cost': 200000, 'Rank': 35}},
 'Quantum Data Cubes': {'Data Shard': {'Base Cost': 300, 'Rank': 1},
                        'Quantum Node': {'Base Cost': 3581, 'Rank': 15},
                        'Infinity Matrix': {'Base Cost': 300000, 'Rank': 40}},
 'Advanced Medicines': {'BioPatch': {'Base Cost': 400, 'Rank': 1},
                        'NanoSyringe': {'Base Cost': 3603, 'Rank': 15},
                        'RegenGen': {'Base Cost': 400000, 'Rank': 45}},
 'Quantum Encryption Keys': {'Cryptex': {'Base Cost': 500, 'Rank': 1},
                             'Quantum Lock': {'Base Cost': 7282, 'Rank': 20},
                             'Omega Seal': {'Base Cost': 500000, 'Rank': 50}}}


MISSIONS = {'Salvage Run': {'Required Credits': 0,
                 'Required Energy': 6,
                 'Reward': 260,
                 'Experience': 15,
                 'Rank': 1,
                 'requiredEquipment': {},
                 'Health Effect': 0,
                 'startMessage': 'E.c.h.o.: Running the scrap lanes. It '
                                 'barely pays, but it will keep us flying '
                                 'until we can afford real work.',
                 'successMessage': 'E.c.h.o.: Debris collected and sold '
                                   'on. {reward} credits and {experience} '
                                   'experience.',
                 'failureMessage': 'E.c.h.o.: Nothing salvageable out '
                                   'there this pass.',
                 'Guaranteed': True,
                 'AvailableBelowCredits': 2000},
 'Asteroid Mining': {'Required Credits': 1000,
                     'Required Energy': 10,
                     'Reward': 3200,
                     'Experience': 40,
                     'Rank': 1,
                     'requiredEquipment': {'Spectral Analyzer': 1},
                     'Health Effect': 7,
                     'startMessage': 'E.c.h.o.: Heading towards the '
                                     'asteroid belt for mining operations.',
                     'successMessage': 'E.c.h.o.: Successfully mined '
                                       'precious resources from the '
                                       'asteroid, gaining {reward} credits '
                                       'and {experience} experience.',
                     'failureMessage': 'E.c.h.o.: Mining operations were '
                                       'not successful. Better luck next '
                                       'time.'},
 'Space Salvage': {'Required Credits': 1500,
                   'Required Energy': 12,
                   'Reward': 4730,
                   'Experience': 120,
                   'Rank': 3,
                   'requiredEquipment': {'Environmental Suit': 1},
                   'Health Effect': 8,
                   'startMessage': 'E.c.h.o.: Scanning space debris for '
                                   'valuable salvage.',
                   'successMessage': 'E.c.h.o.: Salvage successful. '
                                     'Recovered items translated to '
                                     '{reward} credits and {experience} '
                                     'experience.',
                   'failureMessage': 'E.c.h.o.: Salvage mission was '
                                     'unsuccessful. Nothing of value '
                                     'found.'},
 'Alien Artifact Retrieval': {'Required Credits': 2200,
                              'Required Energy': 14,
                              'Reward': 6401,
                              'Experience': 240,
                              'Rank': 6,
                              'requiredEquipment': {'Alien Skin Armor': 1},
                              'Health Effect': 10,
                              'startMessage': 'E.c.h.o.: Setting '
                                              'coordinates to a rumored '
                                              'alien artifact location.',
                              'successMessage': 'E.c.h.o.: Artifact '
                                                'retrieved successfully, '
                                                'granting you {reward} '
                                                'credits and {experience} '
                                                'experience.',
                              'failureMessage': 'E.c.h.o.: The mission to '
                                                'retrieve the alien '
                                                'artifact failed. It seems '
                                                'we were not the only ones '
                                                'after it.'},
 'Galactic Trading': {'Required Credits': 3000,
                      'Required Energy': 16,
                      'Reward': 9045,
                      'Experience': 320,
                      'Rank': 8,
                      'requiredEquipment': {'Hover Board': 1,
                                            'Spectral Analyzer': 1},
                      'requiredSupplies': {'NeuroLink': 1},
                      'Health Effect': 11,
                      'startMessage': 'E.c.h.o.: Initiating trading '
                                      'protocols with neighboring galactic '
                                      'entities.',
                      'successMessage': 'E.c.h.o.: Trade successful. The '
                                        'profits earned you {reward} '
                                        'credits and {experience} '
                                        'experience.',
                      'failureMessage': 'E.c.h.o.: The trade negotiation '
                                        'failed. No profits this time.'},
 'Deep Space Exploration': {'Required Credits': 4000,
                            'Required Energy': 18,
                            'Reward': 12520,
                            'Experience': 400,
                            'Rank': 10,
                            'requiredEquipment': {'Basic Ship': 2},
                            'requiredSupplies': {'NanoMesh': 1,
                                                 'Alpha Core': 3},
                            'Health Effect': 13,
                            'startMessage': 'E.c.h.o.: Preparing for a '
                                            'deep-space exploration '
                                            'mission to uncharted '
                                            'territories.',
                            'successMessage': 'E.c.h.o.: Exploration '
                                              'successful. New regions '
                                              'charted and you earned '
                                              '{reward} credits and '
                                              '{experience} experience.',
                            'failureMessage': 'E.c.h.o.: The exploration '
                                              'mission faced unforeseen '
                                              'challenges. No new data '
                                              'collected.'},
 'Starship Racing': {'Required Credits': 5200,
                     'Required Energy': 19,
                     'Reward': 16063,
                     'Experience': 480,
                     'Rank': 12,
                     'requiredEquipment': {'Star Ship': 1,
                                           'Environmental Suit': 1},
                     'requiredSupplies': {'Data Shard': 2},
                     'Health Effect': 14,
                     'startMessage': 'E.c.h.o.: Enrolling in the '
                                     'intergalactic starship racing event.',
                     'successMessage': 'E.c.h.o.: You won the race! '
                                       'Credited {reward} credits and '
                                       '{experience} experience for your '
                                       'performance.',
                     'failureMessage': 'E.c.h.o.: It was a tough race. '
                                       "Didn't make it to the top this "
                                       'time.'},
 'Rescue Operation': {'Required Credits': 6500,
                      'Required Energy': 21,
                      'Reward': 20958,
                      'Experience': 560,
                      'Rank': 14,
                      'requiredEquipment': {'Scout Drone': 2,
                                            'Environmental Suit': 2,
                                            'Oxygen Rebreather': 2},
                      'requiredSupplies': {'HyperWeave': 1,
                                           'Data Shard': 1},
                      'Health Effect': 15,
                      'startMessage': 'E.c.h.o.: Picking up distress '
                                      'signals. Initiating rescue '
                                      'protocols.',
                      'successMessage': 'E.c.h.o.: Rescue successful! '
                                        "You've been credited with "
                                        '{reward} credits and {experience} '
                                        'experience.',
                      'failureMessage': 'E.c.h.o.: The rescue operation '
                                        'faced challenges. Not everyone '
                                        'made it back.'},
 'Black Hole Research': {'Required Credits': 8000,
                         'Required Energy': 23,
                         'Reward': 26098,
                         'Experience': 640,
                         'Rank': 16,
                         'requiredEquipment': {'Star Ship': 2,
                                               'Spectral Analyzer': 2},
                         'requiredSupplies': {'HyperWeave': 1,
                                              'NeuroLink': 2},
                         'Health Effect': 17,
                         'startMessage': 'E.c.h.o.: Approaching the event '
                                         'horizon for black hole research.',
                         'successMessage': 'E.c.h.o.: Data collected '
                                           'successfully. Your findings '
                                           'yielded {reward} credits and '
                                           '{experience} experience.',
                         'failureMessage': "E.c.h.o.: The black hole's "
                                           'gravity was stronger than '
                                           'anticipated. Research was '
                                           'compromised.'},
 'Celestial Diplomacy': {'Required Credits': 10000,
                         'Required Energy': 25,
                         'Reward': 34046,
                         'Experience': 720,
                         'Rank': 18,
                         'requiredEquipment': {'Holo Clone': 2,
                                               'Invisi Veil': 2},
                         'requiredSupplies': {'Data Shard': 1,
                                              'HyperWeave': 1},
                         'Health Effect': 18,
                         'startMessage': 'E.c.h.o.: Establishing '
                                         'communication channels for '
                                         'diplomatic discussions with '
                                         'alien civilizations.',
                         'successMessage': 'E.c.h.o.: Diplomacy '
                                           'successful. Established '
                                           'friendly relations and earned '
                                           '{reward} credits and '
                                           '{experience} experience.',
                         'failureMessage': 'E.c.h.o.: The diplomatic '
                                           'mission did not go as planned. '
                                           'The aliens were not '
                                           'receptive.'},
 'Galaxy Defense': {'Required Credits': 12000,
                    'Required Energy': 26,
                    'Reward': 40990,
                    'Experience': 800,
                    'Rank': 20,
                    'requiredEquipment': {'Cyber Armor': 3,
                                          'Interdimensional Cruiser': 2},
                    'requiredSupplies': {'HyperWeave': 2, 'NeuroLink': 2},
                    'Health Effect': 20,
                    'startMessage': 'E.c.h.o.: Alert! Hostile forces '
                                    'detected. Preparing for defense.',
                    'successMessage': 'E.c.h.o.: Galaxy successfully '
                                      'defended. Your bravery has earned '
                                      'you {reward} credits and '
                                      '{experience} experience.',
                    'failureMessage': 'E.c.h.o.: The galaxy defense was '
                                      'challenging. Some areas suffered '
                                      'damage.'},
 'Quantum Mechanics Mastery': {'Required Credits': 14500,
                               'Required Energy': 28,
                               'Reward': 51661,
                               'Experience': 880,
                               'Rank': 22,
                               'requiredEquipment': {'Teleporter Beacon': 3},
                               'requiredSupplies': {'BioPatch': 2},
                               'Health Effect': 21,
                               'startMessage': 'E.c.h.o.: Initiating deep '
                                               'dive into quantum '
                                               'mechanics.',
                               'successMessage': 'E.c.h.o.: Successfully '
                                                 'mastered quantum '
                                                 'mechanics! Earned '
                                                 '{reward} credits and '
                                                 '{experience} experience.',
                               'failureMessage': 'E.c.h.o.: Quantum '
                                                 'Mechanics is perplexing. '
                                                 "Couldn't completely "
                                                 'grasp the concept.'},
 'Interstellar Exploration': {'Required Credits': 17500,
                              'Required Energy': 30,
                              'Reward': 64915,
                              'Experience': 960,
                              'Rank': 24,
                              'requiredEquipment': {'Cyber Armor': 3,
                                                    'Porta Lab': 3,
                                                    'Plasma Blade': 2},
                              'requiredSupplies': {'Cryptex': 3},
                              'Health Effect': 22,
                              'startMessage': 'E.c.h.o.: Setting course '
                                              'for uncharted territories '
                                              'in the interstellar realm.',
                              'successMessage': 'E.c.h.o.: Exploration '
                                                'successful! Discovered '
                                                'new systems and earned '
                                                '{reward} credits and '
                                                '{experience} experience.',
                              'failureMessage': 'E.c.h.o.: The uncharted '
                                                'territories proved '
                                                'challenging. Exploration '
                                                'was not fully '
                                                'successful.'},
 'Temporal Anomaly Research': {'Required Credits': 21000,
                               'Required Energy': 32,
                               'Reward': 79351,
                               'Experience': 1040,
                               'Rank': 26,
                               'requiredEquipment': {'Porta Lab': 3,
                                                     'Terrain Scanner': 3},
                               'requiredSupplies': {'Cryptex': 2,
                                                    'Data Shard': 3},
                               'Health Effect': 24,
                               'startMessage': 'E.c.h.o.: Detected a '
                                               'temporal anomaly. '
                                               'Commencing research.',
                               'successMessage': 'E.c.h.o.: Successfully '
                                                 'researched the temporal '
                                                 'anomaly! Rewarded '
                                                 '{reward} credits and '
                                                 '{experience} experience.',
                               'failureMessage': 'E.c.h.o.: The temporal '
                                                 'anomaly was unstable. '
                                                 'Research faced '
                                                 'setbacks.'},
 'Galactic Archaeology': {'Required Credits': 25000,
                          'Required Energy': 34,
                          'Reward': 98157,
                          'Experience': 1120,
                          'Rank': 28,
                          'requiredEquipment': {'Porta Lab': 3,
                                                'Terrain Scanner': 3,
                                                'Bio Collector': 3},
                          'requiredSupplies': {'BioPatch': 2,
                                               'Data Shard': 3},
                          'Health Effect': 25,
                          'startMessage': 'E.c.h.o.: Embarking on a quest '
                                          'to uncover the mysteries of '
                                          'ancient galactic civilizations.',
                          'successMessage': 'E.c.h.o.: Successful '
                                            'excavation! Unearthed '
                                            'artifacts worth {reward} '
                                            'credits and {experience} '
                                            'experience.',
                          'failureMessage': 'E.c.h.o.: The ruins were '
                                            'labyrinthine and perplexing. '
                                            'Some artifacts remain '
                                            'elusive.'},
 'Universe Origins Study': {'Required Credits': 30000,
                            'Required Energy': 35,
                            'Reward': 118814,
                            'Experience': 1200,
                            'Rank': 30,
                            'requiredEquipment': {'Cyber Armor': 4,
                                                  'Plasma Blade': 4,
                                                  'Interdimensional Cruiser': 4},
                            'requiredSupplies': {'Cryptex': 3,
                                                 'SynthArm': 1},
                            'Health Effect': 27,
                            'startMessage': 'E.c.h.o.: Launching probe to '
                                            'research the origins of the '
                                            'universe.',
                            'successMessage': 'E.c.h.o.: Significant '
                                              'discoveries made! Earned '
                                              '{reward} credits and '
                                              '{experience} experience.',
                            'failureMessage': 'E.c.h.o.: The vastness of '
                                              'the universe is '
                                              'overwhelming. Some '
                                              'mysteries remain unsolved.'},
 'Exodimensional Expedition': {'Required Credits': 35000,
                               'Required Energy': 37,
                               'Reward': 143834,
                               'Experience': 1280,
                               'Rank': 32,
                               'requiredEquipment': {'Invisi Veil': 4,
                                                     'Teleporter Beacon': 4,
                                                     'Terrain Scanner': 2},
                               'requiredSupplies': {'Cryptex': 3},
                               'Health Effect': 28,
                               'startMessage': 'E.c.h.o.: Preparing to '
                                               'venture into '
                                               'exodimensions. Unknown '
                                               'challenges await.',
                               'successMessage': 'E.c.h.o.: Successfully '
                                                 'navigated the '
                                                 'exodimensions! Secured '
                                                 '{reward} credits and '
                                                 '{experience} experience.',
                               'failureMessage': 'E.c.h.o.: The '
                                                 'exodimensions are '
                                                 'unpredictable. Could not '
                                                 'complete the mission.'},
 'Dark Matter Manipulation': {'Required Credits': 41000,
                              'Required Energy': 39,
                              'Reward': 174585,
                              'Experience': 1360,
                              'Rank': 34,
                              'requiredEquipment': {'Teleporter Beacon': 4,
                                                    'Interdimensional Cruiser': 4,
                                                    'Porta Lab': 3},
                              'requiredSupplies': {'SynthArm': 3},
                              'Health Effect': 29,
                              'startMessage': 'E.c.h.o.: Initiating '
                                              'procedures to manipulate '
                                              'dark matter.',
                              'successMessage': 'E.c.h.o.: Dark matter '
                                                'manipulation successful! '
                                                'Acquired {reward} credits '
                                                'and {experience} '
                                                'experience.',
                              'failureMessage': 'E.c.h.o.: Failed to '
                                                'control the elusive dark '
                                                'matter. Mission aborted.'},
 'Galactic Diplomacy': {'Required Credits': 48000,
                        'Required Energy': 41,
                        'Reward': 208301,
                        'Experience': 1440,
                        'Rank': 36,
                        'requiredEquipment': {'Invisi Veil': 4},
                        'requiredSupplies': {'NanoSyringe': 1},
                        'Health Effect': 31,
                        'startMessage': 'E.c.h.o.: Engaging in diplomatic '
                                        'talks with advanced '
                                        'extraterrestrial civilizations.',
                        'successMessage': 'E.c.h.o.: Diplomacy successful! '
                                          'Strengthened interstellar ties '
                                          'and earned {reward} credits and '
                                          '{experience} experience.',
                        'failureMessage': 'E.c.h.o.: Diplomatic talks were '
                                          'challenging. Not all objectives '
                                          'achieved.'},
 'Void Phenomenon Analysis': {'Required Credits': 56000,
                              'Required Energy': 42,
                              'Reward': 245495,
                              'Experience': 1520,
                              'Rank': 38,
                              'requiredEquipment': {'Porta Lab': 4,
                                                    'Cyber Armor': 3,
                                                    'Teleporter Beacon': 4},
                              'requiredSupplies': {'BioPatch': 3,
                                                   'Cryptex': 3},
                              'Health Effect': 32,
                              'startMessage': 'E.c.h.o.: Commencing '
                                              'analysis of mysterious void '
                                              'phenomena.',
                              'successMessage': 'E.c.h.o.: Analysis '
                                                'complete! Deciphered void '
                                                'secrets and obtained '
                                                '{reward} credits and '
                                                '{experience} experience.',
                              'failureMessage': 'E.c.h.o.: The void '
                                                'remains enigmatic. '
                                                'Analysis was '
                                                'inconclusive.'},
 'Cosmic Nexus Activation': {'Required Credits': 65000,
                             'Required Energy': 44,
                             'Reward': 294674,
                             'Experience': 1600,
                             'Rank': 40,
                             'requiredEquipment': {'Teleporter Beacon': 4,
                                                   'Bio Collector': 5,
                                                   'Cyber Armor': 4},
                             'requiredSupplies': {'SynthArm': 2,
                                                  'BioPatch': 3},
                             'Health Effect': 34,
                             'startMessage': 'E.c.h.o.: Initiating '
                                             'protocols to activate the '
                                             'cosmic nexus.',
                             'successMessage': 'E.c.h.o.: Cosmic Nexus '
                                               'activated! Gained {reward} '
                                               'credits and {experience} '
                                               'experience.',
                             'failureMessage': 'E.c.h.o.: The cosmic nexus '
                                               'proved too complex. '
                                               'Activation failed.'},
 'Temporal Loop Investigation': {'Required Credits': 75000,
                                 'Required Energy': 46,
                                 'Reward': 351196,
                                 'Experience': 1680,
                                 'Rank': 42,
                                 'requiredEquipment': {'Hover Board': 5,
                                                       'Invisi Veil': 5,
                                                       'Alien Skin Armor': 5,
                                                       'Basic Ship': 5},
                                 'requiredSupplies': {'SynthArm': 2,
                                                      'BioPatch': 3},
                                 'Health Effect': 35,
                                 'startMessage': 'E.c.h.o.: Preparing to '
                                                 'investigate disturbances '
                                                 'in the temporal loop.',
                                 'successMessage': 'E.c.h.o.: Temporal '
                                                   'loop stabilized! '
                                                   'Retrieved {reward} '
                                                   'credits and '
                                                   '{experience} '
                                                   'experience.',
                                 'failureMessage': 'E.c.h.o.: Time '
                                                   'anomalies detected. '
                                                   'Investigation proved '
                                                   'challenging.'},
 'Nebular Storm Navigation': {'Required Credits': 86000,
                              'Required Energy': 47,
                              'Reward': 406844,
                              'Experience': 1760,
                              'Rank': 44,
                              'requiredEquipment': {'Jet Pack': 5,
                                                    'Steel Machete': 5,
                                                    'Basic Ship': 5,
                                                    'Oxygen Rebreather': 5},
                              'requiredSupplies': {'NanoSyringe': 2},
                              'Health Effect': 36,
                              'startMessage': 'E.c.h.o.: Initiating '
                                              'navigation through a '
                                              'tumultuous nebular storm.',
                              'successMessage': 'E.c.h.o.: Successfully '
                                                'navigated the storm! '
                                                'Acquired {reward} credits '
                                                'and {experience} '
                                                'experience.',
                              'failureMessage': 'E.c.h.o.: Nebular '
                                                'turbulence too intense. '
                                                'Navigation unsuccessful.'},
 'Celestial Artifact Retrieval': {'Required Credits': 98000,
                                  'Required Energy': 50,
                                  'Reward': 482073,
                                  'Experience': 1840,
                                  'Rank': 46,
                                  'requiredEquipment': {'Hover Board': 4,
                                                        'Jet Pack': 5,
                                                        'Plasma Blade': 5,
                                                        'Environmental Suit': 5},
                                  'requiredSupplies': {'SynthArm': 3,
                                                       'NanoSyringe': 1},
                                  'Health Effect': 38,
                                  'startMessage': 'E.c.h.o.: Mission is to '
                                                  'retrieve a rare '
                                                  'celestial artifact from '
                                                  'an ancient site.',
                                  'successMessage': 'E.c.h.o.: Artifact '
                                                    'secured! Obtained '
                                                    '{reward} credits and '
                                                    '{experience} '
                                                    'experience.',
                                  'failureMessage': 'E.c.h.o.: Artifact '
                                                    'retrieval mission '
                                                    'faced unforeseen '
                                                    'challenges.'},
 'Supernova Containment': {'Required Credits': 110000,
                           'Required Energy': 51,
                           'Reward': 546722,
                           'Experience': 1920,
                           'Rank': 48,
                           'requiredEquipment': {'Cyber Armor': 5,
                                                 'Interdimensional Cruiser': 5,
                                                 'Teleporter Beacon': 5,
                                                 'Spectral Analyzer': 5},
                           'requiredSupplies': {'NanoSyringe': 1,
                                                'SynthArm': 3},
                           'Health Effect': 39,
                           'startMessage': 'E.c.h.o.: Attempting to '
                                           'contain the imminent supernova '
                                           'and harness its energy.',
                           'successMessage': 'E.c.h.o.: Supernova '
                                             'successfully contained! '
                                             '{reward} credits and '
                                             '{experience} experience '
                                             'gained.',
                           'failureMessage': 'E.c.h.o.: Supernova '
                                             'containment measures failed. '
                                             'Energy release was '
                                             'catastrophic.'},
 'Black Hole Mapping': {'Required Credits': 124000,
                        'Required Energy': 53,
                        'Reward': 634795,
                        'Experience': 2000,
                        'Rank': 50,
                        'requiredEquipment': {'Interdimensional Cruiser': 5,
                                              'Teleporter Beacon': 6,
                                              'Spectral Analyzer': 6,
                                              'Scout Drone': 6,
                                              'Bio Collector': 5,
                                              'Cyber Armor': 6},
                        'requiredSupplies': {'SynthArm': 3, 'Cryptex': 3},
                        'Health Effect': 41,
                        'startMessage': 'E.c.h.o.: Launching probes to map '
                                        'the event horizon of a black '
                                        'hole.',
                        'successMessage': 'E.c.h.o.: Successful mapping! '
                                          'Collected valuable data and '
                                          '{reward} credits along with '
                                          '{experience} experience.',
                        'failureMessage': 'E.c.h.o.: Probes lost to the '
                                          'gravitational pull. Black hole '
                                          'mapping unsuccessful.'}}

STORY_MISSIONS = {'Rogue Drone Takedown': {'Required Credits': 2040,
                          'Required Energy': 10,
                          'Reward': 4080,
                          'Experience': 40,
                          'Rank': 1,
                          'Faction': 'Xictlians',
                          'requiredEquipment': {'Alien Ally': 1},
                          'Health Effect': 4,
                          'startMessage': 'E.C.H.O.: Corporate-signature '
                                          'drones over the water lines, '
                                          'Jahntow. Not scouting the city '
                                          'anymore - mapping everything '
                                          'the tribe needs to live. Bring '
                                          'one down. The Xictlians will '
                                          'want to see what watches them.',
                          'successMessage': 'E.C.H.O.: Drone down, chip '
                                            'recovered. The elders are '
                                            'looking at their own sky '
                                            'differently now. {reward} '
                                            'credits, {experience} '
                                            'experience.',
                          'failureMessage': 'E.C.H.O.: The flock scattered '
                                            'before we could bring one '
                                            'down - and now they know we '
                                            'watch back. Regroup and try '
                                            'again.'},
 'Protect the Caravans': {'Required Credits': 3480,
                          'Required Energy': 11,
                          'Reward': 6960,
                          'Experience': 80,
                          'Rank': 2,
                          'Faction': 'Xictlians',
                          'requiredEquipment': {'Alien Ally': 1},
                          'Health Effect': 4,
                          'startMessage': 'E.C.H.O.: Veran found twelve '
                                          'wagons burned to their axles - '
                                          'nothing taken, water casks '
                                          'holed and left to drain. '
                                          'Someone wants the desert '
                                          'thirsty. The next caravan rolls '
                                          'at dawn. Be on it.',
                          'successMessage': 'E.C.H.O.: Caravan through, '
                                            'water intact, ambush declined '
                                            'the invitation. The salt '
                                            'roads breathe again. {reward} '
                                            'credits, {experience} '
                                            'experience.',
                          'failureMessage': 'E.C.H.O.: We lost wagons '
                                            'tonight. Every cask that '
                                            'drains into the sand is a '
                                            'village going thirsty. Again '
                                            '- faster this time.'},
 'Free Oases': {'Required Credits': 6360,
                'Required Energy': 14,
                'Reward': 12720,
                'Experience': 160,
                'Rank': 4,
                'Faction': 'Xictlians',
                'requiredEquipment': {'Alien Ally': 1},
                'Health Effect': 4,
                'startMessage': 'E.C.H.O.: Vortex has fenced the oases - '
                                'meters on the wells, guards on the water, '
                                'invoices to people drinking their own '
                                'springs. Cut the fences, Jahntow. Water '
                                'does not belong on a balance sheet.',
                'successMessage': 'E.C.H.O.: Fences down, meters scrap, '
                                  'water running free. Word travels '
                                  'well-to-well faster than any drone. '
                                  '{reward} credits, {experience} '
                                  'experience.',
                'failureMessage': 'E.C.H.O.: The oasis stays caged tonight '
                                  '- patrols doubled before we reached the '
                                  'pumps. The tribe is still paying to '
                                  'drink. Unacceptable.'},
 'Repel Invasions': {'Required Credits': 7800,
                     'Required Energy': 16,
                     'Reward': 15600,
                     'Experience': 200,
                     'Rank': 5,
                     'Faction': 'Xictlians',
                     'requiredEquipment': {'Alien Ally': 1},
                     'Health Effect': 4,
                     'startMessage': 'E.C.H.O.: Ground columns crossing '
                                     'the wastes - Vortex has stopped '
                                     'pretending this is commerce. The '
                                     'outriders are forming up, and they '
                                     'are asking for you by name.',
                     'successMessage': 'E.C.H.O.: Column broken and turned '
                                       'back into the wastes. The desert '
                                       'keeps what it catches. {reward} '
                                       'credits, {experience} experience.',
                     'failureMessage': 'E.C.H.O.: The line bent tonight '
                                       'and they hold ground they should '
                                       'never have touched. The outriders '
                                       'are regrouping. So are we.'},
 'Fortify Temples': {'Required Credits': 9240,
                     'Required Energy': 18,
                     'Reward': 18480,
                     'Experience': 240,
                     'Rank': 6,
                     'Faction': 'Xictlians',
                     'requiredEquipment': {'Alien Ally': 1},
                     'Health Effect': 4,
                     'startMessage': 'E.C.H.O.: The elders have opened the '
                                     'temples - walls that outlasted every '
                                     'empire that ever tried this desert. '
                                     'Help raise the defenses. Stone '
                                     'remembers what corporations forget.',
                     'successMessage': 'E.C.H.O.: Temple fortified - watch '
                                       'posts sighted, cisterns full, old '
                                       'walls answering for the first time '
                                       'in centuries. {reward} credits, '
                                       '{experience} experience.',
                     'failureMessage': 'E.C.H.O.: Work interrupted - we '
                                       'fell back before the defenses were '
                                       'set. The temple stands unfinished, '
                                       'and Vortex knows where it is.'},
 'Lead Sandstorm Offensives': {'Required Credits': 10680,
                               'Required Energy': 19,
                               'Reward': 21360,
                               'Experience': 280,
                               'Rank': 7,
                               'Faction': 'Xictlians',
                               'requiredEquipment': {'Alien Ally': 1},
                               'Health Effect': 4,
                               'startMessage': 'E.C.H.O.: The '
                                               'stormwatchers read three '
                                               'days of wall-cloud coming '
                                               'off the deep desert, and '
                                               'the tribe means to march '
                                               'inside it. You lead. '
                                               'Vortex sensors are blind '
                                               'in sand - introduce them '
                                               'to the desert properly.',
                               'successMessage': 'E.C.H.O.: Offensive '
                                                 'complete. Their outposts '
                                                 'opened to the storm and '
                                                 'the desert walked in. '
                                                 'Xictlia is clearing its '
                                                 'skies. {reward} credits, '
                                                 '{experience} experience.',
                               'failureMessage': 'E.C.H.O.: The storm '
                                                 'turned early and the '
                                                 'assault broke off - the '
                                                 'outposts still stand. '
                                                 'The stormwatchers are '
                                                 'already reading the sky '
                                                 'for our next window.'},
 'Infiltrate Vortex Camps': {'Required Credits': 12120,
                             'Required Energy': 21,
                             'Reward': 24240,
                             'Experience': 320,
                             'Rank': 8,
                             'Faction': 'Luxorians',
                             'requiredEquipment': {'Alien Ally': 1},
                             'Health Effect': 4,
                             'startMessage': 'E.C.H.O.: Axenthon has '
                                             'mapped the labor camps of '
                                             'Luxor - no fences, just '
                                             'debts. Get inside and lift '
                                             'their rosters and manifests. '
                                             'I want to know what PROJECT '
                                             'means to these people.',
                             'successMessage': 'E.C.H.O.: In and out '
                                               'before the watch changed. '
                                               'Rosters, manifests, and '
                                               'one word that keeps '
                                               'repeating: PROJECT. '
                                               '{reward} credits, '
                                               '{experience} experience.',
                             'failureMessage': 'E.C.H.O.: The perimeter '
                                               'tightened before we '
                                               'cleared the wire. The '
                                               'camps keep their secrets '
                                               'one more night. Axenthon '
                                               'is already re-planning.'},
 'Sabotage Supply Lines': {'Required Credits': 15000,
                           'Required Energy': 24,
                           'Reward': 30000,
                           'Experience': 400,
                           'Rank': 10,
                           'Faction': 'Luxorians',
                           'requiredEquipment': {'Steel Machete': 2},
                           'Health Effect': 5,
                           'startMessage': 'E.C.H.O.: Everything Vortex '
                                           'does in Luxor moves on three '
                                           'convoy roads. Axenthon '
                                           'proposes we make the roads '
                                           'unprofitable. I concur. '
                                           'Precisely, quietly, '
                                           'repeatedly.',
                           'successMessage': 'E.C.H.O.: Convoy stopped '
                                             'where it stood. Their '
                                             'quartermasters are inventing '
                                             "new words for 'delayed'. "
                                             '{reward} credits, '
                                             '{experience} experience.',
                           'failureMessage': 'E.C.H.O.: The convoy got '
                                             'through - escorts heavier '
                                             'than the manifest promised. '
                                             'Freight that arrives is '
                                             'leverage they keep. Next '
                                             'road, next night.'},
 'Persuade Mercenaries to Defect': {'Required Credits': 16440,
                                    'Required Energy': 26,
                                    'Reward': 32880,
                                    'Experience': 440,
                                    'Rank': 11,
                                    'Faction': 'Luxorians',
                                    'requiredEquipment': {'Jet Pack': 1},
                                    'Health Effect': 6,
                                    'startMessage': 'E.C.H.O.: Vortex pays '
                                                    'its mercenaries badly '
                                                    'and trusts them '
                                                    "worse. Axenthon's "
                                                    'assessment: half '
                                                    'would walk if someone '
                                                    'offered them '
                                                    'somewhere to walk to. '
                                                    'Be the somewhere, '
                                                    'Jahntow.',
                                    'successMessage': 'E.C.H.O.: A whole '
                                                      'company came over - '
                                                      'armor, arms and '
                                                      'grudges included. '
                                                      'Vortex just paid to '
                                                      'train our newest '
                                                      'allies. {reward} '
                                                      'credits, '
                                                      '{experience} '
                                                      'experience.',
                                    'failureMessage': 'E.C.H.O.: Talks '
                                                      'collapsed - a '
                                                      'Vortex political '
                                                      'officer reached the '
                                                      'captains first. '
                                                      "They're not enemies "
                                                      "yet. They're not "
                                                      'friends tonight '
                                                      'either.'},
 'Hack Vortex Terraforming Tech': {'Required Credits': 17880,
                                   'Required Energy': 27,
                                   'Reward': 35760,
                                   'Experience': 480,
                                   'Rank': 12,
                                   'Faction': 'Luxorians',
                                   'requiredEquipment': {'Metalloid Armor': 2},
                                   'Health Effect': 6,
                                   'startMessage': 'E.C.H.O.: They are '
                                                   "re-plumbing Luxor's "
                                                   'water table - '
                                                   'terraforming rigs '
                                                   'tuned to make the '
                                                   'lowlands '
                                                   'corporate-habitable '
                                                   'and Luxorian-hostile. '
                                                   'Get me a hardline. '
                                                   "I'll do the impolite "
                                                   'part.',
                                   'successMessage': "E.C.H.O.: I'm in "
                                                     'their rigs. '
                                                     'Schedules corrupted, '
                                                     'calibrations '
                                                     'creatively revised. '
                                                     'The land stays '
                                                     "Luxor's. {reward} "
                                                     'credits, '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'E.C.H.O.: Connection '
                                                     'severed '
                                                     'mid-intrusion - '
                                                     'their '
                                                     'countermeasures are '
                                                     'learning. The rigs '
                                                     'keep turning. So do '
                                                     'we.'},
 'Lead Stampede Assaults': {'Required Credits': 19320,
                            'Required Energy': 29,
                            'Reward': 38640,
                            'Experience': 520,
                            'Rank': 13,
                            'Faction': 'Luxorians',
                            'requiredEquipment': {'Holo Clone': 1},
                            'Health Effect': 6,
                            'startMessage': 'E.C.H.O.: The plains herds '
                                            'outmass anything Vortex '
                                            'fields, and the herd-callers '
                                            'claim they can aim them. Ride '
                                            'at the front, Jahntow. I want '
                                            'to watch a spreadsheet meet a '
                                            'stampede.',
                            'successMessage': 'E.C.H.O.: Assault delivered '
                                              'at herd velocity. Their '
                                              'forward base is now '
                                              'archaeology. {reward} '
                                              'credits, {experience} '
                                              'experience.',
                            'failureMessage': 'E.C.H.O.: The herd broke '
                                              'wide of the target - '
                                              'spooked by their sonic '
                                              'fences. The herd-callers '
                                              'are adjusting. The plains '
                                              'are patient.'},
 'Defend Sacred Groves': {'Required Credits': 20760,
                          'Required Energy': 30,
                          'Reward': 41520,
                          'Experience': 560,
                          'Rank': 14,
                          'Faction': 'Luxorians',
                          'requiredEquipment': {'Laser Sword': 2},
                          'Health Effect': 7,
                          'startMessage': 'E.C.H.O.: Vortex is moving on '
                                          'the sacred groves - the '
                                          "lowlands' oldest ground. "
                                          'Axenthon has never asked for '
                                          'help before. He is asking now. '
                                          'Hold the groves.',
                          'successMessage': 'E.C.H.O.: The groves stand. '
                                            "Luxor's golden country is "
                                            'clearing, and its people know '
                                            'exactly who stood with them. '
                                            '{reward} credits, '
                                            '{experience} experience.',
                          'failureMessage': 'E.C.H.O.: They reached the '
                                            'outer grove before we turned '
                                            'them - old trees burned '
                                            'tonight. Axenthon said '
                                            'nothing. That was worse.'},
 'Infiltrate Lumber Facility': {'Required Credits': 22200,
                                'Required Energy': 32,
                                'Reward': 44400,
                                'Experience': 600,
                                'Rank': 15,
                                'Faction': 'Xiaojians',
                                'requiredEquipment': {'Basic Ship': 1,
                                                      'Alien Skin Armor': 2},
                                'Health Effect': 8,
                                'startMessage': 'E.C.H.O.: Elder Binru '
                                                'spent a season memorizing '
                                                "this facility's blind "
                                                "spots, and he'll walk you "
                                                'in himself. Copy the '
                                                'manifests - the forest '
                                                'tribe needs proof of what '
                                                'leaves on those trucks.',
                                'successMessage': 'E.C.H.O.: Manifests '
                                                  'copied. Binru read the '
                                                  'shipping labels and '
                                                  'went very quiet - '
                                                  'thousand-year '
                                                  'heartwood, harvested '
                                                  'like a crop. Proof '
                                                  'enough. {reward} '
                                                  'credits, {experience} '
                                                  'experience.',
                                'failureMessage': 'E.C.H.O.: A shift '
                                                  "change we didn't have "
                                                  'on file - we withdrew '
                                                  'empty-handed. Binru '
                                                  'counsels patience. The '
                                                  "facility isn't going "
                                                  'anywhere. '
                                                  'Unfortunately.'},
 'Join Xiaojian Rebels': {'Required Credits': 25080,
                          'Required Energy': 35,
                          'Reward': 50160,
                          'Experience': 680,
                          'Rank': 17,
                          'Faction': 'Xiaojians',
                          'requiredEquipment': {'Alien Squad': 2,
                                                'Bio Collector': 1},
                          'Health Effect': 8,
                          'startMessage': 'E.C.H.O.: There is a rebel camp '
                                          'hanging in the canopy, and a '
                                          'leader named Ava who trusts '
                                          'exactly as far as she can '
                                          'verify. Earn it. The forest war '
                                          "needs the desert war's help - "
                                          'and the reverse.',
                          'successMessage': "E.C.H.O.: Ava's rebels count "
                                            'you as one of their own now - '
                                            'and their canopy network sees '
                                            'everything Vortex does under '
                                            'these trees. {reward} '
                                            'credits, {experience} '
                                            'experience.',
                          'failureMessage': 'E.C.H.O.: Operation failed, '
                                            'and with it ground we had '
                                            'gained with the rebels. Trust '
                                            'built slow breaks fast up '
                                            'here. Rebuild it.'},
 'Rescue Caged Pandalings': {'Required Credits': 26520,
                             'Required Energy': 37,
                             'Reward': 53040,
                             'Experience': 720,
                             'Rank': 18,
                             'Faction': 'Xiaojians',
                             'requiredEquipment': {'Laser Sword': 1,
                                                   'Oxygen Rebreather': 2},
                             'Health Effect': 9,
                             'startMessage': 'E.C.H.O.: Vortex is caging '
                                             'pandalings for offworld '
                                             "export - 'exotic biological "
                                             "assets', per the invoice. "
                                             'Ava has located the holding '
                                             'pens. I have deleted the '
                                             "word 'assets' from my "
                                             'vocabulary. Go.',
                             'successMessage': 'E.C.H.O.: Pens open, '
                                               'pandalings away into the '
                                               'deep canopy. Some cargo '
                                               'should never have a '
                                               'manifest. {reward} '
                                               'credits, {experience} '
                                               'experience.',
                             'failureMessage': 'E.C.H.O.: Extraction '
                                               'aborted - too many guards, '
                                               'too many small lives at '
                                               'risk in a crossfire. The '
                                               'pens stay shut one more '
                                               'night. This one costs, '
                                               'Jahntow. I know.'},
 'Dragonbone Bombing Run': {'Required Credits': 27960,
                            'Required Energy': 38,
                            'Reward': 55920,
                            'Experience': 760,
                            'Rank': 19,
                            'Faction': 'Xiaojians',
                            'requiredEquipment': {'Basic Ship': 2,
                                                  'Steel Machete': 1},
                            'Health Effect': 10,
                            'startMessage': 'E.C.H.O.: Master Zhenwu '
                                            'offers gliders framed in '
                                            'dragonbone - older than '
                                            "Vortex's whole civilization "
                                            'and silent as owl wings. '
                                            'Their airships are seeding '
                                            'defoliant over the forest. '
                                            'Take the sky back.',
                            'successMessage': 'E.C.H.O.: Airship down, '
                                              'defoliant with it. The '
                                              'dragonbone wings never even '
                                              'registered on their '
                                              'sensors. Zhenwu is quietly '
                                              'delighted. {reward} '
                                              'credits, {experience} '
                                              'experience.',
                            'failureMessage': 'E.C.H.O.: Their flak grid '
                                              'drove the gliders wide and '
                                              'the airships finished their '
                                              'run - brown streaks in '
                                              'green canopy this morning. '
                                              'Zhenwu says the sky keeps '
                                              'score. So do I.'},
 'Defection and Tragedy': {'Required Credits': 29400,
                           'Required Energy': 40,
                           'Reward': 58800,
                           'Experience': 800,
                           'Rank': 20,
                           'Faction': 'Xiaojians',
                           'requiredEquipment': {'Alien Army': 2,
                                                 'Bio Collector': 3},
                           'Health Effect': 10,
                           'startMessage': 'E.C.H.O.: A high Vortex '
                                           'commander wants out - Zerrok. '
                                           'What he carries could crack '
                                           'their whole forest operation. '
                                           'Extractions like this go wrong '
                                           'in one of nine ways. I have '
                                           'planned for eleven.',
                           'successMessage': 'E.C.H.O.: Zerrok is out. The '
                                             'price was paid by people who '
                                             'knew what they were buying - '
                                             'remember them. What he '
                                             'carries changes this war. '
                                             '{reward} credits, '
                                             '{experience} experience.',
                           'failureMessage': 'E.C.H.O.: The extraction '
                                             'window collapsed - Zerrok '
                                             'remains inside, and Vortex '
                                             'is hunting its own halls for '
                                             'the leak. Every hour costs. '
                                             'We go again the moment I '
                                             'find a seam.'},
 'Final Stand in Ancient Tree City': {'Required Credits': 30840,
                                      'Required Energy': 42,
                                      'Reward': 61680,
                                      'Experience': 840,
                                      'Rank': 21,
                                      'Faction': 'Xiaojians',
                                      'requiredEquipment': {'Environmental Suit': 3,
                                                            'Terrain Scanner': 1},
                                      'Health Effect': 10,
                                      'startMessage': 'E.C.H.O.: Vortex is '
                                                      'coming for the '
                                                      'Ancient Tree City '
                                                      'itself - everything '
                                                      'the forest tribe '
                                                      'is, in one place, '
                                                      "on one day. Ava's "
                                                      "rebels, Zhenwu's "
                                                      "monks, Binru's "
                                                      'people. And you. '
                                                      'Hold.',
                                      'successMessage': 'E.C.H.O.: The '
                                                        'Tree City stands. '
                                                        'Their assault '
                                                        'broke against ten '
                                                        'thousand years of '
                                                        'roots and '
                                                        'everyone Xiaojia '
                                                        'could muster. The '
                                                        'forest is '
                                                        'clearing. '
                                                        '{reward} credits, '
                                                        '{experience} '
                                                        'experience.',
                                      'failureMessage': 'E.C.H.O.: We held '
                                                        'the heartwood but '
                                                        'lost the outer '
                                                        'boughs - fires in '
                                                        'the lower canopy '
                                                        'all night. The '
                                                        'city survives; '
                                                        'the margin was '
                                                        'too thin. '
                                                        'Reinforce and go '
                                                        'again.'},
 'Scout Vortex Mines': {'Required Credits': 33720,
                        'Required Energy': 45,
                        'Reward': 67440,
                        'Experience': 920,
                        'Rank': 23,
                        'Faction': 'Titans',
                        'requiredEquipment': {'Plasma Blade': 1,
                                              'Steel Machete': 2},
                        'Health Effect': 12,
                        'startMessage': 'E.C.H.O.: Kazon will take you up '
                                        'the high trail. The mountains are '
                                        'bleeding tailings-grey, and I '
                                        'want their mine mapped - haul '
                                        'roads, guard rotations, and '
                                        'whatever PROJECT is taking out of '
                                        'that rock.',
                        'successMessage': 'E.C.H.O.: Mine mapped. The '
                                          'manifest is wrong in an '
                                          'interesting way - refined '
                                          'exotics crated east, '
                                          'PROJECT-tagged. Not ore for '
                                          'sale. Noted and filed. {reward} '
                                          'credits, {experience} '
                                          'experience.',
                        'failureMessage': 'E.C.H.O.: Weather closed the '
                                          'ridge before the survey '
                                          'finished, and half a map helps '
                                          'no one on these cliffs. Kazon '
                                          'knows another approach. Colder. '
                                          'Naturally.'},
 'Collapse Mining Tunnels': {'Required Credits': 35160,
                             'Required Energy': 46,
                             'Reward': 70320,
                             'Experience': 960,
                             'Rank': 24,
                             'Faction': 'Titans',
                             'requiredEquipment': {'Alien Squad': 2,
                                                   'Jet Pack': 3},
                             'Health Effect': 12,
                             'startMessage': 'E.C.H.O.: The seams under '
                                             'the glacier line are '
                                             'load-bearing - their whole '
                                             'extraction grid hangs on six '
                                             "tunnels. Kazon's clans know "
                                             'where the mountain wants to '
                                             'break. Help it.',
                             'successMessage': 'E.C.H.O.: Six charges, six '
                                               'echoes, zero tunnels. The '
                                               'mountain closed like a '
                                               'fist. Extraction grid: '
                                               'discontinued. {reward} '
                                               'credits, {experience} '
                                               'experience.',
                             'failureMessage': 'E.C.H.O.: Charges '
                                               'discovered before the '
                                               'sequence armed. The '
                                               'tunnels stand and the deep '
                                               'patrols have doubled. The '
                                               'mountain is still willing. '
                                               'So am I.'},
 'Use Yeti Allies for Spying': {'Required Credits': 36600,
                                'Required Energy': 48,
                                'Reward': 73200,
                                'Experience': 1000,
                                'Rank': 25,
                                'Faction': 'Titans',
                                'requiredEquipment': {'Hover Board': 3,
                                                      'Teleporter Beacon': 1},
                                'Health Effect': 12,
                                'startMessage': 'E.C.H.O.: The high-slope '
                                                'yetis move through '
                                                'blizzard like still air, '
                                                'and Vortex sensors read '
                                                'them as weather. Kazon '
                                                'has brokered an '
                                                'arrangement. Teach them '
                                                'what to watch for.',
                                'successMessage': 'E.C.H.O.: The white '
                                                  'watchers report in. '
                                                  'Every Vortex movement '
                                                  'above the snowline is '
                                                  'on my map now - and '
                                                  "they never see what's "
                                                  'watching. {reward} '
                                                  'credits, {experience} '
                                                  'experience.',
                                'failureMessage': 'E.C.H.O.: The '
                                                  'rendezvous failed - a '
                                                  'patrol crossed the '
                                                  'meeting ground and our '
                                                  'new allies melted back '
                                                  'into the white. Kazon '
                                                  'will re-broker. Bring '
                                                  'fish.'},
 'Lead Mech Assaults': {'Required Credits': 38040,
                        'Required Energy': 50,
                        'Reward': 76080,
                        'Experience': 1040,
                        'Rank': 26,
                        'Faction': 'Titans',
                        'requiredEquipment': {'Star Ship': 1,
                                              'Metalloid Armor': 2},
                        'Health Effect': 13,
                        'startMessage': 'E.C.H.O.: The clans have captured '
                                        'and re-forged Vortex mechs - '
                                        'mountain-tuned, Titan-crewed, '
                                        'extremely illegal in nine '
                                        'corporate jurisdictions. They '
                                        'want you in the command seat.',
                        'successMessage': 'E.C.H.O.: Assault delivered in '
                                          'their own machines. There is a '
                                          'poetry to that I have chosen '
                                          'not to delete. The ridge line '
                                          'is ours. {reward} credits, '
                                          '{experience} experience.',
                        'failureMessage': 'E.C.H.O.: Two mechs down to '
                                          'anti-armor fire - crews '
                                          'extracted, machines lost. The '
                                          'clans are already rebuilding. '
                                          'Titans do not stay down.'},
 'Persuade Titan Clans to Unite': {'Required Credits': 39480,
                                   'Required Energy': 51,
                                   'Reward': 78960,
                                   'Experience': 1080,
                                   'Rank': 27,
                                   'Faction': 'Titans',
                                   'requiredEquipment': {'Alien Ally': 2,
                                                         'Holo Clone': 3},
                                   'Health Effect': 14,
                                   'startMessage': 'E.C.H.O.: Five clans, '
                                                   'five feuds, one '
                                                   'mountain range under '
                                                   'one threat. Kazon '
                                                   'believes only an '
                                                   'outsider can say what '
                                                   'needs saying at the '
                                                   'fire circle. You are '
                                                   'the outsider, Jahntow.',
                                   'successMessage': 'E.C.H.O.: Five knots '
                                                     'on one belt - the '
                                                     'clans march together '
                                                     'for the first time '
                                                     'in living memory. '
                                                     'Kazon calls it your '
                                                     'doing. {reward} '
                                                     'credits, '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'E.C.H.O.: The '
                                                     'council broke '
                                                     'without accord - old '
                                                     'feuds die harder '
                                                     'than corporations. '
                                                     'Kazon is unbothered. '
                                                     "'Mountains move "
                                                     "slow,' he says. We "
                                                     'sit the fire again.'},
 'Defend Mountain Fortresses': {'Required Credits': 42360,
                                'Required Energy': 54,
                                'Reward': 84720,
                                'Experience': 1160,
                                'Rank': 29,
                                'Faction': 'Titans',
                                'requiredEquipment': {'Scout Drone': 3,
                                                      'Porta Lab': 1},
                                'Health Effect': 14,
                                'startMessage': 'E.C.H.O.: Vortex wants '
                                                'the high fortresses '
                                                'before winter - take the '
                                                'forts and they take the '
                                                'range. All five clans are '
                                                'on the walls together. '
                                                'Hold the mountains, '
                                                'Jahntow.',
                                'successMessage': 'E.C.H.O.: The '
                                                  'fortresses hold. Their '
                                                  'assault spent itself on '
                                                  'Titan stone and united '
                                                  'clans - the range is '
                                                  'clearing, and the '
                                                  'forges stand ready for '
                                                  'new work. {reward} '
                                                  'credits, {experience} '
                                                  'experience.',
                                'failureMessage': 'E.C.H.O.: The west wall '
                                                  'was breached before the '
                                                  'counterattack sealed '
                                                  'it. The fortress holds '
                                                  'tonight, but winter is '
                                                  'coming - and so are '
                                                  'they. Again.'},
 'Infiltrate Logging Facilities': {'Required Credits': 43800,
                                   'Required Energy': 56,
                                   'Reward': 87600,
                                   'Experience': 1200,
                                   'Rank': 30,
                                   'Faction': 'Tuathans',
                                   'requiredEquipment': {'Oxygen Rebreather': 3,
                                                         'Laser Sword': 2},
                                   'Health Effect': 15,
                                   'startMessage': "E.C.H.O.: Tuatha's "
                                                   'jungle is being eaten '
                                                   'by machines the size '
                                                   'of villages. Your '
                                                   'guide is the Emerald '
                                                   'Mage - the sensors '
                                                   'will be, I am told, '
                                                   "'convinced to look "
                                                   "elsewhere'. Get the "
                                                   'schedules.',
                                   'successMessage': 'E.C.H.O.: Schedules '
                                                     'and shipping data '
                                                     'extracted while the '
                                                     'jungle itself ran '
                                                     'interference. The '
                                                     'Mage says the stumps '
                                                     'are still screaming. '
                                                     'Writing faster. '
                                                     '{reward} credits, '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'E.C.H.O.: A sweep '
                                                     'team crossed our '
                                                     'path and the Mage '
                                                     'pulled us out. The '
                                                     'jungle hides us, but '
                                                     'it cannot fight '
                                                     'harvesters with '
                                                     'vines alone. Yet. '
                                                     'Regroup.'},
 'Ambush Vortex Forces': {'Required Credits': 45240,
                          'Required Energy': 58,
                          'Reward': 90480,
                          'Experience': 1240,
                          'Rank': 31,
                          'Faction': 'Tuathans',
                          'requiredEquipment': {'Invisi Veil': 4,
                                                'Basic Ship': 3},
                          'Health Effect': 16,
                          'startMessage': 'E.C.H.O.: Their patrol columns '
                                          'move the same trails at the '
                                          'same hours - efficient, '
                                          'predictable, careless. The Mage '
                                          'knows where the jungle narrows. '
                                          'We will be waiting in it.',
                          'successMessage': 'E.C.H.O.: Ambush executed. '
                                            'The column entered the '
                                            'narrows; the narrows kept '
                                            'them. Their patrol schedules '
                                            'just became less predictable '
                                            '- fear does that. {reward} '
                                            'credits, {experience} '
                                            'experience.',
                          'failureMessage': 'E.C.H.O.: They ran scout '
                                            'drones ahead this time and '
                                            'the ambush sprang on empty '
                                            'trail. They are learning. We '
                                            'learn faster.'},
 'Foil Vortex Trapping': {'Required Credits': 46680,
                          'Required Energy': 59,
                          'Reward': 93360,
                          'Experience': 1280,
                          'Rank': 32,
                          'Faction': 'Tuathans',
                          'requiredEquipment': {'Alien Skin Armor': 1,
                                                'Cyber Armor': 4},
                          'Health Effect': 16,
                          'startMessage': 'E.C.H.O.: Trap lines through '
                                          'the deep jungle - Vortex is '
                                          "harvesting Tuatha's creatures "
                                          'for bioweapon research. The '
                                          'Mage wants every trap sprung '
                                          'and every cage opened. '
                                          'Personally.',
                          'successMessage': 'E.C.H.O.: Trap lines cleared, '
                                            'cages open, specimens gone '
                                            'home. Their research division '
                                            'reports total inventory loss. '
                                            'My condolences - filed under '
                                            'fiction. {reward} credits, '
                                            '{experience} experience.',
                          'failureMessage': 'E.C.H.O.: We cleared half the '
                                            'lines before their wardens '
                                            'converged - creatures still '
                                            'caged in the eastern sectors. '
                                            'The Mage is not calm about '
                                            'this. Neither am I. Back in.'},
 'Destroy Bioweapon Stockpiles': {'Required Credits': 48120,
                                  'Required Energy': 61,
                                  'Reward': 96240,
                                  'Experience': 1320,
                                  'Rank': 33,
                                  'Faction': 'Tuathans',
                                  'requiredEquipment': {'Bio Collector': 2,
                                                        'Alien Army': 1},
                                  'Health Effect': 16,
                                  'startMessage': 'E.C.H.O.: I have found '
                                                  'where the bioweapon '
                                                  'program lives - '
                                                  'stockpiles rated for '
                                                  'defoliation on a '
                                                  'continental scale. This '
                                                  'is what they always '
                                                  'meant for Tuatha, '
                                                  'Jahntow. Burn it.',
                                  'successMessage': 'E.C.H.O.: Stockpiles '
                                                    'destroyed - the '
                                                    'compounds neutralized '
                                                    'inside their own '
                                                    'containment. A '
                                                    "continent's worth of "
                                                    'poison, unwritten. '
                                                    '{reward} credits, '
                                                    '{experience} '
                                                    'experience.',
                                  'failureMessage': 'E.C.H.O.: The '
                                                    'demolition sequence '
                                                    'tripped an alert and '
                                                    'we pulled out with '
                                                    'the stockpile intact. '
                                                    'That inventory cannot '
                                                    'be allowed to exist. '
                                                    'Rearm. Return.'},
 'Learn Forest Regrowth Rituals': {'Required Credits': 51000,
                                   'Required Energy': 64,
                                   'Reward': 102000,
                                   'Experience': 1400,
                                   'Rank': 35,
                                   'Faction': 'Tuathans',
                                   'requiredEquipment': {'Terrain Scanner': 3,
                                                         'Environmental Suit': 2},
                                   'Health Effect': 18,
                                   'startMessage': "E.C.H.O.: The Mage's "
                                                   'order offers something '
                                                   'Vortex would never '
                                                   'understand: the rite '
                                                   'that regrows forests. '
                                                   'Three nights under the '
                                                   'canopy. Learn it. Some '
                                                   'weapons plant instead '
                                                   'of burn.',
                                   'successMessage': 'E.C.H.O.: Rite '
                                                     'learned. I recorded '
                                                     'none of it - some '
                                                     'things the order '
                                                     'trusts to memory, '
                                                     'and memory only. The '
                                                     'clear-cuts have '
                                                     'started greening. '
                                                     '{reward} credits, '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'E.C.H.O.: The rite '
                                                     'refused you tonight '
                                                     '- the Mage says the '
                                                     'forest tests before '
                                                     'it teaches. Rest. '
                                                     'Return. The canopy '
                                                     'is patient with '
                                                     'honest students.'},
 'Defend the Heart of the Forest': {'Required Credits': 52440,
                                    'Required Energy': 66,
                                    'Reward': 104880,
                                    'Experience': 1440,
                                    'Rank': 36,
                                    'Faction': 'Tuathans',
                                    'requiredEquipment': {'Steel Machete': 4,
                                                          'Plasma Blade': 3},
                                    'Health Effect': 18,
                                    'startMessage': 'E.C.H.O.: Vortex is '
                                                    'driving for the Heart '
                                                    'of the Forest - the '
                                                    'grove every root in '
                                                    'Tuatha runs back to. '
                                                    'The order, the rebels '
                                                    'and the jungle itself '
                                                    'are massing. Stand '
                                                    'with them.',
                                    'successMessage': 'E.C.H.O.: The Heart '
                                                      'stands. The jungle '
                                                      'fought beside you - '
                                                      'I logged vine and '
                                                      'root doing things I '
                                                      'decline to model. '
                                                      'Tuatha is clearing. '
                                                      '{reward} credits, '
                                                      '{experience} '
                                                      'experience.',
                                    'failureMessage': 'E.C.H.O.: They '
                                                      'reached the outer '
                                                      'grove ring before '
                                                      'the line held - '
                                                      'burned ground '
                                                      'within sight of the '
                                                      'Heart. The Mage '
                                                      'stood very still '
                                                      'for a long time. We '
                                                      'do not let them '
                                                      'that close again.'},
 'Scout Vortex Facilities': {'Required Credits': 53880,
                             'Required Energy': 67,
                             'Reward': 107760,
                             'Experience': 1480,
                             'Rank': 37,
                             'Faction': 'Namarupians',
                             'requiredEquipment': {'Jet Pack': 1,
                                                   'Alien Squad': 4},
                             'Health Effect': 18,
                             'startMessage': 'E.C.H.O.: Namarupa - the one '
                                             'city Vortex never invaded, '
                                             'because it never had to. '
                                             'Zhalia will meet you on the '
                                             'mag-rail. Something here '
                                             'keeps a million heads bowed, '
                                             'and I want it found and '
                                             'mapped.',
                             'successMessage': 'E.C.H.O.: Facilities '
                                               'mapped. Zhalia confirms '
                                               'it: a suppression network '
                                               'tuned to the psychic city, '
                                               'humming under every '
                                               'street. Now we know what '
                                               'to break. {reward} '
                                               'credits, {experience} '
                                               'experience.',
                             'failureMessage': 'E.C.H.O.: Surveillance '
                                               'density beyond anything we '
                                               'have faced - we pulled out '
                                               'clean but incomplete. '
                                               'Zhalia knows another route '
                                               'through the tower '
                                               'district. Quieter. '
                                               'Slower.'},
 'Disrupt Executive Speeches': {'Required Credits': 55320,
                                'Required Energy': 69,
                                'Reward': 110640,
                                'Experience': 1520,
                                'Rank': 38,
                                'Faction': 'Namarupians',
                                'requiredEquipment': {'Teleporter Beacon': 2,
                                                      'Hover Board': 1},
                                'Health Effect': 19,
                                'startMessage': 'E.C.H.O.: Vortex '
                                                'executives broadcast '
                                                "weekly 'harmony "
                                                "addresses' - compliance "
                                                'conditioning with a stage '
                                                'smile. Zhalia wants one '
                                                'interrupted in front of '
                                                'the whole city. Wake them '
                                                'up.',
                                'successMessage': 'E.C.H.O.: Broadcast '
                                                  'disrupted city-wide. A '
                                                  'million people watched '
                                                  "an executive's smile "
                                                  'fail in real time. '
                                                  'Bowed heads are '
                                                  'lifting. {reward} '
                                                  'credits, {experience} '
                                                  'experience.',
                                'failureMessage': 'E.C.H.O.: They cut to '
                                                  'backup transmitters '
                                                  'faster than we could '
                                                  'chase - the address '
                                                  'finished. The city '
                                                  'heard thirty seconds of '
                                                  'truth, at least. Seeds. '
                                                  "Next week's speech is "
                                                  'ours.'},
 'Make Vortex Mechs Malfunction': {'Required Credits': 56760,
                                   'Required Energy': 70,
                                   'Reward': 113520,
                                   'Experience': 1560,
                                   'Rank': 39,
                                   'Faction': 'Namarupians',
                                   'requiredEquipment': {'Metalloid Armor': 3,
                                                         'Star Ship': 2},
                                   'Health Effect': 20,
                                   'startMessage': "E.C.H.O.: Zhalia's "
                                                   'psychics can reach '
                                                   "into a mech's "
                                                   'targeting cortex and '
                                                   'gently rearrange its '
                                                   'convictions. Escort '
                                                   'them close enough. I '
                                                   'want Vortex afraid of '
                                                   'its own machines.',
                                   'successMessage': 'E.C.H.O.: Their '
                                                     'security mechs now '
                                                     'malfunction at '
                                                     'inconvenient moments '
                                                     '- saluting hydrants, '
                                                     'guarding empty lots. '
                                                     'Vortex is auditing '
                                                     'its own hardware for '
                                                     'ghosts. {reward} '
                                                     'credits, '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'E.C.H.O.: '
                                                     'Counter-frequency '
                                                     'shielding on the new '
                                                     'patrol units - the '
                                                     'psychics could not '
                                                     'reach through. '
                                                     'Zhalia is composing '
                                                     'a workaround. '
                                                     'Machines only get so '
                                                     'smart.'},
 'Create Illusions to Confuse Vortex': {'Required Credits': 58200,
                                        'Required Energy': 72,
                                        'Reward': 116400,
                                        'Experience': 1600,
                                        'Rank': 40,
                                        'Faction': 'Namarupians',
                                        'requiredEquipment': {'Holo Clone': 1,
                                                              'Alien Ally': 5},
                                        'Health Effect': 20,
                                        'startMessage': 'E.C.H.O.: The '
                                                        'woken psychics '
                                                        'propose '
                                                        'misdirection at '
                                                        'scale - phantom '
                                                        'convoys, mirage '
                                                        'armies, doors '
                                                        'where walls are. '
                                                        'Vortex trusts its '
                                                        'sensors '
                                                        'completely. Let '
                                                        'us abuse that.',
                                        'successMessage': 'E.C.H.O.: Their '
                                                          'sensors now '
                                                          'faithfully '
                                                          'report an army '
                                                          'that is not '
                                                          'there and miss '
                                                          'the one that '
                                                          'is. Vortex '
                                                          'command is '
                                                          'redeploying '
                                                          'against '
                                                          'weather. '
                                                          '{reward} '
                                                          'credits, '
                                                          '{experience} '
                                                          'experience.',
                                        'failureMessage': 'E.C.H.O.: An '
                                                          'empath-auditor '
                                                          'flagged the '
                                                          'illusions '
                                                          'before command '
                                                          'acted on them. '
                                                          'Zhalia says the '
                                                          'next lie will '
                                                          'be smaller and '
                                                          'better placed.'},
 'Lead Astral Projection Assaults': {'Required Credits': 61080,
                                     'Required Energy': 75,
                                     'Reward': 122160,
                                     'Experience': 1680,
                                     'Rank': 42,
                                     'Faction': 'Namarupians',
                                     'requiredEquipment': {'Porta Lab': 2,
                                                           'Scout Drone': 1},
                                     'Health Effect': 21,
                                     'startMessage': "E.C.H.O.: Zhalia's "
                                                     'strongest can walk '
                                                     'out of their bodies '
                                                     'and through Vortex '
                                                     'walls. They need a '
                                                     'ground team to '
                                                     'anchor them - and '
                                                     'someone the '
                                                     'projections trust to '
                                                     'lead. That is you.',
                                     'successMessage': 'E.C.H.O.: Assault '
                                                       'complete - half '
                                                       'the strike force '
                                                       'never physically '
                                                       'entered the '
                                                       'building. Their '
                                                       'security logs '
                                                       'describe intruders '
                                                       'who cast no '
                                                       'shadow. Accurate, '
                                                       'for once. {reward} '
                                                       'credits, '
                                                       '{experience} '
                                                       'experience.',
                                     'failureMessage': 'E.C.H.O.: The '
                                                       'anchor line '
                                                       'thinned and Zhalia '
                                                       'pulled every '
                                                       'walker back to '
                                                       'their bodies - all '
                                                       'recovered, mission '
                                                       'scrubbed. We do '
                                                       'not spend minds, '
                                                       'Jahntow. We go '
                                                       'again, anchored '
                                                       'deeper.'},
 'Final Psychic Showdown': {'Required Credits': 62520,
                            'Required Energy': 77,
                            'Reward': 125040,
                            'Experience': 1720,
                            'Rank': 43,
                            'Faction': 'Namarupians',
                            'requiredEquipment': {'Laser Sword': 3,
                                                  'Oxygen Rebreather': 2},
                            'Health Effect': 22,
                            'startMessage': 'E.C.H.O.: The suppression '
                                            'network has a heart - the '
                                            'amplifier, one machine '
                                            'bending a million minds. '
                                            "Vortex's psychic enforcers "
                                            'are dug in around it. Zhalia '
                                            'says today her city wakes. '
                                            'Prove her right.',
                            'successMessage': 'E.C.H.O.: The amplifier is '
                                              'dead. A million minds, '
                                              'unbent in one heartbeat. '
                                              'Namarupa is awake, and it '
                                              'is angry, and it is ours. '
                                              '{reward} credits, '
                                              '{experience} experience.',
                            'failureMessage': 'E.C.H.O.: Their enforcers '
                                              'held the amplifier chamber '
                                              '- Zhalia got everyone out '
                                              'breathing. The machine '
                                              'still hums; her city still '
                                              'sleeps. Not for long. '
                                              'Again.'},
 'Vortex Corp: Infiltration': {'Required Credits': 63960,
                               'Required Energy': 78,
                               'Reward': 127920,
                               'Experience': 1760,
                               'Rank': 44,
                               'Faction': 'United Front',
                               'requiredEquipment': {'Basic Ship': 4,
                                                     'Invisi Veil': 3},
                               'Health Effect': 22,
                               'startMessage': 'E.C.H.O.: Six lands free. '
                                               'One fortress left - '
                                               "Vortex's continental "
                                               'headquarters. Direct '
                                               'assault is suicide, so we '
                                               'go in first, quiet, and '
                                               'open it from the inside. '
                                               'All roads led here, '
                                               'Jahntow.',
                               'successMessage': 'E.C.H.O.: We are inside '
                                                 'the perimeter - past the '
                                                 'outer grid, footprint '
                                                 'zero. Whatever happens '
                                                 'next happens from within '
                                                 'their walls. {reward} '
                                                 'credits, {experience} '
                                                 'experience.',
                               'failureMessage': 'E.C.H.O.: The outer grid '
                                                 'caught our approach - we '
                                                 'broke contact clean, but '
                                                 'the fortress knows '
                                                 'something moved in the '
                                                 'dark. Re-route. There is '
                                                 'always another seam.'},
 'Vortex Corp: Inside the Fortress': {'Required Credits': 65400,
                                      'Required Energy': 80,
                                      'Reward': 130800,
                                      'Experience': 1800,
                                      'Rank': 45,
                                      'Faction': 'United Front',
                                      'requiredEquipment': {'Cyber Armor': 5,
                                                            'Alien Skin Armor': 4},
                                      'Health Effect': 22,
                                      'startMessage': 'E.C.H.O.: We are in '
                                                      'the walls. Now we '
                                                      'map the beast from '
                                                      'its guts - command '
                                                      'levels, the '
                                                      'generator stack '
                                                      'that feeds the '
                                                      'killing-field '
                                                      'defenses, and '
                                                      'everything tagged '
                                                      'PROJECT. Quietly.',
                                      'successMessage': 'E.C.H.O.: Mapped '
                                                        '- command spire, '
                                                        'generator floors, '
                                                        'the PROJECT '
                                                        'vaults. This '
                                                        'fortress has a '
                                                        'spine, and I know '
                                                        'where it is now. '
                                                        '{reward} credits, '
                                                        '{experience} '
                                                        'experience.',
                                      'failureMessage': 'E.C.H.O.: '
                                                        'Internal security '
                                                        'cycled early and '
                                                        'we went to ground '
                                                        'inside the walls. '
                                                        'Uncomfortable. '
                                                        'Survivable. The '
                                                        'map stays '
                                                        'half-drawn one '
                                                        'more shift.'},
 'Vortex Corp: Betrayal': {'Required Credits': 66840,
                           'Required Energy': 82,
                           'Reward': 133680,
                           'Experience': 1840,
                           'Rank': 46,
                           'Faction': 'United Front',
                           'requiredEquipment': {'Alien Army': 1,
                                                 'Bio Collector': 5},
                           'Health Effect': 23,
                           'startMessage': 'E.C.H.O.: Something is wrong. '
                                           'Rotations we predicted are '
                                           'shifting against us - as if '
                                           'someone is reading our plan. '
                                           'Watch everyone, Jahntow. Even '
                                           'the people we trust. '
                                           'Especially them.',
                           'successMessage': 'E.C.H.O.: Objective held. '
                                             'What it cost is in the log, '
                                             'and the log is heavier than '
                                             'I know how to file. {reward} '
                                             'credits and {experience} '
                                             'experience.',
                           'failureMessage': 'E.C.H.O.: We were cut off '
                                             'before it played out and '
                                             'fell back deeper into the '
                                             'walls. Something in this '
                                             'fortress is still turned '
                                             'against us - and we go back '
                                             'in knowing it.'},
 'Vortex Corp: Disabling the Defenses': {'Required Credits': 69720,
                                         'Required Energy': 85,
                                         'Reward': 139440,
                                         'Experience': 1920,
                                         'Rank': 48,
                                         'Faction': 'United Front',
                                         'requiredEquipment': {'Environmental Suit': 2,
                                                               'Terrain Scanner': 1},
                                         'Health Effect': 24,
                                         'startMessage': 'E.C.H.O.: The '
                                                         'killing-field '
                                                         'generators die '
                                                         'today - floor by '
                                                         'floor, stack by '
                                                         'stack. When the '
                                                         'shimmer drops, '
                                                         'five tribes come '
                                                         'off the wastes '
                                                         "at a run. Don't "
                                                         'let the cage '
                                                         'outlive her, '
                                                         'Jahntow.',
                                         'successMessage': 'E.C.H.O.: '
                                                           'Generators '
                                                           'down. The '
                                                           'fields are '
                                                           'dropping and I '
                                                           'can hear the '
                                                           'tribes through '
                                                           'the fortress '
                                                           'walls. The way '
                                                           'is open. '
                                                           '{reward} '
                                                           'credits, '
                                                           '{experience} '
                                                           'experience.',
                                         'failureMessage': 'E.C.H.O.: The '
                                                           'stack '
                                                           're-routed to '
                                                           'auxiliaries - '
                                                           'fields still '
                                                           'up, tribes '
                                                           'still waiting '
                                                           'on the wastes. '
                                                           'Every hour the '
                                                           'shimmer holds '
                                                           'is an hour she '
                                                           'bought us. '
                                                           'Spend it '
                                                           'better. '
                                                           'Again.'},
 'Vortex Corp: Confrontation with Xaezor': {'Required Credits': 71160,
                                            'Required Energy': 86,
                                            'Reward': 355800,
                                            'Experience': 1960,
                                            'Rank': 49,
                                            'Faction': 'United Front',
                                            'requiredEquipment': {'Plasma Blade': 3,
                                                                  'Steel Machete': 2},
                                            'Health Effect': 48,
                                            'startMessage': 'E.C.H.O.: Top '
                                                            'of the spire. '
                                                            'One door '
                                                            'left, and '
                                                            'behind it the '
                                                            'man who '
                                                            'bought a '
                                                            'world and '
                                                            'called it '
                                                            'vision. My '
                                                            'models cap '
                                                            'your odds at '
                                                            'seventy-five '
                                                            'percent - the '
                                                            'rest was '
                                                            'never going '
                                                            'to be math. '
                                                            'End this, '
                                                            'Jahntow.',
                                            'successMessage': 'E.C.H.O.: '
                                                              'Xaezor is '
                                                              'finished. '
                                                              'The '
                                                              'fortress is '
                                                              'ours, the '
                                                              'sky is '
                                                              'open, and '
                                                              'every land '
                                                              'that armed '
                                                              'you just '
                                                              'felt it. It '
                                                              'is done, '
                                                              'Jahntow. It '
                                                              'is actually '
                                                              'done. '
                                                              '{reward} '
                                                              'credits and '
                                                              '{experience} '
                                                              'experience '
                                                              '- not that '
                                                              'any number '
                                                              'covers '
                                                              'this.',
                                            'failureMessage': 'E.C.H.O.: '
                                                              'He threw '
                                                              'you back - '
                                                              'that power '
                                                              'of his is '
                                                              'borrowed '
                                                              'from '
                                                              'something '
                                                              'my sensors '
                                                              'refuse to '
                                                              'parse. You '
                                                              'are alive; '
                                                              'that is the '
                                                              'asset that '
                                                              'matters. '
                                                              'Heal, '
                                                              're-arm, and '
                                                              'we climb '
                                                              'the spire '
                                                              'again.',
                                            'Boss': True},
 'Victory and Aftermath': {'Required Credits': 72600,
                           'Required Energy': 88,
                           'Reward': 145200,
                           'Experience': 2000,
                           'Rank': 50,
                           'Faction': 'United Front',
                           'requiredEquipment': {'Alien Squad': 2,
                                                 'Jet Pack': 1},
                           'Health Effect': 25,
                           'startMessage': 'E.C.H.O.: The war is over; the '
                                           'work is not. Wells to unmeter, '
                                           'forests to replant, minds to '
                                           'unbend, a fortress to turn '
                                           'into something better. The '
                                           'tribes are asking for you. '
                                           'They always will be.',
                           'successMessage': 'E.C.H.O.: Another piece of '
                                             'the peace, built and '
                                             'holding. This is my favorite '
                                             'kind of operations log. '
                                             '{reward} credits, '
                                             '{experience} experience.',
                           'failureMessage': 'E.C.H.O.: A setback - '
                                             'rebuilding has those too. '
                                             'Nothing today that tomorrow '
                                             'cannot mend. The peace '
                                             'holds, Jahntow. We keep '
                                             'working.'}}

PROPERTIES = {'Energy Labs': {'Salvage Smelter': {'Base Cost': 3000,
                                      'Item Generated': 'Alpha Core',
                                      'Generation Rate': 0.0171,
                                      'Rank': 1},
                              'Fusion Facility': {'Base Cost': 8800,
                                     'Item Generated': 'Alpha Core',
                                     'Generation Rate': 0.05,
                                     'Rank': 3},
                 'Quantum Lab': {'Base Cost': 27700,
                                 'Item Generated': 'Fusion Core',
                                 'Generation Rate': 0.05,
                                 'Rank': 8},
                 'Omega Factory': {'Base Cost': 912600,
                                   'Item Generated': 'Omega Core',
                                   'Generation Rate': 0.0052,
                                   'Rank': 33},
                 'Fusion Supercollider': {'Base Cost': 8800,
                                          'Item Generated': 'Alpha Core',
                                          'Generation Rate': 0.05,
                                          'Rank': 4},
                 'Quantum Superlab': {'Base Cost': 27700,
                                      'Item Generated': 'Fusion Core',
                                      'Generation Rate': 0.05,
                                      'Rank': 9},
                 'Omega MegaFactory': {'Base Cost': 1614600,
                                       'Item Generated': 'Omega Core',
                                       'Generation Rate': 0.0092,
                                       'Rank': 39}},
 'Nano Production Sites': {'NanoMesh Plant': {'Base Cost': 17600,
                                              'Item Generated': 'NanoMesh',
                                              'Generation Rate': 0.05,
                                              'Rank': 6},
                           'HyperWeave Workshop': {'Base Cost': 45500,
                                                   'Item Generated': 'HyperWeave',
                                                   'Generation Rate': 0.05,
                                                   'Rank': 13},
                           'Quantum Fabric Loom': {'Base Cost': 2281500,
                                                   'Item Generated': 'Quantum '
                                                                     'Fabric',
                                                   'Generation Rate': 0.0065,
                                                   'Rank': 43},
                           'NanoMesh MegaPlant': {'Base Cost': 17600,
                                                  'Item Generated': 'NanoMesh',
                                                  'Generation Rate': 0.05,
                                                  'Rank': 7},
                           'HyperWeave MegaWorkshop': {'Base Cost': 45500,
                                                       'Item Generated': 'HyperWeave',
                                                       'Generation Rate': 0.05,
                                                       'Rank': 15},
                           'Quantum Fabric MegaLoom': {'Base Cost': 2281500,
                                                       'Item Generated': 'Quantum '
                                                                         'Fabric',
                                                       'Generation Rate': 0.0065,
                                                       'Rank': 42}},
 'Cybernetic Clinics': {'NeuroLink Clinic': {'Base Cost': 35100,
                                             'Item Generated': 'NeuroLink',
                                             'Generation Rate': 0.05,
                                             'Rank': 11},
                        'SynthArm Surgery': {'Base Cost': 218500,
                                             'Item Generated': 'SynthArm',
                                             'Generation Rate': 0.05,
                                             'Rank': 24},
                        'OmegaBrain Center': {'Base Cost': 1123200,
                                              'Item Generated': 'OmegaBrain',
                                              'Generation Rate': 0.0016,
                                              'Rank': 34},
                        'NeuroLink MegaClinic': {'Base Cost': 35100,
                                                 'Item Generated': 'NeuroLink',
                                                 'Generation Rate': 0.05,
                                                 'Rank': 12},
                        'SynthArm MegaSurgery': {'Base Cost': 218500,
                                                 'Item Generated': 'SynthArm',
                                                 'Generation Rate': 0.05,
                                                 'Rank': 25},
                        'OmegaBrain MegaCenter': {'Base Cost': 1895400,
                                                  'Item Generated': 'OmegaBrain',
                                                  'Generation Rate': 0.0027,
                                                  'Rank': 40}},
 'Data Cube Manufactures': {'Data Shard Factory': {'Base Cost': 52600,
                                                   'Item Generated': 'Data '
                                                                     'Shard',
                                                   'Generation Rate': 0.05,
                                                   'Rank': 16},
                            'Quantum Node Works': {'Base Cost': 496500,
                                                   'Item Generated': 'Quantum '
                                                                     'Node',
                                                   'Generation Rate': 0.0395,
                                                   'Rank': 27},
                            'Infinity Matrix Hub': {'Base Cost': 1579500,
                                                    'Item Generated': 'Infinity '
                                                                      'Matrix',
                                                    'Generation Rate': 0.0015,
                                                    'Rank': 38},
                            'Data Shard MegaFactory': {'Base Cost': 52600,
                                                       'Item Generated': 'Data '
                                                                         'Shard',
                                                       'Generation Rate': 0.05,
                                                       'Rank': 17},
                            'Quantum Node MegaWorks': {'Base Cost': 612100,
                                                       'Item Generated': 'Quantum '
                                                                         'Node',
                                                       'Generation Rate': 0.0487,
                                                       'Rank': 29},
                            'Infinity Matrix MegaHub': {'Base Cost': 3159000,
                                                        'Item Generated': 'Infinity '
                                                                          'Matrix',
                                                        'Generation Rate': 0.003,
                                                        'Rank': 47}},
 'Medical Facilities': {'BioPatch Pharmacy': {'Base Cost': 70200,
                                              'Item Generated': 'BioPatch',
                                              'Generation Rate': 0.05,
                                              'Rank': 18},
                        'NanoSyringe Clinic': {'Base Cost': 495700,
                                               'Item Generated': 'NanoSyringe',
                                               'Generation Rate': 0.0392,
                                               'Rank': 26},
                        'RegenGen Hospital': {'Base Cost': 1123200,
                                              'Item Generated': 'RegenGen',
                                              'Generation Rate': 0.0008,
                                              'Rank': 35},
                        'BioPatch MegaPharmacy': {'Base Cost': 70200,
                                                  'Item Generated': 'BioPatch',
                                                  'Generation Rate': 0.05,
                                                  'Rank': 20},
                        'NanoSyringe MegaClinic': {'Base Cost': 632300,
                                                   'Item Generated': 'NanoSyringe',
                                                   'Generation Rate': 0.05,
                                                   'Rank': 30},
                        'RegenGen MegaHospital': {'Base Cost': 2667600,
                                                  'Item Generated': 'RegenGen',
                                                  'Generation Rate': 0.0019,
                                                  'Rank': 45}},
 'Encryption Enterprises': {'Cryptex Workshop': {'Base Cost': 87800,
                                                 'Item Generated': 'Cryptex',
                                                 'Generation Rate': 0.05,
                                                 'Rank': 21},
                            'Quantum Lock Forge': {'Base Cost': 761700,
                                                   'Item Generated': 'Quantum '
                                                                     'Lock',
                                                   'Generation Rate': 0.0298,
                                                   'Rank': 31},
                            'Omega Seal Center': {'Base Cost': 2632500,
                                                  'Item Generated': 'Omega '
                                                                    'Seal',
                                                  'Generation Rate': 0.0015,
                                                  'Rank': 44},
                            'Cryptex MegaWorkshop': {'Base Cost': 87800,
                                                     'Item Generated': 'Cryptex',
                                                     'Generation Rate': 0.05,
                                                     'Rank': 22},
                            'Quantum Lock MegaForge': {'Base Cost': 1278000,
                                                       'Item Generated': 'Quantum '
                                                                         'Lock',
                                                       'Generation Rate': 0.05,
                                                       'Rank': 36},
                            'Omega Seal MegaCenter': {'Base Cost': 3685500,
                                                      'Item Generated': 'Omega '
                                                                        'Seal',
                                                      'Generation Rate': 0.0021,
                                                      'Rank': 48}}}


EQUIPMENT ={'Research': {'Spectral Analyzer': {'Base Cost': 50, 'Required Level': 1},
              'Bio Collector': {'Base Cost': 150, 'Required Level': 10},
              'Porta Lab': {'Base Cost': 500, 'Required Level': 20}},
 'Weapons': {'Steel Machete': {'Base Cost': 50, 'Required Level': 1},
             'Laser Sword': {'Base Cost': 150, 'Required Level': 10},
             'Plasma Blade': {'Base Cost': 500, 'Required Level': 20}},
 'Armor': {'Alien Skin Armor': {'Base Cost': 50, 'Required Level': 1},
           'Metalloid Armor': {'Base Cost': 150, 'Required Level': 10},
           'Cyber Armor': {'Base Cost': 500, 'Required Level': 20}},
 'Tech': {'Scout Drone': {'Base Cost': 50, 'Required Level': 1},
          'Holo Clone': {'Base Cost': 150, 'Required Level': 10},
          'Invisi Veil': {'Base Cost': 500, 'Required Level': 18}},
 'Transports': {'Hover Board': {'Base Cost': 50, 'Required Level': 1},
                'Jet Pack': {'Base Cost': 150, 'Required Level': 10},
                'Teleporter Beacon': {'Base Cost': 500,
                                      'Required Level': 20}},
 'Exploration': {'Environmental Suit': {'Base Cost': 50, 'Required Level': 1},
                 'Oxygen Rebreather': {'Base Cost': 150,
                                       'Required Level': 10},
                 'Terrain Scanner': {'Base Cost': 500, 'Required Level': 20}},
 'Ships': {'Basic Ship': {'Base Cost': 50, 'Required Level': 1},
           'Star Ship': {'Base Cost': 150, 'Required Level': 10},
           'Interdimensional Cruiser': {'Base Cost': 500,
                                        'Required Level': 20}},
 'Story': {'Alien Ally': {'Base Cost': 50, 'Required Level': 1},
           'Alien Squad': {'Base Cost': 150, 'Required Level': 10},
           'Alien Army': {'Base Cost': 500, 'Required Level': 20}}}


HEALTH_RECOVERY_ITEMS = {'Health': {'HealPulse Emitter': {'Cost': 900,
                                  'Health Gain': 25,
                                  'Energy Gain': 0,
                                  'Rank': 1,
                                  'Cooldown': 25},
            'VitalWave Device': {'Cost': 1500,
                                 'Health Gain': 50,
                                 'Energy Gain': 0,
                                 'Rank': 10,
                                 'Cooldown': 50},
            'Phoenix Resurrect Kit': {'Cost': 2400,
                                      'Health Gain': 100,
                                      'Energy Gain': 0,
                                      'Rank': 15,
                                      'Cooldown': 150}},
 'Energy': {'EnergyStim Injector': {'Cost': 700,
                                    'Health Gain': 0,
                                    'Energy Gain': 25,
                                    'Rank': 1,
                                    'Cooldown': 25},
            'PowerPulse Capsule': {'Cost': 1200,
                                   'Health Gain': 0,
                                   'Energy Gain': 50,
                                   'Rank': 10,
                                   'Cooldown': 50},
            'Quantum Energy Kit': {'Cost': 2000,
                                   'Health Gain': 0,
                                   'Energy Gain': 100,
                                   'Rank': 15,
                                   'Cooldown': 150}},
 'Combo': {'NanoMed Injector': {'Cost': 1600,
                                'Health Gain': 20,
                                'Energy Gain': 20,
                                'Rank': 5,
                                'Cooldown': 30},
           'RegenBoost Capsule': {'Cost': 2900,
                                  'Health Gain': 45,
                                  'Energy Gain': 45,
                                  'Rank': 10,
                                  'Cooldown': 60},
           'Omega Recovery Kit': {'Cost': 4800,
                                  'Health Gain': 95,
                                  'Energy Gain': 95,
                                  'Rank': 20,
                                  'Cooldown': 100}}}

# Achievement catalog: declarative, checked by economy.check_achievements
# whenever stats move. Lives here (a data-only module with no imports)
# so models.Player.serialize can compute the player's current title
# without importing economy - which would be circular, since economy
# imports models.
#
# Entries are grouped into CHAINS: every achievement carries a `chain`
# (which progression it belongs to) and a `tier` (its step within it), so
# the UI can present one advancing goal per chain - "Proven Contractor,
# 10 wins" becoming "Mission Specialist, 100 wins" once earned - instead
# of a wall of 20+ separate cards most of which are unreachable.
# Earning is still per-entry, so ids and Player.achievements are unchanged.
# Entries with a "title" grant a display title shown on the leaderboard;
# a later-earned title replaces an earlier one.
ACHIEVEMENT_CHAINS = {
    'level': 'Rank',
    'story': 'The Liberation',
    'missions': 'Contracts',
    'trade': 'Trade',
    'streak': 'Win Streaks',
    'estate': 'Estate',
    'wealth': 'Wealth',
    'prestige': 'Rebirth',
}

ACHIEVEMENTS = [
    # Rank
    {'id': 'level-5', 'chain': 'level', 'tier': 1, 'name': 'Finding Your Feet',
     'desc': 'Reach level 5', 'metric': 'level', 'threshold': 5},
    {'id': 'level-15', 'chain': 'level', 'tier': 2, 'name': 'Seasoned Spacer',
     'desc': 'Reach level 15', 'metric': 'level', 'threshold': 15},
    {'id': 'level-30', 'chain': 'level', 'tier': 3, 'name': 'Galactic Operator',
     'desc': 'Reach level 30', 'metric': 'level', 'threshold': 30},
    {'id': 'level-50', 'chain': 'level', 'tier': 4, 'name': 'Veteran of the Void',
     'desc': 'Reach level 50', 'metric': 'level', 'threshold': 50,
     'title': 'Veteran'},
    # The Liberation
    {'id': 'story-25', 'chain': 'story', 'tier': 1, 'name': 'First Steps to Freedom',
     'desc': 'Reach 25 story wins', 'metric': 'storyWins', 'threshold': 25},
    {'id': 'story-105', 'chain': 'story', 'tier': 2, 'name': 'Halfway Across the Stars',
     'desc': 'Reach 105 story wins', 'metric': 'storyWins', 'threshold': 105},
    {'id': 'story-210', 'chain': 'story', 'tier': 3, 'name': 'Liberator of the Tribes',
     'desc': 'Complete the story', 'metric': 'storyWins', 'threshold': 210,
     'title': 'Liberator'},
    # Contracts
    {'id': 'wins-10', 'chain': 'missions', 'tier': 1, 'name': 'Proven Contractor',
     'desc': 'Win 10 missions', 'metric': 'stat:missions_won', 'threshold': 10},
    {'id': 'wins-100', 'chain': 'missions', 'tier': 2, 'name': 'Mission Specialist',
     'desc': 'Win 100 missions', 'metric': 'stat:missions_won', 'threshold': 100},
    {'id': 'wins-500', 'chain': 'missions', 'tier': 3, 'name': 'Legend of the Lanes',
     'desc': 'Win 500 missions', 'metric': 'stat:missions_won', 'threshold': 500,
     'title': 'Legend'},
    {'id': 'wins-2000', 'chain': 'missions', 'tier': 4, 'name': 'Mythic of the Lanes',
     'desc': 'Win 2,000 missions', 'metric': 'stat:missions_won', 'threshold': 2000},
    # Trade
    {'id': 'sold-50', 'chain': 'trade', 'tier': 1, 'name': 'Market Regular',
     'desc': 'Sell 50 items', 'metric': 'stat:items_sold', 'threshold': 50},
    {'id': 'sold-500', 'chain': 'trade', 'tier': 2, 'name': 'Trade Baron',
     'desc': 'Sell 500 items', 'metric': 'stat:items_sold', 'threshold': 500},
    {'id': 'sold-2500', 'chain': 'trade', 'tier': 3, 'name': 'Cartel Master',
     'desc': 'Sell 2,500 items', 'metric': 'stat:items_sold', 'threshold': 2500},
    # Win Streaks
    {'id': 'streak-5', 'chain': 'streak', 'tier': 1, 'name': 'On a Roll',
     'desc': 'Reach a 5-mission win streak', 'metric': 'stat:best_win_streak',
     'threshold': 5},
    {'id': 'streak-10', 'chain': 'streak', 'tier': 2, 'name': 'Untouchable',
     'desc': 'Reach a 10-mission win streak', 'metric': 'stat:best_win_streak',
     'threshold': 10},
    {'id': 'streak-25', 'chain': 'streak', 'tier': 3, 'name': 'Unstoppable',
     'desc': 'Reach a 25-mission win streak', 'metric': 'stat:best_win_streak',
     'threshold': 25},
    # Estate
    {'id': 'props-5', 'chain': 'estate', 'tier': 1, 'name': 'Landholder',
     'desc': 'Own 5 properties', 'metric': 'properties_owned', 'threshold': 5},
    {'id': 'props-15', 'chain': 'estate', 'tier': 2, 'name': 'Portfolio Manager',
     'desc': 'Own 15 properties', 'metric': 'properties_owned', 'threshold': 15},
    {'id': 'props-36', 'chain': 'estate', 'tier': 3, 'name': 'Empire of Deeds',
     'desc': 'Own every property', 'metric': 'properties_owned', 'threshold': 36},
    # Wealth
    {'id': 'credits-10k', 'chain': 'wealth', 'tier': 1, 'name': 'Getting Comfortable',
     'desc': 'Hold 10,000 credits', 'metric': 'credits', 'threshold': 10000},
    {'id': 'credits-100k', 'chain': 'wealth', 'tier': 2, 'name': 'Six Figures',
     'desc': 'Hold 100,000 credits', 'metric': 'credits', 'threshold': 100000},
    {'id': 'credits-1m', 'chain': 'wealth', 'tier': 3, 'name': 'Millionaire',
     'desc': 'Hold 1,000,000 credits', 'metric': 'credits', 'threshold': 1000000,
     'title': 'Tycoon'},
    {'id': 'credits-10m', 'chain': 'wealth', 'tier': 4, 'name': 'Sector Magnate',
     'desc': 'Hold 10,000,000 credits', 'metric': 'credits', 'threshold': 10000000},
    # Rebirth
    {'id': 'prestige-1', 'chain': 'prestige', 'tier': 1, 'name': 'Born Again',
     'desc': 'Prestige for the first time', 'metric': 'prestige', 'threshold': 1,
     'title': 'Reborn'},
    {'id': 'prestige-3', 'chain': 'prestige', 'tier': 2, 'name': 'Eternal Cycle',
     'desc': 'Prestige three times', 'metric': 'prestige', 'threshold': 3},
    {'id': 'prestige-10', 'chain': 'prestige', 'tier': 3, 'name': 'Wheel of Ages',
     'desc': 'Prestige ten times', 'metric': 'prestige', 'threshold': 10},
]

# The six tribes of Zephyr, in story order - each owns six consecutive
# story missions (1-6, 7-12, ...36); the finale arc (37-42) is fought as
# the "United Front" and earns reputation with all six at once.
FACTIONS = ['Xictlians', 'Luxorians', 'Xiaojians', 'Titans', 'Tuathans',
            'Namarupians']

# Chapter-end story choices, presented once storyWins crosses after_wins
# (one pending at a time, earliest first; resolved ids live in
# Player.story_choices). Rewards deliberately diverge between faction
# reputation, credits, and gear so the decision is a real trade-off.
# reward forms: {"credits": n} | {"rep": {faction: n}} | {"rep_all": n}
# | {"equipment": {item: qty}}.
STORY_CHOICES = [
    {'id': 'xictlian-tribute', 'after_wins': 30,
     'prompt': ("The Xictlian elders lay a war-tribute of credits at Jahntow's "
                "feet for freeing their oases. Zu'ark quietly suggests the tribe "
                "needs it more than we do."),
     'options': [
         {'id': 'accept', 'label': 'Accept the tribute',
          'outcome_text': ("The caravans deliver the tribute by nightfall. War "
                           "runs on credits, and the elders understand."),
          'reward': {'credits': 4000}},
         {'id': 'refuse', 'label': 'Refuse - the water belongs to the tribe',
          'outcome_text': ("The elders pour the first freed water over Jahntow's "
                           "hands. Xictlians do not forget."),
          'reward': {'rep': {'Xictlians': 3}}},
     ]},
    {'id': 'luxorian-mercenaries', 'after_wins': 60,
     'prompt': ("The mercenaries Ava pulled out of the Vortex camps are asking "
                "who they fight for now. They'll follow Jahntow's word."),
     'options': [
         {'id': 'raiders', 'label': 'Send them raiding Vortex convoys',
          'outcome_text': ("The free company's first raid pays out within days - "
                           "and Vortex supply officers start sleeping badly."),
          'reward': {'credits': 8000}},
         {'id': 'guards', 'label': "Post them as guards over Luxor's temples",
          'outcome_text': ("Temple guards in mercenary armor become a symbol of "
                           "the defection. The Luxorians take note of who sent them."),
          'reward': {'rep': {'Luxorians': 3}}},
     ]},
    {'id': 'xiaojian-heartseed', 'after_wins': 90,
     'prompt': ("Master Zhenwu offers Jahntow the Heartseed of the ancient tree "
                "city - it can be grown into living armor, or returned to the "
                "grove it was cut from."),
     'options': [
         {'id': 'armor', 'label': 'Grow it into living armor',
          'outcome_text': ("The Heartseed weaves itself into three suits of "
                           "bark-and-sinew armor - Xiaojian craft, alive to the touch."),
          'reward': {'equipment': {'Alien Skin Armor': 3}}},
         {'id': 'grove', 'label': 'Return it to the grove',
          'outcome_text': ("The grove closes around the Heartseed like a healed "
                           "wound. Zhenwu bows lower than a master ever should."),
          'reward': {'rep': {'Xiaojians': 3}}},
     ]},
    {'id': 'titan-forge', 'after_wins': 120,
     'prompt': ("With the mountain fortresses held, the Titan forges stand idle "
                "for the first time in years. Kazon asks what they should make."),
     'options': [
         {'id': 'blades', 'label': 'Commission plasma blades for the strike team',
          'outcome_text': ("Two Titan-forged plasma blades, balanced for Jahntow's "
                           "hand. You will want these at the fortress gates."),
          'reward': {'equipment': {'Plasma Blade': 2}}},
         {'id': 'refugees', 'label': 'Arm the refugee columns instead',
          'outcome_text': ("Every refugee column now walks behind Titan steel. "
                           "Kazon's clans call Jahntow kin from this day."),
          'reward': {'rep': {'Titans': 3}}},
     ]},
    {'id': 'tuathan-rites', 'after_wins': 150,
     'prompt': ("The Emerald Mage offers to teach the forest regrowth rite - or "
                "to hand over the order's stockpile of healing salves for the "
                "war effort."),
     'options': [
         {'id': 'stockpile', 'label': 'Take the salve stockpile',
          'outcome_text': ("Crates of Tuathan salves reach the front lines - and "
                           "the surplus sells for a small fortune."),
          'reward': {'credits': 20000}},
         {'id': 'rite', 'label': 'Learn the rite yourself',
          'outcome_text': ("Jahntow spends three nights under the canopy learning "
                           "the rite. The order counts him as one of their own now."),
          'reward': {'rep': {'Tuathans': 3}}},
     ]},
    {'id': 'namarupian-broadcast', 'after_wins': 180,
     'prompt': ("Zhalia can broadcast the amplifier's destruction into every "
                "mind on Zephyr - or the strike can stay silent, and the standing "
                "Vortex bounties on 'unknown saboteurs' can quietly be claimed."),
     'options': [
         {'id': 'broadcast', 'label': 'Broadcast the victory to all tribes',
          'outcome_text': ("For one shared heartbeat, every tribe on Zephyr feels "
                           "the amplifier die. The united front is no longer a plan - "
                           "it is a fact."),
          'reward': {'rep_all': 1}},
         {'id': 'silent', 'label': 'Keep the strike silent',
          'outcome_text': ("Vortex never learns who broke the amplifier. Their own "
                           "bounty offices pay out to a stranger in a dust cloak."),
          'reward': {'credits': 30000}},
     ]},
    {'id': 'zerrok-verdict', 'after_wins': 195,
     'prompt': ("Zerrok kneels in chains, the daughter who died stopping him not "
                "yet buried. The tribes ask Jahntow for a verdict: spare the "
                "traitor, or condemn him."),
     'options': [
         {'id': 'spare', 'label': 'Spare him - Ava died believing he could be more',
          'outcome_text': ("Zerrok is led away alive, sentenced to rebuild what he "
                           "burned. Across Zephyr, the tribes speak of the mercy "
                           "shown at the fortress."),
          'reward': {'rep_all': 1}},
         {'id': 'condemn', 'label': "Condemn him for Ava's death",
          'outcome_text': ("The verdict is carried out at dawn. Zerrok's hidden "
                           "accounts are seized and turned over to the war chest."),
          'reward': {'credits': 25000}},
     ]},
]

# The player's ship: the one system that sells THROUGHPUT rather than
# bigger numbers. Simulation of 60 hours of play found the real ceiling
# was never credits - it was energy regen, fixed at 360/hour for the whole
# game while mission costs rise with rank (53 missions/hour at level 1
# down to 6 at level 50). Every existing upgrade raises a capacity, not a
# rate, so no amount of money could make the game faster. These modules
# can, which is what finally gives credits somewhere meaningful to go.
#
# Modules buy RATES and only rates. Capacity is bought separately, by the
# step-purchase upgrades in UPGRADABLE_STATS, whose escalating cost is a
# better fit for it: no arbitrary ceiling, and the price self-limits. A
# fixed-level capacity module shipped alongside them was strictly
# dominated - it charged 760,328 for the +50 item capacity the step
# upgrades sell for 13,645 - so it was removed rather than repriced.
#
# effect_per_level is applied by economy.ship_bonus(); cost of level N is
# base_cost * cost_multiplier**(N-1).
SHIP_MODULE_MAX_LEVEL = 5

SHIP_MODULES = {
    'reactor': {
        'name': 'Fusion Reactor',
        'desc': 'Energy regenerates faster - more missions per hour.',
        'effect': '+1 energy per 10s tick (+360/hour)',
        'effect_per_level': 1,
        'base_cost': 25000,
        'cost_multiplier': 3.0,
    },
    'medbay': {
        'name': 'Medbay',
        'desc': 'Health regenerates faster, so a bad run costs less downtime.',
        'effect': '+1 health per 45s tick',
        'effect_per_level': 1,
        'base_cost': 10000,
        'cost_multiplier': 2.6,
    },
    'cargo_drones': {
        'name': 'Cargo Drones',
        'desc': 'Each property banks more output before it pauses.',
        'effect': '+1x your Cargo Bay in property storage',
        'effect_per_level': 1,
        'base_cost': 15000,
        'cost_multiplier': 2.8,
    },
}
