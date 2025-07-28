// Final Buzzer Trail - Sports Arena MMORPG Game Configuration

export const GAME_CONFIG = {
  // Core Game Settings
  GAME_NAME: 'Final Buzzer Trail',
  GAME_VERSION: '1.0.0',
  MAX_PLAYERS: 50,
  MIN_PLAYERS_TO_START: 1,
  
  // Arena Prime Regions
  REGIONS: {
    CHAMPION_CITY: { name: 'Champion City', unlockLevel: 1 },
    VERDANT_VALLEY: { name: 'Verdant Valley (Forest Zone)', unlockLevel: 5 },
    CORAL_COAST: { name: 'Coral Coast (Beach Zone)', unlockLevel: 10 },
    SUMMIT_HEIGHTS: { name: 'Summit Heights (Mountain Zone)', unlockLevel: 15 },
    STREET_ARENA: { name: 'Street Sports Arena (Urban Zone)', unlockLevel: 20 }
  },
  
  // Starting Resources
  STARTING_SUPPLIES: {
    team_funds: 100,     // Team money for expenses
    energy: 100,        // Athletic stamina
    health: 100,        // Player health
    equipment_durability: 100, // Sports gear condition
    skill_points: 5,    // For ability upgrades
    champion_emblems: 0, // Progress tokens
  },
  
  // Athletic Performance System
  PERFORMANCE_STATES: {
    PEAK_CONDITION: 100,
    EXCELLENT: 85,
    GOOD: 70,
    FAIR: 55,
    TIRED: 40,
    EXHAUSTED: 25,
    INJURED: 10
  },
  
  // Energy Consumption (per challenge)
  ENERGY_COSTS: {
    BASIC_CHALLENGE: 10,    // Simple sports mini-game
    INTERMEDIATE: 20,       // Standard quest
    ADVANCED: 35,          // Sport Champion challenge
    TOURNAMENT: 50         // Major competition
  },
  
  // Arena Conditions
  ARENA_CONDITIONS: [
    'PERFECT',     // Ideal playing conditions
    'WINDY',       // Affects ball trajectory
    'RAINY',       // Slippery surfaces
    'HOT',         // Increased energy drain
    'FOGGY',       // Reduced visibility
    'NIGHT'        // Different lighting
  ],
  
  // Random Sports Events (probability per quest)
  EVENT_CHANCES: {
    ZOMBIE_ATHLETE_ENCOUNTER: 0.15,  // Fallen athlete zombies
    EQUIPMENT_MALFUNCTION: 0.08,     // Gear breaks during play
    INJURY: 0.05,                    // Athletic injury
    RIVAL_TEAM_CHALLENGE: 0.12,      // Competitive encounter
    SKILL_TRAINER_MEETING: 0.10,     // Learn new abilities
    BONUS_CHALLENGE: 0.20,           // Extra $Topia opportunity
    WEATHER_ADVANTAGE: 0.15,         // Favorable conditions
    HIDDEN_TRAINING_AREA: 0.08,      // Discover secret location
    SPONSOR_OFFER: 0.06              // Equipment upgrades
  },
  
  // Sports Store Prices (in Team Funds)
  STORE_PRICES: {
    energy_drink: 5,        // Restore 25 energy
    basic_equipment: 20,    // Generic sports gear
    advanced_gear: 50,      // Sport-specific equipment
    skill_training: 30,     // Ability upgrade
    health_pack: 15,        // Heal injuries
    uniform_upgrade: 25     // Cosmetic enhancement
  },
  
  // Sports Cities Journey
  LANDMARKS: [
    { name: 'Akron, Ohio', distance: 0, hasStore: true, isStart: true, sport: 'Training Camp' },
    { name: 'Pittsburgh, Pennsylvania', distance: 134, hasStore: false, sport: 'Steelers Territory' },
    { name: 'Chicago, Illinois', distance: 458, hasStore: true, sport: 'Windy City Sports' },
    { name: 'Kansas City, Missouri', distance: 924, hasStore: true, sport: 'Chiefs Kingdom' },
    { name: 'Denver, Colorado', distance: 1318, hasStore: false, sport: 'Mile High Training' },
    { name: 'Phoenix, Arizona', distance: 1651, hasStore: true, sport: 'Desert Sports' },
    { name: 'Las Vegas, Nevada', distance: 1954, hasStore: false, sport: 'Sin City Showdown' },
    { name: 'Los Angeles, California', distance: 2224, hasStore: true, sport: 'Hollywood Sports' },
    { name: 'San Francisco, California', distance: 2604, hasStore: false, sport: 'Bay Area Challenge' },
    { name: 'Dallas, Texas', distance: 3104, hasStore: true, sport: 'Lone Star Sports' },
    { name: 'Atlanta, Georgia', distance: 3404, hasStore: false, sport: 'Southern Championship' },
    { name: 'Miami, Florida', distance: 3754, hasStore: true, sport: 'Tropical Tournament' },
    { name: 'Boston, Massachusetts', distance: 4124, hasStore: false, sport: 'New England Finals' },
    { name: 'New York City, New York', distance: 4324, hasStore: true, isEnd: true, sport: 'The Ultimate Championship' }
  ],
  
  // Athletic Classes/Specializations
  ATHLETIC_CLASSES: {
    SOCCER_STRIKER: {
      name: 'Soccer Striker',
      startingFunds: 120,
      specialAbility: 'Sprint Burst',
      description: 'Speed and precision specialist. Enhanced running and ball control.'
    },
    BASKETBALL_ALLSTAR: {
      name: 'Basketball All-Star',
      startingFunds: 110,
      specialAbility: 'Slam Dunk',
      description: 'Vertical movement master. Superior jumping and team coordination.'
    },
    BASEBALL_SLUGGER: {
      name: 'Baseball Slugger',
      startingFunds: 100,
      specialAbility: 'Home Run Swing',
      description: 'Power hitter with excellent aim. Ranged attack specialist.'
    },
    GRIDIRON_GUARDIAN: {
      name: 'Gridiron Guardian',
      startingFunds: 90,
      specialAbility: 'Tackle Charge',
      description: 'Tank-like defender. High health and protective abilities.'
    },
    TRACK_ATHLETE: {
      name: 'Track & Field Athlete',
      startingFunds: 105,
      specialAbility: 'Marathon Endurance',
      description: 'Endurance specialist. Enhanced stamina and mobility.'
    },
    SWIMMER_DIVER: {
      name: 'Swimmer/Diver',
      startingFunds: 115,
      specialAbility: 'Aqua Affinity',
      description: 'Aquatic specialist. Superior underwater performance.'
    }
  },
  
  // UI Configuration
  UI_SETTINGS: {
    ANIMATION_SPEED: 300,
    NOTIFICATION_DURATION: 3000,
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    MAP_UPDATE_INTERVAL: 1000,
    WEATHER_ANIMATION: true,
    SOUND_EFFECTS: true,
    BACKGROUND_MUSIC: true
  },
  
  // Game Balance
  DIFFICULTY_MODIFIERS: {
    EASY: {
      eventChanceMultiplier: 0.7,
      healthDecayRate: 0.8,
      resourceConsumption: 0.9
    },
    NORMAL: {
      eventChanceMultiplier: 1.0,
      healthDecayRate: 1.0,
      resourceConsumption: 1.0
    },
    HARD: {
      eventChanceMultiplier: 1.3,
      healthDecayRate: 1.2,
      resourceConsumption: 1.1
    }
  },
  
  // Map/World Settings (for minimal 3D world)
  WORLD_CONFIG: {
    SPAWN_REGION: {
      min: { x: -10, y: 30, z: -10 },
      max: { x: 10, y: 35, z: 10 }
    },
    TELEPORT_ZONES: {
      GENERAL_STORE: { x: 15, y: 1, z: 0 },
      TRAIL_MAP: { x: 0, y: 1, z: 15 },
      CAMP_AREA: { x: -15, y: 1, z: 0 },
      RIVER_CROSSING: { x: 0, y: 1, z: -15 }
    }
  }
};

