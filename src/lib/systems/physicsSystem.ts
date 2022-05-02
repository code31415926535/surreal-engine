import { EntitySnapshot, Query, ReactionSystem } from 'tick-knock';
import Body from "../components/body";
import Ammo from "ammojs-typed";
import { Vector3 } from 'three';

export default class PhysicsSystem extends ReactionSystem {
  private collisionConfiguration: Ammo.btDefaultCollisionConfiguration;
  private dispatcher: Ammo.btCollisionDispatcher;
  private broadphase: Ammo.btDbvtBroadphase;
  private solver: Ammo.btSequentialImpulseConstraintSolver;
  private physicsWorld: Ammo.btDiscreteDynamicsWorld;

  constructor(gravity: Vector3) {
    super(new Query(entity => entity.hasComponent(Body)));
    this.collisionConfiguration = new window.Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new window.Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new window.Ammo.btDbvtBroadphase();
    this.solver = new window.Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new window.Ammo.btDiscreteDynamicsWorld(
        this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
    this.physicsWorld.setGravity(new window.Ammo.btVector3(gravity.x, gravity.y, gravity.z));
  }

  /**
   * Applies a force vector to a body. The force vector is applied at the center of mass.
   * @param body The body to apply the force to.
   * @param x The x component of the force vector.
   * @param y The y component of the force vector.
   * @param z The z component of the force vector.
   */
  public applyForce(body: Ammo.btRigidBody, x: number, y: number, z: number): void {
    const force = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.applyCentralForce(force);
    window.Ammo.destroy(force);
  }

  /**
   * Applies a linear velocity to a body. The velocity vector is applied at the center of mass.
   * @param body The body to apply the velocity to.
   * @param x The x component of the velocity vector.
   * @param y The y component of the velocity vector.
   * @param z The z component of the velocity vector.
   */
  public moveBody(body: Ammo.btRigidBody, x: number, y: number, z: number): void {
    const velocity = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.setLinearVelocity(velocity);
    window.Ammo.destroy(velocity);
  }

  /**
   * Rotates a body by a vector.
   * @param body The body to rotate.
   * @param x The x component of the rotation vector.
   * @param y The y component of the rotation vector.
   * @param z The z component of the rotation vector.
   */
  public rotateBody(body: Ammo.btRigidBody, x: number, y: number, z: number): void {
    const rotation = new window.Ammo.btVector3(x, y, z);
    body.activate();
    body.setAngularVelocity(rotation);
    window.Ammo.destroy(rotation);
  }

  public update(delta: number): void {
    this.physicsWorld.stepSimulation(delta, 10);
  }

  protected entityAdded = ({current}: EntitySnapshot) => {
    this.physicsWorld.addRigidBody(current.get(Body)!.body);
  }
}