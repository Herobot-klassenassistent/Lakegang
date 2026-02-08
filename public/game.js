// ============================================================
// LAKEGANG - HD Pixel Art Game Client
// ============================================================
const socket = io();

let gameState = {
  user: null, plot: null, currentScene: 'marketplace',
  isInPlot: false, isOwner: false, currentPlotData: null,
  decorateMode: false, selectedItem: null, placingItem: null,
  players: {}, game: null, charConfig: null
};

// ============================================================
// TIMELESS CHARACTER TRAIT SYSTEM
// ============================================================
const CHAR_TRAITS = {
  gender: {
    label: 'Gender', options: [
      { id: 'male', name: 'Male' },
      { id: 'female', name: 'Female' },
    ]
  },
  breed: {
    label: 'Breed', options: [
      { id: 'human', name: 'Human', skinBase: '#f0c8a0' },
      { id: 'elf', name: 'Elf', skinBase: '#e8dcc8' },
      { id: 'demon', name: 'Demon', skinBase: '#c87878' },
      { id: 'zombie', name: 'Zombie', skinBase: '#8aaa7a' },
      { id: 'spirit', name: 'Spirit', skinBase: '#b0c8e8' },
    ]
  },
  skinTone: {
    label: 'Skin Tone', options: [
      { id: 'light', name: 'Light', mod: 0 },
      { id: 'medium', name: 'Medium', mod: -20 },
      { id: 'tan', name: 'Tan', mod: -35 },
      { id: 'dark', name: 'Dark', mod: -55 },
    ]
  },
  hairStyle: {
    label: 'Hair Style', options: [
      { id: 'messy', name: 'Messy' },
      { id: 'styled', name: 'Styled' },
      { id: 'long', name: 'Long' },
      { id: 'twin_tails', name: 'Twin Tails' },
      { id: 'buzzcut', name: 'Buzzcut' },
      { id: 'spiky', name: 'Spiky' },
      { id: 'ponytail', name: 'Ponytail' },
      { id: 'bangs', name: 'Long Bangs' },
    ]
  },
  hairColor: {
    label: 'Hair Color', options: [
      { id: 'black', name: 'Black', color: '#1a1a2a' },
      { id: 'brown', name: 'Brown', color: '#5a3a1a' },
      { id: 'blonde', name: 'Blonde', color: '#d4a843' },
      { id: 'red', name: 'Red', color: '#aa3a2a' },
      { id: 'blue', name: 'Blue', color: '#3a5aaa' },
      { id: 'pink', name: 'Pink', color: '#cc5a8a' },
      { id: 'white', name: 'White', color: '#ccccdd' },
      { id: 'green', name: 'Green', color: '#3a8a4a' },
    ]
  },
  eyeColor: {
    label: 'Eye Color', options: [
      { id: 'blue', name: 'Blue', color: '#4488cc' },
      { id: 'brown', name: 'Brown', color: '#8a6a3a' },
      { id: 'green', name: 'Green', color: '#4a9a5a' },
      { id: 'golden', name: 'Golden', color: '#ccaa33' },
      { id: 'red', name: 'Red', color: '#cc4444' },
      { id: 'violet', name: 'Violet', color: '#8855bb' },
      { id: 'cyan', name: 'Cyan', color: '#44cccc' },
    ]
  },
  emotion: {
    label: 'Emotion', options: [
      { id: 'neutral', name: 'Neutral' },
      { id: 'happy', name: 'Happy' },
      { id: 'angry', name: 'Angry' },
      { id: 'sad', name: 'Sad' },
    ]
  },
  clothing: {
    label: 'Clothing', options: [
      { id: 'tunic', name: 'Tunic', color: '#4a70b8' },
      { id: 'bomber', name: 'Bomber Jacket', color: '#555555' },
      { id: 'sweater', name: 'Sweater', color: '#8a5a3a' },
      { id: 'armor', name: 'Armor', color: '#8a8a9a' },
      { id: 'robe', name: 'Robe', color: '#6a3a9a' },
      { id: 'dress', name: 'Dress', color: '#cc5577' },
      { id: 'scarf_top', name: 'Scarf Top', color: '#cc7733' },
      { id: 'fur_jacket', name: 'Fur Jacket', color: '#7a6a5a' },
    ]
  },
  clothingColor: {
    label: 'Outfit Color', options: [
      { id: 'blue', name: 'Blue', mod: '#4a70b8' },
      { id: 'red', name: 'Red', mod: '#b84a4a' },
      { id: 'green', name: 'Green', mod: '#4a8a4a' },
      { id: 'purple', name: 'Purple', mod: '#7a4a9a' },
      { id: 'gold', name: 'Gold', mod: '#b89a40' },
      { id: 'black', name: 'Black', mod: '#3a3a4a' },
      { id: 'white', name: 'White', mod: '#c8c8d8' },
      { id: 'teal', name: 'Teal', mod: '#3a8a8a' },
    ]
  },
  hat: {
    label: 'Hat', options: [
      { id: 'none', name: 'None' },
      { id: 'baseball', name: 'Baseball Cap' },
      { id: 'beret', name: 'Beret' },
      { id: 'hood', name: 'Hood' },
      { id: 'crown', name: 'Crown' },
      { id: 'headband', name: 'Headband' },
    ]
  },
  face: {
    label: 'Face Accessory', options: [
      { id: 'none', name: 'None' },
      { id: 'mask', name: 'Black Mask' },
      { id: 'scar', name: 'Scar' },
      { id: 'blush', name: 'Blush' },
      { id: 'freckles', name: 'Freckles' },
    ]
  },
  back: {
    label: 'Back Item', options: [
      { id: 'none', name: 'None' },
      { id: 'cape', name: 'Cape' },
      { id: 'sword', name: 'Broad Sword' },
      { id: 'bow', name: 'Bow' },
      { id: 'scythe', name: 'Scythe' },
      { id: 'wings', name: 'Wings' },
      { id: 'guitar', name: 'Guitar' },
    ]
  },
  neck: {
    label: 'Neck', options: [
      { id: 'none', name: 'None' },
      { id: 'chain', name: 'Chain' },
      { id: 'scarf', name: 'Scarf' },
    ]
  },
};

function getDefaultCharConfig() {
  const cfg = {};
  for (const [key, trait] of Object.entries(CHAR_TRAITS)) {
    cfg[key] = trait.options[0].id;
  }
  return cfg;
}

function randomCharConfig() {
  const cfg = {};
  for (const [key, trait] of Object.entries(CHAR_TRAITS)) {
    cfg[key] = trait.options[Math.floor(Math.random() * trait.options.length)].id;
  }
  return cfg;
}

function getTraitOption(traitKey, optionId) {
  const trait = CHAR_TRAITS[traitKey];
  return trait?.options.find(o => o.id === optionId) || trait?.options[0];
}

// ============================================================
// DYNAMIC CHARACTER SPRITE RENDERER
// ============================================================
// ============================================================
// CHIBI ANIME CHARACTER RENDERER (based on character.jpg reference)
// Style: Large head (~40%), big anime eyes, bomber jacket, soft shading
// Frame: 40x56 per frame, 4 frames (idle, walk1, idle2, walk2)
// ============================================================
const CHAR_FW = 40, CHAR_FH = 56;