// Game State Enums
export enum GamePhase {
  MAIN_MENU = 'main_menu',
  CHARACTER_SELECTION = 'character_selection',
  TRAINING_AREA = 'training_area',
  SPORT_CHALLENGE = 'sport_challenge',
  CHAMPION_BATTLE = 'champion_battle',
  EQUIPMENT_SHOP = 'equipment_shop',
  ZOMBIE_ENCOUNTER = 'zombie_encounter',
  TOURNAMENT = 'tournament',
  GAME_OVER = 'game_over',
  CHAMPION_VICTORY = 'champion_victory'
}

export enum TrainingIntensity {
  LIGHT_TRAINING = 'light_training',
  MODERATE_TRAINING = 'moderate_training',
  INTENSE_TRAINING = 'intense_training',
  CHAMPIONSHIP_PREP = 'championship_prep'
}

export enum SportType {
  SOCCER = 'soccer',
  BASKETBALL = 'basketball',
  BASEBALL = 'baseball',
  FOOTBALL = 'football',
  SWIMMING = 'swimming',
  TRACK_FIELD = 'track_field'
}

export enum ArenaCondition {
  PERFECT = 'perfect',
  WINDY = 'windy',
  RAINY = 'rainy',
  HOT = 'hot',
  FOGGY = 'foggy',
  NIGHT = 'night'
}

export enum AthleteCondition {
  PEAK_CONDITION = 'peak_condition',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  TIRED = 'tired',
  EXHAUSTED = 'exhausted',
  INJURED = 'injured'
}

// Type Definitions
export interface AthleteSupplies {
  team_funds: number;
  energy: number;
  health: number;
  equipment_durability: number;
  skill_points: number;
  champion_emblems: number;
}

export interface TeamMember {
  name: string;
  athleticPerformance: number;
  condition: AthleteCondition;
  sport: SportType;
  specialAbility?: string;
  isPlayer: boolean;
}

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  supplies: AthleteSupplies;
  team: TeamMember[];
  currentRegion: string;
  trainingIntensity: TrainingIntensity;
  primarySport: SportType;
  arenaCondition: ArenaCondition;
  daysTraining: number;
  athleticClass: string;
  championEmblemsCollected: number;
  zombieAthletesDefeated: number;
}

export interface SportsEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  type: 'zombie_encounter' | 'champion_challenge' | 'training' | 'equipment' | 'tournament';
  sport?: SportType;
  difficulty: 'easy' | 'medium' | 'hard' | 'champion';
}

export interface EventChoice {
  text: string;
  consequences: {
    supplies?: Partial<AthleteSupplies>;
    athleticPerformance?: number;
    message: string;
    success_chance?: number;
    tokensReward?: number;
    skillPointsGained?: number;
  };
}