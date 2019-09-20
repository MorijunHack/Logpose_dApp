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

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'

// waves-transactionsの取得
import { currentHeight } from '@waves/waves-transactions/dist/nodeInteraction';
import { Input } from '@material-ui/core';


// スタイル
const styles = theme => ({
    button: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 16,
        padding: 10,
        width: 250,
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
});

class RoomCreate extends Component {

    constructor(props){
        super(props);
        this.state = {
            roomKey: '',
            roomer: '',
            city: '',
            title: '',
            when: new Date(),
            genre: [],    
            detail: '',
            prize: 0,
            duration_d: 0,
            duration_h: 0
        };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleSubmit(e) {
        const { WavesKeeper } = window;
        const now = await currentHeight(waves.nodeUrl);
        
        const data = {
            "city": this.state.city,
            "title": this.state.title,
            "when": this.state.start + " ~ " + this.state.end,
            "genre": this.state.genre,
            "detail": this.state.detail,
            "prize": this.state.prize,
            "height": now,
            "duration": (this.state.duration_d * 1440) + (this.state.duration_h * 60)
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
                        function: 'createRoom',
                        args: [
                            {type: "string",value: data.title},
                            {type: "string", value: JSON.stringify(data)},
                            {type: "integer",value: data.height},
                            {type: "integer",value: data.duration},
                        ]
                    }, payment: [{assetId: "WAVES", tokens: this.state.prize}]
            }
        }).then(async (tx) => {
            console.log("Signiture Successfull!!");

            // txhashを求める
            const res = JSON.parse(tx);
            const txid = res["id"];
            console.log(txid);

            const sender = res["sender"];
            console.log(sender);

            console.log(res);

            // roomKeyを求める
            const getRoomKey = async () => {
                try {
                    const state = await WavesKeeper.publicState();
                    const userAddress = state.account.address;
                    const userName = state.account.name;
                    const roomer = userAddress
                    const room = base58Encode(sha256(stringToBytes(roomer + data.title + JSON.stringify(data))));
                    this.setState({
                        roomKey: 'room_' + room,
                        roomer: {address: userAddress, name: userName}
                    });
                    console.log(this.state.roomKey);
                } catch(error) {
                    console.error(error); // displaying the result in the console
                    /*... processing errors */
                }
            }
    
            await getRoomKey();

            console.log(this);
    
            // limitDateを求める
            let date = new Date();
            console.log(date);
    
            // const dd = Number(this.state.duration_d);
            date.setDate( date.getDate() + this.state.duration_d * 1 );
    
            // const dh = Number(this.state.duration_h)
            date.setHours( date.getHours() + this.state.duration_h * 1 );
    
            // firestoreに書き込む
            const firedata = {
                txHash: txid,
                roomKey: this.state.roomKey,
                roomerAddress: this.state.roomer.address,
                roomerName: this.state.roomer.name,
                city: this.state.city,
                title: this.state.title,
                when: this.state.when,
                genre: this.state.genre,
                detail: this.state.detail,
                prize: this.state.prize,
                created: new Date(),
                limit: date
            }

            console.log(firedata);

            const db = firebase.firestore().collection('users').doc(firedata.roomerAddress).collection("rooms").doc(firedata.roomKey)
            db.set(firedata).then(function() {
                alert('Room Created Successfully! Txid:  ' + txid);
            });
    
            // ステートを戻す
            this.setState({
                roomKey: '',
                roomer: '',
                city: '',
                title: '',
                when: new Date(),
                genre: [],    
                detail: '',
                prize: 0,
                duration_d: 0,
                duration_h: 0
            })
        }).catch((error) => {
                console.error("Something went wrong", error);
        });
    }

  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <h1>Room Create Form</h1>

        <form autoComplete="off">
            <FormControl className={classes.formControl}>
                <TextField
                    id="city"
                    name="city"
                    label="City name you want informations"
                    className={classes.textField}
                    value={this.state.city}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    type="text"
                    required="true"
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="genre-select">Genre of information you'll require</InputLabel>
                <Select
                    required="true"
                    variant="outlined"
                    value={this.state.genre}
                    onChange={this.handleChange}
                    className={classes.textLeft}
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
                        label="When will you use imformation?"
                        value={this.state.when}
                        name="when"
                        onChange={this.handleChange}
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
                    required="true"
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <TextField
                    id="duration_d"
                    name="duration_d"
                    label="Duration to application period (DAYS)"
                    className={classes.textField}
                    value={this.state.duration_d}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    placeholder="days"
                    required="true"
                />
            </FormControl>
        </form>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSubmit}
        >
          Create Room
        </Button>

      </div>
    );
  }
}

// Material-ui関連
RoomCreate.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RoomCreate);