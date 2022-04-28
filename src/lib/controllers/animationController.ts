import { Entity } from 'tick-knock';
import { AnimationAction, AnimationClip, AnimationMixer } from "three";
import Model from '../components/model';

type Animations = {
  [key: string]: {
    action: AnimationAction;
    clip: AnimationClip;
  }
}

export default class AnimationController {
  private mixer: AnimationMixer;
  private animations: Animations = {};
  private prevAnimation: AnimationAction | null = null;

  constructor(target: Entity) {
    if (!target.has(Model)) {
      throw new Error('Entity must have a Model component to animate');
    }
    this.mixer = new AnimationMixer(target.get(Model)!.mesh);
  }

  public addAnimation(name: string, clip: AnimationClip): AnimationController {
    this.animations[name] = {
      action: this.mixer.clipAction(clip),
      clip,
    };
    return this;
  }

  public play(name: string) {
    const { action } = this.animations[name];
    action.time = 0.0;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.enabled = true;
    if (this.prevAnimation) {
      this.prevAnimation.crossFadeTo(action, 0.5, true);
    }
    action.play();
    this.prevAnimation = action;
  }

  update(delta: number): void {
    this.mixer.update(delta * 0.001);
  }
}