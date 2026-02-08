const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// ============================================================
// NFT Ownership Verification (Timeless Characters on Ethereum)
// ============================================================
const TIMELESS_CONTRACT = '0x704bf12276f5c4bc9349d0e119027ead839b081b';
const ETH_RPC = process.env.ETH_RPC || 'https://ethereum-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(ETH_RPC);
const nftContract = new ethers.Contract(TIMELESS_CONTRACT, [
  'function ownerOf(uint256 tokenId) view returns (address)'
], provider);

// Cache ownership checks for 5 minutes to avoid hammering the RPC
const ownershipCache = {}; // `${tokenId}_${wallet}` -> { result: bool, timestamp }
const CACHE_TTL = 5 * 60 * 1000;

async function verifyOwnership(tokenId, walletAddress) {
  const cacheKey = `${tokenId}_${walletAddress.toLowerCase()}`;
  const cached = ownershipCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  try {
    const owner = await nftContract.ownerOf(tokenId);
    const isOwner = owner.toLowerCase() === walletAddress.toLowerCase();
    ownershipCache[cacheKey] = { result: isOwner, timestamp: Date.now() };
    return isOwner;
  } catch (err) {
    console.error(`Ownership check failed for token ${tokenId}:`, err.message);
    return false;
  }
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ============================================================
// JSON File Database
// ============================================================
const DB_FILE = path.join(__dirname, 'data.json');

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { users: {}, plots: {} };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDB();

// Debounced save
let saveTimeout = null;
function debouncedSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveDB(db), 1000);
}

// ============================================================
// Serve static files
// ============================================================
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ============================================================
// Sprite proxy - serves remote spritesheets through our server to avoid CORS
// ============================================================
const https = require('https');
const spriteCache = {};

app.get('/sprites/:num.png', (req, res) => {
  const num = parseInt(req.params.num);
  if (!num || num < 1 || num > 11111) {
    return res.status(400).send('Invalid sprite number');
  }

  // Check cache
  if (spriteCache[num]) {
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(spriteCache[num]);
  }

  const url = `https://endlesscloudscollections.z35.web.core.windows.net/Sprites/${num}.png`;
  https.get(url, (proxyRes) => {
    if (proxyRes.statusCode !== 200) {
      return res.status(404).send('Sprite not found');
    }
    const chunks = [];
    proxyRes.on('data', chunk => chunks.push(chunk));
    proxyRes.on('end', () => {
      const buffer = Buffer.concat(chunks);
      spriteCache[num] = buffer; // Cache in memory
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    });
  }).on('error', () => {
    res.status(500).send('Failed to fetch sprite');
  });
});

