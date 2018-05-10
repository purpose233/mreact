import {isComponent, isSameTagName, setAttribute} from './common/common';

const mountedComponents = [];

export function renderVnodes (root, vnode) {
  let result = diff(root, vnode);
}

export function diff (element, vnode) {
  let newElement;

  if (typeof vnode === 'boolean' || vnode === null) {
    vnode = ''
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (element && element.nodeType === 3) {
      if (element.nodeValue !== vnode) {
        element.nodeValue = vnode;
      }
    } else {
      newElement = document.createTextNode(vnode);
      if (element && element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
      }
    }
  } else {
    if (isComponent(vnode)) {

    } else {
      let tagName = String(vnode.type);

      if (!element || !isSameTagName(element, tagName)) {
        newElement = document.createElement(tagName);

        if (element) {
          while (element.firstChild) { newElement.appendChild(element.firstChild); }
          if (element.parentNode) { element.parentNode.replaceChild(newElement, element); }
        }
      }

      diffChildren(element.childNodes, vnode.children, element);
      diffProps(newElement, vnode.props);
    }
  }

  return element;
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
    for (let i = 0; i < vChildren[i]; i++) {
      let vChild = vChildren[i];
      let child = null;

      let key = vChild.props.key;
      if (key !== null && key !== undefined && keyedChildren[key] !== undefined) {
        child = keyedChildren[key];
        delete keyedChildren[key];
        keyedLen--;
      } else {
        let tagName = vChild.type;
        for (let j = 0; j < children.length; j++) {
          if (isSameTagName(children[j], tagName)) {
            child = children[j];
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
