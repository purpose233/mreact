import {renderVnodes} from './diff';

export function render (vnode, container) {
  renderVnodes(container, vnode);
}
