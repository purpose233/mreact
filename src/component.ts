import {Vnode} from "./vnode";
import {defer} from "./utils";
import {diff} from "./diff";

const UpdateQueue: Component[] = [];

export class Component {
  props: any;
  context: any;
  state: any;
  _nextState: any;
  _vnode: Vnode = null;
  _innerVnode: Vnode = null;
  _parentDom: Node;
  // when created, the component must be dirty
  _dirty: boolean = true;
  _didUpdateCallback: Function[] = [];

  constructor(props, context) {
    this.props = props;
    this.context = context;
  }

  setState(update: any, callback: Function) {
    // Only clone state once
    let nextState = (this._nextState !== this.state) ?
      this._nextState : Object.assign({}, this.state);

    if (typeof update === 'function') {
      Object.assign(nextState, update(nextState, this.props));
    } else {
      Object.assign(nextState, update);
    }
    this._nextState = nextState;
    this._didUpdateCallback.push(callback);

    // and the current state won't change until next tick and diff happens,
    // so any setState operation based on this.state won't work correctly.
    if (!this._dirty) {
      this._dirty = true;
      enqueueComponent(this);
    }
  }

  forceUpdate(callback: Function, isForce: boolean = true) {
    diff(this._parentDom, this._vnode, this._vnode, isForce);
    if (callback) { callback(); }
  }
}

function enqueueComponent(component: Component) {
  if (1 === UpdateQueue.push(component)) {
    defer(flushUpdateQueue);
  }
}

function flushUpdateQueue() {
  // TODO: the order of flushing matters, maybe the leaf node get flushed first.
  while (UpdateQueue.length > 0) {
    const component = UpdateQueue.pop();
    if (component._dirty) {
      component.forceUpdate(null, false);
    }
  }
}
