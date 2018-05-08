import {Vnode} from './vnode';

// 	                       --react--	     --preact--
// 类别：	                   type	           nodeName
// 属性包：	                 props	         attributes
// 孩子：	                   props.children	 children
// 数组追踪用的trace by属性：	 key	           key

//   h(
//   	 "div",
//   	 { className: "test" },
//   	 h("span", { style: test }, "测试"),
//   	 h(App)
//   )
export function createElement (type, props, ...children) {
  let stack = [];
  stack.push(...children);
  if (props && props.children) {
    if (Array.isArray(props.children)) {
      stack.push(...props.children);
    } else {
      stack.push(props.children);
    }
  }
  delete props.children;

  return new Vnode(type, props, children);
}