function renderCharacterFrame(ctx, ox, cfg, frame) {
  const R = (x,y,w,h,c) => { ctx.fillStyle=c; ctx.fillRect(ox+x,y,w,h); };

  const breed = getTraitOption('breed', cfg.breed);
  const skinTone = getTraitOption('skinTone', cfg.skinTone);
  const hairOpt = getTraitOption('hairColor', cfg.hairColor);
  const eyeOpt = getTraitOption('eyeColor', cfg.eyeColor);
  const clothOpt = getTraitOption('clothing', cfg.clothing);
  const colorOpt = getTraitOption('clothingColor', cfg.clothingColor);
  const isFemale = cfg.gender === 'female';

  // Resolve colors
  const skinBase = breed.skinBase || '#f0c8a0';
  const skinMod = skinTone.mod || 0;
  const skinRgb = hexToRgb(skinBase);
  const skin = rgbToHex(skinRgb.r + skinMod, skinRgb.g + skinMod, skinRgb.b + skinMod);
  const skinHi = shade(skin, 12);
  const skinSh = shade(skin, -18);
  const skinSh2 = shade(skin, -30);
  const hair = hairOpt.color || '#1a1a3a';
  const hairHi = shade(hair, 30);
  const hairHi2 = shade(hair, 50);
  const hairSh = shade(hair, -15);
  const eyes = eyeOpt.color || '#4477cc';
  const eyeHi = shade(eyes, 40);
  const jacket = colorOpt.mod || clothOpt.color || '#2a2a4a';
  const jacketHi = shade(jacket, 15);
  const jacketSh = shade(jacket, -12);
  const jacketSh2 = shade(jacket, -25);
  const undershirt = '#c8bfa8'; // beige/khaki like reference
  const undershirtHi = shade(undershirt, 10);
  const pants = shade(jacket, -15);
  const pantsHi = shade(pants, 10);
  const pantsSh = shade(pants, -12);
  const boots = shade(jacket, -35);
  const bootsHi = shade(boots, 12);

  // Walk cycle offsets
  let legL=0,legR=0,armL=0,armR=0,bob=0;
  if (frame===1) { legL=-2;legR=2;armL=1;armR=-1;bob=-1; }
  else if (frame===3) { legL=2;legR=-2;armL=-1;armR=1;bob=-1; }

  // center X = 20
  const cx = 20;

  // === SHADOW ===
  ctx.globalAlpha=0.2; fillOval(ctx,ox+cx,54,12,3,'#000'); ctx.globalAlpha=1;

  // === BACK ITEM (behind body) ===
  const backItem = cfg.back;
  if (backItem === 'cape') {
    R(10,24+bob,20,20,shade(jacket,-20)); R(11,25+bob,18,18,shade(jacket,-8));
    if(frame===1||frame===3){R(9,40+bob,2,3,shade(jacket,-25));R(29,40+bob,2,3,shade(jacket,-25));}
  } else if (backItem === 'wings') {
    ctx.globalAlpha=0.6;
    // Left wing
    R(1,14+bob,7,16,shade(jacket,25)); R(2,16+bob,5,12,shade(jacket,45));
    // Right wing
    R(32,14+bob,7,16,shade(jacket,25)); R(33,16+bob,5,12,shade(jacket,45));
    ctx.globalAlpha=1;
  } else if (backItem === 'sword') {
    R(28,4+bob,3,38,'#778'); R(28,4+bob,3,2,'#aab');
    R(27,40+bob,5,3,'#7a5a2a'); R(28,43+bob,3,2,'#555');
  } else if (backItem === 'bow') {
    ctx.save(); ctx.strokeStyle='#7a4a2a'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(ox+32,26+bob,16,Math.PI*-0.35,Math.PI*0.35); ctx.stroke();
    ctx.strokeStyle='#999'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(ox+32,11+bob); ctx.lineTo(ox+32,41+bob); ctx.stroke();
    ctx.restore();
  } else if (backItem === 'scythe') {
    R(28,2+bob,2,40,'#5a4a3a'); R(24,2+bob,10,3,'#889'); R(24,2+bob,4,7,'#99a');
  } else if (backItem === 'guitar') {
    R(28,16+bob,2,24,'#5a3a1a');
    fillOval(ctx,ox+29,36+bob,5,6,'#8a5a2a'); fillOval(ctx,ox+29,36+bob,3,4,'#aa7a4a');
  }

  // === SHOES ===
  R(10+legL,50,6,4,boots); R(10+legL,50,6,1,bootsHi); R(9+legL,53,7,2,shade(boots,-8));
  R(24+legR,50,6,4,boots); R(24+legR,50,6,1,bootsHi); R(23+legR,53,7,2,shade(boots,-8));

  // === LEGS / PANTS ===
  R(11+legL,38+bob,6,13,pants); R(12+legL,39+bob,4,11,pantsHi);
  R(13+legL,44+bob,2,1,pantsSh); // knee crease
  R(23+legR,38+bob,6,13,pants); R(24+legR,39+bob,4,11,pantsHi);
  R(25+legR,44+bob,2,1,pantsSh);

  // === TORSO - UNDERSHIRT (beige, visible in open jacket) ===
  R(13,26+bob,14,13,undershirt);
  R(14,27+bob,12,11,undershirtHi);

  // === JACKET (main clothing layer, open-front bomber style like reference) ===
  const clothType = cfg.clothing;

  if (clothType === 'bomber' || clothType === 'tunic') {
    // Left jacket panel
    R(9,25+bob,7,14,jacket); R(10,26+bob,5,12,jacketHi);
    // Right jacket panel
    R(24,25+bob,7,14,jacket); R(25,26+bob,5,12,jacketHi);
    // Collar (standing up like reference)
    R(10,23+bob,5,3,jacket); R(11,23+bob,3,2,jacketHi);
    R(25,23+bob,5,3,jacket); R(26,23+bob,3,2,jacketHi);
    // Zipper edge
    R(15,26+bob,1,12,jacketSh); R(24,26+bob,1,12,jacketSh);
    // Sleeve seam detail (like reference 3 diagonal lines)
    R(10,29+bob,1,1,jacketSh2); R(11,30+bob,1,1,jacketSh2); R(12,31+bob,1,1,jacketSh2);
    R(28,29+bob,1,1,jacketSh2); R(27,30+bob,1,1,jacketSh2); R(26,31+bob,1,1,jacketSh2);
  } else if (clothType === 'armor') {
    R(9,25+bob,22,14,jacket); R(10,26+bob,20,12,jacketHi);
    R(8,24+bob,5,5,jacketSh); R(8,24+bob,5,1,'#bbb'); // shoulder L
    R(27,24+bob,5,5,jacketSh); R(27,24+bob,5,1,'#bbb'); // shoulder R
    R(16,28+bob,8,6,shade(jacket,5)); R(18,29+bob,4,3,'#d4a843'); // chest plate
  } else if (clothType === 'robe') {
    R(8,25+bob,24,18,jacket); R(9,26+bob,22,16,jacketHi);
    R(19,27+bob,1,14,jacketSh); R(20,27+bob,1,14,shade(jacket,18));
  } else if (clothType === 'dress' && isFemale) {
    R(9,25+bob,22,18,jacket); R(10,26+bob,20,16,jacketHi);
    R(7,38+bob,4,6,jacket); R(29,38+bob,4,6,jacket); // flare
  } else if (clothType === 'sweater') {
    R(9,25+bob,22,14,jacket); R(10,26+bob,20,12,jacketHi);
    R(10,24+bob,20,2,shade(jacket,15)); // collar fold
    // Knit texture
    for(let ty=28+bob;ty<38+bob;ty+=2){R(12,ty,1,1,jacketSh);R(16,ty+1,1,1,jacketSh);R(20,ty,1,1,jacketSh);R(24,ty+1,1,1,jacketSh);}
  } else if (clothType === 'scarf_top') {
    R(9,25+bob,22,14,jacket); R(10,26+bob,20,12,jacketHi);
    // Scarf wrap
    R(11,23+bob,18,3,shade(jacket,20)); R(12,22+bob,5,4,shade(jacket,25));
    R(12,26+bob,3,5,shade(jacket,15)); // hanging end
  } else if (clothType === 'fur_jacket') {
    R(9,25+bob,22,14,jacket); R(10,26+bob,20,12,jacketHi);
    R(9,24+bob,22,3,'#c8b898'); R(10,24+bob,20,2,'#d8caa8'); // fur collar
  } else {
    // Default: open jacket style
    R(9,25+bob,7,14,jacket); R(10,26+bob,5,12,jacketHi);
    R(24,25+bob,7,14,jacket); R(25,26+bob,5,12,jacketHi);
    R(10,23+bob,5,3,jacket); R(25,23+bob,5,3,jacket);
  }

  // === ARMS ===
  // Left arm (jacket sleeve)
  R(5,26+bob+armL,5,12,jacket); R(6,27+bob+armL,3,10,jacketHi);
  // Left hand
  R(5,38+bob+armL,5,3,skin); R(6,38+bob+armL,3,2,skinHi);
  // Right arm
  R(30,26+bob+armR,5,12,jacket); R(31,27+bob+armR,3,10,jacketHi);
  // Right hand
  R(30,38+bob+armR,5,3,skin); R(31,38+bob+armR,3,2,skinHi);

  // === NECK ===
  R(16,21+bob,8,5,skin); R(17,22+bob,6,3,skinHi);
  // Neck shadow under chin
  R(16,21+bob,8,1,skinSh);

  if (cfg.neck === 'chain') {
    R(15,23+bob,10,1,'#d4a843'); R(19,24+bob,2,2,'#d4a843'); R(19,24+bob,1,1,'#ffe888');
  } else if (cfg.neck === 'scarf') {
    R(13,22+bob,14,3,shade(jacket,20)); R(14,22+bob,5,4,shade(jacket,30));
  }

  // === HEAD (large chibi head ~40% of body, rounder) ===
  // Head base - round face
  R(10,3+bob,20,18,skin);
  R(11,2+bob,18,1,skin); // top curve
  R(12,1+bob,16,1,skin); // top curve 2
  R(9,5+bob,1,14,skin);  // left side curve
  R(30,5+bob,1,14,skin); // right side curve
  // Face highlight (lighter center)
  R(12,4+bob,16,15,skinHi);
  // Left face shadow (subtle 3/4 view shading)
  R(10,5+bob,2,13,skinSh);
  // Jaw shadow
  R(12,18+bob,16,1,skinSh);
  // Cheek warmth
  ctx.globalAlpha=0.12; fillOval(ctx,ox+13,15+bob,3,2,'#ee8888'); fillOval(ctx,ox+27,15+bob,3,2,'#ee8888'); ctx.globalAlpha=1;

  // === EARS ===
  R(8,10+bob,3,4,skin); R(9,11+bob,1,2,skinSh);
  R(29,10+bob,3,4,skin); R(30,11+bob,1,2,skinSh);
  if (cfg.breed === 'elf') {
    R(7,7+bob,2,3,skin); R(8,6+bob,1,2,skin);
    R(30,7+bob,2,3,skin); R(31,6+bob,1,2,skin);
  }

  // === EYES (big anime eyes like reference — key feature!) ===
  // Eye whites (large, 4x5)
  R(13,9+bob,5,5,'#fff'); R(22,9+bob,5,5,'#fff');
  // Top lash line (thick dark, defining feature)
  R(12,8+bob,7,2,shade(hair,-30)); R(21,8+bob,7,2,shade(hair,-30));
  // Irises (3x4, large and expressive)
  R(14,10+bob,3,4,eyes); R(23,10+bob,3,4,eyes);
  // Iris gradient (darker bottom)
  R(14,12+bob,3,2,shade(eyes,-20));R(23,12+bob,3,2,shade(eyes,-20));
  // Pupils (2x2)
  R(15,11+bob,2,2,'#0a0a1a'); R(24,11+bob,2,2,'#0a0a1a');
  // Eye highlight/shine (big anime sparkle - top left)
  R(14,10+bob,2,1,'#fff'); R(14,10+bob,1,2,'#eef');
  R(23,10+bob,2,1,'#fff'); R(23,10+bob,1,2,'#eef');
  // Small secondary highlight
  R(16,13+bob,1,1,eyeHi);R(25,13+bob,1,1,eyeHi);
  // Under-eye shadow
  R(13,14+bob,5,1,skinSh); R(22,14+bob,5,1,skinSh);

  // === EYEBROWS ===
  const emo = cfg.emotion;
  if (emo === 'angry') {
    R(13,7+bob,5,1,shade(hair,-25)); R(12,8+bob,1,1,shade(hair,-25)); // angled down-in
    R(22,7+bob,5,1,shade(hair,-25)); R(27,8+bob,1,1,shade(hair,-25));
  } else if (emo === 'sad') {
    R(13,7+bob,5,1,hairSh); R(13,6+bob,1,1,hairSh); // raised inner
    R(22,7+bob,5,1,hairSh); R(27,6+bob,1,1,hairSh);
  } else {
    // Neutral / happy — subtle, slightly arched
    R(13,7+bob,5,1,shade(hair,-20)); R(22,7+bob,5,1,shade(hair,-20));
  }

  // === NOSE (subtle dot like reference) ===
  R(19,14+bob,2,2,skinSh); R(19,14+bob,1,1,skinHi);

  // === MOUTH ===
  if (emo === 'happy') {
    R(17,17+bob,6,1,skinSh2); R(18,18+bob,4,1,skin); // smile curve
  } else if (emo === 'sad') {
    R(18,18+bob,4,1,skinSh2); R(17,17+bob,6,1,skin); // frown
  } else if (emo === 'angry') {
    R(17,17+bob,6,1,skinSh2); // firm line
  } else {
    R(18,17+bob,4,1,skinSh); // small neutral
  }

  // === FACE ACCESSORY ===
  if (cfg.face === 'mask') {
    R(11,14+bob,18,5,'#2a2a3a'); R(12,15+bob,16,3,'#1a1a2a');
  } else if (cfg.face === 'scar') {
    R(24,10+bob,1,6,shade(skin,-30)); R(23,13+bob,1,1,shade(skin,-30));
  } else if (cfg.face === 'blush') {
    ctx.globalAlpha=0.25;
    fillOval(ctx,ox+14,16+bob,3,2,'#ff8888');
    fillOval(ctx,ox+26,16+bob,3,2,'#ff8888');
    ctx.globalAlpha=1;
  } else if (cfg.face === 'freckles') {
    const fc = shade(skin,-25);
    R(13,14+bob,1,1,fc);R(15,15+bob,1,1,fc);R(14,16+bob,1,1,fc);
    R(25,14+bob,1,1,fc);R(27,15+bob,1,1,fc);R(26,16+bob,1,1,fc);
  }

  // === BREED EFFECTS ===
  if (cfg.breed === 'demon') {
    R(12,0+bob,3,4,'#3a2028'); R(12,0+bob,1,2,'#4a3038');
    R(25,0+bob,3,4,'#3a2028'); R(27,0+bob,1,2,'#4a3038');
  }
  if (cfg.breed === 'zombie') {
    ctx.globalAlpha=0.12; R(10,3+bob,20,18,'#5a8a3a'); ctx.globalAlpha=1;
  }
  if (cfg.breed === 'spirit') {
    ctx.globalAlpha=0.08; fillOval(ctx,ox+cx,30+bob,18,28,'#88ccff'); ctx.globalAlpha=1;
  }

  // === HAIR (big, messy, anime-style like reference) ===
  const hs = cfg.hairStyle;
  const hatType = cfg.hat;

  if (hatType === 'none' || hatType === 'headband') {
    if (hs === 'messy') {
      // Big messy hair like reference — dark, voluminous, slightly spiky
      R(8,0+bob,24,6,hair); R(9,0+bob,22,1,hairHi); // top mass
      R(7,1+bob,3,10,hair); R(28,1+bob,5,9,hair); // sides
      R(10,0+bob,3,1,hairHi2); R(19,0+bob,2,1,hairHi2); // subtle highlights
      // Bangs over forehead (key feature from reference)
      R(11,5+bob,8,5,hair); R(12,5+bob,6,3,hairHi);
      R(20,4+bob,6,4,hair); R(21,4+bob,4,2,hairHi);
      // Tuft sticking up (reference has little spike on top)
      R(18,0+bob,2,1,hair); R(19,0+bob,1,1,hairHi);
      // Hair over ears slightly
      R(8,8+bob,3,6,hair); R(29,8+bob,3,5,hair);
      // Back hair volume
      R(9,3+bob,22,4,hair);
    } else if (hs === 'styled') {
      R(9,0+bob,22,6,hair); R(10,0+bob,20,1,hairHi);
      R(8,2+bob,3,10,hair); R(29,2+bob,3,10,hair);
      R(12,4+bob,5,5,hair); R(13,4+bob,3,3,hairHi); // side-swept bangs
      R(11,0+bob,4,2,hairHi);
    } else if (hs === 'long') {
      R(8,0+bob,24,6,hair); R(9,0+bob,22,1,hairHi);
      R(7,3+bob,4,20,hair); R(8,4+bob,2,18,hairHi); // left long
      R(29,3+bob,4,20,hair); R(30,4+bob,2,16,hairHi); // right long
      R(11,5+bob,6,4,hair); R(12,5+bob,4,2,hairHi); // bangs
    } else if (hs === 'twin_tails') {
      R(9,0+bob,22,6,hair); R(10,0+bob,20,1,hairHi);
      R(8,2+bob,3,8,hair); R(29,2+bob,3,8,hair);
      // Twin tails
      R(5,9+bob,4,18,hair); R(6,10+bob,2,16,hairHi);
      R(31,9+bob,4,18,hair); R(32,10+bob,2,16,hairHi);
      R(11,5+bob,6,4,hair);
    } else if (hs === 'buzzcut') {
      R(10,1+bob,20,4,hair); R(11,0+bob,18,2,hair);
      R(12,1+bob,16,1,hairHi);
      R(9,3+bob,2,6,hair); R(29,3+bob,2,6,hair);
    } else if (hs === 'spiky') {
      R(8,1+bob,24,5,hair);
      R(11,0+bob,4,2,hair); R(17,0+bob,4,2,hair); R(24,0+bob,4,2,hair); R(7,0+bob,4,2,hair);
      R(12,0+bob,2,1,hairHi); R(18,0+bob,2,1,hairHi); R(25,0+bob,1,1,hairHi);
      R(8,3+bob,3,8,hair); R(29,3+bob,3,8,hair);
      R(11,5+bob,6,4,hair);
    } else if (hs === 'ponytail') {
      R(9,0+bob,22,6,hair); R(10,0+bob,20,1,hairHi);
      R(8,2+bob,3,8,hair); R(29,2+bob,3,8,hair);
      R(11,5+bob,6,4,hair); R(12,5+bob,4,2,hairHi);
      // Ponytail
      R(28,7+bob,4,20,hair); R(29,8+bob,2,18,hairHi);
    } else if (hs === 'bangs') {
      R(8,0+bob,24,6,hair); R(9,0+bob,22,1,hairHi);
      R(7,3+bob,4,12,hair); R(29,3+bob,4,12,hair);
      // Heavy bangs covering forehead
      R(10,4+bob,10,6,hair); R(11,4+bob,8,4,hairHi);
      R(22,5+bob,6,4,hair);
    }
  }

  // === HAT (on top of hair) ===
  if (hatType === 'baseball') {
    R(8,0+bob,24,5,'#cc4444'); R(9,0+bob,22,1,shade('#cc4444',20));
    R(5,4+bob,30,2,shade('#cc4444',-10));
  } else if (hatType === 'beret') {
    fillOval(ctx,ox+cx,2+bob,14,5,'#884488');
    R(10,2+bob,20,3,'#884488'); R(11,1+bob,18,1,shade('#884488',20));
  } else if (hatType === 'hood') {
    R(7,0+bob,26,8,jacketSh); R(8,1+bob,24,6,jacket);
    R(6,5+bob,4,10,jacketSh); R(30,5+bob,4,10,jacketSh);
  } else if (hatType === 'crown') {
    R(10,0+bob,20,4,'#d4a843'); R(11,0+bob,18,1,'#ffe888');
    R(10,0+bob,3,1,'#ffe888'); R(19,0+bob,3,1,'#ffe888'); R(27,0+bob,3,1,'#ffe888');
    R(11,-1+bob,2,1,'#d4a843'); R(20,-1+bob,2,1,'#d4a843'); R(27,-1+bob,2,1,'#d4a843');
  } else if (hatType === 'headband') {
    R(9,5+bob,22,2,shade('#cc3333',0)); R(10,5+bob,20,1,shade('#cc3333',25));
  }
}

function generateCharacterSpritesheet(phaserScene, textureKey, cfg) {
  const FW = CHAR_FW, FH = CHAR_FH, FRAMES = 4;
  const canvas = document.createElement('canvas');
  canvas.width = FW * FRAMES; canvas.height = FH;
  const ctx = canvas.getContext('2d');
  for (let f = 0; f < FRAMES; f++) {
    renderCharacterFrame(ctx, f * FW, cfg, f);
  }
  if (phaserScene.textures.exists(textureKey)) {
    phaserScene.textures.remove(textureKey);
  }
  phaserScene.textures.addSpriteSheet(textureKey, canvas, { frameWidth: FW, frameHeight: FH });
  if (phaserScene.anims.exists(textureKey + '_idle')) phaserScene.anims.remove(textureKey + '_idle');
  if (phaserScene.anims.exists(textureKey + '_walk')) phaserScene.anims.remove(textureKey + '_walk');
  phaserScene.anims.create({ key: textureKey + '_idle', frames: [{key:textureKey,frame:0}], frameRate:1, repeat:-1 });
  phaserScene.anims.create({ key: textureKey + '_walk', frames: phaserScene.anims.generateFrameNumbers(textureKey,{start:0,end:3}), frameRate:8, repeat:-1 });
}

