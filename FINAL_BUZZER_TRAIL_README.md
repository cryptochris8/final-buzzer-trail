# Final Buzzer Trail - Oregon Trail-Style Sports Game

## Project Overview
This is a UI-driven narrative game inspired by the classic Oregon Trail, reimagined with a sports theme using the Hytopia SDK. Players guide their sports team through a journey to championship glory, making critical decisions along the way.

## Game Concept
- **Theme**: Sports teams traveling between tournaments
- **Style**: Oregon Trail-inspired UI-heavy gameplay
- **Platform**: Hytopia SDK (browser-based)
- **Type**: Single-player narrative adventure with resource management

## Core Mechanics (Oregon Trail → Sports Adaptation)
- **Wagon → Team Bus**: Travel between tournament locations
- **Food → Team Energy/Morale**: Keep players motivated and healthy
- **River Crossings → Playoff Challenges**: Critical decision points
- **Hunting → Training Mini-games**: Improve team skills
- **Disease → Sports Injuries**: Manage player health
- **Trading Posts → Equipment Upgrades**: Buy gear and supplies
- **Weather → Game Conditions**: Affect team performance

## Technical Approach
### UI-First Design
- Leverage Hytopia's HTML/CSS UI system (`player.ui.load()`)
- Server-side game logic with UI presentation
- Minimal 3D world (possibly just a skybox or simple terrain)
- Real-time data updates via `player.ui.sendData()`

### Hybrid Option (Recommended)
- Simple 3D visualization of bus traveling between cities
- UI overlays for all gameplay decisions and menus
- 3D moments for key events (stadium arrivals, training)
- Best of both worlds: Hytopia's 3D capabilities + Oregon Trail gameplay

## Key Features to Implement
1. **Journey Map**: Visual progress between tournament cities
2. **Resource Management**: 
   - Team funds
   - Energy/morale meters
   - Equipment durability
   - Medical supplies
3. **Decision System**: Multiple choice events affecting journey
4. **Random Events**: Injuries, weather delays, rival team encounters
5. **Mini-games**: Training exercises, fundraising events
6. **Team Roster**: Manage player stats and health
7. **Achievement System**: Track successful championships

## Sports Storyline Integration
Connects to Final Buzzer MMORPG lore:
- Same sports universe
- Journey through the four sport regions
- References to Champion City
- Unlock content for main game

## Technical Considerations
- **Separate Project**: New folder at `F:\Hytopia-games\final-buzzer-trail\`
- **Minimal 3D Assets**: Focus on UI elements
- **Mobile-First Design**: Ensure responsive UI
- **Save System**: Track progress between sessions
- **Multiplayer Option**: Could add competitive leaderboards

## Development Phases
1. **Phase 1**: Basic UI framework and navigation
2. **Phase 2**: Resource management systems
3. **Phase 3**: Event system and decision trees
4. **Phase 4**: Mini-games and special events
5. **Phase 5**: Polish, balancing, and achievements

## Hytopia SDK Features to Utilize
- `player.ui.load()` - Main game interface
- `player.ui.sendData()` - Update game state
- `EventRouter` - Handle game events
- `world.chatManager` - In-game notifications
- `Audio` class - Background music and sound effects
- Minimal `Entity` usage - Perhaps just for bus visualization

## Next Steps
1. Create new project folder: `final-buzzer-trail`
2. Initialize Hytopia project structure
3. Design UI mockups
4. Implement basic game loop
5. Build out Oregon Trail mechanics

## Notes from Discussion
- User requested UI-only game possibility
- Confirmed Hytopia SDK can support this approach
- Recommended separate project to avoid confusion
- Sports theme maintains connection to original Final Buzzer MMORPG
- Focus on narrative and decision-making gameplay

---
*This README created to maintain context when starting the Final Buzzer Trail project*