import { AnimationAction, AnimationClip } from "three";

export type AnimationState = {
  name: string;
  clip: AnimationClip;
  action: AnimationAction;
  handler: AnimationEventHandler;
}

export interface AnimationStateOptions {
  noLoop?: boolean;
}

export type AnimationStateTransition = (prevState: AnimationState, nextState: AnimationState) => void;

export type AnimationEventHandler = (
  action: string,
  state: AnimationState,
  setState: (next: string, transtion: AnimationStateTransition) => void,
) => void;
