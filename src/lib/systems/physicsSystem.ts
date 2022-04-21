import { Attributes, System } from "ecsy";
import Body, { BodySchema } from "../components/body";
import Ammo from "ammojs-typed";

export default class PhysicsSystem extends System {
  private collisionConfiguration!: Ammo.btDefaultCollisionConfiguration;
  private dispatcher!: Ammo.btCollisionDispatcher;
  private broadphase!: Ammo.btDbvtBroadphase;
  private solver!: Ammo.btSequentialImpulseConstraintSolver;
  private physicsWorld!: Ammo.btDiscreteDynamicsWorld;

  public applyForce(body: Ammo.btRigidBody, x: number, y: number, z: number): void {
    const force = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.applyCentralForce(force);
    window.Ammo.destroy(force);
  }

  public moveBody(body: Ammo.btRigidBody, x: number, y: number, z: number): void {
    const velocity = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.setLinearVelocity(velocity);
    window.Ammo.destroy(velocity);
  }

  public rotateBody(body: Ammo.btRigidBody, x: number, y: number, z: number): void {
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