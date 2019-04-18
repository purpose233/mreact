import {Vnode} from "./vnode";
import {diff} from "./diff";

export function render(vnode: Vnode, container: Node): void {
  console.log(vnode);
  diff(container, vnode, null);
}