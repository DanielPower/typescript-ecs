import { Component } from "../components.ts";
import { createSystem } from "../ecs.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

export const Render = createSystem({
  pools: {
    main: new Set([Component.Position, Component.Size]),
  },
  render(ecs, pools) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const entity of pools.main) {
      const components = ecs.getComponents(entity);
      const { x, y } = components[Component.Position]!;
      const { x: width, y: height } = components[Component.Size]!;
      ctx.strokeStyle = "red";
      ctx.strokeRect(x, y, width, height);
    }
  },
});
