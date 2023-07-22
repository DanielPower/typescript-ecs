import { ComponentContainer, Component } from "./components";

type Entity = number;
type Pool = Set<Component>;

export interface System<Pools extends { [key: string]: Pool }> {
  pools: Pools;
  update: (
    ecs: ECS<System<Pools>>,
    pools: { [key in keyof Pools]: Set<Entity> },
    dt: number,
  ) => void;
  render: (
    ecs: ECS<System<Pools>>,
    pools: { [key in keyof Pools]: Set<Entity> },
  ) => void;
}

type ECS<Systems> = {
  entities: Map<Entity, ComponentContainer>;
  systems: Systems;
  nextEntityId: number;
  entitiesToRemove: Set<Entity>;
  addEntity: (components?: ComponentContainer) => Entity;
  removeEntity: (entity: Entity) => void;
  getComponents: (entity: Entity) => ComponentContainer;
  update: (dt: number) => void;
  render: () => void;
};

export const createEcs = <Systems>(systems: Systems): ECS<Systems> => {
  const ecs = {
    entities: new Map<Entity, ComponentContainer>(),
    systems,
    nextEntityId: 0 as Entity,
    entitiesToRemove: new Set<Entity>(),
    addEntity: (components: ComponentContainer = {}) => {
      const id = ecs.nextEntityId++;
      ecs.entities.set(id, components);
      return id;
    },
    removeEntity: (entity: Entity) => {
      ecs.entitiesToRemove.add(entity);
    },
    getComponents: (entity: Entity) => {
      if (!ecs.entities.has(entity)) {
        throw new Error(`Entity ${entity} does not exist`);
      }
      return ecs.entities.get(entity)!;
    },
    update: (dt: number) => {
      // for (const system of ecs.systems) {
      //   system.update(ecs, system.pools, dt);
      // }
    },
    render: () => {
      // for (const system of ecs.systems)) {
      //   system.render(ecs, system.pools);
      // }
    },
  };
  return ecs;
};

export const createSystem = <Pools extends { [key: string]: Pool }>({
  pools,
  update,
  render,
}: {
  pools: Pools;
  update?: (
    ecs: ECS<System<Pools>>,
    pools: { [key in keyof Pools]: Set<Entity> },
    dt: number,
  ) => void;
  render?: (
    ecs: ECS<System<Pools>>,
    pools: { [key in keyof Pools]: Set<Entity> },
  ) => void;
}): System<Pools> => {
  return {
    pools,
    update: update ?? (() => {}),
    render: render ?? (() => {}),
  };
};
