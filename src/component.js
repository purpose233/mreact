export class Component {
  constructor (props, context) {
    this.props = props;
    this.context = context;
    this.state = this.state || {};
  }

  setState (state, callback) {
    let currState = this.state;
    this.prevState = Object.assign({}, currState);
    Object.assign(currState,
      (typeof state === 'function') ? state(this.props) : state);
    if (callback) {

    }

    // let s = this.state;
    // if (!this.prevState) this.prevState = extend({}, s);
    // extend(s, typeof state==='function' ? state(s, this.props) : state);
    // if (callback) (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
    // enqueueRender(this);
  }

  render () {}
}

export function renderComponent () {

}

export function buildComponent (dom, vnode) {

}

export function createComponent (constructor, props, context) {
  let instance;

  if (constructor.prototype && constructor.prototype.render) {
    instance = new constructor(props, context);
  } else {
    instance = new Component(props, context);
    instance.constructor = constructor;
    instance.render = function (props, state, context) {
      return this.constructor(props, context);
    }
  }

  return instance;
}