import {Position, Size} from "../components";
import { Pools, System } from "../ecs";

export class Renderer extends System {
  pools = {
    main: new Set([Position, Size]),
  };
  render(pools: Pools) {
    console.log(pools);
  }
}
