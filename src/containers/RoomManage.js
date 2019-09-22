import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from "firebase/app";
import 'firebase/firestore';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import * as waves from '../config/waves-config';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import TextField from '@material-ui/core/TextField';

import { Redirect } from 'react-router-dom';

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';

import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'

// waves-transactionsの取得
import { currentHeight, accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { Input } from '@material-ui/core';


// スタイル
const styles = theme => ({
    button: {
        marginTop: 30,
        marginBottom: 20,
        marginRight: 10,
        fontSize: 16,
        padding: 10,
        width: 250,
    },
    areaField: {
        width: '33%',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: 10,
    },
    textLeft: {
        textAlign: 'left',
    },
    paragraph: {
        marginTop: 10,
        marginBottom: 10,
    },

    // Form
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '80%'
    },

    cal: {
        width: '160px',
        marginRight: 20
    },

    prize: {
        width: '20%',
        marginRight: 20
    },
    genreSelector: {
        width: '290px',
        textAlign: 'left'
    }
});

class RoomManage extends Component {

    constructor(props){
        super(props);
        this.state = {
          author: 'false',
          created: '',
          roomKey: '',
          roomer: '',
          country: '',
          state: '',
          city: '',
          title: '',
          when: '',
          genre: '',
          detail: '',
          prize: 0,
          dead: '',
          duration: 0,
          height: 0
        }
      this.handleChange = this.handleChange.bind(this);
      this.handleWhenChange = this.handleWhenChange.bind(this);
      this.handleDeadChange = this.handleDeadChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount(){
      const roomKey = this.props.match.params.id;
      const { WavesKeeper } = window;

      const getRoomData = async () => {
        try {
          let user = await WavesKeeper.publicState();
          user = user.account.address;

          let datas = await accountDataByKey(roomKey + '_data', waves.dAppAddress, waves.nodeUrl);
          datas = datas.value;
          datas = JSON.parse(datas);

          // dataの日付表記を変更
          function fixDateTime(date) {
            const arr = date.split('');
            console.log(arr);
            let arr2 = [];
            for (let i = 0; i < 10; i++) {
                arr2.push(arr[i]);
            }
            console.log(arr2);

            let arr3 = [];
            for (let j = 11; j < 16; j++) {
                arr3.push(arr[j])
            }
            console.log(arr3);

            arr2 = arr2.join(',');
            arr3 = arr3.join(',');

            let date2 = arr2 + ' ' + arr3;
            date2 = date2.replace(/,/g, '');

            return date2;
          }

          function fixDate(date){
              const arr = date.split('');
              console.log(arr);
              let arr2 = [];
              for (let i = 0; i < 10; i++) {
                  arr2.push(arr[i]);
              }
              arr2 = arr2.join(',');
              arr2 = arr2.replace(/,/g, '');

              return arr2
          }

          let city = datas.city;
          city = city.split(' - ');

          if (datas.roomer === user) {
            this.setState({
              author: true,
              created: datas.created,
              roomKey: roomKey,
              roomer: datas.roomer,
              country: city[2],
              state: city[1],
              city: city[0],
              title: datas.title,
              when: datas.when,
              genre: datas.genre,
              detail: datas.detail,
              prize: Number(datas.prize),
              dead: datas.dead,
              duration: datas.duration,
              height: datas.height
            });
          }
        }catch(error){
          console.error(error)
        }
      }

      getRoomData();

      console.log(this.state);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleWhenChange(e) {
        console.log(this);
        this.setState({
            when: e
        });
    }

    handleDeadChange(e){
        this.setState({
            dead: e
        })
    }

    async handleSubmit() {

      console.log(this.state);

        const { WavesKeeper } = window;

        let userName = await WavesKeeper.publicState();
        userName = userName.account.name;
        
        const data = {
            "roomer": this.state.roomer,
            "roomerName": userName,
            "city": this.state.city + ' - ' + this.state.state + ' - ' + this.state.country,
            "title": this.state.title,
            "when": this.state.when,
            "genre": this.state.genre,
            "detail": this.state.detail,
            "prize": this.state.prize,
            "dead": this.state.dead,
            "height": this.state.height,
            "duration": this.state.duration,
            "created": this.state.created
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
                        function: 'editRoom',
                        args: [
                            {type: "string", value: JSON.stringify(data)},
                            {type: "string",value: this.state.roomKey}
                        ]
                    }, payment: []
            }
        }).then(async (tx) => {
            console.log("Signiture Successfull!!");

            // txhashを求める
            const res = JSON.parse(tx);
            const txid = res["id"];
            console.log(txid);
    
            // firestoreに書き込む
            const firedata = {
              txHash: txid,
              roomKey: this.state.roomKey,
              roomerAddress: this.state.roomer,
              created: this.state.created,
              dead: this.state.dead,
              state: 'opened'
            }

            console.log(firedata);

            const db = firebase.firestore().collection('users').doc(firedata.roomerAddress).collection("rooms").doc(firedata.roomKey)
            db.set(firedata).then(function() {
                alert('Room Updated Successfully! Txid:  ' + txid);
            });
        }).catch((error) => {
                console.error("Something went wrong", error);
        });
    }

    async handleDelete(){
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
                    function: 'closeRoom',
                    args: [
                        {type: "string",value: this.state.roomKey}
                    ]
                }, payment: []
        }
      }).then(async (tx) => {
        const res = JSON.parse(tx);
        const txid = res["id"];
        console.log(txid);

        const firedata = {
          txHash: txid,
          roomKey: this.state.roomKey,
          roomerAddress: this.state.roomer,
          created: this.state.created,
          dead: this.state.dead,
          state: 'closed'
        }

        const db = firebase.firestore().collection('users').doc(firedata.roomerAddress).collection("rooms").doc(firedata.roomKey)
              db.set(firedata).then(function() {
                console.log("aaaa");
              });
      }).catch((error) => {
        console.error("Something went wrong", error);
      });
    }

  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    console.log(this.state);

    return (
      <div>
        <h1>Request Information</h1>

        <form autoComplete="off">
            <FormControl className={classes.formControl}>
                <Grid container justify="space-around">
                    <TextField
                        id="country"
                        name="country"
                        label="Country"
                        className={classes.areaField}
                        value={this.state.country}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        type="text"
                        required="true"
                    />
                    <TextField
                        id="state"
                        name="state"
                        label="State"
                        className={classes.areaField}
                        value={this.state.state}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        type="text"
                        required="true"
                    />
                    <TextField
                        id="city"
                        name="city"
                        label="Cityname"
                        className={classes.areaField}
                        value={this.state.city}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        type="text"
                        required="true"
                    />
                </Grid>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="genre-select">Genre of information you'll require</InputLabel>
                <Select
                    required="true"
                    variant="outlined"
                    value={this.state.genre}
                    onChange={this.handleChange}
                    className={classes.genreSelector}
                    inputProps={{
                        name: 'genre',
                        id: 'genre-select',
                    }}
                >
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Restaurant">Restaurant</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Location">Location</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Club">Club</MenuItem>
                <MenuItem value="Bar">Bar</MenuItem>
                <MenuItem value="Activity">Activity</MenuItem>
                <MenuItem value="Gift">Gift</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="outlined"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="when"
                        value={this.state.when}
                        onChange={this.handleWhenChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        className={classes.cal}
                    />
                </MuiPickersUtilsProvider>
            </FormControl>

            <FormControl className={classes.formControl}>
                <TextField
                    id="title"
                    name="title"
                    label="Request title"
                    className={classes.textField}
                    value={this.state.title}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    type="text"
                    required="true"
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <TextField
                    id="detail"
                    name="detail"
                    label="Request description"
                    className={classes.textField}
                    value={this.state.detail}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    multiline="true"
                    rows="7"
                    type="text"
                    required="true"
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <Grid container justify="center">
                    <TextField
                        id="prize"
                        name="prize"
                        label="Amount of Prize (WAVES)"
                        className={classes.prize}
                        value={this.state.prize}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        type="number"
                        placeholder="WAVES"
                        disabled="true"
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        
                            <KeyboardDatePicker
                                disableToolbar
                                variant="outlined"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="dead"
                                value={this.state.dead}
                                onChange={this.handleDeadChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                className={classes.cal}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="dead"
                                value={this.state.dead}
                                onChange={this.handleDeadChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                                className={classes.cal}
                            />
                        
                    </MuiPickersUtilsProvider>
                </Grid>
            </FormControl>
        </form>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSubmit}
        >
          Save Changes
        </Button>

        <Button
          variant="contained"
          color="success"
          className={classes.button}
          onClick={this.handleDelete}
        >
          Delete Room.
        </Button>

      </div>
    );
  }
}

// Material-ui関連
RoomManage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RoomManage);