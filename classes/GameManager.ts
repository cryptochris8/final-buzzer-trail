import {
  World,
  Player,
  GameServer,
} from 'hytopia';

import { GAME_CONFIG, GamePhase, GameState, AthleteSupplies, TeamMember, TrainingIntensity, SportType, ArenaCondition, AthleteCondition } from '../gameConfig';
import { TrailPlayerEntity } from './TrailPlayerEntity';
import { EventManager } from './EventManager';

export class GameManager {
  public static readonly instance = new GameManager();

  public world: World | undefined;
  private _players: Map<string, TrailPlayerEntity> = new Map();
  private _gameStates: Map<string, GameState> = new Map();
  private _eventManager: EventManager;
  private _challengeTimer: NodeJS.Timeout | undefined;
  private _isGameRunning: boolean = false;

  private constructor() {
    this._eventManager = new EventManager();
  }

  /**
   * Initialize the Arena Prime game world and systems
   */
  public setupGame(world: World): void {
    this.world = world;
    console.log('🏟️ GameManager: Setting up Arena Prime...');
    
    // Start the challenge cycle (every 45 seconds = 1 training session)
    this._startChallengeCycle();
    
    // Create sports arena world
    this._createArenaWorld();
    
    console.log('✅ GameManager: Arena Prime setup complete');
  }

  /**
   * Spawn a new athlete in Arena Prime
   */
  public spawnPlayer(player: Player): void {
    if (!this.world) return;

    console.log(`🏃 GameManager: Spawning athlete ${player.username}`);
    
    // Create player entity
    const playerEntity = new TrailPlayerEntity(player);
    playerEntity.spawn(this.world, GAME_CONFIG.WORLD_CONFIG.SPAWN_REGION.min);
    
    // Initialize player's game state
    const gameState: GameState = {
      phase: GamePhase.CHARACTER_SELECTION,
      currentLevel: 1,
      supplies: { ...GAME_CONFIG.STARTING_SUPPLIES },
      team: [
        { name: player.username, athleticPerformance: 100, condition: AthleteCondition.EXCELLENT, sport: SportType.SOCCER, isPlayer: true }
      ],
      currentRegion: 'CHAMPION_CITY',
      trainingIntensity: TrainingIntensity.MODERATE_TRAINING,
      primarySport: SportType.SOCCER,
      arenaCondition: ArenaCondition.PERFECT,
      daysTraining: 0,
      athleticClass: 'SOCCER_STRIKER', // Default, will be chosen by player
      championEmblemsCollected: 0,
      zombieAthletesDefeated: 0
    };

    // Store player and game state
    this._players.set(player.id, playerEntity);
    this._gameStates.set(player.id, gameState);

    // TrailPlayerEntity will handle the opening sequence and UI loading
    // _sendGameStateToPlayer will be called when main game starts
    
    console.log(`✅ GameManager: Athlete ${player.username} spawned successfully`);
  }

  /**
   * Remove a player from Arena Prime
   */
  public removePlayer(player: Player): void {
    console.log(`👋 GameManager: Removing athlete ${player.username}`);
    
    this._players.delete(player.id);
    this._gameStates.delete(player.id);
    
    console.log(`✅ GameManager: Athlete ${player.username} removed`);
  }

  /**
   * Update player count for all players
   */
  public updatePlayerCount(): void {
    if (!this.world) return;

    const playerCount = this._players.size;
    
    this._players.forEach(playerEntity => {
      playerEntity.player.ui.sendData({
        type: 'player-count',
        count: playerCount
      });
    });
  }

  /**
   * Handle athlete actions and sports challenges
   */
  public handlePlayerAction(player: Player, action: string, data?: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`⚽ GameManager: Athlete ${player.username} action: ${action}`);