// ============================================================
// Track connected players
// ============================================================
const players = {}; // socketId -> { id, username, x, y, scene, avatarIndex }

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Login / Register — with NFT ownership verification
  socket.on('login', async ({ username, charNumber, walletAddress }) => {
    if (!username || username.length < 2 || username.length > 16) {
      socket.emit('loginError', 'Username must be 2-16 characters');
      return;
    }
    const clean = username.replace(/[^a-zA-Z0-9_]/g, '');
    if (clean !== username) {
      socket.emit('loginError', 'Only letters, numbers, underscore allowed');
      return;
    }
    if (!charNumber || charNumber < 1 || charNumber > 11111) {
      socket.emit('loginError', 'Character # must be between 1 and 11111');
      return;
    }
    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      socket.emit('loginError', 'Please enter a valid Ethereum wallet address (0x...)');
      return;
    }

    // Verify NFT ownership on-chain
    socket.emit('loginStatus', 'Verifying NFT ownership on Ethereum...');
    const owns = await verifyOwnership(charNumber, walletAddress);
    if (!owns) {
      socket.emit('loginError', `Wallet does not own Timeless Character #${charNumber}. Check your wallet address and character number.`);
      return;
    }

    // Check if another online player is already using this character
    const alreadyUsing = Object.values(players).find(p => p.charNumber === charNumber);
    if (alreadyUsing) {
      socket.emit('loginError', `Character #${charNumber} is already in use by another player.`);
      return;
    }

    // Find or create user (keyed by wallet + charNumber)
    const userKey = walletAddress.toLowerCase() + '_' + charNumber;
    let user = Object.values(db.users).find(u => u.walletKey === userKey);
    if (!user) {
      const id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      user = { id, username, walletKey: userKey, wallet: walletAddress.toLowerCase(), charNumber, avatarIndex: 0, charConfig: null };
      db.users[id] = user;

      // Create plot
      const plotId = 'p_' + id;
      db.plots[plotId] = { id: plotId, ownerId: id, name: username + "'s Plot", items: [], visitors: [] };
      debouncedSave();
    } else {
      // Update username if changed
      if (user.username !== username) {
        user.username = username;
        debouncedSave();
      }
    }

    // Find user's plot
    const plot = Object.values(db.plots).find(p => p.ownerId === user.id);

    socket.emit('loginSuccess', {
      user: { id: user.id, username: user.username, avatarIndex: user.avatarIndex, charConfig: user.charConfig || null, charNumber: charNumber },
      plot: plot ? { id: plot.id, name: plot.name, items: plot.items } : null
    });
  });

  // Save character config & enter world
  socket.on('enterWorld', ({ charConfig, charNumber }) => {
    // Save config to DB
    for (const [uid, u] of Object.entries(db.users)) {
      if (players[socket.id] && players[socket.id].id === uid) {
        if (charConfig) u.charConfig = charConfig;
        if (charNumber) u.charNumber = charNumber;
        debouncedSave();
        break;
      }
    }

    // Now actually join the marketplace
    const player = players[socket.id];
    if (player) {
      player.charConfig = charConfig;
      player.charNumber = charNumber || null;
      socket.join('marketplace');
      io.to('marketplace').emit('playersUpdate', getPlayersInScene('marketplace'));
    }
  });

  // Register player in memory after login (called right after loginSuccess)
  socket.on('registerPlayer', ({ userId, username, charConfig, charNumber }) => {
    players[socket.id] = {
      id: userId,
      username: username,
      x: 688,
      y: 480,
      scene: 'marketplace',
      avatarIndex: 0,
      charConfig: charConfig || null,
      charNumber: charNumber || null
    };
  });

  // Player movement
  socket.on('move', ({ x, y }) => {
    const player = players[socket.id];
    if (!player) return;
    player.x = x;
    player.y = y;
    socket.to(player.scene).emit('playerMoved', { id: player.id, x, y });
  });

  // Enter plot
  socket.on('enterPlot', ({ plotOwnerId }) => {
    const player = players[socket.id];
    if (!player) return;

    const ownerId = plotOwnerId || player.id;
    const plot = Object.values(db.plots).find(p => p.ownerId === ownerId);
    if (!plot) return;

    const oldScene = player.scene;
    socket.leave(oldScene);

    const newScene = 'plot_' + plot.id;
    player.scene = newScene;
    player.x = 480;
    player.y = 400;
    socket.join(newScene);

    socket.emit('enteredPlot', {
      plot: { id: plot.id, ownerId: ownerId, name: plot.name, items: plot.items },
      isOwner: ownerId === player.id
    });

    io.to(oldScene).emit('playersUpdate', getPlayersInScene(oldScene));
    io.to(newScene).emit('playersUpdate', getPlayersInScene(newScene));
  });

  // Leave plot
  socket.on('leavePlot', () => {
    const player = players[socket.id];
    if (!player) return;

    const oldScene = player.scene;
    socket.leave(oldScene);

    player.scene = 'marketplace';
    player.x = 688;
    player.y = 480;
    socket.join('marketplace');

    socket.emit('enteredMarketplace');
    io.to(oldScene).emit('playersUpdate', getPlayersInScene(oldScene));
    io.to('marketplace').emit('playersUpdate', getPlayersInScene('marketplace'));
  });

  // Place item
  socket.on('placeItem', ({ plotId, item }) => {
    const player = players[socket.id];
    if (!player) return;

    const plot = db.plots[plotId];
    if (!plot) return;

    // Check permission
    if (plot.ownerId !== player.id && !plot.visitors.includes(player.id)) return;

    item.id = 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    plot.items.push(item);
    debouncedSave();

    io.to('plot_' + plotId).emit('itemPlaced', item);
  });

  // Remove item
  socket.on('removeItem', ({ plotId, itemId }) => {
    const player = players[socket.id];
    if (!player) return;

    const plot = db.plots[plotId];
    if (!plot || plot.ownerId !== player.id) return;

    plot.items = plot.items.filter(i => i.id !== itemId);
    debouncedSave();

    io.to('plot_' + plotId).emit('itemRemoved', itemId);
  });

  // Move item
  socket.on('moveItem', ({ plotId, itemId, x, y }) => {
    const player = players[socket.id];
    if (!player) return;

    const plot = db.plots[plotId];
    if (!plot || plot.ownerId !== player.id) return;

    const item = plot.items.find(i => i.id === itemId);
    if (item) {
      item.x = x;
      item.y = y;
      debouncedSave();
      io.to('plot_' + plotId).emit('itemMoved', { itemId, x, y });
    }
  });

  // Invite
  socket.on('inviteToPlot', ({ username }) => {
    const player = players[socket.id];
    if (!player) return;

    const targetUser = Object.values(db.users).find(u => u.username === username);
    if (!targetUser) {
      socket.emit('chatMessage', { from: 'System', text: `User "${username}" not found.` });
      return;
    }

    const plot = Object.values(db.plots).find(p => p.ownerId === player.id);
    if (!plot) return;

    if (!plot.visitors.includes(targetUser.id)) {
      plot.visitors.push(targetUser.id);
      debouncedSave();
    }

    socket.emit('chatMessage', { from: 'System', text: `Invited ${username} to your plot!` });

    for (const [sid, p] of Object.entries(players)) {
      if (p.id === targetUser.id) {
        io.to(sid).emit('chatMessage', {
          from: 'System',
          text: `${player.username} invited you to their plot! Use /visit ${player.username}`
        });
      }
    }
  });

  // Chat
  socket.on('chat', ({ text }) => {
    const player = players[socket.id];
    if (!player || !text || text.length > 200) return;

    if (text.startsWith('/visit ')) {
      const targetName = text.slice(7).trim();
      const targetUser = Object.values(db.users).find(u => u.username === targetName);
      if (targetUser) {
        socket.emit('doVisitPlot', { plotOwnerId: targetUser.id });
      } else {
        socket.emit('chatMessage', { from: 'System', text: `User "${targetName}" not found.` });
      }
      return;
    }

    if (text.startsWith('/invite ')) {
      socket.emit('doInvite', { username: text.slice(8).trim() });
      return;
    }

    io.to(player.scene).emit('chatMessage', { from: player.username, text });
  });

  // Online players
  socket.on('getOnlinePlayers', () => {
    const online = Object.values(players).map(p => ({
      id: p.id, username: p.username, scene: p.scene
    }));
    socket.emit('onlinePlayers', online);
  });

  // Disconnect
  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      const scene = player.scene;
      delete players[socket.id];
      io.to(scene).emit('playersUpdate', getPlayersInScene(scene));
    }
    console.log('Player disconnected:', socket.id);
  });
});

function getPlayersInScene(scene) {
  return Object.values(players)
    .filter(p => p.scene === scene)
    .map(p => ({ id: p.id, username: p.username, x: p.x, y: p.y, avatarIndex: p.avatarIndex, charConfig: p.charConfig || null, charNumber: p.charNumber || null }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Treeverse server running on http://localhost:${PORT}`);
});
