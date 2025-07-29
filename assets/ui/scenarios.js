// Final Buzzer Trail Scenarios - Oregon Trail Style Sports Adventures

const SCENARIOS = {
  // Training Ground Scenarios
  training: {
    initialTraining: {
      image: '🏋️',
      title: 'First Training Session',
      text: 'You step into the training facility for the first time. The equipment gleams under the arena lights, and you can hear the sounds of other athletes pushing their limits. A veteran trainer approaches you with a knowing smile.',
      decisions: [
        {
          text: '💪 Intense Training Session',
          outcome: 'High skill gain, high energy cost • Risk of minor injury',
          action: 'intense-training',
          energyCost: 35,
          skillGain: 15,
          riskChance: 0.2
        },
        {
          text: '🎯 Focused Skill Practice',
          outcome: 'Moderate skill gain, moderate energy cost • Safe training',
          action: 'focused-training',
          energyCost: 20,
          skillGain: 10,
          riskChance: 0.05
        },
        {
          text: '📚 Study Game Footage',
          outcome: 'Mental preparation, low energy cost • Strategic advantage',
          action: 'study-footage',
          energyCost: 10,
          skillGain: 5,
          bonusType: 'strategy'
        },
        {
          text: '🤝 Train with Other Athletes',
          outcome: 'Social benefits, team building • Potential networking',
          action: 'group-training',
          energyCost: 25,
          skillGain: 8,
          bonusType: 'team'
        }
      ]
    }
  },

  // City-specific Scenarios
  cities: {
    akron: {
      arrival: {
        image: '🏭',
        title: 'Welcome to Akron - The Rubber City',
        text: 'You arrive in Akron, Ohio - birthplace of basketball and home to legendary athletes. The city buzzes with sports history, from LeBron James to the Akron Zips. Local athletes eye you curiously as you walk through the sports district.',
        decisions: [
          {
            text: '🏀 Challenge Local Basketball Players',
            outcome: 'Prove your skills on the court • High reward, high risk',
            action: 'akron-basketball-challenge',
            requirements: { energy: 30 }
          },
          {
            text: '🏛️ Visit Sports Hall of Fame',
            outcome: 'Learn from legends • Gain inspiration and knowledge',
            action: 'visit-hall-of-fame',
            requirements: { funds: 15 }
          },
          {
            text: '🛒 Shop at Local Sports Store',
            outcome: 'Purchase Akron-specific gear • Local discounts available',
            action: 'akron-shop'
          },
          {
            text: '🛤️ Continue to Buffalo',
            outcome: 'Move on without delay • Preserve resources',
            action: 'continue-journey',
            destination: 'buffalo'
          }
        ]
      },
      challenge: {
        image: '🏀',
        title: 'Street Ball Challenge',
        text: 'The local players have accepted your challenge. A crowd gathers around the outdoor court as the sun sets behind the Akron skyline. An old-timer shouts, "This is where legends are made!" You dribble the ball, feeling the weight of the moment.',
        decisions: [
          {
            text: '🔥 Play Aggressively',
            outcome: 'Show dominance early • Risk of conflicts or fouls',
            action: 'aggressive-play',
            successRate: 0.6,
            highReward: true
          },
          {
            text: '🧠 Play Smart and Strategic',
            outcome: 'Use technique over power • Higher success chance',
            action: 'strategic-play',
            successRate: 0.8,
            mediumReward: true
          },
          {
            text: '🤝 Focus on Teamwork',
            outcome: 'Build relationships while playing • Social benefits',
            action: 'team-play',
            successRate: 0.7,
            socialReward: true
          },
          {
            text: '🚶 Back Down from Challenge',
            outcome: 'Avoid confrontation • Small reputation loss',
            action: 'back-down',
            reputation: -5
          }
        ]
      }
    },

    buffalo: {
      arrival: {
        image: '🦬',
        title: 'Buffalo - City of Good Neighbors',
        text: 'Buffalo welcomes you with its famous resilience and sports passion. The city is known for its dedicated fans and harsh winters that forge tough athletes. Snow flurries dance in the air as you approach the sports complex.',
        decisions: [
          {
            text: '🏒 Winter Sports Training',
            outcome: 'Build cold-weather endurance • Unique skill development',
            action: 'winter-training',
            requirements: { energy: 25 }
          },
          {
            text: '🍕 Try Famous Buffalo Wings',
            outcome: 'Local culture experience • Health and morale boost',
            action: 'buffalo-wings',
            requirements: { funds: 10 }
          },
          {
            text: '🏟️ Visit Bills/Sabres Facilities',
            outcome: 'Learn from professional programs • Costly but valuable',
            action: 'pro-facilities',
            requirements: { funds: 50 }
          },
          {
            text: '🛤️ Continue to Cleveland',
            outcome: 'Press on through the cold • Weather challenges ahead',
            action: 'continue-journey',
            destination: 'cleveland'
          }
        ]
      }
    },

    cleveland: {
      arrival: {
        image: '🏭',
        title: 'Cleveland - The Comeback City',
        text: 'Cleveland greets you with its gritty determination and championship spirit. The city that broke curses and celebrates victories hard. You can feel the championship energy from the Cavaliers\' historic win still echoing through the streets.',
        decisions: [
          {
            text: '🏆 Visit Championship Sites',
            outcome: 'Draw inspiration from championship energy • Morale boost',
            action: 'championship-tour',
            requirements: { funds: 20 }
          },
          {
            text: '⚡ High-Intensity Training',
            outcome: 'Channel Cleveland\'s fighting spirit • Intense workout',
            action: 'cleveland-training',
            requirements: { energy: 40 }
          },
          {
            text: '🎭 Attend Local Sports Event',
            outcome: 'Study competition and network • Social benefits',
            action: 'sports-event',
            requirements: { funds: 25 }
          },
          {
            text: '🛤️ Head to Chicago',
            outcome: 'Journey to the Windy City • Long travel ahead',
            action: 'continue-journey',
            destination: 'chicago'
          }
        ]
      }
    }
  },

  // Sports-specific Training Scenarios
  sports: {
    soccer: {
      training: {
        image: '⚽',
        title: 'Soccer Skills Training',
        text: 'The soccer field stretches before you, perfectly manicured grass glistening with morning dew. Cones are set up for agility drills, and the goal beckons for shooting practice. You lace up your cleats, feeling the familiar anticipation.',
        decisions: [
          {
            text: '🏃 Sprint and Agility Drills',
            outcome: 'Boost speed and ball control • High energy expenditure',
            action: 'agility-training',
            energyCost: 30,
            skillBonus: { speed: 10, agility: 8 }
          },
          {
            text: '🎯 Precision Shooting Practice',
            outcome: 'Improve accuracy and power • Moderate energy cost',
            action: 'shooting-practice',
            energyCost: 20,
            skillBonus: { accuracy: 12, power: 6 }
          },
          {
            text: '🤹 Ball Control and Juggling',
            outcome: 'Master ball handling • Low energy, high technique',
            action: 'ball-control',
            energyCost: 15,
            skillBonus: { technique: 15 }
          },
          {
            text: '⚽ Penalty Kick Practice',
            outcome: 'Mental pressure training • Clutch performance skills',
            action: 'penalty-practice',
            energyCost: 10,
            skillBonus: { mental: 10, clutch: 8 }
          }
        ]
      }
    },

    basketball: {
      training: {
        image: '🏀',
        title: 'Basketball Court Session',
        text: 'The hardwood gleams under the gymnasium lights. The familiar sound of sneakers squeaking and balls bouncing fills the air. You grab a basketball, feeling its familiar texture, and prepare to elevate your game.',
        decisions: [
          {
            text: '🏀 Shooting Drills from All Positions',
            outcome: 'Improve shooting percentage • Build muscle memory',
            action: 'shooting-drills',
            energyCost: 25,
            skillBonus: { shooting: 12, consistency: 8 }
          },
          {
            text: '🦘 Vertical Jump and Dunking',
            outcome: 'Increase athleticism • High impact training',
            action: 'vertical-training',
            energyCost: 35,
            skillBonus: { vertical: 15, power: 10 }
          },
          {
            text: '🎯 Free Throw Marathon',
            outcome: 'Perfect your free throw form • Mental focus training',
            action: 'free-throw-practice',
            energyCost: 15,
            skillBonus: { freethrow: 20, mental: 5 }
          },
          {
            text: '⚡ Speed Dribbling Course',
            outcome: 'Enhance ball handling at speed • Agility boost',
            action: 'dribbling-course',
            energyCost: 20,
            skillBonus: { handling: 10, speed: 8 }
          }
        ]
      }
    },

    baseball: {
      training: {
        image: '⚾',
        title: 'Diamond Training Session',
        text: 'The baseball diamond stretches out perfectly, with fresh white lines and a pitcher\'s mound that seems to call your name. The crack of bat on ball echoes from other fields, and you step into the batter\'s box with determination.',
        decisions: [
          {
            text: '⚾ Batting Cage Marathon',
            outcome: 'Perfect your swing mechanics • Hand-eye coordination',
            action: 'batting-practice',
            energyCost: 30,
            skillBonus: { batting: 15, power: 8 }
          },
          {
            text: '🎯 Pitching Accuracy Training',
            outcome: 'Master different pitch types • Arm conditioning',
            action: 'pitching-practice',
            energyCost: 25,
            skillBonus: { pitching: 12, accuracy: 10 }
          },
          {
            text: '🏃 Base Running Drills',
            outcome: 'Improve speed and base stealing • Cardio intensive',
            action: 'base-running',
            energyCost: 20,
            skillBonus: { speed: 10, stealing: 8 }
          },
          {
            text: '🧤 Fielding and Glove Work',
            outcome: 'Enhance defensive skills • Reaction time',
            action: 'fielding-practice',
            energyCost: 18,
            skillBonus: { fielding: 12, reflexes: 6 }
          }
        ]
      }
    }
  },

  // Zombie Athlete Encounters
  zombies: {
    fallenChampion: {
      image: '🧟‍♂️',
      title: 'Fallen Champion Blocks Your Path',
      text: 'A corrupted former champion stands before you, their once-pristine athletic gear now tattered and stained. Their eyes glow with an unnatural hunger for competition. They were once great, but the plague has twisted their love of sport into something darker.',
      decisions: [
        {
          text: '⚔️ Challenge Them to Sports Combat',
          outcome: 'Honorable athletic duel • High risk, high reward',
          action: 'sports-duel',
          difficulty: 'hard',
          rewards: { funds: 75, emblems: 1 }
        },
        {
          text: '🏃 Try to Outrun Them',
          outcome: 'Use your speed to escape • Moderate energy cost',
          action: 'outrun-zombie',
          energyCost: 20,
          successRate: 0.7
        },
        {
          text: '🎯 Use Your Athletic Skills',
          outcome: 'Sport-specific escape technique • Class-dependent success',
          action: 'skill-escape',
          classDependent: true
        },
        {
          text: '🤝 Try to Reason with Them',
          outcome: 'Appeal to their former athletic spirit • Low success chance',
          action: 'reason-zombie',
          successRate: 0.3,
          uniqueReward: true
        }
      ]
    },

    corruptedTeam: {
      image: '👥',
      title: 'Pack of Fallen Athletes',
      text: 'A group of corrupted athletes surrounds you, moving with eerie coordination. They were once teammates, but now they hunt as a pack. Their synchronized movements are both impressive and terrifying.',
      decisions: [
        {
          text: '🔥 Fight Your Way Through',
          outcome: 'Battle multiple opponents • Very high risk',
          action: 'fight-pack',
          difficulty: 'extreme',
          energyCost: 50
        },
        {
          text: '🧠 Use Strategy to Divide Them',
          outcome: 'Turn their teamwork against them • Requires cunning',
          action: 'divide-pack',
          successRate: 0.6,
          skillRequired: 'strategy'
        },
        {
          text: '🏃 Find Another Route',
          outcome: 'Avoid confrontation entirely • Costs time and energy',
          action: 'avoid-pack',
          energyCost: 25,
          timeDelay: true
        },
        {
          text: '🎵 Use Team Chants/Songs',
          outcome: 'Try to awaken their team spirit • Unique approach',
          action: 'team-spirit',
          successRate: 0.4,
          uniqueOutcome: true
        }
      ]
    }
  },

  // Equipment Shop Scenarios
  shop: {
    generalStore: {
      image: '🏪',
      title: 'Athletic Equipment Emporium',
      text: 'The shop is packed with gleaming sports equipment, energy drinks, and training gear. The elderly shopkeeper, a former Olympic coach, watches you browse with knowing eyes. "Every champion needs the right tools," she says with a smile.',
      decisions: [
        {
          text: '⚡ Energy Drinks (3-pack)',
          outcome: '+60 Energy total • Perfect for intensive training',
          action: 'buy-energy-drinks',
          cost: 25,
          item: { type: 'consumable', effect: 'energy', amount: 60 }
        },
        {
          text: '🩹 First Aid Kit',
          outcome: '+40 Health restoration • Emergency medical supplies',
          action: 'buy-first-aid',
          cost: 30,
          item: { type: 'consumable', effect: 'health', amount: 40 }
        },
        {
          text: '👟 Premium Training Shoes',
          outcome: '+5 Speed permanently • Reduces energy costs',
          action: 'buy-shoes',
          cost: 80,
          item: { type: 'equipment', effect: 'speed', permanent: true }
        },
        {
          text: '🎯 Precision Training Gear',
          outcome: '+3 Accuracy permanently • Sport-specific bonuses',
          action: 'buy-precision-gear',
          cost: 60,
          item: { type: 'equipment', effect: 'accuracy', permanent: true }
        },
        {
          text: '📚 Champion\'s Training Manual',
          outcome: '+10% Experience gain • Knowledge is power',
          action: 'buy-manual',
          cost: 45,
          item: { type: 'book', effect: 'experience_bonus', permanent: true }
        },
        {
          text: '🚪 Leave Shop',
          outcome: 'Exit without purchasing • Save your funds',
          action: 'leave-shop'
        }
      ]
    }
  },

  // Random Events
  events: {
    foundEquipment: {
      image: '🎁',
      title: 'Abandoned Athletic Gear',
      text: 'You discover a sports bag left behind by another athlete. It contains some useful equipment, but you\'re not sure if it belongs to someone who might return for it.',
      decisions: [
        {
          text: '✅ Take the Equipment',
          outcome: 'Gain random sports gear • Moral ambiguity',
          action: 'take-equipment',
          moralChoice: true
        },
        {
          text: '📋 Leave a Note and Take It',
          outcome: 'Take gear but leave contact info • Compromise solution',
          action: 'take-with-note',
          reputation: 2
        },
        {
          text: '🚫 Leave It Alone',
          outcome: 'Maintain honor but miss opportunity • Moral high ground',
          action: 'leave-equipment',
          reputation: 5,
          moralBonus: true
        }
      ]
    },

    weatherChallenge: {
      image: '🌧️',
      title: 'Severe Weather Warning',
      text: 'Dark clouds gather overhead and weather alerts warn of an incoming storm. Training outdoors could be dangerous, but indoor facilities are crowded and expensive.',
      decisions: [
        {
          text: '⛈️ Train in the Storm',
          outcome: 'Mental toughness boost • Risk of injury or illness',
          action: 'storm-training',
          riskChance: 0.3,
          mentalBonus: 10
        },
        {
          text: '🏢 Pay for Indoor Facility',
          outcome: 'Safe training environment • Expensive but secure',
          action: 'indoor-training',
          cost: 35,
          safeTraining: true
        },
        {
          text: '⏰ Wait Out the Storm',
          outcome: 'No training today • Rest and recovery',
          action: 'wait-storm',
          restBonus: true,
          timeDelay: true
        },
        {
          text: '🏠 Find Shelter and Plan',
          outcome: 'Strategic planning time • Mental preparation',
          action: 'shelter-planning',
          strategyBonus: 5
        }
      ]
    }
  }
};

