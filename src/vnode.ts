import {Component} from "./component";

export type ComponentChild = Vnode | object | string
  | number | boolean | null | undefined;

// TODO: set _text and _dom to private
export class Vnode {
  // TODO: how to present the derived class of Component?
  type: string | any;
  // props contains children
  props: any;
  // children: Vnode[];
  _text: string;
  _dom: Node;
  _component: Component;

  constructor(type: string | null, props: any, text?: string) {
    this.type = type;
    this.props = props;
    this._text = text;
  }
}
