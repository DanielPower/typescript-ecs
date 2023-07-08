// Based on an ECS by Maxwell Forbes
// https://maxwellforbes.com/posts/typescript-ecs-implementation
export abstract class Component {}
export type Entity = number;
export type Pools = Map<string, Set<Entity>>;

export abstract class System {
  public constructor(ecs: ECS) {
    this.ecs = ecs;
  }
  public abstract pools: { [key: string]: Set<Function> };
  public update(_pools: Pools, _dt: number): void {}
  public render(_pools: Pools): void {}
  public ecs: ECS;
}

type ComponentClass<T extends Component> = new (...args: any[]) => T

export class ComponentContainer {
  private map = new Map<Function, Component>();

  public add(component: Component): void {
    this.map.set(component.constructor, component);
  }

  public get<T extends Component>(
      componentClass: ComponentClass<T>
  ): T {
    return this.map.get(componentClass) as T;
  }

  public hasAll(componentClasses: Iterable<Function>): boolean {
    for (let cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false;
      }
    }
    return true;
  }

  public delete(componentClass: Function): void {
    this.map.delete(componentClass);
  }
}

export class ECS {
  private entities = new Map<Entity, ComponentContainer>();
  private systems = new Map<System, Map<string, Set<Entity>>>();
  private nextEntityID = 0;
  private entitiesToDestroy = new Array<Entity>();

  public addEntity(components?: Component[]): Entity {
    let entity = this.nextEntityID++;
    this.entities.set(entity, new ComponentContainer());
    if (components) {
        for (const component of components) {
            this.addComponent(entity, component);
        }
    }
    return entity;
  }

  public removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  public addComponent(entity: Entity, component: Component): void {
    this.entities.get(entity)!.add(component);
    this.checkE(entity);
  }

  public getComponents(entity: Entity): ComponentContainer {
    return this.entities.get(entity)!;
  }

  public removeComponent(entity: Entity, componentClass: Function): void {
    this.entities.get(entity)!.delete(componentClass);
    this.checkE(entity);
  }

  public addSystem(system: System): void {
    const map = new Map<string, Set<Entity>>();
    for (const pool of Object.keys(system.pools)) {
      map.set(pool, new Set());
    }
    this.systems.set(system, map);
    for (const entity of this.entities.keys()) {
      this.checkES(entity, system);
    }
  }

  public checkE(entity: Entity): void {
    for (const system of this.systems.keys()) {
      this.checkES(entity, system);
    }
  }

  private checkES(entity: Entity, system: System): void {
    const components = this.entities.get(entity)!;
    for (const [poolKey, pool] of Object.entries(system.pools)) {
      if (components.hasAll(pool)) {
        // should be in system
        this.systems.get(system)!.get(poolKey)!.add(entity); // no-op if in
      } else {
        // should not be in system
        this.systems.get(system)!.get(poolKey)!.delete(entity); // no-op if out
      }
    }
  }

  public update(dt: number): void {
    for (let [system, pools] of this.systems.entries()) {
      system.update(pools, dt);
    }
    let entity;
    while ((entity = this.entitiesToDestroy.pop())) {
      this.entities.delete(entity);
      for (const pools of this.systems.values()) {
        for (const [, pool] of pools) {
          pool.delete(entity);
        }
      }
    }
  }

  public render(): void {
    for (let [system, entities] of this.systems.entries()) {
      system.render(entities);
    }
  }
}