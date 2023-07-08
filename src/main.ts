import {Position, Size} from "./components";
import {ECS} from "./ecs";
import {Renderer} from "./systems/render";

const ecs = new ECS();
ecs.addEntity([
    new Position(5, 5),
    new Size(10, 10),
]);
ecs.addEntity([
    new Position(3, 5),
    new Size(20, 10),
]);
ecs.addSystem(new Renderer(ecs));

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
