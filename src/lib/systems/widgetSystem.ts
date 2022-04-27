import { createRoot, Root } from 'react-dom/client';
import { Entity, EntitySnapshot, IterativeSystem, Query } from "tick-knock";
import Widget from "../components/widget";
import "../widgets/Widget.css";

export default class WidgetSystem extends IterativeSystem {
  private container: HTMLElement;
  private roots: { [key: string]: Root } = {};

  constructor(containerQuery: string) {
    super(new Query(entity => entity.hasComponent(Widget)));
    this.container = document.querySelector(containerQuery)!;
  }

  protected updateEntity(entity: Entity): void {
    const widget = entity.get(Widget)!;
    if (widget.changed) {
      widget.changed = false;
      this.roots[widget.id].render(widget.root);
    }
  }

  protected entityAdded = ({current}: EntitySnapshot) => {
    const widget = current.get(Widget)!;
    const element = document.createElement("div");
    element.id = widget.id;
    element.className = "surreal-engine-widget";
    this.container.appendChild(element);
    this.roots[widget.id] = createRoot(element);
    this.roots[widget.id].render(widget.root);
  }

  protected entityRemoved = ({current}: EntitySnapshot) => {
    const widget = current.get(Widget)!;
    this.container.removeChild(document.getElementById(widget.id)!);
    delete this.roots[widget.id];
  }
}
