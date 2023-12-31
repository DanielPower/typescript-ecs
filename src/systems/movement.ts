import { Component } from "../components.ts";
import { createSystem } from "../ecs.ts";

export const Movement = createSystem({
  pools: {
    main: new Set([Component.Position, Component.Velocity]),
  },
  update: (ecs, pools, dt) => {
    for (const entity of pools.main) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const position = ecs.getComponents(entity)[Component.Position]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const velocity = ecs.getComponents(entity)[Component.Velocity]!;
      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    }
  },
});
