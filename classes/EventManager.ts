import { Player } from 'hytopia';
import { GAME_CONFIG, GameState, TrailEvent, EventChoice, WeatherType, HealthStatus } from '../gameConfig';

export class EventManager {
  private _eventCooldowns: Map<string, number> = new Map();

  /**
   * Check for and trigger random events
   */
  public checkForEvents(player: Player, gameState: GameState): void {
    // Skip if player is not traveling
    if (gameState.phase !== 'traveling') return;

    // Check each type of event
    this._checkWeatherEvent(player, gameState);
    this._checkIllnessEvent(player, gameState);
    this._checkTrailEvent(player, gameState);
    this._checkWildlifeEvent(player, gameState);
    this._checkTraderEvent(player, gameState);
  }

  /**
   * Check for weather events
   */
  private _checkWeatherEvent(player: Player, gameState: GameState): void {
    if (Math.random() < GAME_CONFIG.EVENT_CHANCES.BAD_WEATHER) {
      const badWeatherEvents = [
        {
          id: 'storm',
          title: 'Severe Thunderstorm',
          description: 'Dark clouds gather and lightning fills the sky. Your party seeks shelter.',
          choices: [
            {
              text: 'Wait out the storm',
              consequences: {
                supplies: { food: -5 },
                health: -5,
                message: 'You waited safely, but used extra food.',
                success_chance: 0.8
              }
            },
            {
              text: 'Push through the storm',
              consequences: {
                health: -15,
                message: 'Your party got soaked and cold.',
                success_chance: 0.4
              }
            }
          ],
          type: 'weather' as const
        },
        {
          id: 'blizzard',
          title: 'Unexpected Blizzard',
          description: 'Snow begins falling heavily, reducing visibility to just a few feet.',
          choices: [
            {
              text: 'Make camp immediately',
              consequences: {
                supplies: { food: -8, clothing: -2 },
                health: -3,
                message: 'You stayed warm but used extra supplies.',
                success_chance: 0.9
              }
            },
            {
              text: 'Try to find better shelter',
              consequences: {
                health: -10,
                message: 'You searched but got lost in the snow.',
                success_chance: 0.3
              }
            }
          ],
          type: 'weather' as const
        }
      ];

      const event = badWeatherEvents[Math.floor(Math.random() * badWeatherEvents.length)];
      this._presentEvent(player, event);
      gameState.weather = WeatherType.STORMY;
    }
  }

  /**
   * Check for illness events
   */
  private _checkIllnessEvent(player: Player, gameState: GameState): void {
    if (Math.random() < GAME_CONFIG.EVENT_CHANCES.ILLNESS) {
      const illnessEvents = [
        {
          id: 'dysentery',
          title: 'Dysentery',
          description: 'A party member has contracted dysentery from contaminated water.',
          choices: [
            {
              text: 'Use medicine',
              consequences: {
                supplies: { medicine: -3 },
                health: -5,
                message: 'Medicine helped, but recovery will take time.',
                success_chance: 0.8
              }
            },
            {
              text: 'Rest and hope for recovery',
              consequences: {
                health: -20,
                message: 'Without medicine, the illness worsened.',
                success_chance: 0.3
              }
            }
          ],
          type: 'illness' as const
        },
        {
          id: 'broken_leg',
          title: 'Broken Leg',
          description: 'A party member has fallen and broken their leg while gathering firewood.',
          choices: [
            {
              text: 'Set the bone and rest for several days',
              consequences: {
                supplies: { food: -15 },
                health: -10,
                message: 'The leg is healing, but you lost time.',
                success_chance: 0.7
              }
            },
            {
              text: 'Make a splint and continue',
              consequences: {
                health: -25,
                message: 'Continuing with injury made it worse.',
                success_chance: 0.2
              }
            }
          ],
          type: 'illness' as const
        }
      ];

      const event = illnessEvents[Math.floor(Math.random() * illnessEvents.length)];
      this._presentEvent(player, event);
    }
  }

