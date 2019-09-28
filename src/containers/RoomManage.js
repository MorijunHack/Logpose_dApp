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

import ProposalList from './ProposalList';

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

// import ProposalList from './ProposalList';


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
    title: {
        color: 'indigo'
    },
    areaField: {
        width: '33%',
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
    },
    genretitle: {
        marginTop: '50px',
        color: 'indigo'
    },
});

class RoomManage extends Component {

    constructor(props){
        super(props);
        let id = this.props.match.params.id;
        id = id.split('$');

        console.log(id)

        const roomKey = id[0];
        const roomer = id[1];

        console.log(roomKey)
        console.log(roomer)

        let lister = [];

        const getDatas = async () => {
            try {
                const fireProp = firebase.firestore().collection("users").doc(roomer).collection("rooms").doc(roomKey).collection("proposals")
                await fireProp.orderBy("created", "desc").get().then(function(querysnapshot){
                    querysnapshot.forEach(async function(doc){
                        lister.push(doc.data())
                    })
                })
                return lister
                
            } catch(error) {
                console.error(error);
            }
        }
        
        this.state = {
            roomKey: roomKey,
            roomer: roomer,
            datas: getDatas()
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleWhenChange = this.handleWhenChange.bind(this);
        this.handleDeadChange = this.handleDeadChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fixDatas = this.fixDatas.bind(this);
    }

    async componentWillMount(){
        const { WavesKeeper } = window;

        let user = await WavesKeeper.publicState();
        user = user.account.address;

        let datas = await accountDataByKey(this.state.roomKey + '_data', waves.dAppAddress, waves.nodeUrl);
        datas = datas.value;
        datas = JSON.parse(datas);

        let city = datas.city;
        city = city.split(' - ');

        let xs = {};

        if (datas.roomer === user) {
            const fireNow = firebase.firestore().collection("users").doc(this.state.roomer).collection("rooms").doc(this.state.roomKey)
            await fireNow.get().then(function(doc){
                xs.created_a = new Date(doc.data().created.seconds * 1000);
                xs.dead_a = new Date(doc.data().dead.seconds * 1000);
                xs.when_a = new Date(doc.data().when.seconds * 1000);
            })
            console.log(xs)

            this.setState({
                author: true,
                created: xs.created_a,
                country: city[2],
                state: city[1],
                city: city[0],
                title: datas.title,
                when: xs.when_a,
                genre: datas.genre,
                detail: datas.detail,
                prize: Number(datas.prize),
                dead: xs.dead_a,
                duration: datas.duration,
                height: datas.height
            });
        }
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
              dead: this.state.dead,
              when: this.state.when
            }

            console.log(firedata);

            const db = firebase.firestore().collection('users').doc(this.state.roomer).collection("rooms").doc(this.state.roomKey)
            db.update(firedata).then(function() {
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
          state: 'closed'
        }

        const db = firebase.firestore().collection('users').doc(this.state.roomer).collection("rooms").doc(this.state.roomKey)
              db.update(firedata).then(function() {
                console.log("aaaa");
              });
      }).catch((error) => {
        console.error("Something went wrong", error);
      });
    }

    async fixDatas(data) {
        const x = await data;
        return x;
    }

  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    console.log(this.state);

    const fixDatas = async (data) => {
        const aaa = await data;
        return aaa
    }

    return (
      <div>
        <h1 className={classes.title}>Request Information</h1>

        <form autoComplete="off">
            <FormControl className={classes.formControl}>
                <Grid container justify="space-around">
                    <TextField
                        id="country"
                        name="country"
                        placeholder="Country"
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
                        placeholder="State"
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
                        placeholder="Cityname"
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
                    placeholder="Request title"
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
                    placeholder="Request description"
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
                        placeholder="Amount of Prize (WAVES)"
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

        <h1 className={classes.genretitle}>Proposals</h1>
        <ProposalList datas={this.fixDatas(this.state.datas)} />

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