import { Engine as ECSEngine, Entity } from "tick-knock";
import Widget from "../components/widget";

export default class EntityManager {
  constructor(private ecs: ECSEngine) {}

  public is(id: number): boolean {
    const entity = this.ecs.getEntityById(id);
    return entity !== undefined;
  }

  public remove(id: number) {
    const entity = this.ecs.getEntityById(id);
    if (! entity) {
      return;
    }
    this.ecs.removeEntity(entity);
  }

  public get(id: number): Entity | undefined {
    return this.ecs.getEntityById(id);
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