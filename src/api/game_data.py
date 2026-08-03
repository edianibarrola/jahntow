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
                 'successMessage': 'E.c.h.o.: Debris collected and sold on. '
                                   '{reward} credits and {experience} '
                                   'experience.',
                 'failureMessage': 'E.c.h.o.: Nothing salvageable out there '
                                   'this pass.',
                 'Guaranteed': True,
                 'AvailableBelowCredits': 2000},
 'Asteroid Mining': {'Required Credits': 1000,
                     'Required Energy': 10,
                     'Reward': 3200,
                     'Experience': 40,
                     'Rank': 1,
                     'requiredEquipment': {'Spectral Analyzer': 1},
                     'Health Effect': 10,
                     'startMessage': 'E.c.h.o.: Heading towards the asteroid '
                                     'belt for mining operations.',
                     'successMessage': 'E.c.h.o.: Successfully mined '
                                       'precious resources from the '
                                       'asteroid, gaining {reward} credits '
                                       'and {experience} experience.',
                     'failureMessage': 'E.c.h.o.: Mining operations were not '
                                       'successful. Better luck next time.'},
 'Space Salvage': {'Required Credits': 1500,
                   'Required Energy': 13,
                   'Reward': 5124,
                   'Experience': 120,
                   'Rank': 3,
                   'requiredEquipment': {'Environmental Suit': 1},
                   'Health Effect': 12,
                   'startMessage': 'E.c.h.o.: Scanning space debris for '
                                   'valuable salvage.',
                   'successMessage': 'E.c.h.o.: Salvage successful. '
                                     'Recovered items translated to {reward} '
                                     'credits and {experience} experience.',
                   'failureMessage': 'E.c.h.o.: Salvage mission was '
                                     'unsuccessful. Nothing of value found.'},
 'Alien Artifact Retrieval': {'Required Credits': 2200,
                              'Required Energy': 18,
                              'Reward': 8230,
                              'Experience': 240,
                              'Rank': 6,
                              'requiredEquipment': {'Alien Skin Armor': 1},
                              'Health Effect': 14,
                              'startMessage': 'E.c.h.o.: Setting coordinates '
                                              'to a rumored alien artifact '
                                              'location.',
                              'successMessage': 'E.c.h.o.: Artifact '
                                                'retrieved successfully, '
                                                'granting you {reward} '
                                                'credits and {experience} '
                                                'experience.',
                              'failureMessage': 'E.c.h.o.: The mission to '
                                                'retrieve the alien artifact '
                                                'failed. It seems we were '
                                                'not the only ones after '
                                                'it.'},
 'Galactic Trading': {'Required Credits': 3000,
                      'Required Energy': 21,
                      'Reward': 11871,
                      'Experience': 320,
                      'Rank': 8,
                      'requiredEquipment': {'Hover Board': 1,
                                            'Spectral Analyzer': 1},
                      'Health Effect': 16,
                      'startMessage': 'E.c.h.o.: Initiating trading '
                                      'protocols with neighboring galactic '
                                      'entities.',
                      'successMessage': 'E.c.h.o.: Trade successful. The '
                                        'profits earned you {reward} credits '
                                        'and {experience} experience.',
                      'failureMessage': 'E.c.h.o.: The trade negotiation '
                                        'failed. No profits this time.'},
 'Deep Space Exploration': {'Required Credits': 4000,
                            'Required Energy': 24,
                            'Reward': 16694,
                            'Experience': 400,
                            'Rank': 10,
                            'requiredEquipment': {'Basic Ship': 2},
                            'Health Effect': 18,
                            'startMessage': 'E.c.h.o.: Preparing for a '
                                            'deep-space exploration mission '
                                            'to uncharted territories.',
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
                     'Required Energy': 27,
                     'Reward': 22827,
                     'Experience': 480,
                     'Rank': 12,
                     'requiredEquipment': {'Star Ship': 1,
                                           'Environmental Suit': 1},
                     'Health Effect': 20,
                     'startMessage': 'E.c.h.o.: Enrolling in the '
                                     'intergalactic starship racing event.',
                     'successMessage': 'E.c.h.o.: You won the race! Credited '
                                       '{reward} credits and {experience} '
                                       'experience for your performance.',
                     'failureMessage': 'E.c.h.o.: It was a tough race. '
                                       "Didn't make it to the top this "
                                       'time.'},
 'Rescue Operation': {'Required Credits': 6500,
                      'Required Energy': 30,
                      'Reward': 29940,
                      'Experience': 560,
                      'Rank': 14,
                      'requiredEquipment': {'Scout Drone': 2,
                                            'Environmental Suit': 2,
                                            'Oxygen Rebreather': 2},
                      'Health Effect': 22,
                      'startMessage': 'E.c.h.o.: Picking up distress '
                                      'signals. Initiating rescue protocols.',
                      'successMessage': "E.c.h.o.: Rescue successful! You've "
                                        'been credited with {reward} credits '
                                        'and {experience} experience.',
                      'failureMessage': 'E.c.h.o.: The rescue operation '
                                        'faced challenges. Not everyone made '
                                        'it back.'},
 'Black Hole Research': {'Required Credits': 8000,
                         'Required Energy': 34,
                         'Reward': 38580,
                         'Experience': 640,
                         'Rank': 16,
                         'requiredEquipment': {'Star Ship': 2,
                                               'Spectral Analyzer': 2},
                         'Health Effect': 24,
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
                         'Required Energy': 37,
                         'Reward': 50388,
                         'Experience': 720,
                         'Rank': 18,
                         'requiredEquipment': {'Holo Clone': 2,
                                               'Invisi Veil': 2},
                         'Health Effect': 26,
                         'startMessage': 'E.c.h.o.: Establishing '
                                         'communication channels for '
                                         'diplomatic discussions with alien '
                                         'civilizations.',
                         'successMessage': 'E.c.h.o.: Diplomacy successful. '
                                           'Established friendly relations '
                                           'and earned {reward} credits and '
                                           '{experience} experience.',
                         'failureMessage': 'E.c.h.o.: The diplomatic mission '
                                           'did not go as planned. The '
                                           'aliens were not receptive.'},
 'Galaxy Defense': {'Required Credits': 12000,
                    'Required Energy': 40,
                    'Reward': 63061,
                    'Experience': 800,
                    'Rank': 20,
                    'requiredEquipment': {'Cyber Armor': 3,
                                          'Interdimensional Cruiser': 2},
                    'Health Effect': 28,
                    'startMessage': 'E.c.h.o.: Alert! Hostile forces '
                                    'detected. Preparing for defense.',
                    'successMessage': 'E.c.h.o.: Galaxy successfully '
                                      'defended. Your bravery has earned you '
                                      '{reward} credits and {experience} '
                                      'experience.',
                    'failureMessage': 'E.c.h.o.: The galaxy defense was '
                                      'challenging. Some areas suffered '
                                      'damage.'},
 'Quantum Mechanics Mastery': {'Required Credits': 14500,
                               'Required Energy': 43,
                               'Reward': 79336,
                               'Experience': 880,
                               'Rank': 22,
                               'requiredEquipment': {'Teleporter Beacon': 3},
                               'Health Effect': 30,
                               'startMessage': 'E.c.h.o.: Initiating deep '
                                               'dive into quantum mechanics.',
                               'successMessage': 'E.c.h.o.: Successfully '
                                                 'mastered quantum '
                                                 'mechanics! Earned {reward} '
                                                 'credits and {experience} '
                                                 'experience.',
                               'failureMessage': 'E.c.h.o.: Quantum '
                                                 'Mechanics is perplexing. '
                                                 "Couldn't completely grasp "
                                                 'the concept.'},
 'Interstellar Exploration': {'Required Credits': 17500,
                              'Required Energy': 46,
                              'Reward': 99536,
                              'Experience': 960,
                              'Rank': 24,
                              'requiredEquipment': {'Cyber Armor': 3,
                                                    'Porta Lab': 3,
                                                    'Plasma Blade': 2},
                              'Health Effect': 32,
                              'startMessage': 'E.c.h.o.: Setting course for '
                                              'uncharted territories in the '
                                              'interstellar realm.',
                              'successMessage': 'E.c.h.o.: Exploration '
                                                'successful! Discovered new '
                                                'systems and earned {reward} '
                                                'credits and {experience} '
                                                'experience.',
                              'failureMessage': 'E.c.h.o.: The uncharted '
                                                'territories proved '
                                                'challenging. Exploration '
                                                'was not fully successful.'},
 'Temporal Anomaly Research': {'Required Credits': 21000,
                               'Required Energy': 50,
                               'Reward': 123986,
                               'Experience': 1040,
                               'Rank': 26,
                               'requiredEquipment': {'Porta Lab': 3,
                                                     'Terrain Scanner': 3},
                               'Health Effect': 34,
                               'startMessage': 'E.c.h.o.: Detected a '
                                               'temporal anomaly. Commencing '
                                               'research.',
                               'successMessage': 'E.c.h.o.: Successfully '
                                                 'researched the temporal '
                                                 'anomaly! Rewarded {reward} '
                                                 'credits and {experience} '
                                                 'experience.',
                               'failureMessage': 'E.c.h.o.: The temporal '
                                                 'anomaly was unstable. '
                                                 'Research faced setbacks.'},
 'Galactic Archaeology': {'Required Credits': 25000,
                          'Required Energy': 53,
                          'Reward': 153010,
                          'Experience': 1120,
                          'Rank': 28,
                          'requiredEquipment': {'Porta Lab': 3,
                                                'Terrain Scanner': 3,
                                                'Bio Collector': 3},
                          'Health Effect': 36,
                          'startMessage': 'E.c.h.o.: Embarking on a quest to '
                                          'uncover the mysteries of ancient '
                                          'galactic civilizations.',
                          'successMessage': 'E.c.h.o.: Successful '
                                            'excavation! Unearthed artifacts '
                                            'worth {reward} credits and '
                                            '{experience} experience.',
                          'failureMessage': 'E.c.h.o.: The ruins were '
                                            'labyrinthine and perplexing. '
                                            'Some artifacts remain elusive.'},
 'Universe Origins Study': {'Required Credits': 30000,
                            'Required Energy': 56,
                            'Reward': 190102,
                            'Experience': 1200,
                            'Rank': 30,
                            'requiredEquipment': {'Cyber Armor': 4,
                                                  'Plasma Blade': 4,
                                                  'Interdimensional Cruiser': 4},
                            'Health Effect': 38,
                            'startMessage': 'E.c.h.o.: Launching probe to '
                                            'research the origins of the '
                                            'universe.',
                            'successMessage': 'E.c.h.o.: Significant '
                                              'discoveries made! Earned '
                                              '{reward} credits and '
                                              '{experience} experience.',
                            'failureMessage': 'E.c.h.o.: The vastness of the '
                                              'universe is overwhelming. '
                                              'Some mysteries remain '
                                              'unsolved.'},
 'Exodimensional Expedition': {'Required Credits': 35000,
                               'Required Energy': 59,
                               'Reward': 229357,
                               'Experience': 1280,
                               'Rank': 32,
                               'requiredEquipment': {'Invisi Veil': 4,
                                                     'Teleporter Beacon': 4,
                                                     'Terrain Scanner': 2},
                               'Health Effect': 40,
                               'startMessage': 'E.c.h.o.: Preparing to '
                                               'venture into exodimensions. '
                                               'Unknown challenges await.',
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
                              'Required Energy': 62,
                              'Reward': 277545,
                              'Experience': 1360,
                              'Rank': 34,
                              'requiredEquipment': {'Teleporter Beacon': 4,
                                                    'Interdimensional Cruiser': 4,
                                                    'Porta Lab': 3},
                              'Health Effect': 42,
                              'startMessage': 'E.c.h.o.: Initiating '
                                              'procedures to manipulate dark '
                                              'matter.',
                              'successMessage': 'E.c.h.o.: Dark matter '
                                                'manipulation successful! '
                                                'Acquired {reward} credits '
                                                'and {experience} '
                                                'experience.',
                              'failureMessage': 'E.c.h.o.: Failed to control '
                                                'the elusive dark matter. '
                                                'Mission aborted.'},
 'Galactic Diplomacy': {'Required Credits': 48000,
                        'Required Energy': 66,
                        'Reward': 335314,
                        'Experience': 1440,
                        'Rank': 36,
                        'requiredEquipment': {'Invisi Veil': 4},
                        'Health Effect': 44,
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
                              'Required Energy': 69,
                              'Reward': 403314,
                              'Experience': 1520,
                              'Rank': 38,
                              'requiredEquipment': {'Porta Lab': 4,
                                                    'Cyber Armor': 3,
                                                    'Teleporter Beacon': 4},
                              'Health Effect': 46,
                              'startMessage': 'E.c.h.o.: Commencing analysis '
                                              'of mysterious void phenomena.',
                              'successMessage': 'E.c.h.o.: Analysis '
                                                'complete! Deciphered void '
                                                'secrets and obtained '
                                                '{reward} credits and '
                                                '{experience} experience.',
                              'failureMessage': 'E.c.h.o.: The void remains '
                                                'enigmatic. Analysis was '
                                                'inconclusive.'},
 'Cosmic Nexus Activation': {'Required Credits': 65000,
                             'Required Energy': 72,
                             'Reward': 482194,
                             'Experience': 1600,
                             'Rank': 40,
                             'requiredEquipment': {'Teleporter Beacon': 4,
                                                   'Bio Collector': 5,
                                                   'Cyber Armor': 4},
                             'Health Effect': 48,
                             'startMessage': 'E.c.h.o.: Initiating protocols '
                                             'to activate the cosmic nexus.',
                             'successMessage': 'E.c.h.o.: Cosmic Nexus '
                                               'activated! Gained {reward} '
                                               'credits and {experience} '
                                               'experience.',
                             'failureMessage': 'E.c.h.o.: The cosmic nexus '
                                               'proved too complex. '
                                               'Activation failed.'},
 'Temporal Loop Investigation': {'Required Credits': 75000,
                                 'Required Energy': 75,
                                 'Reward': 572602,
                                 'Experience': 1680,
                                 'Rank': 42,
                                 'requiredEquipment': {'Hover Board': 5,
                                                       'Invisi Veil': 5,
                                                       'Alien Skin Armor': 5,
                                                       'Basic Ship': 5},
                                 'Health Effect': 50,
                                 'startMessage': 'E.c.h.o.: Preparing to '
                                                 'investigate disturbances '
                                                 'in the temporal loop.',
                                 'successMessage': 'E.c.h.o.: Temporal loop '
                                                   'stabilized! Retrieved '
                                                   '{reward} credits and '
                                                   '{experience} experience.',
                                 'failureMessage': 'E.c.h.o.: Time anomalies '
                                                   'detected. Investigation '
                                                   'proved challenging.'},
 'Nebular Storm Navigation': {'Required Credits': 86000,
                              'Required Energy': 78,
                              'Reward': 675188,
                              'Experience': 1760,
                              'Rank': 44,
                              'requiredEquipment': {'Jet Pack': 5,
                                                    'Steel Machete': 5,
                                                    'Basic Ship': 5,
                                                    'Oxygen Rebreather': 5},
                              'Health Effect': 52,
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
                                  'Required Energy': 82,
                                  'Reward': 790600,
                                  'Experience': 1840,
                                  'Rank': 46,
                                  'requiredEquipment': {'Hover Board': 4,
                                                        'Jet Pack': 5,
                                                        'Plasma Blade': 5,
                                                        'Environmental Suit': 5},
                                  'Health Effect': 54,
                                  'startMessage': 'E.c.h.o.: Mission is to '
                                                  'retrieve a rare celestial '
                                                  'artifact from an ancient '
                                                  'site.',
                                  'successMessage': 'E.c.h.o.: Artifact '
                                                    'secured! Obtained '
                                                    '{reward} credits and '
                                                    '{experience} '
                                                    'experience.',
                                  'failureMessage': 'E.c.h.o.: Artifact '
                                                    'retrieval mission faced '
                                                    'unforeseen challenges.'},
 'Supernova Containment': {'Required Credits': 110000,
                           'Required Energy': 85,
                           'Reward': 911204,
                           'Experience': 1920,
                           'Rank': 48,
                           'requiredEquipment': {'Cyber Armor': 5,
                                                 'Interdimensional Cruiser': 5,
                                                 'Teleporter Beacon': 5,
                                                 'Spectral Analyzer': 5},
                           'Health Effect': 56,
                           'startMessage': 'E.c.h.o.: Attempting to contain '
                                           'the imminent supernova and '
                                           'harness its energy.',
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
                        'Required Energy': 88,
                        'Reward': 1054000,
                        'Experience': 2000,
                        'Rank': 50,
                        'requiredEquipment': {'Interdimensional Cruiser': 5,
                                              'Teleporter Beacon': 6,
                                              'Spectral Analyzer': 6,
                                              'Scout Drone': 6,
                                              'Bio Collector': 5,
                                              'Cyber Armor': 6},
                        'Health Effect': 58,
                        'startMessage': 'E.c.h.o.: Launching probes to map '
                                        'the event horizon of a black hole.',
                        'successMessage': 'E.c.h.o.: Successful mapping! '
                                          'Collected valuable data and '
                                          '{reward} credits along with '
                                          '{experience} experience.',
                        'failureMessage': 'E.c.h.o.: Probes lost to the '
                                          'gravitational pull. Black hole '
                                          'mapping unsuccessful.'}}