// ============================================================
// CHARACTER CREATOR UI
// ============================================================
function initCharacterCreator(existingConfig) {
  const cfg = existingConfig || randomCharConfig();
  gameState.charConfig = cfg;

  const traitsDiv = document.getElementById('creator-traits');
  traitsDiv.innerHTML = '';

  for (const [key, trait] of Object.entries(CHAR_TRAITS)) {
    const group = document.createElement('div');
    group.className = 'trait-group';
    const label = document.createElement('label');
    label.textContent = trait.label;
    group.appendChild(label);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'trait-options';

    for (const opt of trait.options) {
      const btn = document.createElement('button');
      btn.className = 'trait-btn';
      btn.dataset.trait = key;
      btn.dataset.value = opt.id;

      // Add color dot for color-based traits
      if (opt.color || opt.mod) {
        const dot = document.createElement('span');
        dot.className = 'color-dot';
        dot.style.background = opt.color || opt.mod || '#888';
        btn.appendChild(dot);
      }
      btn.appendChild(document.createTextNode(opt.name));

      if (cfg[key] === opt.id) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        optionsDiv.querySelectorAll('.trait-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameState.charConfig[key] = opt.id;
        updateCreatorPreview();
      });

      optionsDiv.appendChild(btn);
    }
    group.appendChild(optionsDiv);
    traitsDiv.appendChild(group);
  }

  updateCreatorPreview();
}

function updateCreatorPreview() {
  const canvas = document.getElementById('preview-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const charNum = gameState.charNumber || 1;
  const spriteUrl = `/sprites/${charNum}.png`;

  // Load and draw the character spritesheet front-facing idle frame (row 7, col 0)
  const img = new Image();
  img.onload = () => {
    ctx.imageSmoothingEnabled = false;
    // Extract frame from row 7, col 0 - front-facing idle (64x64 grid)
    const frameX = 0, frameY = 7 * 64;
    ctx.drawImage(img, frameX, frameY, 64, 64, 0, 0, canvas.width, canvas.height);
  };
  img.onerror = () => {
    ctx.fillStyle = '#ff4444';
    ctx.font = '14px Courier New';
    ctx.fillText('Sprite not found', 10, 70);
  };
  img.src = spriteUrl;

  // Update name label
  document.getElementById('preview-name').textContent = gameState.user?.username || 'Character';
  document.getElementById('preview-class').textContent = `Character #${charNum}`;
}

function selectTraitInUI(traitKey, value) {
  document.querySelectorAll(`.trait-btn[data-trait="${traitKey}"]`).forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === value);
  });
}

// ============================================================
// DECORATION CATALOG (bigger, richer sprites)
// ============================================================
const DECORATIONS = {
  trees: [
    { type: 'tree_oak', name: 'Oak Tree', color: '#2d5a27', w: 64, h: 80 },
    { type: 'tree_pine', name: 'Pine Tree', color: '#1a4a1a', w: 48, h: 88 },
    { type: 'tree_cherry', name: 'Cherry Blossom', color: '#d4608a', w: 64, h: 80 },
    { type: 'tree_autumn', name: 'Autumn Tree', color: '#c45a2a', w: 64, h: 80 },
    { type: 'tree_willow', name: 'Willow Tree', color: '#3a7a3a', w: 72, h: 88 },
    { type: 'nftree', name: 'NFTree ✦', color: '#53d769', w: 64, h: 88 },
  ],
  buildings: [
    { type: 'house_wood', name: 'Wood House', color: '#8B6914', w: 80, h: 88 },
    { type: 'house_stone', name: 'Stone House', color: '#888', w: 80, h: 88 },
    { type: 'shop', name: 'Market Stall', color: '#b35900', w: 72, h: 64 },
    { type: 'guild_hall', name: 'Guild Hall', color: '#6a4c93', w: 96, h: 96 },
  ],
  furniture: [
    { type: 'bench', name: 'Bench', color: '#8B6914', w: 48, h: 28 },
    { type: 'table_chairs', name: 'Table & Chairs', color: '#654321', w: 48, h: 48 },
    { type: 'barrel', name: 'Barrel', color: '#8B4513', w: 28, h: 34 },
    { type: 'fountain', name: 'Fountain', color: '#4a90d9', w: 64, h: 64 },
    { type: 'lamp', name: 'Lamp Post', color: '#d4a843', w: 20, h: 56 },
    { type: 'flower_bed', name: 'Flower Bed', color: '#d44c8a', w: 48, h: 32 },
    { type: 'campfire', name: 'Campfire', color: '#e07830', w: 32, h: 32 },
    { type: 'flag_banner', name: 'Banner', color: '#cc3333', w: 20, h: 56 },
  ],
  paths: [
    { type: 'path_stone', name: 'Stone Path', color: '#999', w: 32, h: 32 },
    { type: 'path_wood', name: 'Wood Path', color: '#8B6914', w: 32, h: 32 },
    { type: 'bridge', name: 'Bridge', color: '#8B5A2B', w: 56, h: 32 },
    { type: 'fence_h', name: 'Fence', color: '#8B6914', w: 48, h: 24 },
  ],
  water: [
    { type: 'pond', name: 'Small Pond', color: '#4a90d9', w: 56, h: 48 },
    { type: 'well', name: 'Well', color: '#777', w: 36, h: 44 },
  ],
};

// ============================================================
// COLOR HELPERS
// ============================================================
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return {r,g,b};
}
function rgbToHex(r,g,b) {
  return '#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
}
function shade(hex, amt) {
  const c = hexToRgb(hex);
  return rgbToHex(c.r+amt, c.g+amt, c.b+amt);
}
function tint(hex, amt) {
  const c = hexToRgb(hex);
  return rgbToHex(c.r+(255-c.r)*amt, c.g+(255-c.g)*amt, c.b+(255-c.b)*amt);
}

// ============================================================
// SEEDED RANDOM for consistent tile patterns
// ============================================================
function seededRandom(seed) {
  let s = seed;
  return function() { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// ============================================================
// RICH PIXEL ART GENERATORS
// ============================================================
function generatePixelArt(type, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const P = (x,y,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,1,1); };

  switch(type) {
    case 'tree_oak': drawRichOak(ctx,w,h); break;
    case 'tree_pine': drawRichPine(ctx,w,h); break;
    case 'tree_cherry': drawRichCherry(ctx,w,h); break;
    case 'tree_autumn': drawRichAutumn(ctx,w,h); break;
    case 'tree_willow': drawRichWillow(ctx,w,h); break;
    case 'nftree': drawRichNFTree(ctx,w,h); break;
    case 'house_wood': drawRichHouseWood(ctx,w,h); break;
    case 'house_stone': drawRichHouseStone(ctx,w,h); break;
    case 'shop': drawRichShop(ctx,w,h); break;
    case 'guild_hall': drawRichGuildHall(ctx,w,h); break;
    case 'bench': drawRichBench(ctx,w,h); break;
    case 'table_chairs': drawRichTableChairs(ctx,w,h); break;
    case 'barrel': drawRichBarrel(ctx,w,h); break;
    case 'fountain': drawRichFountain(ctx,w,h); break;
    case 'lamp': drawRichLamp(ctx,w,h); break;
    case 'flower_bed': drawRichFlowerBed(ctx,w,h); break;
    case 'campfire': drawRichCampfire(ctx,w,h); break;
    case 'flag_banner': drawRichBanner(ctx,w,h); break;
    case 'path_stone': drawRichPathStone(ctx,w,h); break;
    case 'path_wood': drawRichPathWood(ctx,w,h); break;
    case 'bridge': drawRichBridge(ctx,w,h); break;
    case 'fence_h': drawRichFence(ctx,w,h); break;
    case 'pond': drawRichPond(ctx,w,h); break;
    case 'well': drawRichWell(ctx,w,h); break;
    default: R(0,0,w,h,'#f0f');
  }
  return canvas;
}

// ---- TREE CANOPY helper: multi-blob organic canopy with highlights ----
function drawCanopy(ctx, cx, cy, radius, baseColor, lightColor, darkColor, shadowColor) {
  const rng = seededRandom(cx*100+cy);
  // Shadow underneath
  ctx.globalAlpha = 0.25;
  fillOval(ctx, cx+2, cy+radius*0.7, radius*0.9, radius*0.4, '#000');
  ctx.globalAlpha = 1;
  // Main blobs
  const blobs = [
    {x:0, y:0, rx:radius, ry:radius*0.85},
    {x:-radius*0.5, y:-radius*0.2, rx:radius*0.7, ry:radius*0.6},
    {x:radius*0.45, y:-radius*0.15, rx:radius*0.65, ry:radius*0.6},
    {x:-radius*0.2, y:-radius*0.5, rx:radius*0.55, ry:radius*0.5},
    {x:radius*0.25, y:-radius*0.45, rx:radius*0.5, ry:radius*0.45},
    {x:0, y:radius*0.35, rx:radius*0.7, ry:radius*0.45},
  ];
  // Dark base layer
  for (const b of blobs) {
    fillOval(ctx, cx+b.x, cy+b.y, b.rx+1, b.ry+1, darkColor);
  }
  // Main color
  for (const b of blobs) {
    fillOval(ctx, cx+b.x, cy+b.y, b.rx, b.ry, baseColor);
  }
  // Light dappled spots
  for (let i = 0; i < 18; i++) {
    const angle = rng()*Math.PI*2;
    const dist = rng()*radius*0.7;
    const sx = cx + Math.cos(angle)*dist*0.9;
    const sy = cy + Math.sin(angle)*dist*0.7 - 2;
    const sr = 2 + rng()*4;
    fillOval(ctx, sx, sy, sr, sr*0.8, lightColor);
  }
  // Bright highlights (top-left light source)
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI*0.75 + rng()*Math.PI*0.6;
    const dist = radius*0.2 + rng()*radius*0.5;
    const sx = cx + Math.cos(angle)*dist;
    const sy = cy + Math.sin(angle)*dist;
    const sr = 1 + rng()*3;
    ctx.globalAlpha = 0.5 + rng()*0.3;
    fillOval(ctx, sx, sy, sr, sr*0.8, tint(lightColor, 0.4));
    ctx.globalAlpha = 1;
  }
  // Shadow patches (bottom-right)
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI*0.25 + rng()*Math.PI*0.6;
    const dist = radius*0.3 + rng()*radius*0.4;
    const sx = cx + Math.cos(angle)*dist;
    const sy = cy + Math.sin(angle)*dist;
    const sr = 2 + rng()*3;
    ctx.globalAlpha = 0.3;
    fillOval(ctx, sx, sy, sr, sr*0.7, shadowColor);
    ctx.globalAlpha = 1;
  }
}

function fillOval(ctx, cx, cy, rx, ry, color) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(1,rx), Math.max(1,ry), 0, 0, Math.PI*2);
  ctx.fill();
}

function drawTrunk(ctx, cx, bottomY, trunkW, trunkH, baseColor) {
  const dark = shade(baseColor, -25);
  const light = shade(baseColor, 20);
  const highlight = shade(baseColor, 45);
  const R = (x,y,w,h,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); };
  // Main trunk
  R(cx-trunkW/2, bottomY-trunkH, trunkW, trunkH, baseColor);
  // Dark side (right)
  R(cx+trunkW/2-2, bottomY-trunkH, 2, trunkH, dark);
  // Light side (left)
  R(cx-trunkW/2, bottomY-trunkH, 2, trunkH, light);
  // Center highlight
  R(cx-1, bottomY-trunkH+2, 2, trunkH-4, highlight);
  // Knots
  ctx.fillStyle = dark;
  ctx.fillRect(cx-2, bottomY-trunkH*0.4, 3, 2);
  ctx.fillRect(cx+1, bottomY-trunkH*0.7, 2, 2);
  // Base roots
  R(cx-trunkW/2-2, bottomY-3, trunkW+4, 3, dark);
  R(cx-trunkW/2-3, bottomY-2, 3, 2, shade(baseColor, -15));
  R(cx+trunkW/2+1, bottomY-2, 3, 2, shade(baseColor, -15));
}

// ---- INDIVIDUAL TREE TYPES ----
function drawRichOak(ctx, w, h) {
  const cx = w/2, bottomY = h-4;
  drawTrunk(ctx, cx, bottomY, 10, 32, '#5a3a1a');
  drawCanopy(ctx, cx, h*0.35, 26, '#3a7a30', '#5aaa48', '#2a5a20', '#1a3a10');
}

function drawRichPine(ctx, w, h) {
  const cx = w/2, bottomY = h-4;
  drawTrunk(ctx, cx, bottomY, 8, 36, '#4a2a10');
  // Layered triangles
  const layers = [{y:12,w:10,h:22},{y:24,w:18,h:24},{y:38,w:24,h:26},{y:50,w:14,h:18}];
  for (let li = layers.length-1; li >= 0; li--) {
    const l = layers[li];
    const baseY = h - l.y - l.h;
    for (let row = 0; row < l.h; row++) {
      const progress = row / l.h;
      const rw = l.w * (1 - progress*0.85);
      const colors = ['#1a4a1a','#225a22','#2a6a28','#1e5020'];
      ctx.fillStyle = colors[(row+li)%colors.length];
      ctx.fillRect(cx-rw, baseY+row, rw*2, 1);
    }
    // Snow/light tips
    ctx.fillStyle = '#4aaa4a';
    ctx.fillRect(cx-1, baseY, 2, 2);
  }
}

function drawRichCherry(ctx, w, h) {
  const cx = w/2, bottomY = h-4;
  drawTrunk(ctx, cx, bottomY, 9, 30, '#5a3520');
  drawCanopy(ctx, cx, h*0.36, 26, '#d4608a', '#e888aa', '#aa4068', '#882848');
  // Petals falling
  const rng = seededRandom(42);
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 8; i++) {
    const px = cx - 20 + rng()*40;
    const py = h*0.5 + rng()*30;
    ctx.fillStyle = i%2===0 ? '#f0a0c0' : '#e888aa';
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.globalAlpha = 1;
}

function drawRichAutumn(ctx, w, h) {
  const cx = w/2, bottomY = h-4;
  drawTrunk(ctx, cx, bottomY, 10, 30, '#5a3a1a');
  drawCanopy(ctx, cx, h*0.35, 26, '#c45a2a', '#e8883a', '#a04018', '#702808');
  // Some yellow-orange mixed leaves
  const rng = seededRandom(77);
  for (let i = 0; i < 12; i++) {
    const angle = rng()*Math.PI*2;
    const dist = rng()*20;
    ctx.fillStyle = ['#e8a030','#d4702a','#eac040','#c85020'][i%4];
    ctx.fillRect(cx+Math.cos(angle)*dist, h*0.35+Math.sin(angle)*dist*0.7, 3, 2);
  }
}

