import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import firebase from "firebase/app";
import 'firebase/firestore';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import config from '../config/firebase-config';

import * as waves from '../config/waves-config';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';

// スタイル
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3,
        margin: '20px auto',
        width: '70%'
    },
    evaluate: {
        marginLeft: "30%",
    },
    wwwAvatar: {
        margin: 10,
        backgroundColor: '#6c1df2',
        padding: 7,
        boxSizing: 'border-box',
    },
    top: {
        textAlign: 'center',
        marginBottom: 10,
        paddingTop: 10
    },
    textLeft: {
        textAlign: 'left',
    },
    paragraph: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30
    },
    paragraph_r: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'right'
    },
    wwwAvatar: {
        margin: 10,
        backgroundColor: '#6c1df2',
        padding: 7,
        boxSizing: 'border-box',
    },
    button: {
        marginLeft: '40%',
        marginTop: '30px',
        marginBottom: '50px'
    }
  });

class ProposalPaper extends Component {
    constructor(props){
        super(props);
        console.log(this.props.data)
        this.state = {};

        this.adoptionFunc = this.adoptionFunc.bind(this);
        this.renderWinner = this.renderWinner.bind(this);
        this.renderPropose = this.renderPropose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentWillMount(){
        let data = await accountDataByKey(this.props.data.proposeKey + "_data", waves.dAppAddress, waves.nodeUrl);
        data = JSON.parse(data.value);
        console.log(data)

        const proposerKey = base58Encode(sha256(stringToBytes(this.props.data.contributorAddress)));
        let count = await accountDataByKey(proposerKey + "_evaluateCount", waves.dAppAddress, waves.nodeUrl);
        if (count === null) {
            count = {value: 1}
        }
        let total = await accountDataByKey(proposerKey + "_evaluateTotal", waves.dAppAddress, waves.nodeUrl);
        if (total === null) {
            total = {value: 0}
        }

        const status = await accountDataByKey(this.props.data.proposeKey + "_status", waves.dAppAddress, waves.nodeUrl);
        data.status = status.value;

        const { WavesKeeper } = window;
        const user = await WavesKeeper.publicState();
        if (user.account.address === this.props.data.roomerAddress) {
            data.roomOwner = true
        } else {
            data.roomOwner = false
        }

        const evaluateKey = "evaluate_" + base58Encode(sha256(stringToBytes(this.props.data.proposeKey + this.props.data.roomKey)));
        const evaluate = await accountDataByKey(evaluateKey, waves.dAppAddress, waves.nodeUrl);
        if (evaluate !== null) {
            data.evaluate = (JSON.parse(evaluate.value)).evaluate
        }

        const average = (total.value / count.value).toFixed(2)

        data.average = average;

        console.log(data);

        this.setState(data);

        console.log(this.state)
    }

    async adoptionFunc() {
        let room = this.state.room;
        let propose = this.props.data.proposeKey;
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
                        function: 'createAdoption',
                        args: [
                            {type: "string", value: room},
                            {type: "string", value: propose},
                        ]
                    }, payment: []
            }
        }).then(async (tx) => {
            console.log("Signiture Successfull!!");

            // txhashを求める
            const res = JSON.parse(tx);
            const txid = res["id"];
            console.log(txid);

            // // adoptionKeyを求める
            // const adoptionKey = "adoption_" + base58Encode(sha256(stringToBytes(room + propose)));

            // const firedata= {
            //     status: "adopted",
            //     winner: this.props.data.contributorAddress, 
            // }

            const fireRoom= {
                state: "closed", 
            }

            const roomer = this.props.data.roomerAddress

            const db = firebase.firestore().collection('users').doc(roomer).collection("rooms").doc(room);
            db.update(fireRoom).then(function() {
                alert('Proposal adopted Successfully! Txid:  ' + txid);
            });
    
            // ステートを戻す
            this.setState({
                winner: true
            });
            console.log(this.state);
        }).catch((error) => {
                console.error("Something went wrong", error);
        });
    }

    handleChange(e){
        e.preventDefault();
        this.setState({evaluate: e.target.value})
    }

    async handleSubmit(){
        if (this.state.evaluate !== null) {
            const { WavesKeeper } = window;

            const data = {
                propose: this.props.data.proposeKey,
                room: this.props.data.roomKey,
                evaluate: this.state.evaluate,
                created: new Date()
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
                            function: 'evaluateProposer',
                            args: [
                                {type: "string", value: this.props.data.proposeKey},
                                {type: "string", value: this.props.data.roomKey},
                                {type: "integer", value: this.state.evaluate},
                                {type: "string", value: JSON.stringify(data)},
                            ]
                        }, payment: []
                }
            }).then(async (tx) => {
                console.log("Signiture Successfull!!");
            }).catch((error) => {
                    console.error("Something went wrong", error);
            });
        }
    }

    renderWinner(classes){
        return (
            <div>
                <div className={classes.textLeft}>
                    <Paper className={classes.root} elevation={1}>
                        <Grid container justify="center">
                            <Avatar src="/images/clown.svg" className={classes.wwwAvatar} />
                            <Typography variant="headline" component="h2" className={classes.top}>
                                {this.state.title}
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>Description : </b>
                                </Typography>
                            </Grid>

                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    {this.state.detail}
                                </Typography>
                            </Grid>
                        </Grid>
                    
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>URL : </b>
                                </Typography>
                            </Grid>
                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    {this.state.url}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>evaluation of proposer : </b>
                                </Typography>
                            </Grid>
                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    {this.state.average}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    {this.state.roomOwner &&
                        <div>
                            <FormControl component="fieldset" className={classes.evaluate}>
                            <FormLabel component="legend">Evaluate this propose</FormLabel>
                            <RadioGroup value={this.state.evaluate} onChange={this.handleChange} row>
                                <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" />}
                                    label="1"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio color="primary" />}
                                    label="2"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value="3"
                                    control={<Radio color="primary" />}
                                    label="3"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value="4"
                                    control={<Radio color="primary" />}
                                    label="4"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value="5"
                                    control={<Radio color="primary" />}
                                    label="5"
                                    labelPlacement="top"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </div>
                }
                </div>
            </div>
        );
    }

    renderPropose(classes){
        return (
            <div>
                <div className={classes.textLeft}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="headline" component="h2" className={classes.top}>
                            {this.state.title}
                        </Typography>
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>Description : </b>
                                </Typography>
                            </Grid>

                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    {this.state.detail}
                                </Typography>
                            </Grid>
                        </Grid>
                    
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>URL : </b>
                                </Typography>
                            </Grid>
                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    <a href={this.state.url} target="_blank">{this.state.url}</a>
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>evaluation of proposer : </b>
                                </Typography>
                            </Grid>
                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    {this.state.average}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        {this.state.roomOwner &&
                            <Button onClick={this.adoptionFunc} className={classes.button}>
                                <Avatar className={classes.wwwAvatar} src="/images/check.svg"/>
                                <b>adoption</b>
                            </Button>
                        }
                    </Paper>
                </div>
            </div>
        );
    }

    render() {

        // Material-ui関連
        const { classes } = this.props;

        console.log(this.state);
        console.log(this.props.data);

        let n = 0;

        return (
            <div>
                {this.state.status === "adopted" ? this.renderWinner(classes) : this.renderPropose(classes)}
            </div>
        );
    }
}

ProposalPaper.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles, { withTheme: true })(ProposalPaper);