// React関連
import React from 'react';

// material-ui周り
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import ShareIcon from '@material-ui/icons/Share';
import SendIcon from '@material-ui/icons/Send';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AssistantIcon from '@material-ui/icons/Assistant';

// firestoreまわり
import firebase from "firebase/app";
import 'firebase/firestore';

// Route関連
import { Link } from 'react-router-dom';

// component呼び出し
import ShareDialog from '../containers/ShareDialog';
import ResponsiveDrawerListItem from '../components/ResponsiveDrawerListItem';

// wavesの準備
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';
import * as waves from '../config/waves-config';

// 設定値
const drawerWidth = 240;
const headerNavigationHeight = 56;

const { WavesKeeper } = window;

// スタイル
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  toolBar: {
    justifyContent: 'space-between', // 中央寄せのため追加
    minHeight: headerNavigationHeight,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    paddingTop: `calc(10px + ${headerNavigationHeight}px)`,
    // paddingBottom: `calc(10px + ${bottomNavigationHeight}px)`,
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.up('md')]: {
      paddingBottom: 10,
    },
  },
  
  // ヘッダーロゴ
  headerLogo: {
    display: 'flex',
    height: 48,
  },
});

class ResponsiveDrawer extends React.Component {
  componentWillMount() {
    this.setState ({
      mobileOpen: false,
      shareDialogOpen: false,
      user: '',
      userAddress: '',
      userBalance: 0,
      isLogin: false,
      balanceWaves: '',
      mobileOpen: false,
      shareDialogOpen: false,
    });

    const authData = { data: "Auth on my site" };
    if (WavesKeeper) {
      WavesKeeper.auth( authData )
      .then(async (auth) => {
          console.log( auth ); //displaying the result on the console
          const getPublicState = async () => {
            try {
                const accountState = await WavesKeeper.publicState();
                const userAddress = accountState.account.address;
                const userName = accountState.account.name;
                const userBalance = accountState.account.balance.available;
                this.setState({
                  user: userName,
                  userAddress: userAddress,
                  userBalance: userBalance,
                  roomPath: "/rooms/" + userAddress
                });

                const balanceKey = base58Encode(sha256(stringToBytes(userAddress))) + "_balance";
                let balance = await accountDataByKey(balanceKey, waves.dAppAddress, waves.nodeUrl);
                if (balance === null) {
                  balance = {value: 0};
                }
                balance = balance.value;

                this.setState({
                  balanceWaves: String((balance/100000000).toFixed(8)) + " WAVES"
                });

                const fireuser = {
                  address: userAddress,
                  name: userName,
                  laseLogined: new Date()
                }

                const db = firebase.firestore().collection("users").doc(userAddress);
                db.set(fireuser).then(function() {
                });
            } catch(error) {
                console.error(error); // displaying the result in the console
                /*... processing errors */
            }
          }
          getPublicState();
          this.setState({
            isLogin: true
          });
      }).catch(error => {
          console.error( error ); // displaying the result on the console
          /*...processing errors */
      })
    } else {
        let result = window.confirm('If you wanna use this app, install Waveskeeper!\nYou can learn how to from "about Logpose"');
    }
  }

  constructor(props){
    super(props);
    this.authFunc = this.authFunc.bind(this);
    this.renderLoginComponent = this.renderLoginComponent.bind(this);
    this.renderLoginedComponent = this.renderLoginedComponent.bind(this);
    this.shareDialogToggle = this.shareDialogToggle.bind(this);
    this.withdrawFunc = this.withdrawFunc.bind(this);
  }

  closeDrawerNav = () => {
    this.setState({ mobileOpen: false });
  }
  openDrawerNav = () => {
    this.setState({ mobileOpen: true });
  }

  async withdrawFunc(){
    const { WavesKeeper } = window;
    WavesKeeper.signAndPublishTransaction({
      type: 16,
      data: {
          fee: {
              "tokens": "0.05",
              "assetId": "WAVES"
          },
          dApp: waves.dAppAddress,
          call: {
                  function: 'withdraw',
                  args: []
              }, payment: []
      }
    }).then(async (tx) => {
      const res = JSON.parse(tx);
      const txid = res["id"];

      alert('withdraw has done successfully! Txid : ' + txid);

    }).catch((error) => {
      console.error("Something went wrong", error);
    });
  }

