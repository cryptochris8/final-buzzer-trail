import {
  World,
  Player,
  GameServer,
} from 'hytopia';

import { GAME_CONFIG, GamePhase, GameState, Supplies, PartyMember, TravelPace, FoodRation, WeatherType, HealthStatus } from '../gameConfig';
import { TrailPlayerEntity } from './TrailPlayerEntity';
import { EventManager } from './EventManager';

export class GameManager {
  public static readonly instance = new GameManager();

  public world: World | undefined;
  private _players: Map<string, TrailPlayerEntity> = new Map();
  private _gameStates: Map<string, GameState> = new Map();
  private _eventManager: EventManager;
  private _dayTimer: NodeJS.Timeout | undefined;
  private _isGameRunning: boolean = false;

  private constructor() {
    this._eventManager = new EventManager();
  }

  /**
   * Initialize the game world and systems
   */
  public setupGame(world: World): void {
    this.world = world;
    console.log('🎮 GameManager: Setting up Final Buzzer Trail...');
    
    // Start the daily cycle (every 30 seconds = 1 day for demo purposes)
    this._startDailyCycle();
    
    // Create bedrock floor to prevent falling
    this._createMinimalWorld();
    
    console.log('✅ GameManager: Game setup complete');
  }

  /**
   * Spawn a new player on the trail
   */
  public spawnPlayer(player: Player): void {
    if (!this.world) return;

    console.log(`👤 GameManager: Spawning player ${player.username}`);
    
    // Create player entity
    const playerEntity = new TrailPlayerEntity(player);
    playerEntity.spawn(this.world, GAME_CONFIG.WORLD_CONFIG.SPAWN_REGION.min);
    
    // Initialize player's game state
    const gameState: GameState = {
      phase: GamePhase.CHARACTER_CREATION,
      currentDistance: 0,
      supplies: { ...GAME_CONFIG.STARTING_SUPPLIES },
      party: [
        { name: player.username, health: 100, status: HealthStatus.EXCELLENT, isPlayer: true }
      ],
      currentLandmark: 0,
      travelPace: TravelPace.STEADY,
      foodRation: FoodRation.FILLING,
      weather: WeatherType.FAIR,
      daysOnTrail: 0,
      profession: 'BANKER' // Default, will be chosen by player
    };

    // Store player and game state
    this._players.set(player.id, playerEntity);
    this._gameStates.set(player.id, gameState);

    // Load UI and send initial data
    player.ui.load('ui/index.html');
    this._sendGameStateToPlayer(player);
    
    console.log(`✅ GameManager: Player ${player.username} spawned successfully`);
  }

  /**
   * Remove a player from the game
   */
  public removePlayer(player: Player): void {
    console.log(`👋 GameManager: Removing player ${player.username}`);
    
    this._players.delete(player.id);
    this._gameStates.delete(player.id);
    
    console.log(`✅ GameManager: Player ${player.username} removed`);
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
   * Handle player decisions and actions
   */
  public handlePlayerAction(player: Player, action: string, data?: any): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    console.log(`🎯 GameManager: Player ${player.username} action: ${action}`);

    switch (action) {
      case 'choose-profession':
        this._handleProfessionChoice(player, data.profession);
        break;
      case 'buy-supplies':
        this._handleSupplyPurchase(player, data);
        break;
      case 'start-journey':
        this._handleStartJourney(player);
        break;
      case 'set-pace':
        this._handleSetPace(player, data.pace);
        break;
      case 'set-rations':
        this._handleSetRations(player, data.rations);
        break;
      case 'continue-trail':
        this._handleContinueTrail(player);
        break;
      case 'rest':
        this._handleRest(player);
        break;
      case 'hunt':
        this._handleHunt(player);
        break;
      case 'trade':
        this._handleTrade(player, data);
        break;
      default:
        console.log(`⚠️ GameManager: Unknown action ${action}`);
    }
  }

  /**
   * Process daily events for all players
   */
  private _processDailyEvents(): void {
    this._players.forEach((playerEntity, playerId) => {
      const gameState = this._gameStates.get(playerId);
      if (!gameState || gameState.phase !== GamePhase.TRAVELING) return;

      // Advance day
      gameState.daysOnTrail++;

      // Travel based on pace
      const dailyDistance = GAME_CONFIG.DAILY_TRAVEL_DISTANCE[gameState.travelPace];
      gameState.currentDistance += dailyDistance;

      // Consume food
      this._consumeFood(gameState);

      // Update weather
      this._updateWeather(gameState);

      // Check for random events
      this._checkRandomEvents(playerEntity.player, gameState);

      // Update health based on conditions
      this._updatePartyHealth(gameState);

      // Check for landmarks
      this._checkLandmarks(playerEntity.player, gameState);

      // Check victory condition
      if (gameState.currentDistance >= GAME_CONFIG.TRAIL_DISTANCE) {
        this._handleVictory(playerEntity.player, gameState);
      }

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
      currentLandmark: this._getCurrentLandmark(gameState)
    });
  }

