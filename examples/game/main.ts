import Game from '../../src/pixgame2d';

import spritePath from './texture.png';

const game = new Game().fullscreen();

const sprite = game.Sprite(spritePath);
sprite.position.set(200);
sprite.size.set(400);

game.animate(() => {
  game.background(0, 0, 0);
  sprite.position.x += 0.1;
});
