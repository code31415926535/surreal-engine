export abstract class State<T> {
  public name: string;

  constructor(public data: T, name: string) {
    this.name = name;
  }
  abstract enter: (prevState: State<T> | null) => void;
  abstract exit: () => void;
  abstract update: (fsm: FiniteStateMachine<T>) => void;
}

type StateConstructor<T> = new (data: T, name: string) => State<T>;

export default class FiniteStateMachine<T> {
  private states: { [key: string]: StateConstructor<T> };
  public currentState: State<T> | null;

  constructor(private data: T) {
    this.states = {};
    this.currentState = null;
  }

  public addState(name: string, state: StateConstructor<T>): void {
    this.states[name] = state;
  }

  public setState(name: string): void {
    const prevState = this.currentState;
    if (prevState) {
      if (prevState.name === name) {
        return;
      }
      prevState.exit();
    }

    const state = new this.states[name](this.data, name);
    this.currentState = state;
    state.enter(prevState);
  }

  public update(): void {
    if (this.currentState) {
      this.currentState.update(this);
    }
  }
}