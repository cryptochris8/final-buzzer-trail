/**
 * Final Buzzer Trail - Sports Arena MMORPG
 * 
 * A sports-themed multiplayer game where players become athletic champions,
 * face fallen athlete zombies, and collect Champion Emblems in Arena Prime.
 * Features sleek UI, $Topia token economy, and athletic class specializations.
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
  console.log(`🏟️ ${GAME_CONFIG.GAME_NAME} v${GAME_CONFIG.GAME_VERSION} starting...`);
  
  // Load the actual map
  if (!startWithoutMap) {
    world.loadMap(worldMap);
  }
  
  // Set up lighting for Arena Prime
  world.setAmbientLightIntensity(0.9);
  world.setDirectionalLightIntensity(6);
  
  // Initialize the Game Manager
  GameManager.instance.setupGame(world);
  
  // Handle UI messages from players
  world.on('ui', ({ player, data }) => {
    GameManager.instance.handlePlayerAction(player, data.type, data);
  });
  
  // Handle player joining Arena Prime
  world.on(PlayerEvent.JOINED_WORLD, ({ player }) => {
    console.log(`⚽ ${player.username} entered Arena Prime`);
    handlePlayerJoin(world, player);
  });
  
  // Handle player leaving
  world.on(PlayerEvent.LEFT_WORLD, ({ player }) => {
    console.log(`👋 ${player.username} left Arena Prime`);
    handlePlayerLeave(world, player);
  });
  
  console.log(`🏟️ Final Buzzer Trail server ready!`);
  console.log(`🎮 Players can now join and journey from Akron to NYC!`);
  console.log(`⚽ Defeat fallen athlete zombies on your sports trail adventure!`);
});

/**
 * Handle a new player joining the game
 */
function handlePlayerJoin(world: World, player: Player): void {
  // Spawn the player in the game
  GameManager.instance.spawnPlayer(player);
  
  // Send welcome message
  const welcomeMessages = [
    `🏟️ Welcome to Final Buzzer Trail, ${player.username}!`,
    '⚽ Choose your athletic class and begin your sports journey from Akron to NYC.',
    '💰 Earn Team Funds through challenges and defeating fallen athletes.',
    '🏆 Your goal: Complete the trail and become the ultimate Sport Champion!'
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
console.log('🏆 Final Buzzer Trail Ready for Sports Champions!');
