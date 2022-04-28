export type DebugOptions = {
  grid?: {
    size: number;
  };
  axis?: {
    size: number;
  };
  orbitControls?: boolean;
  wireframe?: boolean;
  skeleton?: boolean;
  boundingBox?: boolean;
}

export const BasicDebug: DebugOptions = {
  grid: {
    size: 100,
  },
  orbitControls: true,
}

export const WireframeDebug: DebugOptions = {
  orbitControls: true,
  wireframe: true,
}

export const MotionDebug: DebugOptions = {
  orbitControls: true,
  skeleton: true,
}