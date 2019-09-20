import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as waves from '../config/waves-config';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBalanceWalletSharpIcon from '@material-ui/icons/AccountBalanceWalletSharp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import WcIcon from '@material-ui/icons/Wc';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import LanguageIcon from '@material-ui/icons/Language';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';

// Redux関連
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import { Input, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@material-ui/core';

import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'

// スタイル
const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '80%',
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  },
  waves: {
    width: '19.5px',
    height: '19.5px'
  },
  input: {
    fontSize: '18px',
    textAlign: 'right'
  },
  // text: {
  //   fontSize: '18px'
  // },
  button: {
    marginTop: '50px'
  }
});

const { WavesKeeper } = window;


class MyPage extends Component {

  componentWillMount(){
    this.state = {
      fakeUser: false,
      id: '',
      balance: 0,
      name: '',
      mealpolicy: '',
      sex: '',
      age: 0,
      hobby: '',
      area: '',
      prize: 0
    }

    console.log(this.props);
    const id = this.props.match.params.id;

    const judgeAccount = async () => {
      try {
          const accountState = await WavesKeeper.publicState();
          console.log(accountState);
          const userAddress = accountState.account.address;
          const userKey = base58Encode(sha256(stringToBytes(userAddress)));
          const userName = accountState.account.name;
          const userBalance = accountState.account.balance.available;
          
          let mealpolicy = await accountDataByKey((userKey + "_mealpolicy"), waves.dAppAddress, waves.nodeUrl);
          if (mealpolicy === null || mealpolicy === 'not set') {
            mealpolicy = {value: ''}
          };
          
          let sex = await accountDataByKey((userKey + "_sex"), waves.dAppAddress, waves.nodeUrl);
          if (sex === null || sex === 'NONE'){
            sex = {value: ''}
          };

          let age = await accountDataByKey((userKey + "_age"), waves.dAppAddress, waves.nodeUrl);
          if (age === null || age === 'not set'){
            age = {value: 0}
          };

          let hobby = await accountDataByKey((userKey + "_hobby"), waves.dAppAddress, waves.nodeUrl);
          if (hobby === null || hobby === 'not set') {
            hobby = {value: ''}
          };

          let area = await accountDataByKey((userKey + "_area"), waves.dAppAddress, waves.nodeUrl);
          if (area === null || area === 'not set') {
            area = {value: ''}
          };

          let prize = await accountDataByKey((userKey + "_balance"), waves.dAppAddress, waves.nodeUrl);
          if (prize === null) {
            prize = {value: 0}
          };

          console.log(mealpolicy)
          
          if (userAddress === id) {
            this.setState({
              name: userName,
              id: userAddress,
              balance: userBalance,
              mealpolicy: mealpolicy.value,
              sex: sex.value,
              age: age.value,
              hobby: hobby.value,
              area: area.value,
              prize: prize.value
            });
          } else {
            this.setState({
              fakeUser: true
            });
          }
      } catch(error) {
          console.error(error); // displaying the result in the console
          /*... processing errors */
      }
    }
    judgeAccount();
  }

  constructor(props) {
    super(props);
    this.doChange = this.doChange.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
  }

  doChange(e){
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async doSubmit(e){
    e.preventDefault();

    if (this.state.mealpolicy === null) {
      this.setState({mealpolicy: 'not set'})
    }
    if (this.state.sex === null) {
      this.setState({sex: 'NONE'})
    }
    if (this.state.age === null) {
      this.setState({age: 0})
    }
    if (this.state.hobby === null) {
      this.setState({hobby: 'not set'})
    }
    if (this.state.area === null) {
      this.setState({area: 'not set'})
    }

    WavesKeeper.signAndPublishTransaction({
        type: 16,
        data: {
            fee: {
                "tokens": "0.05",
                "assetId": "WAVES"
            },
            dApp: waves.dAppAddress,
            call: {
                    function: 'setUser',
                    args: [
                        {type: "string",value: this.state.id},
                        {type: "string", value: this.state.mealpolicy},
                        {type: "string",value: this.state.sex},
                        {type: "integer",value: this.state.age},
                        {type: "string",value: this.state.hobby},
                        {type: "string",value: this.state.area},
                    ]
                }, payment: []
        }
    }).then(async (tx) => {
        console.log("Signiture Successfull!!");
    }).catch((error) => {
            console.error("Something went wrong", error);
    });
  }
  
  render() {
    // Material-ui関連
    const { classes } = this.props;
    return (
      <div>
        {this.state.fakeUser ?
          <h2>You cannot access this page.</h2>
        :
          <div>
            <h2>{this.state.name}</h2>
            <div className={classes.root}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <img src="/images/waves-logo.png" alt="waves" className={classes.waves} />
                  </ListItemIcon>
                  <ListItemText primary="Address" />
                  <ListItemSecondaryAction>
                    <Typography component="p" className={classes.text}>{this.state.id}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceWalletSharpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Balance" />
                  <ListItemSecondaryAction>
                     <Typography component="p" className={classes.text}>{this.state.balance}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LocalAtmIcon />
                  </ListItemIcon>
                  <ListItemText primary="Amount you can withdraw" />
                  <ListItemSecondaryAction>
                    <Typography component="p" className={classes.text}>{this.state.prize}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <ThumbDownIcon />
                  </ListItemIcon>
                  <ListItemText primary="Foods you can't eat" />
                  <ListItemSecondaryAction>
                     <Input type="text" value={this.state.mealpolicy} name="mealpolicy" onChange={this.doChange} className={classes.forms}   />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <WcIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gender" />
                  <ListItemSecondaryAction>
                  <FormControl className={classes.formControl}>
                    <Select
                      value={this.state.sex}
                      onChange={this.doChange}
                      className={classes.input}
                      inputProps={{
                        name: 'sex',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PermContactCalendarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Age" />
                  <ListItemSecondaryAction>
                    <Input type="number" value={this.state.age} name="age" onChange={this.doChange} className={classes.input} />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LocalActivityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Hobbies" />
                  <ListItemSecondaryAction>
                    <Input type="text" value={this.state.hobby} name="hobby" onChange={this.doChange} className={classes.input} />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Your main location" />
                  <ListItemSecondaryAction>
                    <Input type="text" value={this.state.area} name="area" onChange={this.doChange} className={classes.input} />
                  </ListItemSecondaryAction>
                </ListItem>

              </List>
            </div>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.doSubmit}
              >
                SaveChanges
              </Button>
          </div>
        }
      </div>
    );
  }
}

// Material-ui関連
MyPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Redux関連
const mapState = (state, ownProps) => ({
});
function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

// Material-uiのテーマ設定＋Redux設定
export default connect(mapState, mapDispatch)(
  withStyles(styles, { withTheme: true })(MyPage)
);