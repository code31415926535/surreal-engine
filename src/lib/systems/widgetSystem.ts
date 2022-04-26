import { createRoot } from 'react-dom/client';
import { EntitySnapshot, Query, ReactionSystem } from "tick-knock";
import Widget from "../components/widget";
import "../widgets/Widget.css";

export default class WidgetSystem extends ReactionSystem {
  private container: HTMLElement;

  constructor(containerQuery: string) {
    super(new Query(entity => entity.hasComponent(Widget)));
    this.container = document.querySelector(containerQuery)!;
  }

  protected entityAdded = ({current}: EntitySnapshot) => {
    const widget = current.get(Widget)!;
    const element = document.createElement("div");
    element.id = widget.id;
    element.className = "surreal-engine-widget";
    this.container.appendChild(element);
    // TODO: Potential memory leak here
    createRoot(element).render(widget.root);
  }
}
