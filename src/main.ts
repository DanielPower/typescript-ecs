import {Position, Size, Velocity} from "./components";
import {ECS} from "./ecs";
import {Renderer} from "./systems/render";
import {Movement} from "./systems/movement.ts";

const ecs = new ECS();
ecs.addEntity([
    new Position(5, 5),
    new Size(10, 10),
]);
ecs.addEntity([
    new Position(3, 5),
    new Size(20, 10),
    new Velocity(0.5, 0.2),
]);
ecs.addSystem(new Renderer(ecs));
ecs.addSystem(new Movement(ecs));

let lastUpdate = Date.now();

const update = () => {
    const time = Date.now();
    ecs.update(time - lastUpdate);
    lastUpdate = time;
    setTimeout(update, 4);
};

const render = () => {
    ecs.render();
    requestAnimationFrame(render);
};

update();
render();
