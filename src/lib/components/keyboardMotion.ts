import KeyboardInputManager from "../controllers/keyboardInputController";

export default class KeyboardMotion {
  constructor(
    public value: KeyboardInputManager,
    public speed: number = 1,
    public rotation: number = 1,
  ) {}
}