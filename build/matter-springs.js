/*!
 * matter-springs 0.0.1 by  2017-05-31
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

function negate(vector) {
  return {
    x: -vector.x,
    y: -vector.y
  };
}

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
              damping = spring.damping;


          var p1 = bodyA != null ? offset(bodyA.position, pointA) : pointA;
          var p2 = bodyB != null ? offset(bodyB.position, pointB) : pointB;
          var delta = {
            x: p2.x - p1.x,
            y: p2.y - p1.y
          };
          var distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

          if (distance > 1 / 10000) {
            var fSpring = spring.stiffness * distance;
            var fDamping = -spring.damping * spring.bodyA.speed;
            var f = (fSpring + fDamping) * 1e-6;

            if (bodyA != null && bodyB != null) {
              f = f / 2;
            }

            var force = {
              x: delta.x * f,
              y: delta.y * f
            };

            if (bodyA != null) {
              Matter.Body.applyForce(bodyA, pointA, force);
            }

            if (bodyB != null) {
              Matter.Body.applyForce(bodyB, pointB, negate(force));
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
          damping = options.damping;

      var pointZero = { x: 0, y: 0 };
      return {
        bodyA: bodyA,
        bodyB: bodyB,
        pointA: pointA || pointZero,
        pointB: pointB || pointZero,
        stiffness: stiffness || 0.5,
        damping: damping || 0.2,
        type: 'spring'
      };
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

/***/ })
/******/ ]);
});