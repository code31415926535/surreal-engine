import { CurvePath, Vector3 } from "three";

export default class StaticMotion {
  constructor(
    public path: CurvePath<Vector3>,
    public duration: number,
    public loop: boolean,
    public pos: Vector3,
    public current: number = 0,
  ) {}
}
