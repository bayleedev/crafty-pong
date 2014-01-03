Crafty.scene('Game', function() {
  this.player = Crafty.e('HumanPaddle').at(23, 3);
  this.player = Crafty.e('ComputerPaddle').at(1, 3);
  this.ball = Crafty.e('Ball').at(8, 8);

  // Border
  Crafty.e('BorderWide').at(0, 0);
  Crafty.e('BorderWide').at(0, Game.map_grid.height - 1);
});
