// Tell Babel to transform JSX into h() calls:
/** @jsx mreact.createElement */

// const Card = () => {
//   <div className={'card'}></div>
// };
//
// class Component {
//   render () {
//     return (<div/>);
//   }
// }

// let vnode = mreact.createElement(
//   <div className={'mydiv'}>
//     <div>
//       balabala
//       <p style={{ color: '#111' }}>{'he'}{'ll'}{0}</p>
//     </div>
//     <div>
//       <p style={{ fontSize: 18 }}>world</p>
//     </div>
//   </div>);

// let vnode = mreact.createElement(
//   <div className={'mydiv'}>
//     <p style={{ color: '#111' }}>{'he'}{'ll'}{0}</p>
//     <p style={{ fontSize: 18 }}>world</p>
//   </div>);

let root = document.getElementById('root');
mreact.render((
  <div className={'mydiv'}>
    <div>
      balabala
      <p style={{ color: '#369' }}>{'he'}{'ll'}{0}</p>
    </div>
    <div>
      <p style={{ fontSize: 22 }}>world</p>
    </div>
  </div>), root);
