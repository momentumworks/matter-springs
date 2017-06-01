

<!-- Start index.js -->

## MatterSprings

Springs plugin for Matter JS

## create({})

Creates a new spring.
All properties are optional.
See the properties section below for detailed information on what you can pass via the `options` object.

### Params:

* *{}* options

### Return:

* **spring** spring

An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.

### Properties:

* **** *id* 

A `String` denoting the type of object.

### Properties:

* **** *type* 

The first possible `Body` that this spring is attached to.

### Properties:

* **** *bodyA* 

The second possible `Body` that this spring is attached to.

### Properties:

* **** *bodyB* 

A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, otherwise a world-space position.

### Properties:

* **** *pointA* 

A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, otherwise a world-space position.

### Properties:

* **** *pointB* 

A `Number` that specifies the stiffness of the spring

### Properties:

* **** *stiffness* 

A `Number` that specifies the damping applied to the spring

### Properties:

* **** *damping* 

A `Number` that specifies the length of the spring 

### Properties:

* **** *length* 

<!-- End index.js -->

<!-- Start webpack.config.js -->

<!-- End webpack.config.js -->

