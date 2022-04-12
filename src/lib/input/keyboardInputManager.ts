export type KeyboardInput = {
  w: boolean;
  s: boolean;
  a: boolean;
  d: boolean;
  space: boolean;
  shift: boolean;
};

export default class KeyboardInputManager {
  public input: KeyboardInput;
  
  constructor() {
    this.input = {
      w: false,
      s: false,
      a: false,
      d: false,
      space: false,
      shift: false,
    };

    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));
  }

  private onKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'w':
      case 'W':
        this.input.w = false;
        break;
      case 's':
      case 'S':
        this.input.s = false;
        break;
      case 'a':
      case 'A':
        this.input.a = false;
        break;
      case 'd':
      case 'D':
        this.input.d = false;
        break;
      case ' ':
        this.input.space = false;
        break;
      case 'Shift':
        this.input.shift = false;
        break;
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'w':
      case 'W':
        this.input.w = true;
        break;
      case 's':
      case 'S':
        this.input.s = true;
        break;
      case 'a':
      case 'A':
        this.input.a = true;
        break;
      case 'd':
      case 'D':
        this.input.d = true;
        break;
      case ' ':
        this.input.space = true;
        break;
      case 'Shift':
        this.input.shift = true;
        break;
    }
  }
}