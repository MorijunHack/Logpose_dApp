// React関連
import * as React from 'react';

// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, makeStyles, createStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';

// waves関連
import * as waves from '../config/waves-config';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';

// スタイル
const styles = makeStyles((theme) => createStyles({
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
    button: {
        marginLeft: '40%',
        marginTop: '30px',
        marginBottom: '50px'
    },
    btn: {
        marginLeft: '40%'
    }
}))


const ProposalPaper = props => {
    const [state, update] = React.useState({})
    const classes = styles()

    React.useEffect(async () => {
        let data = await accountDataByKey(props.data.proposeKey + "_data", waves.dAppAddress, waves.nodeUrl);
        data = JSON.parse(data.value);

        let roomStatus = await accountDataByKey(props.data.roomKey + "_status", waves.dAppAddress, waves.nodeUrl);
        data.roomStatus = roomStatus.value;

        const proposerKey = base58Encode(sha256(stringToBytes(props.data.contributorAddress)));
        let count = await accountDataByKey(proposerKey + "_evaluateCount", waves.dAppAddress, waves.nodeUrl);
        if (count === null) {
            count = {value: 1}
        }
        let total = await accountDataByKey(proposerKey + "_evaluateTotal", waves.dAppAddress, waves.nodeUrl);
        if (total === null) {
            total = {value: 0}
        }

        const status = await accountDataByKey(props.data.proposeKey + "_status", waves.dAppAddress, waves.nodeUrl);
        data.status = status.value;

        const { WavesKeeper } = window;
        const user = await WavesKeeper.publicState();
        if (user.account.address === props.data.roomerAddress) {
            data.roomOwner = true
        } else {
            data.roomOwner = false
        }

        const evaluateKey = "evaluate_" + base58Encode(sha256(stringToBytes(props.data.proposeKey + props.data.roomKey)));
        const evaluate = await accountDataByKey(evaluateKey, waves.dAppAddress, waves.nodeUrl);
        if (evaluate !== null) {
            data.evaluate = (JSON.parse(evaluate.value)).evaluate
        }
        
        const average = (total.value / count.value).toFixed(2)
        data.average = average;

        update(data);
    }, [props.data.contributorAddress, props.data.proposeKey, props.data.roomKey, props.data.roomerAddress])

    const adoptionFunc = React.useCallback(
        async () => {
            let room = state.room;
            let propose = props.data.proposeKey;
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
                // txhashを求める
                const res = JSON.parse(tx);
                const txid = res["id"];

                const fireRoom= {
                    state: "closed", 
                }
                const roomer = props.data.roomerAddress

                const db = firebase.firestore().collection('users').doc(roomer).collection("rooms").doc(room);
                db.update(fireRoom).then(function() {
                    alert('Proposal adopted Successfully!\nTxid:  ' + txid);
                });
        
                // ステートを戻す
                update({
                    winner: true
                });
            })
        },[props.data.proposeKey, props.data.roomerAddress, state.room],
    )

    const handleChange = React.useCallback(
        (e) => {
            e.preventDefault();
            update({evaluate: e.target.value})
        },
        [],
    )

    const handleSubmit = React.useCallback(
        async () => {
            if (state.evaluate !== null) {
                const { WavesKeeper } = window;
    
                const data = {
                    propose: props.data.proposeKey,
                    room: props.data.roomKey,
                    evaluate: state.evaluate,
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
                                    {type: "string", value: props.data.proposeKey},
                                    {type: "string", value: props.data.roomKey},
                                    {type: "integer", value: state.evaluate},
                                    {type: "string", value: JSON.stringify(data)},
                                ]
                            }, payment: []
                    }
                }).then(async (tx) => {
                }).catch((error) => {
                        console.error("Something went wrong", error);
                });
            }
        },
        [props.data.proposeKey, props.data.roomKey, state.evaluate],
    )

    function renderWinner(){
        return (
            <div>
                <div className={classes.textLeft}>
                    <Paper className={classes.root} elevation={1}>
                        <Grid container justify="center">
                            <Avatar src="/images/clown.svg" className={classes.wwwAvatar} />
                            <Typography variant="headline" component="h2" className={classes.top}>
                                {state.title}
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
                                    {state.detail}
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
                                    {state.url}
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
                                    {state.average}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    {state.roomOwner &&
                        <div>
                            <FormControl component="fieldset" className={classes.evaluate}>
                            <FormLabel component="legend">Evaluate this propose</FormLabel>
                            <RadioGroup value={state.evaluate} onChange={handleChange} row>
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
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </div>
                }
                </div>
            </div>
        );
    }

    function renderPropose(){
        return (
            <div>
                <div className={classes.textLeft}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="headline" component="h2" className={classes.top}>
                            {state.title}
                        </Typography>
                        <Grid container>
                            <Grid sm="3">
                                <Typography component="h3" className={classes.paragraph_r}>
                                    <b>Description : </b>
                                </Typography>
                            </Grid>

                            <Grid sm="9">
                                <Typography component="p" className={classes.paragraph}>
                                    {state.detail}
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
                                    <a href={state.url} target="_blank" rel="noopener noreferrer">{state.url}</a>
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
                                    {state.average}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        {state.roomOwner &&
                            adoptionButton(classes)
                        }
                    </Paper>
                </div>
            </div>
        );
    }

    function adoptionButton() {
        if (state.roomStatus) {
            return (
                <Button onClick={adoptionFunc} className={classes.btn}>
                    <Avatar className={classes.wwwAvatar} src="/images/check.svg"/>
                    <b>adoption</b>
                </Button>
            )
        }
    }

    return (
        <div>
            {state.status === "adopted" ? renderWinner() : renderPropose()}
        </div>
    );

}


ProposalPaper.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles, { withTheme: true })(ProposalPaper);