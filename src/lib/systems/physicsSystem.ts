import { Attributes, System } from "ecsy";
import Body, { BodySchema } from "../components/body";
import AmmoType from "ammojs-typed";

export default class PhysicsSystem extends System {
  private collisionConfiguration!: AmmoType.btDefaultCollisionConfiguration;
  private dispatcher!: AmmoType.btCollisionDispatcher;
  private broadphase!: AmmoType.btDbvtBroadphase;
  private solver!: AmmoType.btSequentialImpulseConstraintSolver;
  private physicsWorld!: AmmoType.btDiscreteDynamicsWorld;

  applyForce(body: AmmoType.btRigidBody, x: number, y: number, z: number): void {
    const force = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.applyCentralForce(force);
    window.Ammo.destroy(force);
  }

  moveBody(body: AmmoType.btRigidBody, x: number, y: number, z: number): void {
    const velocity = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.setLinearVelocity(velocity);
    window.Ammo.destroy(velocity);
  }

  rotateBody(body: AmmoType.btRigidBody, x: number, y: number, z: number): void {
    const rotation = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.setAngularVelocity(rotation);
    window.Ammo.destroy(rotation);
  }

  init(attributes: Attributes) {
    this.collisionConfiguration = new window.Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new window.Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new window.Ammo.btDbvtBroadphase();
    this.solver = new window.Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new window.Ammo.btDiscreteDynamicsWorld(
        this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
    this.physicsWorld.setGravity(new window.Ammo.btVector3(attributes.gravity.x, attributes.gravity.y, attributes.gravity.z));
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