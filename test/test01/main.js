// Tell Babel to transform JSX into mreact.createElement() calls:
/** @jsx mreact.createElement */

const Card = () => (
  <div
    className={'card'}
    style={{width: 150, height: 100, background: 'blue'}}
  ></div>
);

class MyComponent extends mreact.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div
        className={'my-component'}
        style={{width: 200, height: 100, background: 'red'}}
      >
        <p>MyComponent</p>
        { this.props.children }
      </div>);
  }
}

class Counter extends mreact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      id: 'abc'
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    console.log('On click');
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div onClick={this.onClick}>
        {'count: ' + this.state.count}
      </div>
    );
  }
}

class MyCounterParent extends mreact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      id: 'abc'
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    console.log('On click');
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div
        style={{width: 200, height: 100, background: 'red'}}
        onClick={this.onClick}>
        <MyCounterChild count={this.state.count}/>
      </div>
    );
  }
}

const MyCounterChild = (props) => (
  <p>{'Count: ' + props.count}</p>
);

// (
//   <div className={'mydiv'}>
//     <Card/>
//     <MyComponent/>
//     <div>
//       balabala
//       <p style={{ color: '#369' }}>{'he'}{'ll'}{0}</p>
//     </div>
//     <div>
//       <p style={{ fontSize: 22 }}>world</p>
//     </div>
//   </div>)

let root = document.getElementById('root');
// mreact.render((
//     <MyComponent>
//       <Card/>
//     </MyComponent>), root);
// mreact.render((
//     <MyComponent>
//       <Counter/>
//     </MyComponent>), root);
mreact.render((
  <MyCounterParent />), root);
