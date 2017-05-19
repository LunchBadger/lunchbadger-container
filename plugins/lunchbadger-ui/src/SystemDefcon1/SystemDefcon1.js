import React, {Component} from 'react';
import cs from 'classnames';
import {SmoothCollapse} from '../';
import SystemDefcon1Box from './SystemDefcon1Box';
import './SystemDefcon1.scss';

const SystemDefcon1 = ({...props}) => (
  <div className="SystemDefcon1">
    <SystemDefcon1Box {...props} />
  </div>
);

export default SystemDefcon1;

// class SystemDefcon1 extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       visibleError: false,
//     }
//   }
//
//   toggleVisibleError = () => this.setState({visibleError: !this.state.visibleError});
//
//   render() {
//     const {server = false, error} = this.props;
//     const {visibleError} = this.state;
//     const title = server ? 'Server Failure' : 'The workspace crashed';
//     const content = server
//       ? "The system can't connect to the server. Please check that the server is running and reload the page."
//       : "You'll need to reload the page to continue";
//     return (
//       <div className="SystemDefcon1">
//         <div className={cs('SystemDefcon1__box', {['visibleError']: visibleError})}>
//           <div className="SystemDefcon1__box__title">
//             {title}
//           </div>
//           <div className="SystemDefcon1__box__content">
//             {content}
//             {server && (
//               <div className="SystemDefcon1__box__content--error">
//                 ERROR: {error}
//               </div>
//             )}
//             {!server && (
//               <div className="SystemDefcon1__box__content__details">
//                 <div>
//                   <span
//                     className="SystemDefcon1__box__content__details--link"
//                     onClick={this.toggleVisibleError}
//                   >
//                     {visibleError ? 'Hide' : 'Show'} server output details
//                   </span>
//                 </div>
//                 <SmoothCollapse expanded={visibleError} heightTransition="500ms ease">
//                   <pre>
//                     {error}
//                   </pre>
//                 </SmoothCollapse>
//               </div>
//             )}
//           </div>
//           <div className="SystemDefcon1__box__content">
//             <button onClick={() => { document.location.reload(); }}>RELOAD</button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
//
// export default SystemDefcon1;