  authFunc(){
    const authData = { data: "Auth on my site" };
    if (WavesKeeper) {
      WavesKeeper.auth( authData )
      .then(auth => {
          console.log( auth ); //displaying the result on the console
          const getPublicState = async () => {
            try {
                const accountState = await WavesKeeper.publicState();
                const userAddress = accountState.account.address;
                const userName = accountState.account.name;
                const userBalance = accountState.account.balance.available;
                this.setState({
                  user: userName,
                  userAddress: userAddress,
                  userBalance: userBalance,
                  roomsPath: '/rooms/' + userAddress
                });
            } catch(error) {
                console.error(error); // displaying the result in the console
                /*... processing errors */
            }
          }
          getPublicState();
          this.setState({
            isLogin: true
          });
      }).catch(error => {
          console.error( error ); // displaying the result on the console
          /*...processing errors */
      })
    } else {
        alert("To Auth WavesKeeper should be installed.");
    }
  }

  renderLoginComponent(classes){
    return (
      <IconButton color="inherit">
        <Typography variant="button" color="inherit" noWrap>
          <LockOpenIcon onClick={this.authFunc} />
        </Typography>
      </IconButton>
    )
  }

  renderLoginedComponent(classes){
    return (
      <IconButton  color="inherit" onClick={this.authFunc}>
        <Typography variant="button" color="inherit" noWrap>
          {this.state.user}
        </Typography>
      </IconButton>
    )
  }
  
  // シェアボタン挙動
  shareDialogToggle = () => {
    this.setState({ shareDialogOpen: !this.state.shareDialogOpen });
  }
  
  render() {
    
    // Material-ui関連
    const { classes, theme } = this.props;
    
    const drawer = (
      <div>
        <List>
          <ResponsiveDrawerListItem
            to="/info"
            onClick={this.closeDrawerNav}
            icon={<InfoIcon />}
            text="about Logpose"
          />
        </List>
        <Divider />
        <List>
          {this.state.isLogin ? 
            <ResponsiveDrawerListItem
              to="/user"
              onClick={this.closeDrawerNav}
              icon={<AccountCircleIcon />}
              text="MyPage"
            />
            :
            <ResponsiveDrawerListItem
              to="/"
              onClick={this.authFunc}
              icon={<LockOpenIcon />}
              text="Login"
            />
          }
          <ResponsiveDrawerListItem
            to="/"
            onClick={this.closeDrawerNav}
            icon={<SearchIcon />}
            text="Room Search"
          />
          {this.state.isLogin &&
            <div>
              <ResponsiveDrawerListItem
                to="/room_create"
                onClick={this.closeDrawerNav}
                icon={<AddCircleIcon />}
                text="Create Room"
              />
              <ResponsiveDrawerListItem
                to="/rooms"
                onClick={this.closeDrawerNav}
                icon={<SendIcon />}
                text="My Rooms"
              />
              <ResponsiveDrawerListItem
                to="/proposals"
                onClick={this.closeDrawerNav}
                icon={<AssistantIcon />}
                text="My Proposals"
              />
              <ResponsiveDrawerListItem
                to="/user"
                onClick={this.withdrawFunc}
                icon={<MonetizationOnIcon />}
                text={this.state.balanceWaves}
              />
            </div>
          }


        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="fixed">
          <Toolbar className={classes.toolBar} variant="dense">
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={() => this.openDrawerNav()}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/">
              <Typography variant="title" color="inherit" noWrap>
                <img src="/images/Logpose_whiteLogo.png" alt="logo_animel_white" className={classes.headerLogo}/>
              </Typography>
            </Link>
            <IconButton
              color="inherit"
              aria-label="Open Share"
            >
              <Typography variant="button" color="inherit" noWrap>
                <ShareIcon onClick={this.shareDialogToggle}/>
                <ShareDialog
                  open={this.state.shareDialogOpen}
                  onClose={this.shareDialogToggle}
                />
              </Typography>
            </IconButton>

            {this.state.isLogin ? this.renderLoginedComponent(classes) : this.renderLoginComponent(classes)}

          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.closeDrawerNav}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          {this.props.children}
        </main>
      </div>
    );
  }
}

// Material-ui関連
ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);