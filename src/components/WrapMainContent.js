import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

// スクロールバー設定
import { Scrollbars } from 'react-custom-scrollbars';

// スタイル
const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  footer: {
    marginTop: 'auto',
  },
});

const WrapMainContent = (WrappedComponent, options = {}) => {

  const HOC = class extends Component {
    
    render() {
    
      // Material-ui関連
      const { classes, ...other_props } = this.props;
    
      return (
        <Scrollbars>
          
          <div className={classes.wrapper}>
          
          
            <WrappedComponent {...other_props} />
            

          </div>
        </Scrollbars>
      );
    }
  };

  return (
    withStyles(styles, { withTheme: true })(HOC)
  );
};

export default WrapMainContent;