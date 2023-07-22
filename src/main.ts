import { Component } from "./components.ts";
import {Movement} from "./systems/movement.ts";
import { createEcs } from "./ecs.ts";

const ecs = createEcs([
  Movement,
]);

ecs.addEntity({
  [Component.Position]: { x: 5, y: 5 },
  [Component.Size]: { x: 10, y: 10 },
});
ecs.addEntity({
  [Component.Position]: { x: 3, y: 5 },
  [Component.Size]: { x: 20, y: 10 },
  [Component.Velocity]: { x: 0.5, y: 0.2 },
});

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
