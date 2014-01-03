// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

Crafty.c('Vertical', {
    init: function () {
        this.requires('Multiway');
    },
    vertical: function (speed) {
        this.multiway(speed, {
            UP_ARROW: -90,
            DOWN_ARROW: 90,
            W: -90,
            S: 90,
            K: -90,
            J: 90
        });
        return this;
    }
});
Crafty.c('ComputerVertical', {
    init: function () {
      this.min_y = Game.map_grid.tile.height;
      this.max_y = (Game.map_grid.tile.height * Game.map_grid.height) - Game.map_grid.tile.height;
      this.bind('EnterFrame', function() {
        var ball = Crafty('Ball');
        if (ball.dX < 0 && ball.at().x < (Game.map_grid.width / 2)) {
          if (this.y > ball.y) {
            // Move up
            if (this.y > this.min_y) {
              this.y -= 3;
            }
          } else {
            // Move Down
            if (this.y + this.h < this.max_y) {
              this.y += 3;
            }
          }
        }
      });
    },
});

Crafty.c('Paddle', {
  init: function() {
    this.requires('Actor, Color')
      .color('blue')
      .attr({h: Game.map_grid.tile.height * 4});
  },

});

Crafty.c('HumanPaddle', {
  init: function() {
    this.requires('Paddle, Vertical, Collision')
      .vertical(4)
      .stopOnSolids()
  },

  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    return this;
  },

  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.y -= this._movement.y;
    }
  },

});
Crafty.c('ComputerPaddle', {
  init: function() {
    this.requires('Paddle, ComputerVertical');
  },
});

Crafty.c('Ball', {
  init: function() {
    this.requires('Actor, Color, Collision, DOM')
      .color('white')
      .attr({dX: 2, dY: 3})
      .bind('EnterFrame', function() {
        var at = this.at();

        // Computer gets point
        if (at.x > Game.map_grid.width) {
            this.at(8, 8);
        }


        // User gets point
        if (at.x < 0) {
            this.at(8, 8);
        }

        this.x += this.dX;
        this.y += this.dY;
      })
      .onHit('Paddle', function () {
        this.dX *= -1;
      })
      .onHit('BorderTall', function () {
        this.dX *= -1;
      })
      .onHit('BorderWide', function () {
        this.dY *= -1;
      });
  },
});

Crafty.c('Border', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('black')
  }
});
Crafty.c('BorderTall', {
  init: function() {
    this.requires('Border')
      .attr({h: Game.map_grid.tile.height * Game.map_grid.height});
  }
});
Crafty.c('BorderWide', {
  init: function() {
    this.requires('Border')
      .attr({w: Game.map_grid.tile.width * Game.map_grid.width});
  }
});
