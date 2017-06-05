# matter-springs

> A DHO springs plugin for [matter.js](https://github.com/liabru/matter-js/)

This plugin allows you to add Damped Harmonic Oscillator (DHO) springs to your project

## Install

Get the [matter-springs.js](build/matter-springs.js) file directly

### Dependencies

- [matter.js](https://github.com/liabru/matter-js/)

## Usage

```js
Matter.use('matter-springs');
// or
Matter.use(MatterSprings);
```

See [Using Plugins](https://github.com/liabru/matter-js/wiki/Using-plugins#using-plugins) for more information.

#### Basic usage

```js
const circle = Bodies.circle(400, 300, 30, {density: 0.005});
World.add(world, circle);

world.plugin.springs = [
  Spring.create({
    bodyA: circle, 
    pointB: {x: 200, y: 200}, 
    stiffness: 0.5, 
    damping: 1
  })
]
```

## Documentation

See the [API docs](API.md).