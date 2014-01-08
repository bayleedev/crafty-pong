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
    }
    this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
    return this;
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
              this.y -= Game.computer_speed();
            }
          } else {
            // Move Down
            if (this.y + this.h < this.max_y) {
              this.y += Game.computer_speed();
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
    return this;
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
      .attr({
        dX: Crafty.math.randomInt.apply(null, Game.ball_speed()),
        dY: Crafty.math.randomInt.apply(null, Game.ball_speed())
      })
      .bind('EnterFrame', function() {
        var at = this.at();

        // Computer gets point
        if (at.x > Game.map_grid.width) {
          Crafty.trigger(this.computer_point);
          this.at(2, 8);
        }

        // User gets point
        if (at.x < 0) {
          Crafty.trigger(this.human_point);
          this.at(Game.map_grid.width - 2, 8);
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
Crafty.c('Score', {
  init: function() {
    this.points = 0;
    this.requires('DOM, 2D, Text, Grid')
      .text('0 Points')
      .attr({w: 300});
  },
  respondTo: function(name) {
    var that = this;
    Crafty.bind(name, function() {
      that.text((++that.points) + ' Points');
    });
    return this;
  }
});

Crafty.c('DifficultyTextBlock', {
  init: function() {
    this.requires('BorderWide, Mouse')
      .color('Transparent')
  },
  setup: function(e) {
    this.e = e;
    this.attr({
      x: e.x,
      y: e.y - 5,
      h: e.h + 10,
      w: e.w
    })
    .bind('Click', this.click);
  },
  click: function() {
    Game.difficulty(this.e.difficulty);
    Crafty.scene('Game');
  }
});

Crafty.c('title', {
  init: function() {
    this.requires('DOM, 2D, Text, Grid')
      .textFont({ size: '25px' })
      .css({ 'text-align': 'center' })
      .attr({
        w: Game.width(),
      });
  }
});

Crafty.c('DifficultyText', {
  init: function() {
    this.requires('title')
      .textFont({ size: '20px' })
  },
  difficulty: function(difficulty) {
    this.difficulty = difficulty;
    Crafty.e('DifficultyTextBlock').setup(this);
    return this;
  },
});

/**
 * Model helps bind data to multiple components.
 *
 * @example
 * ~~~
 * dave = Crafty.e('Model');
 * dave.bind('change:name', function(name) { console.log('Daves new name', name); });
 * bob = Crafty.e('Model');
 * bob.bind('change:name', function(name) { console.log('Bobs new name', name); });
 *
 * dave.attr({name: 'David'}); // => Daves new name David
 * bob.attr('name', 'Robert'); // => Bobs new name Robert
 * ~~~
 */
Crafty.c('Model', {
  init: function() {
    this.bind('Change', this._changed);
  },
  _changed: function(changes) {
    for (key in changes) {
      this.trigger('change:' + key, changes[key]);
    }
  },
});

// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

Crafty.c('Data', {
  init: function() {
    this.defaults = this.defaults || {};
    this.attributes = this.extend.call(this.attributes || {}, this.defaults);
  },

  /**
   * Sets up the data in the object without triggering events.
   */
  setup: function(data) {
    this.set.apply(this, data, {silent: true});
    return this;
  },

  /**
   * Generic getter/setter delegator.
   *
   * @example
   * ~~~
   * person.data('name', 'blainesch');
   * person.data('name'); // #-> 'blainesch'
   * ~~~
   */
  data: function() {
    if (arguments.length === 1 && typeof arguments[0] === 'string') {
      return this.get.apply(this, arguments);
    }
    return this.set.apply(this, arguments);
  },

  /**
   * Getter method.
   *
   * @example
   * ~~~
   * person.get('name'); // #-> 'blainesch'
   * ~~~
   */
  get: function(key) {
    return this.data[key];
  },

  /**
   * Main setter function for data attributes.
   *
   * @example
   * ~~~
   * person.set('name', 'blainesch', {silent: true});
   * person.set('name', 'blainesch');
   * person.set({name: 'blainesch'}, {silent: true});
   * person.set({name: 'blainesch'});
   * ~~~
   */
  set: function() {
    length = arguments.length;
    if (length === 3 || (length === 2 && typeof arguments[0] === 'string')) {
      data = {};
      data[arguments[0]] = arguments[1];
      options = arguments[2] || {};
    } else {
      data = arguments[0] || {};
      options = arguments[1] || {};
    }
    this.extend.call(this.attributes, data);
    this.trigger('data_change', data);
    return this;
  },
});

/**
 * Helps determine when data or the component is "dirty" or has changed attributes.
 *
 * @example
 * ~~~
 * person = Crafty.e('DirtyData').setup({name: 'blainesch', age: 24});
 * person.is_dirty(); // #-> false
 * person.is_dirty('name'); // #-> false
 *
 * person.set('name', 'Blaine');
 * person.is_dirty(); // #-> true
 * person.is_dirty('name'); // #-> true
 * person.is_dirty('age'); // #-> false
 * person.changed; // #-> ['name']
 * ~~~
 */
Crafty.c('DirtyData', {
  init: function() {
    this.original = this.attributes;
    this.changed = this.changed || [];
    this.requires('Data').bind('data_change', this._changed);
  },
  is_dirty: function(key) {
    if (arguments.length === 0) {
      return !!this.changed.length;
    }
    return this.changed.indexOf(key) > -1;
  },
  _changed: function(changes) {
    this.changed.push.apply(this.changed, Object.keys(changes));
    for (key in changes) {
      this.trigger('change:' + key, changes[key]);
    }
  },
});

/**
 * Allows binding to specific data changes.
 *
 * @example
 * ~~~
 * person = Crafty.e('DataEvents').setup({name: 'blainesch', age: 24});
 * person.bind('change:name', function(value) {
 *   console.log('updated name to', value);
 * });
 * person.set('name', 'Blaine'); // #-> 'updated name to Blaine'
 * ~~~
 */
Crafty.c('DataEvents', {
  init: function() {
    this.requires('Data').bind('data_change', this._changed);
  },
  _changed: function(changes) {
    for (key in changes) {
      this.trigger('change:' + key, changes[key]);
    }
  },
});
Crafty.c('Model', {
  init: function() {
    this.requires('Data, DirtyData, DataEvents');
  },
});

Crafty.c('Person', {
  defaults: {name: 'John Doe', age: 0},
  init: function() {
    this.requires('Model');
  },
});
