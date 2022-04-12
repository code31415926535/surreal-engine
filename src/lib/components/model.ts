import { Component, Types } from "ecsy";
import { Object3D } from "three";

export interface ModelSchema {
  obj: Object3D,
}

export default class Model extends Component<ModelSchema> {}

Model.schema = {
  obj: { type: Types.Ref }
};
