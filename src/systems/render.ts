import Two from "two.js";
import { Component } from "../components.ts";
import { createSystem } from "../ecs.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const two = new Two({
  type: Two.Types.webgl,
  domElement: canvas,
});

export const Render = createSystem({
  pools: {
    main: new Set([Component.Position, Component.Size]),
  },
  render(ecs, pools) {
    two.clear();
    for (const entity of pools.main) {
      const components = ecs.getComponents(entity);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { x, y } = components[Component.Position]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { x: width, y: height } = components[Component.Size]!;
      const circle = two.makeCircle(x, y, width);
      circle.stroke = "orangered";
      circle.fill = "#FF8000";
      circle.linewidth = 5;
    }
    two.update();
  },
});
