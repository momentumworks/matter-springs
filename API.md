

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

## MatterSprings.Spring

### Properties:

* **number** *id* An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.

### Properties:

* **string** *type* A readonly `string` denoting the type of object. (Default `"spring"`)

### Properties:

* **Matter.Body** *bodyA* The first possible `Body` that this spring is attached to. (Default `null`)

### Properties:

* **Matter.Body** *bodyB* The second possible `Body` that this spring is attached to. (Default `null`)

### Properties:

* **Vector** *pointA* A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, 
otherwise a world-space position. (Default `{ x: 0, y: 0 }`)

### Properties:

* **Vector** *pointB* A `Vector` that specifies the offset of the spring from center of the `spring.bodyA` if defined, 
otherwise a world-space position. (Default `{ x: 0, y: 0 }`)

### Properties:

* **number** *stiffness* A `number` that specifies the stiffness of the spring. (Default `0.5`)

### Properties:

* **number** *damping* A `Number` that specifies the damping applied to the spring. (Default `0.2`)

### Properties:

* **number** *length* A `number` that specifies the length of the spring. (Default `0`)

<!-- End index.js -->

<!-- Start webpack.config.js -->

<!-- End webpack.config.js -->

