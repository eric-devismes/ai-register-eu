// ============================================================
// AEONS OF DUAT — Map & Exploration System
// Tile-based world with NPCs, events, and encounters
// ============================================================

G.maps = (function() {
  // Map definitions
  // Legend: 0=space, 1=floor, 2=floor_alt, 3=wall, 4=door, 5=console, 6=window, 7=crate, 8=alert, 9=heal
  const MAP_DATA = {
    bridge: {
      name: 'BRIDGE - ANKH ASCENDING',
      w: 20, h: 15,
      encounterRate: 0,
      music: 'explore',
      tiles: [
        [0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
        [0,0,3,3,6,6,6,6,6,6,6,6,6,6,6,3,3,0,0,0],
        [0,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,0,0],
        [0,3,6,1,5,1,1,1,1,1,1,1,1,1,5,1,6,3,0,0],
        [0,3,6,1,1,1,1,1,2,2,1,1,1,1,1,1,6,3,0,0],
        [0,3,3,1,1,1,1,2,2,2,2,1,1,1,1,1,3,3,0,0],
        [0,3,6,1,1,1,2,2,5,5,2,2,1,1,1,1,6,3,0,0],
        [0,3,6,1,1,1,2,2,5,5,2,2,1,1,1,1,6,3,0,0],
        [0,3,3,1,1,1,1,2,2,2,2,1,1,1,1,1,3,3,0,0],
        [0,3,6,1,1,1,1,1,2,2,1,1,1,1,1,1,6,3,0,0],
        [0,3,6,1,5,1,1,1,1,1,1,1,1,1,5,1,6,3,0,0],
        [0,3,3,1,1,1,1,1,1,4,1,1,1,1,1,1,3,3,0,0],
        [0,0,3,3,3,3,3,3,3,4,3,3,3,3,3,3,3,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ],
      npcs: [
        { id: 'nav_officer', sprite: 'npc_crew', palette: 'horus', x: 6, y: 6, dir: 'down',
          dialogue: ['NAV OFFICER SHEN:', '"Commander Ra, long-range', 'sensors detect an anomaly', 'near the Kemet Nebula."', '', '"It matches the energy', 'signature of the lost', 'colony ship OSIRIS."'] },
        { id: 'comms', sprite: 'npc_crew', palette: 'bastet', x: 14, y: 4, dir: 'left',
          dialogue: ['COMMS OFFICER Merit:', '"We are receiving a faint', 'distress signal... It has', 'been broadcasting for', '3,000 cycles."', '', '"Someone is still alive."'] },
      ],
      events: [
        { x: 8, y: 8, type: 'interact', id: 'main_console',
          dialogue: ['MAIN CONSOLE:', '"ANKH ASCENDING - STATUS"', 'Hull: 98%  Fuel: 72%', 'Crew: 47 active', '', 'ALERT: Anomalous readings', 'detected in sector 7-DUAT.', 'Recommend investigation.'] },
        { x: 9, y: 8, type: 'interact', id: 'main_console2',
          dialogue: ['TACTICAL DISPLAY:', '"The anomaly is surrounded', 'by Apep Swarm activity."', '', '"Engaging hostiles is', 'unavoidable."'] },
      ],
      exits: [
        { x: 9, y: 12, toMap: 'corridor', toX: 8, toY: 1 },
        { x: 8, y: 13, toMap: 'corridor', toX: 8, toY: 1 },
      ],
    },

    corridor: {
      name: 'MAIN CORRIDOR',
      w: 20, h: 20,
      encounterRate: 0,
      music: 'explore',
      tiles: [
        [3,3,3,3,3,3,3,3,4,4,3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,1,1,1,1,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,1,1,1,1,3,3,3,3,3,3,3,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,3,1,1,7,1,1,1,1,1,1,1,1,7,1,1,1,3,3,3],
        [3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
        [3,3,3,3,3,3,4,1,1,1,1,4,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,4,1,1,1,1,1,1,4,3,3,3,3,3,3,3],
        [3,3,3,3,3,1,1,1,9,1,1,1,1,3,3,3,3,3,3,3],
        [3,3,3,3,3,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,4,4,3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
      ],
      npcs: [
        { id: 'guard1', sprite: 'npc_crew', palette: 'anubis', x: 4, y: 4, dir: 'right',
          dialogue: ['SECURITY CHIEF KHAI:', '"The Apep Swarm grows', 'bolder. They attacked', 'three cargo ships last', 'cycle."', '', '"Stay sharp, Commander."'] },
      ],
      events: [
        { x: 8, y: 16, type: 'heal', id: 'medbay',
          dialogue: ['MEDICAL POD:', '"Initiating healing', 'sequence..."', '', 'HP fully restored!'] },
      ],
      exits: [
        { x: 8, y: 0, toMap: 'bridge', toX: 9, toY: 11 },
        { x: 9, y: 0, toMap: 'bridge', toX: 9, toY: 11 },
        { x: 6, y: 10, toMap: 'quarters', toX: 10, toY: 1 },
        { x: 8, y: 18, toMap: 'hangar', toX: 8, toY: 1 },
        { x: 9, y: 18, toMap: 'hangar', toX: 8, toY: 1 },
      ],
    },

    quarters: {
      name: 'CREW QUARTERS',
      w: 16, h: 12,
      encounterRate: 0,
      music: 'explore',
      tiles: [
        [3,3,3,3,3,3,3,3,3,4,4,3,3,3,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,6,3],
        [3,6,1,1,7,1,1,1,1,1,1,7,1,1,6,3],
        [3,3,1,1,1,1,1,1,1,1,1,1,1,1,3,3],
        [3,6,1,1,1,1,5,1,1,5,1,1,1,1,6,3],
        [3,6,1,1,7,1,1,1,1,1,1,7,1,1,6,3],
        [3,3,1,1,1,1,1,1,1,1,1,1,1,1,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,6,3],
        [3,6,1,1,7,1,1,1,1,1,1,7,1,1,6,3],
        [3,3,1,1,1,1,1,1,1,1,1,1,1,1,3,3],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
      ],
      npcs: [
        { id: 'crew1', sprite: 'npc_crew', palette: 'ra', x: 5, y: 3, dir: 'down',
          dialogue: ['CREW MEMBER:', '"I heard the OSIRIS was', 'carrying something', 'important... Something the', 'old gods wanted hidden."'] },
      ],
      events: [
        { x: 6, y: 4, type: 'interact', id: 'log1',
          dialogue: ['PERSONAL LOG - ANUBIS:', '"Day 847. I have doubts."', '"The Weighing Protocol was', 'meant to judge fairly.', 'But who judges the judges?"', '', '"I must find the OSIRIS."'] },
      ],
      exits: [
        { x: 10, y: 0, toMap: 'corridor', toX: 7, toY: 11 },
        { x: 9, y: 0, toMap: 'corridor', toX: 7, toY: 11 },
      ],
    },

    hangar: {
      name: 'HANGAR BAY',
      w: 20, h: 16,
      encounterRate: 15, // random encounters here
      music: 'explore',
      tiles: [
        [3,3,3,3,3,3,3,4,4,4,4,4,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,1,1,1,1,1,1,1,3,3,3,3,3,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,3,1,1,7,7,1,1,1,1,1,1,1,7,7,1,1,3,3,3],
        [3,3,1,1,7,7,1,1,2,2,1,1,1,7,7,1,1,3,3,3],
        [3,6,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,6,3,3],
        [3,6,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,6,3,3],
        [3,3,1,1,1,1,2,2,8,8,2,2,1,1,1,1,1,3,3,3],
        [3,3,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,3,3,3],
        [3,6,1,1,7,1,1,1,2,2,1,1,1,7,1,1,1,6,3,3],
        [3,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,3,3],
        [3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
        [3,3,3,3,3,3,3,3,1,1,1,3,3,3,3,3,3,3,3,3],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ],
      npcs: [
        { id: 'mechanic', sprite: 'npc_crew', palette: 'ra', x: 5, y: 7, dir: 'right',
          dialogue: ['MECHANIC BENU:', '"The shuttle is prepped."', '"But Commander... the', 'readings from the anomaly...', 'they look like SOMETHING', 'is calling us there."'] },
      ],
      events: [
        { x: 8, y: 8, type: 'interact', id: 'shuttle',
          action: 'launch',
          dialogue: ['SHUTTLE LAUNCH PAD:', '"Shuttle SCARAB ready for', 'launch to sector 7-DUAT."', '', 'Launch shuttle?'] },
      ],
      exits: [
        { x: 8, y: 0, toMap: 'corridor', toX: 8, toY: 17 },
        { x: 9, y: 0, toMap: 'corridor', toX: 8, toY: 17 },
      ],
    },
  };

  // --- Map state ---
  let currentMap = null;
  let mapData = null;
  let camX = 0, camY = 0;

  // --- Player on map ---
  let player = {
    x: 9, y: 9, dir: 'down', moving: false,
    moveTimer: 0, fromX: 0, fromY: 0,
    sprite: 'ra_down', stepCount: 0,
  };

  const MOVE_SPEED = 6; // frames per tile movement

  function loadMap(name, px, py) {
    currentMap = name;
    mapData = MAP_DATA[name];
    if (px !== undefined) player.x = px;
    if (py !== undefined) player.y = py;
    player.moving = false;
    player.moveTimer = 0;
    camX = 0; camY = 0;
    if (mapData.music) G.audio.play(mapData.music);
  }

  function isWalkable(x, y) {
    if (!mapData) return false;
    if (x < 0 || y < 0 || x >= mapData.w || y >= mapData.h) return false;
    const tile = mapData.tiles[y][x];
    if (tile === 3) return false; // wall
    if (tile === 0) return false; // void

    // Check NPC collision
    for (const npc of mapData.npcs) {
      if (npc.x === x && npc.y === y) return false;
    }
    return true;
  }

  function update() {
    if (!mapData) return;
    if (G.dialogueActive) return; // dialogue system handles input

    // Player movement
    if (player.moving) {
      player.moveTimer--;
      if (player.moveTimer <= 0) {
        player.moving = false;
        player.x = player.toX;
        player.y = player.toY;
        player.stepCount++;

        // Check exits
        for (const exit of mapData.exits) {
          if (player.x === exit.x && player.y === exit.y) {
            loadMap(exit.toMap, exit.toX, exit.toY);
            return;
          }
        }

        // Random encounters
        if (mapData.encounterRate > 0 && player.stepCount % 4 === 0) {
          if (Math.random() * 100 < mapData.encounterRate) {
            G.audio.sfx('encounter');
            G.goScene('battle', { type: 'random' }, 'fade');
            return;
          }
        }
      }
    }

    if (!player.moving) {
      let dx = 0, dy = 0;
      if (G.keys.up) { dy = -1; player.dir = 'up'; }
      else if (G.keys.down) { dy = 1; player.dir = 'down'; }
      else if (G.keys.left) { dx = -1; player.dir = 'left'; }
      else if (G.keys.right) { dx = 1; player.dir = 'right'; }

      if (dx !== 0 || dy !== 0) {
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (isWalkable(nx, ny)) {
          player.moving = true;
          player.moveTimer = MOVE_SPEED;
          player.fromX = player.x;
          player.fromY = player.y;
          player.toX = nx;
          player.toY = ny;
        }
      }

      // Interact (confirm button)
      if (G.justPressed.confirm) {
        const faceDirs = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
        const [fdx, fdy] = faceDirs[player.dir];
        const fx = player.x + fdx;
        const fy = player.y + fdy;

        // Check NPCs
        for (const npc of mapData.npcs) {
          if (npc.x === fx && npc.y === fy) {
            G.audio.sfx('confirm');
            G.dialogue.start(npc.dialogue);
            return;
          }
        }

        // Check events at player pos or facing pos
        for (const ev of mapData.events) {
          if ((ev.x === fx && ev.y === fy) || (ev.x === player.x && ev.y === player.y)) {
            G.audio.sfx('confirm');
            if (ev.type === 'heal') {
              G.party.forEach(p => { p.hp = p.maxHp; p.mp = p.maxMp; });
            }
            G.dialogue.start(ev.dialogue);
            return;
          }
        }
      }

      // Menu
      if (G.justPressed.menu) {
        G.audio.sfx('confirm');
        G.goScene('menu', { returnScene: 'explore' });
      }
    }

    // Update sprite based on direction
    const charId = G.party[0] ? G.party[0].charId : 'ra';
    player.sprite = charId + '_' + player.dir;

    // Camera
    const targetCX = player.x * G.TILE - G.IW / 2 + G.TILE / 2;
    const targetCY = player.y * G.TILE - G.IH / 2 + G.TILE / 2;
    const maxCX = mapData.w * G.TILE - G.IW;
    const maxCY = mapData.h * G.TILE - G.IH;
    camX = G.clamp(G.lerp(camX, targetCX, 0.2), 0, Math.max(0, maxCX));
    camY = G.clamp(G.lerp(camY, targetCY, 0.2), 0, Math.max(0, maxCY));
  }

  function draw() {
    if (!mapData) return;
    G.cls('#000');

    const T = G.TILE;
    const ox = -Math.round(camX);
    const oy = -Math.round(camY);

    // Draw tiles
    const startCol = Math.max(0, Math.floor(camX / T));
    const startRow = Math.max(0, Math.floor(camY / T));
    const endCol = Math.min(mapData.w, startCol + Math.ceil(G.IW / T) + 2);
    const endRow = Math.min(mapData.h, startRow + Math.ceil(G.IH / T) + 2);

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        G.sprites.drawTile(mapData.tiles[r][c], c * T + ox, r * T + oy);
      }
    }

    // Draw NPCs
    for (const npc of mapData.npcs) {
      const nx = npc.x * T + ox;
      const ny = npc.y * T + oy - 6;
      if (nx > -T && nx < G.IW + T && ny > -T && ny < G.IH + T) {
        G.sprites.drawMapSprite(npc.sprite, nx, ny);
      }
    }

    // Draw player
    let px, py;
    if (player.moving) {
      const t = 1 - player.moveTimer / MOVE_SPEED;
      px = G.lerp(player.fromX, player.toX, t) * T + ox;
      py = G.lerp(player.fromY, player.toY, t) * T + oy - 6;
    } else {
      px = player.x * T + ox;
      py = player.y * T + oy - 6;
    }
    G.sprites.drawMapSprite(player.sprite, px, py);

    // Map name (top)
    G.window(0, 0, G.IW, 14);
    G.textCenter(mapData.name, 4, '#aaccff');

    // Draw dialogue if active
    if (G.dialogueActive) {
      G.dialogue.draw();
    }
  }

  return { loadMap, update, draw, player, getMapData: () => mapData, MAP_DATA };
})();