function drawRichWillow(ctx, w, h) {
  const cx = w/2, bottomY = h-4;
  drawTrunk(ctx, cx, bottomY, 12, 38, '#5a4020');
  // Canopy dome
  drawCanopy(ctx, cx, h*0.3, 24, '#3a8a3a', '#5aaa50', '#2a6a28', '#1a4a18');
  // Drooping vine branches
  const rng = seededRandom(99);
  for (let i = 0; i < 14; i++) {
    const bx = cx - 28 + i*4 + rng()*4;
    const startY = h*0.3 + 8 + rng()*8;
    const length = 20 + rng()*25;
    for (let j = 0; j < length; j++) {
      const sway = Math.sin((j+i)*0.25)*3;
      ctx.fillStyle = j%3===0 ? '#3a8a3a' : (j%3===1?'#50aa48':'#2a6a28');
      ctx.fillRect(bx+sway, startY+j*1.5, 2, 2);
    }
  }
}

function drawRichNFTree(ctx, w, h) {
  const cx = w/2, bottomY = h-4;
  // Glowing magical trunk
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  drawTrunk(ctx, cx, bottomY, 10, 34, '#3a3028');
  // Magical glow on trunk
  ctx.globalAlpha = 0.4;
  R(cx-3, bottomY-30, 6, 28, '#53d769');
  ctx.globalAlpha = 1;
  // Enchanted canopy
  drawCanopy(ctx, cx, h*0.32, 26, '#2a8a40', '#53d769', '#1a6a2a', '#0a4a18');
  // Sparkle particles
  const rng = seededRandom(123);
  for (let i = 0; i < 20; i++) {
    const angle = rng()*Math.PI*2;
    const dist = 8+rng()*24;
    const px = cx+Math.cos(angle)*dist;
    const py = h*0.32+Math.sin(angle)*dist*0.75;
    ctx.globalAlpha = 0.4+rng()*0.6;
    ctx.fillStyle = i%3===0?'#aaffbb':i%3===1?'#53d769':'#7dff97';
    ctx.fillRect(px, py, i%4===0?3:2, i%4===0?3:2);
  }
  ctx.globalAlpha = 1;
  // Golden NFT emblem
  fillOval(ctx, cx, h*0.32, 8, 8, '#ffd700');
  fillOval(ctx, cx, h*0.32, 6, 6, '#ffea70');
  ctx.fillStyle = '#8a6a00';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, h*0.32+3);
  // Ground glow
  ctx.globalAlpha = 0.2;
  fillOval(ctx, cx, bottomY, 18, 5, '#53d769');
  ctx.globalAlpha = 1;
}

// ---- BUILDINGS ----
function drawRichHouseWood(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  // Shadow
  ctx.globalAlpha=0.2; fillOval(ctx,cx,h-4,36,6,'#000'); ctx.globalAlpha=1;
  // Foundation
  R(8, h*0.52, w-16, 4, '#6a5a4a');
  // Walls - plank texture
  for (let y = 0; y < Math.floor(h*0.44); y++) {
    const wy = Math.floor(h*0.52)+4+y;
    if (wy >= h-4) break;
    const shade_v = y%8<4 ? 0 : -8;
    ctx.fillStyle = rgbToHex(160+shade_v, 128+shade_v, 72+shade_v);
    ctx.fillRect(10, wy, w-20, 1);
  }
  // Wall highlight left
  R(10, Math.floor(h*0.52)+4, 2, Math.floor(h*0.44)-4, '#c8a868');
  // Beams
  R(10, Math.floor(h*0.52)+4, w-20, 2, '#5a3a18');
  R(10, h-6, w-20, 2, '#5a3a18');
  R(10, Math.floor(h*0.72), w-20, 2, '#5a3a18');
  // Roof - layered shingles
  for (let row = 0; row < Math.floor(h*0.48); row++) {
    const progress = row / (h*0.48);
    const roofW = (w/2-4) * (1-progress*0.9);
    if (roofW < 3) break;
    const colors = ['#b05a20','#a04a18','#c06a28','#984018'];
    ctx.fillStyle = colors[Math.floor(row/3)%colors.length];
    ctx.fillRect(cx-roofW, 4+row, roofW*2, 1);
  }
  // Roof edge highlight
  const roofBaseY = 4+Math.floor(h*0.48)-1;
  R(6, roofBaseY, w-12, 3, '#5a2a08');
  R(6, roofBaseY, w-12, 1, '#c87040');
  // Door
  R(cx-6, h-26, 12, 22, '#4a2a10');
  R(cx-5, h-25, 10, 20, '#3a1a08');
  R(cx-4, h-24, 8, 18, '#5a3018');
  R(cx+2, h-16, 2, 2, '#d4a843'); // knob
  // Windows
  drawWindow(ctx, 16, Math.floor(h*0.58), 14, 14);
  drawWindow(ctx, w-30, Math.floor(h*0.58), 14, 14);
  // Chimney
  R(w-22, 8, 8, 20, '#8a6a5a');
  R(w-23, 6, 10, 3, '#7a5a4a');
}

function drawWindow(ctx, x, y, w, h) {
  const R = (rx,ry,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(rx,ry,rw,rh); };
  R(x, y, w, h, '#3a2a18'); // frame
  R(x+1, y+1, w-2, h-2, '#5888b8'); // glass
  R(x+1, y+1, (w-2)/2, (h-2)/2, '#70a8d8'); // highlight
  R(x+w/2-0.5, y+1, 1, h-2, '#3a2a18'); // mullion v
  R(x+1, y+h/2-0.5, w-2, 1, '#3a2a18'); // mullion h
}

function drawRichHouseStone(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  ctx.globalAlpha=0.2; fillOval(ctx,cx,h-4,36,6,'#000'); ctx.globalAlpha=1;
  // Stone walls
  for (let by = 0; by < 6; by++) {
    for (let bx = 0; bx < 5; bx++) {
      const ox = 10 + bx*13 + (by%2)*6;
      const oy = Math.floor(h*0.5)+4 + by*7;
      if (ox+12 > w-10 || oy+6 > h-4) continue;
      const v = ((bx+by)%3)*8;
      R(ox, oy, 12, 6, rgbToHex(140+v,135+v,125+v));
      R(ox, oy, 12, 1, rgbToHex(155+v,150+v,140+v));
      R(ox, oy+5, 12, 1, rgbToHex(120+v,115+v,105+v));
    }
  }
  // Slate roof
  for (let row = 0; row < Math.floor(h*0.46); row++) {
    const progress = row/(h*0.46);
    const roofW = (w/2-4)*(1-progress*0.9);
    if (roofW < 3) break;
    ctx.fillStyle = row%4<2?'#5a6a7a':'#4a5a6a';
    ctx.fillRect(cx-roofW, 4+row, roofW*2, 1);
  }
  R(6, 4+Math.floor(h*0.46)-1, w-12, 3, '#3a4a5a');
  // Door
  R(cx-7, h-28, 14, 24, '#4a3a2a');
  R(cx-6, h-27, 12, 22, '#3a2818');
  // Arch
  for (let a = 0; a < Math.PI; a += 0.15) {
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(cx+Math.cos(a)*6, h-28-Math.sin(a)*6, 2, 2);
  }
  R(cx+2, h-16, 2, 2, '#aaa');
  drawWindow(ctx, 16, Math.floor(h*0.56), 14, 14);
  drawWindow(ctx, w-30, Math.floor(h*0.56), 14, 14);
}

function drawRichShop(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  ctx.globalAlpha=0.2; fillOval(ctx,w/2,h-3,32,5,'#000'); ctx.globalAlpha=1;
  // Counter
  R(4, h*0.5, w-8, h*0.5-4, '#8a6a20');
  R(6, h*0.5+2, w-12, h*0.5-8, '#a88030');
  R(4, h*0.5, w-8, 2, '#b89040'); // top highlight
  // Awning with stripes + scallop
  for (let i = 0; i < w-4; i += 8) {
    R(2+i, 6, 8, Math.floor(h*0.5)-6, i%16<8?'#cc3333':'#eee8d8');
  }
  // Scalloped bottom edge
  for (let i = 0; i < w-4; i += 12) {
    fillOval(ctx, 8+i, h*0.5-2, 6, 4, i%24<12?'#cc3333':'#eee8d8');
  }
  // Posts
  R(4, 6, 3, h-10, '#5a3a18');
  R(w-7, 6, 3, h-10, '#5a3a18');
  // Goods on counter
  fillOval(ctx, 18, h*0.5+8, 5, 4, '#e8a030'); // bread
  R(32, h*0.5+6, 6, 8, '#8B4513'); // box
  fillOval(ctx, 48, h*0.5+8, 4, 4, '#53d769'); // apple
  R(56, h*0.5+4, 4, 10, '#888'); // bottle
  R(56, h*0.5+2, 6, 3, '#aaa');
}

function drawRichGuildHall(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  ctx.globalAlpha=0.2; fillOval(ctx,cx,h-4,44,7,'#000'); ctx.globalAlpha=1;
  // Stone base
  for (let by = 0; by < 7; by++) {
    for (let bx = 0; bx < 7; bx++) {
      const ox = 10+bx*12+(by%2)*5;
      const oy = Math.floor(h*0.42)+4+by*7;
      if (ox+11>w-10||oy+6>h-6) continue;
      const v = ((bx+by)%3)*6;
      R(ox,oy,11,6,rgbToHex(130+v,125+v,120+v));
    }
  }
  // Grand roof
  for (let row = 0; row < Math.floor(h*0.38); row++) {
    const progress = row/(h*0.38);
    const roofW = (w/2-6)*(1-progress*0.85);
    if (roofW<3) break;
    ctx.fillStyle = row%4<2?'#6a4c93':'#5a3c83';
    ctx.fillRect(cx-roofW, 6+row, roofW*2, 1);
  }
  R(8, 6+Math.floor(h*0.38)-1, w-16, 4, '#4a2c63');
  R(8, 6+Math.floor(h*0.38)-1, w-16, 1, '#8a6cb3');
  // Pillars
  for (const px of [14, w-20]) {
    R(px, Math.floor(h*0.42), 6, h*0.54, '#b0a898');
    R(px, Math.floor(h*0.42), 6, 3, '#c8c0b0');
    R(px+1, Math.floor(h*0.42)+3, 4, h*0.54-6, '#a09888');
    R(px, h-8, 6, 4, '#c8c0b0');
  }
  // Grand door
  R(cx-10, h-32, 20, 28, '#3a1a08');
  R(cx-8, h-30, 16, 26, '#4a2818');
  for (let a = 0; a < Math.PI; a += 0.12) {
    ctx.fillStyle = '#8a6a4a';
    ctx.fillRect(cx+Math.cos(a)*9, h-32-Math.sin(a)*8, 2, 2);
  }
  // Banner
  R(cx-8, Math.floor(h*0.42)+6, 16, 22, '#6a4c93');
  R(cx-7, Math.floor(h*0.42)+7, 14, 20, '#7a5ca3');
  // Emblem
  ctx.fillStyle = '#ffd700';
  fillOval(ctx, cx, Math.floor(h*0.42)+16, 4, 4, '#ffd700');
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(cx-1, Math.floor(h*0.42)+10, 2, 4);
  drawWindow(ctx, 26, Math.floor(h*0.5), 12, 14);
  drawWindow(ctx, w-38, Math.floor(h*0.5), 12, 14);
}

// ---- FURNITURE ----
function drawRichBench(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  // Legs
  R(4,h-10,4,10,'#5a3a18'); R(w-8,h-10,4,10,'#5a3a18');
  R(4,h-10,4,2,'#7a5a30'); R(w-8,h-10,4,2,'#7a5a30');
  // Seat planks
  for (let i = 0; i < 3; i++) {
    R(2, 6+i*5, w-4, 4, i%2===0?'#a07828':'#8a6820');
    R(2, 6+i*5, w-4, 1, '#b89040');
  }
  // Backrest
  R(2, 2, w-4, 5, '#8a6820');
  R(2, 2, w-4, 1, '#b89040');
  R(3, 3, w-6, 3, '#9a7828');
}

function drawRichTableChairs(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  // Table top
  R(8, 14, 32, 12, '#6a4a28');
  R(8, 14, 32, 2, '#8a6a40');
  R(10, 16, 28, 8, '#7a5a30');
  // Table legs
  R(12, 26, 3, 10, '#5a3a18'); R(33, 26, 3, 10, '#5a3a18');
  // Chair left
  R(2, 10, 8, 4, '#5a3a18');
  R(2, 14, 3, 16, '#5a3a18'); R(7, 14, 3, 16, '#5a3a18');
  R(2, 10, 8, 1, '#7a5a30');
  // Chair right
  R(38, 10, 8, 4, '#5a3a18');
  R(38, 14, 3, 16, '#5a3a18'); R(43, 14, 3, 16, '#5a3a18');
  R(38, 10, 8, 1, '#7a5a30');
  // Mug on table
  R(22, 12, 4, 5, '#8a8a8a'); R(22, 12, 4, 1, '#aaa');
}

function drawRichBarrel(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2, cy = h/2;
  // Barrel body
  for (let y = 4; y < h-4; y++) {
    const progress = (y-4)/(h-8);
    const bulge = Math.sin(progress*Math.PI)*3;
    const bw = w/2-4+bulge;
    const v = ((y-4)%6<3)?0:-10;
    ctx.fillStyle = rgbToHex(140+v, 90+v, 40+v);
    ctx.fillRect(cx-bw, y, bw*2, 1);
  }
  // Metal bands
  for (const by of [8, h/2, h-10]) {
    R(cx-w/2+4, by, w-8, 2, '#7a7a7a');
    R(cx-w/2+4, by, w-8, 1, '#9a9a9a');
  }
  // Top ellipse
  fillOval(ctx, cx, 6, w/2-5, 4, '#8a5a28');
  fillOval(ctx, cx, 6, w/2-7, 3, '#6a4018');
  // Highlight
  R(cx-2, 8, 2, h-16, '#aa7a3a');
}

