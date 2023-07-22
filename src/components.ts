export enum Component {
  Position = "position",
  Velocity = "velocity",
  Size = "size",
}

export type ComponentContainer = Partial<{
  [Component.Position]: {
    x: number;
    y: number;
  };
  [Component.Velocity]: {
    x: number;
    y: number;
  };
  [Component.Size]: {
    x: number;
    y: number;
  };
}>;
