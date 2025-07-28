import {
  Player,
  DefaultPlayerEntity,
  DefaultPlayerEntityController,
  BaseEntityControllerEvent,
  EventPayloads,
  PlayerCameraMode,
  PlayerUIEvent,
  World,
  Vector3Like,
  QuaternionLike,
} from 'hytopia';

import { GameManager } from './GameManager';

export class TrailPlayerEntity extends DefaultPlayerEntity {
  private _isInUI: boolean = false;

  // Player entities always assign a PlayerController to the entity
  public get playerController(): DefaultPlayerEntityController {
    return this.controller as DefaultPlayerEntityController;
  }

  public constructor(player: Player) {
    super({
      player,
      name: `${player.username} (Traveler)`,
      modelUri: 'models/players/player.gltf',
      modelLoopedAnimations: ['idle'],
      modelScale: 0.5,
    });

    this._setupPlayerController();
    this._setupPlayerUI();
    this._setupPlayerCamera();
  }

  public override spawn(world: World, position: Vector3Like, rotation?: QuaternionLike): void {
    super.spawn(world, position, rotation);
    console.log(`👤 TrailPlayerEntity: ${this.player.username} spawned`);
  }

  /**
   * Setup player controller for minimal movement
   */
  private _setupPlayerController(): void {
    // Allow basic movement but focus on UI interactions
    this.playerController.autoCancelMouseLeftClick = true;

    // Set basic animations
    this.playerController.idleLoopedAnimations = ['idle'];
    this.playerController.walkLoopedAnimations = ['walk'];
    this.playerController.runLoopedAnimations = ['run'];

    // Handle player input for UI interactions
    this.playerController.on(
      BaseEntityControllerEvent.TICK_WITH_PLAYER_INPUT,
      this._onTickWithPlayerInput
    );

    // Disable swimming for simplicity
    this.playerController.canSwim = () => false;
  }

  /**
   * Setup player UI system
   */
  private _setupPlayerUI(): void {
    // Listen for UI interactions from the player
    this.player.ui.on(PlayerUIEvent.DATA, (payload) => {
      const { data } = payload;
      this._handleUIAction(data);
    });

    console.log(`🖥️ TrailPlayerEntity: UI setup for ${this.player.username}`);
  }

  /**
   * Setup player camera for UI-focused experience
   */
  private _setupPlayerCamera(): void {
    // Use first-person camera by default
    this.player.camera.setMode(PlayerCameraMode.FIRST_PERSON);

    // Hide parts of the player model that would obstruct the view
    this.player.camera.setModelHiddenNodes(['head', 'neck']);

    // Set camera offset for better view
    this.player.camera.setOffset({ x: 0, y: 0.5, z: 0 });

    console.log(`📷 TrailPlayerEntity: Camera setup for ${this.player.username}`);
  }

  /**
   * Handle player input events
   */
  private _onTickWithPlayerInput = (payload: EventPayloads[BaseEntityControllerEvent.TICK_WITH_PLAYER_INPUT]): void => {
    const { input } = payload;

    // Handle UI toggle key (Tab or E)
    if (input.e) {
      this._toggleUI();
      input.e = false; // Consume the input
    }

    // Handle quick action keys
    if (input['1']) {
      this._quickAction('rest');
      input['1'] = false;
    }

    if (input['2']) {
      this._quickAction('hunt');
      input['2'] = false;
    }

    if (input['3']) {
      this._quickAction('continue');
      input['3'] = false;
    }
  };

  /**
   * Handle UI actions sent from the client
   */
  private _handleUIAction(data: any): void {
    if (!data.type) return;

    console.log(`🎯 TrailPlayerEntity: ${this.player.username} UI action: ${data.type}`, data);

    // Forward the action to the GameManager
    GameManager.instance.handlePlayerAction(this.player, data.type, data);
  }