function drawRichFountain(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2, cy = h/2;
  // Base pool
  fillOval(ctx, cx, cy+10, 28, 16, '#5a7a9a');
  fillOval(ctx, cx, cy+10, 24, 13, '#5a98c8');
  fillOval(ctx, cx, cy+8, 18, 10, '#7ab8e8');
  // Stone rim
  for (let a = 0; a < Math.PI*2; a += 0.2) {
    ctx.fillStyle = a%0.4<0.2?'#9a8a7a':'#8a7a6a';
    ctx.fillRect(cx+Math.cos(a)*26, cy+10+Math.sin(a)*14, 3, 3);
  }
  // Center pillar
  R(cx-4, cy-12, 8, 26, '#a09888');
  R(cx-3, cy-12, 6, 24, '#b0a898');
  R(cx-6, cy-14, 12, 4, '#b8b0a0');
  R(cx-5, cy+10, 10, 3, '#a09888');
  // Water spray
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 8; i++) {
    const angle = (i/8)*Math.PI*2;
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = j%2===0?'#a0d0f0':'#80c0e8';
      const px = cx+Math.cos(angle)*(4+j*2);
      const py = cy-14-6+j*2+Math.sin(angle)*2;
      ctx.fillRect(px, py, 2, 2);
    }
  }
  // Top droplets
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#c0e8ff';
    ctx.fillRect(cx-4+i*2, cy-20+i, 1, 2);
  }
  ctx.globalAlpha = 1;
}

function drawRichLamp(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  // Pole
  R(cx-2, 16, 4, h-18, '#5a5a5a');
  R(cx-1, 18, 2, h-22, '#7a7a7a');
  // Base
  R(cx-4, h-4, 8, 4, '#4a4a4a');
  R(cx-5, h-2, 10, 2, '#3a3a3a');
  // Lamp housing
  R(cx-6, 4, 12, 14, '#4a4a4a');
  R(cx-5, 5, 10, 12, '#d4a843');
  R(cx-4, 6, 8, 10, '#ffe680');
  R(cx-7, 3, 14, 2, '#5a5a5a');
  R(cx-7, 17, 14, 2, '#5a5a5a');
  // Glow effect
  ctx.globalAlpha = 0.15;
  fillOval(ctx, cx, 11, 14, 14, '#ffe680');
  ctx.globalAlpha = 0.08;
  fillOval(ctx, cx, 11, 20, 20, '#ffe680');
  ctx.globalAlpha = 1;
}

function drawRichFlowerBed(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  // Soil bed
  fillOval(ctx, w/2, h-6, 22, 8, '#4a3018');
  fillOval(ctx, w/2, h-7, 20, 7, '#5a4020');
  // Stems and flowers
  const flowers = [
    {x:6,c:'#e05080',c2:'#f080a0'},{x:14,c:'#e0a030',c2:'#f0c050'},
    {x:22,c:'#e05080',c2:'#f080a0'},{x:30,c:'#80a0e0',c2:'#a0c0f0'},
    {x:38,c:'#e0a030',c2:'#f0c050'}
  ];
  for (const f of flowers) {
    R(f.x+1, h-20, 2, 12, '#3a7a2a');
    // Leaves
    R(f.x-1, h-14, 3, 2, '#4a8a3a');
    R(f.x+2, h-16, 3, 2, '#4a8a3a');
    // Petals
    fillOval(ctx, f.x+2, h-22, 4, 4, f.c);
    fillOval(ctx, f.x+2, h-23, 3, 3, f.c2);
    ctx.fillStyle = '#f0e080';
    ctx.fillRect(f.x+1, h-23, 2, 2);
  }
}

function drawRichCampfire(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  // Stone ring
  for (let a = 0; a < Math.PI*2; a += 0.4) {
    ctx.fillStyle = a%0.8<0.4?'#7a7a7a':'#6a6a6a';
    ctx.fillRect(cx+Math.cos(a)*10, h/2+6+Math.sin(a)*6, 4, 4);
  }
  // Logs
  R(cx-8, h/2+4, 16, 4, '#5a3a18');
  R(cx-6, h/2+2, 4, 6, '#4a2a10');
  R(cx+2, h/2+2, 4, 6, '#4a2a10');
  // Fire
  const fireColors = ['#ff4400','#ff6600','#ff8800','#ffaa00','#ffcc00','#ffee88'];
  for (let i = 0; i < 14; i++) {
    const fx = cx-5+Math.sin(i*1.1)*5;
    const fy = h/2-2-i*1.5;
    const fw = 3+Math.sin(i*0.7)*2;
    ctx.fillStyle = fireColors[Math.min(i, fireColors.length-1)];
    ctx.globalAlpha = 1-i*0.05;
    ctx.fillRect(fx, fy, fw, 3);
  }
  ctx.globalAlpha = 1;
  // Glow
  ctx.globalAlpha = 0.12;
  fillOval(ctx, cx, h/2-4, 18, 16, '#ff8800');
  ctx.globalAlpha = 1;
}

function drawRichBanner(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  // Pole
  R(cx-2, 0, 4, h, '#6a5a4a');
  R(cx-1, 0, 2, h, '#8a7a6a');
  // Finial
  fillOval(ctx, cx, 3, 4, 4, '#d4a843');
  // Banner fabric
  R(cx-8, 8, 16, 30, '#cc3333');
  R(cx-7, 9, 14, 28, '#dd4444');
  // Trim
  R(cx-8, 8, 16, 2, '#aa2222');
  // Triangle bottom
  for (let row = 0; row < 10; row++) {
    const bw = 8-row*0.8;
    if (bw < 1) break;
    ctx.fillStyle = row%2===0?'#cc3333':'#dd4444';
    ctx.fillRect(cx-bw, 38+row, bw*2, 1);
  }
  // Emblem
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(cx-3, 18, 6, 6);
  ctx.fillStyle = '#ffea80';
  ctx.fillRect(cx-2, 19, 4, 4);
}

// ---- PATHS/STRUCTURES ----
function drawRichPathStone(ctx, w, h) {
  ctx.fillStyle = '#a09080';
  ctx.fillRect(0, 0, w, h);
  const rng = seededRandom(42);
  for (let i = 0; i < 8; i++) {
    const sx = rng()*24, sy = rng()*24, sw = 4+rng()*8, sh = 4+rng()*6;
    const v = rng()*20-10;
    ctx.fillStyle = rgbToHex(150+v, 140+v, 125+v);
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = rgbToHex(165+v, 155+v, 140+v);
    ctx.fillRect(sx, sy, sw, 1);
  }
}

function drawRichPathWood(ctx, w, h) {
  for (let i = 0; i < 4; i++) {
    const v = i%2===0?0:-10;
    ctx.fillStyle = rgbToHex(140+v, 108+v, 52+v);
    ctx.fillRect(0, i*8, w, 7);
    ctx.fillStyle = rgbToHex(155+v, 123+v, 67+v);
    ctx.fillRect(0, i*8, w, 1);
    ctx.fillStyle = rgbToHex(120+v, 88+v, 32+v);
    ctx.fillRect(0, i*8+6, w, 1);
  }
}

function drawRichBridge(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  // Planks
  for (let i = 0; i < w; i += 7) {
    const v = (i/7)%2===0?0:-12;
    R(i, 6, 6, h-12, rgbToHex(140+v, 100+v, 50+v));
    R(i, 6, 6, 1, rgbToHex(160+v, 120+v, 70+v));
  }
  // Rails
  R(0, 0, w, 6, '#5a3a18');
  R(0, h-6, w, 6, '#5a3a18');
  R(0, 1, w, 1, '#7a5a30');
  R(0, h-5, w, 1, '#7a5a30');
  // Posts
  for (let x = 0; x < w; x += 18) {
    R(x+1, 0, 4, 8, '#4a2a10');
    R(x+1, h-8, 4, 8, '#4a2a10');
  }
}

function drawRichFence(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  // Horizontal rail
  R(0, 8, w, 4, '#8a6a28');
  R(0, 8, w, 1, '#aa8a48');
  R(0, 18, w, 3, '#8a6a28');
  R(0, 18, w, 1, '#aa8a48');
  // Posts
  for (let x = 0; x < w; x += 12) {
    R(x+1, 2, 5, h-2, '#7a5a20');
    R(x+2, 3, 3, h-4, '#9a7a38');
    // Pointed top
    R(x+2, 1, 3, 2, '#7a5a20');
    R(x+3, 0, 1, 2, '#9a7a38');
  }
}

function drawRichPond(ctx, w, h) {
  const cx = w/2, cy = h/2;
  // Shore
  fillOval(ctx, cx, cy+2, 26, 20, '#6a8a50');
  fillOval(ctx, cx, cy+2, 24, 18, '#5a7a40');
  // Water
  fillOval(ctx, cx, cy, 22, 16, '#3a6a9a');
  fillOval(ctx, cx, cy, 20, 14, '#4a88b8');
  fillOval(ctx, cx-3, cy-2, 14, 10, '#6aa8d8');
  fillOval(ctx, cx-5, cy-3, 8, 6, '#88c0e8');
  // Lily pads
  fillOval(ctx, cx+8, cy+4, 4, 3, '#3a8a3a');
  fillOval(ctx, cx-10, cy+6, 3, 2, '#4a9a4a');
  // Tiny flower on pad
  ctx.fillStyle = '#f0a0c0';
  ctx.fillRect(cx+7, cy+2, 2, 2);
  // Reeds
  ctx.fillStyle = '#4a7a30';
  ctx.fillRect(cx+18, cy-8, 2, 12);
  ctx.fillRect(cx+21, cy-6, 2, 10);
  ctx.fillRect(cx-20, cy-4, 2, 8);
}

function drawRichWell(ctx, w, h) {
  const R = (x,y,rw,rh,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,rw,rh); };
  const cx = w/2;
  ctx.globalAlpha=0.2; fillOval(ctx,cx,h-4,16,5,'#000'); ctx.globalAlpha=1;
  // Stone base (circular)
  fillOval(ctx, cx, h-12, 16, 10, '#8a7a6a');
  fillOval(ctx, cx, h-13, 14, 8, '#9a8a7a');
  // Water inside
  fillOval(ctx, cx, h-14, 10, 6, '#4a88b8');
  fillOval(ctx, cx, h-15, 7, 4, '#6aa8d8');
  // Support posts
  R(cx-14, 8, 4, h-20, '#5a3a18');
  R(cx+10, 8, 4, h-20, '#5a3a18');
  R(cx-13, 10, 2, h-24, '#7a5a30');
  R(cx+11, 10, 2, h-24, '#7a5a30');
  // Roof
  for (let row = 0; row < 10; row++) {
    const rw = 16-row*1.2;
    if (rw<2) break;
    ctx.fillStyle = row%3<2?'#8B4513':'#7a3a0a';
    ctx.fillRect(cx-rw, 2+row, rw*2, 1);
  }
  R(cx-17, 12, 34, 2, '#6a4020');
  // Bucket
  R(cx-2, h-22, 4, 6, '#6a5a4a');
  // Rope
  ctx.fillStyle = '#a09060';
  ctx.fillRect(cx, 14, 1, h-36);
}

