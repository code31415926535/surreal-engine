import { Entity } from 'tick-knock';
import { AnimationAction, AnimationClip, AnimationMixer } from "three";
import Model from '../components/model';
import FiniteStateMachine, { State } from '../core/finiteStateMachine';

type Animations = {
  [key: string]: {
    action: AnimationAction;
    clip: AnimationClip;
  }
}

type AnimationStateData = {
  animations: Animations;
}

// TODO: Callback system
class RepeatAnimationState extends State<AnimationStateData> {
  enter = (prevState: State<AnimationStateData> | null) => {
    const action = this.data.animations[this.name].action;
    action.enabled = true;
    if (prevState) {
      const prevAction = prevState.data.animations[prevState.name].action;
      action.time = 0.0;
      action.setEffectiveTimeScale(1.0);
      action.setEffectiveWeight(1.0);
      // TODO: Conditional crossfade
      action.crossFadeFrom(prevAction, 0.5, true);
    }
    action.play();
  }

  update = () => {}
}

export default class AnimationController {
  private mixer: AnimationMixer;
  private fsm: FiniteStateMachine<AnimationStateData>;
  private animations: Animations = {};

  constructor(target: Entity) {
    this.mixer = new AnimationMixer(target.get(Model)!.mesh);
    this.fsm = new FiniteStateMachine<AnimationStateData>();
  }

  public addAnimation(name: string, clip: AnimationClip): AnimationController {
    this.animations[name] = {
      action: this.mixer.clipAction(clip),
      clip,
    };
    this.fsm.addState(name, new RepeatAnimationState({
      animations: this.animations,
    }, name));
    return this;
  }

  public setState(name: string): AnimationController {
    this.fsm.setState(name);
    return this;
  }

  update(timeElapsed: number): void {
    this.mixer.update(timeElapsed);
    this.fsm.update(timeElapsed);
  }
}