  /**
   * Check for general trail events
   */
  private _checkTrailEvent(player: Player, gameState: GameState): void {
    if (Math.random() < 0.1) { // 10% chance for trail events
      const trailEvents = [
        {
          id: 'river_crossing',
          title: 'River Crossing',
          description: 'You come to a wide river. The water is swift and deep.',
          choices: [
            {
              text: 'Pay $10 for ferry crossing',
              consequences: {
                supplies: { money: -10 },
                message: 'Safe crossing, but expensive.',
                success_chance: 0.95
              }
            },
            {
              text: 'Ford the river',
              consequences: {
                supplies: { food: -10, clothing: -5 },
                health: -15,
                message: 'Dangerous crossing. Lost supplies in the water.',
                success_chance: 0.6
              }
            },
            {
              text: 'Look for a better crossing',
              consequences: {
                supplies: { food: -5 },
                message: 'Found a shallower spot after searching.',
                success_chance: 0.8
              }
            }
          ],
          type: 'random' as const
        },
        {
          id: 'broken_wagon',
          title: 'Broken Wagon Axle',
          description: 'Your wagon axle has snapped! You cannot continue without repairs.',
          choices: [
            {
              text: 'Use spare parts to repair',
              consequences: {
                supplies: { spare_parts: -3 },
                message: 'Wagon repaired successfully.',
                success_chance: 0.9
              }
            },
            {
              text: 'Try to improvise a repair',
              consequences: {
                supplies: { food: -8 },
                health: -5,
                message: 'Makeshift repair worked, but took extra time.',
                success_chance: 0.5
              }
            }
          ],
          type: 'random' as const
        },
        {
          id: 'lost_trail',
          title: 'Lost on the Trail',
          description: 'Thick fog has caused you to lose the main trail.',
          choices: [
            {
              text: 'Wait for the fog to clear',
              consequences: {
                supplies: { food: -6 },
                message: 'Found the trail again after waiting.',
                success_chance: 0.9
              }
            },
            {
              text: 'Try to find the trail now',
              consequences: {
                supplies: { food: -12 },
                health: -8,
                message: 'Wandered lost for hours before finding the way.',
                success_chance: 0.4
              }
            }
          ],
          type: 'random' as const
        }
      ];

      const event = trailEvents[Math.floor(Math.random() * trailEvents.length)];
      this._presentEvent(player, event);
    }
  }

  /**
   * Check for wildlife encounters
   */
  private _checkWildlifeEvent(player: Player, gameState: GameState): void {
    if (Math.random() < GAME_CONFIG.EVENT_CHANCES.WILDLIFE_ENCOUNTER) {
      const wildlifeEvents = [
        {
          id: 'buffalo_herd',
          title: 'Buffalo Herd',
          description: 'A massive herd of buffalo blocks the trail ahead.',
          choices: [
            {
              text: 'Wait for the herd to pass',
              consequences: {
                supplies: { food: -3 },
                message: 'Safely waited for the buffalo to move on.',
                success_chance: 0.9
              }
            },
            {
              text: 'Try to go around the herd',
              consequences: {
                supplies: { food: -8 },
                health: -5,
                message: 'Took longer route, but avoided the herd.',
                success_chance: 0.7
              }
            },
            {
              text: 'Hunt buffalo if you have ammunition',
              consequences: {
                supplies: { ammunition: -15, food: 100 },
                message: 'Successful hunt! Your party feasts tonight.',
                success_chance: 0.6
              }
            }
          ],
          type: 'random' as const
        },
        {
          id: 'wild_animal',
          title: 'Wild Animal Attack',
          description: 'A bear has wandered into your camp during the night!',
          choices: [
            {
              text: 'Fire shots to scare it away',
              consequences: {
                supplies: { ammunition: -5 },
                message: 'The bear ran away, but you used ammunition.',
                success_chance: 0.8
              }
            },
            {
              text: 'Try to quietly back away',
              consequences: {
                health: -20,
                supplies: { food: -10 },
                message: 'The bear destroyed some supplies before leaving.',
                success_chance: 0.4
              }
            }
          ],
          type: 'random' as const
        }
      ];

      const event = wildlifeEvents[Math.floor(Math.random() * wildlifeEvents.length)];
      this._presentEvent(player, event);
    }
  }

