import { Component } from "../components.ts";
import { createSystem } from "../ecs.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Could not get canvas context");
}

export const Render = createSystem({
  pools: {
    main: new Set([Component.Position, Component.Size]),
  },
  render(ecs, pools) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const entity of pools.main) {
      const components = ecs.getComponents(entity);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { x, y } = components[Component.Position]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { x: width, y: height } = components[Component.Size]!;
      ctx.strokeStyle = "red";
      ctx.strokeRect(x, y, width, height);
    }
  },
});
