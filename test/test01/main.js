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

console.log(mreact.createElement(
  <div className={'mydiv'}>
    <div>
      <p style={{ color: '#111' }}>{'he'}{'ll'}{0}</p>
    </div>
    <div>
      <p style={{ fontSize: 18 }}>world</p>
    </div>
  </div>));

