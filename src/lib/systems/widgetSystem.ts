import React from "react";
import ReactDOM from "react-dom";
import { EntitySnapshot, Query, ReactionSystem } from "tick-knock";
import Widget from "../components/widget";
import RootWidget from "../widgets/rootWidget";
import "../widgets/widget.css";

export default class WidgetSystem extends ReactionSystem {
  private container: HTMLElement;

  constructor(containerQuery: string) {
    super(new Query(entity => entity.hasComponent(Widget)));
    this.container = document.querySelector(containerQuery)!;
    const element = document.createElement("div");
    element.className = "surreal-engine-widget-container";
    this.container.appendChild(element);
    ReactDOM.render(React.createElement(RootWidget, null, []), element);
  }

  // TODO: Make the widget system work nicely. Shouldn't be that hard
  protected entityAdded = ({current}: EntitySnapshot) => {
  }

  protected entityRemoved = ({current}: EntitySnapshot) => {
    // const widget = current.get(Widget)!;
    // this.container.removeChild(document.getElementById(widget.id)!);
    // delete this.roots[widget.id];
  }
}
