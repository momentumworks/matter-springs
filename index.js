"use strict";

const Matter = require("matter-js");

function offset(point, vector) {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y
  }
}

function negate(vector) {
  return {
    x: -vector.x,
    y: -vector.y
  }
}

/**
 * Springs plugin for Matter JS
 * @module MatterSprings
 */
const MatterSprings = {
  name: 'matter-springs',
  version: '0.0.1',
  for: 'matter-js@^0.12.0',

  // installs the plugin where `base` is `Matter`
  // you should not need to call this directly.
  install: function(base) {
    base.after('Engine.create', function() {
      MatterSprings.Engine.init(this);
    });

    base.before('Engine.update', function(engine) {
      MatterSprings.Engine.beforeUpdate(engine);
    });

    // TODO Handle correctly adding to the world and to composites
    // base.before('Composite.add', function(composite, args) {
    //   console.log("About to add")
    //   // MatterSprings.Composite.beforeAdd(this);
    // })

    // base.before('World.add', function(world, args) {
    //   console.log("About to add")
    //   // MatterSprings.Composite.beforeAdd(this);
    // })
  },

  Engine: {
    init: function(engine) {
      engine.world.plugin.springs = engine.world.plugin.springs || [];
    },

    beforeUpdate: function(engine) {
      const world = engine.world;
      for (var spring of world.plugin.springs) {
        const { bodyA, bodyB, pointA, pointB, stiffness, damping, length } = spring

        const p1 = (bodyA != null) ? offset(bodyA.position, pointA) : pointA
        const p2 = (bodyB != null) ? offset(bodyB.position, pointB) : pointB
        const delta = {
          x: p2.x - p1.x, 
          y: p2.y - p1.y
        }
        const distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2)) - length

        const bodyASpeed = (spring.bodyA != null) ? spring.bodyA.speed : 0
        const bodyBSpeed = (spring.bodyB != null) ? spring.bodyB.speed : 0

        if (Math.abs(distance) > 1/10000) {
          const fSpring = spring.stiffness * distance
          const fDamping = spring.damping * (bodyASpeed + bodyBSpeed)
          var f = (fSpring + fDamping) * 1e-6

          if (bodyA != null && bodyB != null) {
            f = f/2
          }

          const force = {
            x: delta.x * f,
            y: delta.y * f
          }

          if (bodyA != null) {
            Matter.Body.applyForce(bodyA, pointA, force)
          }

          if (bodyB != null) {
            Matter.Body.applyForce(bodyB, pointB, negate(force))
          }
        }
      }
    }
  },

  Spring: {
    /**
     * Creates a new spring.
     * All properties are optional.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {} options
     * @return {spring} spring
     */
    create: function(options) {
      const { bodyA, bodyB, pointA, pointB, stiffness, damping, length } = options
      const pointZero = {x: 0, y: 0}
      return {
        bodyA: bodyA,
        bodyB: bodyB,
        pointA: pointA || pointZero,
        pointB: pointB || pointZero,
        stiffness: stiffness || 0.5,
        damping: damping || 0.2,
        length: length || 0,
        type: 'spring'
      }
    }
  }
};

Matter.Plugin.register(MatterSprings);

module.exports = MatterSprings;

/**
 * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
 *
 * @property id
 * @type number
 */

/**
 * A `String` denoting the type of object.
 *
 * @property type
 * @type string
 * @default "spring"
 * @readOnly
 */

/**
 * The first possible `Body` that this spring is attached to.
 *
 * @property bodyA
 * @type body
 * @default null
 */

/**
 * The second possible `Body` that this spring is attached to.
 *
 * @property bodyB
 * @type body
 * @default null
 */

/**
 * A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, otherwise a world-space position.
 *
 * @property pointA
 * @type vector
 * @default { x: 0, y: 0 }
 */

/**
 * A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, otherwise a world-space position.
 *
 * @property pointB
 * @type vector
 * @default { x: 0, y: 0 }
 */

/**
 * A `Number` that specifies the stiffness of the spring
 *
 * @property stiffness
 * @type number
 * @default 0.5
 */

/**
 * A `Number` that specifies the damping applied to the spring
 *
 * @property damping
 * @type number
 * @default 0.2
 */

/**
 * A `Number` that specifies the length of the spring 
 *
 * @property length
 * @type number
 * @default 0
 */