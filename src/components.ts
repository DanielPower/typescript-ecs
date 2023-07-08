import { Component } from "./ecs";

export class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class Size extends Component {
  constructor(public width: number, public height: number) {
    super();
  }
}
