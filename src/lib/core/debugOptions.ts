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
  light?: boolean;
}

export const BasicDebug: DebugOptions = {
  grid: {
    size: 100,
  },
  orbitControls: true,
  light: true,
}

export const WireframeDebug: DebugOptions = {
  orbitControls: true,
  wireframe: true,
}

export const MotionDebug: DebugOptions = {
  orbitControls: true,
  skeleton: true,
}

export const LightDebug: DebugOptions = {
  orbitControls: true,
  light: true,
}