  /**
   * Handle profession selection
   */
  private _handleProfessionChoice(player: Player, profession: string): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    gameState.profession = profession;
    gameState.phase = GamePhase.STORE_SHOPPING;

    // Update starting money based on profession
    const professionConfig = GAME_CONFIG.PROFESSIONS[profession as keyof typeof GAME_CONFIG.PROFESSIONS];
    if (professionConfig) {
      gameState.supplies.money = professionConfig.startingMoney;
    }

    this._sendGameStateToPlayer(player);

    this.world?.chatManager.sendPlayerMessage(
      player, 
      `You are now a ${professionConfig?.name}. Visit the general store to buy supplies!`,
      '00AA00'
    );
  }

  /**
   * Handle supply purchases
   */
  private _handleSupplyPurchase(player: Player, purchase: { item: string, quantity: number }): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    const { item, quantity } = purchase;
    const price = GAME_CONFIG.STORE_PRICES[item as keyof typeof GAME_CONFIG.STORE_PRICES];
    const totalCost = price * quantity;

    if (gameState.supplies.money >= totalCost) {
      gameState.supplies.money -= totalCost;
      gameState.supplies[item as keyof Supplies] += quantity;

      this._sendGameStateToPlayer(player);
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        `Purchased ${quantity} ${item} for $${totalCost.toFixed(2)}`,
        '00AA00'
      );
    } else {
      this.world?.chatManager.sendPlayerMessage(
        player,
        `Not enough money! Need $${totalCost.toFixed(2)}, have $${gameState.supplies.money.toFixed(2)}`,
        'FF0000'
      );
    }
  }

  /**
   * Start the journey
   */
  private _handleStartJourney(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    gameState.phase = GamePhase.TRAVELING;
    this._sendGameStateToPlayer(player);

    this.world?.chatManager.sendPlayerMessage(
      player,
      '🚌 The trail begins! May fortune favor your journey to Oregon!',
      '00AA00'
    );
  }

  /**
   * Set travel pace
   */
  private _handleSetPace(player: Player, pace: string): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    gameState.travelPace = pace as TravelPace;
    this._sendGameStateToPlayer(player);

    const paceDescriptions = {
      [TravelPace.GRUELING]: 'Grueling pace - fast but dangerous',
      [TravelPace.STRENUOUS]: 'Strenuous pace - moderate speed',
      [TravelPace.STEADY]: 'Steady pace - safe and sure',
      [TravelPace.REST]: 'Resting - no travel today'
    };

    this.world?.chatManager.sendPlayerMessage(
      player,
      `Travel pace set to: ${paceDescriptions[pace as TravelPace]}`,
      '00AA00'
    );
  }

  /**
   * Set food rations
   */
  private _handleSetRations(player: Player, rations: string): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    gameState.foodRation = rations as FoodRation;
    this._sendGameStateToPlayer(player);

    this.world?.chatManager.sendPlayerMessage(
      player,
      `Food rations set to: ${rations}`,
      '00AA00'
    );
  }

  /**
   * Continue on the trail
   */
  private _handleContinueTrail(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    if (gameState.phase === GamePhase.CAMP) {
      gameState.phase = GamePhase.TRAVELING;
      this._sendGameStateToPlayer(player);
      
      this.world?.chatManager.sendPlayerMessage(player, 'Back on the trail!', '00AA00');
    }
  }

  /**
   * Rest for the day
   */
  private _handleRest(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    // Improve health slightly
    gameState.party.forEach(member => {
      if (member.health < 100) {
        member.health = Math.min(100, member.health + 10);
      }
    });

    this._sendGameStateToPlayer(player);
    this.world?.chatManager.sendPlayerMessage(player, 'Your party rests and recovers.', '00AA00');
  }

  /**
   * Attempt to hunt for food
   */
  private _handleHunt(player: Player): void {
    const gameState = this._gameStates.get(player.id);
    if (!gameState) return;

    if (gameState.supplies.ammunition >= 10) {
      gameState.supplies.ammunition -= 10;
      
      // Random hunting success
      const success = Math.random() < 0.6;
      if (success) {
        const meat = Math.floor(Math.random() * 50) + 20;
        gameState.supplies.food += meat;
        
        this.world?.chatManager.sendPlayerMessage(
          player,
          `Successful hunt! Gained ${meat} pounds of food.`,
          '00AA00'
        );
      } else {
        this.world?.chatManager.sendPlayerMessage(
          player,
          'Hunting unsuccessful. No food gained.',
          'FFAA00'
        );
      }
      
      this._sendGameStateToPlayer(player);
    } else {
      this.world?.chatManager.sendPlayerMessage(
        player,
        'Not enough ammunition to hunt!',
        'FF0000'
      );
    }
  }

  /**
   * Handle trading
   */
  private _handleTrade(player: Player, tradeData: any): void {
    // Implement trading logic here
    this.world?.chatManager.sendPlayerMessage(player, 'Trading not yet implemented!', 'FFAA00');
  }

  /**
   * Victory condition
   */
  private _handleVictory(player: Player, gameState: GameState): void {
    gameState.phase = GamePhase.VICTORY;
    
    this.world?.chatManager.sendPlayerMessage(
      player,
      '🎉 Congratulations! You have reached Oregon City!',
      '00FF00'
    );
    
    this._sendGameStateToPlayer(player);
  }

  /**
   * Consume food daily
   */
  private _consumeFood(gameState: GameState): void {
    const partySize = gameState.party.length;
    const dailyConsumption = GAME_CONFIG.FOOD_RATIONS[gameState.foodRation] * partySize;
    
    gameState.supplies.food = Math.max(0, gameState.supplies.food - dailyConsumption);
  }

  /**
   * Update weather randomly
   */
  private _updateWeather(gameState: GameState): void {
    if (Math.random() < 0.2) { // 20% chance to change weather
      const weatherTypes = Object.values(WeatherType);
      gameState.weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    }
  }

  /**
   * Check for random events
   */
  private _checkRandomEvents(player: Player, gameState: GameState): void {
    // Use event manager to check for and trigger random events
    this._eventManager.checkForEvents(player, gameState);
  }

  /**
   * Update party health based on conditions
   */
  private _updatePartyHealth(gameState: GameState): void {
    gameState.party.forEach(member => {
      // Health effects based on food, weather, pace, etc.
      let healthChange = 0;
      
      // Food effects
      if (gameState.supplies.food <= 0) {
        healthChange -= 15; // Starvation
      } else if (gameState.foodRation === FoodRation.BARE_BONES) {
        healthChange -= 5;
      } else if (gameState.foodRation === FoodRation.MEAGER) {
        healthChange -= 2;
      }
      
      // Weather effects
      if (gameState.weather === WeatherType.STORMY || gameState.weather === WeatherType.COLD) {
        healthChange -= 3;
      }
      
      // Pace effects
      if (gameState.travelPace === TravelPace.GRUELING) {
        healthChange -= 4;
      } else if (gameState.travelPace === TravelPace.REST) {
        healthChange += 5;
      }
      
      member.health = Math.max(0, Math.min(100, member.health + healthChange));
      
      // Update health status
      if (member.health >= 80) member.status = HealthStatus.EXCELLENT;
      else if (member.health >= 60) member.status = HealthStatus.GOOD;
      else if (member.health >= 40) member.status = HealthStatus.FAIR;
      else if (member.health >= 20) member.status = HealthStatus.POOR;
      else if (member.health > 0) member.status = HealthStatus.VERY_POOR;
      else member.status = HealthStatus.DEAD;
    });
  }

  /**
   * Check if player has reached a landmark
   */
  private _checkLandmarks(player: Player, gameState: GameState): void {
    const currentLandmark = this._getCurrentLandmark(gameState);
    if (currentLandmark > gameState.currentLandmark) {
      gameState.currentLandmark = currentLandmark;
      const landmark = GAME_CONFIG.LANDMARKS[currentLandmark];
      
      this.world?.chatManager.sendPlayerMessage(
        player,
        `🏛️ You have reached ${landmark.name}!`,
        '00AAFF'
      );
      
      if (landmark.hasStore) {
        gameState.phase = GamePhase.STORE_SHOPPING;
      }
    }
  }

  /**
   * Get current landmark index based on distance
   */
  private _getCurrentLandmark(gameState: GameState): number {
    for (let i = GAME_CONFIG.LANDMARKS.length - 1; i >= 0; i--) {
      if (gameState.currentDistance >= GAME_CONFIG.LANDMARKS[i].distance) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Start the daily cycle timer
   */
  private _startDailyCycle(): void {
    // Process a day every 30 seconds for demo purposes
    // In a real game, this might be much longer
    this._dayTimer = setInterval(() => {
      this._processDailyEvents();
    }, 30000);
    
    this._isGameRunning = true;
    console.log('⏰ GameManager: Daily cycle started (30s intervals)');
  }

  /**
   * Create a minimal world with just a platform
   */
  private _createMinimalWorld(): void {
    if (!this.world) return;

    // Create a simple platform to stand on
    for (let x = -20; x <= 20; x++) {
      for (let z = -20; z <= 20; z++) {
        this.world.chunkLattice.setBlock({ x, y: -1, z }, 1); // Grass block
      }
    }
    
    console.log('🌍 GameManager: Minimal world created');
  }
}