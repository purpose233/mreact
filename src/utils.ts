import {Vnode} from "./vnode";

export interface AttributeNode extends HTMLElement{
  _listeners: any;
}

export function isSameType (vnodeA: Vnode, vnodeB: Vnode) {
  if (typeof vnodeA.type === 'function' && typeof vnodeB.type === 'function') {
    return vnodeA.type === vnodeB.type;
  } else {
    return vnodeA.type === vnodeB.type ||
      vnodeA.type.toLowerCase() === vnodeB.type.toLowerCase();
  }
}

export function isSameTagName (dom: Node, tagName: string): boolean {
  return dom && dom.nodeType === Node.ELEMENT_NODE &&
    (<Element>dom).tagName &&
    (<Element>dom).tagName.toLowerCase() === tagName.toLowerCase();
}

export function isTextNode (dom) {
  return dom && dom.nodeType === Node.TEXT_NODE;
}

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
export function isDimensional (str) {
  return !IS_NON_DIMENSIONAL.test(str);
}

export function isValidAttribute(name: string): boolean {
  return name !== 'children' && name !== 'key';
}

export function setAttribute (dom: AttributeNode, name: string, value: any, old: any) {
  if (name === 'className') {
    dom.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      dom.style.cssText = value || '';
    }
    if (typeof value === 'object') {
      if (typeof old !== 'string') {
        for (let styleKey in old) {
          if (!(styleKey in value)) {
            dom.style[styleKey] = '';
          }
        }
      } else {
        // TODO: parse old string
      }
      for (let styleKey in value) {
        const styleValue = value[styleKey];
        dom.style[styleKey] = typeof styleValue === 'number' && isDimensional(styleKey) ?
          styleValue +'px' : styleValue;
      }
    }
  } else if (/^on/.test(name)) {
    // TODO: enable to use capture
    const eventType = name.toLowerCase().substring(2);
    if (value) {
      if (!dom._listeners) { dom._listeners = {}; }
      dom._listeners[name] = value;
      dom.addEventListener(eventType, value);
    } else if (dom._listeners) {
      dom.removeEventListener(eventType, dom._listeners[name]);
      delete dom._listeners[name];
    }
  } else {
    if (value == null || value === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, value);
    }
  }
}

export function defer (f) {
  Promise.resolve().then(f);
  // new Promise(resolve => { resolve(); }).then(() => { f(); });
}

export function getVnodeChildren (vnode: Vnode): Vnode[] {
  // Whether vnode.props.children exists, it will return an array,
  // so that the caller won't need to judge again.
  const children = [];
  if (vnode && vnode.props && vnode.props.children) {
    for (let child of vnode.props.children) {
      if (Array.isArray(child)) { children.push(...child); }
      else { children.push(child); }
    }
  }
  return children;
}
