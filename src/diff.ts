import {Vnode} from "./vnode";
import {AttributeNode, isSameTagName, isSameType,
  isValidAttribute, setAttribute} from "./utils";
import {Component} from "./component";

// The components that have mounted in diff operations.
// export const MountedComponents: Component[] = [];

// TODO: the return value of diff might not be useful
export function diff(parentDom: Node,
                     newVnode: Vnode, oldVnode: Vnode,
                     isForce: boolean = false): Node {
  let dom = oldVnode ? oldVnode._dom : null, newDom,
  isNewComponent = false, oldState, oldProps;

  if (newVnode.type == null) {
    if (dom && dom.nodeType === Node.TEXT_NODE) {
      if (newVnode._text !== dom.nodeValue) {
        dom.nodeValue = newVnode._text;
      }
    } else {
      newDom = document.createTextNode(newVnode._text);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(newDom, dom);
      } else {
        parentDom.appendChild(newDom);
      }
      dom = newDom;
    }
    newVnode._dom = dom;
  } else {
    if (typeof newVnode.type === 'function') {
      let component: Component;
      // NewVnode and oldVnode might be equal when vnode represent a component need to rerender.
      if (oldVnode !== newVnode) {
        if (oldVnode && oldVnode._component) {
          // Copy the data of oldVnode, but actually,
          // i don't know whether this will ever be reached.
          newVnode._component = component = oldVnode._component;
          newVnode._dom = oldVnode._dom;
        } else {
          isNewComponent = true;
          if (newVnode.type.prototype && newVnode.type.prototype.render) {
            newVnode._component = component = new (<any>newVnode.type)(newVnode.props, null)
          } else {
            newVnode._component = component = new Component(newVnode.props, null);
            component.constructor = newVnode.type;
            (<any>component).render = doRender;
          }
        }

        component._vnode = newVnode;
        component._parentDom = parentDom;
      } else {
        component = newVnode._component;
      }

      // Life cycle
      if (isNewComponent) {
        if ((<any>component).componentWillMount) {
          (<any>component).componentWillMount();
        }
        // MountedComponents.push(component);
      } else {
        // TODO: need to pass context to hooks.
        if (!isForce && (<any>component).componentWillReceiveProps) {
          // args: new props, new context
          (<any>component).componentWillReceiveProps(newVnode.props);
        }
        if (!isForce && (<any>component).shouldComponentUpdate &&
          // args: new props, new state, new context
          !(<any>component).shouldComponentUpdate(newVnode.props, component._nextState)) {
          return dom;
        }
        if (!isNewComponent && (<any>component).componentWillUpdate) {
          // args: new props, new state, new context
          (<any>component).componentWillUpdate(newVnode.props, component._nextState)
        }
        if (isNewComponent && (<any>component).componentDidMount) {
          (<any>component).componentDidMount();
        }
        oldProps = component.props;
        component.props = newVnode.props;
      }

      // update state
      if (!isNewComponent) {
        oldState = component.state;
        component.state = component._nextState;
      } else {
        component._nextState = component.state;
      }

      const oldInnerVnode = component._innerVnode;
      const newInnerVnode: Vnode = (<any>component).render(component.props, component.state, component.context);
      // diff inner vnode
      dom = diff(parentDom, newInnerVnode, oldInnerVnode);

      component._innerVnode = newInnerVnode;
      component._dirty = false;

      if (!isNewComponent && (<any>component).componentDidUpdate) {
        (<any>component).componentDidUpdate(oldProps, oldState);
      }
    } else if (!isSameTagName(dom, newVnode.type)) {
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

      diffChildren(dom, newVnode, oldVnode);
      diffProps(dom, newVnode, oldVnode);
    }
    newVnode._dom = dom;
  }

  return dom;
}

export function diffChildren(parentDom: Node,
                             newParentVnode: Vnode, oldParentVnode: Vnode): void {
  // Divide all child into keyed and unkeyed.
  let keyedChildren = {}, unkeyedChildren: Vnode[] = [];
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
          if (isSameType(unkeyedChildren[i], child)) {
            oldChild = unkeyedChildren[i];
            unkeyedChildren.splice(i, 1);
            break;
          }
        }
      }

      diff(parentDom, child, oldChild);
    }
  }

  // Delete child which is not contained by newVnode.
  for (let key in keyedChildren) {
    unmount(keyedChildren[key], parentDom);
  }
  for (let i = 0; i < unkeyedChildren.length; i++) {
    unmount(unkeyedChildren[i], parentDom);
  }
}

export function diffProps(dom: Node,
                          newParentVnode: Vnode, oldParentVnode: Vnode): void {
  const newProps = newParentVnode && newParentVnode.props;
  const oldProps = oldParentVnode && oldParentVnode.props;

  if (newProps) {
    for (let name in newProps) {
      if (!isValidAttribute(name)) { continue; }
      setAttribute(<AttributeNode>dom, name, newProps[name], oldProps && oldProps[name]);
    }
  }

  // Remove outdated props
  if (oldProps) {
    for (let name in oldProps) {
      if (!isValidAttribute(name) || newProps[name]) { continue; }
      setAttribute(<AttributeNode>dom, name, null, oldProps[name]);
    }
  }
}

function doRender(props, state, context) {
  return this.constructor(props, context);
}

function unmount(vnode: Vnode, parentDom: Node): void {
  if (!vnode) { return; }
  if (vnode._component && (<any>vnode._component).componentWillUnmount) {
    (<any>vnode._component).componentWillUnmount();
  }
  parentDom.removeChild(vnode._dom);
}
