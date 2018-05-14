import {isComponent, isSameTagName, setAttribute} from './common/common';

export function renderVnodes (root, vnode) {
  let result = diff(root, vnode);
}

export function diff (dom, vnode) {
  let newDom;

  if (typeof vnode === 'boolean' || vnode === null) {
    vnode = ''
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.nodeType === 3) {
      if (dom.nodeValue !== vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      newDom = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(newDom, dom);
      }
    }
  } else {
    if (isComponent(vnode)) {

    } else {
      let tagName = String(vnode.type);

      if (!dom || !isSameTagName(dom, tagName)) {
        newDom = document.createElement(tagName);

        if (dom) {
          while (dom.firstChild) { newDom.appendChild(dom.firstChild); }
          if (dom.parentNode) { dom.parentNode.replaceChild(newDom, dom); }
        }
      } else {
        newDom = dom;
      }

      // if (vnode.children && vnode.children.length === 1
      //   && typeof vnode.children[0] === 'string') {
      //   while (newDom.firstChild) { newDom.removeChild(newDom.firstChild); }
      //   newDom.appendChild(document.createTextNode(vnode.children[0]));
      // } else {
      // }
      diffChildren(newDom.childNodes, vnode.children, newDom);
      diffProps(newDom, vnode.props);
    }
  }

  return newDom;
}

function diffChildren (children, vChildren, parent) {
  let keyedChildren = {},
    keyedLen = 0,
    unkeyedChildren = [],
    resultChild,
    originChild;

  if (children.length > 0) {
    for (let child of children) {
      let key = child._props ? child._props.key : null;
      if (key !== null) {
        keyedChildren[key] = child;
        keyedLen++;
      } else {
        unkeyedChildren.push(child);
      }
    }
  }

  if (vChildren.length > 0) {
    for (let i = 0; i < vChildren.length; i++) {
      let vChild = vChildren[i];
      let child = null;

      let key = vChild.props ? vChild.props.key : null;
      if (key !== null && key !== undefined && keyedChildren[key] !== undefined) {
        child = keyedChildren[key];
        delete keyedChildren[key];
        keyedLen--;
      } else {
        let tagName = vChild.type;
        for (let j = 0; j < unkeyedChildren.length; j++) {
          if (isSameTagName(unkeyedChildren[j], tagName)) {
            child = unkeyedChildren[j];
            children.splice(j, 1);
            break;
          }
        }
      }

      resultChild = diff(child, vChild);
      originChild = children[i];
      if (resultChild && resultChild !== originChild && resultChild !== parent) {
        if (!originChild) {
          parent.appendChild(resultChild);
        } else {
          parent.insertBefore(resultChild, originChild);
        }
      }
    }
  }

  // remove the rest child of children
  for (let key in keyedChildren) {
    parent.removeChild(keyedChildren[key]);
  }
  for (let i = 0; i < unkeyedChildren.length; i++) {
    parent.removeChild(unkeyedChildren[i]);
  }
}

function diffProps (element, props) {
  let oldProps = element._props;
  if (!oldProps) {
    oldProps = element._props = {};
    let attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      oldProps[attributes[i].name] = attributes[i].value;
    }
  }

  for (let name in oldProps) {
    if (!(props && (props[name] === null || props[name] === undefined)) &&
      oldProps[name] !== null && oldProps[name] !== undefined) {
      setAttribute(element, name, null, oldProps[name]);
    }
  }

  for (let name in props) {
    if (name !== 'children' && name !== 'innerHTML') {
      setAttribute(element, name, props[name], oldProps[name]);
    }
  }

  element._props = props;
}
