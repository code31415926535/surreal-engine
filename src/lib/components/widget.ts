// TODO: Generic class that implements change tracking
export default class Widget {
  public changed = false;

  constructor(private _id: string, private _root: JSX.Element) {}

  public get id(): string {
    return this._id;
  }

  public get root(): JSX.Element {
    return this._root;
  }

  public set id(id: string) {
    this._id = id;
    this.changed = true;
  }

  public set root(root: JSX.Element) {
    this._root = root;
    this.changed = true;
  }
}