// ============================================================
// BOOT SCENE
// ============================================================
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    // Generate all decoration textures (still needed for PlotScene)
    for (const [cat, items] of Object.entries(DECORATIONS)) {
      for (const item of items) {
        const canvas = generatePixelArt(item.type, item.w, item.h);
        this.textures.addCanvas(item.type, canvas);
      }
    }
    this.generateMapTiles();

    // Load marketplace background
    this.load.image('marketplace_bg', '/assets/BACKGROUND.jpg');
  }

  // Load a character spritesheet by number and create animations with a unique key prefix
  // Returns a promise-like flow; call from create() or dynamically
  static loadCharacterSprite(scene, charNumber, keyPrefix) {
    const url = `/sprites/${charNumber}.png`;
    const texKey = keyPrefix || ('char_' + charNumber);

    // If already loaded, just ensure anims exist
    if (scene.textures.exists(texKey)) {
      BootScene.createCharAnims(scene, texKey);
      return texKey;
    }

    // Load dynamically using Phaser loader
    scene.load.spritesheet(texKey, url, { frameWidth: 64, frameHeight: 64 });
    scene.load.once('complete', () => {
      BootScene.createCharAnims(scene, texKey);
      // If this is the local player, start playing idle
      if (scene.player && scene.player._pendingTexKey === texKey) {
        scene.player.setTexture(texKey);
        scene.player.play(texKey + '_idle_down');
        scene.player._pendingTexKey = null;
      }
    });
    scene.load.start();
    return texKey;
  }

  static createCharAnims(scene, texKey) {
    // Spritesheet layout: 10 cols x 8 rows (64x64 per frame)
    if (scene.anims.exists(texKey + '_walk_right')) return; // already created

    scene.anims.create({ key: texKey + '_walk_right', frames: scene.anims.generateFrameNumbers(texKey, { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: texKey + '_walk_up', frames: scene.anims.generateFrameNumbers(texKey, { start: 10, end: 17 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: texKey + '_walk_left', frames: scene.anims.generateFrameNumbers(texKey, { start: 20, end: 27 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: texKey + '_walk_down', frames: scene.anims.generateFrameNumbers(texKey, { start: 30, end: 37 }), frameRate: 10, repeat: -1 });

    scene.anims.create({ key: texKey + '_idle_right', frames: scene.anims.generateFrameNumbers(texKey, { start: 40, end: 49 }), frameRate: 6, repeat: -1 });
    scene.anims.create({ key: texKey + '_idle_up', frames: scene.anims.generateFrameNumbers(texKey, { start: 50, end: 59 }), frameRate: 6, repeat: -1 });
    scene.anims.create({ key: texKey + '_idle_left', frames: scene.anims.generateFrameNumbers(texKey, { start: 60, end: 69 }), frameRate: 6, repeat: -1 });
    scene.anims.create({ key: texKey + '_idle_down', frames: scene.anims.generateFrameNumbers(texKey, { start: 70, end: 79 }), frameRate: 6, repeat: -1 });
  }

  generateMapTiles() {
    // === GRASS TILE - rich multi-tone ===
    const grass = document.createElement('canvas');
    grass.width = 32; grass.height = 32;
    const gctx = grass.getContext('2d');
    // Base gradient feel
    gctx.fillStyle = '#4a8c3f';
    gctx.fillRect(0, 0, 32, 32);
    const rng = seededRandom(1234);
    // Varied grass patches
    for (let i = 0; i < 40; i++) {
      const gx = rng()*30|0, gy = rng()*30|0;
      const v = rng()*30-15;
      gctx.fillStyle = rgbToHex(74+v, 140+v, 63+v);
      gctx.fillRect(gx, gy, 2+rng()*2|0, 2);
    }
    // Individual grass blades
    for (let i = 0; i < 12; i++) {
      gctx.fillStyle = rng()>0.5?'#5aaa4a':'#3a7a2a';
      gctx.fillRect(rng()*30|0, rng()*30|0, 1, 2);
    }
    // Tiny flowers scattered
    if (rng() > 0.5) {
      gctx.fillStyle = '#e8e860';
      gctx.fillRect(rng()*28|0, rng()*28|0, 2, 2);
    }
    this.textures.addCanvas('tile_grass', grass);

    // === GRASS VARIANT 2 ===
    const grass2 = document.createElement('canvas');
    grass2.width = 32; grass2.height = 32;
    const g2ctx = grass2.getContext('2d');
    g2ctx.fillStyle = '#4a8838';
    g2ctx.fillRect(0, 0, 32, 32);
    const rng2 = seededRandom(5678);
    for (let i = 0; i < 35; i++) {
      const v = rng2()*25-12;
      g2ctx.fillStyle = rgbToHex(70+v, 136+v, 56+v);
      g2ctx.fillRect(rng2()*30|0, rng2()*30|0, 2+rng2()*3|0, 2);
    }
    for (let i = 0; i < 8; i++) {
      g2ctx.fillStyle = '#5aa848';
      g2ctx.fillRect(rng2()*30|0, rng2()*30|0, 1, 3);
    }
    this.textures.addCanvas('tile_grass2', grass2);

    // === WATER TILE - animated feel with depth ===
    const water = document.createElement('canvas');
    water.width = 32; water.height = 32;
    const wctx = water.getContext('2d');
    // Deep base
    wctx.fillStyle = '#2a6090';
    wctx.fillRect(0, 0, 32, 32);
    // Lighter patches
    const wrng = seededRandom(9012);
    for (let i = 0; i < 20; i++) {
      wctx.fillStyle = wrng()>0.5?'#3a78a8':'#2a6898';
      wctx.fillRect(wrng()*28|0, wrng()*28|0, 4+wrng()*6|0, 2);
    }
    // Wave highlights
    for (let i = 0; i < 6; i++) {
      wctx.fillStyle = '#5a98c8';
      const wy = 4+i*5;
      wctx.fillRect(2+i*3, wy, 8, 1);
    }
    // Sparkle
    wctx.fillStyle = '#90c8e8';
    wctx.fillRect(8, 6, 2, 1);
    wctx.fillRect(22, 18, 2, 1);
    this.textures.addCanvas('tile_water', water);

    // === WATER EDGE TILES ===
    for (const dir of ['top','bottom','left','right','tl','tr','bl','br']) {
      const we = document.createElement('canvas');
      we.width = 32; we.height = 32;
      const wectx = we.getContext('2d');
      // Start with grass
      wectx.fillStyle = '#4a8c3f';
      wectx.fillRect(0, 0, 32, 32);
      const wrng2 = seededRandom(dir.length*100);
      for (let i = 0; i < 20; i++) {
        const v = wrng2()*20-10;
        wectx.fillStyle = rgbToHex(74+v, 140+v, 63+v);
        wectx.fillRect(wrng2()*30|0, wrng2()*30|0, 3, 2);
      }
      // Water portion
      wectx.fillStyle = '#2a6090';
      switch(dir) {
        case 'top': wectx.fillRect(0,0,32,16); break;
        case 'bottom': wectx.fillRect(0,16,32,16); break;
        case 'left': wectx.fillRect(0,0,16,32); break;
        case 'right': wectx.fillRect(16,0,16,32); break;
        case 'tl': wectx.fillRect(0,0,16,16); break;
        case 'tr': wectx.fillRect(16,0,16,16); break;
        case 'bl': wectx.fillRect(0,16,16,16); break;
        case 'br': wectx.fillRect(16,16,16,16); break;
      }
      // Soften edge with intermediate color
      wectx.fillStyle = '#3a7a60';
      switch(dir) {
        case 'top': wectx.fillRect(0,14,32,4); break;
        case 'bottom': wectx.fillRect(0,14,32,4); break;
        case 'left': wectx.fillRect(14,0,4,32); break;
        case 'right': wectx.fillRect(14,0,4,32); break;
      }
      this.textures.addCanvas('tile_water_'+dir, we);
    }

    // === PATH TILE ===
    const path = document.createElement('canvas');
    path.width = 32; path.height = 32;
    const pctx = path.getContext('2d');
    pctx.fillStyle = '#b8a070';
    pctx.fillRect(0, 0, 32, 32);
    const prng = seededRandom(3456);
    // Cobblestone pattern
    for (let i = 0; i < 10; i++) {
      const px = prng()*24|0, py = prng()*24|0;
      const pw = 4+prng()*6|0, ph = 3+prng()*5|0;
      const v = prng()*20-10;
      pctx.fillStyle = rgbToHex(175+v, 155+v, 115+v);
      pctx.fillRect(px, py, pw, ph);
      pctx.fillStyle = rgbToHex(185+v, 165+v, 125+v);
      pctx.fillRect(px, py, pw, 1);
      pctx.fillStyle = rgbToHex(155+v, 135+v, 95+v);
      pctx.fillRect(px, py+ph-1, pw, 1);
    }
    this.textures.addCanvas('tile_path', path);

    // === STONE/WALL TILE ===
    const stone = document.createElement('canvas');
    stone.width = 32; stone.height = 32;
    const sctx = stone.getContext('2d');
    sctx.fillStyle = '#7a6a5a';
    sctx.fillRect(0, 0, 32, 32);
    for (let by = 0; by < 4; by++) {
      for (let bx = 0; bx < 2; bx++) {
        const ox = bx*16+(by%2)*8;
        const oy = by*8;
        const v = ((bx+by)%3)*8;
        sctx.fillStyle = rgbToHex(130+v, 115+v, 100+v);
        sctx.fillRect(ox, oy, 15, 7);
        sctx.fillStyle = rgbToHex(145+v, 130+v, 115+v);
        sctx.fillRect(ox, oy, 15, 1);
        sctx.fillStyle = rgbToHex(110+v, 95+v, 80+v);
        sctx.fillRect(ox, oy+6, 15, 1);
      }
    }
    this.textures.addCanvas('tile_stone', stone);

    // === DARK GRASS ===
    const dgr = document.createElement('canvas');
    dgr.width = 32; dgr.height = 32;
    const dctx = dgr.getContext('2d');
    dctx.fillStyle = '#3a6c2f';
    dctx.fillRect(0, 0, 32, 32);
    const drng = seededRandom(7890);
    for (let i = 0; i < 30; i++) {
      const v = drng()*20-10;
      dctx.fillStyle = rgbToHex(58+v, 108+v, 47+v);
      dctx.fillRect(drng()*30|0, drng()*30|0, 2+drng()*2|0, 2);
    }
    this.textures.addCanvas('tile_darkgrass', dgr);

    // === DOOR/PORTAL - richly drawn ===
    const door = document.createElement('canvas');
    door.width = 40; door.height = 56;
    const dc = door.getContext('2d');
    const DR = (x,y,rw,rh,c) => { dc.fillStyle=c; dc.fillRect(x,y,rw,rh); };
    // Frame
    DR(4, 8, 32, 48, '#5a3a1a');
    DR(6, 10, 28, 44, '#4a2a10');
    // Door panels
    DR(8, 12, 24, 40, '#6a4a28');
    DR(10, 14, 20, 36, '#7a5a30');
    // Panel lines
    DR(8, 12, 24, 2, '#8a6a3a');
    DR(19, 14, 2, 36, '#5a3a18');
    // Arch
    for (let a = 0; a < Math.PI; a += 0.1) {
      dc.fillStyle = '#8a6a3a';
      dc.fillRect(20+Math.cos(a)*14, 10-Math.sin(a)*8, 2, 2);
    }
    // Green magic glow inside
    dc.globalAlpha = 0.35;
    DR(10, 18, 20, 30, '#40c860');
    dc.globalAlpha = 0.15;
    fillOval(dc, 20, 32, 16, 20, '#53d769');
    dc.globalAlpha = 1;
    // Handle
    dc.fillStyle = '#d4a843';
    dc.fillRect(26, 34, 3, 3);
    // "E to enter" sparkles
    const srng = seededRandom(555);
    for (let i = 0; i < 6; i++) {
      dc.fillStyle = '#7dff97';
      dc.globalAlpha = 0.5+srng()*0.5;
      dc.fillRect(8+srng()*22, 16+srng()*28, 2, 2);
    }
    dc.globalAlpha = 1;
    this.textures.addCanvas('door_portal', door);

    // === LARGE BUILDING/ROOF for marketplace ===
    const roof = document.createElement('canvas');
    roof.width = 112; roof.height = 96;
    const rc = roof.getContext('2d');
    const RR = (x,y,rw,rh,c) => { rc.fillStyle=c; rc.fillRect(x,y,rw,rh); };
    // Walls
    for (let y = 40; y < 92; y++) {
      const v = (y%8<4)?0:-6;
      rc.fillStyle = rgbToHex(160+v, 128+v, 72+v);
      rc.fillRect(10, y, 92, 1);
    }
    // Beams
    RR(10, 40, 92, 3, '#5a3a18');
    RR(10, 60, 92, 2, '#5a3a18');
    RR(10, 89, 92, 3, '#5a3a18');
    RR(10, 40, 3, 52, '#5a3a18');
    RR(99, 40, 3, 52, '#5a3a18');
    // Roof
    for (let row = 0; row < 38; row++) {
      const progress = row/38;
      const roofW = 52*(1-progress*0.88);
      if (roofW<4) break;
      const colors = ['#b86030','#a85028','#c87038','#985020'];
      rc.fillStyle = colors[Math.floor(row/3)%colors.length];
      rc.fillRect(56-roofW, 4+row, roofW*2, 1);
    }
    RR(6, 41, 100, 4, '#7a3a10');
    RR(6, 41, 100, 1, '#c87040');
    // Windows
    drawWindow(rc, 18, 48, 16, 16);
    drawWindow(rc, 78, 48, 16, 16);
    drawWindow(rc, 18, 68, 16, 16);
    drawWindow(rc, 78, 68, 16, 16);
    // Grand door
    RR(44, 62, 24, 30, '#4a2a10');
    RR(46, 64, 20, 26, '#5a3818');
    RR(55, 64, 2, 26, '#4a2a10');
    RR(58, 78, 3, 3, '#d4a843');
    this.textures.addCanvas('building_main', roof);
  }

  create() {
    this.scene.start('Marketplace');
  }
}

// ============================================================
// MARKETPLACE SCENE - LUSH & VIBRANT
// ============================================================
class MarketplaceScene extends Phaser.Scene {
  constructor() { super('Marketplace'); }

  create() {
    const W = 1376, H = 752;
    this.cameras.main.setBounds(0, 0, W, H);

    // === BACKGROUND IMAGE ===
    this.add.image(W / 2, H / 2, 'marketplace_bg').setDepth(0);

    // === HOUSE PORTAL TO PLOTS ===
    // Invisible zone positioned over the little house on the background
    this.doorZone = this.add.zone(1030, 340, 100, 100);
    this.doorLabel = this.add.text(1030, 280, 'ENTER PLOT [E]', {
      fontSize: '11px', fontFamily: 'Courier New', color: '#53d769',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10000);

    // === PLAYER ===
    const charNum = gameState.charNumber || 1;
    const texKey = BootScene.loadCharacterSprite(this, charNum, 'char_' + charNum);
    this.playerTexKey = texKey;

    const startX = gameState.isInPlot ? 1030 : 688;
    const startY = gameState.isInPlot ? 380 : 480;
    if (this.textures.exists(texKey)) {
      this.player = this.add.sprite(startX, startY, texKey).setScale(1.33).setDepth(10000);
      this.player.play(texKey + '_idle_down');
    } else {
      this.player = this.add.sprite(startX, startY, '__DEFAULT').setScale(1.33).setDepth(10000);
      this.player._pendingTexKey = texKey;
    }
    this.playerDir = 'down';
    this.playerLabel = this.add.text(startX, startY - 50, gameState.user?.username || '', {
      fontSize: '11px', fontFamily: 'Courier New', color: '#fff',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10001);

    this.otherPlayers = {};
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.moveSpeed = 3;
    this.moveTimer = 0;
    this.wasMoving = false;

    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    gameState.isInPlot = false;
    gameState.currentScene = 'marketplace';
    updateUI();

    // Request current players in the scene so we see anyone already here
    socket.emit('requestPlayersUpdate');
  }

  update(time) {
    if (!this.player) return;
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) dx = -this.moveSpeed;
    if (this.cursors.right.isDown || this.wasd.D.isDown) dx = this.moveSpeed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) dy = -this.moveSpeed;
    if (this.cursors.down.isDown || this.wasd.S.isDown) dy = this.moveSpeed;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }

    const isMoving = dx !== 0 || dy !== 0;

    if (isMoving) {
      let newX = Phaser.Math.Clamp(this.player.x + dx, 20, 1356);
      let newY = Phaser.Math.Clamp(this.player.y + dy, 20, 732);

      // === LAKE BOUNDARY ===
      // Lake rect and platform entry gap at top-left
      const LAKE = { x1: 490, y1: 235, x2: 870, y2: 430 };
      const ENTRY = { x1: 470, y1: 220, x2: 545, y2: 260 }; // platform dock
      const inLake = (px, py) => px > LAKE.x1 && px < LAKE.x2 && py > LAKE.y1 && py < LAKE.y2;
      const inEntry = (px, py) => px > ENTRY.x1 && px < ENTRY.x2 && py > ENTRY.y1 && py < ENTRY.y2;
      const wasInLake = inLake(this.player.x, this.player.y);
      const willBeInLake = inLake(newX, newY);

      if (willBeInLake && !wasInLake) {
        // Trying to enter the lake — only allow through the entry platform
        if (!inEntry(this.player.x, this.player.y) && !inEntry(newX, newY)) {
          // Block: keep whichever axis would enter the lake, allow the other
          const wouldXEnter = inLake(newX, this.player.y);
          const wouldYEnter = inLake(this.player.x, newY);
          if (wouldXEnter) newX = this.player.x;
          if (wouldYEnter) newY = this.player.y;
          // If both blocked, don't move at all
          if (inLake(newX, newY)) { newX = this.player.x; newY = this.player.y; }
        }
      }

      this.player.x = newX;
      this.player.y = newY;
      this.player.setDepth(this.player.y + 10000);
      this.playerLabel.setPosition(this.player.x, this.player.y - 38);
      if (time - this.moveTimer > 50) {
        this.moveTimer = time;
        socket.emit('move', { x: this.player.x, y: this.player.y });
      }
      // Determine facing direction (prioritize horizontal for diagonal movement)
      let newDir = this.playerDir;
      if (Math.abs(dx) >= Math.abs(dy)) {
        newDir = dx < 0 ? 'left' : 'right';
      } else {
        newDir = dy < 0 ? 'up' : 'down';
      }
      // Play directional walk animation
      if ((!this.wasMoving || newDir !== this.playerDir) && this.textures.exists(this.playerTexKey)) {
        this.player.setFlipX(false);
        this.player.play(this.playerTexKey + '_walk_' + newDir);
        this.playerDir = newDir;
      }
    } else if (this.wasMoving && this.textures.exists(this.playerTexKey)) {
      // Stopped moving — switch to directional idle
      this.player.setFlipX(false);
      this.player.play(this.playerTexKey + '_idle_' + this.playerDir);
    }
    this.wasMoving = isMoving;

    // House portal proximity
    if (this.doorZone) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.doorZone.x, this.doorZone.y);
      if (dist < 80) {
        this.doorLabel.setAlpha(1);
      } else {
        this.doorLabel.setAlpha(dist < 150 ? 0.6 : 0);
      }
    }
  }

  addOtherPlayer(data) {
    if (this.otherPlayers[data.id]) {
      this.otherPlayers[data.id].sprite.setPosition(data.x, data.y);
      this.otherPlayers[data.id].label.setPosition(data.x, data.y - 38);
      return;
    }
    // Load this player's unique spritesheet by their charNumber
    const otherCharNum = data.charNumber || 1;
    const texKey = 'char_' + otherCharNum;
    BootScene.loadCharacterSprite(this, otherCharNum, texKey);

    let sprite;
    if (this.textures.exists(texKey)) {
      sprite = this.add.sprite(data.x, data.y, texKey).setScale(1.33).setDepth(data.y);
      sprite.play(texKey + '_idle_down');
    } else {
      sprite = this.add.sprite(data.x, data.y, '__DEFAULT').setScale(1.33).setDepth(data.y);
      sprite._pendingTexKey = texKey;
    }
    sprite._texKey = texKey;
    sprite._lastX = data.x;
    sprite._lastY = data.y;
    sprite._dir = 'down';
    const label = this.add.text(data.x, data.y - 38, data.username, {
      fontSize: '10px', fontFamily: 'Courier New', color: '#ccc',
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(data.y + 1);
    this.otherPlayers[data.id] = { sprite, label, _dir: 'down' };
  }
  removeOtherPlayer(id) {
    if (this.otherPlayers[id]) { this.otherPlayers[id].sprite.destroy(); this.otherPlayers[id].label.destroy(); delete this.otherPlayers[id]; }
  }
  updateOtherPlayers(playersList) {
    if (!this.otherPlayers) return;
    const ids = new Set();
    for (const p of playersList) { if (gameState.user && p.id === gameState.user.id) continue; ids.add(p.id); this.addOtherPlayer(p); }
    for (const id of Object.keys(this.otherPlayers)) { if (!ids.has(id)) this.removeOtherPlayer(id); }
  }
  moveOtherPlayer(id, x, y) {
    if (!this.otherPlayers) return;
    const op = this.otherPlayers[id];
    if (op) {
      const ddx = x - op.sprite._lastX;
      const ddy = y - op.sprite._lastY;
      const tk = op.sprite._texKey;
      if ((ddx !== 0 || ddy !== 0) && tk && this.textures.exists(tk)) {
        let dir = op._dir || 'down';
        if (Math.abs(ddx) >= Math.abs(ddy)) {
          dir = ddx < 0 ? 'left' : 'right';
        } else {
          dir = ddy < 0 ? 'up' : 'down';
        }
        const walkKey = tk + '_walk_' + dir;
        if (op.sprite.anims.currentAnim?.key !== walkKey) op.sprite.play(walkKey);
        op._dir = dir;
        if (op._idleTimer) clearTimeout(op._idleTimer);
        op._idleTimer = setTimeout(() => {
          if (op.sprite?.active && this.textures.exists(tk)) op.sprite.play(tk + '_idle_' + (op._dir || 'down'));
        }, 200);
      }
      op.sprite._lastX = x;
      op.sprite._lastY = y;
      op.sprite.setPosition(x, y).setDepth(y);
      op.label.setPosition(x, y - 38).setDepth(y + 1);
    }
  }
  showChatBubble(username, text) {
    // Find the sprite to attach to
    let targetSprite = null;
    if (gameState.user && username === gameState.user.username) {
      targetSprite = this.player;
    } else if (this.otherPlayers) {
      for (const op of Object.values(this.otherPlayers)) {
        if (op.label && op.label.text === username) { targetSprite = op.sprite; break; }
      }
    }
    if (!targetSprite) return;

    // Truncate long messages
    const msg = text.length > 40 ? text.slice(0, 37) + '...' : text;

    // Create bubble background + text
    const bx = targetSprite.x;
    const by = targetSprite.y - 55;
    const bubbleText = this.add.text(bx, by, msg, {
      fontSize: '10px', fontFamily: 'Courier New', color: '#1a1a2e',
      backgroundColor: '#fff', padding: { x: 6, y: 4 },
      wordWrap: { width: 160 }, align: 'center',
      stroke: '#000', strokeThickness: 0
    }).setOrigin(0.5, 1).setDepth(20000);

    // Add rounded border look
    bubbleText.setStyle({ backgroundColor: '#f0f0f0' });

    // Small tail triangle
    const tail = this.add.triangle(bx, by + 2, 0, 0, 10, 0, 5, 6, 0xf0f0f0).setDepth(20000);

    // Animate: float up slightly then fade out
    this.tweens.add({
      targets: [bubbleText, tail],
      alpha: 0,
      y: '-=10',
      delay: 3000,
      duration: 500,
      onComplete: () => { bubbleText.destroy(); tail.destroy(); }
    });

    // Track bubble so it moves with the player
    const updateBubble = () => {
      if (!targetSprite.active || !bubbleText.active) return;
      bubbleText.setPosition(targetSprite.x, targetSprite.y - 55);
      tail.setPosition(targetSprite.x, targetSprite.y - 55 + 2);
    };
    this.time.addEvent({ delay: 16, callback: updateBubble, repeat: 218 }); // ~3.5s
  }
}

// ============================================================
// PLOT SCENE - YOUR PERSONAL LAND
// ============================================================
class PlotScene extends Phaser.Scene {
  constructor() { super('Plot'); }

  create() {
    const W = 960, H = 720;
    this.cameras.main.setBounds(0, 0, W, H);

    // Ground with varied grass
    const rng = seededRandom(7777);
    for (let y = 0; y < H; y += 32) {
      for (let x = 0; x < W; x += 32) {
        const isEdge = x<48||x>W-80||y<48||y>H-80;
        this.add.image(x+16, y+16, isEdge?'tile_darkgrass':(rng()>0.5?'tile_grass':'tile_grass2'));
      }
    }

    // Stone walls all around
    for (let x = 0; x < W; x += 32) {
      this.add.image(x+16, 16, 'tile_stone').setDepth(0);
      this.add.image(x+16, H-16, 'tile_stone').setDepth(0);
    }
    for (let y = 0; y < H; y += 32) {
      this.add.image(16, y+16, 'tile_stone').setDepth(0);
      this.add.image(W-16, y+16, 'tile_stone').setDepth(0);
    }

    // Corner trees for atmosphere
    this.add.image(60, 60, 'tree_pine').setDepth(60);
    this.add.image(W-60, 60, 'tree_pine').setDepth(60);
    this.add.image(60, H-100, 'tree_oak').setDepth(H-100);
    this.add.image(W-60, H-100, 'tree_oak').setDepth(H-100);

    // Exit door
    this.exitDoor = this.add.image(W/2, H-28, 'door_portal').setDepth(H).setScale(1.3);
    this.exitLabel = this.add.text(W/2, H-68, 'EXIT [E]', {
      fontSize:'11px',fontFamily:'Courier New',color:'#ff6b6b',stroke:'#000',strokeThickness:3
    }).setOrigin(0.5).setDepth(10000);

    // Plot name
    const plotData = gameState.currentPlotData;
    this.add.text(W/2, 36, plotData?plotData.name:'My Plot', {
      fontSize:'16px',fontFamily:'Courier New',color:'#53d769',stroke:'#000',strokeThickness:4
    }).setOrigin(0.5).setDepth(10000);

    if (plotData && !gameState.isOwner) {
      this.add.text(W/2, 56, '~ Visiting ~', {
        fontSize:'11px',fontFamily:'Courier New',color:'#7ec8e3',stroke:'#000',strokeThickness:2
      }).setOrigin(0.5).setDepth(10000);
    }

    // Load placed items
    this.placedItems = {};
    if (plotData && plotData.items) {
      for (const item of plotData.items) this.addPlacedItem(item);
    }

    // Player - load character spritesheet dynamically
    const charNum = gameState.charNumber || 1;
    const texKey = 'char_' + charNum;
    BootScene.loadCharacterSprite(this, charNum, texKey);
    this.playerTexKey = texKey;

    if (this.textures.exists(texKey)) {
      this.player = this.add.sprite(W/2, H-120, texKey).setScale(1.33).setDepth(10000);
      this.player.play(texKey + '_idle_down');
    } else {
      this.player = this.add.sprite(W/2, H-120, '__DEFAULT').setScale(1.33).setDepth(10000);
      this.player._pendingTexKey = texKey;
    }
    this.playerDir = 'down';
    this.playerLabel = this.add.text(W/2, H-170, gameState.user?.username||'', {
      fontSize:'11px',fontFamily:'Courier New',color:'#fff',stroke:'#000',strokeThickness:3
    }).setOrigin(0.5).setDepth(10001);

    this.otherPlayers = {};
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.moveSpeed = 3;
    this.moveTimer = 0;
    this.wasMoving = false;
    this.placementGhost = null;

    // Camera follows
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Click to place
    this.input.on('pointerdown', (pointer) => {
      if (gameState.decorateMode && gameState.selectedItem && gameState.isOwner) {
        // Convert screen coords to world coords
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const item = {
          type: gameState.selectedItem.type,
          x: Math.round(worldPoint.x),
          y: Math.round(worldPoint.y),
          w: gameState.selectedItem.w,
          h: gameState.selectedItem.h
        };
        socket.emit('placeItem', { plotId: gameState.currentPlotData.id, item });
      }
    });

    // Right-click remove
    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown() && gameState.isOwner && gameState.currentPlotData) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        for (const [itemId, obj] of Object.entries(this.placedItems)) {
          const dist = Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, obj.sprite.x, obj.sprite.y);
          if (dist < 30) { socket.emit('removeItem', { plotId: gameState.currentPlotData.id, itemId }); break; }
        }
      }
    });
    this.input.mouse.disableContextMenu();

    gameState.isInPlot = true;
    gameState.currentScene = 'plot_' + (plotData ? plotData.id : '');
    updateUI();

    socket.emit('requestPlayersUpdate');
  }

  update(time) {
    if (!this.player) return;
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) dx = -this.moveSpeed;
    if (this.cursors.right.isDown || this.wasd.D.isDown) dx = this.moveSpeed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) dy = -this.moveSpeed;
    if (this.cursors.down.isDown || this.wasd.S.isDown) dy = this.moveSpeed;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }

    const isMoving = dx !== 0 || dy !== 0;

    if (isMoving) {
      this.player.x = Phaser.Math.Clamp(this.player.x + dx, 50, 910);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy, 50, 670);
      this.player.setDepth(this.player.y + 10000);
      this.playerLabel.setPosition(this.player.x, this.player.y - 38);
      if (time - this.moveTimer > 50) { this.moveTimer = time; socket.emit('move', { x: this.player.x, y: this.player.y }); }
      // Determine facing direction
      let newDir = this.playerDir;
      if (Math.abs(dx) >= Math.abs(dy)) {
        newDir = dx < 0 ? 'left' : 'right';
      } else {
        newDir = dy < 0 ? 'up' : 'down';
      }
      if ((!this.wasMoving || newDir !== this.playerDir) && this.textures.exists(this.playerTexKey)) {
        this.player.setFlipX(false);
        this.player.play(this.playerTexKey + '_walk_' + newDir);
        this.playerDir = newDir;
      }
    } else if (this.wasMoving && this.textures.exists(this.playerTexKey)) {
      this.player.setFlipX(false);
      this.player.play(this.playerTexKey + '_idle_' + this.playerDir);
    }
    this.wasMoving = isMoving;

    if (this.exitDoor) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitDoor.x, this.exitDoor.y);
      this.exitDoor[dist<50?'setTint':'clearTint'](0xff8888);
      this.exitLabel.setAlpha(dist<120?1:0);
    }

    // Placement ghost
    if (gameState.decorateMode && gameState.selectedItem) {
      const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
      if (!this.placementGhost) {
        this.placementGhost = this.add.image(worldPoint.x, worldPoint.y, gameState.selectedItem.type).setAlpha(0.5).setDepth(50000);
      }
      this.placementGhost.setPosition(worldPoint.x, worldPoint.y).setTexture(gameState.selectedItem.type);
    } else if (this.placementGhost) { this.placementGhost.destroy(); this.placementGhost = null; }
  }

  addPlacedItem(item) {
    if (this.placedItems[item.id]) return;
    const sprite = this.add.image(item.x, item.y, item.type).setDepth(item.y);
    this.placedItems[item.id] = { sprite, data: item };
  }
  removePlacedItem(itemId) { if (this.placedItems[itemId]) { this.placedItems[itemId].sprite.destroy(); delete this.placedItems[itemId]; } }
  movePlacedItem(itemId, x, y) { if (this.placedItems[itemId]) { this.placedItems[itemId].sprite.setPosition(x,y).setDepth(y); } }

  addOtherPlayer(data) {
    if (this.otherPlayers[data.id]) { this.otherPlayers[data.id].sprite.setPosition(data.x,data.y); this.otherPlayers[data.id].label.setPosition(data.x,data.y-50); return; }
    const otherCharNum = data.charNumber || 1;
    const texKey = 'char_' + otherCharNum;
    BootScene.loadCharacterSprite(this, otherCharNum, texKey);
    let sprite;
    if (this.textures.exists(texKey)) {
      sprite = this.add.sprite(data.x,data.y,texKey).setScale(1.33).setDepth(data.y);
      sprite.play(texKey + '_idle_down');
    } else {
      sprite = this.add.sprite(data.x,data.y,'__DEFAULT').setScale(1.33).setDepth(data.y);
      sprite._pendingTexKey = texKey;
    }
    sprite._texKey = texKey;
    sprite._lastX = data.x;
    sprite._lastY = data.y;
    sprite._dir = 'down';
    const label = this.add.text(data.x,data.y-50,data.username,{fontSize:'10px',fontFamily:'Courier New',color:'#ccc',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(data.y+1);
    this.otherPlayers[data.id] = { sprite, label, _dir: 'down' };
  }
  removeOtherPlayer(id) { if (this.otherPlayers[id]) { this.otherPlayers[id].sprite.destroy(); this.otherPlayers[id].label.destroy(); delete this.otherPlayers[id]; } }
  updateOtherPlayers(playersList) {
    if (!this.otherPlayers) return;
    const ids = new Set();
    for (const p of playersList) { if (gameState.user&&p.id===gameState.user.id) continue; ids.add(p.id); this.addOtherPlayer(p); }
    for (const id of Object.keys(this.otherPlayers)) { if (!ids.has(id)) this.removeOtherPlayer(id); }
  }
  moveOtherPlayer(id, x, y) {
    if (!this.otherPlayers) return;
    const op = this.otherPlayers[id];
    if (op) {
      const ddx = x - op.sprite._lastX;
      const ddy = y - op.sprite._lastY;
      const tk = op.sprite._texKey;
      if ((ddx !== 0 || ddy !== 0) && tk && this.textures.exists(tk)) {
        let dir = op._dir || 'down';
        if (Math.abs(ddx) >= Math.abs(ddy)) {
          dir = ddx < 0 ? 'left' : 'right';
        } else {
          dir = ddy < 0 ? 'up' : 'down';
        }
        const walkKey = tk + '_walk_' + dir;
        if (op.sprite.anims.currentAnim?.key !== walkKey) op.sprite.play(walkKey);
        op._dir = dir;
        if (op._idleTimer) clearTimeout(op._idleTimer);
        op._idleTimer = setTimeout(() => {
          if (op.sprite?.active && this.textures.exists(tk)) op.sprite.play(tk + '_idle_' + (op._dir || 'down'));
        }, 200);
      }
      op.sprite._lastX = x;
      op.sprite._lastY = y;
      op.sprite.setPosition(x, y).setDepth(y);
      op.label.setPosition(x, y - 38).setDepth(y + 1);
    }
  }
  showChatBubble(username, text) {
    let targetSprite = null;
    if (gameState.user && username === gameState.user.username) {
      targetSprite = this.player;
    } else if (this.otherPlayers) {
      for (const op of Object.values(this.otherPlayers)) {
        if (op.label && op.label.text === username) { targetSprite = op.sprite; break; }
      }
    }
    if (!targetSprite) return;

    const msg = text.length > 40 ? text.slice(0, 37) + '...' : text;
    const bx = targetSprite.x;
    const by = targetSprite.y - 55;
    const bubbleText = this.add.text(bx, by, msg, {
      fontSize: '10px', fontFamily: 'Courier New', color: '#1a1a2e',
      backgroundColor: '#f0f0f0', padding: { x: 6, y: 4 },
      wordWrap: { width: 160 }, align: 'center'
    }).setOrigin(0.5, 1).setDepth(20000);

    const tail = this.add.triangle(bx, by + 2, 0, 0, 10, 0, 5, 6, 0xf0f0f0).setDepth(20000);

    this.tweens.add({
      targets: [bubbleText, tail],
      alpha: 0,
      y: '-=10',
      delay: 3000,
      duration: 500,
      onComplete: () => { bubbleText.destroy(); tail.destroy(); }
    });

    const updateBubble = () => {
      if (!targetSprite.active || !bubbleText.active) return;
      bubbleText.setPosition(targetSprite.x, targetSprite.y - 55);
      tail.setPosition(targetSprite.x, targetSprite.y - 55 + 2);
    };
    this.time.addEvent({ delay: 16, callback: updateBubble, repeat: 218 });
  }
}

// ============================================================
// PHASER CONFIG
// ============================================================
const config = {
  type: Phaser.AUTO,
  width: 1376,
  height: 752,
  parent: 'game-container',
  pixelArt: true,
  backgroundColor: '#1a2a1a',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, MarketplaceScene, PlotScene],
  input: { keyboard: true, mouse: true }
};

