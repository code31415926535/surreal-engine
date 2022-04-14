import { Component, Types } from "ecsy";
import KeyboardInputManager from "../input/keyboardInputManager";

export interface KeyboardInputSchema {
  value: KeyboardInputManager;
}

export default class KeyboardInput extends Component<KeyboardInputSchema> {}

KeyboardInput.schema = {
  value: { type: Types.Ref },
};