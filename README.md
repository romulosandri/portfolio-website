# Portfolio website

React + Vite portfolio with GSAP, Motion, and a Phaser 4 canvas mini-game on the home page.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Stack

- React 19 + Vite
- GSAP (`gsap`, `@gsap/react`)
- Motion (`motion/react`)
- Phaser 4 for the 2D canvas game

## Game boilerplate

The home page mounts a Phaser game inside `.game-canvas-host`. Placeholder pixel art is generated at runtime in `src/game/createPlaceholderAssets.ts`. Replace that with real spritesheets later, for example:

```ts
this.load.spritesheet('player', '/game/player.png', {
  frameWidth: 32,
  frameHeight: 32,
})
```

Put art in `public/game/`. Scene and player logic live in `src/game/scenes/WorldScene.ts`. Site copy lives in `src/content/site.ts`.
