// Tell Babel to transform JSX into h() calls:
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
      ></div>);
  }
}

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
mreact.render((
    <MyComponent>
      <Card/>
    </MyComponent>), root);
