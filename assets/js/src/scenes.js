Crafty.scene('Game', function() {
  Crafty.e('HumanPaddle').at(Game.map_grid.width - 1, 3);
  Crafty.e('ComputerPaddle').at(1, 3);
  Crafty.e('Ball').at(8, 8).attr({
    human_point: 'HumanPoint',
    computer_point: 'ComputerPoint',
  });

  Crafty.e('Score')
    .at(2, 2)
    .respondTo('ComputerPoint');

  Crafty.e('Score')
    .at(Game.map_grid.width - 4, 2)
    .respondTo('HumanPoint');

  // Border
  Crafty.e('BorderWide').at(0, 0);
  Crafty.e('BorderWide').at(0, Game.map_grid.height - 1);
});

Crafty.scene('Start', function() {

  Crafty.e('title')
    .at(0, 2)
    .text('Simple Pong');

  beginner = Crafty.e('DifficultyText')
    .at(0, 5)
    .difficulty(1)
    .text('Beginner')

  Crafty.e('DifficultyText')
    .at(0, 8)
    .difficulty(2)
    .text('Intermediate')

  Crafty.e('DifficultyText')
    .at(0, 11)
    .difficulty(3)
    .text('Advanced')

});
