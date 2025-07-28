/**
 * Final Buzzer Trail - Oregon Trail Style Game
 * 
 * A UI-focused multiplayer survival game where players manage
 * resources, make decisions, and travel the historic Oregon Trail
 * from Independence, Missouri to Oregon City.
 */

import {
  startServer,
  PlayerEvent,
  World,
  Player,
} from 'hytopia';

import { GameManager } from './classes/GameManager';
import { GAME_CONFIG } from './gameConfig';

// Import the world map (you'll create this with the map builder)
import worldMap from './assets/map.json';

// Now we'll load the actual map
const startWithoutMap = false;

startServer(world => {
  console.log(`🚌 ${GAME_CONFIG.GAME_NAME} v${GAME_CONFIG.GAME_VERSION} starting...`);
  
  // Load the actual map
  if (!startWithoutMap) {
    world.loadMap(worldMap);
  }
  
  // Set up lighting for the minimal world
  world.setAmbientLightIntensity(0.8);
  world.setDirectionalLightIntensity(5);
  
  // Initialize the Game Manager
  GameManager.instance.setupGame(world);
  
  // Handle player joining the trail
  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    console.log(`👤 ${player.username} joined the trail`);
    handlePlayerJoin(world, player);
  });
  
  // Handle player leaving
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    console.log(`👋 ${player.username} left the trail`);
    handlePlayerLeave(world, player);
  });
  
  console.log(`✅ Final Buzzer Trail server ready!`);
});

/**
 * Handle a new player joining the game
 */
function handlePlayerJoin(world: World, player: Player): void {
  // Spawn the player in the game
  GameManager.instance.spawnPlayer(player);
  
  // Send welcome message
  const welcomeMessages = [
    `🚌 Welcome to the Final Buzzer Trail, ${player.username}!`,
    '📍 Your journey from Hindman, Kentucky to Oregon City begins here.',
    '💡 Use the UI to manage your supplies, make decisions, and survive the trail.',
    '🎯 Your goal: Travel 2,000 miles without running out of supplies or losing your party!'
  ];
  
  // Send each message with a delay for dramatic effect
  welcomeMessages.forEach((message, index) => {
    setTimeout(() => {
      world.chatManager.sendPlayerMessage(player, message, '00AA00');
    }, (index + 1) * 1000);
  });
  
  // Update player count
  GameManager.instance.updatePlayerCount();
}

/**
 * Handle player leaving the game
 */
function handlePlayerLeave(world: World, player: Player): void {
  // Clean up player entities
  world.entityManager
    .getPlayerEntitiesByPlayer(player)
    .forEach(entity => entity.despawn());
  
  // Remove player from game
  GameManager.instance.removePlayer(player);
  
  // Update player count
  GameManager.instance.updatePlayerCount();
}

// Log startup complete
console.log('🌟 Final Buzzer Trail - Ready for Adventure!');
