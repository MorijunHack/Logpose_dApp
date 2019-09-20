import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as waves from '../config/waves-config';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { Grid } from '@material-ui/core';

import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'

import firebase from "firebase/app";
import 'firebase/firestore';


// スタイル
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: '10px auto',
    width: '80%'
  },
  textLeft: {
    textAlign: 'left',
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
  },
});

const { WavesKeeper } = window;

class RoomShow extends Component {
  constructor(props){
    super(props);
    this.state = {
      genre: '',
        title: '',
        detail: '',
        prize: '',
        roomKey: '',
        roomer: {address: '', name: ''},
        txHash: '',
        created: '',
        limit: '',
        when: '',
        roomerInfo: {mealpolicy: '', sex: '', age: '', hobby: '', area: ''}
    }
  }


  componentWillMount(){
      const path = this.props.match.params.id;
      const id = path.replace('room/', '');
      console.log(id);

      const { WavesKeeper } = window;

      let firedata = {};

      let userdata = {};

      const getUserInfo = async () => {
          try {
              const state = await WavesKeeper.publicState();
              const userId = state.account.address;

              const db = firebase.firestore().collection('rooms').doc(id);
              await db.get().then(function(doc) {
                  firedata = doc.data();
              })

              console.log(firedata);
              console.log(this.state);

              function getDate(ts) {
                let cd = new Date(ts * 1000);
                let cyear = cd.getFullYear();
                let cmonth = cd.getMonth() + 1;
                let cdate = cd.getDate();
                let chour = (cd.getHours() < 10) ? '0' + cd.getHours() : cd.getHours();
                let cmin = (cd.getMinutes() <10) ? '0' + cd.getMinutes() : cd.getMinutes();
                let csec = (cd.getSeconds() <10) ? '0' + cd.getSeconds() : cd.getSeconds();
                return (cyear + '-' + cmonth + '-' + cdate + ' ' + chour + ':' + cmin + ':' + csec)
              }
              
              console.log(getDate(firedata.created.seconds));

              const userKey = base58Encode(sha256(stringToBytes(firedata.roomerAddress)));

              console.log(userKey);

              let mealpolicy = await accountDataByKey((userKey + "_mealpolicy"), waves.dAppAddress, waves.nodeUrl);
              if (mealpolicy === null || mealpolicy === 'not set') {
                mealpolicy = {value: ''}
              };
              
              console.log(mealpolicy)

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

              userdata = {
                mealpolicy: mealpolicy.value,
                sex: sex.value,
                age: String(age.value),
                hobby: hobby.value,
                area: area.value
              }
              console.log(userdata);

              this.setState({
                genre: firedata.genre,
                title: firedata.title,
                detail: firedata.detail,
                prize: firedata.prize * 1,
                roomKey: firedata.roomKey,
                roomer: {address: firedata.roomerAddress, name: firedata.roomerName},
                txHash: firedata.txHash,
                created: getDate(firedata.created.seconds),
                limit: getDate(firedata.limit.seconds),
                when: getDate(firedata.when.seconds),
                roomerInfo: {mealpolicy: mealpolicy.value, sex: sex.value, age: String(age.value), hobby: hobby.value, area: area.value}
              })
              
              console.log(this.state);

              if (firedata.roomerAddress === userId) {
                  this.setState({ author: true });
              }

          } catch(error) {
              console.error(error);
          }
      }
      getUserInfo();
      
      

      console.log(this.state);
  }

  render() {

    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <h2>{this.state.title}</h2>
        <div className={classes.textLeft}>

        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              Request genre: {this.state.genre}      {this.state.prize}
            </Typography>
            <Typography variant="headline" component="h3">
              Detail of request
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              {this.state.detail}
            </Typography>
          </Paper>
        
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              Roomer Information
            </Typography>
            <Grid>
              {this.state.roomer.name !== '' &&
                <Typography variant="headline" component="h4">
                  Username: {this.state.roomer.name}
                </Typography>
              }
              {this.state.roomerInfo.age !== '' &&
                <Typography variant="headline" component="h4">
                  Age: {this.state.roomerInfo.age}
                </Typography>
              }
              {this.state.roomerInfo.age !== '' &&
                <Typography variant="headline" component="h4">
                  Gender: {this.state.roomerInfo.sex}
                </Typography>
              }
            </Grid>

            {this.state.roomerInfo.mealpolicy !== '' &&
              <Typography variant="headline" component="h4">
                Foods roomer cannot eat: {this.state.roomerInfo.mealpolicy}
              </Typography>
            }
            {this.state.roomerInfo.area !== '' &&
              <Typography variant="headline" component="h4">
                Roomer lives in {this.state.roomerInfo.area}
              </Typography>
            }
            {this.state.roomerInfo.hobby !== '' &&
              <Typography variant="headline" component="h4">
                Roomer's hobby: {this.state.roomerInfo.hobby}
              </Typography>
            }
          </Paper>
        
        </div>
      </div>
    );
  }
}

// Material-ui関連
RoomShow.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(RoomShow);