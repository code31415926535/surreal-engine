import { Engine as ECSEngine } from "tick-knock";
import Widget from "../components/widget";

export default class EntityManager {
  constructor(private ecs: ECSEngine) {}

  public remove(id: number) {
    const entity = this.ecs.getEntityById(id);
    if (! entity) {
      return;
    }
    this.ecs.removeEntity(entity);
  }

   public updateWidget(id: number, elem: JSX.Element) {
    const entity = this.ecs.getEntityById(id);
    if (! entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    const widget = entity.get(Widget)!;
    widget.root = elem;
    entity.addComponent(widget);
  }
}