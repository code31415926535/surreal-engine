import { Component, Types } from "ecsy";
import KeyboardInputManager from "../controllers/keyboardInputController";

export interface KeyboardMotionSchema {
  value: KeyboardInputManager;
  speed: number;
  rotation: number;
}

export default class KeyboardMotion extends Component<KeyboardMotionSchema> {}

KeyboardMotion.schema = {
  value: { type: Types.Ref },
  speed: { type: Types.Number, default: 1 },
  rotation: { type: Types.Number, default: 1 },
};