export function isSameTagName (dom: Node, tagName: string): boolean {
  return dom && dom.nodeType === Node.ELEMENT_NODE &&
    (<Element>dom).tagName &&
    (<Element>dom).tagName.toLowerCase() === tagName.toLowerCase();
}

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
export function isDimensional (str) {
  return !IS_NON_DIMENSIONAL.test(str);
}

export function isValidAttribute(name: string): boolean {
  return name !== 'children' && name !== 'key';
}

export function setAttribute (dom: HTMLElement, name: string, value: any, old: any) {
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
    // TODO: add event listener
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
