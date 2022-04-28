# Surreal Engine (WIP)

[![NPM Package][npm]][npm-url]

A simple typescript game engine.

```sh
npm install --save surreal-engine
```

## Usage

Let's create the simplest scene possible: A falling box. We have to initialize the engine and then, using the
entity creator, create two boxes: one for the ground, and one for the falling box.

```ts
// Create a new instance of the engine with debug on
const engine = new Engine('#root', { debug: true });
// Engine must be initialized before we can start adding components
await engine.init();

// Create an ambient lighting so our objects are visible
engine.creator.ambientLight({
  color: '#ffffff',
  intensity: 0.5,
});

// Create a big white square as our ground
engine.creator.box({
  size: { x: 25, y: 1, z: 25 },
  mass: 0,
  restitution: 0.3,
  material: engine.materials.getMaterial('white'),
  rigid: true,
  receiveShadow: true,
});

// Create a magenta box that will fall down.
engine.creator.box({
  size: { x: 1, y: 1, z: 1 },
  pos: { x: 0, y: 10, z: 0 },
  mass: 0.5,
  restitution: 0.3,
  material: engine.materials.getMaterial('magenta'),
  rigid: true,
  castShadow: true,
});

engine.start();
```

Now, let's add a ball after 1 second has passed.

```ts
setTimeout(() => {
  engine.creator.sphere({
    radius: 1,
    pos: { x: 0, y: 10, z: 0 },
    mass: 0.5,
    restitution: 0.3,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  });
}, 1000);
```

Now, for some fun, let's make our ball more bouncy.

```diff
    mass: 0.5,
-   restitution: 0.3,
+   restitution: 2.5,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
```

We now have a nice bouncy ball, yeeey. This still looks ugly. Notice the **castShadow** and
**receiveShadow** options. Why aren't they working? It's because ambient lights cannot cast
shadows. For that, we need a **directionLight**. So let's do that.

```ts
engine.creator.directionalLight({
  color: '#ffffff',
  intensity: 1,
  pos: { x: -10, y: 10, z: 10 },
  target: { x: 0, y: 0, z: 0 },
  castShadow: true,
  shadowAreaHeight: 10,
  shadowAreaWidth: 10,
});
```

So much better. It would be nice if we could play around with the ball a bit, so let's add
a character!

```ts
engine.creator.box({
  size: { x: 2, y: 2, z: 2 },
  pos: { x: 5, y: 0, z: 5 },
  mass: 0.5,
  restitution: 0.5,
  material: engine.materials.getMaterial('red'),
  rigid: true,
  castShadow: true,
})
  .withKeyboardMotion()
  .withOffsetCamera();
```

Now we have nice red box that we can control. Let's have some more fun. Let's spawn a ball every 5 seconds,
so we never run out of balls.

```diff
- setTimeout(() => {
+ setInterval(() => {
  engine.creator.sphere({
    radius: 1,
    pos: { x: 0, y: 10, z: 0 },
    mass: 0.5,
    restitution: 2.5,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  });
- }, 1000);
+ }, 5000);
```

Now we have quite a fun game already! Come back when `0.3.0` is ready for more cool features.

## Examples

- [Simple Shapes](./examples/1-simple-shapes/index.ts)
- [Lighting and Shadows](./examples/2-lighting-shadows-fog/index.ts)
- [Character Movement](./examples/4-character-movement/index.ts)
- [Camera](./examples/5-camera/index.ts)
- [Textures and Skybox](./examples/6-textures-and-skybox/index.ts)
- [Models and Animation](./examples/7-models-and-animation/index.ts)

[npm]: https://img.shields.io/npm/v/surreal-engine
[npm-url]: https://www.npmjs.com/package/surreal-engine
