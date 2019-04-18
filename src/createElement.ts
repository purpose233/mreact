import {Vnode, ComponentChild} from "./vnode";

export function createElement(type: Vnode | string | null,
                              props: any,
                              ...children: ComponentChild[]): Vnode {
  if (type instanceof Vnode) {
    return type;
  }

  let vnodeChildren: Vnode[] = [];
  let simple: boolean, lastSimple: boolean = false, childText: string = '';
  if (!props) { props = {}; }
  if (props.children) {
    if (Array.isArray(props.children)) {
      children.push(...props.children);
    } else {
      children.push(props.children);
    }
  }

  for (let child of children) {
    if (typeof child === 'boolean' || child == null) {
      continue;
    }

    simple = typeof child === 'number' || typeof child === 'string';

    if (simple) {
      childText += String(child);
    } else {
      if (lastSimple) {
        vnodeChildren.push(new Vnode(null, null, childText));
        childText = '';
      }
      // if not simple node then must be Vnode
      vnodeChildren.push(<Vnode>child);
    }

    lastSimple = simple;
  }
  if (childText !== '') {
    vnodeChildren.push(new Vnode(null, null, childText));
  }

  if (vnodeChildren.length > 0) {
    props.children = vnodeChildren;
  }

  return new Vnode(type, props);
}
