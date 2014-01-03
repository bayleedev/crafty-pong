Crafty.scene('Game', function() {
  this.player = Crafty.e('Paddle')
    .at(22, 3);
  this.ball = Crafty.e('Ball').at(12, 8);

  // Border
  Crafty.e('BorderTall').at(0, 0);
  Crafty.e('BorderWide').at(0, 0);
  Crafty.e('BorderWide').at(0, Game.map_grid.height - 1);
});
