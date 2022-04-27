export type DebugOptions = {
  grid?: {
    size: number;
  };
  axis?: {
    size: number;
  };
  orbitControls?: boolean;
}

export const EditOptions: DebugOptions = {
  grid: {
    size: 100,
  },
  orbitControls: true,
}