STORY_MISSIONS = {'Rogue Drone Takedown': {'Required Credits': 2040,
                          'Required Energy': 10,
                          'Reward': 6528,
                          'Experience': 40,
                          'Rank': 1,
                          'requiredEquipment': {'Alien Ally': 1},
                          'Health Effect': 4,
                          'startMessage': 'ECHO: Elevate your vigilance, '
                                          'Jahntow. Rogue drones sent by the '
                                          'Corporation threaten the harmony '
                                          'of Aelithian space.',
                          'successMessage': 'ECHO: Drones eliminated '
                                            "successfully. You've earned "
                                            '{reward} credits and '
                                            '{experience} experience.',
                          'failureMessage': 'ECHO: Our attempt to neutralize '
                                            'the rogue drones failed. We '
                                            'must ensure Aelithian safety.'},
 'Protect the Caravans': {'Required Credits': 3480,
                          'Required Energy': 11,
                          'Reward': 11512,
                          'Experience': 80,
                          'Rank': 2,
                          'requiredEquipment': {'Alien Ally': 1},
                          'Health Effect': 4,
                          'startMessage': 'ECHO: Jahntow, delve into the '
                                          'shadows of Corporation '
                                          'activities. Infiltrate their base '
                                          'and unveil their plans against '
                                          'Aelithians.',
                          'successMessage': "ECHO: Jahntow, we've "
                                            'successfully gathered '
                                            'intelligence on Corporation '
                                            'activities. Rewarded {reward} '
                                            'credits and {experience} '
                                            'experience.',
                          'failureMessage': 'ECHO: Our attempt to infiltrate '
                                            'the Corporation base failed. We '
                                            'must refine our approach.'},
 'Free Oases': {'Required Credits': 6360,
                'Required Energy': 14,
                'Reward': 22416,
                'Experience': 160,
                'Rank': 4,
                'requiredEquipment': {'Alien Ally': 1},
                'Health Effect': 4,
                'startMessage': 'ECHO: The Corporation seeks to disrupt '
                                'Aelithian energy trade. Engage in '
                                "negotiations to preserve your species' "
                                'vitality.',
                'successMessage': 'ECHO: Negotiations were successful. '
                                  'Aelithian energy trade remains strong, '
                                  'earning you {reward} credits and '
                                  '{experience} experience.',
                'failureMessage': 'ECHO: Our negotiation attempts faltered. '
                                  "We must ensure the energy trade's "
                                  'stability.'},
 'Repel Invasions': {'Required Credits': 7800,
                     'Required Energy': 16,
                     'Reward': 28335,
                     'Experience': 200,
                     'Rank': 5,
                     'requiredEquipment': {'Alien Ally': 1},
                     'Health Effect': 4,
                     'startMessage': 'ECHO: Unite with Aelithian leaders in '
                                     'a celestial ritual. Counter the '
                                     "Corporation's efforts to disrupt your "
                                     'cosmic harmony.',
                     'successMessage': 'ECHO: The celestial ritual was a '
                                       'success. Aelithian cosmic harmony '
                                       'remains intact, earning you {reward} '
                                       'credits and {experience} experience.',
                     'failureMessage': 'ECHO: Our attempt to maintain cosmic '
                                       'harmony faced opposition. We must '
                                       'continue safeguarding Aelithian '
                                       'traditions.'},
 'Fortify Temples': {'Required Credits': 9240,
                     'Required Energy': 18,
                     'Reward': 34565,
                     'Experience': 240,
                     'Rank': 6,
                     'requiredEquipment': {'Alien Ally': 1},
                     'Health Effect': 4,
                     'startMessage': 'ECHO: The Cepharians face a temporal '
                                     'distortion crisis. Navigate the '
                                     'labyrinth of time to restore their '
                                     "reality's stability.",
                     'successMessage': 'ECHO: The temporal distortion crisis '
                                       "has been resolved. You've earned "
                                       '{reward} credits and {experience} '
                                       'experience.',
                     'failureMessage': 'ECHO: Our attempt to stabilize '
                                       "Cepharian reality's timeline failed. "
                                       'We must safeguard their existence.'},
 'Lead Sandstorm Offensives': {'Required Credits': 10680,
                               'Required Energy': 19,
                               'Reward': 41107,
                               'Experience': 280,
                               'Rank': 7,
                               'requiredEquipment': {'Alien Ally': 1},
                               'Health Effect': 4,
                               'startMessage': 'ECHO: Descend into the '
                                               'Cepharian subterranean '
                                               'depths. Reclaim their '
                                               'ancient technology from '
                                               "Corporation's clutches.",
                               'successMessage': 'ECHO: Ancient technology '
                                                 'retrieved successfully. '
                                                 "You've earned {reward} "
                                                 'credits and {experience} '
                                                 'experience.',
                               'failureMessage': 'ECHO: Our attempt to '
                                                 'reclaim ancient technology '
                                                 'faced obstacles. We must '
                                                 'secure Cepharian legacy.'},
 'Infiltrate Vortex Camps': {'Required Credits': 12120,
                             'Required Energy': 21,
                             'Reward': 47961,
                             'Experience': 320,
                             'Rank': 8,
                             'requiredEquipment': {'Alien Ally': 1},
                             'Health Effect': 4,
                             'startMessage': 'ECHO: Engage in an astral '
                                             'harmony ceremony with '
                                             'Cepharian leaders. Counter the '
                                             "Corporation's interference in "
                                             'their ethereal connection.',
                             'successMessage': 'ECHO: Astral harmony '
                                               'achieved. Cepharian ethereal '
                                               'connection restored, earning '
                                               'you {reward} credits and '
                                               '{experience} experience.',
                             'failureMessage': 'ECHO: Our attempt to restore '
                                               'astral harmony faced '
                                               'opposition. We must preserve '
                                               'Cepharian spiritual unity.'},
 'Sabotage Supply Lines': {'Required Credits': 15000,
                           'Required Energy': 24,
                           'Reward': 62602,
                           'Experience': 400,
                           'Rank': 10,
                           'requiredEquipment': {'Steel Machete': 2},
                           'Health Effect': 5,
                           'startMessage': 'ECHO: Embark on a cosmic journey '
                                           'through nebulas with the '
                                           'Cepharians. Foil the '
                                           "Corporation's attempt to "
                                           'manipulate celestial energies.',
                           'successMessage': 'ECHO: Nebula journey completed '
                                             'successfully. Cepharian '
                                             'celestial energies secured, '
                                             'earning you {reward} credits '
                                             'and {experience} experience.',
                           'failureMessage': 'ECHO: Our attempt to navigate '
                                             'the nebulas faced challenges. '
                                             'We must ensure Cepharian '
                                             'cosmic balance.'},
 'Persuade Mercenaries to Defect': {'Required Credits': 16440,
                                    'Required Energy': 26,
                                    'Reward': 70390,
                                    'Experience': 440,
                                    'Rank': 11,
                                    'requiredEquipment': {'Jet Pack': 1},
                                    'Health Effect': 6,
                                    'startMessage': 'ECHO: The harmonious '
                                                    'frequencies of Veloran '
                                                    'music are disrupted by '
                                                    'Corporation '
                                                    'interference. Restore '
                                                    'their sonic resonance.',
                                    'successMessage': 'ECHO: Sonic resonance '
                                                      'restored '
                                                      "successfully. You've "
                                                      'earned {reward} '
                                                      'credits and '
                                                      '{experience} '
                                                      'experience.',
                                    'failureMessage': 'ECHO: Our attempt to '
                                                      'restore sonic '
                                                      'resonance faced '
                                                      'obstacles. We must '
                                                      'ensure Veloran '
                                                      'musical harmony.'},
 'Hack Vortex Terraforming Tech': {'Required Credits': 17880,
                                   'Required Energy': 27,
                                   'Reward': 78490,
                                   'Experience': 480,
                                   'Rank': 12,
                                   'requiredEquipment': {'Metalloid Armor': 2},
                                   'Health Effect': 6,
                                   'startMessage': 'ECHO: The Corporation '
                                                   'exploits Veloran crystal '
                                                   'core energy sources. '
                                                   'Engage in a high-stakes '
                                                   'operation to safeguard '
                                                   'their essence.',
                                   'successMessage': 'ECHO: Crystal core '
                                                     'safeguarded '
                                                     "successfully. You've "
                                                     'earned {reward} '
                                                     'credits and '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'ECHO: Our attempt to '
                                                     'safeguard the crystal '
                                                     'core faced opposition. '
                                                     'We must protect '
                                                     'Veloran energy '
                                                     'legacy.'},
 'Lead Stampede Assaults': {'Required Credits': 19320,
                            'Required Energy': 29,
                            'Reward': 86901,
                            'Experience': 520,
                            'Rank': 13,
                            'requiredEquipment': {'Holo Clone': 1},
                            'Health Effect': 6,
                            'startMessage': 'ECHO: Join Veloran leaders in a '
                                            'luminous unison ceremony. '
                                            "Counter the Corporation's "
                                            'manipulation of their '
                                            'collective light.',
                            'successMessage': 'ECHO: Luminous unison '
                                              'achieved. Veloran collective '
                                              'light restored, earning you '
                                              '{reward} credits and '
                                              '{experience} experience.',
                            'failureMessage': 'ECHO: Our attempt to restore '
                                              'luminous unison faced '
                                              'challenges. We must protect '
                                              'Veloran shared radiance.'},
 'Defend Sacred Groves': {'Required Credits': 20760,
                          'Required Energy': 30,
                          'Reward': 95623,
                          'Experience': 560,
                          'Rank': 14,
                          'requiredEquipment': {'Laser Sword': 2},
                          'Health Effect': 7,
                          'startMessage': 'ECHO: Embark on a celestial '
                                          'pilgrimage with the Velorans. '
                                          "Foil the Corporation's attempt to "
                                          'distort their connection to '
                                          'stars.',
                          'successMessage': 'ECHO: Celestial pilgrimage '
                                            'completed successfully. Veloran '
                                            'stellar connection secured, '
                                            'earning you {reward} credits '
                                            'and {experience} experience.',
                          'failureMessage': 'ECHO: Our attempt to navigate '
                                            'the celestial pilgrimage faced '
                                            'challenges. We must ensure '
                                            'Veloran starry bonds.'},
 'Infiltrate Lumber Facility': {'Required Credits': 22200,
                                'Required Energy': 32,
                                'Reward': 104657,
                                'Experience': 600,
                                'Rank': 15,
                                'requiredEquipment': {'Basic Ship': 1,
                                                      'Alien Skin Armor': 2},
                                'Health Effect': 8,
                                'startMessage': 'ECHO: The Drakorian Eclipse '
                                                'Ritual is threatened by the '
                                                "Corporation's intervention. "
                                                'Assist in ensuring their '
                                                'cosmic balance.',
                                'successMessage': 'ECHO: Eclipse Ritual '
                                                  'protected successfully. '
                                                  "You've earned {reward} "
                                                  'credits and {experience} '
                                                  'experience.',
                                'failureMessage': 'ECHO: Our attempt to '
                                                  'protect the Eclipse '
                                                  'Ritual faced challenges. '
                                                  'We must ensure Drakorian '
                                                  'cosmic equilibrium.'},
 'Join Xiaojian Rebels': {'Required Credits': 25080,
                          'Required Energy': 35,
                          'Reward': 123660,
                          'Experience': 680,
                          'Rank': 17,
                          'requiredEquipment': {'Alien Squad': 2,
                                                'Bio Collector': 1},
                          'Health Effect': 8,
                          'startMessage': 'ECHO: Retrieve the sacred '
                                          'Flameforged Relics from the '
                                          "Corporation's grasp. Rekindle the "
                                          'spirit of the Drakorian '
                                          'ancestors.',
                          'successMessage': 'ECHO: Flameforged Relics '
                                            "reclaimed successfully. You've "
                                            'earned {reward} credits and '
                                            '{experience} experience.',
                          'failureMessage': 'ECHO: Our attempt to reclaim '
                                            'Flameforged Relics faced '
                                            'opposition. We must honor '
                                            'Drakorian ancestral heritage.'},
 'Rescue Caged Pandalings': {'Required Credits': 26520,
                             'Required Energy': 37,
                             'Reward': 133628,
                             'Experience': 720,
                             'Rank': 18,
                             'requiredEquipment': {'Laser Sword': 1,
                                                   'Oxygen Rebreather': 2},
                             'Health Effect': 9,
                             'startMessage': 'ECHO: Engage in the creation '
                                             'of the Stellar Aegis, a cosmic '
                                             'shield to ward off the '
                                             "Corporation's astral "
                                             'intrusion.',
                             'successMessage': 'ECHO: Stellar Aegis '
                                               'successfully erected. '
                                               'Drakorian astral domain '
                                               'protected, earning you '
                                               '{reward} credits and '
                                               '{experience} experience.',
                             'failureMessage': 'ECHO: Our attempt to create '
                                               'the Stellar Aegis faced '
                                               'challenges. We must defend '
                                               'Drakorian astral '
                                               'sovereignty.'},
 'Dragonbone Bombing Run': {'Required Credits': 27960,
                            'Required Energy': 38,
                            'Reward': 143908,
                            'Experience': 760,
                            'Rank': 19,
                            'requiredEquipment': {'Basic Ship': 2,
                                                  'Steel Machete': 1},
                            'Health Effect': 10,
                            'startMessage': 'ECHO: Navigate the Celestial '
                                            'Confluence with the Drakorians. '
                                            "Counter the Corporation's "
                                            'manipulation of their cosmic '
                                            'connection.',
                            'successMessage': 'ECHO: Celestial Confluence '
                                              'completed successfully. '
                                              'Drakorian cosmic connection '
                                              'reinforced, earning you '
                                              '{reward} credits and '
                                              '{experience} experience.',
                            'failureMessage': 'ECHO: Our attempt to navigate '
                                              'the Celestial Confluence '
                                              'faced challenges. We must '
                                              'ensure Drakorian celestial '
                                              'ties.'},
 'Defection and Tragedy': {'Required Credits': 29400,
                           'Required Energy': 40,
                           'Reward': 154500,
                           'Experience': 800,
                           'Rank': 20,
                           'requiredEquipment': {'Alien Army': 2,
                                                 'Bio Collector': 3},
                           'Health Effect': 10,
                           'startMessage': 'ECHO: The harmonic light '
                                           'patterns of the Thelorian realm '
                                           'are being disrupted. Restore '
                                           'their luminous correlation.',
                           'successMessage': 'ECHO: Luminous correlation '
                                             "restored successfully. You've "
                                             'earned {reward} credits and '
                                             '{experience} experience.',
                           'failureMessage': 'ECHO: Our attempt to restore '
                                             'luminous correlation faced '
                                             'obstacles. We must ensure '
                                             'Thelorian radiant unity.'},
 'Final Stand in Ancient Tree City': {'Required Credits': 30840,
                                      'Required Energy': 42,
                                      'Reward': 165403,
                                      'Experience': 840,
                                      'Rank': 21,
                                      'requiredEquipment': {'Environmental Suit': 3,
                                                            'Terrain Scanner': 1},
                                      'Health Effect': 10,
                                      'startMessage': 'ECHO: The Corporation '
                                                      'seeks to exploit '
                                                      'Thelorian ethereal '
                                                      'nexus for power. '
                                                      'Protect their '
                                                      'interdimensional '
                                                      'heritage.',
                                      'successMessage': 'ECHO: Ethereal '
                                                        'nexus protected '
                                                        'successfully. '
                                                        "You've earned "
                                                        '{reward} credits '
                                                        'and {experience} '
                                                        'experience.',
                                      'failureMessage': 'ECHO: Our attempt '
                                                        'to protect the '
                                                        'ethereal nexus '
                                                        'faced opposition. '
                                                        'We must secure '
                                                        'Thelorian '
                                                        'multidimensional '
                                                        'legacy.'},
 'Scout Vortex Mines': {'Required Credits': 33720,
                        'Required Energy': 45,
                        'Reward': 188144,
                        'Experience': 920,
                        'Rank': 23,
                        'requiredEquipment': {'Plasma Blade': 1,
                                              'Steel Machete': 2},
                        'Health Effect': 12,
                        'startMessage': 'ECHO: Join Thelorian leaders in a '
                                        'harmonic resonance ceremony. '
                                        "Counter the Corporation's "
                                        'disruption of their cosmic '
                                        'connection.',
                        'successMessage': 'ECHO: Harmonic resonance '
                                          'achieved. Thelorian cosmic '
                                          'connection restored, earning you '
                                          '{reward} credits and {experience} '
                                          'experience.',
                        'failureMessage': 'ECHO: Our attempt to restore '
                                          'harmonic resonance faced '
                                          'challenges. We must protect '
                                          'Thelorian celestial bonds.'},
 'Collapse Mining Tunnels': {'Required Credits': 35160,
                             'Required Energy': 46,
                             'Reward': 199981,
                             'Experience': 960,
                             'Rank': 24,
                             'requiredEquipment': {'Alien Squad': 2,
                                                   'Jet Pack': 3},
                             'Health Effect': 12,
                             'startMessage': 'ECHO: Embark on an astral '
                                             'rhapsody through cosmic '
                                             'harmonies with the Thelorians. '
                                             "Prevent the Corporation's "
                                             'cosmic disharmony.',
                             'successMessage': 'ECHO: Astral rhapsody '
                                               'completed successfully. '
                                               'Thelorian cosmic melodies '
                                               'protected, earning you '
                                               '{reward} credits and '
                                               '{experience} experience.',
                             'failureMessage': 'ECHO: Our attempt to '
                                               'navigate the astral rhapsody '
                                               'faced challenges. We must '
                                               'ensure Thelorian cosmic '
                                               'harmony.'},
 'Use Yeti Allies for Spying': {'Required Credits': 36600,
                                'Required Energy': 48,
                                'Reward': 212131,
                                'Experience': 1000,
                                'Rank': 25,
                                'requiredEquipment': {'Hover Board': 3,
                                                      'Teleporter Beacon': 1},
                                'Health Effect': 12,
                                'startMessage': 'ECHO: The ethereal echoes '
                                                'of the Zeraphan realm are '
                                                'fading. Revive their '
                                                'celestial harmonies for '
                                                'eternal existence.',
                                'successMessage': 'ECHO: Celestial echoes '
                                                  'revived successfully. '
                                                  "You've earned {reward} "
                                                  'credits and {experience} '
                                                  'experience.',
                                'failureMessage': 'ECHO: Our attempt to '
                                                  'revive celestial echoes '
                                                  'faced obstacles. We must '
                                                  'ensure Zeraphan ethereal '
                                                  'vitality.'},
 'Lead Mech Assaults': {'Required Credits': 38040,
                        'Required Energy': 50,
                        'Reward': 224591,
                        'Experience': 1040,
                        'Rank': 26,
                        'requiredEquipment': {'Star Ship': 1,
                                              'Metalloid Armor': 2},
                        'Health Effect': 13,
                        'startMessage': 'ECHO: The Zeraphan nebulae are '
                                        'being disrupted by the '
                                        "Corporation's intrusion. Achieve "
                                        'nebula synchrony to maintain cosmic '
                                        'order.',
                        'successMessage': 'ECHO: Nebula synchrony achieved '
                                          "successfully. You've earned "
                                          '{reward} credits and {experience} '
                                          'experience.',
                        'failureMessage': 'ECHO: Our attempt to achieve '
                                          'nebula synchrony faced '
                                          'opposition. We must preserve '
                                          'Zeraphan cosmic balance.'},
 'Persuade Titan Clans to Unite': {'Required Credits': 39480,
                                   'Required Energy': 51,
                                   'Reward': 237363,
                                   'Experience': 1080,
                                   'Rank': 27,
                                   'requiredEquipment': {'Alien Ally': 2,
                                                         'Holo Clone': 3},
                                   'Health Effect': 14,
                                   'startMessage': 'ECHO: Join the Zeraphan '
                                                   'council in an ethereal '
                                                   'convergence ceremony. '
                                                   'Counter the '
                                                   "Corporation's disruption "
                                                   'of their cosmic bond.',
                                   'successMessage': 'ECHO: Ethereal '
                                                     'convergence achieved. '
                                                     'Zeraphan cosmic bond '
                                                     'restored, earning you '
                                                     '{reward} credits and '
                                                     '{experience} '
                                                     'experience.',
                                   'failureMessage': 'ECHO: Our attempt to '
                                                     'restore ethereal '
                                                     'convergence faced '
                                                     'challenges. We must '
                                                     'protect Zeraphan '
                                                     'cosmic unity.'},
 'Defend Mountain Fortresses': {'Required Credits': 42360,
                                'Required Energy': 54,
                                'Reward': 263842,
                                'Experience': 1160,
                                'Rank': 29,
                                'requiredEquipment': {'Scout Drone': 3,
                                                      'Porta Lab': 1},
                                'Health Effect': 14,
                                'startMessage': 'ECHO: Embark on a cosmic '
                                                'overture with the '
                                                'Zeraphans. Foil the '
                                                "Corporation's attempt to "
                                                'disrupt their cosmic '
                                                'symphony.',
                                'successMessage': 'ECHO: Cosmic overture '
                                                  'completed successfully. '
                                                  'Zeraphan cosmic symphony '
                                                  'safeguarded, earning you '
                                                  '{reward} credits and '
                                                  '{experience} experience.',
                                'failureMessage': 'ECHO: Our attempt to '
                                                  'navigate the cosmic '
                                                  'overture faced '
                                                  'challenges. We must '
                                                  'ensure Zeraphan cosmic '
                                                  'harmony.'},
 'Infiltrate Logging Facilities': {'Required Credits': 43800,
                                   'Required Energy': 56,
                                   'Reward': 277549,
                                   'Experience': 1200,
                                   'Rank': 30,
                                   'requiredEquipment': {'Oxygen Rebreather': 3,
                                                         'Laser Sword': 2},
                                   'Health Effect': 15,
                                   'startMessage': 'ECHO: The time has come, '
                                                   'Jahntow. Begin the '
                                                   "united alliance's cosmic "
                                                   'confrontation against '
                                                   'the Space Corporation. '
                                                   'This is the first step '
                                                   'towards liberation.',
                                   'successMessage': 'ECHO: Part 1 of the '
                                                     'cosmic confrontation '
                                                     'completed '
                                                     'successfully. Your '
                                                     'alliance advances, '
                                                     'earning you {reward} '
                                                     'credits and '
                                                     '{experience} '
                                                     'experience. The fight '
                                                     'gains momentum.',
                                   'failureMessage': 'ECHO: Our attempt to '
                                                     'begin the cosmic '
                                                     'confrontation faced '
                                                     'resistance. The fight '
                                                     "is not over; we'll "
                                                     'keep pushing forward.'},
 'Ambush Vortex Forces': {'Required Credits': 45240,
                          'Required Energy': 58,
                          'Reward': 291567,
                          'Experience': 1240,
                          'Rank': 31,
                          'requiredEquipment': {'Invisi Veil': 4,
                                                'Basic Ship': 3},
                          'Health Effect': 16,
                          'startMessage': 'ECHO: Continue the cosmic '
                                          'confrontation, Jahntow. This is '
                                          'the second part of the united '
                                          "alliance's struggle. Together, "
                                          "we'll break the Corporation's "
                                          'grasp.',
                          'successMessage': 'ECHO: Part 2 of the cosmic '
                                            'confrontation completed '
                                            'successfully. Your alliance '
                                            'grows stronger, earning you '
                                            '{reward} credits and '
                                            '{experience} experience. The '
                                            'path to victory is clear.',
                          'failureMessage': 'ECHO: Our attempt to advance '
                                            'the cosmic confrontation faced '
                                            'challenges. The united alliance '
                                            "remains resolute; we'll "
                                            'overcome.'},
 'Foil Vortex Trapping': {'Required Credits': 46680,
                          'Required Energy': 59,
                          'Reward': 305897,
                          'Experience': 1280,
                          'Rank': 32,
                          'requiredEquipment': {'Alien Skin Armor': 1,
                                                'Cyber Armor': 4},
                          'Health Effect': 16,
                          'startMessage': 'ECHO: Jahntow, this is the final '
                                          'push. Lead the united alien '
                                          'alliance in the ultimate cosmic '
                                          'confrontation against the Space '
                                          'Corporation. The time for '
                                          'liberation is now.',
                          'successMessage': 'ECHO: The cosmic confrontation '
                                            'is victorious. The united alien '
                                            'alliance triumphs, earning you '
                                            '{reward} credits and '
                                            '{experience} experience. The '
                                            'cosmos is free once more.',
                          'failureMessage': 'ECHO: Our attempt at the final '
                                            'cosmic confrontation faced '
                                            'tremendous adversity. But '
                                            'remember, the spirit of unity '
                                            'endures.'},
 'Destroy Bioweapon Stockpiles': {'Required Credits': 48120,
                                  'Required Energy': 61,
                                  'Reward': 320538,
                                  'Experience': 1320,
                                  'Rank': 33,
                                  'requiredEquipment': {'Bio Collector': 2,
                                                        'Alien Army': 1},
                                  'Health Effect': 16,
                                  'startMessage': 'ECHO: Jahntow, this is '
                                                  'the final push. Lead the '
                                                  'united alien alliance in '
                                                  'the ultimate cosmic '
                                                  'confrontation against the '
                                                  'Space Corporation. The '
                                                  'time for liberation is '
                                                  'now.',
                                  'successMessage': 'ECHO: The cosmic '
                                                    'confrontation is '
                                                    'victorious. The united '
                                                    'alien alliance '
                                                    'triumphs, earning you '
                                                    '{reward} credits and '
                                                    '{experience} '
                                                    'experience. The cosmos '
                                                    'is free once more.',
                                  'failureMessage': 'ECHO: Our attempt at '
                                                    'the final cosmic '
                                                    'confrontation faced '
                                                    'tremendous adversity. '
                                                    'But remember, the '
                                                    'spirit of unity '
                                                    'endures.'},
 'Learn Forest Regrowth Rituals': {'Required Credits': 51000,
                                   'Required Energy': 64,
                                   'Reward': 350755,
                                   'Experience': 1400,
                                   'Rank': 35,
                                   'requiredEquipment': {'Terrain Scanner': 3,
                                                         'Environmental Suit': 2},
                                   'Health Effect': 18,
                                   'startMessage': 'ECHO: Jahntow, this is '
                                                   'the final push. Lead the '
                                                   'united alien alliance in '
                                                   'the ultimate cosmic '
                                                   'confrontation against '
                                                   'the Space Corporation. '
                                                   'The time for liberation '
                                                   'is now.',
                                   'successMessage': 'ECHO: The cosmic '
                                                     'confrontation is '
                                                     'victorious. The united '
                                                     'alien alliance '
                                                     'triumphs, earning you '
                                                     '{reward} credits and '
                                                     '{experience} '
                                                     'experience. The cosmos '
                                                     'is free once more.',
                                   'failureMessage': 'ECHO: Our attempt at '
                                                     'the final cosmic '
                                                     'confrontation faced '
                                                     'tremendous adversity. '
                                                     'But remember, the '
                                                     'spirit of unity '
                                                     'endures.'},
 'Defend the Heart of the Forest': {'Required Credits': 52440,
                                    'Required Energy': 66,
                                    'Reward': 366331,
                                    'Experience': 1440,
                                    'Rank': 36,
                                    'requiredEquipment': {'Steel Machete': 4,
                                                          'Plasma Blade': 3},
                                    'Health Effect': 18,
                                    'startMessage': 'ECHO: Jahntow, this is '
                                                    'the final push. Lead '
                                                    'the united alien '
                                                    'alliance in the '
                                                    'ultimate cosmic '
                                                    'confrontation against '
                                                    'the Space Corporation. '
                                                    'The time for liberation '
                                                    'is now.',
                                    'successMessage': 'ECHO: The cosmic '
                                                      'confrontation is '
                                                      'victorious. The '
                                                      'united alien alliance '
                                                      'triumphs, earning you '
                                                      '{reward} credits and '
                                                      '{experience} '
                                                      'experience. The '
                                                      'cosmos is free once '
                                                      'more.',
                                    'failureMessage': 'ECHO: Our attempt at '
                                                      'the final cosmic '
                                                      'confrontation faced '
                                                      'tremendous adversity. '
                                                      'But remember, the '
                                                      'spirit of unity '
                                                      'endures.'},
 'Scout Vortex Facilities': {'Required Credits': 53880,
                             'Required Energy': 67,
                             'Reward': 382218,
                             'Experience': 1480,
                             'Rank': 37,
                             'requiredEquipment': {'Jet Pack': 1,
                                                   'Alien Squad': 4},
                             'Health Effect': 18,
                             'startMessage': 'ECHO: Jahntow, this is the '
                                             'final push. Lead the united '
                                             'alien alliance in the ultimate '
                                             'cosmic confrontation against '
                                             'the Space Corporation. The '
                                             'time for liberation is now.',
                             'successMessage': 'ECHO: The cosmic '
                                               'confrontation is victorious. '
                                               'The united alien alliance '
                                               'triumphs, earning you '
                                               '{reward} credits and '
                                               '{experience} experience. The '
                                               'cosmos is free once more.',
                             'failureMessage': 'ECHO: Our attempt at the '
                                               'final cosmic confrontation '
                                               'faced tremendous adversity. '
                                               'But remember, the spirit of '
                                               'unity endures.'},
 'Disrupt Executive Speeches': {'Required Credits': 55320,
                                'Required Energy': 69,
                                'Reward': 398417,
                                'Experience': 1520,
                                'Rank': 38,
                                'requiredEquipment': {'Teleporter Beacon': 2,
                                                      'Hover Board': 1},
                                'Health Effect': 19,
                                'startMessage': 'ECHO: Jahntow, this is the '
                                                'final push. Lead the united '
                                                'alien alliance in the '
                                                'ultimate cosmic '
                                                'confrontation against the '
                                                'Space Corporation. The time '
                                                'for liberation is now.',
                                'successMessage': 'ECHO: The cosmic '
                                                  'confrontation is '
                                                  'victorious. The united '
                                                  'alien alliance triumphs, '
                                                  'earning you {reward} '
                                                  'credits and {experience} '
                                                  'experience. The cosmos is '
                                                  'free once more.',
                                'failureMessage': 'ECHO: Our attempt at the '
                                                  'final cosmic '
                                                  'confrontation faced '
                                                  'tremendous adversity. But '
                                                  'remember, the spirit of '
                                                  'unity endures.'},
 'Make Vortex Mechs Malfunction': {'Required Credits': 56760,
                                   'Required Energy': 70,
                                   'Reward': 414927,
                                   'Experience': 1560,
                                   'Rank': 39,
                                   'requiredEquipment': {'Metalloid Armor': 3,
                                                         'Star Ship': 2},
                                   'Health Effect': 20,
                                   'startMessage': 'ECHO: Jahntow, this is '
                                                   'the final push. Lead the '
                                                   'united alien alliance in '
                                                   'the ultimate cosmic '
                                                   'confrontation against '
                                                   'the Space Corporation. '
                                                   'The time for liberation '
                                                   'is now.',
                                   'successMessage': 'ECHO: The cosmic '
                                                     'confrontation is '
                                                     'victorious. The united '
                                                     'alien alliance '
                                                     'triumphs, earning you '
                                                     '{reward} credits and '
                                                     '{experience} '
                                                     'experience. The cosmos '
                                                     'is free once more.',
                                   'failureMessage': 'ECHO: Our attempt at '
                                                     'the final cosmic '
                                                     'confrontation faced '
                                                     'tremendous adversity. '
                                                     'But remember, the '
                                                     'spirit of unity '
                                                     'endures.'},
 'Create Illusions to Confuse Vortex': {'Required Credits': 58200,
                                        'Required Energy': 72,
                                        'Reward': 431749,
                                        'Experience': 1600,
                                        'Rank': 40,
                                        'requiredEquipment': {'Holo Clone': 1,
                                                              'Alien Ally': 5},
                                        'Health Effect': 20,
                                        'startMessage': 'ECHO: Jahntow, this '
                                                        'is the final push. '
                                                        'Lead the united '
                                                        'alien alliance in '
                                                        'the ultimate cosmic '
                                                        'confrontation '
                                                        'against the Space '
                                                        'Corporation. The '
                                                        'time for liberation '
                                                        'is now.',
                                        'successMessage': 'ECHO: The cosmic '
                                                          'confrontation is '
                                                          'victorious. The '
                                                          'united alien '
                                                          'alliance '
                                                          'triumphs, earning '
                                                          'you {reward} '
                                                          'credits and '
                                                          '{experience} '
                                                          'experience. The '
                                                          'cosmos is free '
                                                          'once more.',
                                        'failureMessage': 'ECHO: Our attempt '
                                                          'at the final '
                                                          'cosmic '
                                                          'confrontation '
                                                          'faced tremendous '
                                                          'adversity. But '
                                                          'remember, the '
                                                          'spirit of unity '
                                                          'endures.'},
 'Lead Astral Projection Assaults': {'Required Credits': 61080,
                                     'Required Energy': 75,
                                     'Reward': 466327,
                                     'Experience': 1680,
                                     'Rank': 42,
                                     'requiredEquipment': {'Porta Lab': 2,
                                                           'Scout Drone': 1},
                                     'Health Effect': 21,
                                     'startMessage': 'ECHO: Jahntow, this is '
                                                     'the final push. Lead '
                                                     'the united alien '
                                                     'alliance in the '
                                                     'ultimate cosmic '
                                                     'confrontation against '
                                                     'the Space Corporation. '
                                                     'The time for '
                                                     'liberation is now.',
                                     'successMessage': 'ECHO: The cosmic '
                                                       'confrontation is '
                                                       'victorious. The '
                                                       'united alien '
                                                       'alliance triumphs, '
                                                       'earning you {reward} '
                                                       'credits and '
                                                       '{experience} '
                                                       'experience. The '
                                                       'cosmos is free once '
                                                       'more.',
                                     'failureMessage': 'ECHO: Our attempt at '
                                                       'the final cosmic '
                                                       'confrontation faced '
                                                       'tremendous '
                                                       'adversity. But '
                                                       'remember, the spirit '
                                                       'of unity endures.'},
 'Final Psychic Showdown': {'Required Credits': 62520,
                            'Required Energy': 77,
                            'Reward': 484083,
                            'Experience': 1720,
                            'Rank': 43,
                            'requiredEquipment': {'Laser Sword': 3,
                                                  'Oxygen Rebreather': 2},
                            'Health Effect': 22,
                            'startMessage': 'ECHO: Jahntow, this is the '
                                            'final push. Lead the united '
                                            'alien alliance in the ultimate '
                                            'cosmic confrontation against '
                                            'the Space Corporation. The time '
                                            'for liberation is now.',
                            'successMessage': 'ECHO: The cosmic '
                                              'confrontation is victorious. '
                                              'The united alien alliance '
                                              'triumphs, earning you '
                                              '{reward} credits and '
                                              '{experience} experience. The '
                                              'cosmos is free once more.',
                            'failureMessage': 'ECHO: Our attempt at the '
                                              'final cosmic confrontation '
                                              'faced tremendous adversity. '
                                              'But remember, the spirit of '
                                              'unity endures.'},
 'Vortex Corp: Infiltration': {'Required Credits': 63960,
                               'Required Energy': 78,
                               'Reward': 502151,
                               'Experience': 1760,
                               'Rank': 44,
                               'requiredEquipment': {'Basic Ship': 4,
                                                     'Invisi Veil': 3},
                               'Health Effect': 22,
                               'startMessage': 'ECHO: Jahntow, this is the '
                                               'final push. Lead the united '
                                               'alien alliance in the '
                                               'ultimate cosmic '
                                               'confrontation against the '
                                               'Space Corporation. The time '
                                               'for liberation is now.',
                               'successMessage': 'ECHO: The cosmic '
                                                 'confrontation is '
                                                 'victorious. The united '
                                                 'alien alliance triumphs, '
                                                 'earning you {reward} '
                                                 'credits and {experience} '
                                                 'experience. The cosmos is '
                                                 'free once more.',
                               'failureMessage': 'ECHO: Our attempt at the '
                                                 'final cosmic confrontation '
                                                 'faced tremendous '
                                                 'adversity. But remember, '
                                                 'the spirit of unity '
                                                 'endures.'},
 'Vortex Corp: Inside the Fortress': {'Required Credits': 65400,
                                      'Required Energy': 80,
                                      'Reward': 520531,
                                      'Experience': 1800,
                                      'Rank': 45,
                                      'requiredEquipment': {'Cyber Armor': 5,
                                                            'Alien Skin Armor': 4},
                                      'Health Effect': 22,
                                      'startMessage': 'ECHO: Jahntow, this '
                                                      'is the final push. '
                                                      'Lead the united alien '
                                                      'alliance in the '
                                                      'ultimate cosmic '
                                                      'confrontation against '
                                                      'the Space '
                                                      'Corporation. The time '
                                                      'for liberation is '
                                                      'now.',
                                      'successMessage': 'ECHO: The cosmic '
                                                        'confrontation is '
                                                        'victorious. The '
                                                        'united alien '
                                                        'alliance triumphs, '
                                                        'earning you '
                                                        '{reward} credits '
                                                        'and {experience} '
                                                        'experience. The '
                                                        'cosmos is free once '
                                                        'more.',
                                      'failureMessage': 'ECHO: Our attempt '
                                                        'at the final cosmic '
                                                        'confrontation faced '
                                                        'tremendous '
                                                        'adversity. But '
                                                        'remember, the '
                                                        'spirit of unity '
                                                        'endures.'},
 'Vortex Corp: Betrayal': {'Required Credits': 66840,
                           'Required Energy': 82,
                           'Reward': 539221,
                           'Experience': 1840,
                           'Rank': 46,
                           'requiredEquipment': {'Alien Army': 1,
                                                 'Bio Collector': 5},
                           'Health Effect': 23,
                           'startMessage': 'ECHO: Jahntow, this is the final '
                                           'push. Lead the united alien '
                                           'alliance in the ultimate cosmic '
                                           'confrontation against the Space '
                                           'Corporation. The time for '
                                           'liberation is now.',
                           'successMessage': 'ECHO: The cosmic confrontation '
                                             'is victorious. The united '
                                             'alien alliance triumphs, '
                                             'earning you {reward} credits '
                                             'and {experience} experience. '
                                             'The cosmos is free once more.',
                           'failureMessage': 'ECHO: Our attempt at the final '
                                             'cosmic confrontation faced '
                                             'tremendous adversity. But '
                                             'remember, the spirit of unity '
                                             'endures.'},
 'Vortex Corp: Disabling the Defenses': {'Required Credits': 69720,
                                         'Required Energy': 85,
                                         'Reward': 577538,
                                         'Experience': 1920,
                                         'Rank': 48,
                                         'requiredEquipment': {'Environmental Suit': 2,
                                                               'Terrain Scanner': 1},
                                         'Health Effect': 24,
                                         'startMessage': 'ECHO: Jahntow, '
                                                         'this is the final '
                                                         'push. Lead the '
                                                         'united alien '
                                                         'alliance in the '
                                                         'ultimate cosmic '
                                                         'confrontation '
                                                         'against the Space '
                                                         'Corporation. The '
                                                         'time for '
                                                         'liberation is now.',
                                         'successMessage': 'ECHO: The cosmic '
                                                           'confrontation is '
                                                           'victorious. The '
                                                           'united alien '
                                                           'alliance '
                                                           'triumphs, '
                                                           'earning you '
                                                           '{reward} credits '
                                                           'and {experience} '
                                                           'experience. The '
                                                           'cosmos is free '
                                                           'once more.',
                                         'failureMessage': 'ECHO: Our '
                                                           'attempt at the '
                                                           'final cosmic '
                                                           'confrontation '
                                                           'faced tremendous '
                                                           'adversity. But '
                                                           'remember, the '
                                                           'spirit of unity '
                                                           'endures.'},
 'Vortex Corp: Confrontation with Xaezor': {'Required Credits': 71160,
                                            'Required Energy': 86,
                                            'Reward': 597163,
                                            'Experience': 1960,
                                            'Rank': 49,
                                            'requiredEquipment': {'Plasma Blade': 3,
                                                                  'Steel Machete': 2},
                                            'Health Effect': 24,
                                            'startMessage': 'ECHO: Jahntow, '
                                                            'this is the '
                                                            'final push. '
                                                            'Lead the united '
                                                            'alien alliance '
                                                            'in the ultimate '
                                                            'cosmic '
                                                            'confrontation '
                                                            'against the '
                                                            'Space '
                                                            'Corporation. '
                                                            'The time for '
                                                            'liberation is '
                                                            'now.',
                                            'successMessage': 'ECHO: The '
                                                              'cosmic '
                                                              'confrontation '
                                                              'is '
                                                              'victorious. '
                                                              'The united '
                                                              'alien '
                                                              'alliance '
                                                              'triumphs, '
                                                              'earning you '
                                                              '{reward} '
                                                              'credits and '
                                                              '{experience} '
                                                              'experience. '
                                                              'The cosmos is '
                                                              'free once '
                                                              'more.',
                                            'failureMessage': 'ECHO: Our '
                                                              'attempt at '
                                                              'the final '
                                                              'cosmic '
                                                              'confrontation '
                                                              'faced '
                                                              'tremendous '
                                                              'adversity. '
                                                              'But remember, '
                                                              'the spirit of '
                                                              'unity '
                                                              'endures.'},
 'Victory and Aftermath': {'Required Credits': 72600,
                           'Required Energy': 88,
                           'Reward': 617100,
                           'Experience': 2000,
                           'Rank': 50,
                           'requiredEquipment': {'Alien Squad': 2,
                                                 'Jet Pack': 1},
                           'Health Effect': 25,
                           'startMessage': 'ECHO: Jahntow, this is the final '
                                           'push. Lead the united alien '
                                           'alliance in the ultimate cosmic '
                                           'confrontation against the Space '
                                           'Corporation. The time for '
                                           'liberation is now.',
                           'successMessage': 'ECHO: The cosmic confrontation '
                                             'is victorious. The united '
                                             'alien alliance triumphs, '
                                             'earning you {reward} credits '
                                             'and {experience} experience. '
                                             'The cosmos is free once more.',
                           'failureMessage': 'ECHO: Our attempt at the final '
                                             'cosmic confrontation faced '
                                             'tremendous adversity. But '
                                             'remember, the spirit of unity '
                                             'endures.'}}


