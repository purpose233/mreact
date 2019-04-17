import {Vnode} from "./vnode";
import {diff} from "./diff";

export function render(vnode: Vnode, container: Node): void {
  diff(container, vnode, null);
}