// ============================================================
// UI FUNCTIONS (same logic, unchanged)
// ============================================================
function updateUI() {
  const uiBar = document.getElementById('ui-bar');
  const chatBox = document.getElementById('chat-box');
  const sceneLabel = document.getElementById('scene-label');
  const btnMyPlot = document.getElementById('btn-my-plot');
  const btnMarket = document.getElementById('btn-marketplace');
  const btnDecorate = document.getElementById('btn-decorate');
  const decoPanel = document.getElementById('decoration-panel');
  if (!gameState.user) { uiBar.style.display='none'; chatBox.style.display='none'; return; }
  uiBar.style.display='flex'; chatBox.style.display='block';
  if (gameState.isInPlot) {
    sceneLabel.textContent = gameState.isOwner?'YOUR PLOT':'VISITING PLOT';
    btnMyPlot.style.display='none'; btnMarket.style.display=''; btnDecorate.style.display=gameState.isOwner?'':'none';
  } else {
    sceneLabel.textContent='MARKETPLACE'; btnMyPlot.style.display=''; btnMarket.style.display='none'; btnDecorate.style.display='none'; decoPanel.style.display='none'; gameState.decorateMode=false;
  }
}

function buildDecorationPanel() {
  const panel = document.getElementById('decoration-panel');
  panel.innerHTML = '<h3>🌳 Decorations</h3>';
  for (const [category, items] of Object.entries(DECORATIONS)) {
    const catDiv = document.createElement('div');
    catDiv.className = 'deco-category';
    catDiv.textContent = category.toUpperCase();
    panel.appendChild(catDiv);
    for (const item of items) {
      const div = document.createElement('div');
      div.className = 'deco-item';
      const preview = generatePixelArt(item.type, item.w, item.h);
      preview.style.width = '32px'; preview.style.height = '32px'; preview.style.objectFit = 'contain';
      div.appendChild(preview);
      const label = document.createElement('span');
      label.textContent = item.name;
      div.appendChild(label);
      div.addEventListener('click', () => {
        document.querySelectorAll('.deco-item').forEach(d => d.classList.remove('selected'));
        div.classList.add('selected');
        gameState.selectedItem = item;
      });
      panel.appendChild(div);
    }
  }
}

