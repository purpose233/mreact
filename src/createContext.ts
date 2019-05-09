import {Component, enqueueComponent} from "./component";

export function createContext(defaultValue) {
  const context: any = {
    value: defaultValue,
    _defaultValue: defaultValue
  };

  const subscribed: Component[] = [];
  function Provider(props) {
    context._providerComponent = this;
    this.shouldComponentUpdate = (props) => {
      if (context.value !== props.value) {
        context.value = props.value;
        for (const component of subscribed) {
          enqueueComponent(component);
        }
      }
      // The change of props.value won't cause all children to rerender,
      // but only the subscribed ones.
      return false;
    };
    this._sub = (component: Component) => {
      subscribed.push(component);
      const oldUnmountHook = (<any>component).componentWillUnmount;
      (<any>component).componentWillUnmount = () => {
        subscribed.splice(subscribed.indexOf(component), 1);
        oldUnmountHook && oldUnmountHook();
      }
    };
    return props.children;
  }

  function Customer(props, ctx) {
    return props.children(ctx);
  }
  Customer._contextRef = context;

  context.Provider = Provider;
  context.Customer = Customer;
}
