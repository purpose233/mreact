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