// Scenario Management Functions
class ScenarioManager {
  constructor() {
    this.currentScenario = null;
    this.scenarioHistory = [];
    this.availableScenarios = { ...SCENARIOS };
  }

  getScenario(category, type, subtype = null) {
    try {
      if (subtype) {
        return this.availableScenarios[category][type][subtype];
      }
      return this.availableScenarios[category][type];
    } catch (error) {
      console.error('Scenario not found:', category, type, subtype);
      return null;
    }
  }

  getRandomScenario(category) {
    const categoryScenarios = this.availableScenarios[category];
    if (!categoryScenarios) return null;

    const keys = Object.keys(categoryScenarios);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return categoryScenarios[randomKey];
  }

  // Get scenario based on player's athletic class
  getClassSpecificScenario(athleticClass, scenarioType) {
    const classMap = {
      soccer: 'soccer',
      basketball: 'basketball', 
      baseball: 'baseball',
      football: 'football',
      track: 'track',
      swimming: 'swimming'
    };

    const sportType = classMap[athleticClass];
    if (sportType && this.availableScenarios.sports[sportType]) {
      return this.availableScenarios.sports[sportType][scenarioType];
    }

    // Fallback to general scenario
    return this.getRandomScenario('training');
  }

  // Check if player meets scenario requirements
  canAccessScenario(scenario, playerState) {
    if (!scenario.decisions) return true;

    return scenario.decisions.some(decision => {
      if (!decision.requirements) return true;

      const reqs = decision.requirements;
      if (reqs.energy && playerState.energy < reqs.energy) return false;
      if (reqs.funds && playerState.funds < reqs.funds) return false;
      if (reqs.health && playerState.health < reqs.health) return false;

      return true;
    });
  }

