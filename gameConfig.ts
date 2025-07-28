// Final Buzzer Trail - Oregon Trail Style Game Configuration

export const GAME_CONFIG = {
  // Core Game Settings
  GAME_NAME: 'Final Buzzer Trail',
  GAME_VERSION: '1.0.0',
  MAX_PLAYERS: 8,
  MIN_PLAYERS_TO_START: 1,
  
  // Journey Configuration
  TRAIL_DISTANCE: 2000, // Total miles to destination
  DAILY_TRAVEL_DISTANCE: {
    GRUELING: 20,    // Fast but risky
    STRENUOUS: 15,   // Moderate pace
    STEADY: 12,      // Safe but slow
    REST: 0          // No travel, rest day
  },
  
  // Starting Resources
  STARTING_SUPPLIES: {
    money: 1600,        // Starting cash
    food: 200,          // Pounds of food
    ammunition: 200,    // Rounds
    medicine: 20,       // Medicine units
    clothing: 40,       // Sets of clothing
    spare_parts: 20,    // Wagon repair parts
  },
  
  // Health System
  HEALTH_STATES: {
    EXCELLENT: 100,
    GOOD: 75,
    FAIR: 50,
    POOR: 25,
    VERY_POOR: 10,
    DEAD: 0
  },
  
  // Food Consumption (per person per day)
  FOOD_RATIONS: {
    FILLING: 3,      // pounds per person per day
    MEAGER: 2,       // moderate risk
    BARE_BONES: 1    // high risk of illness
  },
  
  // Weather Conditions
  WEATHER_TYPES: [
    'FAIR',
    'RAINY', 
    'HOT',
    'COLD',
    'STORMY',
    'FOG'
  ],
  
  // Random Events (probability per day)
  EVENT_CHANCES: {
    RIVER_CROSSING: 0.05,
    BROKEN_WAGON: 0.08,
    ILLNESS: 0.10,
    BANDIT_ATTACK: 0.03,
    WILDLIFE_ENCOUNTER: 0.15,
    TRADER_MEETING: 0.12,
    GOOD_WEATHER: 0.20,
    BAD_WEATHER: 0.15,
    FIND_SUPPLIES: 0.08,
    LOST_TRAIL: 0.06
  },
  
  // Store Prices (vary by location)
  STORE_PRICES: {
    food: 0.50,           // per pound
    ammunition: 0.05,     // per round
    medicine: 1.00,       // per unit
    clothing: 5.00,       // per set
    spare_parts: 2.00,    // per part
    wagon_repair: 50.00   // full repair
  },
  
  // Trail Landmarks/Stops
  LANDMARKS: [
    { name: 'Hindman, Kentucky', distance: 0, hasStore: true, isStart: true },
    { name: 'Kansas River Crossing', distance: 102, hasStore: false },
    { name: 'Big Blue River Crossing', distance: 185, hasStore: false },
    { name: 'Fort Kearny', distance: 304, hasStore: true },
    { name: 'Chimney Rock', distance: 554, hasStore: false },
    { name: 'Fort Laramie', distance: 640, hasStore: true },
    { name: 'Independence Rock', distance: 815, hasStore: false },
    { name: 'South Pass', distance: 947, hasStore: false },
    { name: 'Fort Bridger', distance: 1025, hasStore: true },
    { name: 'Soda Springs', distance: 1151, hasStore: false },
    { name: 'Fort Hall', distance: 1288, hasStore: true },
    { name: 'Snake River Crossing', distance: 1508, hasStore: false },
    { name: 'Blue Mountains', distance: 1753, hasStore: false },
    { name: 'The Dalles', distance: 1898, hasStore: true },
    { name: 'Oregon City', distance: 2000, hasStore: true, isEnd: true }
  ],
  
  // Character Classes/Professions (affects starting money and skills)
  PROFESSIONS: {
    BANKER: {
      name: 'Banker from Boston',
      startingMoney: 1600,
      description: 'You have excellent financial resources but limited wilderness skills.'
    },
    CARPENTER: {
      name: 'Carpenter from Ohio', 
      startingMoney: 800,
      description: 'Good at repairs and building. Moderate resources.'
    },
    FARMER: {
      name: 'Farmer from Illinois',
      startingMoney: 400,
      description: 'Experienced with livestock and weather. Limited money but good survival skills.'
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
  MENU = 'menu',
  CHARACTER_CREATION = 'character_creation', 
  STORE_SHOPPING = 'store_shopping',
  TRAVELING = 'traveling',
  CAMP = 'camp',
  EVENT = 'event',
  RIVER_CROSSING = 'river_crossing',
  GAME_OVER = 'game_over',
  VICTORY = 'victory'
}

export enum TravelPace {
  GRUELING = 'grueling',
  STRENUOUS = 'strenuous', 
  STEADY = 'steady',
  REST = 'rest'
}

export enum FoodRation {
  FILLING = 'filling',
  MEAGER = 'meager',
  BARE_BONES = 'bare_bones'
}

export enum WeatherType {
  FAIR = 'fair',
  RAINY = 'rainy',
  HOT = 'hot', 
  COLD = 'cold',
  STORMY = 'stormy',
  FOG = 'fog'
}

export enum HealthStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  VERY_POOR = 'very_poor',
  DEAD = 'dead'
}

// Type Definitions
export interface Supplies {
  money: number;
  food: number;
  ammunition: number;
  medicine: number;
  clothing: number;
  spare_parts: number;
}

export interface PartyMember {
  name: string;
  health: number;
  status: HealthStatus;
  illness?: string;
  isPlayer: boolean;
}

export interface GameState {
  phase: GamePhase;
  currentDistance: number;
  supplies: Supplies;
  party: PartyMember[];
  currentLandmark: number;
  travelPace: TravelPace;
  foodRation: FoodRation;
  weather: WeatherType;
  daysOnTrail: number;
  profession: string;
}

export interface TrailEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  type: 'random' | 'landmark' | 'weather' | 'illness';
}

export interface EventChoice {
  text: string;
  consequences: {
    supplies?: Partial<Supplies>;
    health?: number;
    message: string;
    success_chance?: number;
  };
}