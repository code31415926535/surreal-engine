import { nanoid } from "nanoid";
import { System } from "tick-knock";

export default class Timer {
  public readonly id;

  constructor(
    public readonly callback: (dispatch: System) => void,
    public readonly interval: number,
    public readonly repeat: boolean
  ) {
    this.id = nanoid();
  }
}