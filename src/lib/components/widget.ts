import BaseWidget from "../widgets/baseWidget";

export default class Widget {
  constructor(public id: string, public root: BaseWidget) {}
}