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

const ZeroPoint = {x: 0, y: 0}
const ZeroVector = ZeroPoint

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

    // TODO Handle correctly adding to the world and to composites via World.add(world, spring)
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

        if (Math.abs(distance) > 0.01) {
          const bodyAVelocity = (bodyA != null) ? bodyA.velocity : ZeroVector
          const bodyBVelocity = (bodyB != null) ? bodyB.velocity : ZeroVector

          const fSpring = {
            x: stiffness * delta.x,
            y: stiffness * delta.y
          }

          const fDamping = {
            // TODO This code is actually wrong right now, since it doesn't take into account that the 
            // bodies maybe already be travelling at some velocity which is irrelevant to the spring
            x: damping * 100 * (bodyAVelocity.x + bodyBVelocity.x),
            y: damping * 100 * (bodyAVelocity.y + bodyBVelocity.y)
          }

          var force = {
            x: (fSpring.x + fDamping.x) * 1e-6,
            y: (fSpring.y + fDamping.y) * 1e-6
          }

          if (bodyA != null) {
            Matter.Body.applyForce(bodyA, p1, force)
          }

          if (bodyB != null) {
            Matter.Body.applyForce(bodyB, p2, negate(force))
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
      return {
        bodyA: bodyA,
        bodyB: bodyB,
        pointA: pointA || ZeroPoint,
        pointB: pointB || ZeroPoint,
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
 * @namespace MatterSprings.Spring
 */

/**
 * @property {number} id
 * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
 */

/**
 * @property {string} type
 * A readonly `string` denoting the type of object. (Default `"spring"`)
 */

/**
 * @property {Matter.Body} bodyA
 * The first possible `Body` that this spring is attached to. (Default `null`)
 */

/**
 * @property {Matter.Body} bodyB
 * The second possible `Body` that this spring is attached to. (Default `null`)
 */

/**
 * @property {Vector} pointA
 * A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, 
 * otherwise a world-space position. (Default `{ x: 0, y: 0 }`)
 */

/**
 * @property {Vector} pointB
 * A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, 
 * otherwise a world-space position. (Default `{ x: 0, y: 0 }`)
 */

/**
 * @property {number} stiffness
 * A `number` that specifies the stiffness of the spring. (Default `0.5`)
 */

/**
 * @property {number} damping
 * A `Number` that specifies the damping applied to the spring. (Default `0.2`)
 */

/**
 * @property {number} length
 * A `number` that specifies the length of the spring. (Default `0`)
 */