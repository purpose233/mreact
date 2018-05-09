import {Vnode} from './vnode';

//   h(
//   	 "div",
//   	 { className: "test" },
//   	 h("span", { style: test }, "测试"),
//   	 h(App)
//   )
export function createElement (type, props, ...children) {
  if (type && type.constructor.name === 'Vnode') {
    return type;
  }

  let vnodeChildren = [], simple, lastSimple = false;
  if (props && props.children) {
    if (Array.isArray(props.children)) {
      children.push(...props.children);
    } else {
      children.push(props.children);
    }
    delete props.children;
  }

  for (let child of children) {
    if (typeof child === 'boolean' || child === null) {
      continue;
    }

    simple = typeof child === 'number' || typeof child === 'string';

    // typeof type !== 'function' ?
    if (simple && lastSimple) {
      vnodeChildren[vnodeChildren.length - 1] += String(child);
    } else {
      vnodeChildren.push(child);
    }

    lastSimple = simple;
  }

  console.log(arguments, typeof type);

  return new Vnode(type, props, vnodeChildren);
}
