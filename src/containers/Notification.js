// import React from 'react';
// import PropTypes from 'prop-types';

// import { withStyles } from '@material-ui/core/styles';
// import Snackbar from '@material-ui/core/Snackbar';

// // コンポーネントの準備
// import NotificationSnackbar from '../components/NotificationSnackbar';


// // スタイル
// const styles = theme => ({
//   root:{
//     margin: 10,
//   },
// });

// class Notification extends React.Component {

//   render() {
    
//     // Material-ui関連
//     const { classes } = this.props;
    

//     return (
//       <Snackbar
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//         open={NotificationReducer.isOpen}
//         autoHideDuration={3000}
//         onClose={actions.closeNotification}
//         className={classes.root}
//       >
//         <NotificationSnackbar
//           onClose={actions.closeNotification}
//           variant={NotificationReducer.variant}
//           message={NotificationReducer.message}
//         />
//       </Snackbar>
//     );
//   }
// }

// // Material-ui関連
// Notification.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

// // Material-uiのテーマ設定
// export default withStyles(styles, { withTheme: true })(Notification);