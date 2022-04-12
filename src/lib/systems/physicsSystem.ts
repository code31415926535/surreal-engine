import { System } from "ecsy";
import Body, { BodySchema } from "../components/body";
import AmmoType from "ammojs-typed";

export default class PhysicsSystem extends System {
  private collisionConfiguration!: AmmoType.btDefaultCollisionConfiguration;
  private dispatcher!: AmmoType.btCollisionDispatcher;
  private broadphase!: AmmoType.btDbvtBroadphase;
  private solver!: AmmoType.btSequentialImpulseConstraintSolver;
  private physicsWorld!: AmmoType.btDiscreteDynamicsWorld;

  init() {
    this.collisionConfiguration = new window.Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new window.Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new window.Ammo.btDbvtBroadphase();
    this.solver = new window.Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new window.Ammo.btDiscreteDynamicsWorld(
        this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
    this.physicsWorld.setGravity(new window.Ammo.btVector3(0, -0.98, 0));
  }

  execute(delta: number): void {
    const added = this.queries.body.added!;
    for (const body of added) {
      const bodyComponent = body.getComponent(Body)! as any as BodySchema;
      this.physicsWorld.addRigidBody(bodyComponent.obj);
    }
    this.physicsWorld.stepSimulation(delta, 10);
  }
}

PhysicsSystem.queries = {
  body: {
    components: [ Body ],
    listen: {
      added: true,
    }
  }
}