Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  40,
    height: 24,
    tile: {
      width:  16,
      height: 16
    }
  },

  _difficulty: {
    current: 1,
    sets: [
      {ball_speed: [2,3], computer_speed: 1.5},
      {ball_speed: [3,4], computer_speed: 3},
      {ball_speed: [5,6], computer_speed: 5},
    ]
  },

  computer_speed: function() {
    return this.difficulty().computer_speed;
  },

  ball_speed: function() {
    return this.difficulty().ball_speed;
  },

  difficulty: function(difficulty) {
    if (difficulty == null) {
      return this._difficulty.sets[this._difficulty.current - 1];
    }
    return this._difficulty.current = difficulty;
  },

  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  center: function() {
    return Math.ceil(this.map_grid.width / 2);
  },

  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('Silver');

    // Simply start the "Loading" scene to get things going
    Crafty.scene('Start');
  },
}
