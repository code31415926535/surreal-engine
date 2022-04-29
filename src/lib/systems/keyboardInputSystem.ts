import { System } from "tick-knock";

export class KeyboardStateChangeEvent {
  constructor(public readonly keys: { [key: string]: boolean }) {}
}

export default class KeyboardInputSystem extends System {
  public input: { [key: string]: boolean };
  
  constructor() {
    super();
    this.input = {};

    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));
  }

  private onKeyUp = (event: KeyboardEvent) => {
    this.input[event.key] = false;
    this.dispatch(new KeyboardStateChangeEvent(this.input));
  }

  private onKeyDown = (event: KeyboardEvent) => {
    this.input[event.key] = true;
    this.dispatch(new KeyboardStateChangeEvent(this.input));
  }
}