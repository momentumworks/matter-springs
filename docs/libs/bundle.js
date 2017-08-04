/*!
 * matter-springs 0.0.1 by  2017-08-04
 * https://bitbucket.org/theconcreteutopia/matter-springs#readme
 * License MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("matter-js"));
	else if(typeof define === 'function' && define.amd)
		define(["matter-js"], factory);
	else if(typeof exports === 'object')
		exports["MatterSprings"] = factory(require("matter-js"));
	else
		root["MatterSprings"] = factory(root["Matter"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/libs";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matter = __webpack_require__(0);

function offset(point, vector) {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y
  };
}

var ZeroPoint = { x: 0, y: 0 };
var ZeroVector = ZeroPoint;

/**
 * Springs plugin for Matter JS
 * @module MatterSprings
 */
var MatterSprings = {
  name: 'matter-springs',
  version: '0.0.1',
  for: 'matter-js@^0.12.0',

  // installs the plugin where `base` is `Matter`
  // you should not need to call this directly.
  install: function install(base) {
    base.after('Engine.create', function () {
      MatterSprings.Engine.init(this);
    });

    base.before('Engine.update', function (engine) {
      MatterSprings.Engine.beforeUpdate(engine);
    });

    // TODO Handle correctly adding to the world and to composites via World.add(world, spring)
  },

  Engine: {
    init: function init(engine) {
      engine.world.plugin.springs = engine.world.plugin.springs || [];
    },

    beforeUpdate: function beforeUpdate(engine) {
      var world = engine.world;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = world.plugin.springs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var spring = _step.value;
          var bodyA = spring.bodyA,
              bodyB = spring.bodyB,
              pointA = spring.pointA,
              pointB = spring.pointB,
              stiffness = spring.stiffness,
              damping = spring.damping,
              length = spring.length;


          var p1 = bodyA != null ? offset(bodyA.position, pointA) : pointA;
          var p2 = bodyB != null ? offset(bodyB.position, pointB) : pointB;
          var delta = {
            x: p2.x - p1.x,
            y: p2.y - p1.y
          };

          var distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2)) - length;

          if (Math.abs(distance) > 0.01) {
            var bodyAVelocity = bodyA != null ? bodyA.velocity : ZeroVector;
            var bodyBVelocity = bodyB != null ? bodyB.velocity : ZeroVector;

            var fSpring = {
              x: stiffness * delta.x,
              y: stiffness * delta.y
            };

            var fDamping = {
              // TODO This code is actually wrong right now, since it doesn't take into account that the 
              // bodies maybe already be travelling at some velocity which is irrelevant to the spring
              x: damping * 100 * (bodyAVelocity.x + bodyBVelocity.x),
              y: damping * 100 * (bodyAVelocity.y + bodyBVelocity.y)
            };

            if (bodyA != null) {
              Matter.Body.applyForce(bodyA, p1, {
                x: (fSpring.x - fDamping.x) * 1e-6,
                y: (fSpring.y - fDamping.y) * 1e-6
              });
            }

            if (bodyB != null) {
              Matter.Body.applyForce(bodyB, p2, {
                x: -(fSpring.x + fDamping.x) * 1e-6,
                y: -(fSpring.y + fDamping.y) * 1e-6
              });
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
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
    create: function create(options) {
      var bodyA = options.bodyA,
          bodyB = options.bodyB,
          pointA = options.pointA,
          pointB = options.pointB,
          stiffness = options.stiffness,
          damping = options.damping,
          length = options.length;

      return {
        bodyA: bodyA,
        bodyB: bodyB,
        pointA: pointA || ZeroPoint,
        pointB: pointB || ZeroPoint,
        stiffness: stiffness || 0.5,
        damping: damping || 0.2,
        length: length || 0,
        type: 'spring'
      };
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

/***/ })
/******/ ]);
});