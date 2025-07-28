# Hytopia Map Builder Prompt - UI-Focused Game Map

## Map Overview
- **Total Size**: 70x70 blocks
- **Base Height**: Y=0 (ground level)
- **Theme**: Clean, minimal design optimized for UI overlays
- **Purpose**: Combined single map with all game areas

## Layout Grid (70x70)
```
[0,0]                    [25,0]                   [50,0]
┌────────────────────┬────────────────────┬────────────────────┐
│   Hub Plaza        │   Terminal Room    │   Trading Post     │
│   (20x20)          │   (15x15)          │   (12x12)          │
│   @ [5,5]          │   @ [27,5]         │   @ [50,5]         │
├────────────────────┼────────────────────┼────────────────────┤
│   Portal Nexus     │   Data Vault       │   Garden           │
│   (16x16 circular) │   (10x15)          │   Meditation       │
│   @ [5,27]         │   @ [30,27]        │   (15x15)          │
│                    │                    │   @ [50,27]        │
├────────────────────┼────────────────────┼────────────────────┤
│   Arena Viewing    │   Minigame         │   (Reserved)       │
│   Box (10x10)      │   Chamber          │                    │
│   @ [5,50]         │   (8x8)            │                    │
│   Elevated Y=10    │   @ [27,50]        │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

## Detailed Structure Instructions

### 1. Hub Plaza (Main Spawn) - Position: [5,0,5] to [25,0,25]
- **Floor**: Stone bricks covering entire 20x20 area
- **Pillars**: 3x3x5 quartz block pillars at corners [7,0,7], [7,0,23], [23,0,7], [23,0,23]
- **Fountain**: 
  - Center at [15,0,15]
  - 5-block radius circle using stone slabs for rim
  - Water source blocks in center (3x3)
  - Sea lanterns under water for glow effect
- **Benches**: Oak wood stairs facing fountain at [10,0,15], [20,0,15], [15,0,10], [15,0,20]
- **Walls**: 10-block high stone brick walls with glass pane windows every 5 blocks
- **Spawn Point**: Invisible at [15,1,15]
- **Lighting**: Glowstone hidden under carpet at regular intervals

### 2. Terminal Room - Position: [27,0,5] to [42,0,20]
- **Floor**: Black concrete
- **Walls**: Dark gray concrete, 8 blocks high
- **Ceiling**: Grid pattern alternating black concrete and sea lanterns
- **Central Platform**: [32,0,10] to [37,1,15] using iron blocks
- **Computer Terminals** (4 total):
  - Northeast: [39,0,7] - 3x2x2 black concrete with light blue glass screens
  - Northwest: [30,0,7] - Same design
  - Southeast: [39,0,16] - Same design  
  - Southwest: [30,0,16] - Same design
- **Accents**: Blue stained glass strips along walls at Y=3
- **Door**: 3x3 opening on south wall at [33,0,20]

### 3. Trading Post - Position: [50,0,5] to [62,0,17]
- **Floor**: Oak planks
- **Corner Posts**: Oak logs 5 blocks high at corners
- **Counter**: [52,0,10] to [60,1,12] using oak planks with oak slabs on top
- **Back Wall Shelves**: Oak stairs and slabs creating display shelves [52,1,7] to [60,3,8]
- **Decorations**: Item frames on shelves, hanging banners between posts
- **Merchant Spawn Points**: [55,0,9] and [57,0,9]
- **Customer Spawn Point**: [56,0,14]
- **Open-air design**: No roof

### 4. Portal Nexus - Position: [5,0,27] to [21,0,43] (circular within square)
- **Floor**: Obsidian with end stone accents in circular pattern
- **Central Platform**: [13,1,35] 3x3 raised platform using purpur blocks
- **Portal Frames** (6 total, evenly spaced):
  - North: [13,0,28] - 3x4 frame using red concrete
  - Northeast: [18,0,31] - Orange concrete
  - Southeast: [18,0,39] - Yellow concrete
  - South: [13,0,42] - Green concrete
  - Southwest: [8,0,39] - Blue concrete
  - Northwest: [8,0,31] - Purple concrete
- **Lighting**: Glowstone blocks between each portal
- **Walls**: 6 blocks high, dark prismarine

### 5. Data Vault - Position: [30,0,27] to [40,0,42]
- **Design**: Long corridor running north-south
- **Floor**: White concrete with light gray carpet runner
- **Walls**: White concrete with glass block accents
- **Ceiling**: Sea lantern strips for futuristic lighting
- **Display Alcoves**: 
  - East wall: 5 alcoves at [39,0,29], [39,0,32], [39,0,35], [39,0,38], [39,0,41]
  - West wall: 5 alcoves at [31,0,29], [31,0,32], [31,0,35], [31,0,38], [31,0,41]
  - Each alcove: 2x2x3 with end rod "holograms" on quartz pedestals
- **Entrance**: South end [35,0,42]

### 6. Garden Meditation - Position: [50,0,27] to [65,0,42]
- **Ground**: Mix of grass blocks and gravel in zen patterns
- **Pond**: [55,0,32] to [59,0,36] with water, lily pads
- **Path**: Stone slabs creating winding path from entrance to center
- **Meditation Platform**: [57,0,34] 3x3 smooth quartz
- **Decorations**: 
  - Bamboo/sugar cane clusters at corners
  - Oak leaves for small bushes
  - Stone lanterns (stone + slab + light)
- **Open design**: No walls, natural boundary with hedges

### 7. Arena Viewing Box - Position: [5,10,50] to [15,15,60] (ELEVATED)
- **Access**: Ladder or teleport pad at ground level [10,0,55]
- **Platform**: Barrier blocks for invisible walls, glass floor
- **Seating**: Red and blue wool blocks in stadium style
- **Control Panel**: [9,11,52] 2x3 area with iron blocks, stone buttons, redstone lamps
- **Railings**: Iron bars around edges except glass viewing side
- **Support Pillars**: From ground to platform at corners

### 8. Minigame Chamber - Position: [27,0,50] to [35,0,58]
- **Walls**: Each wall different color wool (red, blue, yellow, green)
- **Floor**: Checkerboard pattern alternating white and black wool
- **Ceiling**: White wool with glowstone center
- **Central Pedestal**: [31,0,54] 1x1x2 using quartz with beacon on top
- **Entrance**: Single 2x3 door on south side

## Pathways and Connections
- **Main Paths**: 3-block wide stone slab paths connecting all ground-level areas
- **Teleport Pads**: Gold blocks with redstone underneath at key transition points
- **Lighting**: Lamp posts (fence + glowstone) every 8 blocks along paths
- **Decorative Elements**: Small gardens, benches, and fountains at path intersections

## Border and Finishing
- **World Border**: 2-block high hedge (leaves) around entire 70x70 perimeter
- **Corner Markers**: Small towers or obelisks at world corners
- **Underground**: Fill with stone to prevent falling through world
- **Skybox**: Leave open for default sky

## Special Notes
- Keep decorations minimal to not interfere with UI overlays
- Use consistent lighting throughout (sea lanterns/glowstone)
- Ensure spawn points are clear of obstructions
- Test all teleport/portal locations
- Consider adding hidden easter eggs or secret areas