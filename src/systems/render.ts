import {Position, Size} from "../components";
import { Pools, System } from "../ecs";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

export class Renderer extends System {
  pools = {
    main: new Set([Position, Size]),
  };
  render(pools: Pools) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const entity of pools.get('main')!) {
      const { x, y } = this.ecs.getComponents(entity).get(Position);
      const { width, height } = this.ecs.getComponents(entity).get(Size);
        ctx.strokeStyle = "red";
        ctx.strokeRect(x, y, width, height);

    }
  }
}