function addChatMessage(from, text, isSystem=false) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  if (isSystem) div.innerHTML = `<span class="msg-system">[System]</span> <span class="msg-text">${escapeHtml(text)}</span>`;
  else div.innerHTML = `<span class="msg-user">${escapeHtml(from)}:</span> <span class="msg-text">${escapeHtml(text)}</span>`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}
function escapeHtml(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }
function updatePlayersList(players) {
  const list = document.getElementById('players-list'); list.innerHTML = '';
  for (const p of players) {
    const div = document.createElement('div'); div.className = 'player-entry';
    div.innerHTML = `<span class="dot"></span>${escapeHtml(p.username)} <small style="color:#666">(${p.scene==='marketplace'?'Market':'Plot'})</small>`;
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => { if (p.id !== gameState.user.id) socket.emit('chat', { text: `/visit ${p.username}` }); });
    list.appendChild(div);
  }
}

// ============================================================
// EVENT HANDLERS
// ============================================================
document.getElementById('login-btn').addEventListener('click', doLogin);
document.getElementById('username-input').addEventListener('keydown', (e) => { if (e.key==='Enter') doLogin(); });
document.getElementById('char-number-input').addEventListener('keydown', (e) => { if (e.key==='Enter') doLogin(); });
document.getElementById('wallet-input').addEventListener('keydown', (e) => { if (e.key==='Enter') doLogin(); });
function doLogin() {
  const u = document.getElementById('username-input').value.trim();
  const num = parseInt(document.getElementById('char-number-input').value);
  const wallet = document.getElementById('wallet-input').value.trim();
  document.getElementById('login-error').textContent = '';
  document.getElementById('login-status').textContent = '';
  if (!u) { document.getElementById('login-error').textContent = 'Enter a username'; return; }
  if (!num || num < 1 || num > 11111) {
    document.getElementById('login-error').textContent = 'Enter a character # between 1 and 11111';
    return;
  }
  if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    document.getElementById('login-error').textContent = 'Enter a valid Ethereum wallet address (0x...)';
    return;
  }
  gameState.charNumber = num;
  document.getElementById('login-btn').disabled = true;
  document.getElementById('login-btn').textContent = 'VERIFYING...';
  socket.emit('login', { username: u, charNumber: num, walletAddress: wallet });
}
socket.on('loginStatus', (msg) => {
  document.getElementById('login-status').textContent = msg;
});

document.getElementById('chat-send').addEventListener('click', sendChat);
document.getElementById('chat-input').addEventListener('keydown', (e) => { if (e.key==='Enter') sendChat(); e.stopPropagation(); });
document.getElementById('chat-input').addEventListener('keyup', (e) => e.stopPropagation());
document.getElementById('chat-input').addEventListener('keypress', (e) => e.stopPropagation());
function sendChat() { const input = document.getElementById('chat-input'); const t = input.value.trim(); if (t) { socket.emit('chat', { text: t }); input.value = ''; } }

document.getElementById('btn-my-plot').addEventListener('click', () => socket.emit('enterPlot', { plotOwnerId: gameState.user.id }));
document.getElementById('btn-marketplace').addEventListener('click', () => socket.emit('leavePlot'));
document.getElementById('btn-decorate').addEventListener('click', () => {
  gameState.decorateMode = !gameState.decorateMode;
  const panel = document.getElementById('decoration-panel');
  const btn = document.getElementById('btn-decorate');
  if (gameState.decorateMode) { panel.style.display='block'; btn.classList.add('active'); btn.textContent='Done'; }
  else { panel.style.display='none'; btn.classList.remove('active'); btn.textContent='Decorate'; gameState.selectedItem=null; }
});
document.getElementById('btn-players').addEventListener('click', () => {
  const panel = document.getElementById('players-panel');
  panel.style.display = panel.style.display==='none'?'block':'none'; socket.emit('getOnlinePlayers');
});

// ============================================================
// SOCKET EVENTS
// ============================================================
socket.on('loginSuccess', ({ user, plot }) => {
  document.getElementById('login-btn').disabled = false;
  document.getElementById('login-btn').textContent = 'ENTER WORLD';
  document.getElementById('login-status').textContent = '';
  gameState.user = user; gameState.plot = plot;
  // Use charNumber from login input, or fallback to saved value
  const charNumber = gameState.charNumber || user.charNumber || 1;
  gameState.charNumber = charNumber;

  // Register player in server memory
  socket.emit('registerPlayer', { userId: user.id, username: user.username, charNumber: charNumber });

  // Show character preview
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('creator-screen').style.display = 'block';

  // Update preview with the remote spritesheet
  document.getElementById('creator-sub-label').textContent = `Character #${charNumber}`;
  updateCreatorPreview();

  // Enter world button
  document.getElementById('btn-enter-world').onclick = () => {
    socket.emit('enterWorld', { charNumber: charNumber });

    document.getElementById('creator-screen').style.display = 'none';
    gameState.game = new Phaser.Game(config);
    buildDecorationPanel();
    addChatMessage('System', `Welcome to Lakegang, ${user.username}!`, true);
    addChatMessage('System', 'WASD to move. Press E near doors. Click "My Plot" to enter.', true);
    addChatMessage('System', 'Commands: /visit <name>, /invite <name>', true);
  };
});
socket.on('loginError', (msg) => {
  document.getElementById('login-error').textContent = msg;
  document.getElementById('login-status').textContent = '';
  document.getElementById('login-btn').disabled = false;
  document.getElementById('login-btn').textContent = 'ENTER WORLD';
});
socket.on('playersUpdate', (pl) => { const s = gameState.game?.scene?.getScene(gameState.isInPlot?'Plot':'Marketplace'); if (s?.updateOtherPlayers) s.updateOtherPlayers(pl); });
socket.on('playerMoved', ({id,x,y}) => { const s = gameState.game?.scene?.getScene(gameState.isInPlot?'Plot':'Marketplace'); if (s?.moveOtherPlayer) s.moveOtherPlayer(id,x,y); });
socket.on('enteredPlot', ({plot,isOwner}) => {
  gameState.currentPlotData=plot; gameState.isOwner=isOwner; gameState.decorateMode=false; gameState.selectedItem=null;
  if (gameState.game) { gameState.game.scene.stop('Marketplace'); gameState.game.scene.start('Plot'); }
});
socket.on('enteredMarketplace', () => {
  gameState.currentPlotData=null; gameState.isOwner=false; gameState.decorateMode=false; gameState.selectedItem=null;
  if (gameState.game) { gameState.game.scene.stop('Plot'); gameState.game.scene.start('Marketplace'); }
});
socket.on('itemPlaced', (item) => { const s = gameState.game?.scene?.getScene('Plot'); if (s?.addPlacedItem) s.addPlacedItem(item); });
socket.on('itemRemoved', (itemId) => { const s = gameState.game?.scene?.getScene('Plot'); if (s?.removePlacedItem) s.removePlacedItem(itemId); });
socket.on('itemMoved', ({itemId,x,y}) => { const s = gameState.game?.scene?.getScene('Plot'); if (s?.movePlacedItem) s.movePlacedItem(itemId,x,y); });
socket.on('chatMessage', ({from,text}) => {
  addChatMessage(from, text, from==='System');
  // Show bubble over character's head (skip system messages)
  if (from !== 'System') {
    const s = gameState.game?.scene?.getScene(gameState.isInPlot ? 'Plot' : 'Marketplace');
    if (s?.showChatBubble) s.showChatBubble(from, text);
  }
});
socket.on('onlinePlayers', (p) => updatePlayersList(p));
socket.on('doVisitPlot', ({plotOwnerId}) => socket.emit('enterPlot', {plotOwnerId}));
socket.on('doInvite', ({username}) => socket.emit('inviteToPlot', {username}));

document.addEventListener('keydown', (e) => {
  if (e.key==='e'||e.key==='E') {
    if (document.activeElement===document.getElementById('chat-input')) return;
    if (!gameState.isInPlot) {
      const scene = gameState.game?.scene?.getScene('Marketplace');
      if (scene?.player && scene?.doorZone) {
        if (Phaser.Math.Distance.Between(scene.player.x,scene.player.y,scene.doorZone.x,scene.doorZone.y)<80)
          socket.emit('enterPlot', { plotOwnerId: gameState.user.id });
      }
    } else {
      const scene = gameState.game?.scene?.getScene('Plot');
      if (scene?.player && scene?.exitDoor) {
        if (Phaser.Math.Distance.Between(scene.player.x,scene.player.y,scene.exitDoor.x,scene.exitDoor.y)<60)
          socket.emit('leavePlot');
      }
    }
  }
});
