import { AnimationClip, AnimationMixer, LoopOnce } from "three";
import { Entity } from "tick-knock";
import Model from "../model";
import type {
  AnimationState, AnimationEventHandler, AnimationStateTransition, AnimationStateOptions,
} from "./types";

export default class Animation {
  public readonly mixer: AnimationMixer;
  public currentState: string;
  public readonly states: { [key: string]: AnimationState } = {};

  constructor(target: Entity) {
    if (!target.has(Model)) {
      throw new Error('Entity must have a Model component to animate');
    }
    this.mixer = new AnimationMixer(target.get(Model)!.mesh);
    this.currentState = '';
  }

  public addState(name: string, clip: AnimationClip, handler: AnimationEventHandler, opts?: AnimationStateOptions) {
    const action = this.mixer.clipAction(clip);
    if (opts && opts.noLoop) {
      action.setLoop(LoopOnce, 0);
    }
    this.states[name] = {
      name,
      clip,
      action,
      handler,
    };
  }

  public handle(action: string) {
    const state = this.states[this.currentState];
    if (!state) {
      return;
    }
    state.handler(action, state, (next, transition) => {
      transition(state, this.states[next]);
      this.setState(next);
    });
  };

  public setState(name: string) {
    if (this.currentState === name) {
      return;
    }
    const state = this.states[name];
    if (!state) {
      throw new Error(`No state named ${name}`);
    }
    this.currentState = name;
    state.action.play();
  }
}

export { AnimationState, AnimationEventHandler, AnimationStateTransition, AnimationStateOptions };
export { CrossFadeTransition, InstantTransition } from './transitions';