  /**
   * Toggle UI visibility/focus
   */
  private _toggleUI(): void {
    this._isInUI = !this._isInUI;

    // Send UI state to player
    this.player.ui.sendData({
      type: 'ui-focus-change',
      focused: this._isInUI
    });

    // Notify player
    const message = this._isInUI ? 'UI Focus: ON' : 'UI Focus: OFF';
    this.world?.chatManager.sendPlayerMessage(this.player, message, '00AAFF');

    console.log(`🖥️ TrailPlayerEntity: ${this.player.username} UI focus: ${this._isInUI}`);
  }

  /**
   * Quick action shortcuts
   */
  private _quickAction(action: string): void {
    console.log(`⚡ TrailPlayerEntity: ${this.player.username} quick action: ${action}`);

    // Forward to GameManager
    GameManager.instance.handlePlayerAction(this.player, action);

    // Show feedback to player
    const actionMessages = {
      'rest': '😴 Resting...',
      'hunt': '🏹 Hunting...',
      'continue': '🚶 Continuing on trail...'
    };

    const message = actionMessages[action as keyof typeof actionMessages] || `Action: ${action}`;
    this.world?.chatManager.sendPlayerMessage(this.player, message, 'FFAA00');
  }

  /**
   * Send data to this player's UI
   */
  public sendUIData(data: any): void {
    this.player.ui.sendData(data);
  }

  /**
   * Teleport player to a specific area of the map
   */
  public teleportToArea(areaName: string): void {
    const teleportPositions = {
      'general-store': { x: 15, y: 1, z: 0 },
      'trail-map': { x: 0, y: 1, z: 15 },
      'camp': { x: -15, y: 1, z: 0 },
      'river': { x: 0, y: 1, z: -15 },
      'spawn': { x: 0, y: 1, z: 0 }
    };

    const position = teleportPositions[areaName as keyof typeof teleportPositions];
    if (position && this.isSpawned) {
      this.setPosition(position);
      
      this.world?.chatManager.sendPlayerMessage(
        this.player,
        `📍 Moved to: ${areaName.replace('-', ' ')}`,
        '00AAFF'
      );

      console.log(`📍 TrailPlayerEntity: ${this.player.username} teleported to ${areaName}`);
    }
  }

  /**
   * Handle player joining a game area
   */
  public onAreaEnter(areaName: string): void {
    console.log(`🚪 TrailPlayerEntity: ${this.player.username} entered ${areaName}`);

    // Send area-specific UI data
    this.player.ui.sendData({
      type: 'area-entered',
      area: areaName
    });

    // Send welcome message for the area
    const areaMessages = {
      'general-store': '🏪 Welcome to the General Store! Buy supplies for your journey.',
      'trail-map': '🗺️ Check your progress and plan your route.',
      'camp': '🏕️ Rest, hunt, or manage your party here.',
      'river': '🌊 River crossing ahead! Choose your strategy carefully.'
    };

    const message = areaMessages[areaName as keyof typeof areaMessages];
    if (message) {
      this.world?.chatManager.sendPlayerMessage(this.player, message, '00AAFF');
    }
  }

  /**
   * Reset player to default state
   */
  public resetPlayer(): void {
    this._isInUI = false;
    this._setupPlayerCamera();
    this.setPosition({ x: 0, y: 1, z: 0 });

    console.log(`🔄 TrailPlayerEntity: ${this.player.username} reset to default state`);
  }

  /**
   * Handle player death/game over
   */
  public handleGameOver(reason: string): void {
    this.world?.chatManager.sendPlayerMessage(
      this.player,
      `💀 Game Over: ${reason}`,
      'FF0000'
    );

    // Send game over data to UI
    this.player.ui.sendData({
      type: 'game-over',
      reason: reason
    });

    console.log(`💀 TrailPlayerEntity: ${this.player.username} game over: ${reason}`);
  }

  /**
   * Handle successful completion
   */
  public handleVictory(): void {
    this.world?.chatManager.sendPlayerMessage(
      this.player,
      '🎉 Congratulations! You have successfully reached Oregon City!',
      '00FF00'
    );

    // Send victory data to UI
    this.player.ui.sendData({
      type: 'victory'
    });

    console.log(`🎉 TrailPlayerEntity: ${this.player.username} achieved victory!`);
  }
}