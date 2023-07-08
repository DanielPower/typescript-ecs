import {Pools, System} from "../ecs.ts";
import {Position, Velocity} from "../components.ts";

export class Movement extends System {
    pools = {
        main: new Set([Position, Velocity]),
    };
    update(pools: Pools, dt: number) {
        for (const entity of pools.get('main')!) {
            const position = this.ecs.getComponents(entity).get(Position);
            const velocity = this.ecs.getComponents(entity).get(Velocity);
            position.x += velocity.dx * dt;
            position.y += velocity.dy * dt;
        }
    }
}