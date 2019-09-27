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
    }
});

class RoomManage extends Component {

    constructor(props){
        super(props);

        const { WavesKeeper } = window;
        let lister = [];

        const getDatas = async () => {
            try {
                const user = await WavesKeeper.publicState();
                const fireProp = firebase.firestore().collection("users").doc(user.account.address).collection("proposals");
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
            datas: getDatas()
        }
        
    }
  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    console.log(this.state);

    return (
      <div>
        <h1 className={classes.title}>MyProposals</h1>

        <ProposalList datas={this.state.datas} />

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