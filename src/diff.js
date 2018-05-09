import {isComponent, isSameTagName, setAttribute} from './common/common';

let diffLevel = 0;
const mountedComponents = [];

export function diff (dom, vnode) {
  diffLevel++;

  let diffResult;

  if (typeof vnode === 'boolean' || vnode === null) {
    vnode = ''
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.nodeType === 3) {
      if (dom.nodeValue !== vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      diffResult = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(diffResult, dom);
      }
    }

    diffResult = dom;
  } else {
    if (isComponent(vnode)) {

    } else {
      let tagName = String(vnode.type);

      if (!dom || !isSameTagName(dom, tagName)) {
        diffResult = document.createElement(tagName);

        if (dom) {
          while (dom.firstChild) { diffResult.appendChild(dom.firstChild); }
          if (dom.parentNode) { dom.parentNode.replaceChild(diffResult, dom); }
        }
      }

      diffChildren();
      diffProps(diffResult, vnode.props);
    }
  }

  if (!--diffLevel) {

  }
}

function diffChildren (dom, vnodes) {

}

function diffProps (dom, props) {
  let oldProps = dom._props;
  if (!oldProps) {
    oldProps = dom._props = {};
    let attributes = dom.attributes;
    for (let i = 0; i < attributes.length; i++) {
      oldProps[attributes[i].name] = attributes[i].value;
    }
  }

  for (let name in oldProps) {
    if (!(props && (props[name] === null || props[name] === undefined)) &&
      oldProps[name] !== null && oldProps[name] !== undefined) {
      setAttribute(dom, name, null, oldProps[name]);
    }
  }

  for (let name in props) {
    if (name !== 'children' && name !== 'innerHTML') {
      setAttribute(dom, name, props[name], oldProps[name]);
    }
  }

  dom._props = props;
}