    switch (action) {
      case 'initialize-game':
        this._handleGameInitialization(player, data);
        break;
      case 'select-athletic-class':
        this._handleClassSelection(player, data.class);
        break;
      case 'start-sport-challenge':
        this._handleSportChallenge(player, data);
        break;
      case 'open-equipment-shop':
        this._handleEquipmentShop(player);
        break;
      case 'purchase-item':
        this._handleItemPurchase(player, data);
        break;
      case 'zombie-encounter-triggered':
        this._handleZombieEncounter(player);
        break;
      case 'zombie-defeated':
        this._handleZombieDefeated(player, data.success);
        break;
      case 'zombie-avoided':
        this._handleZombieAvoided(player);
        break;
      case 'bonus-event':
        this._handleBonusEvent(player, data);
        break;
      case 'challenge-sport-champion':
        this._handleChampionChallenge(player, data);
        break;
      case 'open-equipment-shop':
        this._handleEquipmentShop(player);
        break;
      case 'shop-purchase':
        this._handleShopPurchase(player, data);
        break;
      case 'exit-shop':
        this._handleExitShop(player, data);
        break;
      case 'zombie-encounter-action':
        this._handleZombieEncounterAction(player, data);
        break;
      case 'zombie-encounter-complete':
        this._handleZombieEncounterComplete(player, data);
        break;
      case 'view-map':
        this._handleViewMap(player);
        break;
      case 'continue-journey':
        this._handleContinueJourney(player, data);
        break;
      case 'start-training':
        this._handleStartTraining(player, data);
        break;
      default:
        console.log(`⚠️ GameManager: Unknown action ${action}`);
    }
  }

  /**
   * Process training events for all athletes
   */
  private _processTrainingEvents(): void {
    this._players.forEach((playerEntity, playerId) => {
      const gameState = this._gameStates.get(playerId);
      if (!gameState || gameState.phase !== GamePhase.SPORT_CHALLENGE) return;

      // Advance training day
      gameState.daysTraining++;

      // Consume energy based on training intensity
      this._consumeEnergy(gameState);

      // Update arena conditions
      this._updateArenaConditions(gameState);

      // Check for random sports events
      this._checkRandomSportsEvents(playerEntity.player, gameState);

      // Update athletic performance
      this._updateAthleteCondition(gameState);

      // Check for level progression
      this._checkLevelProgression(playerEntity.player, gameState);

      // Send updated state to player
      this._sendGameStateToPlayer(playerEntity.player);
    });
  }

  /**
   * Send complete game state to player UI
   */
  private _sendGameStateToPlayer(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    player.ui.sendData({
      type: 'game-state-update',
      gameState: gameState,
      landmarks: GAME_CONFIG.LANDMARKS,
      currentRegion: this._getCurrentRegion(gameState)
    });
  }

  /**
   * Handle game initialization after opening sequence
   */
  private _handleGameInitialization(player: Player, data: { skipOpening?: boolean }): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🎮 GameManager: Initializing main game for ${player.username}${data.skipOpening ? ' (skipped opening)' : ''}`);

    // Send initial game state to the main UI
    this._sendGameStateToPlayer(player);

    // If opening was skipped, provide some context
    if (data.skipOpening) {
      player.ui.sendData({
        type: 'notification',
        message: 'Welcome to Final Buzzer Trail! Your athletic journey begins in Arena Prime.',
        style: 'info'
      });
    }

    // Set phase to character selection to ensure proper UI state
    gameState.phase = GamePhase.CHARACTER_SELECTION;
    this._sendGameStateToPlayer(player);
  }

  /**
   * Handle athletic class selection
   */
  private _handleClassSelection(player: Player, athleticClass: string): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    gameState.athleticClass = athleticClass;
    gameState.phase = GamePhase.TRAINING_AREA;

    // Update starting supplies based on class
    const classConfig = GAME_CONFIG.ATHLETIC_CLASSES[athleticClass as keyof typeof GAME_CONFIG.ATHLETIC_CLASSES];
    if (classConfig) {
      gameState.supplies.team_funds = classConfig.startingFunds;
      
      // Set primary sport based on class
      switch (athleticClass) {
        case 'SOCCER_STRIKER':
          gameState.primarySport = SportType.SOCCER;
          break;
        case 'BASKETBALL_ALLSTAR':
          gameState.primarySport = SportType.BASKETBALL;
          break;
        case 'BASEBALL_SLUGGER':
          gameState.primarySport = SportType.BASEBALL;
          break;
        case 'GRIDIRON_GUARDIAN':
          gameState.primarySport = SportType.FOOTBALL;
          break;
        case 'TRACK_ATHLETE':
          gameState.primarySport = SportType.TRACK_FIELD;
          break;
        case 'SWIMMER_DIVER':
          gameState.primarySport = SportType.SWIMMING;
          break;
      }
      
      // Update team member sport
      gameState.team[0].sport = gameState.primarySport;
    }

    this._sendGameStateToPlayer(player);

    this.world?.chatManager.sendPlayerMessage(
      player, 
      `You are now a ${classConfig?.name}! Begin your training to become a champion!`,
      '00AA00'
    );
  }

  /**
   * Handle sport challenges
   */
  private _handleSportChallenge(player: Player, challengeData: { class?: string, energyCost?: number }): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    const energyCost = challengeData.energyCost || GAME_CONFIG.ENERGY_COSTS.BASIC_CHALLENGE;
    
    if (gameState.supplies.energy < energyCost) {
      player.ui.sendData({
        type: 'challenge-result',
        success: false,
        message: 'Not enough energy for this challenge!'
      });
      return;
    }

    // Consume energy
    gameState.supplies.energy -= energyCost;
    
    // Challenge success rate based on athletic performance and conditions
    const baseSuccessRate = 0.7;
    const conditionModifier = this._getConditionModifier(gameState);
    const successRate = Math.min(0.95, baseSuccessRate + conditionModifier);
    
    const success = Math.random() < successRate;
    
    if (success) {
      const baseReward = 25;
      const bonusReward = Math.floor(Math.random() * 15) + 5;
      const totalReward = baseReward + bonusReward;
      
      gameState.supplies.team_funds += totalReward;
      
      // Experience gain
      const expGain = Math.floor(Math.random() * 20) + 10;
      this._addExperience(gameState, expGain);
      
      player.ui.sendData({
        type: 'challenge-result',
        success: true,
        message: `Challenge completed! Earned ${totalReward} Team Funds!`
      });
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        `🏆 Sport challenge completed! +${totalReward} Team Funds`,
        '00AA00'
      );
    } else {
      // Small consolation reward
      const consolationReward = 5;
      gameState.supplies.team_funds += consolationReward;
      
      player.ui.sendData({
        type: 'challenge-result',
        success: false,
        message: `Challenge failed, but you gained valuable experience! +${consolationReward} Team Funds`
      });
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        '💪 Challenge failed, but you\'re getting stronger!',
        'FFAA00'
      );
    }
    
    this._sendGameStateToPlayer(player);
  }

  /**
   * Handle equipment shop
   */
  private _handleEquipmentShop(player: Player): void {
    player.ui.sendData({
      type: 'shop-opened',
      items: GAME_CONFIG.STORE_PRICES
    });
  }

  /**
   * Handle item purchases
   */
  private _handleItemPurchase(player: Player, purchase: { item: string, cost: number }): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    const { item, cost } = purchase;
    
    if (gameState.supplies.team_funds >= cost) {
      gameState.supplies.team_funds -= cost;
      
      // Apply item effects
      switch (item) {
        case 'energy_drink':
          gameState.supplies.energy = Math.min(100, gameState.supplies.energy + 25);
          break;
        case 'health_pack':
          gameState.supplies.health = Math.min(100, gameState.supplies.health + 30);
          break;
        case 'training_gear':
          gameState.supplies.skill_points += 5;
          break;
      }
      
      this._sendGameStateToPlayer(player);
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        `Purchased ${item.replace('_', ' ')} for ${cost} Team Funds`,
        '00AA00'
      );
    } else {
      this.world?.chatManager.sendPlayerMessage(
        player,
        `Not enough Team Funds! Need ${cost}, have ${gameState.supplies.team_funds}`,
        'FF0000'
      );
    }
  }

  /**
   * Handle zombie athlete encounters
   */
  private _handleZombieEncounter(player: Player): void {
    this.world?.chatManager.sendPlayerMessage(
      player,
      '⚠️ A fallen athlete blocks your path! Once a champion, now corrupted...',
      'FF4444'
    );
  }

  /**
   * Handle zombie defeat results
   */
  private _handleZombieDefeated(player: Player, success: boolean): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    if (success) {
      gameState.zombieAthletesDefeated++;
      
      // Big reward for defeating fallen athletes
      const baseReward = 75;
      const bonusReward = Math.floor(Math.random() * 25);
      const totalReward = baseReward + bonusReward;
      
      gameState.supplies.team_funds += totalReward;
      gameState.supplies.energy -= 35;
      
      // Chance for champion emblem
      if (Math.random() < 0.15) {
        gameState.supplies.champion_emblems += 1;
        gameState.championEmblemsCollected++;
        
        player.ui.sendData({
          type: 'champion-emblem-earned'
        });
        
        this.world?.chatManager.sendPlayerMessage(
          player,
          '🏆 Champion Emblem recovered from the fallen athlete!',
          '00FF00'
        );
      }
      
      // Large experience gain
      this._addExperience(gameState, 35);
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        `💀 Fallen athlete defeated! Their spirit is at peace. +${totalReward} Team Funds`,
        '00AA00'
      );
    } else {
      gameState.supplies.health -= 30;
      gameState.supplies.energy -= 25;
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        '💥 The corrupted champion was too strong. You retreat wounded.',
        'FF0000'
      );
    }
    
    this._sendGameStateToPlayer(player);
  }

  /**
   * Handle zombie avoidance
   */
  private _handleZombieAvoided(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    gameState.supplies.energy -= 15;
    this._sendGameStateToPlayer(player);
    
    this.world?.chatManager.sendPlayerMessage(
      player,
      '🏃 You found another path around the fallen athlete.',
      '00AAFF'
    );
  }

  /**
   * Handle bonus events
   */
  private _handleBonusEvent(player: Player, eventData: any): void {
    this.world?.chatManager.sendPlayerMessage(
      player,
      '✨ ' + eventData.message,
      '00AA00'
    );
  }

  /**
   * Handle champion challenges
   */
  private _handleChampionChallenge(player: Player, championData: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    // This would be a major boss battle - placeholder for now
    this.world?.chatManager.sendPlayerMessage(
      player,
      '🥊 Sport Champion battles not yet implemented!',
      'FFAA00'
    );
  }

  /**
   * Add experience and handle level ups
   */
  private _addExperience(gameState: GameState, exp: number): void {
    // Experience is stored as a percentage towards next level
    const currentExp = gameState.currentLevel * 100 + (gameState as any).experience || 0;
    const newExp = currentExp + exp;
    
    const newLevel = Math.floor(newExp / 100);
    const remainingExp = newExp % 100;
    
    if (newLevel > gameState.currentLevel) {
      gameState.currentLevel = newLevel;
      (gameState as any).experience = remainingExp;
      
      // Level up bonuses
      gameState.supplies.skill_points += 3;
      gameState.supplies.team_funds += 20;
    } else {
      (gameState as any).experience = remainingExp;
    }
  }

  /**
   * Get condition modifier for success rates
   */
  private _getConditionModifier(gameState: GameState): number {
    let modifier = 0;
    
    // Health effects
    if (gameState.supplies.health > 80) modifier += 0.1;
    else if (gameState.supplies.health < 30) modifier -= 0.15;
    
    // Energy effects
    if (gameState.supplies.energy > 70) modifier += 0.05;
    else if (gameState.supplies.energy < 20) modifier -= 0.1;
    
    // Arena condition effects
    switch (gameState.arenaCondition) {
      case ArenaCondition.PERFECT:
        modifier += 0.1;
        break;
      case ArenaCondition.RAINY:
      case ArenaCondition.FOGGY:
        modifier -= 0.05;
        break;
      case ArenaCondition.HOT:
        modifier -= 0.03;
        break;
    }
    
    return modifier;
  }

  /**
   * Consume energy based on training intensity
   */
  private _consumeEnergy(gameState: GameState): void {
    const energyCosts = {
      [TrainingIntensity.LIGHT_TRAINING]: 5,
      [TrainingIntensity.MODERATE_TRAINING]: 10,
      [TrainingIntensity.INTENSE_TRAINING]: 20,
      [TrainingIntensity.CHAMPIONSHIP_PREP]: 30
    };
    
    const energyCost = energyCosts[gameState.trainingIntensity];
    gameState.supplies.energy = Math.max(0, gameState.supplies.energy - energyCost);
  }

  /**
   * Update arena conditions randomly
   */
  private _updateArenaConditions(gameState: GameState): void {
    if (Math.random() < 0.15) { // 15% chance to change conditions
      const conditions = Object.values(ArenaCondition);
      gameState.arenaCondition = conditions[Math.floor(Math.random() * conditions.length)];
    }
  }

  /**
   * Check for random sports events
   */
  private _checkRandomSportsEvents(player: Player, gameState: GameState): void {
    // Random events based on GAME_CONFIG.EVENT_CHANCES
    Object.entries(GAME_CONFIG.EVENT_CHANCES).forEach(([eventType, chance]) => {
      if (Math.random() < chance) {
        this._triggerSportsEvent(player, gameState, eventType);
      }
    });
  }

  /**
   * Trigger specific sports events
   */
  private _triggerSportsEvent(player: Player, gameState: GameState, eventType: string): void {
    switch (eventType) {
      case 'ZOMBIE_ATHLETE_ENCOUNTER':
        player.ui.sendData({ type: 'zombie-encounter' });
        break;
      case 'EQUIPMENT_MALFUNCTION':
        gameState.supplies.equipment_durability -= 20;
        this.world?.chatManager.sendPlayerMessage(player, '⚙️ Equipment malfunction! Durability decreased.', 'FFAA00');
        break;
      case 'SKILL_TRAINER_MEETING':
        gameState.supplies.skill_points += 2;
        this.world?.chatManager.sendPlayerMessage(player, '👨‍🏫 Met a skill trainer! +2 Skill Points', '00AA00');
        break;
      case 'BONUS_CHALLENGE':
        gameState.supplies.team_funds += 15;
        this.world?.chatManager.sendPlayerMessage(player, '💰 Bonus challenge completed! +15 Team Funds', '00AA00');
        break;
    }
  }

  /**
   * Update athlete condition based on various factors
   */
  private _updateAthleteCondition(gameState: GameState): void {
    gameState.team.forEach(member => {
      let performanceChange = 0;
      
      // Energy effects
      if (gameState.supplies.energy <= 10) {
        performanceChange -= 10; // Exhaustion
      } else if (gameState.supplies.energy >= 80) {
        performanceChange += 2; // Well rested
      }
      
      // Health effects
      if (gameState.supplies.health <= 20) {
        performanceChange -= 15; // Injured
      } else if (gameState.supplies.health >= 90) {
        performanceChange += 3; // Peak health
      }
      
      // Training intensity effects
      if (gameState.trainingIntensity === TrainingIntensity.CHAMPIONSHIP_PREP) {
        performanceChange += 5; // Intense training pays off
      } else if (gameState.trainingIntensity === TrainingIntensity.LIGHT_TRAINING) {
        performanceChange -= 2; // Not pushing hard enough
      }
      
      member.athleticPerformance = Math.max(0, Math.min(100, member.athleticPerformance + performanceChange));
      
      // Update condition status
      if (member.athleticPerformance >= 90) member.condition = AthleteCondition.PEAK_CONDITION;
      else if (member.athleticPerformance >= 80) member.condition = AthleteCondition.EXCELLENT;
      else if (member.athleticPerformance >= 65) member.condition = AthleteCondition.GOOD;
      else if (member.athleticPerformance >= 45) member.condition = AthleteCondition.FAIR;
      else if (member.athleticPerformance >= 25) member.condition = AthleteCondition.TIRED;
      else if (member.athleticPerformance > 10) member.condition = AthleteCondition.EXHAUSTED;
      else member.condition = AthleteCondition.INJURED;
    });
  }

  /**
   * Check for level progression and achievements
   */
  private _checkLevelProgression(player: Player, gameState: GameState): void {
    // Check if player has collected all emblems
    if (gameState.championEmblemsCollected >= 6) {
      gameState.phase = GamePhase.CHAMPION_VICTORY;
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        '🎉 VICTORY! You have collected all Champion Emblems and become the ultimate Sport Champion!',
        '00FF00'
      );
    }
  }

  /**
   * Get current region based on level/progress
   */
  private _getCurrentRegion(gameState: GameState): any {
    return GAME_CONFIG.REGIONS.CHAMPION_CITY; // Simplified for now
  }

  /**
   * Start the training/challenge cycle timer
   */
  private _startChallengeCycle(): void {
    // Process training events every 45 seconds
    this._challengeTimer = setInterval(() => {
      this._processTrainingEvents();
    }, 45000);
    
    this._isGameRunning = true;
    console.log('⏰ GameManager: Training cycle started (45s intervals)');
  }

  /**
   * Create Arena Prime world with sports facilities
   */
  private _createArenaWorld(): void {
    if (!this.world) return;

    // Create sports arena platform
    for (let x = -30; x <= 30; x++) {
      for (let z = -30; z <= 30; z++) {
        this.world.chunkLattice.setBlock({ x, y: -1, z }, 1); // Grass block for sports field
      }
    }
    
    // Create different sport zones (simplified)
    // Soccer field area
    for (let x = -10; x <= 10; x++) {
      for (let z = -5; z <= 5; z++) {
        this.world.chunkLattice.setBlock({ x, y: 0, z }, 0); // Air block to clear area
      }
    }
    
    console.log('🏟️ GameManager: Arena Prime world created with sports facilities');
  }

  /**
   * Handle equipment shop opening
   */
  private _handleEquipmentShop(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🏪 GameManager: ${player.username} opening equipment shop`);
    
    // Load shop UI
    player.ui.load('./ui/equipment-shop.html');
    
    // Send player's current funds to shop
    player.ui.sendData({
      type: 'update-funds',
      funds: gameState.supplies.team_funds
    });
  }

  /**
   * Handle shop purchases
   */
  private _handleShopPurchase(player: Player, data: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`💰 GameManager: ${player.username} purchasing items for $${data.total}`);
    
    // Update player funds
    gameState.supplies.team_funds = data.newFunds;
    
    // Process purchases
    if (data.purchases) {
      data.purchases.forEach((purchase: any) => {
        this.world?.chatManager.sendPlayerMessage(
          player,
          `🛒 Purchased: ${purchase.item.name} x${purchase.quantity}`,
          '00AA00'
        );
      });
    }
    
    this._sendGameStateToPlayer(player);
  }

  /**
   * Handle exiting shop
   */
  private _handleExitShop(player: Player, data: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🚪 GameManager: ${player.username} exiting shop`);
    
    // Update funds if changed
    if (data.remainingFunds !== undefined) {
      gameState.supplies.team_funds = data.remainingFunds;
    }
    
    // Return to main game UI
    player.ui.load('./ui/oregon-trail-main.html');
    this._sendGameStateToPlayer(player);
  }

  /**
   * Handle zombie encounter actions
   */
  private _handleZombieEncounterAction(player: Player, data: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🧟‍♂️ GameManager: ${player.username} zombie action: ${data.action}`);
    
    let success = false;
    let message = '';
    let rewards = {};
    
    switch (data.action) {
      case 'challenge-duel':
        success = Math.random() > 0.4; // 60% success rate
        if (success) {
          message = 'You defeated the fallen champion in honorable combat!';
          rewards = { team_funds: 75, champion_emblems: 1 };
          gameState.supplies.energy -= 35;
        } else {
          message = 'The corrupted champion proved too strong...';
          gameState.supplies.health -= 25;
          gameState.supplies.energy -= 25;
        }
        break;
        
      case 'use-athletics':
        // Success rate depends on athletic class
        const classSuccessRates: { [key: string]: number } = {
          'SOCCER_STRIKER': 0.8,
          'BASKETBALL_ALLSTAR': 0.75,
          'BASEBALL_SLUGGER': 0.7,
          'GRIDIRON_GUARDIAN': 0.6,
          'TRACK_ATHLETE': 0.85,
          'SWIMMER': 0.75
        };
        success = Math.random() < (classSuccessRates[gameState.athleticClass] || 0.7);
        if (success) {
          message = 'Your athletic skills helped you escape safely!';
          gameState.supplies.energy -= 15;
        } else {
          message = 'Your escape attempt failed...';
          gameState.supplies.health -= 15;
          gameState.supplies.energy -= 20;
        }
        break;
        
      case 'attempt-escape':
        success = Math.random() > 0.3; // 70% success rate
        if (success) {
          message = 'You successfully outran the fallen athlete!';
          gameState.supplies.energy -= 20;
        } else {
          message = 'You couldn\'t escape and had to fight!';
          gameState.supplies.health -= 20;
          gameState.supplies.energy -= 30;
        }
        break;
        
      case 'reason-with':
        success = Math.random() < 0.25; // 25% success rate
        if (success) {
          message = 'Amazing! You awakened their former champion spirit!';
          rewards = { team_funds: 100, champion_emblems: 2, skill_points: 10 };
        } else {
          message = 'They are too far gone to be reasoned with...';
          gameState.supplies.health -= 10;
        }
        break;
    }
    
    // Apply rewards
    Object.entries(rewards).forEach(([key, value]) => {
      (gameState.supplies as any)[key] = ((gameState.supplies as any)[key] || 0) + value;
    });
    
    // Send result back to UI
    player.ui.sendData({
      type: 'encounter-result',
      success,
      message,
      rewards
    });
    
    this._sendGameStateToPlayer(player);
  }

  /**
   * Handle zombie encounter completion
   */
  private _handleZombieEncounterComplete(player: Player, data: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`✅ GameManager: ${player.username} completed zombie encounter: ${data.result}`);
    
    // Return to main game UI
    player.ui.load('./ui/oregon-trail-main.html');
    this._sendGameStateToPlayer(player);
    
    // Show completion message
    this.world?.chatManager.sendPlayerMessage(
      player,
      '🏃 You continue on your athletic journey...',
      '00AAFF'
    );
  }

  /**
   * Handle map viewing
   */
  private _handleViewMap(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🗺️ GameManager: ${player.username} viewing trail map`);
    
    // Send map data to UI
    player.ui.sendData({
      type: 'show-map',
      currentRegion: gameState.currentRegion,
      landmarks: GAME_CONFIG.LANDMARKS,
      citiesVisited: gameState.championEmblemsCollected
    });
  }

  /**
   * Handle continue journey
   */
  private _handleContinueJourney(player: Player, data: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🛤️ GameManager: ${player.username} continuing journey to ${data.destination || 'next city'}`);
    
    // Advance to next phase
    gameState.phase = GamePhase.SPORT_CHALLENGE;
    gameState.daysTraining++;
    
    // Random event chance during travel
    if (Math.random() < 0.3) {
      this._triggerRandomEvent(player);
    }
    
    this._sendGameStateToPlayer(player);
    
    this.world?.chatManager.sendPlayerMessage(
      player,
      '🚶 You continue along the Final Buzzer Trail...',
      '00AAFF'
    );
  }

  /**
   * Handle training session start
   */
  private _handleStartTraining(player: Player, data: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    if (gameState.supplies.energy < 20) {
      player.ui.sendData({
        type: 'notification',
        message: 'Not enough energy for training! Rest or buy energy drinks.',
        style: 'danger'
      });
      return;
    }

    console.log(`🏋️ GameManager: ${player.username} starting training session`);
    
    // Process training
    gameState.supplies.energy -= 20;
    gameState.supplies.team_funds += 30;
    gameState.supplies.skill_points += 5;
    
    // Level progression
    this._addExperience(gameState, 15);
    
    this._sendGameStateToPlayer(player);
    
    this.world?.chatManager.sendPlayerMessage(
      player,
      '💪 Training complete! +30 Team Funds, +5 Skill Points earned.',
      '00AA00'
    );
  }

  /**
   * Trigger random events during travel
   */
  private _triggerRandomEvent(player: Player): void {
    const events = [
      'zombie-encounter',
      'equipment-found',
      'weather-challenge',
      'helpful-athlete'
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    switch (randomEvent) {
      case 'zombie-encounter':
        this._triggerZombieEncounter(player);
        break;
      case 'equipment-found':
        this._handleBonusEvent(player, { message: 'Found abandoned sports equipment! +15 Team Funds' });
        break;
      case 'weather-challenge':
        this._handleBonusEvent(player, { message: 'Storm delayed your journey but built character! +3 Mental Toughness' });
        break;
      case 'helpful-athlete':
        this._handleBonusEvent(player, { message: 'Met a helpful athlete who shared training tips! +10 Skill Points' });
        break;
    }
  }

  /**
   * Trigger zombie encounter
   */
  private _triggerZombieEncounter(player: Player): void {
    console.log(`🧟‍♂️ GameManager: Triggering zombie encounter for ${player.username}`);
    
    // Load zombie encounter UI
    player.ui.load('./ui/zombie-encounter.html');
    
    // Send encounter setup data
    player.ui.sendData({
      type: 'encounter-setup',
      encounterType: 'fallenChampion',
      playerStats: {
        energy: this._gameStates.get(player.id)?.supplies.energy || 100,
        health: this._gameStates.get(player.id)?.supplies.health || 100,
        funds: this._gameStates.get(player.id)?.supplies.team_funds || 100,
        class: this._gameStates.get(player.id)?.athleticClass || 'SOCCER_STRIKER'
      }
    });
  }
}