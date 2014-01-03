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

Crafty.c('Paddle', {
  init: function() {
    this.requires('Actor, Color, Vertical, Collision')
      .color('blue')
      .vertical(4)
      .stopOnSolids()
      .attr({h: Game.map_grid.tile.height * 4});
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    return this;
  },

  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.y -= this._movement.y;
    }
  },
});

Crafty.c('Ball', {
  init: function() {
    this.requires('Actor, Color')
      .color('white');
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
