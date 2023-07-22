import { ComponentContainer, Component } from "./components";

type Entity = number;
type Pool = Set<Component>;

export type System<Pools extends { [key: string]: Pool }> = {
  pools: Pools;
  update: (
    ecs: ECS,
    pools: { [key in keyof Pools]: Set<Entity> },
    dt: number,
  ) => void;
  render: (ecs: ECS, pools: { [key in keyof Pools]: Set<Entity> }) => void;
};

type ECS = {
  entities: Map<Entity, ComponentContainer>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  systems: System<any>[];
  nextEntityId: number;
  entitiesToRemove: Set<Entity>;
  addEntity: (components?: ComponentContainer) => Entity;
  removeEntity: (entity: Entity) => void;
  getComponents: (entity: Entity) => ComponentContainer;
  update: (dt: number) => void;
  render: () => void;
};

const getEntitiesWithComponents = (ecs: ECS, pool: Pool) => {
  const entities = new Set<Entity>();
  for (const [entity, components] of ecs.entities) {
    let hasComponents = true;
    for (const component of pool) {
      if (!(component in components)) {
        hasComponents = false;
        break;
      }
    }
    if (hasComponents) {
      entities.add(entity);
    }
  }
  return entities;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createEcs = (systems: System<any>[]): ECS => {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return ecs.entities.get(entity)!;
    },
    update: (dt: number) => {
      // TODO cache pooledEntities
      // TODO implement removeEntity
      for (const system of ecs.systems) {
        const pooledEntities = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Object.entries(system.pools).map(([poolKey, pool]) => [
            poolKey,
            getEntitiesWithComponents(ecs, pool as Pool),
          ]),
        );
        system.update(ecs, pooledEntities, dt);
      }
    },
    render: () => {
      for (const system of ecs.systems) {
        const pooledEntities = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Object.entries(system.pools).map(([poolKey, pool]) => [
            poolKey,
            getEntitiesWithComponents(ecs, pool as Pool),
          ]),
        );
        system.render(ecs, pooledEntities);
      }
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
    ecs: ECS,
    pools: { [key in keyof Pools]: Set<Entity> },
    dt: number,
  ) => void;
  render?: (ecs: ECS, pools: { [key in keyof Pools]: Set<Entity> }) => void;
}): System<Pools> => {
  return {
    pools,
    update: update ?? (() => {}),
    render: render ?? (() => {}),
  };
};
