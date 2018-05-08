// Tell Babel to transform JSX into h() calls:
/** @jsx mreact.createElement */

mreact.createElement(
  <div className={'mydiv'}>
    <div>
      <p style={{ color: '#111' }}>hello</p>
    </div>
    <div>
      <p style={{ fontSize: 18 }}>world</p>
    </div>
  </div>);