  // Apply scenario outcome to player state
  applyOutcome(decision, playerState) {
    const outcome = {
      success: true,
      changes: {},
      message: '',
      nextScenario: null
    };

    // Apply costs
    if (decision.energyCost) {
      playerState.energy = Math.max(0, playerState.energy - decision.energyCost);
      outcome.changes.energy = -decision.energyCost;
    }

    if (decision.cost) {
      playerState.funds = Math.max(0, playerState.funds - decision.cost);
      outcome.changes.funds = -decision.cost;
    }

    // Apply benefits
    if (decision.skillGain) {
      playerState.skillPoints = (playerState.skillPoints || 0) + decision.skillGain;
      outcome.changes.skillPoints = decision.skillGain;
    }

    if (decision.rewards) {
      Object.keys(decision.rewards).forEach(key => {
        playerState[key] = (playerState[key] || 0) + decision.rewards[key];
        outcome.changes[key] = decision.rewards[key];
      });
    }

    // Handle risk/success rates
    if (decision.riskChance && Math.random() < decision.riskChance) {
      outcome.success = false;
      outcome.message = 'The risk didn\'t pay off this time...';
      // Apply negative consequences
      if (decision.riskPenalty) {
        Object.keys(decision.riskPenalty).forEach(key => {
          playerState[key] = Math.max(0, playerState[key] - decision.riskPenalty[key]);
          outcome.changes[key] = -decision.riskPenalty[key];
        });
      }
    }

    // Set next scenario if specified
    if (decision.destination) {
      outcome.nextScenario = {
        category: 'cities',
        type: decision.destination,
        subtype: 'arrival'
      };
    }

    return outcome;
  }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SCENARIOS, ScenarioManager };
} else {
  window.SCENARIOS = SCENARIOS;
  window.ScenarioManager = ScenarioManager;
}