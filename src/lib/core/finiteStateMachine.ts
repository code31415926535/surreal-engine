export abstract class State<T> {
  public name: string;

  constructor(public data: T, name: string) {
    this.name = name;
  }
  abstract enter: (prevState: State<T> | null) => void;
  abstract update: (fsm: FiniteStateMachine<T>, delta: number) => void;
}

export default class FiniteStateMachine<T> {
  private states: { [key: string]: State<T> };
  public currentState: State<T> | null;

  constructor() {
    this.states = {};
    this.currentState = null;
  }

  public addState(name: string, state: State<T>): void {
    this.states[name] = state;
  }

  public setState(name: string): void {
    const prevState = this.currentState;
    if (prevState) {
      if (prevState.name === name) {
        return;
      }
    }

    this.currentState = this.states[name];
    this.currentState.enter(prevState);
  }

  public update(delta: number): void {
    if (this.currentState) {
      this.currentState.update(this, delta);
    }
  }
}