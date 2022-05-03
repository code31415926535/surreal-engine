import { AnimationState, AnimationStateTransition } from "./types";

export const CrossFadeTransition = (duration: number): AnimationStateTransition => {
  return (from: AnimationState, to: AnimationState) => {
    to.action.enabled = true;
    to.action.time = 0;
    to.action.setEffectiveTimeScale(1);
    to.action.setEffectiveWeight(1);
    to.action.crossFadeFrom(from.action, duration, true);
  };
};

export const InstantTransition = (): AnimationStateTransition => {
  return (from: AnimationState, to: AnimationState) => {
    from.action.stop();
    to.action.enabled = true;
    to.action.time = 0;
    to.action.setEffectiveTimeScale(1);
    to.action.setEffectiveWeight(1);
    to.action.play();
  };
}