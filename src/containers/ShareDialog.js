import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// SNS用シェアボタン
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,

  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';


// クリップボードにコピー
import {CopyToClipboard} from 'react-copy-to-clipboard';


// スタイル
const styles = theme => ({
  root: {
  },
  snsShareButtonArea: {
    padding: 10,
    display: 'flex',
    justifyContent: 'space-around',
  },
  snsShareButton: {
  },
  copyToCripboardButton: {
    
  },
});


class ShareDialog extends React.Component {

  render() {
    
    // Material-ui関連
    const { classes } = this.props;
    
    // シェアボタン用
    const shareUrl = "https://logpose-dapps.firebaseapp.com/";
    const title = "Logpose";
    
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.root}
      >
        <DialogTitle>Logposeをシェアする</DialogTitle>
        <Divider/>
        <DialogContent className={classes.snsShareButtonArea}>
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            className={classes.snsShareButton}>
            <FacebookIcon
              size={48}
              round />
          </FacebookShareButton>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className={classes.snsShareButton}>
            <TwitterIcon
              size={48}
              round />
          </TwitterShareButton>
        </DialogContent>
        <DialogContent className={classes.snsShareButtonArea}>
          <LinkedinShareButton
            url={shareUrl}
            title={title}
            windowWidth={750}
            windowHeight={600}
            className={classes.snsShareButton}>
            <LinkedinIcon
              size={48}
              round />
          </LinkedinShareButton>
          <EmailShareButton
            url={shareUrl}
            subject={title}
            body="body"
            className={classes.snsShareButton}>
            <EmailIcon
              size={48}
              round />
          </EmailShareButton>
        </DialogContent>
        <DialogContent className={classes.snsShareButtonArea}>
          <CopyToClipboard text={shareUrl}>
            <Button
              variant="contained"
              color="primary"
              className={classes.copyToCripboardButton}
            >
              URLをコピー
            </Button>
          </CopyToClipboard>
        </DialogContent>
        <Divider/>
        <DialogActions>
          <Button onClick={() => this.props.onClose()} color="primary" autoFocus>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// Material-ui関連
ShareDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(ShareDialog);