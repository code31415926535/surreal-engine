import AnimationSystem, { SurrealAnimationEvent } from './animationSystem';
import DebugSystem from './debugSystem';
import FollowCameraSystem from './followCameraSystem';
import FpsSystem from './fpsSystem';
import KeyboardInputSystem, { KeyboardStateChangeEvent } from './keyboardInputSystem';
import KeyboardMovementSystem from './keyboardMovementSystem';
import PhysicsRendererSyncSystem from './physicsRendererSyncSystem';
import PhysicsSystem from './physicsSystem';
import RenderSystem, { CameraChangedEvent } from './renderSystem';
import StaticMotionSystem from './staticMotionSystem';
import WidgetSystem from './widgetSystem';
import TimerSystem from './timerSystem';

export {
  AnimationSystem, SurrealAnimationEvent,
  DebugSystem,
  FollowCameraSystem,
  FpsSystem,
  KeyboardMovementSystem,
  KeyboardInputSystem, KeyboardStateChangeEvent,
  PhysicsRendererSyncSystem,
  PhysicsSystem,
  RenderSystem, CameraChangedEvent,
  StaticMotionSystem,
  WidgetSystem,
  TimerSystem,
};

export { IterativeSystem, ReactionSystem } from 'tick-knock';
export { default as SingleEntitySystem } from './singleEntitySystem';

// export type SurrealSystemConstructor;