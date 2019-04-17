import {Vnode} from "./vnode";
import {isSameTagName, isValidAttribute, setAttribute} from "./utils";

// TODO: the return value of diff might not be useful
export function diff(parentDom: Node,
                     newVnode: Vnode, oldVnode: Vnode): Node {
  // Note that for newVnode and oldVnode might be equal
  // when vnode represent a component need to rerender.

  let dom = oldVnode ? oldVnode.dom : null, newDom;

  if (newVnode.type == null) {
    if (dom && dom.nodeType === Node.TEXT_NODE) {
      if (newVnode.text !== dom.nodeValue) {
        dom.nodeValue = newVnode.text;
      }
    } else {
      newDom = document.createTextNode(newVnode.text);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(newDom, dom);
      } else {
        parentDom.appendChild(newDom);
      }
      dom = newDom;
    }
    newVnode.dom = dom;
  } else {
    // TODO: class component or function component or fragment

    if (!isSameTagName(dom, newVnode.type)) {
      newDom = document.createElement(newVnode.type);

      if (dom) {
        while (dom.firstChild) {
          newDom.appendChild(dom.firstChild);
        }
      }
      if (dom && dom.parentNode) {
        parentDom.replaceChild(newDom, dom);
      } else {
        parentDom.appendChild(newDom);
      }
      dom = newDom;
    }

    diffChildren(dom, newVnode, oldVnode);
    diffProps(dom, newVnode, oldVnode);
  }

  return dom;
}

export function diffChildren(parentDom: Node,
                             newParentVnode: Vnode, oldParentVnode: Vnode): void {
  let keyedChildren = {}, unkeyedChildren = [];
  if (oldParentVnode && oldParentVnode.children) {
    for (let child of oldParentVnode.children) {
      const key = child.props && child.props.key;
      if (key != null) { keyedChildren[key] = child; }
      else { unkeyedChildren.push(child); }
    }
  }

  if (newParentVnode && newParentVnode.children) {
    for (let child of newParentVnode.children) {
      const key = child.props && child.props.key;
      let oldChild = null;
      if (key != null) {
        oldChild = keyedChildren[key];
        delete keyedChildren[key];
      } else {
        for (let i = 0; i < unkeyedChildren.length; i++) {
          if (isSameTagName(unkeyedChildren[i], child.type)) {
            oldChild = unkeyedChildren[i];
            unkeyedChildren.splice(i, 1);
            break;
          }
        }
      }

      diff(parentDom, child, oldChild);
    }
  }

  for (let key in keyedChildren) {
    parentDom.removeChild(keyedChildren[key]);
  }
  for (let i = 0; i < unkeyedChildren.length; i++) {
    parentDom.removeChild(unkeyedChildren[i]);
  }
}

export function diffProps(dom: Node,
                          newParentVnode: Vnode, oldParentVnode: Vnode): void {
  const newProps = newParentVnode && newParentVnode.props;
  const oldProps = oldParentVnode && oldParentVnode.props;

  if (newProps) {
    for (let name in newProps) {
      if (!isValidAttribute(name)) { continue; }
      setAttribute(<HTMLElement>dom, name, newProps[name], oldProps && oldProps[name]);
    }
  }

  if (oldProps) {
    for (let name in oldProps) {
      if (!isValidAttribute(name) || newProps[name]) { continue; }
      setAttribute(<HTMLElement>dom, name, null, oldProps[name]);
    }
  }
}
