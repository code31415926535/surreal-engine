import { AnimationAction, AnimationClip, AnimationMixer } from "three";
import { Entity } from "tick-knock";
import Model from "./model";

type Animations = {
  [key: string]: {
    action: AnimationAction;
    clip: AnimationClip;
  }
}

// TODO: Make a finite state mahine for this
export default class Animation {
  public readonly animations: Animations = {};
  public prevAnimation: AnimationAction | undefined;
  public readonly mixer: AnimationMixer;

  constructor(target: Entity) {
    if (!target.has(Model)) {
      throw new Error('Entity must have a Model component to animate');
    }
    this.mixer = new AnimationMixer(target.get(Model)!.mesh);
    this.prevAnimation = undefined;
  }

  public addAnimation(name: string, clip: AnimationClip): void {
    this.animations[name] = {
      action: this.mixer.clipAction(clip),
      clip,
    };
  }
}