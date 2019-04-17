// export class Vnode {
//   type: string | null;
//   props: any;
//   children: ComponentChild[];
//   _text?: string;
//   _dom?: Element;
// }

export type ComponentChild = Vnode | object | string
  | number | boolean | null | undefined;

export class Vnode {
  type: string;
  props: any;
  children: Vnode[];
  text: string;
  dom: Node;

  constructor(type: string | null, props: any,
              children: Vnode[], text?: string) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.text = text;
  }
}