  /**
   * Check for trader encounters
   */
  private _checkTraderEvent(player: Player, gameState: GameState): void {
    if (Math.random() < GAME_CONFIG.EVENT_CHANCES.TRADER_MEETING) {
      const traderEvents = [
        {
          id: 'friendly_trader',
          title: 'Friendly Trader',
          description: 'You meet a trader willing to sell supplies at fair prices.',
          choices: [
            {
              text: 'Buy food ($15 for 50 pounds)',
              consequences: {
                supplies: { money: -15, food: 50 },
                message: 'Purchased food from the trader.',
                success_chance: 1.0
              }
            },
            {
              text: 'Buy ammunition ($8 for 50 rounds)',
              consequences: {
                supplies: { money: -8, ammunition: 50 },
                message: 'Purchased ammunition from the trader.',
                success_chance: 1.0
              }
            },
            {
              text: 'Thank them and move on',
              consequences: {
                message: 'Politely declined the trader\'s offer.',
                success_chance: 1.0
              }
            }
          ],
          type: 'random' as const
        }
      ];

      const event = traderEvents[Math.floor(Math.random() * traderEvents.length)];
      this._presentEvent(player, event);
    }
  }

  /**
   * Present an event to the player for decision
   */
  private _presentEvent(player: Player, event: TrailEvent): void {
    console.log(`🎲 EventManager: Presenting event "${event.title}" to ${player.username}`);

    // Send event to player UI
    player.ui.sendData({
      type: 'trail-event',
      event: event
    });

    // Also send as chat message
    player.world?.chatManager.sendPlayerMessage(
      player,
      `🎲 EVENT: ${event.title} - ${event.description}`,
      'FFAA00'
    );
  }

  /**
   * Process player's choice for an event
   */
  public processEventChoice(player: Player, gameState: GameState, eventId: string, choiceIndex: number): void {
    console.log(`🎯 EventManager: ${player.username} chose option ${choiceIndex} for event ${eventId}`);

    // This would need to be implemented with a way to store the current event
    // For now, just acknowledge the choice
    player.world?.chatManager.sendPlayerMessage(
      player,
      `Decision recorded. Results will be applied.`,
      '00AA00'
    );
  }

  /**
   * Apply event consequences to game state
   */
  public applyEventConsequences(gameState: GameState, consequences: EventChoice['consequences']): string {
    let resultMessage = consequences.message;

    // Apply supply changes
    if (consequences.supplies) {
      Object.entries(consequences.supplies).forEach(([key, value]) => {
        if (key in gameState.supplies) {
          const currentValue = gameState.supplies[key as keyof typeof gameState.supplies];
          gameState.supplies[key as keyof typeof gameState.supplies] = Math.max(0, currentValue + value);
        }
      });
    }

    // Apply health changes
    if (consequences.health) {
      gameState.party.forEach(member => {
        member.health = Math.max(0, Math.min(100, member.health + consequences.health!));
        
        // Update health status
        if (member.health >= 80) member.status = HealthStatus.EXCELLENT;
        else if (member.health >= 60) member.status = HealthStatus.GOOD;
        else if (member.health >= 40) member.status = HealthStatus.FAIR;
        else if (member.health >= 20) member.status = HealthStatus.POOR;
        else if (member.health > 0) member.status = HealthStatus.VERY_POOR;
        else member.status = HealthStatus.DEAD;
      });
    }

    return resultMessage;
  }

  /**
   * Check if event should occur based on success chance
   */
  public rollEventSuccess(successChance: number): boolean {
    return Math.random() < successChance;
  }

  /**
   * Get a random positive event
   */
  public getPositiveEvent(): TrailEvent {
    const positiveEvents = [
      {
        id: 'good_weather',
        title: 'Beautiful Weather',
        description: 'Perfect traveling weather lifts everyone\'s spirits.',
        choices: [
          {
            text: 'Enjoy the good weather',
            consequences: {
              health: 5,
              message: 'Everyone feels refreshed by the beautiful day.',
              success_chance: 1.0
            }
          }
        ],
        type: 'random' as const
      },
      {
        id: 'find_supplies',
        title: 'Abandoned Supplies',
        description: 'You find supplies left by another wagon train.',
        choices: [
          {
            text: 'Take what you can use',
            consequences: {
              supplies: { food: 20, ammunition: 10 },
              message: 'Found useful supplies! Lucky day.',
              success_chance: 1.0
            }
          }
        ],
        type: 'random' as const
      }
    ];

    return positiveEvents[Math.floor(Math.random() * positiveEvents.length)];
  }
}