PROPERTIES = {'Energy Labs': {'Fusion Facility': {'Base Cost': 3482,
                                     'Item Generated': 'Alpha Core',
                                     'Generation Rate': 0.5803,
                                     'Rank': 4},
                 'Quantum Lab': {'Base Cost': 9190,
                                 'Item Generated': 'Fusion Core',
                                 'Generation Rate': 0.4847,
                                 'Rank': 8},
                 'Omega Factory': {'Base Cost': 53087,
                                   'Item Generated': 'Omega Core',
                                   'Generation Rate': 0.0088,
                                   'Rank': 28},
                 'Fusion Supercollider': {'Base Cost': 33145,
                                          'Item Generated': 'Alpha Core',
                                          'Generation Rate': 5.5242,
                                          'Rank': 20},
                 'Quantum Superlab': {'Base Cost': 33145,
                                      'Item Generated': 'Fusion Core',
                                      'Generation Rate': 1.7482,
                                      'Rank': 20},
                 'Omega MegaFactory': {'Base Cost': 58471,
                                       'Item Generated': 'Omega Core',
                                       'Generation Rate': 0.0097,
                                       'Rank': 30}},
 'Nano Production Sites': {'NanoMesh Plant': {'Base Cost': 3482,
                                              'Item Generated': 'NanoMesh',
                                              'Generation Rate': 0.2902,
                                              'Rank': 4},
                           'HyperWeave Workshop': {'Base Cost': 9190,
                                                   'Item Generated': 'HyperWeave',
                                                   'Generation Rate': 0.2957,
                                                   'Rank': 8},
                           'Quantum Fabric Loom': {'Base Cost': 66817,
                                                   'Item Generated': 'Quantum '
                                                                     'Fabric',
                                                   'Generation Rate': 0.0056,
                                                   'Rank': 33},
                           'NanoMesh MegaPlant': {'Base Cost': 12559,
                                                  'Item Generated': 'NanoMesh',
                                                  'Generation Rate': 1.0466,
                                                  'Rank': 10},
                           'HyperWeave MegaWorkshop': {'Base Cost': 33145,
                                                       'Item Generated': 'HyperWeave',
                                                       'Generation Rate': 1.0664,
                                                       'Rank': 20},
                           'Quantum Fabric MegaLoom': {'Base Cost': 58471,
                                                       'Item Generated': 'Quantum '
                                                                         'Fabric',
                                                       'Generation Rate': 0.0049,
                                                       'Rank': 30}},
 'Cybernetic Clinics': {'NeuroLink Clinic': {'Base Cost': 3482,
                                             'Item Generated': 'NeuroLink',
                                             'Generation Rate': 0.1451,
                                             'Rank': 4},
                        'SynthArm Surgery': {'Base Cost': 9190,
                                             'Item Generated': 'SynthArm',
                                             'Generation Rate': 0.0615,
                                             'Rank': 8},
                        'OmegaBrain Center': {'Base Cost': 53087,
                                              'Item Generated': 'OmegaBrain',
                                              'Generation Rate': 0.0022,
                                              'Rank': 28},
                        'NeuroLink MegaClinic': {'Base Cost': 22156,
                                                 'Item Generated': 'NeuroLink',
                                                 'Generation Rate': 0.9232,
                                                 'Rank': 15},
                        'SynthArm MegaSurgery': {'Base Cost': 33145,
                                                 'Item Generated': 'SynthArm',
                                                 'Generation Rate': 0.2219,
                                                 'Rank': 20},
                        'OmegaBrain MegaCenter': {'Base Cost': 58471,
                                                  'Item Generated': 'OmegaBrain',
                                                  'Generation Rate': 0.0024,
                                                  'Rank': 30}},
 'Data Cube Manufactures': {'Data Shard Factory': {'Base Cost': 3482,
                                                   'Item Generated': 'Data '
                                                                     'Shard',
                                                   'Generation Rate': 0.0967,
                                                   'Rank': 4},
                            'Quantum Node Works': {'Base Cost': 9190,
                                                   'Item Generated': 'Quantum '
                                                                     'Node',
                                                   'Generation Rate': 0.0214,
                                                   'Rank': 8},
                            'Infinity Matrix Hub': {'Base Cost': 53087,
                                                    'Item Generated': 'Infinity '
                                                                      'Matrix',
                                                    'Generation Rate': 0.0015,
                                                    'Rank': 28},
                            'Data Shard MegaFactory': {'Base Cost': 22156,
                                                       'Item Generated': 'Data '
                                                                         'Shard',
                                                       'Generation Rate': 0.6154,
                                                       'Rank': 15},
                            'Quantum Node MegaWorks': {'Base Cost': 45299,
                                                       'Item Generated': 'Quantum '
                                                                         'Node',
                                                       'Generation Rate': 0.1054,
                                                       'Rank': 25},
                            'Infinity Matrix MegaHub': {'Base Cost': 72555,
                                                        'Item Generated': 'Infinity '
                                                                          'Matrix',
                                                        'Generation Rate': 0.002,
                                                        'Rank': 35}},
 'Medical Facilities': {'BioPatch Pharmacy': {'Base Cost': 3482,
                                              'Item Generated': 'BioPatch',
                                              'Generation Rate': 0.0725,
                                              'Rank': 4},
                        'NanoSyringe Clinic': {'Base Cost': 9190,
                                               'Item Generated': 'NanoSyringe',
                                               'Generation Rate': 0.0213,
                                               'Rank': 8},
                        'RegenGen Hospital': {'Base Cost': 53087,
                                              'Item Generated': 'RegenGen',
                                              'Generation Rate': 0.0011,
                                              'Rank': 28},
                        'BioPatch MegaPharmacy': {'Base Cost': 22156,
                                                  'Item Generated': 'BioPatch',
                                                  'Generation Rate': 0.4616,
                                                  'Rank': 15},
                        'NanoSyringe MegaClinic': {'Base Cost': 45299,
                                                   'Item Generated': 'NanoSyringe',
                                                   'Generation Rate': 0.1048,
                                                   'Rank': 25},
                        'RegenGen MegaHospital': {'Base Cost': 72555,
                                                  'Item Generated': 'RegenGen',
                                                  'Generation Rate': 0.0015,
                                                  'Rank': 35}},
 'Encryption Enterprises': {'Cryptex Workshop': {'Base Cost': 3482,
                                                 'Item Generated': 'Cryptex',
                                                 'Generation Rate': 0.058,
                                                 'Rank': 4},
                            'Quantum Lock Forge': {'Base Cost': 47856,
                                                   'Item Generated': 'Quantum '
                                                                     'Lock',
                                                   'Generation Rate': 0.0548,
                                                   'Rank': 26},
                            'Omega Seal Center': {'Base Cost': 53087,
                                                  'Item Generated': 'Omega '
                                                                    'Seal',
                                                  'Generation Rate': 0.001,
                                                  'Rank': 28},
                            'Cryptex MegaWorkshop': {'Base Cost': 45299,
                                                     'Item Generated': 'Cryptex',
                                                     'Generation Rate': 0.755,
                                                     'Rank': 25},
                            'Quantum Lock MegaForge': {'Base Cost': 72555,
                                                       'Item Generated': 'Quantum '
                                                                         'Lock',
                                                       'Generation Rate': 0.083,
                                                       'Rank': 35},
                            'Omega Seal MegaCenter': {'Base Cost': 87469,
                                                      'Item Generated': 'Omega '
                                                                        'Seal',
                                                      'Generation Rate': 0.0015,
                                                      'Rank': 40}}}


EQUIPMENT = {'Research': {'Spectral Analyzer': {'Base Cost': 50, 'Required Level': 1},
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
