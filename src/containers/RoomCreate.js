// React関連
import React, { Component } from 'react';

// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';

// waves関連
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'
import * as waves from '../config/waves-config';
import { currentHeight } from '@waves/waves-transactions/dist/nodeInteraction';


// スタイル
const styles = theme => ({
    button: {
        marginTop: 30,
        marginBottom: 20,
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

class RoomCreate extends Component {

    constructor(props){
        super(props);
        this.state = {
            roomKey: '',
            roomer: '',
            country: '',
            state: '',
            city: '',
            title: '',
            when: new Date(),
            genre: [],    
            detail: '',
            prize: 0,
            dead: new Date()
        };
      this.handleChange = this.handleChange.bind(this);
      this.handleWhenChange = this.handleWhenChange.bind(this);      
      this.handleDeadChange = this.handleDeadChange.bind(this);      
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleWhenChange(e) {
        this.setState({
            when: e
        });
    }

    handleDeadChange(e){
        this.setState({
            dead: e
        })
    }

    async handleSubmit(e) {
        const { WavesKeeper } = window;
        const now = await currentHeight(waves.nodeUrl);

        const dd = this.state.dead;
        const n = new Date();

        const duration = Math.floor((dd.getTime() - n.getTime()) / 60000);

        const state = await WavesKeeper.publicState();
        const userAddress = state.account.address;
        const userName = state.account.name;
        const roomer = userAddress
        
        const data = {
            "roomer": userAddress,
            "roomerName": userName,
            "city": this.state.city + ' - ' + this.state.state + ' - ' + this.state.country,
            "title": this.state.title,
            "when": this.state.when,
            "genre": this.state.genre,
            "detail": this.state.detail,
            "prize": this.state.prize,
            "dead": this.state.dead,
            "height": now,
            "duration": duration,
            "created": new Date()
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
            // txhashを求める
            const res = JSON.parse(tx);
            const txid = res["id"];

            const room = base58Encode(sha256(stringToBytes(roomer + data.title + JSON.stringify(data))));
    
            // firestoreに書き込む
            const firedata = {
                txHash: txid,
                roomKey: "room_" + room,
                roomerAddress: data.roomer,
                created: new Date(),
                dead: this.state.dead,
                state: 'opened',
                when: this.state.when
            }

            const db = firebase.firestore().collection('users').doc(firedata.roomerAddress).collection("rooms").doc(firedata.roomKey)
            db.set(firedata).then(function() {
                alert('Room Created Successfully!\nTxid:  ' + txid);
            });
    
            // ステートを戻す
            this.setState({
                roomKey: '',
                roomer: '',
                country: '',
                state: '',
                city: '',
                title: '',
                when: new Date(),
                genre: [],    
                detail: '',
                prize: 0,
                duration_d: 0,
            });
        }).catch((error) => {
                console.error("Something went wrong", error);
        });
    }

  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <h1>Request Create Form</h1>

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
                        label="Date to use this info"
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
                        required="true"
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        
                            <KeyboardDatePicker
                                disableToolbar
                                variant="outlined"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="dead"
                                label="Deadline"
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
                                label="Deadline"
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