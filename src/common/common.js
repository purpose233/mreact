export function isComponent (vnode) {
  return (typeof vnode === 'function');
}

export function isSameTagName (dom, tagName) {
  return dom && dom.tagName && dom.tagName.toLowerCase() === tagName.toLowerCase();
}

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
export function isDimensional (str) {
  return !IS_NON_DIMENSIONAL.test(str);
}

export function setAttribute (dom, name, value, old) {
  if (name === 'className') {
    dom.className = value || '';
  } else if (name === 'key') {
    // ?
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old==='string') {
      dom.style.cssText = value || '';
    }
    if (typeof value === 'object') {
      if (typeof old !== 'string') {
        for (let name in old) {
          if (!(name in value)) {
            dom.style[name] = '';
          }
        }
      }
      for (let name in value) {
        dom.style[name] = typeof value === 'number' && isDimensional(name) ?
          value +'px' : value;
      }
    }
  } else if (/^on/.test(name)) {

  } else {
    if (value === undefined || value === null || value === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, value);
    }
  }
}
